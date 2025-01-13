import verifyToken from '../../middleware/verifyToken';
import Voyage from '../../../../models/Voyage';
import Ship from '../../../../models/Ship';

export async function POST(req) {
  try {
    // Weryfikacja tokenu użytkownika
    const { error, user, response } = await verifyToken(req, true); // Sprawdzamy token i rolę admina
    if (error) return response; // Zwróć odpowiedź błędu, jeśli token jest nieważny lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    // Pobranie danych z requesta
    const { shipId, departurePort, arrivalPort, departureDate, arrivalDate } = await req.json();

    // Walidacja danych wejściowych
    if (!shipId || !departurePort || !arrivalPort || !departureDate || !arrivalDate) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Pobranie statku z bazy danych
    const ship = await Ship.findById(shipId);
    if (!ship) {
      return new Response(JSON.stringify({ message: 'Ship not found' }), { status: 404 });
    }

    const { name: shipName, pricePerContainer, capacity: availableContainers } = ship;

    // Tworzenie rejsu
    const voyage = new Voyage({
      ship: shipId,
      shipName,
      departurePort,
      arrivalPort,
      departureDate,
      arrivalDate,
      pricePerContainer,
      availableContainers,
    });

    // Zapisanie rejsu w bazie danych
    await voyage.save();

    return new Response(
      JSON.stringify({ message: 'Voyage created successfully', voyage }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating voyage:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
