import Voyage from '../../../../../models/Voyage';

export async function GET(req, { params }) {
  try {
    // Czekaj na odczytanie właściwości params
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ message: 'Voyage ID is required' }), {
        status: 400,
      });
    }

    const voyage = await Voyage.findById(id).populate('ship');
    if (!voyage) {
      return new Response(JSON.stringify({ message: 'Voyage not found' }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        id: voyage._id,
        ship: voyage.ship,
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
