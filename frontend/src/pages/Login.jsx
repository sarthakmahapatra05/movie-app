import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/endpoints';
import { setCredentials } from '../redux/slices/authSlice';

const SofaLogo = () => (
  <img src="/loveseat.png" alt="Logo" className="w-32 h-32 object-contain" />
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <button className="flex-1 py-2.5 rounded-md bg-white font-semibold text-sm text-ink shadow-sm">
            Login
          </button>
          <Link
            to="/signup"
            className="flex-1 py-2.5 rounded-md font-medium text-sm text-ink-muted text-center"
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-outline pb-2 bg-transparent text-sm placeholder:text-ink-faint focus:border-primary outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-outline pb-2 bg-transparent text-sm placeholder:text-ink-faint focus:border-primary outline-none"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <p className="text-xs text-ink-muted bg-primary-light rounded-md px-3 py-2">
            Demo credentials — email: <strong>demo@upaay.com</strong>, password: <strong>password123</strong>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg mt-10 disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
