import type { GuestStage } from '../types';
import { getStageColor, getStageLabel } from '../lib/guestLogic';

export default function StatusPill({ stage }: { stage: GuestStage }) {
  return <span className={`pill pill-${getStageColor(stage)}`}>{getStageLabel(stage)}</span>;
}
