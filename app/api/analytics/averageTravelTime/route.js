import Reservation from "../../../../models/Reservation";
import Voyage from "../../../../models/Voyage";
import verifyToken from "../../middleware/verifyToken";

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true);
  if (error) return response;

  try {
    const travelTimes = await Voyage.aggregate([
      {
        $project: {
          departurePort: 1,
          arrivalPort: 1,
          travelTime: { $subtract: ["$arrivalDate", "$departureDate"] }
        },
      },
      {
        $group: {
          _id: { departurePort: "$departurePort", arrivalPort: "$arrivalPort" },
          avgTravelTime: { $avg: "$travelTime" },
        },
      },
      { $sort: { avgTravelTime: -1 } }
    ]);

    return new Response(
      JSON.stringify({ travelTimes }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching average travel time:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
