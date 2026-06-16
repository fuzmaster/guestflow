import type { Guest } from '../types';
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

export default function TodayPage({ guests, openGuest }: { guests: Guest[]; openGuest: (id: string) => void }) {
  const followUps = getGuestsNeedingFollowUpToday(guests);
  const recordingSoon = getGuestsRecordingSoon(guests);
  const launchingSoon = getGuestsLaunchingSoon(guests);
  const collab = getGuestsNeedingCollabAttention(guests);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Today</p>
          <h2>Who needs a nudge?</h2>
        </div>
        <p className="muted">Follow-ups, recordings, launches, and social sharing in one place.</p>
      </header>

      <section className="dashboard-section">
        <h3>Needs follow-up today</h3>
        <div className="card-list">
          {followUps.length ? followUps.map((guest) => <GuestCard key={guest.id} guest={guest} onClick={() => openGuest(guest.id)} />) : <EmptyState title="No follow-ups due" body="Nothing is overdue right now. Nice." />}
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Recording soon</h3>
        <div className="table-card">
          {recordingSoon.length ? recordingSoon.map((guest) => (
            <button className="row-button" key={guest.id} onClick={() => openGuest(guest.id)}>
              <span><strong>{guest.name}</strong><small>{guest.company}</small></span>
              <span>{formatDate(guest.recordingDate)}</span>
              <span>Missing: {getMissingAssets(guest).join(', ') || 'None'}</span>
              <span>{getSuggestedNextAction(guest)}</span>
            </button>
          )) : <EmptyState title="No recordings soon" body="No guest is scheduled in the next three days." />}
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Launch soon</h3>
        <div className="table-card">
          {launchingSoon.length ? launchingSoon.map((guest) => (
            <button className="row-button" key={guest.id} onClick={() => openGuest(guest.id)}>
              <span><strong>{guest.name}</strong><small>{guest.episodeTitle}</small></span>
              <span>{formatDate(guest.launchDate)}</span>
              <span>Share checklist: {getShareChecklistProgress(guest).label}</span>
              <span>{getSuggestedNextAction(guest)}</span>
            </button>
          )) : <EmptyState title="No launches soon" body="No launch is scheduled in the next three days." />}
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Social collab needs attention</h3>
        <div className="card-list">
          {collab.length ? collab.map((guest) => <GuestCard key={guest.id} guest={guest} onClick={() => openGuest(guest.id)} />) : <EmptyState title="Social is clean" body="No live episodes need collab or sharing nudges." />}
        </div>
      </section>
    </div>
  );
}
