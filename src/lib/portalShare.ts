import type { Guest } from '../types';

export type SharedPortal = {
  v: 1;
  guest: PublicGuestData;
};

export type PublicGuestData = Pick<
  Guest,
  | 'id'
  | 'name'
  | 'showName'
  | 'episodeTitle'
  | 'recordingDate'
  | 'launchDate'
  | 'hostName'
  | 'instagram'
  | 'linkedin'
  | 'interviewLocationName'
  | 'interviewAddress'
  | 'parkingNotes'
  | 'arrivalInstructions'
  | 'recordingPrepNotes'
  | 'calendarLink'
  | 'recordingLink'
  | 'releaseFormLink'
  | 'pressKitLink'
  | 'youtubeLink'
  | 'spotifyLink'
  | 'appleLink'
  | 'episodeLink'
  | 'clipLinks'
  | 'guestPortalSlug'
  | 'bioStatus'
  | 'headshotStatus'
  | 'socialHandleStatus'
  | 'releaseFormStatus'
  | 'episodeLinkSent'
  | 'clipsSent'
  | 'suggestedCopySent'
  | 'instagramCollabInviteSent'
  | 'instagramCollabAccepted'
  | 'guestShared'
  | 'thankYouSent'
>;

function toPublicGuest(guest: Guest): PublicGuestData {
  return {
    id: guest.id,
    name: guest.name,
    showName: guest.showName,
    episodeTitle: guest.episodeTitle,
    recordingDate: guest.recordingDate,
    launchDate: guest.launchDate,
    hostName: guest.hostName,
    instagram: guest.instagram,
    linkedin: guest.linkedin,
    interviewLocationName: guest.interviewLocationName,
    interviewAddress: guest.interviewAddress,
    parkingNotes: guest.parkingNotes,
    arrivalInstructions: guest.arrivalInstructions,
    recordingPrepNotes: guest.recordingPrepNotes,
    calendarLink: guest.calendarLink,
    recordingLink: guest.recordingLink,
    releaseFormLink: guest.releaseFormLink,
    pressKitLink: guest.pressKitLink,
    youtubeLink: guest.youtubeLink,
    spotifyLink: guest.spotifyLink,
    appleLink: guest.appleLink,
    episodeLink: guest.episodeLink,
    clipLinks: guest.clipLinks,
    guestPortalSlug: guest.guestPortalSlug,
    bioStatus: guest.bioStatus,
    headshotStatus: guest.headshotStatus,
    socialHandleStatus: guest.socialHandleStatus,
    releaseFormStatus: guest.releaseFormStatus,
    episodeLinkSent: guest.episodeLinkSent,
    clipsSent: guest.clipsSent,
    suggestedCopySent: guest.suggestedCopySent,
    instagramCollabInviteSent: guest.instagramCollabInviteSent,
    instagramCollabAccepted: guest.instagramCollabAccepted,
    guestShared: guest.guestShared,
    thankYouSent: guest.thankYouSent,
  };
}

function b64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodePortalShare(guest: Guest): string {
  const payload: SharedPortal = { v: 1, guest: toPublicGuest(guest) };
  return b64UrlEncode(JSON.stringify(payload));
}

export function decodePortalShare(encoded: string): SharedPortal | null {
  try {
    const json = b64UrlDecode(encoded);
    const parsed = JSON.parse(json);
    if (!parsed || parsed.v !== 1 || !parsed.guest) return null;
    return parsed as SharedPortal;
  } catch {
    return null;
  }
}

export function readSharedPortalFromUrl(): SharedPortal | null {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const data = params.get('d');
  if (!data) return null;
  return decodePortalShare(data);
}
