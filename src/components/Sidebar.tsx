import type { Page } from '../types';

type NavItem = { id: Page; label: string };

const DAILY: NavItem[] = [
  { id: 'next-actions', label: 'Next Actions' },
  { id: 'today', label: 'Today' },
];
const WORK: NavItem[] = [
  { id: 'pipeline', label: 'Guest Pipeline' },
  { id: 'guest-portal', label: 'Guest Portal' },
  { id: 'missing-assets', label: 'Missing Assets' },
  { id: 'launch-share', label: 'Launch & Share' },
];
const META: NavItem[] = [
  { id: 'templates', label: 'Templates' },
  { id: 'settings', label: 'Settings' },
];

type Props = {
  page: Page;
  setPage: (page: Page) => void;
  guestCount: number;
};

function NavGroup({ items, page, setPage }: { items: NavItem[]; page: Page; setPage: (page: Page) => void }) {
  return (
    <>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={page === item.id ? 'active' : ''}
          onClick={() => setPage(item.id)}
        >
          <span className="nav-stripe" />
          <span>{item.label}</span>
        </button>
      ))}
    </>
  );
}

export default function Sidebar({ page, setPage, guestCount }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <button
          type="button"
          className="brand-mark"
          title="Open welcome"
          onClick={() => setPage('welcome')}
        >
          GF
        </button>
        <div>
          <div className="brand-wordmark">GuestFlow</div>
          <div className="brand-meta">{guestCount} guests · Local</div>
        </div>
      </div>

      <nav className="nav-list">
        <NavGroup items={DAILY} page={page} setPage={setPage} />
        <div className="nav-divider" />
        <NavGroup items={WORK} page={page} setPage={setPage} />
        <div className="nav-divider" />
        <NavGroup items={META} page={page} setPage={setPage} />
      </nav>

      <div className="sidebar-mandate">
        <p className="eyebrow">Mandate</p>
        <strong>One link for guests.</strong>
        <span>One dashboard for producers.</span>
      </div>
    </aside>
  );
}
