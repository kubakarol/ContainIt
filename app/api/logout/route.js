export async function POST(req) {
    try {
      // Jeśli potrzebujesz dodatkowej logiki, możesz dodać ją tutaj.
      return new Response(JSON.stringify({ message: 'Successfully logged out' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error during logout:', error);
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  