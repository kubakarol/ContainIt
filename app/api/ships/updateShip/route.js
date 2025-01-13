import { NextResponse } from 'next/server';
import Ship from '../../../../models/Ship';
import verifyToken from '../../middleware/verifyToken';
import mongoose from 'mongoose';

export const PUT = async (req) => {
  try {
    // Sprawdzenie tokenu i upewnienie się, że użytkownik jest adminem
    const { error, user, response } = await verifyToken(req, true); // Wymaga admina
    if (error) return response; // Jeśli token jest nieważny lub użytkownik nie jest adminem

    console.log('Authenticated admin:', user);

    // Pobranie danych z requestu
    const { id, name, capacity, pricePerContainer } = await req.json();

    // Walidacja danych wejściowych
    if (!id || !name || !capacity || !pricePerContainer) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Sprawdzanie poprawności ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid ship id' }),
        { status: 400 }
      );
    }

    // Szukanie statku po ID
    const ship = await Ship.findById(id);

    if (!ship) {
      return new NextResponse(
        JSON.stringify({ message: 'Ship not found' }),
        { status: 404 }
      );
    }

    // Aktualizowanie statku
    ship.name = name;
    ship.capacity = capacity;
    ship.pricePerContainer = pricePerContainer;

    // Zapisanie zmian
    await ship.save();

    // Zwrócenie zaktualizowanego statku
    return new NextResponse(
      JSON.stringify({ message: 'Ship updated successfully', ship }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating ship:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
};
