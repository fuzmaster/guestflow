import type { Guest, Template } from '../types';
import { renderTemplate } from '../lib/guestLogic';

type Props = {
  template: Template;
  guest?: Guest;
};

export default function TemplateCard({ template, guest }: Props) {
  const rendered = renderTemplate(template, guest);
  async function copy() {
    await navigator.clipboard.writeText(rendered);
  }

  return (
    <article className="template-card">
      <div className="card-topline">
        <div>
          <strong>{template.name}</strong>
          <p className="muted">{template.category.replace(/_/g, ' ')} · {template.channel}</p>
        </div>
        <button onClick={copy}>Copy message</button>
      </div>
      <p>{rendered}</p>
    </article>
  );
}
