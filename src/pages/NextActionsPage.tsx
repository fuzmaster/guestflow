import { useMemo, useState } from 'react';
import type { Guest, Page, Template } from '../types';
import { templates } from '../data/templates';
import { getNextActionQueue, type ActionUrgency, type NextAction } from '../lib/nextActions';
import { renderTemplate } from '../lib/guestLogic';
import { getReadinessScore } from '../lib/readiness';
import ReadinessRing from '../components/ReadinessRing';
import EmptyState from '../components/EmptyState';

type Props = {
  guests: Guest[];
  openGuest: (id: string, target?: Page) => void;
  upsertGuest: (guest: Guest) => void;
};

const urgencyLabel: Record<ActionUrgency, string> = {
  critical: 'Now',
  soon: 'Soon',
  queued: 'Queued',
};

function pickTemplate(action: NextAction): Template | null {
  if (!action.templateCategory) return null;
  return templates.find((template) => template.category === action.templateCategory) ?? null;
}

export default function NextActionsPage({ guests, openGuest, upsertGuest }: Props) {
  const queue = useMemo(() => getNextActionQueue(guests), [guests]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyTemplate(action: NextAction) {
    const template = pickTemplate(action);
    if (!template) return;
    const body = renderTemplate(template, action.guest, action.guest.hostName);
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = body;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedId(action.guest.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  function markContacted(guest: Guest) {
    const today = new Date().toISOString().slice(0, 10);
    upsertGuest({ ...guest, lastContactedAt: today, nextFollowUpAt: '' });
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Next Actions</p>
          <h2>Who needs a nudge?</h2>
        </div>
        <p className="muted">Work this queue top to bottom. One message per guest, sorted by urgency.</p>
      </header>

      {queue.length === 0 ? (
        <EmptyState
          title="Inbox zero for your show"
          body="No guest needs a nudge right now. Add a guest, schedule a recording, or run a launch to see this queue light up."
        />
      ) : (
        <section className="action-queue">
          {queue.map((action) => {
            const template = pickTemplate(action);
            const score = getReadinessScore(action.guest);
            const copied = copiedId === action.guest.id;
            return (
              <article key={action.guest.id} className={`action-row urgency-${action.urgency}`}>
                <div className="action-row__lead">
                  <ReadinessRing score={score} size={48} label={`${score}% ready`} />
                  <div>
                    <span className={`urgency-pill urgency-${action.urgency}`}>{urgencyLabel[action.urgency]}</span>
                    <strong>{action.guest.name}</strong>
                    <p className="muted">{action.guest.showName}</p>
                  </div>
                </div>
                <div className="action-row__body">
                  <strong>{action.reason}</strong>
                  <p className="muted">{action.detail}</p>
                  {template && (
                    <p className="muted action-row__template">Template: <span>{template.name}</span></p>
                  )}
                </div>
                <div className="action-row__buttons">
                  {template && (
                    <button onClick={() => copyTemplate(action)} className={copied ? 'primary' : ''}>
                      {copied ? 'Copied' : 'Copy message'}
                    </button>
                  )}
                  <button onClick={() => openGuest(action.guest.id, 'guest-portal')}>Open portal</button>
                  <button onClick={() => openGuest(action.guest.id, 'pipeline')}>Open guest</button>
                  <button onClick={() => markContacted(action.guest)}>Mark contacted</button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
