const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

const MAX_SEATS_PER_BOOKING = 10;

function generateMockQR(bookingId, seats) {
  return `UPAAY-TICKET|${bookingId}|${seats.join(',')}|${Date.now()}`;
}

exports.createBooking = async (req, res) => {
  const { showtimeId, seats } = req.body;

  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'showtimeId and a non-empty seats array are required' });
  }

  if (typeof showtimeId !== 'string' || showtimeId.startsWith('mock-') || !mongoose.Types.ObjectId.isValid(showtimeId)) {
    return res.status(400).json({ message: 'Invalid showtime selected. Please choose a real theatre schedule.' });
  }

  if (seats.length > MAX_SEATS_PER_BOOKING) {
    return res.status(400).json({ message: `You can book a maximum of ${MAX_SEATS_PER_BOOKING} seats per transaction` });
  }

  let seatsReserved = false;

  try {
    const showtime = await Showtime.findOneAndUpdate(
      { _id: showtimeId, occupiedSeats: { $nin: seats } },
      { $push: { occupiedSeats: { $each: seats } } },
      { new: true }
    );

    if (!showtime) {
      return res.status(409).json({
        message: 'One or more selected seats were just booked by someone else. Please choose different seats.'
      });
    }

    seatsReserved = true;

    const movie = await Movie.findById(showtime.movie);
    const theatre = await Theatre.findById(showtime.theatre);

    const ticketPrice = showtime.pricePerSeat * seats.length;
    const bookingFee = 20;
    const totalAmount = ticketPrice + bookingFee;

    const booking = await Booking.create({
      user: req.user.id,
      showtime: showtime._id,
      movieSnapshot: { title: movie?.title, bannerImage: movie?.bannerImage },
      theatreSnapshot: { name: theatre?.name },
      date: showtime.date,
      time: showtime.time,
      screen: showtime.screen,
      format: showtime.format,
      seats,
      ticketPrice,
      bookingFee,
      totalAmount,
      status: 'confirmed'
    });

    booking.qrCode = generateMockQR(booking._id, seats);
    await booking.save();

    return res.status(201).json(booking);
  } catch (err) {
    if (seatsReserved) {
      await Showtime.findByIdAndUpdate(showtimeId, { $pull: { occupiedSeats: { $in: seats } } });
    }

    return res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();
    await Showtime.findByIdAndUpdate(booking.showtime, { $pull: { occupiedSeats: { $in: booking.seats } } });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
};
