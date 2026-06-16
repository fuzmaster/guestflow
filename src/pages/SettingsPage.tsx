import { useState } from 'react';
import type { Guest } from '../types';
import { guestsToCsv, downloadFile } from '../lib/csv';
import { resetGuests } from '../lib/storage';
import {
  loadShowDefaults,
  saveShowDefaults,
  type ShowDefaults,
} from '../lib/showDefaults';

type DefaultField = {
  key: keyof ShowDefaults;
  label: string;
  type?: 'input' | 'textarea';
  hint?: string;
};

const FIELDS: DefaultField[] = [
  { key: 'showName', label: 'Show name' },
  { key: 'hostName', label: 'Host name' },
  { key: 'hostEmail', label: 'Host email' },
  { key: 'producerName', label: 'Producer name' },
  { key: 'producerEmail', label: 'Producer email' },
  { key: 'interviewLocationName', label: 'Default location name' },
  { key: 'interviewAddress', label: 'Default address' },
  { key: 'releaseFormLink', label: 'Release form link' },
  { key: 'pressKitLink', label: 'Press kit link' },
  { key: 'youtubeLink', label: 'Default YouTube URL' },
  { key: 'spotifyLink', label: 'Default Spotify URL' },
  { key: 'appleLink', label: 'Default Apple Podcasts URL' },
  { key: 'parkingNotes', label: 'Default parking notes', type: 'textarea' },
  { key: 'arrivalInstructions', label: 'Default arrival instructions', type: 'textarea' },
  { key: 'recordingPrepNotes', label: 'Default recording prep notes', type: 'textarea' },
];

export default function SettingsPage({ guests, setGuests }: { guests: Guest[]; setGuests: (guests: Guest[]) => void }) {
  const [defaults, setDefaults] = useState<ShowDefaults>(() => loadShowDefaults());
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function update<K extends keyof ShowDefaults>(key: K, value: ShowDefaults[K]) {
    setDefaults((current) => ({ ...current, [key]: value }));
  }

  function persistDefaults() {
    saveShowDefaults(defaults);
    setSavedAt(Date.now());
    window.setTimeout(() => setSavedAt(null), 1600);
  }

  function exportJson() {
    downloadFile('guestflow-guests.json', JSON.stringify(guests, null, 2), 'application/json');
  }

  function exportCsv() {
    downloadFile('guestflow-guests.csv', guestsToCsv(guests), 'text/csv');
  }

  async function importJson(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as Guest[];
    if (!Array.isArray(parsed)) throw new Error('Invalid GuestFlow JSON');
    setGuests(parsed);
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Settings / Export</h2>
        </div>
        <p className="muted">Defaults flow into every new guest. Your data stays in this browser.</p>
      </header>

      <section className="settings-card">
        <div className="card-topline">
          <div>
            <h3>Show defaults</h3>
            <p className="muted">Set once. Every new guest inherits these for show, host, location, prep, and platform links. Existing guests are untouched.</p>
          </div>
          <div className="button-row">
            <button className="primary" onClick={persistDefaults}>{savedAt ? 'Saved' : 'Save defaults'}</button>
          </div>
        </div>
        <div className="form-grid">
          {FIELDS.filter((field) => field.type !== 'textarea').map((field) => (
            <label key={field.key}>
              {field.label}
              <input value={defaults[field.key] ?? ''} onChange={(event) => update(field.key, event.target.value)} />
            </label>
          ))}
        </div>
        {FIELDS.filter((field) => field.type === 'textarea').map((field) => (
          <label key={field.key}>
            {field.label}
            <textarea value={defaults[field.key] ?? ''} onChange={(event) => update(field.key, event.target.value)} />
          </label>
        ))}
      </section>

      <section className="settings-card">
        <h3>Data utilities</h3>
        <p className="muted">Everything is stored in this browser with localStorage. Nothing is sent anywhere.</p>
        <div className="button-row">
          <button onClick={exportJson}>Export guests as JSON</button>
          <button onClick={exportCsv}>Export guests as CSV</button>
          <label className="file-button">Import guests from JSON<input type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0] ?? null)} /></label>
          <button className="danger" onClick={() => setGuests(resetGuests())}>Reset mock data</button>
        </div>
      </section>
    </div>
  );
}
