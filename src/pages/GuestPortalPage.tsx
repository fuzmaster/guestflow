import { useMemo, useState } from 'react';
import type { ClipLink, ClipPlatform, Guest } from '../types';
import { formatDate } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress } from '../lib/guestLogic';
import { getReadinessScore, getReadinessSentence, getReadinessSignals } from '../lib/readiness';
import { guestPortalUrl } from '../lib/portal';
import CopyLinkButton from '../components/CopyLinkButton';
import ReadinessRing from '../components/ReadinessRing';

const clipPlatforms: ClipPlatform[] = ['instagram', 'tiktok', 'youtube', 'linkedin', 'other'];

type Props = {
  guests: Guest[];
  selectedGuest?: Guest;
  setSelectedGuestId: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
};

function LinkButton({ label, url }: { label: string; url?: string }) {
  if (!url) return <span className="portal-link portal-link--empty">{label} · Not added</span>;
  return <a className="portal-link" href={url} target="_blank" rel="noreferrer">{label}</a>;
}

function CopyableCaption({ caption }: { caption: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!caption.trim()) return;
    try {
      await navigator.clipboard.writeText(caption);
    } catch {
      // ignore
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className="caption-block">
      <p>{caption || 'No caption added yet.'}</p>
      {caption.trim() && (
        <button type="button" onClick={copy} className="caption-copy">{copied ? 'Copied' : 'Copy caption'}</button>
      )}
    </div>
  );
}

function PortalPreview({ guest }: { guest: Guest }) {
  const score = getReadinessScore(guest);
  const signals = getReadinessSignals(guest);
  const missing = getMissingAssets(guest);
  const share = getShareChecklistProgress(guest);
  const liveLinks = [guest.youtubeLink, guest.spotifyLink, guest.appleLink, guest.episodeLink].filter(Boolean).length;

  return (
    <div className="portal-preview portal-v2">
      <section className="portal-hero">
        <div className="portal-hero__copy">
          <p className="eyebrow">{guest.showName}</p>
          <h2>Hi {guest.name.split(' ')[0] || guest.name},</h2>
          <p className="portal-hero__sentence">{getReadinessSentence(score)}</p>
          <p className="muted">Everything for your interview lives here. No emails to dig through.</p>
        </div>
        <div className="portal-hero__score">
          <ReadinessRing score={score} size={88} label={`${score}% ready`} />
          <div className="portal-hero__stats">
            <span><strong>{missing.length}</strong> missing</span>
            <span><strong>{share.label}</strong> share steps</span>
            <span><strong>{liveLinks}</strong> live links</span>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <header><p className="eyebrow">Before the Interview</p><h3>The basics, in one place.</h3></header>
        <div className="portal-grid">
          <article className="portal-card">
            <h4>When</h4>
            <p className="big-line">{formatDate(guest.recordingDate)}</p>
            <p className="muted">Hosted by {guest.hostName || 'your host'}</p>
            <div className="portal-links">
              <LinkButton label="Calendar invite" url={guest.calendarLink} />
              <LinkButton label="Remote recording link" url={guest.recordingLink} />
            </div>
          </article>
          <article className="portal-card">
            <h4>Where</h4>
            <p className="big-line">{guest.interviewLocationName || 'Remote'}</p>
            <p className="muted">{guest.interviewAddress || 'Address not added yet.'}</p>
            <p><strong>Parking:</strong> {guest.parkingNotes || 'No parking notes yet.'}</p>
          </article>
          <article className="portal-card wide">
            <h4>Arrival</h4>
            <p>{guest.arrivalInstructions || 'Arrival instructions will appear here once your producer adds them.'}</p>
          </article>
        </div>
      </section>

      <section className="portal-section">
        <header><p className="eyebrow">What We Need From You</p><h3>{missing.length ? `Still waiting on ${missing.length}.` : 'You sent everything. Thank you.'}</h3></header>
        <div className="portal-grid">
          <article className="portal-card">
            <h4>Bio</h4>
            <AssetState status={guest.bioStatus} action="Email a short third-person bio (2–3 sentences)." />
          </article>
          <article className="portal-card">
            <h4>Headshot</h4>
            <AssetState status={guest.headshotStatus} action="Send a clean, high-res photo for episode graphics." />
          </article>
          <article className="portal-card">
            <h4>Social handles</h4>
            <AssetState status={guest.socialHandleStatus} action="Confirm your Instagram and LinkedIn so we tag you correctly." />
          </article>
          <article className="portal-card">
            <h4>Release form</h4>
            <AssetState status={guest.releaseFormStatus} action="Sign and return the release so we can publish without delay." />
            <div className="portal-links">
              <LinkButton label="Open release form" url={guest.releaseFormLink} />
              <LinkButton label="Press kit folder" url={guest.pressKitLink} />
            </div>
          </article>
        </div>
      </section>

      <section className="portal-section">
        <header><p className="eyebrow">Recording Day</p><h3>What to expect.</h3></header>
        <div className="portal-grid">
          <article className="portal-card wide">
            <h4>Prep notes</h4>
            <p>{guest.recordingPrepNotes || 'Your producer will add prep notes here closer to the date.'}</p>
          </article>
          <article className="portal-card">
            <h4>What to bring</h4>
            <ul className="portal-bullets">
              <li>Water</li>
              <li>Two or three concrete stories with real details</li>
              <li>No noisy jewelry, plain dark shirt if possible</li>
            </ul>
          </article>
          <article className="portal-card">
            <h4>What to expect</h4>
            <ul className="portal-bullets">
              <li>Conversational, not scripted</li>
              <li>~45–60 minutes of recording</li>
              <li>Pause and restart anytime — we edit cleanly</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="portal-section">
        <header><p className="eyebrow">After We Launch</p><h3>Episode is live{guest.launchDate ? ` ${formatDate(guest.launchDate)}` : ''}.</h3></header>
        <div className="portal-grid">
          <article className="portal-card wide">
            <h4>Episode links</h4>
            <div className="portal-links link-grid">
              <LinkButton label="YouTube" url={guest.youtubeLink} />
              <LinkButton label="Spotify" url={guest.spotifyLink} />
              <LinkButton label="Apple Podcasts" url={guest.appleLink} />
              <LinkButton label="Main episode" url={guest.episodeLink} />
            </div>
          </article>
          <article className="portal-card">
            <h4>Share checklist</h4>
            <ul className="portal-checklist">
              <li className={guest.episodeLinkSent ? 'done' : ''}>Episode link sent to you</li>
              <li className={guest.clipsSent ? 'done' : ''}>Clips delivered</li>
              <li className={guest.instagramCollabInviteSent ? 'done' : ''}>Instagram collab invite sent</li>
              <li className={guest.instagramCollabAccepted ? 'done' : ''}>Collab accepted</li>
              <li className={guest.guestShared ? 'done' : ''}>You shared the episode</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="portal-section">
        <header><p className="eyebrow">Clips & Captions</p><h3>Ready-to-post moments.</h3></header>
        {guest.clipLinks.length ? (
          <div className="clip-list">
            {guest.clipLinks.map((clip) => (
              <article key={clip.id} className="clip-card">
                <div className="clip-card__head">
                  <div>
                    <strong>{clip.title}</strong>
                    <p className="muted">{clip.platform || 'clip'}</p>
                  </div>
                  <a className="portal-link" href={clip.url} target="_blank" rel="noreferrer">Open clip</a>
                </div>
                <CopyableCaption caption={clip.suggestedCaption ?? ''} />
              </article>
            ))}
          </div>
        ) : (
          <p className="muted portal-empty-note">Clips will appear here a few days after recording. Captions copy-ready.</p>
        )}
      </section>

      <details className="portal-meta">
        <summary>Readiness checklist ({signals.filter((signal) => signal.done).length} of {signals.length})</summary>
        <ul className="portal-checklist">
          {signals.map((signal) => (
            <li key={signal.key} className={signal.done ? 'done' : ''}>{signal.label}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function AssetState({ status, action }: { status: Guest['bioStatus']; action: string }) {
  const labels: Record<Guest['bioStatus'], string> = {
    needed: 'Still needed',
    requested: 'Requested',
    received: 'Received',
    not_needed: 'Not needed',
  };
  const tone = status === 'received' || status === 'not_needed' ? 'good' : 'wait';
  return (
    <>
      <p className={`asset-state asset-state--${tone}`}>{labels[status]}</p>
      {tone === 'wait' && <p className="muted">{action}</p>}
    </>
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
        {draft.clipLinks.length === 0 && (
          <p className="muted">No clips yet. Add a clip and a copy-ready caption once edits are back.</p>
        )}
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
    return (
      <div className="empty-state">
        <strong>No guest selected</strong>
        <p>Add a guest from the pipeline page before building a portal.</p>
      </div>
    );
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
          <CopyLinkButton value={guestPortalUrl(guest)} />
          <button onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}>{mode === 'preview' ? 'Edit portal' : 'Preview portal'}</button>
        </div>
      </header>

      {mode === 'preview' ? <PortalPreview guest={guest} /> : <PortalEditor guest={guest} upsertGuest={upsertGuest} />}
    </div>
  );
}
