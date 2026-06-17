import { useEffect, useMemo, useState } from 'react';
import type { AssetStatus, ClipLink, GuestStage } from '../types';
import type { PublicGuestData } from '../lib/portalShare';
import { formatDate } from '../lib/dates';
import { getReadinessScore, getReadinessSignals } from '../lib/readiness';
import ReadinessRing from './ReadinessRing';
import WaveBar from './WaveBar';

function firstName(name: string) {
  return name.split(/\s+/)[0] || name;
}

function statusLabel(stage: GuestStage): string {
  const map: Partial<Record<GuestStage, string>> = {
    invited: 'Invited',
    no_reply: 'Invited',
    dates_sent: 'Pick a date',
    date_selected: 'Date selected',
    recording_confirmed: 'Recording confirmed',
    recording_soon: 'Recording confirmed',
    recorded: 'Recording complete',
    recording_complete: 'Recording complete',
    transcript_review: 'Transcript review',
    editing: 'Editing',
    launch_scheduled: 'Launch scheduled',
    launch_soon: 'Launch scheduled',
    live: 'Episode live',
    needs_share: 'Episode live',
    done: 'Wrapped',
  };
  return map[stage] ?? 'Invited';
}

function nextActionForGuest(guest: PublicGuestData): string {
  if (guest.stage === 'dates_sent') return 'Pick a recording date below.';
  if (guest.stage === 'date_selected') return 'We will confirm your date and send the final details.';
  if (guest.stage === 'recording_confirmed' || guest.stage === 'recording_soon') return 'Review the studio details and prep notes.';
  if (guest.stage === 'transcript_review') return 'Review the transcript and flag anything you want cut.';
  if (guest.stage === 'launch_scheduled' || guest.stage === 'launch_soon') return 'Get the share kit ready — episode drops soon.';
  if (guest.stage === 'live' || guest.stage === 'needs_share') return 'Share the episode — kit is at the bottom.';
  return 'Send the bits we still need from you (below).';
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
  if (status === 'requested') return 'Requested — waiting on you';
  return fallback;
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

function CopyButton({ value, label, full }: { value: string; label: string; full?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); } catch { /* noop */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <button type="button" className={`btn-ghost btn-sm ${full ? 'is-full' : ''}`} onClick={copy} disabled={!value}>
      {copied ? 'Copied' : label}
    </button>
  );
}

export type PortalPreviewProps = {
  guest: PublicGuestData;
  voice?: 'guest' | 'producer';
  onDatePicked?: (dateId: string) => void;
  onNoteSubmit?: (body: string, type: 'scheduling_request' | 'missing_info' | 'transcript_edit' | 'social_links' | 'general') => void;
  demoMode?: boolean;
};

export default function PortalPreview({ guest, voice = 'guest', onDatePicked, onNoteSubmit, demoMode }: PortalPreviewProps) {
  const score = getReadinessScore(guest as never);
  const signals = getReadinessSignals(guest as never);
  const missing = [guest.bioStatus, guest.headshotStatus, guest.socialHandleStatus, guest.releaseFormStatus]
    .filter((s) => s === 'needed' || s === 'requested').length;
  const liveLinks = [guest.youtubeLink, guest.spotifyLink, guest.appleLink, guest.episodeLink, guest.websiteEpisodeLink]
    .filter(Boolean).length;
  const isLaunched = guest.stage === 'live' || guest.stage === 'needs_share' || guest.stage === 'launch_scheduled' || guest.stage === 'launch_soon';
  const showRemoteBlock = guest.recordingType === 'remote_approved' || guest.recordingType === 'remote_only';
  const showInPersonBlock = !showRemoteBlock || guest.recordingType !== 'remote_only';

  const sentenceCore =
    score >= 85 ? "all set for the interview"
    : score >= 50 ? `${score}% ready for the interview`
    : `${score}% ready — a few things still need attention`;
  const sentence = voice === 'guest'
    ? `You're ${sentenceCore}.`
    : `${firstName(guest.name)} is ${sentenceCore}.`;
  const greeting = voice === 'guest' ? `Hi ${firstName(guest.name)},` : `${firstName(guest.name)}'s portal`;

  const latestMessage = guest.messages?.[0];
  const olderMessages = (guest.messages ?? []).slice(1);

  const selectedDateId = guest.confirmedDateId || guest.selectedDateId;

  const checklist: { key: string; label: string; status: AssetStatus; fallback: string }[] = [
    { key: 'bio', label: 'Bio', status: guest.bioStatus, fallback: 'Email a short third-person bio.' },
    { key: 'headshot', label: 'Headshot', status: guest.headshotStatus, fallback: 'Send a high-res photo for graphics.' },
    { key: 'socials', label: 'Social handles', status: guest.socialHandleStatus, fallback: 'Confirm Instagram and LinkedIn so we tag you correctly.' },
    { key: 'release', label: 'Release form', status: guest.releaseFormStatus, fallback: 'Sign and return so we can publish without delay.' },
  ];

  function scrollToShareKit() {
    document.querySelector('#share-kit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="portal-page">
      <section className="portal-pass">
        <div className="portal-pass__strip">
          <span className="accent">{statusLabel(guest.stage)}</span>
          <span className="quiet">{guest.episodeTitle ? `· ${guest.episodeTitle}` : guest.showName}</span>
        </div>
        <div className="portal-pass__body">
          <div className="portal-pass__wave"><WaveBar bars={28} size="sm" /></div>
          <div className="portal-pass__inner">
            <div className="portal-pass__ring-block">
              <ReadinessRing score={score} size={188} strokeWidth={5} />
              <div className="portal-pass__ring-stats">
                <span><strong>{missing}</strong> miss</span>
                <span><strong>{liveLinks}</strong> links</span>
                <span><strong>{guest.clipLinks.length}</strong> clips</span>
              </div>
            </div>
            <div className="portal-pass__text">
              <p className="eyebrow eyebrow--accent">{guest.showName}</p>
              <h2>{greeting}</h2>
              <p className="sentence">{sentence}</p>
              <p className="sub portal-next">{nextActionForGuest(guest)}</p>
              {isLaunched && (
                <button type="button" className="btn-primary btn-sm" style={{ marginTop: 14 }} onClick={scrollToShareKit}>Jump to share kit</button>
              )}
            </div>
          </div>
        </div>
      </section>

      {latestMessage && (
        <section className="portal-section">
          <header>
            <p className="eyebrow">Latest update from your producer</p>
            <h3>{latestMessage.title}</h3>
          </header>
          <div className="portal-message portal-message--latest">
            <p>{latestMessage.body}</p>
            <small>{formatDate(latestMessage.createdAt.slice(0, 10))}</small>
          </div>
        </section>
      )}

      {guest.stage === 'dates_sent' && guest.availableDates.length > 0 && (
        <section className="portal-section">
          <header>
            <p className="eyebrow">Pick a recording date</p>
            <h3>Tap whichever works best.</h3>
          </header>
          <div className="portal-date-picker">
            {guest.availableDates.filter((d) => d.status !== 'withdrawn').map((d) => {
              const isPicked = d.id === selectedDateId;
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`portal-date-btn ${isPicked ? 'is-picked' : ''}`}
                  onClick={() => onDatePicked?.(d.id)}
                  disabled={!onDatePicked}
                >
                  <span className="portal-date-btn__day">{formatDate(d.date)}</span>
                  <span className="portal-date-btn__time">{d.timeWindow || 'Any time'}</span>
                  {isPicked && <span className="portal-date-btn__badge">Selected</span>}
                </button>
              );
            })}
          </div>
          {voice === 'guest' && (
            <p className="muted portal-fineprint">
              Thanks — once you tap a date we'll confirm and send the final details. Need a remote option instead? Drop a note below.
            </p>
          )}
          {demoMode && (
            <p className="portal-demo-note">Demo / local mode — real cross-device submissions need a backend.</p>
          )}
        </section>
      )}

      {(guest.stage === 'date_selected' || guest.stage === 'recording_confirmed' || guest.stage === 'recording_soon') && showInPersonBlock && (
        <section className="portal-section">
          <header>
            <p className="eyebrow">Before the interview · In-person studio</p>
            <h3>The basics, in one place.</h3>
          </header>
          {!showRemoteBlock && (
            <p className="portal-fineprint" style={{ marginTop: -8 }}>
              This episode is planned as an in-person studio recording. Need to request a remote option? Leave a note below.
            </p>
          )}
          <div className="portal-block">
            <div className="portal-block__when">
              <div>
                <p className="label">When</p>
                <p className="big">{formatDate(guest.recordingDate)}</p>
                <p className="sub">Hosted by {guest.hostName || 'your host'} · ~45–60 min</p>
                <div className="button-row" style={{ marginTop: 16 }}>
                  {guest.calendarLink && <a className="btn-ghost btn-sm" href={guest.calendarLink} target="_blank" rel="noreferrer">Calendar invite</a>}
                  {guest.interviewAddress && (
                    <a className="btn-ghost btn-sm" href={`https://maps.google.com/?q=${encodeURIComponent(guest.interviewAddress)}`} target="_blank" rel="noreferrer">Open in Maps</a>
                  )}
                </div>
              </div>
              <div className="portal-block__where">
                <p className="label">Where</p>
                <p className="value">{guest.interviewLocationName || 'Studio'}</p>
                <p className="address">{guest.interviewAddress || 'Address coming soon.'}</p>
                {guest.parkingNotes && <p className="parking"><strong>Parking:</strong> {guest.parkingNotes}</p>}
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
      )}

      {showRemoteBlock && (
        <section className="portal-section">
          <header>
            <p className="eyebrow">Remote recording</p>
            <h3>{guest.recordingType === 'remote_only' ? 'This episode is remote.' : 'Remote is approved for this episode.'}</h3>
          </header>
          <div className="portal-block">
            <p className="label">Recording link</p>
            {guest.riversideLink ? (
              <a className="btn-primary btn-sm" href={guest.riversideLink} target="_blank" rel="noreferrer" style={{ justifySelf: 'start' }}>Open recording room</a>
            ) : (
              <p className="muted">Your producer will drop the link here before the recording.</p>
            )}
            <p className="muted" style={{ marginTop: 12 }}>
              Wired headphones and a quiet room help. Test your mic and camera 5 minutes before we start.
            </p>
          </div>
        </section>
      )}

      <section className="portal-section">
        <header>
          <p className="eyebrow">What we need from you</p>
          <h3>{missing ? `Still waiting on ${missing}.` : 'You sent everything. Thank you.'}</h3>
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
        {(guest.releaseFormLink || guest.pressKitLink) && (
          <div className="portal-chips" style={{ marginTop: 10 }}>
            {guest.releaseFormLink && <a className="portal-chip" href={guest.releaseFormLink} target="_blank" rel="noreferrer">Open release form</a>}
            {guest.pressKitLink && <a className="portal-chip" href={guest.pressKitLink} target="_blank" rel="noreferrer">Press kit folder</a>}
          </div>
        )}
      </section>

      <section className="portal-section">
        <header>
          <p className="eyebrow">What to expect</p>
          <h3>How the recording usually goes.</h3>
        </header>
        <div className="portal-block">
          <p className="body" style={{ whiteSpace: 'pre-line', color: 'var(--text-2)' }}>
            {guest.showInstructions || 'Your producer will add prep notes here closer to the date.'}
          </p>
          {guest.recordingPrepNotes && (
            <>
              <p className="label" style={{ marginTop: 18 }}>Prep notes</p>
              <p className="body">{guest.recordingPrepNotes}</p>
            </>
          )}
        </div>
      </section>

      {onNoteSubmit && (
        <NoteBox onSubmit={onNoteSubmit} demoMode={demoMode} />
      )}

      {(guest.stage === 'transcript_review' || guest.transcriptStatus === 'available' || guest.transcriptStatus === 'review_requested' || guest.transcriptStatus === 'review_complete') && (
        <section className="portal-section">
          <header>
            <p className="eyebrow">Transcript review</p>
            <h3>{guest.transcriptStatus === 'review_complete' ? 'Review complete — thank you.' : 'Anything you want us to cut?'}</h3>
          </header>
          <div className="portal-block">
            <p className="body" style={{ color: 'var(--text-2)' }}>
              After recording, we may add a transcript here for review. If there is anything you want us to consider cutting, leave a note with the quote or timestamp.
            </p>
            {guest.transcriptLink && (
              <a className="btn-primary btn-sm" href={guest.transcriptLink} target="_blank" rel="noreferrer" style={{ justifySelf: 'start' }}>Open transcript</a>
            )}
          </div>
        </section>
      )}

      {olderMessages.length > 0 && (
        <section className="portal-section">
          <header>
            <p className="eyebrow">Message history</p>
            <h3>Past updates from your producer.</h3>
          </header>
          <ul className="portal-message-list">
            {olderMessages.map((m) => (
              <li key={m.id} className="portal-message">
                <strong>{m.title}</strong>
                <p>{m.body}</p>
                <small>{formatDate(m.createdAt.slice(0, 10))}</small>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="portal-section" id="share-kit">
        <header>
          <p className="eyebrow">{isLaunched ? 'Share kit · live' : 'Share kit · ready when we launch'}</p>
          <h3>{isLaunched ? 'Episode hub.' : 'When the episode is live, this is where everything lives.'}</h3>
        </header>
        <div className="portal-chips">
          {guest.youtubeLink ? <a className="portal-chip" href={guest.youtubeLink} target="_blank" rel="noreferrer">YouTube</a> : <span className="portal-chip portal-chip--empty">YouTube · soon</span>}
          {guest.spotifyLink ? <a className="portal-chip" href={guest.spotifyLink} target="_blank" rel="noreferrer">Spotify</a> : <span className="portal-chip portal-chip--empty">Spotify · soon</span>}
          {guest.appleLink ? <a className="portal-chip" href={guest.appleLink} target="_blank" rel="noreferrer">Apple Podcasts</a> : <span className="portal-chip portal-chip--empty">Apple · soon</span>}
          {guest.episodeLink ? <a className="portal-chip" href={guest.episodeLink} target="_blank" rel="noreferrer">Main episode</a> : null}
          {guest.websiteEpisodeLink ? <a className="portal-chip" href={guest.websiteEpisodeLink} target="_blank" rel="noreferrer">Website episode</a> : null}
        </div>

        {(guest.suggestedPostCopy || guest.teamShareMessage || guest.clipLinks.length > 0) && (
          <div className="share-kit__actions">
            <CopyButton
              value={[
                guest.youtubeLink,
                guest.spotifyLink,
                guest.appleLink,
                guest.websiteEpisodeLink || guest.episodeLink,
              ].filter(Boolean).join('\n')}
              label="Copy all links"
            />
            <CopyButton value={guest.suggestedPostCopy ?? ''} label="Copy suggested post" />
            <CopyButton value={guest.teamShareMessage ?? ''} label="Copy team share message" />
          </div>
        )}

        {guest.suggestedPostCopy && (
          <div className="portal-block" style={{ marginTop: 12 }}>
            <p className="label">Suggested post copy</p>
            <p className="body" style={{ color: 'var(--text-2)' }}>{guest.suggestedPostCopy}</p>
          </div>
        )}

        {guest.teamShareMessage && (
          <div className="portal-block">
            <p className="label">Team / coworker share message</p>
            <p className="body" style={{ color: 'var(--text-2)' }}>{guest.teamShareMessage}</p>
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Forward your team share kit link so coworkers can grab everything in one place.
            </p>
          </div>
        )}

        {guest.clipLinks.length > 0 ? (
          <div style={{ display: 'grid', gap: 14 }}>
            {guest.clipLinks.map((clip) => <ClipCard key={clip.id} clip={clip} />)}
          </div>
        ) : (
          <div className="empty-state">
            <strong>Clips drop here after edits</strong>
            <p>Your producer will add clips and copy-ready captions a few days before launch.</p>
          </div>
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

function NoteBox({
  onSubmit,
  demoMode,
}: {
  onSubmit: (body: string, type: 'scheduling_request' | 'missing_info' | 'transcript_edit' | 'social_links' | 'general') => void;
  demoMode?: boolean;
}) {
  const [body, setBody] = useState('');
  const [type, setType] = useState<'scheduling_request' | 'missing_info' | 'transcript_edit' | 'social_links' | 'general'>('general');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const t = window.setTimeout(() => setSent(false), 3500);
    return () => window.clearTimeout(t);
  }, [sent]);

  function send() {
    if (!body.trim()) return;
    onSubmit(body.trim(), type);
    setBody('');
    setSent(true);
  }

  const noteTypeLabels = useMemo(() => ({
    scheduling_request: 'Scheduling request',
    missing_info: 'Missing info',
    transcript_edit: 'Transcript / edit request',
    social_links: 'Social links',
    general: 'General note',
  }), []);

  return (
    <section className="portal-section">
      <header>
        <p className="eyebrow">Send a note to your producer</p>
        <h3>Need to change something?</h3>
      </header>
      <div className="portal-block">
        <p className="body" style={{ color: 'var(--text-2)' }}>
          Need to change something, request remote, add social links, or flag something for the edit? Leave a note here.
        </p>
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value as never)}>
            {Object.entries(noteTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
        <label>Your note
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type anything — your producer will see it." />
        </label>
        <div className="button-row">
          <button type="button" className="btn-primary btn-sm" onClick={send} disabled={!body.trim()}>{sent ? 'Sent' : 'Send to producer'}</button>
        </div>
        {demoMode && (
          <p className="portal-demo-note">
            Demo / local mode — your note is stored in your browser. Real cross-device submissions need a backend, which is on the roadmap.
          </p>
        )}
      </div>
    </section>
  );
}
