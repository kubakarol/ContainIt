import User from '../../../../models/User';
import verifyToken from '../../middleware/verifyToken';

export async function GET(req) {
  const { error, user, response } = await verifyToken(req, true);
  if (error) return response;

  try {
    const users = await User.find({}, 'username email role createdAt'); // Pobierz dane użytkowników
    if (users.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ users }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
