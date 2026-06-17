import type { Guest } from '../types';
import { getAssetStatus, renderTemplate } from '../lib/guestLogic';
import { templates } from '../data/templates';
import StatusPill from '../components/StatusPill';
import EmptyState from '../components/EmptyState';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';

const groups = [
  { label: 'Missing bio', field: 'Bio' },
  { label: 'Missing headshot', field: 'Headshot' },
  { label: 'Missing social handles', field: 'Social handles' },
  { label: 'Missing release form', field: 'Release form' },
];

export default function MissingAssetsPage({ guests, openGuest }: { guests: Guest[]; openGuest: (id: string) => void }) {
  const assetTemplate = templates.find((template) => template.category === 'asset_request')!;
  const totalMissing = guests.filter((g) => ['bioStatus', 'headshotStatus', 'socialHandleStatus', 'releaseFormStatus']
    .some((k) => g[k as keyof Guest] === 'needed' || g[k as keyof Guest] === 'requested')).length;

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Assets · Whats missing"
        title="Missing Assets"
        sub="Bios, headshots, handles, and release forms that block publishing."
        counter={{
          value: totalMissing.toString().padStart(2, '0'),
          label: 'Guests with gaps',
          tone: totalMissing > 0 ? 'soon' : 'quiet',
        }}
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left="Assets · 04 types" right="Block publish" />
      </div>

      {groups.map((group) => {
        const rows = guests.filter((guest) => {
          const status = getAssetStatus(guest, group.field);
          return status === 'needed' || status === 'requested';
        });
        return (
          <section className="page-section page-section--gap-lg" key={group.field}>
            <p className="eyebrow">{group.label}</p>
            {rows.length ? (
              <div className="list-card">
                {rows.map((guest) => (
                  <div className="row-button as-div" key={`${group.field}-${guest.id}`}>
                    <button className="text-button" onClick={() => openGuest(guest.id)}>
                      <strong>{guest.name}</strong>
                      <small>{guest.company}</small>
                    </button>
                    <StatusPill stage={guest.stage} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-2)' }}>
                      {getAssetStatus(guest, group.field)}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-2)' }}>
                      {guest.preferredChannel}
                    </span>
                    <button className="btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(renderTemplate(assetTemplate, guest))}>
                      Copy message
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nothing missing here" body="No guest currently needs this asset." />
            )}
          </section>
        );
      })}
    </div>
  );
}
