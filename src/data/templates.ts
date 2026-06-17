import type { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'tpl-001',
    name: 'First invite',
    category: 'invite',
    channel: 'email',
    body:
      'Hey {guestName},\n\n' +
      "I host {showName} and I'd love to have you on. We do long-form conversations with founders and operators — the kind of stuff you can't fit in a 30-min media hit.\n\n" +
      "If it's a fit, I'll send a couple of recording dates and a portal link with everything you'd need. Let me know.\n\n" +
      '— {hostName}',
  },
  {
    id: 'tpl-002',
    name: 'Follow-up after no response',
    category: 'follow_up',
    channel: 'email',
    body:
      'Hey {guestName} — just floating this back to the top in case it got buried. Still think you would be a great guest on {showName}. Want me to send a few recording dates?',
  },
  {
    id: 'tpl-003',
    name: 'New dates available',
    category: 'dates_offer',
    channel: 'email',
    body:
      'Hey {guestName},\n\n' +
      "Few open dates for {showName} over the next couple of weeks. Easiest thing is to open your portal and tap the one that works:\n\n" +
      '{portalLink}\n\n' +
      "Studio is {studioAddress}. Once you pick we'll lock it in and send arrival details.\n\n" +
      '— {hostName}',
  },
  {
    id: 'tpl-004',
    name: 'Date selected — confirmation',
    category: 'date_confirmation',
    channel: 'email',
    body:
      'Locked in for {recordingDate}. Everything you need is in your portal:\n\n' +
      '{portalLink}\n\n' +
      "Address: {studioAddress}\n" +
      "Parking: {parkingInstructions}\n" +
      "Arrival: {arrivalInstructions}\n\n" +
      "I'll send a day-before reminder. — {hostName}",
  },
  {
    id: 'tpl-005',
    name: 'Recording details (day before)',
    category: 'recording_details',
    channel: 'email',
    body:
      'Quick reminder — we record tomorrow at {recordingDate}.\n\n' +
      '{studioAddress}\n' +
      '{parkingInstructions}\n\n' +
      'Everything is in your portal: {portalLink}\n\n' +
      'Excited. — {hostName}',
  },
  {
    id: 'tpl-006',
    name: 'Missing bio / headshot / socials',
    category: 'asset_request',
    channel: 'email',
    body:
      "Hey {guestName} — to get the episode graphics and tagging right we still need:\n\n" +
      "- a short bio (2–3 sentences, third person)\n" +
      "- a clean headshot\n" +
      "- the Instagram / LinkedIn handles you want us to tag\n\n" +
      "Easiest thing is to reply with attachments. Portal has the full checklist: {portalLink}\n\n" +
      '— {hostName}',
  },
  {
    id: 'tpl-007',
    name: 'Week-of release reminder',
    category: 'launch',
    channel: 'email',
    body:
      'Your episode of {showName} drops {launchDate}. The full share kit and clips will be in your portal the day before so you can hit publish at the same time as us: {portalLink}',
  },
  {
    id: 'tpl-008',
    name: 'Episode launches tomorrow',
    category: 'launch',
    channel: 'email',
    body:
      'Tomorrow is launch day. Share kit is now live in your portal — links, clips, captions, all ready to copy:\n\n{portalLink}\n\nWe drop at 6 AM ET. Repost from there. — {hostName}',
  },
  {
    id: 'tpl-009',
    name: 'Episode is live',
    category: 'share_kit',
    channel: 'email',
    body:
      'It is live. Full share kit is here:\n\n{portalLink}\n\nYouTube · Spotify · Apple links and clips are all in there. Tag {showName} and we will reshare. — {hostName}',
  },
  {
    id: 'tpl-010',
    name: 'Coworker / team share message',
    category: 'team_share',
    channel: 'other',
    body:
      "Hey team — {guestName} from {company} is on the latest episode of {showName}. Forward this to anyone who should share it on social:\n\n{shareKitLink}\n\nLinks, clips, captions are all in there.",
  },
  {
    id: 'tpl-011',
    name: 'Instagram collab reminder',
    category: 'collab',
    channel: 'instagram',
    body:
      'Hey {guestName} — sent the Instagram collab invite from our episode post. Accepting it puts the reel on your profile too. Takes 5 seconds.',
  },
  {
    id: 'tpl-012',
    name: 'Transcript review note',
    category: 'transcript_review',
    channel: 'email',
    body:
      "Hey {guestName} — your transcript is in the portal: {portalLink}\n\n" +
      "If there is anything you want us to cut, paste the line into the note box. We will run a final pass after you reply. — {hostName}",
  },
  {
    id: 'tpl-013',
    name: 'Thank-you / referral ask',
    category: 'referral',
    channel: 'email',
    body:
      'Hey {guestName} — thanks again for coming on {showName}. If anyone you know would be a good fit for the show, send them my way.\n\n— {hostName}',
  },
];
