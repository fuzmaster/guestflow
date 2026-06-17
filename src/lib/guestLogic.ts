import type { AssetStatus, Guest, GuestStage, Template } from '../types';
import { isOverdue, isTodayOrOverdue, isWithinDays, formatDate } from './dates';

export const STAGES: GuestStage[] = [
  'lead',
  'needs_approval',
  'approved',
  'invited',
  'no_reply',
  'dates_sent',
  'date_selected',
  'recording_confirmed',
  'needs_assets',
  'recording_soon',
  'recorded',
  'recording_complete',
  'transcript_review',
  'editing',
  'launch_scheduled',
  'launch_soon',
  'live',
  'needs_share',
  'done',
  // legacy stages still supported
  'target',
  'contacted',
  'interested',
  'booked',
];

export function getStageLabel(stage: GuestStage): string {
  return stage
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStageColor(stage: GuestStage): string {
  const colors: Record<GuestStage, string> = {
    lead: 'gray',
    needs_approval: 'gray',
    approved: 'cyan',
    target: 'gray',
    contacted: 'blue',
    invited: 'blue',
    interested: 'cyan',
    no_reply: 'amber',
    dates_sent: 'cyan',
    date_selected: 'green',
    booked: 'green',
    recording_confirmed: 'green',
    needs_assets: 'amber',
    recording_soon: 'purple',
    recorded: 'indigo',
    recording_complete: 'indigo',
    transcript_review: 'pink',
    editing: 'pink',
    launch_scheduled: 'orange',
    launch_soon: 'orange',
    live: 'lime',
    needs_share: 'red',
    done: 'slate',
  };
  return colors[stage] ?? 'gray';
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
  if (guest.stage === 'invited' && isOverdue(guest.nextFollowUpAt)) return 'Send follow-up';
  if (guest.stage === 'no_reply') return 'Send follow-up';
  if (guest.stage === 'dates_sent') return 'Waiting on guest to pick a date';
  if (guest.stage === 'date_selected') return 'Send confirmation email';
  if (guest.stage === 'recording_confirmed' && isWithinDays(guest.recordingDate, 1))
    return 'Send day-before reminder';
  if (guest.stage === 'recording_confirmed') return 'Confirm prep notes are ready';
  if (guest.stage === 'transcript_review') return 'Nudge for transcript review';
  if (isOverdue(guest.nextFollowUpAt)) return 'Send follow-up';
  if (guest.stage === 'needs_assets' && getMissingAssets(guest).length > 0) return 'Request missing info';
  if (guest.stage === 'launch_scheduled' || guest.stage === 'launch_soon') return 'Send launch kit';
  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.instagramCollabInviteSent)
    return 'Send Instagram collab invite';
  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.instagramCollabAccepted)
    return 'Ask guest to accept Instagram collab';
  if ((guest.stage === 'live' || guest.stage === 'needs_share') && !guest.guestShared)
    return 'Send share reminder';
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

export function renderTemplate(template: Template, guest?: Guest, hostName = 'Jason Reposa'): string {
  const portalLink = guest
    ? `https://guestflow.app/g/${guest.guestPortalSlug || guest.id}`
    : 'https://guestflow.app/g/<slug>';
  const shareKitLink = guest
    ? `https://guestflow.app/share/${guest.guestPortalSlug || guest.id}`
    : 'https://guestflow.app/share/<slug>';
  const replacements: Record<string, string> = {
    guestName: guest?.name ?? 'Guest',
    company: guest?.company ?? '',
    showName: guest?.showName ?? 'High Functioning Podcast',
    episodeTitle: guest?.episodeTitle ?? 'your episode',
    recordingDate: formatDate(guest?.recordingDate),
    launchDate: formatDate(guest?.launchDate),
    episodeLink: guest?.websiteEpisodeLink || guest?.episodeLink || '',
    hostName: guest?.hostName || hostName,
    producerName: guest?.producerName ?? '',
    portalLink,
    shareKitLink,
    studioAddress: guest?.interviewAddress ?? '23 Jayar Road, Suite 6, Medway, MA 02053',
    parkingInstructions: guest?.parkingNotes ?? '',
    arrivalInstructions: guest?.arrivalInstructions ?? '',
    riversideLink: guest?.riversideLink ?? '',
    youtubeLink: guest?.youtubeLink ?? '',
    spotifyLink: guest?.spotifyLink ?? '',
    appleLink: guest?.appleLink ?? '',
    websiteEpisodeLink: guest?.websiteEpisodeLink ?? '',
  };

  return template.body.replace(
    /\{(guestName|company|showName|episodeTitle|recordingDate|launchDate|episodeLink|hostName|producerName|portalLink|shareKitLink|studioAddress|parkingInstructions|arrivalInstructions|riversideLink|youtubeLink|spotifyLink|appleLink|websiteEpisodeLink)\}/g,
    (_, key) => replacements[key] ?? '',
  );
}
