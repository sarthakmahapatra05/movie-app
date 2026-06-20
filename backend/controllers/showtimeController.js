const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

const SAMPLE_TIMES = ['10:00 AM', '12:00 PM', '02:30 PM', '05:00 PM', '07:30 PM'];
const SAMPLE_SCREENS = ['Screen 1', 'Screen 2'];
const SAMPLE_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];

exports.getShowtimes = async (req, res) => {
  try {
    const { movie, theatre, date } = req.query;
    const filter = {};
    if (movie) filter.movie = movie;
    if (theatre) filter.theatre = theatre;
    if (date) filter.date = date;

    let showtimes = await Showtime.find(filter).sort({ screen: 1, time: 1 });
    if (showtimes.length === 0 && movie && theatre && date) {
      const movieDoc = await Movie.findById(movie);
      const theatreDoc = await Theatre.findById(theatre);
      if (movieDoc && theatreDoc) {
        const formats = movieDoc.formats && movieDoc.formats.length ? movieDoc.formats : ['2D'];
        const showtimeDocs = [];

        for (const format of formats) {
          for (const screen of SAMPLE_SCREENS) {
            for (const time of SAMPLE_TIMES) {
              showtimeDocs.push({
                movie: movieDoc._id,
                theatre: theatreDoc._id,
                date,
                screen,
                format,
                time,
                pricePerSeat: 250 + (format === '3D' ? 70 : 0),
                rows: SAMPLE_ROWS,
                seatsPerRow: 8,
                occupiedSeats: []
              });
            }
          }
        }

        showtimes = await Showtime.insertMany(showtimeDocs);
      }
    }

    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch showtimes', error: err.message });
  }
};

exports.getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('movie', 'title bannerImage')
      .populate('theatre', 'name');
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch showtime', error: err.message });
  }
};

exports.createShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create showtime', error: err.message });
  }
};
