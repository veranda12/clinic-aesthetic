// Display-only star rating. Supports fractional values via an overlay clip,
// so it renders both integer review scores and the fractional average.
export function Stars({
  rating,
  className,
  size = 18,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  const row = (fill: string) => (
    <div className="flex" style={{ gap: size * 0.15 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={fill}
          aria-hidden="true"
        >
          <path d="M12 2.2l2.9 6.03 6.6.77-4.9 4.5 1.32 6.5L12 17.9 6.08 20.5l1.32-6.5-4.9-4.5 6.6-.77z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div
      className={`relative inline-flex ${className ?? ""}`}
      role="img"
      aria-label={`Rating ${rating.toFixed(1)} dari 5`}
    >
      <span className="text-line">{row("currentColor")}</span>
      <span
        className="absolute inset-0 overflow-hidden text-clay"
        style={{ width: `${pct}%` }}
      >
        {row("currentColor")}
      </span>
    </div>
  );
}
