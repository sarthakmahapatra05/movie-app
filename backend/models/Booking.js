const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    movieSnapshot: {
      title: String,
      bannerImage: String
    },
    theatreSnapshot: {
      name: String
    },
    date: String,
    time: String,
    screen: String,
    format: String,
    seats: [{ type: String, required: true }],
    ticketPrice: { type: Number, required: true }, // total for seats, pre-fee
    bookingFee: { type: Number, default: 20 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    qrCode: { type: String, default: '' }, // mock string encoded for QR
    transactionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
