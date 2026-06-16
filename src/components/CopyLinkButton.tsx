import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  label?: string;
  className?: string;
};

export default function CopyLinkButton({ value, label = 'Copy guest portal link', className }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <span className={`copy-link ${className ?? ''}`.trim()}>
      <button type="button" onClick={copy} aria-live="polite">{copied ? 'Copied' : label}</button>
      <span className={`copy-link__hint ${copied ? 'is-visible' : ''}`} aria-hidden="true">{value}</span>
    </span>
  );
}
