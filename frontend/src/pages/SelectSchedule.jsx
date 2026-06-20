import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showtimeApi } from '../api/endpoints';
import { setFormat, setShowtime } from '../redux/slices/bookingSlice';
import PosterImage from '../components/PosterImage';
import FlowHeader from '../components/FlowHeader';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';

export default function SelectSchedule() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie, selectedTheatre, selectedDate, selectedFormat } = useSelector((s) => s.booking);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickedId, setPickedId] = useState(null);

  useEffect(() => {
    if (!selectedMovie || !selectedTheatre || !selectedDate) {
      navigate(selectedMovie ? `/theatres/${movieId}` : '/', { replace: true });
      return;
    }

    const loadShowtimes = async () => {
      setLoading(true);
      try {
        const res = await showtimeApi.getAll({ movie: movieId, theatre: selectedTheatre.id, date: selectedDate });
        setShowtimes(res.data || []);
        const availableFormats = [...new Set((res.data || []).map((s) => s.format))];
        if (availableFormats.length > 0 && !availableFormats.includes(selectedFormat)) {
          dispatch(setFormat(availableFormats[0]));
        }
      } catch (err) {
        setShowtimes([]);
      } finally {
        setPickedId(null);
        setLoading(false);
      }
    };

    loadShowtimes();
  }, [movieId, selectedMovie, selectedTheatre, selectedDate, selectedFormat, dispatch, navigate]);

  const filtered = showtimes.filter((s) => s.format === selectedFormat);
  const screens = [...new Set(filtered.map((s) => s.screen))].sort();
  const formats = [...new Set(showtimes.map((s) => s.format))];
  const prices = showtimes.map((s) => s.pricePerSeat);
  const priceLabel = prices.length
    ? `₹${Math.min(...prices)} - ₹${Math.max(...prices)}`
    : '';

  const dateLabel = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  const handlePick = (showtime) => {
    setPickedId(showtime._id);
  };

  const handleConfirm = () => {
    const showtime = filtered.find((s) => s._id === pickedId);
    if (!showtime) {
      return;
    }
    dispatch(setShowtime(showtime));
    navigate('/seats');
  };

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar" style={{ paddingBottom: 180 }}>
        <div className="relative h-40">
          <PosterImage src="/selecttheatrepagehero.jpg" alt={selectedMovie?.title || ''} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between">
            <FlowHeader light onCancel={() => navigate('/')} />
            <div className="px-5 pb-4">
              <h1 className="text-white text-lg font-bold leading-tight">{selectedMovie?.title}</h1>
              <p className="text-white/80 text-xs flex items-center gap-2">
                <span>🏛 {selectedTheatre?.name}</span>
                <span>📅 {dateLabel}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4">
          <ProgressBar percent={50} />

          <h2 className="font-bold text-base mt-4 mb-3">Choose Schedule</h2>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-ink-muted">Format</span>
            <span className="text-sm font-semibold text-ink">{priceLabel}</span>
          </div>
          <div className="flex gap-2 mb-4">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => {
                  dispatch(setFormat(f));
                  setPickedId(null);
                }}
                className={`text-xs font-semibold rounded-md px-4 py-1.5 border ${
                  selectedFormat === f ? 'bg-primary text-white border-primary' : 'border-outline text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading && <p className="text-sm text-ink-muted">Loading showtimes…</p>}

          {!loading &&
            screens.map((screen) => (
              <div key={screen} className="mb-4">
                <h3 className="font-semibold text-sm mb-2">{screen}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {filtered
                    .filter((s) => s.screen === screen)
                    .map((s) => {
                      const isFull = s.occupiedSeats.length >= (s.rows.length * s.seatsPerRow);
                      const isPicked = s._id === pickedId;
                      return (
                        <button
                          key={s._id}
                          disabled={isFull}
                          onClick={() => handlePick(s)}
                          className={`text-xs font-semibold py-2 rounded-md border ${
                            isFull
                              ? 'border-outline text-ink-faint opacity-50 cursor-not-allowed'
                              : isPicked
                              ? 'bg-primary text-white border-primary'
                              : 'border-outline text-ink hover:border-primary'
                          }`}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

          {!loading && screens.length === 0 && (
            <p className="text-sm text-ink-muted">No showtimes available for this format/date.</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-[60px] left-0 right-0 max-w-app mx-auto p-5 bg-bg">
        <button
          onClick={handleConfirm}
          disabled={!pickedId}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg disabled:opacity-40"
        >
          Get Tickets
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
