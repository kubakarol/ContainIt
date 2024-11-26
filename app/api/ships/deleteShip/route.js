import verifyToken from '../../middleware/verifyToken';
import Ship from '../../../../models/Ship';

export const DELETE = async (req) => {
  // Sprawdzanie tokenu
  const tokenVerification = await verifyToken(req, true); // True oznacza, że wymagana jest rola admina
  if (tokenVerification) {
    return tokenVerification; // Jeśli token nieprawidłowy lub użytkownik nie jest adminem
  }

  try {
    const { id } = await req.json(); // Oczekujemy id statku w ciele zapytania
    console.log('Received ship ID:', id); // Dodajemy logowanie ID

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid or missing ship id' }),
        { status: 400 }
      );
    }

    // Próbujemy znaleźć i usunąć statek
    const ship = await Ship.findByIdAndDelete(id);

    if (!ship) {
      return new Response(
        JSON.stringify({ message: 'Ship not found' }),
        { status: 404 }
      );
    }

    //console.log('Ship deleted:', ship); // Logowanie usuniętego statku

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
