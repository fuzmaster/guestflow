import { useEffect, useMemo, useState } from 'react';
import type { Guest, Page } from './types';
import { loadGuests, normalizeGuest, saveGuests } from './lib/storage';
import AppShell from './components/AppShell';
import TodayPage from './pages/TodayPage';
import PipelinePage from './pages/PipelinePage';
import GuestDetailPage from './pages/GuestDetailPage';
import MissingAssetsPage from './pages/MissingAssetsPage';
import LaunchSharePage from './pages/LaunchSharePage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import GuestPortalPage from './pages/GuestPortalPage';
import NextActionsPage from './pages/NextActionsPage';
import WelcomePage from './pages/WelcomePage';
import PublicGuestPortal from './pages/PublicGuestPortal';
import Footer from './components/Footer';

const WELCOMED_KEY = 'guestflow.welcomed.v1';

function isPublicPortalPath(): boolean {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/g/');
}

function initialPage(): Page {
  const params = new URLSearchParams(window.location.search);
  if (params.has('welcome')) return 'welcome';
  const welcomed = localStorage.getItem(WELCOMED_KEY);
  return welcomed ? 'next-actions' : 'welcome';
}

export default function App() {
  const [isPublic] = useState<boolean>(() => isPublicPortalPath());
  const [guests, setGuests] = useState<Guest[]>(() => loadGuests());
  const [page, setPage] = useState<Page>(() => initialPage());
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  if (isPublic) {
    return <PublicGuestPortal onOpenApp={() => { window.location.href = '/'; }} />;
  }

  useEffect(() => {
    saveGuests(guests);
  }, [guests]);

  useEffect(() => {
    if (page !== 'welcome') localStorage.setItem(WELCOMED_KEY, '1');
  }, [page]);

  const selectedGuest = useMemo(
    () => guests.find((guest) => guest.id === selectedGuestId) ?? guests[0],
    [guests, selectedGuestId],
  );

  function upsertGuest(nextGuest: Guest) {
    const stamped = normalizeGuest({ ...nextGuest, updatedAt: new Date().toISOString().slice(0, 10) });
    setGuests((current) => {
      const exists = current.some((guest) => guest.id === stamped.id);
      return exists ? current.map((guest) => (guest.id === stamped.id ? stamped : guest)) : [stamped, ...current];
    });
    setSelectedGuestId(stamped.id);
    setPage('pipeline');
  }

  function updateGuestInline(nextGuest: Guest) {
    const stamped = normalizeGuest({ ...nextGuest, updatedAt: new Date().toISOString().slice(0, 10) });
    setGuests((current) => current.map((guest) => (guest.id === stamped.id ? stamped : guest)));
  }

  function deleteGuest(id: string) {
    setGuests((current) => current.filter((guest) => guest.id !== id));
    if (selectedGuestId === id) setSelectedGuestId(null);
  }

  function openGuest(id: string, targetPage: Page = 'pipeline') {
    setSelectedGuestId(id);
    setPage(targetPage);
  }

  if (page === 'welcome') {
    return (
      <div className="welcome-shell">
        <WelcomePage onEnter={() => setPage('next-actions')} />
        <Footer />
      </div>
    );
  }

  return (
    <AppShell page={page} setPage={setPage} guestCount={guests.length}>
      {page === 'next-actions' && (
        <NextActionsPage guests={guests} openGuest={openGuest} upsertGuest={updateGuestInline} />
      )}
      {page === 'today' && <TodayPage guests={guests} openGuest={openGuest} />}
      {page === 'pipeline' && (
        <PipelinePage
          guests={guests}
          selectedGuest={selectedGuest}
          setSelectedGuestId={setSelectedGuestId}
          upsertGuest={upsertGuest}
          deleteGuest={deleteGuest}
        />
      )}
      {page === 'guest-portal' && (
        <GuestPortalPage guests={guests} selectedGuest={selectedGuest} setSelectedGuestId={setSelectedGuestId} upsertGuest={updateGuestInline} />
      )}
      {page === 'missing-assets' && <MissingAssetsPage guests={guests} openGuest={openGuest} />}
      {page === 'launch-share' && <LaunchSharePage guests={guests} openGuest={openGuest} upsertGuest={upsertGuest} />}
      {page === 'templates' && <TemplatesPage guests={guests} selectedGuest={selectedGuest} />}
      {page === 'settings' && <SettingsPage guests={guests} setGuests={setGuests} />}
      {page === 'pipeline' && selectedGuest && (
        <GuestDetailPage guest={selectedGuest} upsertGuest={upsertGuest} deleteGuest={deleteGuest} openPortal={(id) => openGuest(id, 'guest-portal')} />
      )}
    </AppShell>
  );
}
