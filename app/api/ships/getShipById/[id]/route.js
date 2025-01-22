import verifyToken from '../../../middleware/verifyToken';
import Ship from '../../../../../models/Ship';

// Obsługuje metodę GET - pobieranie statku po ID
export async function GET(req, context) {
  try {
    // Sprawdzanie tokenu i roli użytkownika
    const { error, user, response } = await verifyToken(req, true); // True oznacza, że wymagana jest rola admina
    if (error) return response; // Jeśli token jest nieprawidłowy lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    const { id } = await context.params; // Pobieranie ID z dynamicznego parametru w sposób asynchroniczny
    console.log('Looking for ship with ID:', id);

    // Weryfikacja formatu ID
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

    // Zwracanie znalezionego statku
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
