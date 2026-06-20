export default function ProgressBar({ percent = 25 }) {
  return (
    <div className="h-1.5 w-full bg-outline rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
