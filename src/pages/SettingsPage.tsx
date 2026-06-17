import { useState } from 'react';
import type { Guest } from '../types';
import { guestsToCsv, downloadFile } from '../lib/csv';
import { resetGuests } from '../lib/storage';
import { loadShowDefaults, saveShowDefaults, type ShowDefaults } from '../lib/showDefaults';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';

type DefaultField = {
  key: keyof ShowDefaults;
  label: string;
  type?: 'input' | 'textarea';
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
      <PageHero
        eyebrow="Settings · Local store"
        title="Settings & Export"
        sub="Defaults flow into every new guest. Your data stays in this browser."
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left="Defaults" right="Data utilities" />
      </div>

      <section className="page-section page-section--gap-md">
        <section className="settings-card">
          <div className="card-topline">
            <div>
              <p className="eyebrow">Show defaults</p>
              <h3 style={{ marginTop: 6 }}>Set once. Inherit everywhere.</h3>
              <p className="muted" style={{ margin: '8px 0 0' }}>
                New guests inherit host, location, prep, and platform links from here. Existing guests stay untouched.
              </p>
            </div>
            <div className="button-row">
              <button className="btn-primary btn-sm" onClick={persistDefaults}>{savedAt ? 'Saved' : 'Save defaults'}</button>
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
          <p className="eyebrow">Data utilities</p>
          <h3 style={{ marginTop: 6 }}>Your data, in this browser.</h3>
          <p className="muted" style={{ margin: '0 0 8px' }}>
            Nothing is sent anywhere. Export anytime as JSON or CSV.
          </p>
          <div className="button-row">
            <button className="btn-ghost btn-sm" onClick={exportJson}>Export guests as JSON</button>
            <button className="btn-ghost btn-sm" onClick={exportCsv}>Export guests as CSV</button>
            <label className="file-button">Import guests from JSON<input type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0] ?? null)} /></label>
            <button className="btn-danger" onClick={() => setGuests(resetGuests())}>Reset mock data</button>
          </div>
        </section>

        <section className="settings-card settings-card--accent">
          <p className="eyebrow eyebrow--accent">Coming soon</p>
          <h3 style={{ marginTop: 6 }}>Accounts &amp; multi-show sync</h3>
          <p className="muted" style={{ margin: '0 0 12px' }}>
            GuestFlow is local-first today — your guests live in this browser. An optional account
            tier will let you run multiple shows, sync across devices, and let guests update their
            own info inside the portal. JSON export will stay free and always work.
          </p>
          <div className="button-row">
            <button className="btn-ghost btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              Get notified when accounts launch
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}
