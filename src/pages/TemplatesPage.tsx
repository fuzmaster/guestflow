import { useState } from 'react';
import type { Guest } from '../types';
import { templates } from '../data/templates';
import TemplateCard from '../components/TemplateCard';

export default function TemplatesPage({ guests, selectedGuest }: { guests: Guest[]; selectedGuest?: Guest }) {
  const [guestId, setGuestId] = useState(selectedGuest?.id ?? guests[0]?.id ?? '');
  const guest = guests.find((item) => item.id === guestId) ?? selectedGuest;

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Copy</p>
          <h2>Templates</h2>
        </div>
        <label className="select-guest">Preview for guest<select value={guestId} onChange={(event) => setGuestId(event.target.value)}>{guests.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      </header>
      <div className="template-grid">
        {templates.map((template) => <TemplateCard key={template.id} template={template} guest={guest} />)}
      </div>
    </div>
  );
}
