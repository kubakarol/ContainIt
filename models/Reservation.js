import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    voyage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voyage', // Odniesienie do modelu Voyage
      required: true,
    },
    shipName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Odniesienie do modelu User
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    reservedContainers: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'], // Wartości dozwolone
      default: 'Pending',
    },
    departureDate: { // Dodane pole departureDate
      type: Date,
      required: true,
    },
    arrivalDate: { // Dodane pole arrivalDate
      type: Date,
      required: true,
    },
    comment: {
      type: String, // Pole opcjonalne
      required: false,
    },
  },
  {
    timestamps: true, // Automatyczne dodanie pól createdAt i updatedAt
  }
);

// Sprawdzanie, czy model już istnieje, aby uniknąć błędów ponownej rejestracji
const Reservation =
  mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

export default Reservation;
