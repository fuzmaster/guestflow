import type { Guest } from '../types';
import { getAssetStatus } from '../lib/guestLogic';
import { templates } from '../data/templates';
import { renderTemplate } from '../lib/guestLogic';
import StatusPill from '../components/StatusPill';
import EmptyState from '../components/EmptyState';

const groups = [
  { label: 'Missing bio', field: 'Bio' },
  { label: 'Missing headshot', field: 'Headshot' },
  { label: 'Missing social handles', field: 'Social handles' },
  { label: 'Missing release form', field: 'Release form' },
];

export default function MissingAssetsPage({ guests, openGuest }: { guests: Guest[]; openGuest: (id: string) => void }) {
  const assetTemplate = templates.find((template) => template.category === 'asset_request')!;

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Assets</p>
          <h2>Missing Assets</h2>
        </div>
        <p className="muted">Bios, headshots, handles, and release forms that block publishing.</p>
      </header>

      {groups.map((group) => {
        const rows = guests.filter((guest) => {
          const status = getAssetStatus(guest, group.field);
          return status === 'needed' || status === 'requested';
        });
        return (
          <section className="dashboard-section" key={group.field}>
            <h3>{group.label}</h3>
            <div className="table-card">
              {rows.length ? rows.map((guest) => (
                <div className="row-button as-div" key={`${group.field}-${guest.id}`}>
                  <button className="text-button" onClick={() => openGuest(guest.id)}><strong>{guest.name}</strong><small>{guest.company}</small></button>
                  <StatusPill stage={guest.stage} />
                  <span>{getAssetStatus(guest, group.field)}</span>
                  <span>{guest.preferredChannel}</span>
                  <button onClick={() => navigator.clipboard.writeText(renderTemplate(assetTemplate, guest))}>Copy message</button>
                </div>
              )) : <EmptyState title="Nothing missing here" body="No guest currently needs this asset." />}
            </div>
          </section>
        );
      })}
    </div>
  );
}
