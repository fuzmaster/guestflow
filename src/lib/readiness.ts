import type { Guest } from '../types';

export type ReadinessSignal = {
  key: string;
  label: string;
  done: boolean;
};

export function getReadinessSignals(guest: Guest): ReadinessSignal[] {
  return [
    {
      key: 'date_selected',
      label: 'Recording date selected',
      done: Boolean(guest.selectedDateId || guest.confirmedDateId || guest.recordingDate),
    },
    { key: 'recording_date', label: 'Recording date set', done: Boolean(guest.recordingDate) },
    {
      key: 'location_or_link',
      label: 'Location or remote link set',
      done: Boolean(guest.interviewAddress || guest.recordingLink),
    },
    { key: 'bio', label: 'Bio received', done: guest.bioStatus === 'received' || guest.bioStatus === 'not_needed' },
    {
      key: 'headshot',
      label: 'Headshot received',
      done: guest.headshotStatus === 'received' || guest.headshotStatus === 'not_needed',
    },
    {
      key: 'socials',
      label: 'Social handles received',
      done:
        guest.socialHandleStatus === 'received' ||
        guest.socialHandleStatus === 'not_needed' ||
        Boolean(guest.instagram || guest.linkedin),
    },
    {
      key: 'release_form',
      label: 'Release form received',
      done:
        guest.releaseFormStatus === 'received' ||
        guest.releaseFormStatus === 'not_needed',
    },
    { key: 'launch_date', label: 'Launch date set', done: Boolean(guest.launchDate) },
    {
      key: 'episode_link',
      label: 'Episode link added',
      done: Boolean(guest.episodeLink || guest.youtubeLink || guest.spotifyLink || guest.appleLink),
    },
    { key: 'clips', label: 'Clips ready', done: guest.clipLinks.length > 0 },
    { key: 'share_done', label: 'Share checklist complete', done: isShareComplete(guest) },
  ];
}

function isShareComplete(guest: Guest): boolean {
  return (
    guest.episodeLinkSent &&
    guest.clipsSent &&
    guest.suggestedCopySent &&
    guest.instagramCollabInviteSent &&
    guest.instagramCollabAccepted &&
    guest.guestShared &&
    guest.thankYouSent
  );
}

export function getReadinessScore(guest: Guest): number {
  const signals = getReadinessSignals(guest);
  const done = signals.filter((signal) => signal.done).length;
  return Math.round((done / signals.length) * 100);
}

export type ReadinessLevel = 'low' | 'mid' | 'high';

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= 85) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}

export function getReadinessSentence(score: number): string {
  if (score >= 85) return "You're all set for your interview.";
  if (score >= 50) return `You're ${score}% ready for your interview.`;
  return `You're ${score}% ready — a few things still need attention.`;
}
