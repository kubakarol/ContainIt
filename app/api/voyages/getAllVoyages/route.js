import Voyage from '../../../../models/Voyage'; // Model rejsu

export async function GET(req) {
  try {
    // Pobierz wszystkie rejsy z bazy danych, w tym dane statku (połączenie z modelem Ship)
    const voyages = await Voyage.find()
      .populate('ship', 'name capacity pricePerContainer'); // Populuj dane statku (name, capacity, pricePerContainer)

    // Jeśli nie ma rejsów, zwróć odpowiednią informację
    if (!voyages || voyages.length === 0) {
      return new Response(JSON.stringify({ message: 'No voyages found' }), { status: 404 });
    }

    // Zwróć dane o rejsach
    return new Response(
      JSON.stringify({
        voyages: voyages.map((voyage) => ({
          shipName: voyage.ship.name, // Nazwa statku
          shipCapacity: voyage.ship.capacity, // Pojemność statku
          shipPricePerContainer: voyage.ship.pricePerContainer, // Cena za kontener
          departurePort: voyage.departurePort,
          arrivalPort: voyage.arrivalPort,
          departureDate: voyage.departureDate,
          arrivalDate: voyage.arrivalDate,
          availableContainers: voyage.availableContainers,
          pricePerContainer: voyage.pricePerContainer,
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching voyages:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
