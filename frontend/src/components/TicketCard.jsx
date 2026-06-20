import { QRCodeSVG } from 'qrcode.react';
import PosterImage from './PosterImage';

export default function TicketCard({ booking }) {
  if (!booking) return null;
  const dateLabel = booking.date
    ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <PosterImage
        src="/selecttheatrepagehero.jpg"
        alt={booking.movieSnapshot?.title || 'Movie'}
        className="w-full h-36 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-base mb-3">{booking.movieSnapshot?.title}</h3>

        <div className="flex justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-ink">{booking.theatreSnapshot?.name}</p>
            <p className="text-sm text-ink-muted font-medium">{dateLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-ink">
              {booking.screen} - {booking.format}
            </p>
            <p className="text-sm text-ink-muted font-medium">{booking.time}</p>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium mb-1.5">Seats:</p>
            <div className="flex gap-1.5 flex-wrap">
              {booking.seats.map((seat) => (
                <span key={seat} className="bg-occupied text-white text-xs font-semibold rounded-md px-2 py-1">
                  {seat}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium mb-1">Amount Paid:</p>
            <p className="text-ink-muted text-sm">₹{booking.totalAmount}</p>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-xs text-ink-muted">
              Transaction Date:
              <br />
              {new Date(booking.transactionDate || booking.createdAt).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          </div>
          <QRCodeSVG value={booking.qrCode || booking._id} size={84} />
        </div>
      </div>
    </div>
  );
}
