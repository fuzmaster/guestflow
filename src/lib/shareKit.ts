import type { Guest } from '../types';
import { encodePortalShare } from './portalShare';

function origin(): string {
  if (typeof window === 'undefined') return 'https://guestflow.app';
  return window.location.origin;
}

export function shareKitUrl(guest: Guest): string {
  const slug = guest.guestPortalSlug || guest.id;
  const data = encodePortalShare(guest);
  return `${origin()}/share/${slug}#d=${data}`;
}
