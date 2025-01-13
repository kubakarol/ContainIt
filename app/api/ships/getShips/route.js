import verifyToken from '../../middleware/verifyToken';
import Ship from '../../../../models/Ship';

// Obsługuje metodę GET - pobieranie wszystkich statków
export const GET = async (req) => {
  try {
    // Sprawdzanie tokenu
    const { error, user, response } = await verifyToken(req, true); // True oznacza, że wymagana jest rola admina
    if (error) return response; // Jeśli token nieprawidłowy lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    // Pobieranie wszystkich statków z bazy danych
    const ships = await Ship.find();

    if (!ships || ships.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No ships found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ ships }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ships:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
};
