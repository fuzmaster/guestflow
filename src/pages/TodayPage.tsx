import type { Guest, Page } from '../types';
import { formatDate } from '../lib/dates';
import {
  getGuestsLaunchingSoon,
  getGuestsNeedingCollabAttention,
  getGuestsNeedingFollowUpToday,
  getGuestsRecordingSoon,
  getMissingAssets,
  getShareChecklistProgress,
  getSuggestedNextAction,
} from '../lib/guestLogic';
import GuestCard from '../components/GuestCard';
import EmptyState from '../components/EmptyState';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';

type Props = {
  guests: Guest[];
  openGuest: (id: string, target?: Page) => void;
};

export default function TodayPage({ guests, openGuest }: Props) {
  const followUps = getGuestsNeedingFollowUpToday(guests);
  const recordingSoon = getGuestsRecordingSoon(guests);
  const launchingSoon = getGuestsLaunchingSoon(guests);
  const collab = getGuestsNeedingCollabAttention(guests);

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Today · Daily call sheet"
        title="Who needs a nudge?"
        sub="Follow-ups, recordings, launches, and social sharing — at a glance."
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left="Daily · 04 channels" right="Local · v0.1" />
      </div>

      <section className="page-section page-section--gap-lg">
        <p className="eyebrow">Needs follow-up today</p>
        {followUps.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {followUps.map((guest) => <GuestCard key={guest.id} guest={guest} onClick={() => openGuest(guest.id)} />)}
          </div>
        ) : (
          <EmptyState title="No follow-ups due" body="Nothing is overdue right now. Nice." />
        )}
      </section>

      <section className="page-section page-section--gap-lg">
        <p className="eyebrow">Recording soon</p>
        {recordingSoon.length ? (
          <div className="list-card">
            {recordingSoon.map((guest) => (
              <button className="row-button" key={guest.id} onClick={() => openGuest(guest.id)}>
                <span><strong>{guest.name}</strong><small>{guest.company}</small></span>
                <span>{formatDate(guest.recordingDate)}</span>
                <span>Missing: {getMissingAssets(guest).join(', ') || 'None'}</span>
                <span>{getSuggestedNextAction(guest)}</span>
                <span style={{ color: 'var(--accent)' }}>→</span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="No recordings soon" body="No guest is scheduled in the next three days." />
        )}
      </section>

      <section className="page-section page-section--gap-lg">
        <p className="eyebrow">Launch soon</p>
        {launchingSoon.length ? (
          <div className="list-card">
            {launchingSoon.map((guest) => (
              <button className="row-button" key={guest.id} onClick={() => openGuest(guest.id)}>
                <span><strong>{guest.name}</strong><small>{guest.episodeTitle}</small></span>
                <span>{formatDate(guest.launchDate)}</span>
                <span>Share: {getShareChecklistProgress(guest).label}</span>
                <span>{getSuggestedNextAction(guest)}</span>
                <span style={{ color: 'var(--accent)' }}>→</span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="No launches soon" body="No launch is scheduled in the next three days." />
        )}
      </section>

      <section className="page-section page-section--gap-lg">
        <p className="eyebrow">Social collab needs attention</p>
        {collab.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {collab.map((guest) => <GuestCard key={guest.id} guest={guest} onClick={() => openGuest(guest.id)} />)}
          </div>
        ) : (
          <EmptyState title="Social is clean" body="No live episodes need collab or sharing nudges." />
        )}
      </section>
    </div>
  );
}
