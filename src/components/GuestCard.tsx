import type { Guest } from '../types';
import { formatDate, isOverdue } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress, getSuggestedNextAction } from '../lib/guestLogic';
import StatusPill from './StatusPill';

type Props = {
  guest: Guest;
  onClick?: () => void;
};

export default function GuestCard({ guest, onClick }: Props) {
  const missing = getMissingAssets(guest);
  const share = getShareChecklistProgress(guest);
  return (
    <button className="guest-card" onClick={onClick}>
      <div className="card-topline">
        <strong>{guest.name}</strong>
        <StatusPill stage={guest.stage} />
      </div>
      <p className="muted">{guest.company || guest.showName}</p>
      <div className="card-grid">
        <span>Next: {formatDate(guest.nextFollowUpAt)}</span>
        {isOverdue(guest.nextFollowUpAt) && <span className="warn-text">Overdue</span>}
        <span>Missing: {missing.length}</span>
        <span>Share: {share.label}</span>
      </div>
      <div className="next-action">{getSuggestedNextAction(guest)}</div>
    </button>
  );
}
