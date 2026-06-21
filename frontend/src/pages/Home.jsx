import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieApi, theatreApi } from '../api/endpoints';
import PosterImage from '../components/PosterImage';
import BottomNav from '../components/BottomNav';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#1E1F2B">
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
  </svg>
);

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7180" strokeWidth="2">
    <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function Home() {
  const [tab, setTab] = useState('now_showing');
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [movieRes, theatreRes] = await Promise.all([movieApi.getAll(), theatreApi.getAll()]);
        setMovies(movieRes.data);
        setTheatres(theatreRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = movies.find((m) => m.status === 'now_showing') || movies[0];
  const filtered = movies.filter((m) => m.status === tab);

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar">
        <div className="relative h-56">
          <PosterImage src="/homepagehero.png" alt={featured?.title || 'Featured movie'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <button className="absolute top-5 right-5 bg-black/30 rounded-full p-2">
            <SearchIcon />
          </button>

        </div>

        <div className="px-5 pt-4">

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-5 text-sm">
              <button
                onClick={() => setTab('now_showing')}
                className={`font-semibold pb-1 ${tab === 'now_showing' ? 'text-primary border-b-2 border-primary' : 'text-ink-muted'}`}
              >
                Now Showing
              </button>
              <button
                onClick={() => setTab('coming_soon')}
                className={`font-semibold pb-1 ${tab === 'coming_soon' ? 'text-primary border-b-2 border-primary' : 'text-ink-muted'}`}
              >
                Coming Soon
              </button>
            </div>
            <span className="text-xs font-medium text-primary">View All</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {loading && <p className="text-sm text-ink-muted py-6">Loading movies…</p>}
            {!loading && filtered.length === 0 && (
              <p className="text-sm text-ink-muted py-6">No movies to show right now.</p>
            )}
            {filtered.map((movie) => (
              <Link key={movie._id} to={`/movie/${movie._id}`} className="w-28 flex-shrink-0">
                <PosterImage
                  src={movie.posterImage}
                  alt={movie.title}
                  className="w-28 h-36 rounded-xl object-cover mb-1.5"
                />
                <div className="flex items-center gap-1 mb-0.5">
                  <StarIcon />
                  <span className="text-xs font-semibold">{movie.rating}</span>
                </div>
                <p className="text-xs font-semibold text-ink leading-tight truncate">{movie.title}</p>
                <p className="text-[10px] text-ink-muted truncate">{movie.genres?.join(', ')}</p>
              </Link>
            ))}
          </div>


          <div className="flex items-center justify-between mt-6 mb-3">
            <h2 className="font-bold text-base">Movie Theatres</h2>
            <span className="text-xs font-medium text-primary">View All</span>
          </div>

          <div className="space-y-3">
            {theatres.map((theatre) => (
              <div key={theatre._id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-card">
                <div className="w-12 h-12 rounded-lg bg-ink flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                  {theatre.logo ? <img src={theatre.logo} alt={theatre.name} className="w-full h-full object-cover" /> : theatre.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{theatre.name}</p>
                  <div className="flex items-center gap-1 text-xs text-ink-muted truncate">
                    <PinIcon /> <span className="truncate">{theatre.address}</span>
                  </div>
                  <p className="text-xs font-semibold text-ink mt-0.5">
                    ₹{theatre.minPrice}
                    {theatre.maxPrice && theatre.maxPrice !== theatre.minPrice ? ` - ₹${theatre.maxPrice}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
