import { useState } from 'react';
import type { AssetStatus, Guest } from '../types';
import { formatDate } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress, getSuggestedNextAction } from '../lib/guestLogic';
import { getReadinessScore, getReadinessSignals } from '../lib/readiness';
import { guestPortalUrl } from '../lib/portal';
import StatusPill from '../components/StatusPill';
import ChecklistItem from '../components/ChecklistItem';
import GuestForm from '../components/GuestForm';
import ReadinessRing from '../components/ReadinessRing';
import CopyLinkButton from '../components/CopyLinkButton';

const assetOptions: AssetStatus[] = ['needed', 'requested', 'received', 'not_needed'];

type Props = {
  guest: Guest;
  upsertGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
  openPortal: (id: string) => void;
};

export default function GuestDetailPage({ guest, upsertGuest, deleteGuest, openPortal }: Props) {
  const [editing, setEditing] = useState(false);
  const share = getShareChecklistProgress(guest);
  const score = getReadinessScore(guest);
  const signals = getReadinessSignals(guest);

  function update<K extends keyof Guest>(key: K, value: Guest[K]) {
    upsertGuest({ ...guest, [key]: value });
  }

  return (
    <aside className="detail-panel gf-scroll">
      <div className="detail-panel__head">
        <div>
          <p className="eyebrow">Guest detail</p>
          <h2>{guest.name}</h2>
          <p className="detail-panel__meta">{guest.title}{guest.title && guest.company ? ' · ' : ''}{guest.company}</p>
        </div>
        <StatusPill stage={guest.stage} />
      </div>

      <div className="readiness-banner">
        <ReadinessRing score={score} size={72} strokeWidth={4} />
        <div>
          <strong>{score}% ready</strong>
          <p className="muted" style={{ fontSize: 12, margin: 0 }}>
            {signals.filter((s) => s.done).length} of {signals.length} prep items complete.
          </p>
        </div>
      </div>

      <div className="action-banner">
        <span>Next best action</span>
        <strong>{getSuggestedNextAction(guest)}</strong>
      </div>

      <div className="button-row">
        <button className="btn-ghost btn-sm" onClick={() => setEditing((value) => !value)}>{editing ? 'Close edit' : 'Edit guest'}</button>
        <button className="btn-ghost btn-sm" onClick={() => openPortal(guest.id)}>Open portal</button>
        <CopyLinkButton value={guestPortalUrl(guest)} label="Copy link" />
        <button className="btn-danger" onClick={() => deleteGuest(guest.id)}>Delete</button>
      </div>
      <p className="share-warning">Anyone with this link sees the portal. Don't post it publicly.</p>

      {editing ? (
        <GuestForm guest={guest} onSave={(nextGuest) => { upsertGuest(nextGuest); setEditing(false); }} onCancel={() => setEditing(false)} />
      ) : (
        <div className="detail-grid">
          <section>
            <h3>Profile</h3>
            <p>Email: {guest.email || 'Not set'}</p>
            <p>Instagram: {guest.instagram || 'Not set'}</p>
            <p>LinkedIn: {guest.linkedin || 'Not set'}</p>
            <p>Preferred: {guest.preferredChannel}</p>
          </section>
          <section>
            <h3>Episode</h3>
            <p>Show: {guest.showName}</p>
            <p>Episode: {guest.episodeTitle || 'Not set'}</p>
            <p>Recording: {formatDate(guest.recordingDate)}</p>
            <p>Launch: {formatDate(guest.launchDate)}</p>
            <p>Portal: guestflow.app/g/{guest.guestPortalSlug}</p>
          </section>
          <section>
            <h3>Follow-up</h3>
            <p>Last contacted: {formatDate(guest.lastContactedAt)}</p>
            <p>Last response: {formatDate(guest.lastResponseAt)}</p>
            <label>Next follow-up<input type="date" value={guest.nextFollowUpAt ?? ''} onChange={(e) => update('nextFollowUpAt', e.target.value)} /></label>
            {guest.notes && <p style={{ marginTop: 10, color: 'var(--muted)' }}>{guest.notes}</p>}
          </section>
          <section>
            <h3>Asset checklist</h3>
            {([
              ['bioStatus', 'Bio'],
              ['headshotStatus', 'Headshot'],
              ['socialHandleStatus', 'Social handles'],
              ['releaseFormStatus', 'Release form'],
            ] as const).map(([key, label]) => (
              <label className="inline-label" key={key}>{label}
                <select value={guest[key]} onChange={(e) => update(key, e.target.value as AssetStatus)}>
                  {assetOptions.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            ))}
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>Missing: {getMissingAssets(guest).join(', ') || 'None'}</p>
          </section>
          <section>
            <h3>Launch / share checklist</h3>
            <p className="muted" style={{ fontSize: 12 }}>Progress: {share.label}</p>
            <ChecklistItem label="Episode link sent" checked={guest.episodeLinkSent} onChange={(value) => update('episodeLinkSent', value)} />
            <ChecklistItem label="Clips sent" checked={guest.clipsSent} onChange={(value) => update('clipsSent', value)} />
            <ChecklistItem label="Suggested copy sent" checked={guest.suggestedCopySent} onChange={(value) => update('suggestedCopySent', value)} />
            <ChecklistItem label="Instagram collab invite sent" checked={guest.instagramCollabInviteSent} onChange={(value) => update('instagramCollabInviteSent', value)} />
            <ChecklistItem label="Instagram collab accepted" checked={guest.instagramCollabAccepted} onChange={(value) => update('instagramCollabAccepted', value)} />
            <ChecklistItem label="Guest shared" checked={guest.guestShared} onChange={(value) => update('guestShared', value)} />
            <ChecklistItem label="Thank-you sent" checked={guest.thankYouSent} onChange={(value) => update('thankYouSent', value)} />
          </section>
        </div>
      )}
    </aside>
  );
}
