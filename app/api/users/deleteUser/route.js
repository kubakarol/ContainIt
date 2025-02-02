import verifyToken from '../../middleware/verifyToken'; // Middleware do weryfikacji tokenu
import User from '../../../../models/User'; // Model użytkownika

export const DELETE = async (req) => {
  try {
    // Weryfikacja tokenu i sprawdzenie, czy użytkownik jest adminem
    const { error, user, response } = await verifyToken(req, true); // Drugi parametr 'true' oznacza wymóg roli admina
    if (error) return response; // Jeśli token jest nieprawidłowy lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    // Pobranie ID użytkownika z ciała żądania
    const { id } = await req.json();
    console.log('ID użytkownika do usunięcia:', id);

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400 }
      );
    }

    // Próba usunięcia użytkownika z bazy danych
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    console.log('User deleted successfully:', deletedUser);

    // Zwrócenie odpowiedzi sukcesu
    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
};
