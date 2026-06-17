import type { Guest } from '../types';

export type ShowDefaults = {
  showName: string;
  portalTitle: string;
  hostName: string;
  hostEmail: string;
  producerName: string;
  producerEmail: string;
  producerPhone: string;
  interviewLocationName: string;
  interviewAddress: string;
  parkingNotes: string;
  arrivalInstructions: string;
  recordingPrepNotes: string;
  showInstructions: string;
  releaseFormLink: string;
  pressKitLink: string;
  youtubeLink: string;
  spotifyLink: string;
  appleLink: string;
  websiteEpisodeLink: string;
  instagramHandle: string;
  tiktokHandle: string;
  linkedinPage: string;
  websiteUrl: string;
};

const KEY = 'guestflow.showDefaults.v1';

export const HF_DEFAULTS: ShowDefaults = {
  showName: 'High Functioning Podcast',
  portalTitle: 'High Functioning Guest Portal',
  hostName: 'Jason Reposa',
  hostEmail: '',
  producerName: '',
  producerEmail: '',
  producerPhone: '',
  interviewLocationName: 'Good Feels / High Functioning Podcast',
  interviewAddress: '23 Jayar Road, Suite 6, Medway, MA 02053',
  parkingNotes: 'Please park in the lot and ring the doorbell near the Good Feels door when you arrive.',
  arrivalInstructions: 'Arrive 10 minutes early. Bring water and any notes you want to reference.',
  recordingPrepNotes:
    'We keep it conversational. Bring a couple of stories with real details — specifics make better radio than abstractions.',
  showInstructions: [
    'The conversation is casual and long-form.',
    'Audio and video will be recorded.',
    'Clips may be used for social media.',
    'If something needs to be cut, tell us before the final edit.',
    'Bring any topic notes you want to cover.',
  ].join('\n'),
  releaseFormLink: '',
  pressKitLink: '',
  youtubeLink: '',
  spotifyLink: '',
  appleLink: '',
  websiteEpisodeLink: '',
  instagramHandle: '',
  tiktokHandle: '',
  linkedinPage: '',
  websiteUrl: '',
};

export const emptyShowDefaults: ShowDefaults = HF_DEFAULTS;

export function loadShowDefaults(): ShowDefaults {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return HF_DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...HF_DEFAULTS, ...parsed };
  } catch {
    return HF_DEFAULTS;
  }
}

export function saveShowDefaults(defaults: ShowDefaults): void {
  localStorage.setItem(KEY, JSON.stringify(defaults));
}

export function applyShowDefaults(guest: Guest, defaults: ShowDefaults): Guest {
  const fallback = <K extends keyof Guest>(key: K, value: Guest[K]): Guest[K] => {
    const current = guest[key];
    if (current && String(current).trim()) return current;
    return value;
  };
  return {
    ...guest,
    hostName: fallback('hostName', defaults.hostName),
    hostEmail: fallback('hostEmail', defaults.hostEmail),
    producerName: fallback('producerName', defaults.producerName),
    producerEmail: fallback('producerEmail', defaults.producerEmail),
    producerPhone: fallback('producerPhone', defaults.producerPhone),
    showName: guest.showName?.trim() ? guest.showName : defaults.showName || guest.showName,
    interviewLocationName: fallback('interviewLocationName', defaults.interviewLocationName),
    interviewAddress: fallback('interviewAddress', defaults.interviewAddress),
    parkingNotes: fallback('parkingNotes', defaults.parkingNotes),
    arrivalInstructions: fallback('arrivalInstructions', defaults.arrivalInstructions),
    recordingPrepNotes: fallback('recordingPrepNotes', defaults.recordingPrepNotes),
    showInstructions: fallback('showInstructions', defaults.showInstructions),
    releaseFormLink: fallback('releaseFormLink', defaults.releaseFormLink),
    pressKitLink: fallback('pressKitLink', defaults.pressKitLink),
    youtubeLink: fallback('youtubeLink', defaults.youtubeLink),
    spotifyLink: fallback('spotifyLink', defaults.spotifyLink),
    appleLink: fallback('appleLink', defaults.appleLink),
    websiteEpisodeLink: fallback('websiteEpisodeLink', defaults.websiteEpisodeLink),
  };
}
