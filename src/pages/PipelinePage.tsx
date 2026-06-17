import { useMemo, useState } from 'react';
import type { Guest, GuestStage } from '../types';
import { STAGES, getStageLabel } from '../lib/guestLogic';
import { getReadinessScore } from '../lib/readiness';
import { formatDate } from '../lib/dates';
import GuestForm from '../components/GuestForm';
import ReadinessRing from '../components/ReadinessRing';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';

type Props = {
  guests: Guest[];
  selectedGuest?: Guest;
  setSelectedGuestId: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
};

function stageHint(guest: Guest): string {
  if (guest.recordingDate) return `Records ${formatDate(guest.recordingDate)}`;
  if (guest.launchDate) return `Launches ${formatDate(guest.launchDate)}`;
  if (guest.nextFollowUpAt) return `Follow up ${formatDate(guest.nextFollowUpAt)}`;
  return guest.company || guest.showName;
}

export default function PipelinePage({ guests, setSelectedGuestId, upsertGuest }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const grouped = useMemo(() => {
    return STAGES.reduce<Record<GuestStage, Guest[]>>((acc, stage) => {
      acc[stage] = guests.filter((guest) => guest.stage === stage);
      return acc;
    }, {} as Record<GuestStage, Guest[]>);
  }, [guests]);

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Pipeline · 12 stages"
        title="Guest Pipeline"
        sub="Every guest from first yes to final share. Scroll across the stages."
        right={
          <button className="btn-primary btn-sm" onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? 'Close form' : 'Add guest'}
          </button>
        }
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left="Target" right="Done" />
      </div>

      {showAdd && (
        <section className="page-section">
          <GuestForm onSave={(guest) => { upsertGuest(guest); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </section>
      )}

      <div className="kanban gf-scroll">
        {STAGES.map((stage) => (
          <section className="kanban-column" key={stage}>
            <div className="kanban-column__head">
              <strong>{getStageLabel(stage)}</strong>
              <span>{grouped[stage].length.toString().padStart(2, '0')}</span>
            </div>
            {grouped[stage].length === 0 ? (
              <div className="kanban-empty">
                <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /></svg>
                <span>No one here yet</span>
              </div>
            ) : (
              grouped[stage].map((guest) => {
                const score = getReadinessScore(guest);
                return (
                  <div key={guest.id}>
                    <button className="kanban-card" onClick={() => setSelectedGuestId(guest.id)}>
                      <div className="kanban-card__head">
                        <ReadinessRing score={score} size={40} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="kanban-card__name">{guest.name}</div>
                          <div className="kanban-card__show">{guest.showName}</div>
                        </div>
                      </div>
                      <div className="kanban-card__hint">{stageHint(guest)}</div>
                    </button>
                    <select
                      className="kanban-stage-select"
                      style={{ width: '100%', marginTop: 6 }}
                      value={guest.stage}
                      onChange={(event) => upsertGuest({ ...guest, stage: event.target.value as GuestStage })}
                    >
                      {STAGES.map((nextStage) => <option key={nextStage} value={nextStage}>{getStageLabel(nextStage)}</option>)}
                    </select>
                  </div>
                );
              })
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
