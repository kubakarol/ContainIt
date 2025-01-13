import Reservation from '../../../../models/Reservation';
import Ship from '../../../../models/Ship';
import verifyToken from '../../middleware/verifyToken';

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true); // Admin-only
  if (error) return response;

  try {
    const ships = await Ship.find(); // Pobieranie listy statków
    const revenueData = [];

    for (const ship of ships) {
      const revenue = await Reservation.aggregate([
        { $match: { shipName: ship.name, status: 'Approved' } }, // Rezerwacje zatwierdzone dla danego statku
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
      ]);

      revenueData.push({
        shipName: ship.name,
        totalRevenue: revenue[0]?.totalRevenue || 0, // Jeśli brak rezerwacji, zwraca 0
      });
    }

    return new Response(
      JSON.stringify({ revenueData }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error calculating ship revenue:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
