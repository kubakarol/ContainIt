import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const verifyToken = async (req, requireAdmin = false) => {
  console.log('Verifying token...');
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    console.log('No token provided');
    return { error: true, response: new NextResponse(
      JSON.stringify({ message: "Access Denied" }),
      { status: 403 }
    ) };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', user);

    if (requireAdmin && user.role !== 'admin') {
      console.log('Access Denied: Not an admin');
      return { error: true, response: new NextResponse(
        JSON.stringify({ message: "Access Denied: Not an admin" }),
        { status: 403 }
      ) };
    }

    return { error: false, user }; // Jeśli wszystko jest ok, zwróć user
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return { error: true, response: new NextResponse(
      JSON.stringify({ message: "Invalid Token" }),
      { status: 403 }
    ) };
  }
};

export default verifyToken;
