import { useMemo, useState } from 'react';
import type { AssetStatus, ContactChannel, Guest, GuestStage } from '../types';
import { STAGES, getStageLabel } from '../lib/guestLogic';
import { slugify } from '../lib/slug';
import { applyShowDefaults, loadShowDefaults } from '../lib/showDefaults';
import { normalizeGuest } from '../lib/storage';

const channels: ContactChannel[] = ['email', 'instagram', 'linkedin', 'phone', 'other'];
const assetStatuses: AssetStatus[] = ['needed', 'requested', 'received', 'not_needed'];

function createBlankGuest(): Guest {
  return normalizeGuest({ stage: 'lead' });
}

type Props = {
  guest?: Guest;
  onSave: (guest: Guest) => void;
  onCancel?: () => void;
};

export default function GuestForm({ guest, onSave, onCancel }: Props) {
  const initial = useMemo(() => guest ?? applyShowDefaults(createBlankGuest(), loadShowDefaults()), [guest]);
  const [draft, setDraft] = useState<Guest>(initial);

  function update<K extends keyof Guest>(key: K, value: Guest[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save() {
    if (!draft.name.trim() || !draft.showName.trim()) {
      alert('Guest name and show name are required.');
      return;
    }
    onSave({ ...draft, guestPortalSlug: draft.guestPortalSlug || slugify(`${draft.showName}-${draft.name}`) });
  }

  return (
    <div className="form-card">
      <div className="form-grid">
        <label>Name<input value={draft.name} onChange={(e) => update('name', e.target.value)} /></label>
        <label>Company<input value={draft.company ?? ''} onChange={(e) => update('company', e.target.value)} /></label>
        <label>Title<input value={draft.title ?? ''} onChange={(e) => update('title', e.target.value)} /></label>
        <label>Email<input value={draft.email ?? ''} onChange={(e) => update('email', e.target.value)} /></label>
        <label>Instagram<input value={draft.instagram ?? ''} onChange={(e) => update('instagram', e.target.value)} /></label>
        <label>LinkedIn<input value={draft.linkedin ?? ''} onChange={(e) => update('linkedin', e.target.value)} /></label>
        <label>Phone<input value={draft.phone ?? ''} onChange={(e) => update('phone', e.target.value)} /></label>
        <label>Show name<input value={draft.showName} onChange={(e) => update('showName', e.target.value)} /></label>
        <label>Episode title<input value={draft.episodeTitle ?? ''} onChange={(e) => update('episodeTitle', e.target.value)} /></label>
        <label>Stage<select value={draft.stage} onChange={(e) => update('stage', e.target.value as GuestStage)}>{STAGES.map((stage) => <option key={stage} value={stage}>{getStageLabel(stage)}</option>)}</select></label>
        <label>Preferred channel<select value={draft.preferredChannel} onChange={(e) => update('preferredChannel', e.target.value as ContactChannel)}>{channels.map((channel) => <option key={channel}>{channel}</option>)}</select></label>
        <label>Last contacted<input type="date" value={draft.lastContactedAt ?? ''} onChange={(e) => update('lastContactedAt', e.target.value)} /></label>
        <label>Last response<input type="date" value={draft.lastResponseAt ?? ''} onChange={(e) => update('lastResponseAt', e.target.value)} /></label>
        <label>Next follow-up<input type="date" value={draft.nextFollowUpAt ?? ''} onChange={(e) => update('nextFollowUpAt', e.target.value)} /></label>
        <label>Recording date<input type="date" value={draft.recordingDate ?? ''} onChange={(e) => update('recordingDate', e.target.value)} /></label>
        <label>Launch date<input type="date" value={draft.launchDate ?? ''} onChange={(e) => update('launchDate', e.target.value)} /></label>
      </div>
      <div className="form-grid small">
        {(['bioStatus', 'headshotStatus', 'socialHandleStatus', 'releaseFormStatus'] as const).map((key) => (
          <label key={key}>{key.replace('Status', '')}<select value={draft[key]} onChange={(e) => update(key, e.target.value as AssetStatus)}>{assetStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        ))}
      </div>

      <section className="nested-form-section">
        <h3>Guest portal basics</h3>
        <div className="form-grid">
          <label>Portal enabled<select value={String(draft.guestPortalEnabled)} onChange={(e) => update('guestPortalEnabled', e.target.value === 'true')}><option value="true">Enabled</option><option value="false">Disabled</option></select></label>
          <label>Portal slug<input value={draft.guestPortalSlug} onChange={(e) => update('guestPortalSlug', e.target.value)} /></label>
          <label>Host name<input value={draft.hostName ?? ''} onChange={(e) => update('hostName', e.target.value)} /></label>
          <label>Location name<input value={draft.interviewLocationName ?? ''} onChange={(e) => update('interviewLocationName', e.target.value)} /></label>
          <label>Address<input value={draft.interviewAddress ?? ''} onChange={(e) => update('interviewAddress', e.target.value)} /></label>
          <label>Calendar link<input value={draft.calendarLink ?? ''} onChange={(e) => update('calendarLink', e.target.value)} /></label>
          <label>Recording link<input value={draft.recordingLink ?? ''} onChange={(e) => update('recordingLink', e.target.value)} /></label>
        </div>
        <label>Arrival instructions<textarea value={draft.arrivalInstructions ?? ''} onChange={(e) => update('arrivalInstructions', e.target.value)} /></label>
      </section>

      <label>Notes<textarea value={draft.notes} onChange={(e) => update('notes', e.target.value)} /></label>
      <div className="button-row">
        <button className="btn-primary" onClick={save}>Save guest</button>
        {onCancel && <button className="btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
