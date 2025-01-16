import Voyage from '../../../../../models/Voyage'; // Model rejsu
import Ship from '../../../../../models/Ship'

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Pobierz rejs na podstawie ID, w tym szczegóły statku
    const voyage = await Voyage.findById(id)
      .populate('ship', 'name capacity pricePerContainer');

    // Jeśli rejs nie istnieje, zwróć 404
    if (!voyage) {
      return new Response(
        JSON.stringify({ message: 'Voyage not found' }),
        { status: 404 }
      );
    }

    // Zwróć szczegóły rejsu
    return new Response(
      JSON.stringify({
        id: voyage._id,
        shipName: voyage.ship.name,
        shipCapacity: voyage.ship.capacity,
        shipPricePerContainer: voyage.ship.pricePerContainer,
        departurePort: voyage.departurePort,
        arrivalPort: voyage.arrivalPort,
        departureDate: voyage.departureDate,
        arrivalDate: voyage.arrivalDate,
        availableContainers: voyage.availableContainers,
        pricePerContainer: voyage.pricePerContainer,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching voyage:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
