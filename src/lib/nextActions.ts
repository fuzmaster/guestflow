import type { Guest, Template } from '../types';
import { isOverdue, isTodayOrOverdue, isWithinDays } from './dates';
import { getMissingAssets } from './guestLogic';

export type ActionUrgency = 'critical' | 'soon' | 'queued';

export type NextAction = {
  guest: Guest;
  reason: string;
  detail: string;
  templateCategory: Template['category'] | null;
  urgency: ActionUrgency;
  score: number;
};

function urgencyForScore(score: number): ActionUrgency {
  if (score >= 80) return 'critical';
  if (score >= 50) return 'soon';
  return 'queued';
}

function buildAction(
  guest: Guest,
  partial: { reason: string; detail: string; templateCategory: NextAction['templateCategory']; score: number },
): NextAction {
  return { guest, ...partial, urgency: urgencyForScore(partial.score) };
}

export function getNextAction(guest: Guest): NextAction | null {
  const missing = getMissingAssets(guest);

  if (isOverdue(guest.nextFollowUpAt)) {
    return buildAction(guest, {
      reason: 'Overdue follow-up',
      detail: `Last touch hasn't been answered. Nudge gently.`,
      templateCategory: 'follow_up',
      score: 95,
    });
  }

  if (isTodayOrOverdue(guest.nextFollowUpAt)) {
    return buildAction(guest, {
      reason: 'Follow-up today',
      detail: 'Scheduled follow-up is due today.',
      templateCategory: 'follow_up',
      score: 80,
    });
  }

  if (
    (guest.stage === 'booked' || guest.stage === 'recording_soon') &&
    isWithinDays(guest.recordingDate, 1)
  ) {
    return buildAction(guest, {
      reason: 'Records within 24 hours',
      detail: 'Send the day-before reminder with parking and arrival details.',
      templateCategory: 'recording_reminder',
      score: 92,
    });
  }

  if (
    (guest.stage === 'booked' || guest.stage === 'recording_soon') &&
    isWithinDays(guest.recordingDate, 3)
  ) {
    return buildAction(guest, {
      reason: 'Records in 3 days',
      detail: 'Confirm prep notes and timing.',
      templateCategory: 'recording_reminder',
      score: 70,
    });
  }

  if (missing.length > 0 && guest.stage !== 'done') {
    return buildAction(guest, {
      reason: `Missing ${missing.length} asset${missing.length === 1 ? '' : 's'}`,
      detail: `Still needs: ${missing.join(', ')}.`,
      templateCategory: 'asset_request',
      score: 75,
    });
  }

  if (guest.stage === 'launch_soon' && isWithinDays(guest.launchDate, 1)) {
    return buildAction(guest, {
      reason: 'Launches tomorrow',
      detail: 'Send the launch-day kit so they can share the moment it goes live.',
      templateCategory: 'launch',
      score: 90,
    });
  }

  if (guest.stage === 'launch_soon') {
    return buildAction(guest, {
      reason: 'Launches soon',
      detail: 'Confirm assets are ready and queue up share copy.',
      templateCategory: 'launch',
      score: 60,
    });
  }

  if (guest.stage === 'live' && !guest.episodeLinkSent) {
    return buildAction(guest, {
      reason: 'Episode is live — link not sent',
      detail: 'Send them the live link and clips.',
      templateCategory: 'post_launch',
      score: 88,
    });
  }

  if (
    (guest.stage === 'live' || guest.stage === 'needs_share') &&
    !guest.instagramCollabInviteSent
  ) {
    return buildAction(guest, {
      reason: 'Instagram collab not sent',
      detail: 'Send the collab invite from the episode post.',
      templateCategory: 'collab',
      score: 75,
    });
  }

  if (
    (guest.stage === 'live' || guest.stage === 'needs_share') &&
    guest.instagramCollabInviteSent &&
    !guest.instagramCollabAccepted
  ) {
    return buildAction(guest, {
      reason: 'Collab not accepted',
      detail: 'Nudge them to accept the Instagram collab invite.',
      templateCategory: 'collab',
      score: 65,
    });
  }

  if (
    (guest.stage === 'live' || guest.stage === 'needs_share') &&
    !guest.guestShared
  ) {
    return buildAction(guest, {
      reason: 'Guest has not shared',
      detail: 'Send the share reminder with one-tap caption.',
      templateCategory: 'post_launch',
      score: 70,
    });
  }

  if (guest.stage === 'done' && !guest.thankYouSent) {
    return buildAction(guest, {
      reason: 'Thank-you not sent',
      detail: 'Send a short thank-you and ask if there is anyone they would recommend.',
      templateCategory: 'referral',
      score: 40,
    });
  }

  if (guest.stage === 'target') {
    return buildAction(guest, {
      reason: 'Target — not yet contacted',
      detail: 'Send the first invite.',
      templateCategory: 'invite',
      score: 35,
    });
  }

  return null;
}

export function getNextActionQueue(guests: Guest[]): NextAction[] {
  const actions: NextAction[] = [];
  for (const guest of guests) {
    const action = getNextAction(guest);
    if (action) actions.push(action);
  }
  return actions.sort((a, b) => b.score - a.score);
}
