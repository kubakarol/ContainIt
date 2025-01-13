import Reservation from '../../../../models/Reservation';
import Voyage from '../../../../models/Voyage';
import verifyToken from '../../middleware/verifyToken';

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true); // Admin-only
  if (error) return response;

  try {
    const popularRoutes = await Reservation.aggregate([
      {
        $lookup: {
          from: 'voyages',
          localField: 'voyage',
          foreignField: '_id',
          as: 'voyageDetails',
        },
      },
      { $unwind: '$voyageDetails' }, // Rozwijanie danych rejsów
      {
        $group: {
          _id: {
            departurePort: '$voyageDetails.departurePort',
            arrivalPort: '$voyageDetails.arrivalPort',
          },
          totalReservations: { $sum: 1 },
        },
      },
      { $sort: { totalReservations: -1 } }, // Sortowanie od najpopularniejszych
    ]);

    return new Response(
      JSON.stringify({ popularRoutes }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
