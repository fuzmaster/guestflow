import { useState } from 'react';
import type { AssetStatus, AvailableDate, Guest, ProducerMessage, RecordingType, TranscriptStatus } from '../types';
import { formatDate } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress, getSuggestedNextAction } from '../lib/guestLogic';
import { getReadinessScore, getReadinessSignals } from '../lib/readiness';
import { guestPortalUrl } from '../lib/portal';
import { shareKitUrl } from '../lib/shareKit';
import StatusPill from '../components/StatusPill';
import ChecklistItem from '../components/ChecklistItem';
import GuestForm from '../components/GuestForm';
import ReadinessRing from '../components/ReadinessRing';
import CopyLinkButton from '../components/CopyLinkButton';

const assetOptions: AssetStatus[] = ['needed', 'requested', 'received', 'not_needed'];
const recordingTypes: { value: RecordingType; label: string }[] = [
  { value: 'in_person_preferred', label: 'In-person preferred' },
  { value: 'remote_requested', label: 'Remote requested' },
  { value: 'remote_approved', label: 'Remote approved' },
  { value: 'remote_only', label: 'Remote only' },
];
const transcriptStatuses: { value: TranscriptStatus; label: string }[] = [
  { value: 'not_available', label: 'Not available' },
  { value: 'available', label: 'Available' },
  { value: 'review_requested', label: 'Review requested' },
  { value: 'review_complete', label: 'Review complete' },
];

type Props = {
  guest: Guest;
  upsertGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
  openPortal: (id: string) => void;
};

export default function GuestDetailPage({ guest, upsertGuest, deleteGuest, openPortal }: Props) {
  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newDateWindow, setNewDateWindow] = useState('10:00 AM');
  const [newMessage, setNewMessage] = useState({ title: '', body: '' });

  const share = getShareChecklistProgress(guest);
  const score = getReadinessScore(guest);
  const signals = getReadinessSignals(guest);

  function update<K extends keyof Guest>(key: K, value: Guest[K]) {
    upsertGuest({ ...guest, [key]: value });
  }

  function addAvailableDate() {
    if (!newDate) return;
    const date: AvailableDate = {
      id: crypto.randomUUID(),
      date: newDate,
      timeWindow: newDateWindow || '',
      status: 'open',
    };
    upsertGuest({ ...guest, availableDates: [...guest.availableDates, date] });
    setNewDate('');
  }

  function removeAvailableDate(id: string) {
    const next = guest.availableDates.filter((d) => d.id !== id);
    const patch: Partial<Guest> = { availableDates: next };
    if (guest.selectedDateId === id) patch.selectedDateId = undefined;
    if (guest.confirmedDateId === id) patch.confirmedDateId = undefined;
    upsertGuest({ ...guest, ...patch });
  }

  function markDateSelected(id: string) {
    const updated = guest.availableDates.map((d) =>
      d.id === id ? { ...d, status: 'selected' as const } : d.status === 'selected' ? { ...d, status: 'open' as const } : d,
    );
    const date = updated.find((d) => d.id === id);
    upsertGuest({
      ...guest,
      availableDates: updated,
      selectedDateId: id,
      stage: 'date_selected',
      recordingDate: date?.date ?? guest.recordingDate,
    });
  }

  function confirmDate(id: string) {
    const updated = guest.availableDates.map((d) =>
      d.id === id ? { ...d, status: 'confirmed' as const } : d,
    );
    const date = updated.find((d) => d.id === id);
    upsertGuest({
      ...guest,
      availableDates: updated,
      selectedDateId: id,
      confirmedDateId: id,
      stage: 'recording_confirmed',
      recordingDate: date?.date ?? guest.recordingDate,
    });
  }

  function addMessage(visibility: ProducerMessage['visibility']) {
    if (!newMessage.title.trim() && !newMessage.body.trim()) return;
    const message: ProducerMessage = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: newMessage.title.trim() || 'Update',
      body: newMessage.body.trim(),
      type: 'info',
      visibility,
    };
    upsertGuest({ ...guest, messages: [message, ...guest.messages] });
    setNewMessage({ title: '', body: '' });
  }

  function removeMessage(id: string) {
    upsertGuest({ ...guest, messages: guest.messages.filter((m) => m.id !== id) });
  }

  function removeGuestNote(id: string) {
    upsertGuest({ ...guest, guestNotes: guest.guestNotes.filter((n) => n.id !== id) });
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
        <CopyLinkButton value={guestPortalUrl(guest)} label="Copy portal link" />
        <CopyLinkButton value={shareKitUrl(guest)} label="Copy share kit" />
        <button className="btn-danger" onClick={() => deleteGuest(guest.id)}>Delete</button>
      </div>
      <p className="share-warning">Anyone with these links sees the portal. Don't post them publicly.</p>

      {editing ? (
        <GuestForm guest={guest} onSave={(nextGuest) => { upsertGuest(nextGuest); setEditing(false); }} onCancel={() => setEditing(false)} />
      ) : (
        <div className="detail-grid">
          <section>
            <h3>Profile &amp; outreach</h3>
            <p>Email: {guest.email || 'Not set'}</p>
            <p>Instagram: {guest.instagram || 'Not set'}</p>
            <p>LinkedIn: {guest.linkedin || 'Not set'}</p>
            <p>Source: {guest.source ? guest.source.replace(/_/g, ' ') : 'Not set'}</p>
            <p>Preferred channel: {guest.preferredChannel}</p>
            <p>First contacted: {formatDate(guest.firstContactedAt)}</p>
            <p>Last response: {formatDate(guest.lastResponseAt)}</p>
            <label>Next follow-up<input type="date" value={guest.nextFollowUpAt ?? ''} onChange={(e) => update('nextFollowUpAt', e.target.value)} /></label>
          </section>

          <section>
            <h3>Scheduling</h3>
            <label className="inline-label">Recording type
              <select value={guest.recordingType} onChange={(e) => update('recordingType', e.target.value as RecordingType)}>
                {recordingTypes.map((rt) => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
              </select>
            </label>
            {(guest.recordingType === 'remote_approved' || guest.recordingType === 'remote_only' || guest.recordingType === 'remote_requested') && (
              <label>Riverside / remote link<input value={guest.riversideLink ?? ''} onChange={(e) => update('riversideLink', e.target.value)} /></label>
            )}
            <label>Scheduling notes<textarea value={guest.schedulingNotes ?? ''} onChange={(e) => update('schedulingNotes', e.target.value)} /></label>

            <p className="eyebrow" style={{ marginTop: 14 }}>Available dates</p>
            {guest.availableDates.length === 0 && <p className="muted" style={{ fontSize: 12 }}>None yet. Add a date so it shows up in the portal date picker.</p>}
            {guest.availableDates.map((d) => (
              <div key={d.id} className="detail-date-row">
                <div>
                  <strong>{formatDate(d.date)}</strong>
                  <small>{d.timeWindow || 'any time'} · {d.status}</small>
                </div>
                <div className="detail-date-row__actions">
                  {d.status !== 'confirmed' && (
                    <button className="btn-ghost btn-sm" onClick={() => markDateSelected(d.id)}>Mark selected</button>
                  )}
                  {d.status !== 'confirmed' && (
                    <button className="btn-primary btn-sm" onClick={() => confirmDate(d.id)}>Confirm</button>
                  )}
                  <button className="btn-danger" onClick={() => removeAvailableDate(d.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="form-grid">
              <label>New date<input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} /></label>
              <label>Time window<input value={newDateWindow} onChange={(e) => setNewDateWindow(e.target.value)} placeholder="10:00 AM" /></label>
            </div>
            <button className="btn-ghost btn-sm" onClick={addAvailableDate} disabled={!newDate}>Add date</button>
          </section>

          <section>
            <h3>Episode</h3>
            <p>Show: {guest.showName}</p>
            <p>Episode: {guest.episodeTitle || 'Not set'}</p>
            <p>Recording date: {formatDate(guest.recordingDate)}</p>
            <p>Launch: {formatDate(guest.launchDate)}</p>
            <p>Portal: guestflow.app/g/{guest.guestPortalSlug}</p>
            <p>Share kit: guestflow.app/share/{guest.guestPortalSlug}</p>
          </section>

          <section>
            <h3>What we still need</h3>
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
            <h3>Messages</h3>
            <p className="muted" style={{ fontSize: 12 }}>Guest-visible messages appear on the portal. Internal ones stay here.</p>
            <label>Title<input value={newMessage.title} onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })} placeholder="e.g. You picked a date — thank you" /></label>
            <label>Body<textarea value={newMessage.body} onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })} /></label>
            <div className="button-row">
              <button className="btn-primary btn-sm" onClick={() => addMessage('guest_visible')} disabled={!newMessage.body.trim() && !newMessage.title.trim()}>Send to guest</button>
              <button className="btn-ghost btn-sm" onClick={() => addMessage('internal_only')} disabled={!newMessage.body.trim() && !newMessage.title.trim()}>Save internal note</button>
            </div>
            <ul className="detail-message-list">
              {guest.messages.map((m) => (
                <li key={m.id}>
                  <div className="detail-message-list__head">
                    <span className={`pill pill-${m.visibility === 'guest_visible' ? 'green' : 'gray'}`}>{m.visibility === 'guest_visible' ? 'Guest' : 'Internal'}</span>
                    <small>{formatDate(m.createdAt.slice(0, 10))}</small>
                  </div>
                  <strong>{m.title}</strong>
                  <p>{m.body}</p>
                  <button className="btn-danger btn-sm" onClick={() => removeMessage(m.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </section>

          {guest.guestNotes.length > 0 && (
            <section>
              <h3>Guest-submitted notes</h3>
              <p className="muted" style={{ fontSize: 12 }}>From the guest portal note box. Demo / local mode — real cross-device submissions need a backend.</p>
              <ul className="detail-message-list">
                {guest.guestNotes.map((n) => (
                  <li key={n.id}>
                    <div className="detail-message-list__head">
                      <span className="pill pill-cyan">{n.type.replace(/_/g, ' ')}</span>
                      <small>{formatDate(n.createdAt.slice(0, 10))}</small>
                    </div>
                    <p>{n.body}</p>
                    <button className="btn-danger btn-sm" onClick={() => removeGuestNote(n.id)}>Dismiss</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3>Podcast prep</h3>
            <label>Suggested topics<textarea value={guest.suggestedTopics ?? ''} onChange={(e) => update('suggestedTopics', e.target.value)} /></label>
            <label>Questions to ask<textarea value={guest.questionsToAsk ?? ''} onChange={(e) => update('questionsToAsk', e.target.value)} /></label>
            <label>Guest-provided topics<textarea value={guest.guestProvidedTopics ?? ''} onChange={(e) => update('guestProvidedTopics', e.target.value)} /></label>
          </section>

          <section>
            <h3>Transcript review</h3>
            <label className="inline-label">Status
              <select value={guest.transcriptStatus} onChange={(e) => update('transcriptStatus', e.target.value as TranscriptStatus)}>
                {transcriptStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label>Transcript link<input value={guest.transcriptLink ?? ''} onChange={(e) => update('transcriptLink', e.target.value)} /></label>
            <label>Producer notes<textarea value={guest.transcriptNotes ?? ''} onChange={(e) => update('transcriptNotes', e.target.value)} /></label>
          </section>

          <section>
            <h3>Launch &amp; share kit</h3>
            <p className="muted" style={{ fontSize: 12 }}>Progress: {share.label}</p>
            <label>Launch date<input type="date" value={guest.launchDate ?? ''} onChange={(e) => update('launchDate', e.target.value)} /></label>
            <label>YouTube<input value={guest.youtubeLink ?? ''} onChange={(e) => update('youtubeLink', e.target.value)} /></label>
            <label>Spotify<input value={guest.spotifyLink ?? ''} onChange={(e) => update('spotifyLink', e.target.value)} /></label>
            <label>Apple Podcasts<input value={guest.appleLink ?? ''} onChange={(e) => update('appleLink', e.target.value)} /></label>
            <label>Website episode link<input value={guest.websiteEpisodeLink ?? ''} onChange={(e) => update('websiteEpisodeLink', e.target.value)} /></label>
            <label>Suggested post copy<textarea value={guest.suggestedPostCopy ?? ''} onChange={(e) => update('suggestedPostCopy', e.target.value)} /></label>
            <label>Team / coworker share message<textarea value={guest.teamShareMessage ?? ''} onChange={(e) => update('teamShareMessage', e.target.value)} /></label>
            <ChecklistItem label="Episode link sent" checked={guest.episodeLinkSent} onChange={(value) => update('episodeLinkSent', value)} />
            <ChecklistItem label="Clips sent" checked={guest.clipsSent} onChange={(value) => update('clipsSent', value)} />
            <ChecklistItem label="Suggested copy sent" checked={guest.suggestedCopySent} onChange={(value) => update('suggestedCopySent', value)} />
            <ChecklistItem label="Instagram collab invite sent" checked={guest.instagramCollabInviteSent} onChange={(value) => update('instagramCollabInviteSent', value)} />
            <ChecklistItem label="Instagram collab accepted" checked={guest.instagramCollabAccepted} onChange={(value) => update('instagramCollabAccepted', value)} />
            <ChecklistItem label="Guest shared" checked={guest.guestShared} onChange={(value) => update('guestShared', value)} />
            <ChecklistItem label="Thank-you sent" checked={guest.thankYouSent} onChange={(value) => update('thankYouSent', value)} />
          </section>

          <section>
            <h3>Internal notes</h3>
            <label>Notes<textarea value={guest.notes} onChange={(e) => update('notes', e.target.value)} /></label>
          </section>
        </div>
      )}
    </aside>
  );
}
