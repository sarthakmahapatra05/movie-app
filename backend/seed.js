require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Theatre.deleteMany({}),
    Showtime.deleteMany({}),
    Booking.deleteMany({})
  ]);

  console.log('Creating demo user...');
  const demoPasswordHash = await bcrypt.hash('password123', 10);
  await User.create({
    name: 'Demo User',
    email: 'demo@upaay.com',
    password: demoPasswordHash
  });

  console.log('Creating theatres...');
  const theatres = await Theatre.insertMany([
    { name: 'The Grandview', address: 'Camp Aguinaldo, Quezon City', logo: '/theatrecard/thegrandviewtheatrecard.jpg', minPrice: 320, maxPrice: 450 },
    { name: 'Play Loft', address: 'Aurora Boulevard, Santa Mesa', logo: '/theatrecard/playlofttheatrecard.png', minPrice: 300, maxPrice: 430 },
    { name: 'CinemaOne', address: 'A Cruz, Pasay City', logo: '/cinemaonetheatrecard.png', minPrice: 320, maxPrice: 320 },
    { name: 'Cinemount', address: 'Baclaran, Paranaque City', minPrice: 350, maxPrice: 350 }
  ]);

  console.log('Creating movies...');
  const movies = await Movie.insertMany([
    {
      title: 'Meg 2: The Trench',
      genres: ['Action', 'Sci-fi', 'Horror'],
      description:
        'A research team encounters multiple threats while exploring the depths of the ocean, including a malevolent mining operation.',
      bannerImage: '/moviedetailspagehero.jpg',
      posterImage: '/moviecards/mega2moviecard.jpg',
      rating: 4.5,
      certificate: 'PG-13',
      formats: ['2D', '3D'],
      releaseDate: new Date('2026-06-10'),
      cast: [
        { name: 'Jason Statham', role: 'Jonas Taylor', image: '/castecard/jasoncastecard.jpg' },
        { name: 'Jing Wu', role: 'Jiuming Zhang', image: '/castecard/jingcastecard.jpg' },
        { name: 'SophiaCai Shuya', role: 'Meiying', image: '/castecard/sophiacalcastecard.jpg' }
      ],
      status: 'now_showing'
    },
    {
      title: 'The Nun II',
      genres: ['Horror'],
      description: 'Sister Irene returns to confront a malevolent force once again, this time in 1956 France.',
      bannerImage: '/moviedetailspagehero.jpg',
      posterImage: '/moviecards/nun-IImoviecard.jpg',
      rating: 4.5,
      certificate: 'R',
      formats: ['2D'],
      releaseDate: new Date('2026-05-01'),
      cast: [],
      status: 'now_showing'
    },
    {
      title: 'Fast X',
      genres: ['Action', 'Adventure'],
      description: 'Dom Toretto and his family face their most lethal opponent yet.',
      bannerImage: '/moviedetailspagehero.jpg',
      posterImage: '/moviecards/fastXmoviecard.jpg',
      rating: 4.5,
      certificate: 'PG-13',
      formats: ['2D', '3D'],
      releaseDate: new Date('2026-04-12'),
      cast: [],
      status: 'now_showing'
    },
    {
      title: 'John Wick: Chapter 5',
      genres: ['Action'],
      description: 'John Wick returns for one final job.',
      bannerImage: '/moviedetailspagehero.jpg',
      posterImage: '/moviecards/johnwickchapter4moviecard.jpg',
      rating: 4.6,
      certificate: 'R',
      formats: ['2D'],
      releaseDate: new Date('2026-09-01'),
      cast: [],
      status: 'coming_soon'
    }
  ]);

  console.log('Creating showtimes...');
  const meg2 = movies[0];
  const grandview = theatres[0];
  const dates = ['2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25'];
  const times = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
  const screens = ['Screen 1', 'Screen 2'];

  const showtimeDocs = [];
  for (const date of dates) {
    for (const screen of screens) {
      for (const time of times) {
        showtimeDocs.push({
          movie: meg2._id,
          theatre: grandview._id,
          date,
          screen,
          format: '2D',
          time,
          pricePerSeat: 280,
          rows: ROWS,
          seatsPerRow: 24,
          occupiedSeats: date === dates[1] && screen === 'Screen 1' && time === '10:00 AM'
            ? ['H7', 'H8', 'H9', 'H10', 'J11', 'J12']
            : []
        });
      }
    }
  }
  await Showtime.insertMany(showtimeDocs);

  console.log('Seed complete!');
  console.log('Demo login -> email: demo@upaay.com / password: password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
