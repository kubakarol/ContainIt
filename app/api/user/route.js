import { NextResponse } from 'next/server';
import verifyToken from '../middleware/verifyToken';

export async function GET(req) {
  // Tylko weryfikacja tokenu, brak sprawdzania roli
  const tokenResponse = await verifyToken(req);
  if (tokenResponse) {
    return tokenResponse; // Jeśli token jest nieważny, zwróć odpowiedź
  }
  return new NextResponse(
    JSON.stringify({ message: 'User profile accessed' }),
    { status: 200 }
  );
}
