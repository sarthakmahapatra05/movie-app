const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    screen: { type: String, required: true }, // 'Screen 1'
    format: { type: String, required: true }, // '2D' | '3D'
    time: { type: String, required: true }, // '10:00 AM'
    pricePerSeat: { type: Number, required: true },
    rows: { type: [String], default: ['A','B','C','D','E','F','G','H','J','K','L','M'] },
    seatsPerRow: { type: Number, default: 12 },
    occupiedSeats: { type: [String], default: [] } // e.g. ['A1','H7']
  },
  { timestamps: true }
);

showtimeSchema.index({ movie: 1, theatre: 1, date: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);
