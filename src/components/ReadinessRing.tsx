import { getReadinessLevel } from '../lib/readiness';

type Props = {
  score: number;
  size?: number;
  label?: string;
};

export default function ReadinessRing({ score, size = 44, label }: Props) {
  const level = getReadinessLevel(score);
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference;
  return (
    <span className={`readiness-ring level-${level}`} style={{ width: size, height: size }} title={label ?? `${score}% ready`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} className="readiness-ring__track" fill="none" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="readiness-ring__fill"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="readiness-ring__value">{score}</span>
    </span>
  );
}
