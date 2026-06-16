import type { Guest } from '../types';

export type ShowDefaults = {
  hostName: string;
  hostEmail: string;
  producerName: string;
  producerEmail: string;
  showName: string;
  interviewLocationName: string;
  interviewAddress: string;
  parkingNotes: string;
  arrivalInstructions: string;
  recordingPrepNotes: string;
  releaseFormLink: string;
  pressKitLink: string;
  youtubeLink: string;
  spotifyLink: string;
  appleLink: string;
};

const KEY = 'guestflow.showDefaults.v1';

export const emptyShowDefaults: ShowDefaults = {
  hostName: '',
  hostEmail: '',
  producerName: '',
  producerEmail: '',
  showName: '',
  interviewLocationName: '',
  interviewAddress: '',
  parkingNotes: '',
  arrivalInstructions: '',
  recordingPrepNotes: '',
  releaseFormLink: '',
  pressKitLink: '',
  youtubeLink: '',
  spotifyLink: '',
  appleLink: '',
};

export function loadShowDefaults(): ShowDefaults {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyShowDefaults;
    const parsed = JSON.parse(raw);
    return { ...emptyShowDefaults, ...parsed };
  } catch {
    return emptyShowDefaults;
  }
}

export function saveShowDefaults(defaults: ShowDefaults): void {
  localStorage.setItem(KEY, JSON.stringify(defaults));
}

export function applyShowDefaults(guest: Guest, defaults: ShowDefaults): Guest {
  const inherit = <K extends keyof Guest & keyof ShowDefaults>(key: K): Guest[K] => {
    const current = guest[key];
    if (current && String(current).trim()) return current;
    return defaults[key] as Guest[K];
  };
  return {
    ...guest,
    hostName: inherit('hostName'),
    hostEmail: inherit('hostEmail'),
    producerName: inherit('producerName'),
    producerEmail: inherit('producerEmail'),
    showName: guest.showName?.trim() ? guest.showName : defaults.showName || guest.showName,
    interviewLocationName: inherit('interviewLocationName'),
    interviewAddress: inherit('interviewAddress'),
    parkingNotes: inherit('parkingNotes'),
    arrivalInstructions: inherit('arrivalInstructions'),
    recordingPrepNotes: inherit('recordingPrepNotes'),
    releaseFormLink: inherit('releaseFormLink'),
    pressKitLink: inherit('pressKitLink'),
    youtubeLink: inherit('youtubeLink'),
    spotifyLink: inherit('spotifyLink'),
    appleLink: inherit('appleLink'),
  };
}
