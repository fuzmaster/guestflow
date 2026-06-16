import type { Page } from '../types';

const nav: { id: Page; label: string }[] = [
  { id: 'next-actions', label: 'Next Actions' },
  { id: 'today', label: 'Today' },
  { id: 'pipeline', label: 'Guest Pipeline' },
  { id: 'guest-portal', label: 'Guest Portal' },
  { id: 'missing-assets', label: 'Missing Assets' },
  { id: 'launch-share', label: 'Launch / Share' },
  { id: 'templates', label: 'Templates' },
  { id: 'settings', label: 'Settings / Export' },
];

type Props = {
  page: Page;
  setPage: (page: Page) => void;
  guestCount: number;
};

export default function Sidebar({ page, setPage, guestCount }: Props) {
  return (
    <aside className="sidebar">
      <button className="brand brand-button" onClick={() => setPage('welcome')}>
        <div className="brand-mark">GF</div>
        <div>
          <h1>GuestFlow</h1>
          <p>{guestCount} guests tracked</p>
        </div>
      </button>
      <div className="sidebar-note">
        <strong>One link for guests.</strong>
        <span>One dashboard for producers.</span>
      </div>
      <nav className="nav-list">
        {nav.map((item) => (
          <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
