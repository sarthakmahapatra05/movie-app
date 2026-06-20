import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/endpoints';
import { setCredentials } from '../redux/slices/authSlice';

const SofaLogo = () => (
  <img src="/loveseat.png" alt="Logo" className="w-32 h-32 object-contain" />
);

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.signup(form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell items-center justify-center px-6">
      <div className="w-full pt-16">
        <div className="flex justify-center mb-4">
          <SofaLogo />
        </div>
        <h1 className="text-center text-xl font-bold text-ink mb-8 leading-tight">
          Creative Upaay<br />Hiring Assignment
        </h1>

        <div className="flex bg-gray-200 rounded-lg p-1 mb-8">
          <Link
            to="/login"
            className="flex-1 py-2.5 rounded-md font-medium text-sm text-ink-muted text-center"
          >
            Login
          </Link>
          <button className="flex-1 py-2.5 rounded-md bg-white font-semibold text-sm text-ink shadow-sm">
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={update('name')}
            className="w-full border-b border-outline pb-2 bg-transparent text-sm placeholder:text-ink-faint focus:border-primary outline-none"
          />
          <input
            type="email"
            placeholder="Email ID"
            value={form.email}
            onChange={update('email')}
            className="w-full border-b border-outline pb-2 bg-transparent text-sm placeholder:text-ink-faint focus:border-primary outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            className="w-full border-b border-outline pb-2 bg-transparent text-sm placeholder:text-ink-faint focus:border-primary outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            className="w-full border-b border-outline pb-2 bg-transparent text-sm placeholder:text-ink-faint focus:border-primary outline-none"
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg mt-6 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
