import type { Guest } from '../types';
import { mockGuests } from '../data/mockGuests';
import { slugify } from './slug';

const KEY = 'guestflow.guests.v3';
const LEGACY_KEYS = ['guestflow.guests.v2', 'guestflow.guests.v1'];

export function normalizeGuest(guest: Partial<Guest>): Guest {
  const today = new Date().toISOString().slice(0, 10);
  const name = guest.name || 'Untitled guest';
  const showName = guest.showName || 'High Functioning Podcast';
  return {
    id: guest.id || crypto.randomUUID(),
    name,
    company: guest.company || '',
    title: guest.title || '',
    email: guest.email || '',
    instagram: guest.instagram || '',
    linkedin: guest.linkedin || '',
    websiteUrl: guest.websiteUrl || '',
    phone: guest.phone || '',
    otherSocialLinks: guest.otherSocialLinks || '',
    source: guest.source,
    showName,
    episodeTitle: guest.episodeTitle || '',
    stage: guest.stage || 'lead',
    preferredChannel: guest.preferredChannel || 'email',
    lastContactedAt: guest.lastContactedAt || '',
    firstContactedAt: guest.firstContactedAt || '',
    lastResponseAt: guest.lastResponseAt || '',
    nextFollowUpAt: guest.nextFollowUpAt || '',
    outreachHistory: guest.outreachHistory || '',
    recordingDate: guest.recordingDate || '',
    launchDate: guest.launchDate || '',
    availableDates: Array.isArray(guest.availableDates) ? guest.availableDates : [],
    selectedDateId: guest.selectedDateId,
    confirmedDateId: guest.confirmedDateId,
    recordingType: guest.recordingType || 'in_person_preferred',
    riversideLink: guest.riversideLink || '',
    schedulingNotes: guest.schedulingNotes || '',
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
    suggestedTopics: guest.suggestedTopics || '',
    guestProvidedTopics: guest.guestProvidedTopics || '',
    questionsToAsk: guest.questionsToAsk || '',
    subscribedToChannel: Boolean(guest.subscribedToChannel),
    specialInstructions: guest.specialInstructions || '',
    guestPrepNotes: guest.guestPrepNotes || '',
    transcriptStatus: guest.transcriptStatus || 'not_available',
    transcriptLink: guest.transcriptLink || '',
    transcriptNotes: guest.transcriptNotes || '',
    hostName: guest.hostName || 'Jason Reposa',
    hostEmail: guest.hostEmail || '',
    producerName: guest.producerName || '',
    producerEmail: guest.producerEmail || '',
    producerPhone: guest.producerPhone || '',
    interviewLocationName: guest.interviewLocationName || '',
    interviewAddress: guest.interviewAddress || '',
    parkingNotes: guest.parkingNotes || '',
    arrivalInstructions: guest.arrivalInstructions || '',
    recordingPrepNotes: guest.recordingPrepNotes || '',
    showInstructions: guest.showInstructions || '',
    calendarLink: guest.calendarLink || '',
    recordingLink: guest.recordingLink || '',
    episodeLink: guest.episodeLink || '',
    spotifyLink: guest.spotifyLink || '',
    appleLink: guest.appleLink || '',
    youtubeLink: guest.youtubeLink || '',
    websiteEpisodeLink: guest.websiteEpisodeLink || '',
    pressKitLink: guest.pressKitLink || '',
    releaseFormLink: guest.releaseFormLink || '',
    clipLinks: Array.isArray(guest.clipLinks) ? guest.clipLinks : [],
    suggestedPostCopy: guest.suggestedPostCopy || '',
    teamShareMessage: guest.teamShareMessage || '',
    messages: Array.isArray(guest.messages) ? guest.messages : [],
    guestNotes: Array.isArray(guest.guestNotes) ? guest.guestNotes : [],
    guestPortalSlug: guest.guestPortalSlug || slugify(`${showName}-${name}`),
    guestPortalEnabled: guest.guestPortalEnabled ?? true,
    createdAt: guest.createdAt || today,
    updatedAt: guest.updatedAt || today,
  };
}

function readRaw(): string | null {
  const raw = localStorage.getItem(KEY);
  if (raw) return raw;
  for (const legacy of LEGACY_KEYS) {
    const legacyRaw = localStorage.getItem(legacy);
    if (legacyRaw) return legacyRaw;
  }
  return null;
}

export function loadGuests(): Guest[] {
  try {
    const raw = readRaw();
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
