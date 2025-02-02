import Reservation from "../../../../models/Reservation";
import verifyToken from "../../middleware/verifyToken";

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true);
  if (error) return response;

  try {
    const result = await Reservation.aggregate([
      {
        $match: { status: "Approved" }
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$totalPrice" },
        },
      },
    ]);

    const avgPrice = result.length > 0 ? result[0].avgPrice : 0;

    return new Response(
      JSON.stringify({ avgPrice }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching average reservation price:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
