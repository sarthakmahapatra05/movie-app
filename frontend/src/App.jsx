import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SelectTheatre from './pages/SelectTheatre';
import SelectSchedule from './pages/SelectSchedule';
import SelectSeats from './pages/SelectSeats';
import BookingSummary from './pages/BookingSummary';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
      <Route path="/theatres/:movieId" element={<ProtectedRoute><SelectTheatre /></ProtectedRoute>} />
      <Route path="/schedule/:movieId" element={<ProtectedRoute><SelectSchedule /></ProtectedRoute>} />
      <Route path="/seats" element={<ProtectedRoute><SelectSeats /></ProtectedRoute>} />
      <Route path="/summary" element={<ProtectedRoute><BookingSummary /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      <Route path="/favourites" element={<ProtectedRoute><Placeholder title="Favourites" /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}
