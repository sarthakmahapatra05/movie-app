const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/me', auth, getMyBookings);
router.post('/:id/cancel', auth, cancelBooking);

module.exports = router;
