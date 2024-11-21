import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('Połączenie z bazą danych już istnieje');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Połączono z MongoDB');
  } catch (error) {
    console.error('Błąd połączenia z MongoDB:', error);
    process.exit(1);  // Kończymy proces, jeśli połączenie nie powiodło się
  }
};

export default connectDB;
