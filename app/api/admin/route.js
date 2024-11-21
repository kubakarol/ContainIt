import { NextResponse } from 'next/server';
import verifyToken from '../middleware/verifyToken';
import verifyAdmin from '../middleware/verifyAdmin';

export async function GET(req) {
  // Sprawdzanie tokenu
  const tokenResponse = await verifyToken(req);
  if (tokenResponse) {
    return tokenResponse; // Jeśli token nie jest prawidłowy, zwróć odpowiedź
  }

  console.log('Token verified, checking admin role...');
  // Teraz sprawdzamy, czy użytkownik ma rolę admina
  if (req.user?.role !== 'admin') {
    console.log('Not an admin');
    return new NextResponse(
      JSON.stringify({ message: "Access Denied: Admins only" }), 
      { status: 403 }
    );
  }

  console.log('Admin verified, processing response...');
  return new NextResponse(
    JSON.stringify({ message: 'Admin dashboard accessed' }),
    { status: 200 }
  );
}
