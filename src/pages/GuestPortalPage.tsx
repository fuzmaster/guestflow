import { useMemo, useState } from 'react';
import type { AssetStatus, ClipLink, ClipPlatform, Guest } from '../types';
import { formatDate } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress } from '../lib/guestLogic';
import { getReadinessScore, getReadinessSentence, getReadinessSignals } from '../lib/readiness';
import { guestPortalUrl } from '../lib/portal';
import CopyLinkButton from '../components/CopyLinkButton';
import ReadinessRing from '../components/ReadinessRing';
import WaveBar from '../components/WaveBar';

const clipPlatforms: ClipPlatform[] = ['instagram', 'tiktok', 'youtube', 'linkedin', 'other'];

type Props = {
  guests: Guest[];
  selectedGuest?: Guest;
  setSelectedGuestId: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
};

function firstName(name: string) {
  return name.split(/\s+/)[0] || name;
}

function CheckIcon({ status }: { status: 'done' | 'wait' | 'needed' }) {
  if (status === 'done') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#72f2c7" fillOpacity="0.18" stroke="#72f2c7" strokeWidth="1.5" />
        <path d="M7.5 12.3l3 3 6-6.6" stroke="#72f2c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'wait') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#ffc857" strokeWidth="1.5" />
        <path d="M12 7v5l3 2" stroke="#ffc857" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#3a4868" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

function assetIconStatus(status: AssetStatus): 'done' | 'wait' | 'needed' {
  if (status === 'received' || status === 'not_needed') return 'done';
  if (status === 'requested') return 'wait';
  return 'needed';
}

function assetNote(status: AssetStatus, fallback: string): string {
  if (status === 'received') return 'Received';
  if (status === 'not_needed') return 'Not needed';
  if (status === 'requested') return 'Requested — waiting';
  return fallback;
}

function PortalPreview({ guest }: { guest: Guest }) {
  const score = getReadinessScore(guest);
  const signals = getReadinessSignals(guest);
  const missing = getMissingAssets(guest);
  const share = getShareChecklistProgress(guest);
  const liveLinks = [guest.youtubeLink, guest.spotifyLink, guest.appleLink, guest.episodeLink].filter(Boolean).length;
  const sentence = getReadinessSentence(score).replace("You're", `${firstName(guest.name)} is`);

  const checklist: { key: string; label: string; status: AssetStatus; fallback: string }[] = [
    { key: 'bio', label: 'Bio', status: guest.bioStatus, fallback: 'Email a short third-person bio.' },
    { key: 'headshot', label: 'Headshot', status: guest.headshotStatus, fallback: 'Send a high-res photo for graphics.' },
    { key: 'socials', label: 'Social handles', status: guest.socialHandleStatus, fallback: 'Confirm Instagram and LinkedIn so we tag you correctly.' },
    { key: 'release', label: 'Release form', status: guest.releaseFormStatus, fallback: 'Sign and return so we can publish without delay.' },
  ];

  return (
    <div className="portal-page">
      <section className="portal-pass">
        <div className="portal-pass__strip">
          <span className="accent">Boarding pass · Guest</span>
          <span className="quiet">{guest.episodeTitle ? `· ${guest.episodeTitle}` : guest.showName}</span>
        </div>
        <div className="portal-pass__body">
          <div className="portal-pass__wave"><WaveBar bars={28} size="sm" /></div>
          <div className="portal-pass__inner">
            <div className="portal-pass__ring-block">
              <ReadinessRing score={score} size={188} strokeWidth={5} />
              <div className="portal-pass__ring-stats">
                <span><strong>{missing.length}</strong> miss</span>
                <span><strong>{share.label}</strong> shared</span>
                <span><strong>{liveLinks}</strong> links</span>
              </div>
            </div>
            <div className="portal-pass__text">
              <p className="eyebrow eyebrow--accent">{guest.showName}</p>
              <h2>Hi {firstName(guest.name)},</h2>
              <p className="sentence">{sentence}</p>
              <p className="sub">Everything for your interview lives here. No emails to dig through.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <header>
          <p className="eyebrow">Before the interview</p>
          <h3>The basics, in one place.</h3>
        </header>
        <div className="portal-block">
          <div className="portal-block__when">
            <div>
              <p className="label">When</p>
              <p className="big">{formatDate(guest.recordingDate)}</p>
              <p className="sub">Hosted by {guest.hostName || 'your host'} · ~45–60 min</p>
              <div className="button-row" style={{ marginTop: 16 }}>
                {guest.calendarLink ? <a className="btn-ghost btn-sm" href={guest.calendarLink} target="_blank" rel="noreferrer">Calendar invite</a> : <span className="portal-chip portal-chip--empty">Calendar invite · soon</span>}
                {guest.recordingLink ? <a className="btn-ghost btn-sm" href={guest.recordingLink} target="_blank" rel="noreferrer">Remote recording link</a> : <span className="portal-chip portal-chip--empty">Remote link · soon</span>}
              </div>
            </div>
            <div className="portal-block__where">
              <p className="label">Where</p>
              <p className="value">{guest.interviewLocationName || 'Remote'}</p>
              <p className="address">{guest.interviewAddress || 'Address coming soon.'}</p>
              {guest.parkingNotes && (
                <p className="parking"><strong>Parking:</strong> {guest.parkingNotes}</p>
              )}
            </div>
          </div>
          {guest.arrivalInstructions && (
            <div className="portal-block__arrival">
              <p className="label">Arrival</p>
              <p className="body">{guest.arrivalInstructions}</p>
            </div>
          )}
        </div>
      </section>

      <section className="portal-section">
        <header>
          <p className="eyebrow">What we need from you</p>
          <h3>{missing.length ? `Still waiting on ${missing.length}.` : 'You sent everything. Thank you.'}</h3>
        </header>
        <div className="portal-checklist">
          {checklist.map((item) => {
            const status = assetIconStatus(item.status);
            return (
              <div key={item.key} className={`portal-checklist__row is-${status}`}>
                <div className="portal-checklist__icon"><CheckIcon status={status} /></div>
                <div className="portal-checklist__label">{item.label}</div>
                <div className="portal-checklist__note">{assetNote(item.status, item.fallback)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="portal-section">
        <header>
          <p className="eyebrow">Recording day</p>
          <h3>What to expect.</h3>
        </header>
        <div className="portal-recording">
          <div className="portal-recording__card">
            <p className="label">Prep notes</p>
            <p>{guest.recordingPrepNotes || 'Your producer will drop prep notes here closer to the date.'}</p>
          </div>
          <div className="portal-recording__card">
            <p className="label">What to expect</p>
            <ul>
              <li>Conversational, not scripted</li>
              <li>~45–60 minutes of recording</li>
              <li>Pause and restart anytime — we edit cleanly</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <header>
          <p className="eyebrow">After we launch</p>
          <h3>{guest.launchDate ? `When the episode is live — ${formatDate(guest.launchDate)}.` : 'When the episode is live.'}</h3>
        </header>
        <div className="portal-chips">
          {guest.youtubeLink ? <a className="portal-chip" href={guest.youtubeLink} target="_blank" rel="noreferrer">YouTube</a> : <span className="portal-chip portal-chip--empty">YouTube · soon</span>}
          {guest.spotifyLink ? <a className="portal-chip" href={guest.spotifyLink} target="_blank" rel="noreferrer">Spotify</a> : <span className="portal-chip portal-chip--empty">Spotify · soon</span>}
          {guest.appleLink ? <a className="portal-chip" href={guest.appleLink} target="_blank" rel="noreferrer">Apple Podcasts</a> : <span className="portal-chip portal-chip--empty">Apple · soon</span>}
          {guest.episodeLink ? <a className="portal-chip" href={guest.episodeLink} target="_blank" rel="noreferrer">Main episode</a> : <span className="portal-chip portal-chip--empty">Main link · soon</span>}
        </div>
      </section>

      <section className="portal-section">
        <header>
          <p className="eyebrow">Clips &amp; captions</p>
          <h3>Ready-to-post moments.</h3>
        </header>
        {guest.clipLinks.length === 0 ? (
          <div className="empty-state">
            <strong>Clips drop here after edits</strong>
            <p>Your producer will add clips and copy-ready captions a few days after the recording.</p>
          </div>
        ) : (
          guest.clipLinks.map((clip) => <ClipCard key={clip.id} clip={clip} />)
        )}
      </section>

      <details className="portal-meta">
        <summary>Readiness checklist · {signals.filter((s) => s.done).length} of {signals.length}</summary>
        <ul>
          {signals.map((signal) => (
            <li key={signal.key} className={signal.done ? 'done' : ''}>{signal.label}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function ClipCard({ clip }: { clip: ClipLink }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!clip.suggestedCaption) return;
    try {
      await navigator.clipboard.writeText(clip.suggestedCaption);
    } catch { /* noop */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <article className="portal-clip">
      <div className="portal-clip__head">
        <div>
          <strong>{clip.title}</strong>
          <p className="portal-clip__platform">{clip.platform || 'clip'}</p>
        </div>
        {clip.url && <a className="btn-ghost btn-sm" href={clip.url} target="_blank" rel="noreferrer">Open clip</a>}
      </div>
      {clip.suggestedCaption && (
        <div className="portal-clip__caption">
          <p>“{clip.suggestedCaption}”</p>
        </div>
      )}
      {clip.suggestedCaption && (
        <button type="button" className="btn-ghost btn-sm portal-clip__copy" onClick={copy}>{copied ? 'Copied' : 'Copy caption'}</button>
      )}
    </article>
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
      clipLinks: current.clipLinks.map((clip) => (clip.id === id ? { ...clip, ...patch } : clip)),
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
    <section className="portal-editor">
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

      <div className="button-row" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Clip links</h3>
        <button className="btn-ghost btn-sm" onClick={addClip}>Add clip</button>
      </div>
      <div className="clip-editor-list">
        {draft.clipLinks.length === 0 && (
          <p className="muted">No clips yet. Add a clip and a copy-ready caption once edits are back.</p>
        )}
        {draft.clipLinks.map((clip) => (
          <div className="clip-editor" key={clip.id}>
            <label>Title<input value={clip.title} onChange={(e) => updateClip(clip.id, { title: e.target.value })} /></label>
            <label>URL<input value={clip.url} onChange={(e) => updateClip(clip.id, { url: e.target.value })} /></label>
            <label>Platform<select value={clip.platform ?? 'other'} onChange={(e) => updateClip(clip.id, { platform: e.target.value as ClipPlatform })}>{clipPlatforms.map((platform) => <option key={platform}>{platform}</option>)}</select></label>
            <label>Suggested caption<textarea value={clip.suggestedCaption ?? ''} onChange={(e) => updateClip(clip.id, { suggestedCaption: e.target.value })} /></label>
            <button className="btn-danger" onClick={() => removeClip(clip.id)}>Remove clip</button>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={() => upsertGuest(draft)}>Save portal details</button>
    </section>
  );
}

export default function GuestPortalPage({ guests, selectedGuest, setSelectedGuestId, upsertGuest }: Props) {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const guest = useMemo(() => selectedGuest ?? guests[0], [selectedGuest, guests]);

  if (!guest) {
    return (
      <div className="page-stack">
        <div className="empty-state">
          <strong>No guest selected</strong>
          <p>Add a guest from the pipeline page before building a portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-hero portal-page-head">
        <div className="page-hero__text">
          <p className="eyebrow eyebrow--accent">Guest-facing · Boarding pass</p>
          <h1>Guest Portal</h1>
          <p>One link with the interview SOP, asset requests, launch links, clips, and captions.</p>
        </div>
        <div className="portal-page-head__controls">
          <label className="select-guest">Preview guest
            <select value={guest.id} onChange={(event) => setSelectedGuestId(event.target.value)}>
              {guests.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <CopyLinkButton value={guestPortalUrl(guest)} label="Copy link" />
          <button className="btn-ghost" onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}>{mode === 'preview' ? 'Edit portal' : 'Preview portal'}</button>
        </div>
      </div>

      {mode === 'preview' ? <PortalPreview guest={guest} /> : <PortalEditor guest={guest} upsertGuest={upsertGuest} />}
    </div>
  );
}
