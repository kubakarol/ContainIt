import mongoose from 'mongoose';

// Definicja schematu użytkownika
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Tworzenie modelu użytkownika i przypisanie go do kolekcji 'users'
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users'); // 'users' to nazwa kolekcji

export default User;
