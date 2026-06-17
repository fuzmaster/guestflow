import { useMemo } from 'react';
import { readSharedPortalFromUrl } from '../lib/portalShare';
import PortalPreview from '../components/PortalPreview';
import Footer from '../components/Footer';

export default function PublicGuestPortal({ onOpenApp }: { onOpenApp: () => void }) {
  const shared = useMemo(() => readSharedPortalFromUrl(), []);

  if (!shared) {
    return (
      <div className="welcome-shell">
        <div className="public-portal__strip">
          <div className="welcome__strip-left">
            <strong>GuestFlow</strong>
            <span className="welcome__strip-divider" />
            <span>Guest portal</span>
          </div>
          <div className="welcome__strip-right">
            <span className="welcome__strip-dot" />
            <span>Local-first · No backend</span>
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

  return (
    <div className="welcome-shell">
      <div className="public-portal__strip">
        <div className="welcome__strip-left">
          <strong>GuestFlow</strong>
          <span className="welcome__strip-divider" />
          <span>Guest portal</span>
        </div>
        <div className="welcome__strip-right">
          <span className="welcome__strip-dot" />
          <span>{shared.guest.showName}</span>
        </div>
      </div>
      <div className="public-portal__container">
        <PortalPreview guest={shared.guest} voice="guest" />
      </div>
      <Footer />
    </div>
  );
}
