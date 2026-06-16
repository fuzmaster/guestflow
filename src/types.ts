export type GuestStage =
  | 'target'
  | 'contacted'
  | 'interested'
  | 'booked'
  | 'needs_assets'
  | 'recording_soon'
  | 'recorded'
  | 'editing'
  | 'launch_soon'
  | 'live'
  | 'needs_share'
  | 'done';

export type ContactChannel = 'email' | 'instagram' | 'linkedin' | 'phone' | 'other';
export type AssetStatus = 'needed' | 'requested' | 'received' | 'not_needed';

export type ClipPlatform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'other';

export type ClipLink = {
  id: string;
  title: string;
  url: string;
  platform?: ClipPlatform;
  suggestedCaption?: string;
};

export type Guest = {
  id: string;
  name: string;
  company?: string;
  title?: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
  phone?: string;
  showName: string;
  episodeTitle?: string;
  stage: GuestStage;
  preferredChannel: ContactChannel;
  lastContactedAt?: string;
  lastResponseAt?: string;
  nextFollowUpAt?: string;
  recordingDate?: string;
  launchDate?: string;
  bioStatus: AssetStatus;
  headshotStatus: AssetStatus;
  socialHandleStatus: AssetStatus;
  releaseFormStatus: AssetStatus;
  episodeLinkSent: boolean;
  clipsSent: boolean;
  suggestedCopySent: boolean;
  instagramCollabInviteSent: boolean;
  instagramCollabAccepted: boolean;
  guestShared: boolean;
  thankYouSent: boolean;
  notes: string;
  tags: string[];

  hostName?: string;
  hostEmail?: string;
  producerName?: string;
  producerEmail?: string;
  interviewLocationName?: string;
  interviewAddress?: string;
  parkingNotes?: string;
  arrivalInstructions?: string;
  recordingPrepNotes?: string;
  calendarLink?: string;
  recordingLink?: string;
  episodeLink?: string;
  spotifyLink?: string;
  appleLink?: string;
  youtubeLink?: string;
  pressKitLink?: string;
  releaseFormLink?: string;
  clipLinks: ClipLink[];
  guestPortalSlug: string;
  guestPortalEnabled: boolean;

  createdAt: string;
  updatedAt: string;
};

export type Template = {
  id: string;
  name: string;
  category:
    | 'invite'
    | 'follow_up'
    | 'booking'
    | 'recording_reminder'
    | 'asset_request'
    | 'launch'
    | 'collab'
    | 'post_launch'
    | 'referral';
  channel: ContactChannel;
  body: string;
};

export type Page =
  | 'welcome'
  | 'next-actions'
  | 'today'
  | 'pipeline'
  | 'guest-portal'
  | 'missing-assets'
  | 'launch-share'
  | 'templates'
  | 'settings';
