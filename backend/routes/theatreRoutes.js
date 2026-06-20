const express = require('express');
const router = express.Router();
const { getTheatres, createTheatre } = require('../controllers/theatreController');

router.get('/', getTheatres);
router.post('/', createTheatre);

module.exports = router;
