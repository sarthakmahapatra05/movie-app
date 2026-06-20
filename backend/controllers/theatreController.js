const Theatre = require('../models/Theatre');

exports.getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ name: 1 });
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch theatres', error: err.message });
  }
};

exports.createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json(theatre);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create theatre', error: err.message });
  }
};
