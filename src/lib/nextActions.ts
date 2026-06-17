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

function build(
  guest: Guest,
  partial: { reason: string; detail: string; templateCategory: NextAction['templateCategory']; score: number },
): NextAction {
  return { guest, ...partial, urgency: urgencyForScore(partial.score) };
}

export function getNextAction(guest: Guest): NextAction | null {
  const missing = getMissingAssets(guest);

  if (guest.stage === 'lead' || guest.stage === 'needs_approval') {
    return build(guest, {
      reason: 'Awaiting approval to reach out',
      detail: 'Decide whether to invite this lead or move them out of the queue.',
      templateCategory: null,
      score: 25,
    });
  }

  if (guest.stage === 'invited' && isOverdue(guest.nextFollowUpAt)) {
    return build(guest, {
      reason: 'Invited — no reply, follow-up overdue',
      detail: 'Send the soft follow-up. If they reply, send dates. If they pass, close out.',
      templateCategory: 'follow_up',
      score: 92,
    });
  }

  if (guest.stage === 'no_reply') {
    return build(guest, {
      reason: 'No reply — final nudge',
      detail: 'One last try on the original thread or a new channel.',
      templateCategory: 'follow_up',
      score: 70,
    });
  }

  if (guest.stage === 'approved' || (guest.stage === 'invited' && !guest.firstContactedAt)) {
    return build(guest, {
      reason: 'Approved — send the invite',
      detail: 'Use the first invite template. Personalize the hook.',
      templateCategory: 'invite',
      score: 78,
    });
  }

  if (guest.stage === 'dates_sent') {
    return build(guest, {
      reason: 'Dates sent — waiting on pick',
      detail: 'Watch the portal. If 3+ days go by, send a gentle nudge with the same dates.',
      templateCategory: 'follow_up',
      score: 55,
    });
  }

  if (guest.stage === 'date_selected') {
    return build(guest, {
      reason: 'Date selected — confirm and lock in',
      detail: 'Send the confirmation note with parking and arrival details.',
      templateCategory: 'date_confirmation',
      score: 88,
    });
  }

  if (guest.stage === 'recording_confirmed' && isWithinDays(guest.recordingDate, 1)) {
    return build(guest, {
      reason: 'Records within 24 hours',
      detail: 'Send the day-before reminder. Confirm location, parking, and timing.',
      templateCategory: 'recording_reminder',
      score: 95,
    });
  }

  if (guest.stage === 'recording_confirmed' && isWithinDays(guest.recordingDate, 3)) {
    return build(guest, {
      reason: 'Records in 3 days',
      detail: 'Confirm assets are in. Make sure prep notes are current.',
      templateCategory: 'recording_reminder',
      score: 72,
    });
  }

  if (isOverdue(guest.nextFollowUpAt)) {
    return build(guest, {
      reason: 'Overdue follow-up',
      detail: `Last touch hasn't been answered. Nudge gently.`,
      templateCategory: 'follow_up',
      score: 90,
    });
  }

  if (isTodayOrOverdue(guest.nextFollowUpAt)) {
    return build(guest, {
      reason: 'Follow-up today',
      detail: 'Scheduled follow-up is due today.',
      templateCategory: 'follow_up',
      score: 75,
    });
  }

  if (missing.length > 0 && guest.stage !== 'done' && guest.stage !== 'live' && guest.stage !== 'needs_share') {
    return build(guest, {
      reason: `Missing ${missing.length} info item${missing.length === 1 ? '' : 's'}`,
      detail: `Still needs: ${missing.join(', ')}.`,
      templateCategory: 'asset_request',
      score: 72,
    });
  }

  if (guest.stage === 'transcript_review') {
    return build(guest, {
      reason: 'Transcript review pending',
      detail: 'Nudge the guest to mark anything they want cut.',
      templateCategory: 'transcript_review',
      score: 60,
    });
  }

  if (guest.stage === 'launch_scheduled' && isWithinDays(guest.launchDate, 1)) {
    return build(guest, {
      reason: 'Launches tomorrow',
      detail: 'Send the launch-day kit so the guest can share the moment it goes live.',
      templateCategory: 'launch',
      score: 92,
    });
  }

  if (guest.stage === 'launch_scheduled') {
    return build(guest, {
      reason: 'Launch scheduled',
      detail: 'Confirm assets are ready, queue the share copy, prep the collab.',
      templateCategory: 'launch',
      score: 62,
    });
  }

  if (guest.stage === 'live' && !guest.episodeLinkSent) {
    return build(guest, {
      reason: 'Episode live — link not sent',
      detail: 'Send the live links and clip kit.',
      templateCategory: 'share_kit',
      score: 88,
    });
  }

  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.instagramCollabInviteSent) {
    return build(guest, {
      reason: 'Instagram collab not sent',
      detail: 'Send the collab invite from the episode post.',
      templateCategory: 'collab',
      score: 75,
    });
  }

  if ((guest.stage === 'live' || guest.stage === 'needs_share') && guest.instagramCollabInviteSent && !guest.instagramCollabAccepted) {
    return build(guest, {
      reason: 'Collab not accepted',
      detail: 'Nudge them to accept the Instagram collab invite.',
      templateCategory: 'collab',
      score: 65,
    });
  }

  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.guestShared) {
    return build(guest, {
      reason: 'Guest has not shared',
      detail: 'Send the share reminder with the one-tap caption and clip.',
      templateCategory: 'post_launch',
      score: 70,
    });
  }

  if (guest.stage === 'done' && !guest.thankYouSent) {
    return build(guest, {
      reason: 'Thank-you not sent',
      detail: 'Send a short thank-you and ask if there is anyone they would recommend.',
      templateCategory: 'referral',
      score: 40,
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
