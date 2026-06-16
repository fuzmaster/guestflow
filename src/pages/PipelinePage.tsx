import { useMemo, useState } from 'react';
import type { Guest, GuestStage } from '../types';
import { STAGES, getStageLabel } from '../lib/guestLogic';
import GuestCard from '../components/GuestCard';
import GuestForm from '../components/GuestForm';

type Props = {
  guests: Guest[];
  selectedGuest?: Guest;
  setSelectedGuestId: (id: string) => void;
  upsertGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
};

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
      <header className="page-header">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h2>Guest Pipeline</h2>
        </div>
        <button className="primary" onClick={() => setShowAdd((value) => !value)}>{showAdd ? 'Close form' : 'Add guest'}</button>
      </header>
      {showAdd && <GuestForm onSave={(guest) => { upsertGuest(guest); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}
      <div className="kanban">
        {STAGES.map((stage) => (
          <section className="kanban-column" key={stage}>
            <div className="column-header">
              <strong>{getStageLabel(stage)}</strong>
              <span>{grouped[stage].length}</span>
            </div>
            {grouped[stage].length === 0 ? (
              <p className="kanban-empty">No one here yet.</p>
            ) : (
              grouped[stage].map((guest) => (
                <div key={guest.id} className="pipeline-card-wrap">
                  <GuestCard guest={guest} onClick={() => setSelectedGuestId(guest.id)} />
                  <select value={guest.stage} onChange={(event) => upsertGuest({ ...guest, stage: event.target.value as GuestStage })}>
                    {STAGES.map((nextStage) => <option key={nextStage} value={nextStage}>{getStageLabel(nextStage)}</option>)}
                  </select>
                </div>
              ))
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
