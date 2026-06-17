import type { ReactNode } from 'react';

type CounterTone = 'critical' | 'soon' | 'quiet';

type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
  counter?: { value: string; label: string; tone?: CounterTone };
  right?: ReactNode;
};

export default function PageHero({ eyebrow, title, sub, counter, right }: Props) {
  return (
    <header className="page-hero">
      <div className="page-hero__inner">
        <div className="page-hero__text">
          <p className="eyebrow eyebrow--accent">{eyebrow}</p>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        {counter && (
          <div className="page-hero__counter">
            <strong className={`is-${counter.tone ?? 'quiet'}`}>{counter.value}</strong>
            <span>{counter.label}</span>
          </div>
        )}
        {right}
      </div>
    </header>
  );
}
