import type { Guest } from '../types';
import { formatDate, isOverdue } from '../lib/dates';
import { getMissingAssets, getShareChecklistProgress, getSuggestedNextAction } from '../lib/guestLogic';
import { getReadinessScore } from '../lib/readiness';
import StatusPill from './StatusPill';
import ReadinessRing from './ReadinessRing';

type Props = {
  guest: Guest;
  onClick?: () => void;
};

export default function GuestCard({ guest, onClick }: Props) {
  const missing = getMissingAssets(guest);
  const share = getShareChecklistProgress(guest);
  const score = getReadinessScore(guest);
  return (
    <button className="guest-card" onClick={onClick}>
      <div className="card-topline">
        <div className="card-topline__left">
          <ReadinessRing score={score} size={36} />
          <strong>{guest.name}</strong>
        </div>
        <StatusPill stage={guest.stage} />
      </div>
      <p className="muted" style={{ fontSize: 12, margin: 0 }}>{guest.company || guest.showName}</p>
      <div className="card-grid">
        <span>Next · {formatDate(guest.nextFollowUpAt)}</span>
        {isOverdue(guest.nextFollowUpAt) ? <span className="warn-text">Overdue</span> : <span>·</span>}
        <span>Miss · {missing.length}</span>
        <span>Share · {share.label}</span>
      </div>
      <div className="next-action">{getSuggestedNextAction(guest)}</div>
    </button>
  );
}
