const express = require('express');
const router = express.Router();
const { getShowtimes, getShowtimeById, createShowtime } = require('../controllers/showtimeController');

router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);
router.post('/', createShowtime);

module.exports = router;
