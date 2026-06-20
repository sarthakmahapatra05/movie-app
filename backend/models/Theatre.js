const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, default: '' },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theatre', theatreSchema);
