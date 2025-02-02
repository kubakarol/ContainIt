import Reservation from "../../../../models/Reservation";
import verifyToken from "../../middleware/verifyToken";
import { startOfMonth, endOfMonth, format } from "date-fns";

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true);
  if (error) return response;

  try {
    const reservationsPerMonth = await Reservation.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalReservations: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, 
    ]);

    return new Response(
      JSON.stringify({ reservationsPerMonth }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reservations per month:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
