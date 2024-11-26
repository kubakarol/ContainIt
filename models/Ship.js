import mongoose from 'mongoose';

const ShipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerContainer: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Ship = mongoose.models.Ship || mongoose.model('Ship', ShipSchema);
export default Ship;
