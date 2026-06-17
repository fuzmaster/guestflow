import { useState } from 'react';
import type { Guest } from '../types';
import { templates } from '../data/templates';
import TemplateCard from '../components/TemplateCard';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';

export default function TemplatesPage({ guests, selectedGuest }: { guests: Guest[]; selectedGuest?: Guest }) {
  const [guestId, setGuestId] = useState(selectedGuest?.id ?? guests[0]?.id ?? '');
  const guest = guests.find((item) => item.id === guestId) ?? selectedGuest;

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Copy · Message bank"
        title="Templates"
        sub="Copyable starting points for every step of the workflow. Edit before sending."
        right={
          <label className="select-guest">Preview for guest
            <select value={guestId} onChange={(event) => setGuestId(event.target.value)}>
              {guests.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        }
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left={`Bank · ${templates.length.toString().padStart(2, '0')} entries`} right="Copy · paste" />
      </div>

      <section className="page-section page-section--gap-md">
        <div className="template-grid">
          {templates.map((template) => <TemplateCard key={template.id} template={template} guest={guest} />)}
        </div>
      </section>
    </div>
  );
}
