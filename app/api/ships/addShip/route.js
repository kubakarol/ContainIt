import verifyToken from '../../middleware/verifyToken';
import Ship from '../../../../models/Ship';

// Obsługuje metodę POST - dodawanie statku
export const POST = async (req) => {
  // Weryfikacja tokenu, sprawdzanie, czy użytkownik jest administratorem
  const tokenVerification = await verifyToken(req, true);
  if (tokenVerification) {
    return tokenVerification; // Jeśli token nieprawidłowy lub użytkownik nie jest adminem
  }

  const { name, capacity, pricePerContainer } = await req.json();

  try {
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
