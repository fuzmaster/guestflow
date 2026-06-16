import type { ReactNode } from 'react';
import type { Page } from '../types';
import Sidebar from './Sidebar';
import Footer from './Footer';

type Props = {
  page: Page;
  setPage: (page: Page) => void;
  guestCount: number;
  children: ReactNode;
};

export default function AppShell({ page, setPage, guestCount, children }: Props) {
  return (
    <div className="app-shell-wrap">
      <div className="app-shell">
        <Sidebar page={page} setPage={setPage} guestCount={guestCount} />
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
