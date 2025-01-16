import { NextResponse } from 'next/server';
import Voyage from '../../../../../models/Voyage';
import verifyToken from '../../../middleware/verifyToken';

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Weryfikacja tokenu użytkownika (musi być adminem)
    const { error, user, response } = await verifyToken(req, true);
    if (error) return response;

    console.log('Authenticated admin:', user);

    // Usunięcie rejsu z bazy danych
    const voyage = await Voyage.findByIdAndDelete(id);

    if (!voyage) {
      return NextResponse.json(
        { message: 'Voyage not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Voyage deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting voyage:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
