import type { Guest } from '../types';
import { mockGuests } from '../data/mockGuests';
import { slugify } from './slug';

const KEY = 'guestflow.guests.v2';
const OLD_KEY = 'guestflow.guests.v1';

export function normalizeGuest(guest: Partial<Guest>): Guest {
  const today = new Date().toISOString().slice(0, 10);
  const name = guest.name || 'Untitled guest';
  const showName = guest.showName || 'Untitled show';
  return {
    id: guest.id || crypto.randomUUID(),
    name,
    company: guest.company || '',
    title: guest.title || '',
    email: guest.email || '',
    instagram: guest.instagram || '',
    linkedin: guest.linkedin || '',
    phone: guest.phone || '',
    showName,
    episodeTitle: guest.episodeTitle || '',
    stage: guest.stage || 'target',
    preferredChannel: guest.preferredChannel || 'email',
    lastContactedAt: guest.lastContactedAt || '',
    lastResponseAt: guest.lastResponseAt || '',
    nextFollowUpAt: guest.nextFollowUpAt || '',
    recordingDate: guest.recordingDate || '',
    launchDate: guest.launchDate || '',
    bioStatus: guest.bioStatus || 'needed',
    headshotStatus: guest.headshotStatus || 'needed',
    socialHandleStatus: guest.socialHandleStatus || 'needed',
    releaseFormStatus: guest.releaseFormStatus || 'needed',
    episodeLinkSent: Boolean(guest.episodeLinkSent),
    clipsSent: Boolean(guest.clipsSent),
    suggestedCopySent: Boolean(guest.suggestedCopySent),
    instagramCollabInviteSent: Boolean(guest.instagramCollabInviteSent),
    instagramCollabAccepted: Boolean(guest.instagramCollabAccepted),
    guestShared: Boolean(guest.guestShared),
    thankYouSent: Boolean(guest.thankYouSent),
    notes: guest.notes || '',
    tags: guest.tags || [],
    hostName: guest.hostName || 'Your Host',
    hostEmail: guest.hostEmail || '',
    producerName: guest.producerName || '',
    producerEmail: guest.producerEmail || '',
    interviewLocationName: guest.interviewLocationName || '',
    interviewAddress: guest.interviewAddress || '',
    parkingNotes: guest.parkingNotes || '',
    arrivalInstructions: guest.arrivalInstructions || '',
    recordingPrepNotes: guest.recordingPrepNotes || '',
    calendarLink: guest.calendarLink || '',
    recordingLink: guest.recordingLink || '',
    episodeLink: guest.episodeLink || '',
    spotifyLink: guest.spotifyLink || '',
    appleLink: guest.appleLink || '',
    youtubeLink: guest.youtubeLink || '',
    pressKitLink: guest.pressKitLink || '',
    releaseFormLink: guest.releaseFormLink || '',
    clipLinks: Array.isArray(guest.clipLinks) ? guest.clipLinks : [],
    guestPortalSlug: guest.guestPortalSlug || slugify(`${showName}-${name}`),
    guestPortalEnabled: guest.guestPortalEnabled ?? true,
    createdAt: guest.createdAt || today,
    updatedAt: guest.updatedAt || today,
  };
}

export function loadGuests(): Guest[] {
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY);
    if (!raw) return mockGuests;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeGuest) : mockGuests;
  } catch {
    return mockGuests;
  }
}

export function saveGuests(guests: Guest[]) {
  localStorage.setItem(KEY, JSON.stringify(guests.map(normalizeGuest), null, 2));
}

export function resetGuests(): Guest[] {
  saveGuests(mockGuests);
  return mockGuests;
}
