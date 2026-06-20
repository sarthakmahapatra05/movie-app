import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSeat, selectTotals, MAX_SEATS_PER_BOOKING } from '../redux/slices/bookingSlice';
import FlowHeader from '../components/FlowHeader';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function SelectSeats() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedShowtime, selectedSeats } = useSelector((s) => s.booking);
  const totals = useSelector(selectTotals);

  if (!selectedShowtime) {
    return (
      <div className="app-shell px-5 pt-10 text-sm text-ink-muted">
        No showtime selected. Please go back and choose a schedule first.
      </div>
    );
  }

  const { rows, seatsPerRow, occupiedSeats } = selectedShowtime;

  const seatState = (seatId) => {
    if (occupiedSeats.includes(seatId)) return 'occupied';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const handleSeatClick = (seatId, state) => {
    if (state === 'occupied') return;
    if (state === 'available' && selectedSeats.length >= MAX_SEATS_PER_BOOKING) return;
    dispatch(toggleSeat(seatId));
  };

  const seatClasses = (state) => {
    switch (state) {
      case 'occupied':
        return 'bg-ink-muted text-white border-transparent cursor-not-allowed';
      case 'selected':
        return 'bg-primary text-white border-primary';
      default:
        return 'bg-white text-ink-muted border-outline';
    }
  };

  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar" style={{ paddingBottom: 140 }}>
        <FlowHeader onCancel={() => navigate('/')} />

        <div className="px-5">
          <ProgressBar percent={75} />

          <h1 className="font-bold text-lg mt-4 mb-1">Select Seats</h1>
          <div className="flex items-center justify-between mb-4 text-sm font-semibold">
            <p>
              <span className="text-ink">{selectedShowtime.screen}</span>{' '}
              <span className="text-primary ml-2">{selectedShowtime.time}</span>
            </p>
            <span className="text-ink">₹{totals.ticketPrice || 560}</span>
          </div>
        </div>

        {/* Interactive pinch-to-zoom/pan seat canvas */}
        <div className="relative w-full bg-[#F4F5F7]" style={{ height: 420, overflow: 'hidden' }}>
          {/* Hint */}
          <div className="absolute top-2 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] text-ink-muted font-medium shadow pointer-events-none flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
            </svg>
            Pinch or scroll to zoom · Drag to pan
          </div>

          <TransformWrapper
            initialScale={0.65}
            minScale={0.35}
            maxScale={3}
            centerOnInit={true}
            wheel={{ step: 0.08 }}
            panning={{ velocityDisabled: false }}
          >
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ padding: '60px 40px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Screen indicator inside canvas */}
              <div style={{ width: Math.max(seatsPerRow * 34, 200), marginBottom: 32 }} className="flex flex-col items-center">
                <svg viewBox="0 0 400 28" style={{ width: '100%' }} preserveAspectRatio="none">
                  <path d="M4,24 Q200,2 396,24" stroke="#C0C4CC" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
                <p className="text-[11px] tracking-[0.25em] text-gray-400 font-semibold mt-1.5">SCREEN</p>
              </div>

              {/* Seat rows */}
              <div className="flex flex-col gap-2">
                {rows.map((row) => (
                  <div key={row}>
                    <div className="flex items-center gap-2">
                      <span className="w-7 text-[13px] font-semibold text-gray-500 text-right shrink-0">{row}</span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((col) => {
                          // Add aisle gap in the middle
                          const mid = Math.floor(seatsPerRow / 2);
                          const seatId = `${row}${col}`;
                          const state = seatState(seatId);
                          return (
                            <div key={seatId} className="flex items-center">
                              {col === mid + 1 && <div style={{ width: 14 }} />}
                              <button
                                onClick={() => handleSeatClick(seatId, state)}
                                aria-label={`Seat ${seatId} - ${state}`}
                                className={`w-7 h-7 rounded-[4px] border text-[11px] font-medium flex items-center justify-center transition-colors ${seatClasses(state)}`}
                              >
                                {col}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <span className="w-7 text-[13px] font-semibold text-gray-500 text-left shrink-0">{row}</span>
                    </div>
                    {row === 'H' && <div style={{ height: 20 }} />}
                  </div>
                ))}
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>

        {/* Legend */}
        <div className="px-5 pt-4">
          <div className="border-t border-outline mb-4" />
          <div className="flex justify-center items-center gap-6 text-[13px] text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-[4px] border border-outline bg-white inline-block" /> Available
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-[4px] bg-ink-muted inline-block" /> Occupied
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-[4px] bg-primary inline-block" /> Selected
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[60px] left-0 right-0 max-w-app mx-auto p-5 bg-bg">
        <button
          onClick={() => navigate('/summary')}
          disabled={selectedSeats.length === 0}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg disabled:opacity-40"
        >
          View Booking Summary
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
