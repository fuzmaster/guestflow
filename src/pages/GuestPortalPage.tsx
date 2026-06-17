import { useMemo, useState } from 'react';
import type { ClipLink, ClipPlatform, Guest, GuestNote } from '../types';
import { guestPortalUrl } from '../lib/portal';
import { shareKitUrl } from '../lib/shareKit';
import CopyLinkButton from '../components/CopyLinkButton';
import PortalPreview from '../components/PortalPreview';

const clipPlatforms: ClipPlatform[] = ['instagram', 'tiktok', 'youtube', 'linkedin', 'other'];

type Props = {
  guests: Guest[];
  selectedGuest?: Guest;
  setSelectedGuestId: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
};

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
          <p>This is what the guest sees when they open your link. The producer-side preview shows "{guest.name.split(' ')[0]}'s portal"; the shared link greets them by name.</p>
        </div>
        <div className="portal-page-head__controls">
          <label className="select-guest">Preview guest
            <select value={guest.id} onChange={(event) => setSelectedGuestId(event.target.value)}>
              {guests.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <div className="share-control">
            <CopyLinkButton value={guestPortalUrl(guest)} label="Copy portal link" />
            <CopyLinkButton value={shareKitUrl(guest)} label="Copy share kit" />
            <p className="share-warning">Anyone with these links sees the portal. Don't post them publicly.</p>
          </div>
          <button className="btn-ghost" onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}>{mode === 'preview' ? 'Edit portal' : 'Preview portal'}</button>
        </div>
      </div>

      {mode === 'preview' ? (
        <PortalPreview
          guest={guest}
          voice="producer"
          onDatePicked={(dateId) => {
            const date = guest.availableDates.find((d) => d.id === dateId);
            const updated = guest.availableDates.map((d) =>
              d.id === dateId
                ? { ...d, status: 'selected' as const }
                : d.status === 'selected'
                ? { ...d, status: 'open' as const }
                : d,
            );
            upsertGuest({
              ...guest,
              availableDates: updated,
              selectedDateId: dateId,
              stage: 'date_selected',
              recordingDate: date?.date ?? guest.recordingDate,
            });
          }}
          onNoteSubmit={(body, type) => {
            const note: GuestNote = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), body, type };
            upsertGuest({ ...guest, guestNotes: [note, ...guest.guestNotes] });
          }}
        />
      ) : (
        <PortalEditor guest={guest} upsertGuest={upsertGuest} />
      )}
    </div>
  );
}
