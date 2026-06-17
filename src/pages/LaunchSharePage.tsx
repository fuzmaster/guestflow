import type { Guest } from '../types';
import { formatDate } from '../lib/dates';
import { getSuggestedNextAction } from '../lib/guestLogic';
import ChecklistItem from '../components/ChecklistItem';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';
import EmptyState from '../components/EmptyState';

type Props = {
  guests: Guest[];
  openGuest: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
};

export default function LaunchSharePage({ guests, openGuest, upsertGuest }: Props) {
  const launchGuests = guests.filter((guest) =>
    ['launch_soon', 'live', 'needs_share', 'done'].includes(guest.stage) || guest.launchDate,
  );

  function update(guest: Guest, key: keyof Guest, value: boolean) {
    upsertGuest({ ...guest, [key]: value });
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Launch · Share"
        title="Launch & Share"
        sub="A practical checklist for live episodes and launch-day nudges."
        counter={{
          value: launchGuests.length.toString().padStart(2, '0'),
          label: 'In launch window',
          tone: 'quiet',
        }}
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left="Pre-launch" right="Shared" />
      </div>

      <section className="page-section page-section--gap-md">
        {launchGuests.length === 0 ? (
          <EmptyState title="Nothing launching yet" body="Once you record and schedule an episode, it shows up here for sharing tracking." />
        ) : (
          launchGuests.map((guest) => (
            <article className="launch-row" key={guest.id}>
              <button className="text-button" onClick={() => openGuest(guest.id)}>
                <strong>{guest.name}</strong>
                <small>{guest.episodeTitle || guest.showName}</small>
              </button>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted-2)' }}>{formatDate(guest.launchDate)}</span>
              <ChecklistItem label="Link sent" checked={guest.episodeLinkSent} onChange={(value) => update(guest, 'episodeLinkSent', value)} />
              <ChecklistItem label="Clips sent" checked={guest.clipsSent} onChange={(value) => update(guest, 'clipsSent', value)} />
              <ChecklistItem label="Copy sent" checked={guest.suggestedCopySent} onChange={(value) => update(guest, 'suggestedCopySent', value)} />
              <ChecklistItem label="Collab sent" checked={guest.instagramCollabInviteSent} onChange={(value) => update(guest, 'instagramCollabInviteSent', value)} />
              <ChecklistItem label="Collab accepted" checked={guest.instagramCollabAccepted} onChange={(value) => update(guest, 'instagramCollabAccepted', value)} />
              <ChecklistItem label="Guest shared" checked={guest.guestShared} onChange={(value) => update(guest, 'guestShared', value)} />
              <ChecklistItem label="Thank-you" checked={guest.thankYouSent} onChange={(value) => update(guest, 'thankYouSent', value)} />
              <strong style={{ color: 'var(--accent)', fontSize: 13 }}>{getSuggestedNextAction(guest)}</strong>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
