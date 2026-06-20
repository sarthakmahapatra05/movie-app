import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetBookingFlow } from '../redux/slices/bookingSlice';
import TicketCard from '../components/TicketCard';
import BottomNav from '../components/BottomNav';

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00D289" strokeWidth="3">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lastBooking = useSelector((s) => s.booking.lastBooking);

  const handleClose = () => {
    dispatch(resetBookingFlow());
    navigate('/');
  };

  if (!lastBooking) {
    return (
      <div className="app-shell px-5 pt-10 text-sm text-ink-muted">
        No booking found.{' '}
        <button onClick={() => navigate('/')} className="text-primary font-semibold">
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar px-5 pt-5" style={{ paddingBottom: 100 }}>
        <div className="flex justify-end mb-2">
          <button onClick={handleClose} className="text-sm font-medium text-ink-muted">
            Close
          </button>
        </div>

        <div className="flex flex-col items-center mb-5">
          <CheckIcon />
          <p className="font-bold text-lg mt-2">Payment Successful!</p>
        </div>

        <TicketCard booking={lastBooking} />

        <p className="text-center text-sm text-ink-muted mt-5">
          You may view all purchased tickets in the ticket page.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
