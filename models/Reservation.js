import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  voyage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voyage',
    required: true,
  },
  shipName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    type: Number, // Cena całkowita
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;
