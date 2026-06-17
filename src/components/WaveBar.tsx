type Props = {
  bars?: number;
  size?: 'sm' | 'md' | 'lg';
  quiet?: boolean;
  className?: string;
};

const HEIGHTS = [40, 80, 60, 100, 55, 110, 75, 95, 50, 120, 65, 90, 55, 105, 70, 85, 60, 95, 50, 80];

export default function WaveBar({ bars = 18, size = 'sm', quiet = false, className }: Props) {
  const list = Array.from({ length: bars }, (_, i) => HEIGHTS[i % HEIGHTS.length]);
  const classes = [
    'wave-bars',
    size === 'lg' ? 'wave-bars--tall' : '',
    size === 'sm' ? 'wave-bars--mini' : '',
    quiet ? 'wave-bars--quiet' : '',
    className ?? '',
  ].filter(Boolean).join(' ');
  return (
    <div className={classes} aria-hidden="true">
      {list.map((height, index) => (
        <span
          key={index}
          style={{
            height: `${height}%`,
            animationDelay: `${(index * 90) % 1400}ms`,
          }}
        />
      ))}
    </div>
  );
}
