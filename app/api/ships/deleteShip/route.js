import verifyToken from '../../middleware/verifyToken';
import Ship from '../../../../models/Ship';

export const DELETE = async (req) => {
  try {
    // Sprawdzanie tokenu
    const { error, user, response } = await verifyToken(req, true); // True oznacza, że wymagana jest rola admina
    if (error) return response; // Jeśli token nieprawidłowy lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    // Pobranie ID statku z ciała zapytania
    const { id } = await req.json();
    console.log('Received ship ID:', id);

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid or missing ship ID' }),
        { status: 400 }
      );
    }

    // Próba usunięcia statku
    const ship = await Ship.findByIdAndDelete(id);

    if (!ship) {
      return new Response(
        JSON.stringify({ message: 'Ship not found' }),
        { status: 404 }
      );
    }

    console.log('Ship deleted:', ship); // Logowanie usuniętego statku

    return new Response(
      JSON.stringify({ message: 'Ship deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting ship:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
};
