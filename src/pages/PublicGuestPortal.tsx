import { useEffect, useMemo, useState } from 'react';
import { readSharedPortalFromUrl } from '../lib/portalShare';
import PortalPreview from '../components/PortalPreview';
import Footer from '../components/Footer';

const STORAGE_PREFIX = 'guestflow.publicPortal.v1';

function loadLocalState(guestId: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}.${guestId}`);
    if (!raw) return null;
    return JSON.parse(raw) as { selectedDateId?: string; notes: { id: string; body: string; type: string; createdAt: string }[] };
  } catch {
    return null;
  }
}

function saveLocalState(guestId: string, state: { selectedDateId?: string; notes: { id: string; body: string; type: string; createdAt: string }[] }) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}.${guestId}`, JSON.stringify(state));
  } catch { /* noop */ }
}

export default function PublicGuestPortal({ onOpenApp }: { onOpenApp: () => void }) {
  const shared = useMemo(() => readSharedPortalFromUrl(), []);
  const guestId = shared?.guest.id ?? '';
  const [selectedDateId, setSelectedDateId] = useState<string | undefined>(undefined);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (!guestId) return;
    const local = loadLocalState(guestId);
    if (local?.selectedDateId) setSelectedDateId(local.selectedDateId);
  }, [guestId]);

  if (!shared) {
    return (
      <div className="welcome-shell">
        <div className="public-portal__strip">
          <div className="welcome__strip-left">
            <strong>High Functioning</strong>
            <span className="welcome__strip-divider" />
            <span>Guest portal</span>
          </div>
          <div className="welcome__strip-right">
            <span className="welcome__strip-dot" />
            <span>Powered by GuestFlow</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '64px 24px' }}>
          <div className="empty-state" style={{ maxWidth: 520 }}>
            <strong>This portal link looks empty.</strong>
            <p>Ask your producer to re-send the link — it should include your interview details. If you're the producer, open the dashboard to copy a fresh link.</p>
            <div className="button-row" style={{ marginTop: 16, justifyContent: 'center' }}>
              <button className="btn-primary" onClick={onOpenApp}>Open dashboard →</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const guestWithLocalSelection = {
    ...shared.guest,
    selectedDateId: selectedDateId ?? shared.guest.selectedDateId,
  };

  function handleDatePick(dateId: string) {
    setSelectedDateId(dateId);
    const current = loadLocalState(guestId) ?? { notes: [] };
    saveLocalState(guestId, { ...current, selectedDateId: dateId });
  }

  function handleNote(body: string, type: 'scheduling_request' | 'missing_info' | 'transcript_edit' | 'social_links' | 'general') {
    const current = loadLocalState(guestId) ?? { notes: [] };
    const note = { id: crypto.randomUUID(), body, type, createdAt: new Date().toISOString() };
    saveLocalState(guestId, { ...current, notes: [note, ...current.notes] });
    forceRerender((n) => n + 1);
  }

  return (
    <div className="welcome-shell">
      <div className="public-portal__strip">
        <div className="welcome__strip-left">
          <strong>High Functioning</strong>
          <span className="welcome__strip-divider" />
          <span>Guest portal</span>
        </div>
        <div className="welcome__strip-right">
          <span className="welcome__strip-dot" />
          <span>{shared.guest.showName} · Powered by GuestFlow</span>
        </div>
      </div>
      <div className="public-portal__container">
        <PortalPreview
          guest={guestWithLocalSelection}
          voice="guest"
          onDatePicked={handleDatePick}
          onNoteSubmit={handleNote}
          demoMode
        />
      </div>
      <Footer />
    </div>
  );
}
