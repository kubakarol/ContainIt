import User from '../../../../models/User';
import verifyToken from '../../middleware/verifyToken';

export async function DELETE(req) {
  const { error, user, response } = await verifyToken(req, true); // Admin-only
  if (error) return response;

  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully', deletedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
