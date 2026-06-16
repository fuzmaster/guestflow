import type { Guest } from '../types';
import { formatDate } from '../lib/dates';
import { getSuggestedNextAction } from '../lib/guestLogic';
import ChecklistItem from '../components/ChecklistItem';

type Props = {
  guests: Guest[];
  openGuest: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
};

export default function LaunchSharePage({ guests, openGuest, upsertGuest }: Props) {
  const launchGuests = guests.filter((guest) => ['launch_soon', 'live', 'needs_share', 'done'].includes(guest.stage) || guest.launchDate);

  function update(guest: Guest, key: keyof Guest, value: boolean) {
    upsertGuest({ ...guest, [key]: value });
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Launch</p>
          <h2>Launch / Share</h2>
        </div>
        <p className="muted">A practical checklist for live episodes and launch-day nudges.</p>
      </header>
      <div className="launch-table">
        {launchGuests.map((guest) => (
          <article className="launch-row" key={guest.id}>
            <button className="text-button" onClick={() => openGuest(guest.id)}>
              <strong>{guest.name}</strong>
              <small>{guest.episodeTitle || guest.showName}</small>
            </button>
            <span>{formatDate(guest.launchDate)}</span>
            <ChecklistItem label="Link sent" checked={guest.episodeLinkSent} onChange={(value) => update(guest, 'episodeLinkSent', value)} />
            <ChecklistItem label="Clips sent" checked={guest.clipsSent} onChange={(value) => update(guest, 'clipsSent', value)} />
            <ChecklistItem label="Copy sent" checked={guest.suggestedCopySent} onChange={(value) => update(guest, 'suggestedCopySent', value)} />
            <ChecklistItem label="Collab sent" checked={guest.instagramCollabInviteSent} onChange={(value) => update(guest, 'instagramCollabInviteSent', value)} />
            <ChecklistItem label="Collab accepted" checked={guest.instagramCollabAccepted} onChange={(value) => update(guest, 'instagramCollabAccepted', value)} />
            <ChecklistItem label="Guest shared" checked={guest.guestShared} onChange={(value) => update(guest, 'guestShared', value)} />
            <ChecklistItem label="Thank-you" checked={guest.thankYouSent} onChange={(value) => update(guest, 'thankYouSent', value)} />
            <strong>{getSuggestedNextAction(guest)}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
