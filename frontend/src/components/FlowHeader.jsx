import { useNavigate } from 'react-router-dom';

const BackArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FlowHeader({ onCancel, showCancel = true, light = false }) {
  const navigate = useNavigate();
  const textClass = light ? 'text-white' : 'text-ink';
  const mutedClass = light ? 'text-white/80' : 'text-ink-muted';

  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2">
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-1 text-sm font-medium ${textClass}`}
        aria-label="Go back"
      >
        <BackArrow /> Back
      </button>
      {showCancel && (
        <button
          onClick={onCancel}
          className={`text-sm font-medium ${mutedClass}`}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
