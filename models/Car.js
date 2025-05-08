const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalCarProvider',
    required: true
  },
  model: {
    type: String,
    required: [true, 'Please add car model']
  },
  brand: {
    type: String,
    required: [true, 'Please add car brand']
  },
  year: {
    type: Number,
    required: [true, 'Please add car year']
  },
  picture: {
    type: String,
    required: [true, 'Please add car Picture']
  },
  available: {
    type: Boolean,
    default: true
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add rental price per day']
  }
});

module.exports = mongoose.model('Car', CarSchema);