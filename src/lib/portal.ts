import type { Guest } from '../types';

const PORTAL_HOST = 'https://guestflow.app';

export function guestPortalUrl(guest: Guest): string {
  const slug = guest.guestPortalSlug || guest.id;
  return `${PORTAL_HOST}/g/${slug}`;
}
