import Voyage from '../../../../../models/Voyage'; // Model rejsu
import Ship from '../../../../../models/Ship'; // Model statku
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    // Sprawdź, czy params istnieje
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'Voyage ID is required' },
        { status: 400 }
      );
    }

    // Pobierz dane z żądania
    const updatedData = await req.json();

    // Sprawdź, czy `ship` został przekazany
    if (!updatedData.ship) {
      return NextResponse.json(
        { message: 'Ship ID is required' },
        { status: 400 }
      );
    }

    // Pobierz szczegóły statku na podstawie ID
    const ship = await Ship.findById(updatedData.ship);

    if (!ship) {
      return NextResponse.json(
        { message: 'Ship not found' },
        { status: 404 }
      );
    }

    // Zaktualizuj dane rejsu z nowymi wartościami z modelu statku
    const updatedVoyage = await Voyage.findByIdAndUpdate(
      id,
      {
        ...updatedData,
        pricePerContainer: ship.pricePerContainer,
        availableContainers: ship.capacity,
      },
      {
        new: true, // Zwróć zaktualizowany dokument
        runValidators: true, // Weryfikuj dane zgodnie z modelem
      }
    ).populate('ship', 'name capacity pricePerContainer');

    // Jeśli rejs nie istnieje, zwróć 404
    if (!updatedVoyage) {
      return NextResponse.json(
        { message: 'Voyage not found' },
        { status: 404 }
      );
    }

    // Zwróć zaktualizowane dane rejsu
    return NextResponse.json({
      message: 'Voyage updated successfully',
      voyage: {
        id: updatedVoyage._id,
        shipName: updatedVoyage.ship.name,
        shipCapacity: updatedVoyage.ship.capacity,
        shipPricePerContainer: updatedVoyage.ship.pricePerContainer,
        departurePort: updatedVoyage.departurePort,
        arrivalPort: updatedVoyage.arrivalPort,
        departureDate: updatedVoyage.departureDate,
        arrivalDate: updatedVoyage.arrivalDate,
        availableContainers: updatedVoyage.availableContainers,
        pricePerContainer: updatedVoyage.pricePerContainer,
      },
    });
  } catch (error) {
    console.error('Error updating voyage:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
