import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { movieApi } from '../api/endpoints';
import { setMovie, setFormat } from '../redux/slices/bookingSlice';
import PosterImage from '../components/PosterImage';
import BottomNav from '../components/BottomNav';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E1F2B">
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
    <path d="M12 20s-7-4.35-9.5-9C.8 7.2 3 4 6.5 4 9 4 11 6 12 7.5 13 6 15 4 17.5 4 21 4 23.2 7.2 21.5 11 19 15.65 12 20 12 20Z" />
  </svg>
);

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setLocalMovie] = useState(null);
  const [format, setLocalFormat] = useState('2D');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    movieApi.getById(id).then((res) => {
      setLocalMovie(res.data);
      setLocalFormat(res.data.formats?.[0] || '2D');
    });
  }, [id]);

  if (!movie) {
    return <div className="app-shell px-5 pt-10 text-sm text-ink-muted">Loading…</div>;
  }

  const handleGetTickets = () => {
    dispatch(
      setMovie({
        id: movie._id,
        title: movie.title,
        bannerImage: movie.bannerImage,
        genres: movie.genres,
        formats: movie.formats
      })
    );
    dispatch(setFormat(format));
    navigate(`/theatres/${movie._id}`);
  };

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar" style={{ paddingBottom: 180 }}>
        <div className="relative h-64">
          <PosterImage src="/moviedetailspagehero.jpg" alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          <button onClick={() => navigate(-1)} className="absolute top-5 left-5 text-white text-sm font-medium">
            Close
          </button>
          <button className="absolute top-5 right-5">
            <HeartIcon />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg font-bold text-ink leading-tight">{movie.title}</h1>
            <span className="text-[11px] border border-primary text-primary font-semibold rounded-md px-1.5 py-0.5 flex-shrink-0">
              {movie.certificate}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-ink-muted">{movie.genres?.join(', ')}</p>
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="text-sm font-semibold">{movie.rating}</span>
            </div>
          </div>

          <p className="text-sm text-ink-muted mt-4 leading-relaxed">{movie.description}</p>

          <div className="flex items-center justify-between mt-5 mb-2">
            <h2 className="font-bold text-sm">Format Available</h2>
            <div className="flex gap-2">
              {movie.formats?.map((f) => (
                <button
                  key={f}
                  onClick={() => setLocalFormat(f)}
                  className={`text-xs font-semibold rounded-md px-3 py-1.5 border ${
                    format === f ? 'bg-primary text-white border-primary' : 'border-primary text-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-bold text-sm mt-5 mb-1">Release Date</h2>
          <p className="text-sm text-ink-muted">
            {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
          </p>

          {movie.cast?.length > 0 && (
            <>
              <h2 className="font-bold text-sm mt-5 mb-2">Cast</h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
                {movie.cast.map((c) => (
                  <div key={c.name} className="flex-shrink-0 flex items-center gap-3 w-40">
                    <PosterImage src={c.image} alt={c.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-[15px] text-ink leading-tight">{c.name}</p>
                      <p className="text-[13px] text-ink-muted leading-tight mt-0.5">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-[60px] left-0 right-0 max-w-app mx-auto p-5 bg-bg">
        <button
          onClick={handleGetTickets}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg"
        >
          Get Tickets
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
