import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { theatreApi } from '../api/endpoints';
import { setTheatre, setDate } from '../redux/slices/bookingSlice';
import PosterImage from '../components/PosterImage';
import FlowHeader from '../components/FlowHeader';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';

function nextDays(n) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function SelectTheatre() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedMovie = useSelector((s) => s.booking.selectedMovie);
  const [theatres, setTheatres] = useState([]);
  const days = useMemo(() => nextDays(7), []);
  const [activeDate, setActiveDate] = useState(days[0]);

  useEffect(() => {
    theatreApi.getAll().then((res) => setTheatres(res.data));
  }, []);

  const fmt = (d) => d.toISOString().slice(0, 10);

  const handleSelectTheatre = (theatre) => {
    dispatch(setTheatre({ id: theatre._id, name: theatre.name }));
    dispatch(setDate(fmt(activeDate)));
    navigate(`/schedule/${movieId}`);
  };

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar">
        <div className="relative h-44">
          <PosterImage src="/selecttheatrepagehero.jpg" alt={selectedMovie?.title || ''} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between">
            <FlowHeader light onCancel={() => navigate('/')} />
            <div className="px-5 pb-4">
              <h1 className="text-white text-lg font-bold leading-tight">{selectedMovie?.title}</h1>
              <p className="text-white/80 text-xs">{selectedMovie?.genres?.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4">
          <ProgressBar percent={25} />

          <h2 className="font-bold text-base mt-4 mb-3">Select Movie Theatre</h2>

          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 mb-5 items-end">
            {days.map((d) => {
              const active = fmt(d) === fmt(activeDate);
              return (
                <div key={fmt(d)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-ink-muted'}`}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <button
                    onClick={() => setActiveDate(d)}
                    className={`w-10 h-10 rounded-lg text-center flex items-center justify-center border ${
                      active ? 'bg-primary text-white border-primary' : 'bg-transparent text-ink border-outline'
                    }`}
                  >
                    <span className="text-[15px] font-bold">{d.getDate()}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {theatres.map((theatre) => (
              <button
                key={theatre._id}
                onClick={() => handleSelectTheatre(theatre)}
                className="w-full flex items-center gap-3 bg-white rounded-xl p-3 shadow-card text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-ink flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                  {theatre.logo ? <img src={theatre.logo} alt={theatre.name} className="w-full h-full object-cover" /> : theatre.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{theatre.name}</p>
                  <p className="text-xs text-ink-muted truncate">{theatre.address}</p>
                  <p className="text-xs font-semibold text-ink mt-0.5">
                    ₹{theatre.minPrice}
                    {theatre.maxPrice && theatre.maxPrice !== theatre.minPrice ? ` - ₹${theatre.maxPrice}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
