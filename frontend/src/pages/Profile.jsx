import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <div className="app-content px-5 pt-8">
        <h1 className="font-bold text-lg mb-6">Profile</h1>
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-sm text-ink-muted">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full border border-danger text-danger font-semibold py-3 rounded-lg"
        >
          Log Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
