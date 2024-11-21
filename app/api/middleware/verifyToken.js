import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const verifyToken = async (req) => {
  console.log('Verifying token...');
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    console.log('No token provided');
    return new NextResponse(
      JSON.stringify({ message: "Access Denied" }), 
      { status: 403 }
    );
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Przechowuj dane użytkownika w req.user
    console.log('Token verified');
  } catch (err) {
    console.log('Token verification failed');
    return new NextResponse(
      JSON.stringify({ message: "Invalid Token" }), 
      { status: 403 }
    );
  }

  return null; // Jeśli wszystko jest ok, zwróć null
};

export default verifyToken;
