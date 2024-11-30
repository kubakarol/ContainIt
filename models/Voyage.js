const mongoose = require('mongoose');

const voyageSchema = new mongoose.Schema({
  ship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  shipName: {  
    type: String,
    required: true,
  },
  departurePort: {
    type: String,
    required: true,
  },
  arrivalPort: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  availableContainers: {
    type: Number,
    required: true,
  },
  pricePerContainer: {
    type: Number,
    required: true,
  },
});

// Sprawdzenie, czy model już istnieje, aby uniknąć ponownej rejestracji
const Voyage = mongoose.models.Voyage || mongoose.model('Voyage', voyageSchema);

module.exports = Voyage;
