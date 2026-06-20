import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookingApi } from '../api/endpoints';
import { selectTotals, setLastBooking, resetBookingFlow } from '../redux/slices/bookingSlice';
import FlowHeader from '../components/FlowHeader';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';

// Card numbers ending in this sequence simulate a declined payment,
// so the checkout flow's failure state can be exercised end-to-end
// without a real payment gateway.
const SIMULATED_DECLINE_SUFFIX = '0002';

function luhnLikeLength(num) {
  return num.replace(/\s/g, '').length === 16;
}

function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function getExpiryMonth(expiry) {
  return expiry ? expiry.split('/')[0] : '';
}

function getExpiryYear(expiry) {
  return expiry ? `20${expiry.split('/')[1]}` : '';
}

function buildExpiry(month, year) {
  if (!month || !year) return '';
  return `${month}/${year.slice(2)}`;
}

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedShowtime, selectedSeats } = useSelector((s) => s.booking);
  const totals = useSelector(selectTotals);
  // Redirect if no valid showtime selected
  useEffect(() => {
    if (!selectedShowtime) {
      navigate('/', { replace: true });
    }
  }, [selectedShowtime, navigate]);

  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [saveDetails, setSaveDetails] = useState(false);

  const update = (field) => (e) => {
    let value = e.target.value;
    if (field === 'number') {
      value = formatCardNumber(value);
    }
    if (field === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
    }
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (method === 'card') {
      if (!form.name.trim()) next.name = 'Name on card is required';
      if (!luhnLikeLength(form.number)) next.number = 'Enter a valid 16-digit card number';
      if (!form.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
        next.expiry = 'Enter a valid expiry date (MM/YY)';
      } else {
        const [monthStr, yearStr] = form.expiry.split('/');
        const month = Number(monthStr);
        const year = Number(`20${yearStr}`);
        const expiryDate = new Date(year, month - 1, 1);
        const now = new Date();
        if (expiryDate < new Date(now.getFullYear(), now.getMonth(), 1)) next.expiry = 'Card has expired';
      }
      if (!/^\d{3,4}$/.test(form.cvv)) next.cvv = 'Enter a valid CVC/CVV';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePay = async () => {
    setServerError('');
    if (!validate()) return;

    if (method === 'card' && form.number.replace(/\s/g, '').endsWith(SIMULATED_DECLINE_SUFFIX)) {
      setServerError('Your card was declined by the bank. Please try a different card.');
      return;
    }

    if (!selectedShowtime || !selectedShowtime._id) {
      setServerError('No showtime selected. Please go back and choose a schedule.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await bookingApi.create({
        showtimeId: selectedShowtime._id,
        seats: selectedSeats
      });
      dispatch(setLastBooking(data));
      navigate('/payment-success');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Payment could not be completed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="app-shell px-5 pt-10 text-sm text-ink-muted">
        Nothing to pay for yet. Please select seats first.
      </div>
    );
  }


  return (
    <div className="app-shell">
      <div className="app-content overflow-y-auto no-scrollbar" style={{ paddingBottom: 120 }}>
        <FlowHeader
          onCancel={() => {
            dispatch(resetBookingFlow());
            navigate('/');
          }}
        />

        <div className="px-5">
          <ProgressBar percent={100} />

          <h1 className="font-bold text-lg mt-4 mb-4">Checkout</h1>

          <h2 className="font-bold text-sm mb-2">Summary</h2>
          <div className="space-y-1.5 mb-4">
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

          <h2 className="font-bold text-sm mb-2">Choose payment method</h2>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={method === 'card'} onChange={() => setMethod('card')} className="accent-primary" />
              Credit/Debit Card
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={method === 'wallet'} onChange={() => setMethod('wallet')} className="accent-primary" />
              Mobile Wallet
            </label>
          </div>

          {method === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-ink-muted">Name on card</label>
                <input
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Name on card"
                  className="w-full border border-outline rounded-lg px-3 py-2.5 mt-1 text-sm outline-none focus:border-primary"
                />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs text-ink-muted">Card number</label>
                <input
                  value={form.number}
                  onChange={update('number')}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  maxLength={19}
                  className="w-full border border-outline rounded-lg px-3 py-2.5 mt-1 text-sm outline-none focus:border-primary"
                />
                {errors.number && <p className="text-xs text-danger mt-1">{errors.number}</p>}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-ink-muted">Expiry date</label>
                  <input
                    value={form.expiry}
                    onChange={update('expiry')}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border border-outline rounded-lg px-3 py-2.5 mt-1 text-sm outline-none focus:border-primary"
                  />
                  {errors.expiry && <p className="text-xs text-danger mt-1">{errors.expiry}</p>}
                </div>
                <div className="flex-1">
                  <label className="text-xs text-ink-muted">CVC/CVV</label>
                  <input
                    value={form.cvv}
                    onChange={update('cvv')}
                    placeholder="CVC"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full border border-outline rounded-lg px-3 py-2.5 mt-1 text-sm outline-none focus:border-primary"
                  />
                  {errors.cvv && <p className="text-xs text-danger mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-ink-muted">
                <input
                  type="checkbox"
                  checked={saveDetails}
                  onChange={(e) => setSaveDetails(e.target.checked)}
                  className="accent-primary"
                />
                Save payment details for the next purchase
              </label>
            </div>
          )}
          {serverError && (
            <p className="text-sm text-danger bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-4">
              {serverError}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-[60px] left-0 right-0 max-w-app mx-auto p-5 bg-bg">
        <button
          onClick={handlePay}
          disabled={submitting}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg disabled:opacity-60"
        >
          {submitting ? 'Processing…' : 'Complete Payment'}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
