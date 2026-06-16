import type { Guest } from '../types';

function escapeCsv(value: unknown): string {
  const str = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${str.replace(/"/g, '""')}"`;
}

export function guestsToCsv(guests: Guest[]): string {
  const headers: (keyof Guest)[] = [
    'name',
    'company',
    'title',
    'email',
    'instagram',
    'linkedin',
    'showName',
    'episodeTitle',
    'stage',
    'preferredChannel',
    'lastContactedAt',
    'lastResponseAt',
    'nextFollowUpAt',
    'recordingDate',
    'launchDate',
    'bioStatus',
    'headshotStatus',
    'socialHandleStatus',
    'releaseFormStatus',
    'episodeLinkSent',
    'clipsSent',
    'suggestedCopySent',
    'instagramCollabInviteSent',
    'instagramCollabAccepted',
    'guestShared',
    'thankYouSent',
    'notes',
    'tags',
  ];
  const rows = guests.map((guest) => headers.map((header) => escapeCsv(guest[header])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
