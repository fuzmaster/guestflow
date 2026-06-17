import { useMemo, useState } from 'react';
import type { Guest, Page, Template } from '../types';
import { templates } from '../data/templates';
import { getNextActionQueue, type ActionUrgency, type NextAction } from '../lib/nextActions';
import { renderTemplate } from '../lib/guestLogic';
import { getReadinessScore } from '../lib/readiness';
import ReadinessRing from '../components/ReadinessRing';
import PageHero from '../components/PageHero';
import SheetDivider from '../components/SheetDivider';
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

const primaryLabel: Record<string, string> = {
  invite: 'Send invite',
  follow_up: 'Copy follow-up',
  booking: 'Copy booking note',
  recording_reminder: 'Copy reminder',
  asset_request: 'Copy request',
  launch: 'Copy launch kit',
  collab: 'Copy collab note',
  post_launch: 'Copy share copy',
  referral: 'Copy thank-you',
};

function pickTemplate(action: NextAction): Template | null {
  if (!action.templateCategory) return null;
  return templates.find((template) => template.category === action.templateCategory) ?? null;
}

export default function NextActionsPage({ guests, openGuest, upsertGuest }: Props) {
  const queue = useMemo(() => getNextActionQueue(guests), [guests]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const critical = queue.filter((a) => a.urgency === 'critical').length;

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

  function snooze(guest: Guest) {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    upsertGuest({ ...guest, nextFollowUpAt: d.toISOString().slice(0, 10) });
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Next Actions · Run of Show"
        title="Who needs a nudge?"
        sub="Work this queue top to bottom. One message per guest, sorted by urgency."
        counter={
          critical > 0
            ? { value: critical.toString().padStart(2, '0'), label: 'Need attention now', tone: 'critical' }
            : { value: queue.length.toString().padStart(2, '0'), label: 'Cues in queue', tone: 'quiet' }
        }
      />

      <div style={{ padding: '0 clamp(28px,4vw,56px)' }}>
        <SheetDivider left={`Queue · ${queue.length.toString().padStart(2, '0')} cues`} right="Sorted · urgency" />
      </div>

      <section className="page-section">
        {queue.length === 0 ? (
          <EmptyState
            title="Inbox zero for your show"
            body="No guest needs a nudge right now. Add a guest, schedule a recording, or run a launch to see this queue light up."
          />
        ) : (
          queue.map((action, index) => {
            const template = pickTemplate(action);
            const score = getReadinessScore(action.guest);
            const copied = copiedId === action.guest.id;
            const cue = (index + 1).toString().padStart(2, '0');
            const primary = template ? primaryLabel[template.category] ?? 'Copy message' : 'Open guest';
            return (
              <article key={action.guest.id} className={`action-row urgency-${action.urgency}`}>
                <div className="action-row__bar" />
                <div className="action-row__cue">{cue}</div>
                <div className="action-row__ring">
                  <ReadinessRing score={score} size={56} label={`${score}% ready`} />
                </div>
                <div className="action-row__body">
                  <div className="action-row__heading">
                    <span className={`urgency-pill urgency-${action.urgency}`}>{urgencyLabel[action.urgency]}</span>
                    <strong>{action.guest.name}</strong>
                    <span className="show">· {action.guest.showName}</span>
                  </div>
                  <div className="action-row__reason">{action.reason}</div>
                  <div className="action-row__detail">{action.detail}</div>
                  {template && (
                    <div className="action-row__template">Template · <span>{template.name}</span></div>
                  )}
                </div>
                <div className="action-row__actions">
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => (template ? copyTemplate(action) : openGuest(action.guest.id, 'pipeline'))}
                  >
                    {copied ? 'Copied' : primary}
                  </button>
                  <details className="overflow-menu">
                    <summary>···</summary>
                    <div className="overflow-menu__panel">
                      <button onClick={() => openGuest(action.guest.id, 'guest-portal')}>Open portal</button>
                      <button onClick={() => openGuest(action.guest.id, 'pipeline')}>Open guest</button>
                      <button onClick={() => markContacted(action.guest)}>Mark contacted</button>
                      <button onClick={() => snooze(action.guest)}>Snooze 3 days</button>
                      <button className="is-quiet" onClick={() => markContacted(action.guest)}>Skip</button>
                    </div>
                  </details>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
