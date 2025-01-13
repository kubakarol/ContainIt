import { NextResponse } from 'next/server';
import verifyToken from '../../middleware/verifyToken';
import Reservation from '../../../../models/Reservation';
import Voyage from '../../../../models/Voyage';

export async function PUT(req) {
  try {
    // Weryfikacja tokenu użytkownika (musi być adminem)
    const { error, user, response } = await verifyToken(req, true);
    if (error) return response;

    console.log('Authenticated admin:', user);

    // Pobranie danych z requestu
    const { reservationId, status, comment } = await req.json();

    // Walidacja danych wejściowych
    if (!reservationId || !['Approved', 'Rejected'].includes(status)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid reservation ID or status' }),
        { status: 400 }
      );
    }

    // Pobranie rezerwacji z bazy danych
    const reservation = await Reservation.findById(reservationId).populate('voyage');
    if (!reservation) {
      return new NextResponse(
        JSON.stringify({ message: 'Reservation not found' }),
        { status: 404 }
      );
    }

    // Jeśli rezerwacja ma już status inny niż "pending", nie można jej zmienić
    if (reservation.status !== 'Pending') {
      return new NextResponse(
        JSON.stringify({ message: 'Reservation has already been processed' }),
        { status: 400 }
      );
    }

    // Pobranie rejsu powiązanego z rezerwacją
    const voyage = reservation.voyage;

    if (!voyage) {
      return new NextResponse(
        JSON.stringify({ message: 'Associated voyage not found' }),
        { status: 404 }
      );
    }

    // Jeśli status to "rejected", zwracamy kontenery do dostępnej puli
    if (status === 'Rejected') {
      voyage.availableContainers += reservation.reservedContainers;
      await voyage.save();

      if (comment) {
        reservation.comment = comment; // Dodanie komentarza w przypadku odrzucenia
      }
    }

    // Aktualizacja statusu rezerwacji
    reservation.status = status;
    await reservation.save();

    return new NextResponse(
      JSON.stringify({
        message: `Reservation ${status === 'Approved' ? 'Approved' : 'Rejected'}`,
        reservation,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing reservation:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
