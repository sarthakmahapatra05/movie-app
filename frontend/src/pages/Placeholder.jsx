import BottomNav from '../components/BottomNav';

export default function Placeholder({ title }) {
  return (
    <div className="app-shell">
      <div className="app-content flex items-center justify-center">
        <p className="text-sm text-ink-muted">{title} — coming soon</p>
      </div>
      <BottomNav />
    </div>
  );
}
