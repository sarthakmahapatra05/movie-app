import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTotals } from '../redux/slices/bookingSlice';
import PosterImage from '../components/PosterImage';
import FlowHeader from '../components/FlowHeader';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';

const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 11v1M15 11v1M9 15v1M15 15v1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BookingSummary() {
  const navigate = useNavigate();
  const { selectedMovie, selectedTheatre, selectedDate, selectedShowtime, selectedSeats } = useSelector(
    (s) => s.booking
  );
  const totals = useSelector(selectTotals);

  if (!selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="app-shell px-5 pt-10 text-sm text-ink-muted">
        No seats selected yet. Please go back and pick your seats.
      </div>
    );
  }

  const dateLabel = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar" style={{ paddingBottom: 110 }}>
        <FlowHeader onCancel={() => navigate('/')} />

        <div className="px-5">
          <ProgressBar percent={90} />

          <h1 className="font-bold text-lg mt-4 mb-4">Booking Summary</h1>

          <PosterImage
            src="/selecttheatrepagehero.jpg"
            alt={selectedMovie?.title || ''}
            className="w-full h-40 object-cover rounded-xl mb-4"
          />

          <h2 className="font-bold text-base">{selectedMovie?.title}</h2>
          <div className="flex items-center gap-3 text-xs text-ink-muted mt-1 mb-4">
            <span className="flex items-center gap-1.5"><BuildingIcon /> {selectedTheatre?.name}</span>
            <span className="flex items-center gap-1.5"><CalendarIcon /> {dateLabel}</span>
          </div>

          <div className="flex items-center gap-4 text-sm mb-2">
            <span className="font-semibold">{selectedShowtime.screen}</span>
            <span className="text-primary font-semibold">{selectedShowtime.time}</span>
            <span className="text-ink-muted">{selectedShowtime.format}</span>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <span className="text-sm font-semibold mt-0.5">Seats</span>
            <div className="flex gap-1.5 flex-wrap">
              {selectedSeats.map((seat) => (
                <span key={seat} className="bg-occupied text-white text-xs font-semibold rounded-md px-2 py-1">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-outline pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">{selectedSeats.length}x Tickets</span>
              <span className="font-medium">₹{totals.ticketPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Booking Fee</span>
              <span className="font-medium">₹{totals.bookingFee}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-outline pt-2">
              <span>Total</span>
              <span>₹{totals.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[60px] left-0 right-0 max-w-app mx-auto p-5 bg-bg">
        <button
          onClick={() => navigate('/payment')}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg"
        >
          Proceed to Payment
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
