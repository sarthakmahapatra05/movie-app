import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../api/endpoints';
import BottomNav from '../components/BottomNav';
import PosterImage from '../components/PosterImage';
import { QRCodeSVG } from 'qrcode.react';

const BackArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MyBookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setLoading(true);
    bookingApi
      .getMine()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await bookingApi.cancel(id);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const isPast = (b) => new Date(`${b.date} ${b.time}`) < now || b.status === 'cancelled';
  const filtered = bookings.filter((b) => (tab === 'upcoming' ? !isPast(b) : isPast(b)));

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar">
        <div className="px-5 pt-5">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm font-medium text-ink mb-3">
            <BackArrow /> Back
          </button>

          <div className="flex gap-5 text-sm mb-4">
            <button
              onClick={() => setTab('upcoming')}
              className={`font-semibold pb-1 ${tab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-ink-muted'}`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setTab('past')}
              className={`font-semibold pb-1 ${tab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-ink-muted'}`}
            >
              Past Bookings
            </button>
          </div>

          {loading && <p className="text-sm text-ink-muted">Loading your tickets…</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-ink-muted">No {tab === 'upcoming' ? 'upcoming' : 'past'} bookings yet.</p>
          )}

          <div className="space-y-4">
            {filtered.map((b) => (
              <div key={b._id} className="bg-white rounded-xl shadow-card overflow-hidden">
                <PosterImage src="/selecttheatrepagehero.jpg" alt={b.movieSnapshot?.title} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-base mb-3">{b.movieSnapshot?.title}</h3>
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">{b.theatreSnapshot?.name}</p>
                      <p className="text-sm text-ink-muted font-medium">
                        {new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{b.screen} - {b.format}</p>
                      <p className="text-sm text-ink-muted font-medium">{b.time}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium mb-1.5">Seats:</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {b.seats.map((seat) => (
                          <span key={seat} className="bg-occupied text-white text-xs font-semibold rounded-md px-2 py-1">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium mb-1">Amount Paid:</p>
                      <p className="text-ink-muted text-sm">₹{b.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div className="flex flex-col gap-3">
                      {b.status === 'confirmed' && !isPast(b) ? (
                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={cancellingId === b._id}
                          className="text-xs font-semibold text-danger border border-danger rounded-md px-3 py-1.5 disabled:opacity-60 self-start"
                        >
                          {cancellingId === b._id ? 'Cancelling…' : 'Cancel Booking'}
                        </button>
                      ) : (
                        <span
                          className={`text-xs font-semibold rounded-md px-2 py-1 self-start ${
                            b.status === 'cancelled' ? 'bg-red-100 text-danger' : 'bg-gray-100 text-ink-muted'
                          }`}
                        >
                          {b.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </span>
                      )}
                      <p className="text-xs text-ink-muted">
                        Transaction Date:
                        <br />
                        {new Date(b.transactionDate || b.createdAt).toLocaleString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <QRCodeSVG value={b.qrCode || b._id} size={84} />
                  </div>
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
