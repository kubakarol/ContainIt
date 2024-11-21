import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/dbConnect';

export async function POST(req) {
  await dbConnect(); // Łączenie z bazą danych

  const { username, email, password } = await req.json(); // Odbieramy dane z formularza
  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({ error: 'All fields are required' }),
      { status: 400 }
    );
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Dodanie użytkownika do bazy

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({ token, userId: newUser._id }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during user creation:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
}
