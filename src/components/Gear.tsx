interface GearProps {
  teeth?: number;
  size?: number;
  className?: string;
  spin?: "cw" | "ccw" | "none";
  speed?: number;
}

/** Процедурно генерирано зъбчато колело (steampunk акцент). */
export default function Gear({
  teeth = 12,
  size = 80,
  className = "",
  spin = "none",
  speed = 18,
}: GearProps) {
  const cx = 50;
  const cy = 50;
  const outer = 46;
  const inner = 38;
  const toothW = 0.45; // делът от ъгъла на зъба
  const points: string[] = [];

  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const step = (1 / teeth) * Math.PI * 2;
    const a1 = a0 + step * (0.5 - toothW / 2);
    const a2 = a0 + step * (0.5 + toothW / 2);
    const a3 = a0 + step;
    points.push(`${cx + inner * Math.cos(a0)},${cy + inner * Math.sin(a0)}`);
    points.push(`${cx + outer * Math.cos(a1)},${cy + outer * Math.sin(a1)}`);
    points.push(`${cx + outer * Math.cos(a2)},${cy + outer * Math.sin(a2)}`);
    points.push(`${cx + inner * Math.cos(a3)},${cy + inner * Math.sin(a3)}`);
  }

  const spinClass =
    spin === "cw" ? "gear-cw" : spin === "ccw" ? "gear-ccw" : "";

  return (
    <svg
      className={`gear ${spinClass} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ animationDuration: `${speed}s` }}
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={points.join(" ")} />
      <circle cx={cx} cy={cy} r={16} className="gear-hub" />
      <circle cx={cx} cy={cy} r={6} className="gear-bore" />
    </svg>
  );
}
