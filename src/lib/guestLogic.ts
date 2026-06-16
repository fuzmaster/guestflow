import type { AssetStatus, Guest, GuestStage, Template } from '../types';
import { isOverdue, isTodayOrOverdue, isWithinDays, formatDate } from './dates';

export const STAGES: GuestStage[] = [
  'target',
  'contacted',
  'interested',
  'booked',
  'needs_assets',
  'recording_soon',
  'recorded',
  'editing',
  'launch_soon',
  'live',
  'needs_share',
  'done',
];

export function getStageLabel(stage: GuestStage): string {
  return stage
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStageColor(stage: GuestStage): string {
  const colors: Record<GuestStage, string> = {
    target: 'gray',
    contacted: 'blue',
    interested: 'cyan',
    booked: 'green',
    needs_assets: 'amber',
    recording_soon: 'purple',
    recorded: 'indigo',
    editing: 'pink',
    launch_soon: 'orange',
    live: 'lime',
    needs_share: 'red',
    done: 'slate',
  };
  return colors[stage];
}

const assetMap: { key: keyof Pick<Guest, 'bioStatus' | 'headshotStatus' | 'socialHandleStatus' | 'releaseFormStatus'>; label: string }[] = [
  { key: 'bioStatus', label: 'Bio' },
  { key: 'headshotStatus', label: 'Headshot' },
  { key: 'socialHandleStatus', label: 'Social handles' },
  { key: 'releaseFormStatus', label: 'Release form' },
];

export function getMissingAssets(guest: Guest): string[] {
  return assetMap
    .filter(({ key }) => guest[key] === 'needed' || guest[key] === 'requested')
    .map(({ label }) => label);
}

export function getAssetStatus(guest: Guest, label: string): AssetStatus | undefined {
  const item = assetMap.find((asset) => asset.label === label);
  return item ? guest[item.key] : undefined;
}

export function getShareChecklistProgress(guest: Guest): { done: number; total: number; label: string } {
  const checks = [
    guest.episodeLinkSent,
    guest.clipsSent,
    guest.suggestedCopySent,
    guest.instagramCollabInviteSent,
    guest.instagramCollabAccepted,
    guest.guestShared,
    guest.thankYouSent,
  ];
  const done = checks.filter(Boolean).length;
  return { done, total: checks.length, label: `${done}/${checks.length}` };
}

export { isOverdue, isWithinDays };

export function getSuggestedNextAction(guest: Guest): string {
  if (isOverdue(guest.nextFollowUpAt)) return 'Send follow-up';
  if (guest.stage === 'booked' && isWithinDays(guest.recordingDate, 1)) return 'Send day-before recording reminder';
  if (guest.stage === 'needs_assets' && getMissingAssets(guest).length > 0) return 'Request missing assets';
  if (guest.stage === 'launch_soon') return 'Send launch reminder';
  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.instagramCollabInviteSent) return 'Send Instagram collab invite';
  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.instagramCollabAccepted) return 'Ask guest to accept Instagram collab';
  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.guestShared) return 'Send share reminder';
  if (guest.stage === 'done' && !guest.thankYouSent) return 'Send thank-you';
  return 'Review guest status';
}

export function getGuestsNeedingFollowUpToday(guests: Guest[]): Guest[] {
  return guests.filter((guest) => isTodayOrOverdue(guest.nextFollowUpAt));
}

export function getGuestsRecordingSoon(guests: Guest[]): Guest[] {
  return guests.filter((guest) => isWithinDays(guest.recordingDate, 3));
}

export function getGuestsLaunchingSoon(guests: Guest[]): Guest[] {
  return guests.filter((guest) => isWithinDays(guest.launchDate, 3));
}

export function getGuestsNeedingCollabAttention(guests: Guest[]): Guest[] {
  return guests.filter(
    (guest) =>
      (guest.stage === 'live' || guest.stage === 'needs_share') &&
      (!guest.instagramCollabInviteSent || !guest.instagramCollabAccepted || !guest.guestShared),
  );
}

export function renderTemplate(template: Template, guest?: Guest, hostName = 'Your Host'): string {
  const replacements: Record<string, string> = {
    guestName: guest?.name ?? 'Guest',
    showName: guest?.showName ?? 'the show',
    episodeTitle: guest?.episodeTitle ?? 'your episode',
    recordingDate: formatDate(guest?.recordingDate),
    launchDate: formatDate(guest?.launchDate),
    episodeLink: 'https://example.com/episode-link',
    hostName,
  };

  return template.body.replace(/\{(guestName|showName|episodeTitle|recordingDate|launchDate|episodeLink|hostName)\}/g, (_, key) => replacements[key]);
}
