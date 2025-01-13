import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Voyage from '../../../../models/Voyage';
import Reservation from '../../../../models/Reservation';
import verifyToken from '../../middleware/verifyToken';

export async function POST(req) {
  try {
    const { error, user, response } = await verifyToken(req);
    if (error) return response;

    console.log('Authenticated user:', user);

    const { voyageId, reservedContainers } = await req.json();

    // Walidacja danych wejściowych
    if (!voyageId || !mongoose.Types.ObjectId.isValid(voyageId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid voyage ID' }),
        { status: 400 }
      );
    }

    if (!reservedContainers || reservedContainers <= 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid number of reserved containers' }),
        { status: 400 }
      );
    }

    // Pobranie danych rejsu
    const voyage = await Voyage.findById(voyageId);
    if (!voyage) {
      return new NextResponse(
        JSON.stringify({ message: 'Voyage not found' }),
        { status: 404 }
      );
    }

    console.log('Voyage found:', voyage);

    // Sprawdzenie dostępności kontenerów
    if (voyage.availableContainers < reservedContainers) {
      return new NextResponse(
        JSON.stringify({
          message: `Not enough available containers. Only ${voyage.availableContainers} are available.`,
        }),
        { status: 400 }
      );
    }

    // Obliczenie ceny rezerwacji
    const totalPrice = reservedContainers * voyage.pricePerContainer;

    console.log(`Total price for reservation: ${totalPrice}`);

    // Tworzenie nowej rezerwacji
    const reservation = new Reservation({
      voyage: voyageId,
      shipName: voyage.shipName,
      userId: user.userId,
      username: user.username,
      reservedContainers,
      status: 'pending',
      totalPrice, // Dodano pole totalPrice
    });

    // Zapisanie rezerwacji w bazie danych
    await reservation.save();

    // Aktualizacja liczby dostępnych kontenerów w rejsie
    voyage.availableContainers -= reservedContainers;
    await voyage.save();

    return new NextResponse(
      JSON.stringify({
        message: 'Reservation created successfully',
        reservation: {
          id: reservation._id,
          voyageId: reservation.voyage,
          username: reservation.username,
          reservedContainers: reservation.reservedContainers,
          totalPrice, // Zwracanie ceny w odpowiedzi
          status: reservation.status,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
