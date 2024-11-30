import verifyToken from '../../middleware/verifyToken';
import Voyage from '../../../../models/Voyage';
import Ship from '../../../../models/Ship';

export async function POST(req) {
  try {
    // Weryfikacja tokena oraz roli użytkownika (tylko admin może tworzyć rejsy)
    const tokenVerificationResult = await verifyToken(req, true); // Sprawdzamy token i rolę admina
    if (tokenVerificationResult) {
      return new Response(JSON.stringify({ message: 'Access Denied: Admins only' }), { status: 403 });
    }

    // Odczytujemy dane z requesta
    const { shipId, departurePort, arrivalPort, departureDate, arrivalDate } = await req.json();

    // Walidacja, czy wszystkie wymagane dane są obecne
    if (!shipId || !departurePort || !arrivalPort || !departureDate || !arrivalDate) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Szukamy statku w bazie danych po shipId
    const ship = await Ship.findById(shipId);
    if (!ship) {
      return new Response(JSON.stringify({ message: 'Ship not found' }), { status: 404 });
    }

    // Pobieramy informacje o statku
    const { name: shipName, pricePerContainer, capacity: availableContainers } = ship;

    // Tworzymy nowy rejs
    const voyage = new Voyage({
      ship: shipId,         // ID statku
      shipName,             // Nazwa statku
      departurePort,
      arrivalPort,
      departureDate,
      arrivalDate,
      pricePerContainer,    
      availableContainers,  
    });

    // Zapisujemy rejs w bazie danych
    await voyage.save();

    // Zwracamy odpowiedź z danymi o nowym rejsie
    return new Response(JSON.stringify({ message: 'Voyage created successfully', voyage }), { status: 201 });

  } catch (error) {
    console.error('Error creating voyage:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}
