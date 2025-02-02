import Reservation from "../../../../models/Reservation";
import verifyToken from "../../middleware/verifyToken";

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true);
  if (error) return response;

  try {
    const topCustomers = await Reservation.aggregate([
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }, 
    ]);

    return new Response(
      JSON.stringify({ topCustomers }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching top customers:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
