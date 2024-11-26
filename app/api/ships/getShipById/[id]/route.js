import verifyToken from '../../../middleware/verifyToken';
import Ship from '../../../../../models/Ship';

// Obsługuje metodę GET - pobieranie statku po ID
export async function GET(req, { params }) {
  // Sprawdzanie tokenu
  const tokenVerification = await verifyToken(req, true); // True oznacza, że wymagana jest rola admina
  if (tokenVerification) {
    return tokenVerification; // Jeśli token nieprawidłowy lub użytkownik nie jest adminem
  }

  const { id } = params; // Pobieramy ID z dynamicznego parametru

  console.log('Looking for ship with ID:', id); // Dodajemy logowanie, aby sprawdzić ID

  try {
    // Weryfikacja, czy ID jest prawidłowym formatem ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID format' }),
        { status: 400 }
      );
    }

    // Wyszukiwanie statku po ID
    const ship = await Ship.findById(id);

    if (!ship) {
      return new Response(
        JSON.stringify({ message: 'Ship not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ ship }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ship by ID:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}