const mongoose = require('mongoose');

const castSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, default: '' }
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genres: [{ type: String }],
    description: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    posterImage: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    certificate: { type: String, default: 'UA' }, // e.g. PG-13
    formats: [{ type: String }], // ['2D', '3D']
    releaseDate: { type: Date },
    cast: [castSchema],
    status: { type: String, enum: ['now_showing', 'coming_soon'], default: 'now_showing' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
