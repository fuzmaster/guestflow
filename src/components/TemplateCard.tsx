import { useState } from 'react';
import type { Guest, Template } from '../types';
import { renderTemplate } from '../lib/guestLogic';

type Props = {
  template: Template;
  guest?: Guest;
};

export default function TemplateCard({ template, guest }: Props) {
  const rendered = renderTemplate(template, guest);
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(rendered);
    } catch { /* noop */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className="template-card">
      <div className="card-topline">
        <div>
          <h4>{template.name}</h4>
          <p className="eyebrow" style={{ marginTop: 4 }}>{template.category.replace(/_/g, ' ')} · {template.channel}</p>
        </div>
        <button className="btn-ghost btn-sm" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <p>{rendered}</p>
    </article>
  );
}
