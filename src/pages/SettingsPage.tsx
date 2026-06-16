import type { Guest } from '../types';
import { guestsToCsv, downloadFile } from '../lib/csv';
import { resetGuests } from '../lib/storage';

export default function SettingsPage({ guests, setGuests }: { guests: Guest[]; setGuests: (guests: Guest[]) => void }) {
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
      </header>
      <section className="settings-card">
        <h3>Data utilities</h3>
        <p className="muted">Everything is stored in this browser with localStorage.</p>
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
