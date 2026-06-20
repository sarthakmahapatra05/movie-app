import { NavLink } from 'react-router-dom';

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5B4FE9' : '#A2A7B3'} strokeWidth="1.8">
    <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TicketIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5B4FE9' : '#A2A7B3'} strokeWidth="1.8">
    <path
      d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 6v12" strokeDasharray="2 2" />
  </svg>
);

const HeartIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5B4FE9' : '#A2A7B3'} strokeWidth="1.8">
    <path
      d="M12 20s-7-4.35-9.5-9C.8 7.2 3 4 6.5 4 9 4 11 6 12 7.5 13 6 15 4 17.5 4 21 4 23.2 7.2 21.5 11 19 15.65 12 20 12 20Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#5B4FE9' : '#A2A7B3'} strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.5-3.5 5-5 7.5-5s6 1.5 7.5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const items = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/bookings', icon: TicketIcon, label: 'Bookings' },
  { to: '/favourites', icon: HeartIcon, label: 'Favourites' },
  { to: '/profile', icon: ProfileIcon, label: 'Profile' }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-app mx-auto bg-white border-t border-outline flex items-center justify-around py-3 z-20">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className="flex flex-col items-center gap-0.5" end={to === '/'}>
          {({ isActive }) => <Icon active={isActive} />}
        </NavLink>
      ))}
    </nav>
  );
}
