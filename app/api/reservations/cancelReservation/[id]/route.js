import Reservation from '../../../../../models/Reservation';
import Voyage from '../../../../../models/Voyage';
import verifyToken from '../../../middleware/verifyToken';

export async function DELETE(req, context) {
  try {
    const { error, user, response } = await verifyToken(req);
    if (error) return response;

    // Pobranie ID rezerwacji poprawnym sposobem w Next.js
    const { id } = context.params;

    console.log(`User ID from token: ${user.userId}`);
    console.log(`Cancelling reservation ID: ${id}`);

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return new Response(JSON.stringify({ message: 'Reservation not found' }), {
        status: 404,
      });
    }

    // Sprawdzenie, czy użytkownik jest właścicielem rezerwacji
    if (reservation.userId.toString() !== user.userId) {
      console.log(`Unauthorized attempt to cancel reservation by user ${user.userId}`);
      return new Response(
        JSON.stringify({ message: 'You are not authorized to cancel this reservation' }),
        { status: 403 }
      );
    }

    // Sprawdzenie, czy rezerwacja już została anulowana
    if (reservation.status === 'Cancelled') {
      return new Response(
        JSON.stringify({ message: 'Reservation is already cancelled' }),
        { status: 400 }
      );
    }

    // Znalezienie podróży i zwrot kontenerów
    const voyage = await Voyage.findById(reservation.voyage);
    if (!voyage) {
      return new Response(JSON.stringify({ message: 'Voyage not found' }), {
        status: 404,
      });
    }

    voyage.availableContainers += reservation.reservedContainers;
    await voyage.save();

    // Obliczanie kwoty zwrotu (60% dla zaakceptowanych, 66.66% dla oczekujących)
    const refundRate = reservation.status === 'Pending' ? 2 / 3 : 0.6;
    const refundAmount = reservation.totalPrice * refundRate;

    // Aktualizacja rezerwacji
    reservation.status = 'Cancelled';
    reservation.isCancelled = true;

    // Jeśli `refundAmount` nie istnieje w schemacie, dodaj go
    if (!reservation.refundAmount) {
      reservation.refundAmount = refundAmount;
      reservation.markModified('refundAmount'); // Oznaczenie pola jako zmodyfikowanego
    }

    await reservation.save();

    console.log(`Reservation ${id} cancelled. Refund: ${refundAmount}`);

    return new Response(
      JSON.stringify({
        message: 'Reservation cancelled successfully',
        refundAmount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling reservation:', error);

    if (error.name === 'ValidationError') {
      return new Response(
        JSON.stringify({
          message: 'Reservation validation failed',
          errors: error.errors,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
