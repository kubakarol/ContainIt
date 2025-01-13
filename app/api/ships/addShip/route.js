import verifyToken from '../../middleware/verifyToken';
import Ship from '../../../../models/Ship';

// Obsługuje metodę POST - dodawanie statku
export const POST = async (req) => {
  try {
    // Weryfikacja tokenu, sprawdzanie, czy użytkownik jest administratorem
    const { error, user, response } = await verifyToken(req, true);
    if (error) return response; // Jeśli token nieprawidłowy lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    const { name, capacity, pricePerContainer } = await req.json();

    // Tworzenie nowego statku
    const newShip = new Ship({
      name,
      capacity,
      pricePerContainer,
    });

    // Zapisanie statku w bazie danych
    await newShip.save();

    // Odpowiedź
    return new Response(
      JSON.stringify({ message: 'Ship added successfully', ship: newShip }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding ship:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
};
