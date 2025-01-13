import { NextResponse } from 'next/server';
import verifyToken from '../../middleware/verifyToken';
import Reservation from '../../../../models/Reservation';
import Voyage from '../../../../models/Voyage';

export async function GET(req) {
  try {
    // Weryfikacja tokenu użytkownika
    const { error, user, response } = await verifyToken(req);
    if (error) return response; // Jeśli token jest nieważny, zwróć odpowiedź błędu

    console.log('Authenticated user:', user);

    // Pobranie rezerwacji użytkownika z bazy danych
    const reservations = await Reservation.find({ userId: user.userId }).populate('voyage', 'shipName departurePort arrivalPort');

    if (!reservations || reservations.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: 'No reservations found for this user' }),
        { status: 404 }
      );
    }

    // Przygotowanie danych rezerwacji do zwrócenia
    const formattedReservations = reservations.map((reservation) => ({
      id: reservation._id,
      reservationId: reservation.reservationId, // Jeśli dodano reservationId w modelu
      voyage: {
        shipName: reservation.voyage?.shipName || 'Unknown',
        departurePort: reservation.voyage?.departurePort || 'Unknown',
        arrivalPort: reservation.voyage?.arrivalPort || 'Unknown',
      },
      reservedContainers: reservation.reservedContainers,
      totalPrice: reservation.totalPrice || 0, // Jeśli obsługujemy totalPrice
      status: reservation.status,
      createdAt: reservation.createdAt,
    }));

    return new NextResponse(
      JSON.stringify({ reservations: formattedReservations }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
