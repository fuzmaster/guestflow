import { useMemo, useState } from 'react';
import type { ClipLink, ClipPlatform, Guest } from '../types';
import { formatDate } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress } from '../lib/guestLogic';

const clipPlatforms: ClipPlatform[] = ['instagram', 'tiktok', 'youtube', 'linkedin', 'other'];

type Props = {
  guests: Guest[];
  selectedGuest?: Guest;
  setSelectedGuestId: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
};

function portalPath(guest: Guest) {
  return `/guest/${guest.guestPortalSlug || guest.id}`;
}

function fullPortalUrl(guest: Guest) {
  return `${window.location.origin}${portalPath(guest)}`;
}

function LinkButton({ label, url }: { label: string; url?: string }) {
  if (!url) return <span className="muted">{label}: Not added</span>;
  return <a className="portal-link" href={url} target="_blank" rel="noreferrer">{label}</a>;
}

function PortalPreview({ guest }: { guest: Guest }) {
  const missing = getMissingAssets(guest);
  const share = getShareChecklistProgress(guest);
  const liveLinks = [guest.youtubeLink, guest.spotifyLink, guest.appleLink, guest.episodeLink].filter(Boolean).length;

  return (
    <div className="portal-preview">
      <section className="portal-hero">
        <div>
          <p className="eyebrow">Guest hub</p>
          <h2>{guest.name}</h2>
          <p>{guest.episodeTitle || 'Episode details coming soon'} · {guest.showName}</p>
        </div>
        <div className="portal-scorecard">
          <span>{missing.length} missing assets</span>
          <span>{share.label} share steps done</span>
          <span>{guest.clipLinks.length} clips ready</span>
          <span>{liveLinks} live links</span>
        </div>
      </section>

      <section className="portal-card priority-card">
        <p className="eyebrow">What you need to do next</p>
        {missing.length > 0 ? (
          <strong>Send: {missing.join(', ')}</strong>
        ) : guest.stage === 'booked' || guest.stage === 'recording_soon' ? (
          <strong>Review the recording prep and arrival instructions.</strong>
        ) : guest.stage === 'live' || guest.stage === 'needs_share' ? (
          <strong>Share the episode and accept the Instagram collab invite.</strong>
        ) : (
          <strong>Everything important is collected here.</strong>
        )}
        <p className="muted">This replaces the messy pile of reminder emails, links, directions, launch copy, and clips.</p>
      </section>

      <div className="portal-grid">
        <section className="portal-card">
          <h3>Interview details</h3>
          <p><strong>Recording:</strong> {formatDate(guest.recordingDate)}</p>
          <p><strong>Launch:</strong> {formatDate(guest.launchDate)}</p>
          <p><strong>Host:</strong> {guest.hostName || 'Not added'}</p>
          <div className="portal-links">
            <LinkButton label="Calendar invite" url={guest.calendarLink} />
            <LinkButton label="Remote recording link" url={guest.recordingLink} />
          </div>
        </section>

        <section className="portal-card">
          <h3>Location / arrival</h3>
          <p><strong>{guest.interviewLocationName || 'Location not added'}</strong></p>
          <p>{guest.interviewAddress || 'Address not added yet.'}</p>
          <p><strong>Parking:</strong> {guest.parkingNotes || 'Parking notes not added yet.'}</p>
          <p><strong>Arrival:</strong> {guest.arrivalInstructions || 'Arrival instructions not added yet.'}</p>
        </section>

        <section className="portal-card">
          <h3>Recording prep</h3>
          <p>{guest.recordingPrepNotes || 'Prep notes not added yet.'}</p>
          <p className="muted">Keep this plain and specific. Guests should not have to ask what to expect.</p>
        </section>

        <section className="portal-card">
          <h3>Assets needed</h3>
          <ul className="portal-checklist">
            <li className={guest.bioStatus === 'received' ? 'done' : ''}>Bio: {guest.bioStatus}</li>
            <li className={guest.headshotStatus === 'received' ? 'done' : ''}>Headshot: {guest.headshotStatus}</li>
            <li className={guest.socialHandleStatus === 'received' ? 'done' : ''}>Social handles: {guest.socialHandleStatus}</li>
            <li className={guest.releaseFormStatus === 'received' ? 'done' : ''}>Release form: {guest.releaseFormStatus}</li>
          </ul>
          <div className="portal-links">
            <LinkButton label="Press kit folder" url={guest.pressKitLink} />
            <LinkButton label="Release form" url={guest.releaseFormLink} />
          </div>
        </section>

        <section className="portal-card wide">
          <h3>Episode links</h3>
          <div className="portal-links link-grid">
            <LinkButton label="YouTube" url={guest.youtubeLink} />
            <LinkButton label="Spotify" url={guest.spotifyLink} />
            <LinkButton label="Apple Podcasts" url={guest.appleLink} />
            <LinkButton label="Main episode link" url={guest.episodeLink} />
          </div>
        </section>

        <section className="portal-card wide">
          <h3>Clips and captions</h3>
          {guest.clipLinks.length ? (
            <div className="clip-list">
              {guest.clipLinks.map((clip) => (
                <article key={clip.id} className="clip-card">
                  <div>
                    <strong>{clip.title}</strong>
                    <p className="muted">{clip.platform || 'clip'}</p>
                  </div>
                  <a className="portal-link" href={clip.url} target="_blank" rel="noreferrer">Open clip</a>
                  <p>{clip.suggestedCaption || 'No caption added yet.'}</p>
                </article>
              ))}
            </div>
          ) : <p className="muted">No clip links added yet.</p>}
        </section>
      </div>
    </div>
  );
}

function PortalEditor({ guest, upsertGuest }: { guest: Guest; upsertGuest: (guest: Guest) => void }) {
  const [draft, setDraft] = useState(guest);

  function update<K extends keyof Guest>(key: K, value: Guest[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateClip(id: string, patch: Partial<ClipLink>) {
    setDraft((current) => ({
      ...current,
      clipLinks: current.clipLinks.map((clip) => clip.id === id ? { ...clip, ...patch } : clip),
    }));
  }

  function addClip() {
    setDraft((current) => ({
      ...current,
      clipLinks: [
        ...current.clipLinks,
        { id: crypto.randomUUID(), title: 'New clip', url: '', platform: 'instagram', suggestedCaption: '' },
      ],
    }));
  }

  function removeClip(id: string) {
    setDraft((current) => ({ ...current, clipLinks: current.clipLinks.filter((clip) => clip.id !== id) }));
  }

  return (
    <section className="form-card portal-editor">
      <div className="form-grid">
        <label>Portal enabled<select value={String(draft.guestPortalEnabled)} onChange={(e) => update('guestPortalEnabled', e.target.value === 'true')}><option value="true">Enabled</option><option value="false">Disabled</option></select></label>
        <label>Portal slug<input value={draft.guestPortalSlug} onChange={(e) => update('guestPortalSlug', e.target.value)} /></label>
        <label>Host name<input value={draft.hostName ?? ''} onChange={(e) => update('hostName', e.target.value)} /></label>
        <label>Host email<input value={draft.hostEmail ?? ''} onChange={(e) => update('hostEmail', e.target.value)} /></label>
        <label>Producer name<input value={draft.producerName ?? ''} onChange={(e) => update('producerName', e.target.value)} /></label>
        <label>Producer email<input value={draft.producerEmail ?? ''} onChange={(e) => update('producerEmail', e.target.value)} /></label>
        <label>Location name<input value={draft.interviewLocationName ?? ''} onChange={(e) => update('interviewLocationName', e.target.value)} /></label>
        <label>Address<input value={draft.interviewAddress ?? ''} onChange={(e) => update('interviewAddress', e.target.value)} /></label>
        <label>Calendar link<input value={draft.calendarLink ?? ''} onChange={(e) => update('calendarLink', e.target.value)} /></label>
        <label>Recording link<input value={draft.recordingLink ?? ''} onChange={(e) => update('recordingLink', e.target.value)} /></label>
        <label>YouTube link<input value={draft.youtubeLink ?? ''} onChange={(e) => update('youtubeLink', e.target.value)} /></label>
        <label>Spotify link<input value={draft.spotifyLink ?? ''} onChange={(e) => update('spotifyLink', e.target.value)} /></label>
        <label>Apple link<input value={draft.appleLink ?? ''} onChange={(e) => update('appleLink', e.target.value)} /></label>
        <label>Main episode link<input value={draft.episodeLink ?? ''} onChange={(e) => update('episodeLink', e.target.value)} /></label>
        <label>Press kit link<input value={draft.pressKitLink ?? ''} onChange={(e) => update('pressKitLink', e.target.value)} /></label>
        <label>Release form link<input value={draft.releaseFormLink ?? ''} onChange={(e) => update('releaseFormLink', e.target.value)} /></label>
      </div>
      <label>Parking notes<textarea value={draft.parkingNotes ?? ''} onChange={(e) => update('parkingNotes', e.target.value)} /></label>
      <label>Arrival instructions<textarea value={draft.arrivalInstructions ?? ''} onChange={(e) => update('arrivalInstructions', e.target.value)} /></label>
      <label>Recording prep notes<textarea value={draft.recordingPrepNotes ?? ''} onChange={(e) => update('recordingPrepNotes', e.target.value)} /></label>

      <div className="card-topline">
        <h3>Clip links</h3>
        <button onClick={addClip}>Add clip</button>
      </div>
      <div className="clip-editor-list">
        {draft.clipLinks.map((clip) => (
          <div className="clip-editor" key={clip.id}>
            <label>Title<input value={clip.title} onChange={(e) => updateClip(clip.id, { title: e.target.value })} /></label>
            <label>URL<input value={clip.url} onChange={(e) => updateClip(clip.id, { url: e.target.value })} /></label>
            <label>Platform<select value={clip.platform ?? 'other'} onChange={(e) => updateClip(clip.id, { platform: e.target.value as ClipPlatform })}>{clipPlatforms.map((platform) => <option key={platform}>{platform}</option>)}</select></label>
            <label>Suggested caption<textarea value={clip.suggestedCaption ?? ''} onChange={(e) => updateClip(clip.id, { suggestedCaption: e.target.value })} /></label>
            <button className="danger" onClick={() => removeClip(clip.id)}>Remove clip</button>
          </div>
        ))}
      </div>
      <button className="primary" onClick={() => upsertGuest(draft)}>Save portal details</button>
    </section>
  );
}

export default function GuestPortalPage({ guests, selectedGuest, setSelectedGuestId, upsertGuest }: Props) {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const guest = useMemo(() => selectedGuest ?? guests[0], [selectedGuest, guests]);

  if (!guest) {
    return <div className="empty-state"><strong>No guest selected</strong><p>Add a guest before building a portal.</p></div>;
  }

  async function copyPortalLink() {
    await navigator.clipboard.writeText(fullPortalUrl(guest));
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Guest-facing</p>
          <h2>Guest Portal</h2>
          <p className="muted">One link with the interview SOP, location, asset requests, launch links, clips, and captions.</p>
        </div>
        <div className="button-row align-end">
          <label className="select-guest">Preview guest<select value={guest.id} onChange={(event) => setSelectedGuestId(event.target.value)}>{guests.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <button onClick={copyPortalLink}>Copy portal link</button>
          <button onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}>{mode === 'preview' ? 'Edit portal' : 'Preview portal'}</button>
        </div>
      </header>

      <section className="settings-card differentiation-card">
        <p className="eyebrow">Unique angle</p>
        <h3>Not another guest marketplace or booking calendar.</h3>
        <p>GuestFlow is the “send this one link” layer after someone says yes: prep, directions, assets, launch kit, collab reminder, and clips in one guest-safe page.</p>
      </section>

      {mode === 'preview' ? <PortalPreview guest={guest} /> : <PortalEditor guest={guest} upsertGuest={upsertGuest} />}
    </div>
  );
}
