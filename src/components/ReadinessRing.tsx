import { getReadinessLevel } from '../lib/readiness';

type Props = {
  score: number;
  size?: number;
  label?: string;
  showValue?: boolean;
  strokeWidth?: number;
};

export default function ReadinessRing({ score, size = 44, label, showValue = true, strokeWidth }: Props) {
  const level = getReadinessLevel(score);
  const stroke = strokeWidth ?? (size >= 100 ? 4 : size >= 60 ? 3.5 : 3);
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score));
  const dash = (safeScore / 100) * circumference;
  const fontSize = Math.max(10, Math.round(size * 0.26));
  return (
    <span
      className={`readiness-ring level-${level}`}
      style={{ width: size, height: size, ['--circ' as never]: circumference }}
      title={label ?? `${score}% ready`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} className="readiness-ring__track" fill="none" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="readiness-ring__fill"
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showValue && <span className="readiness-ring__value" style={{ fontSize }}>{score}</span>}
    </span>
  );
}
