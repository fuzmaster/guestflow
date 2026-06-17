export type GuestStage =
  | 'lead'
  | 'needs_approval'
  | 'approved'
  | 'target'
  | 'contacted'
  | 'invited'
  | 'interested'
  | 'no_reply'
  | 'dates_sent'
  | 'date_selected'
  | 'booked'
  | 'recording_confirmed'
  | 'needs_assets'
  | 'recording_soon'
  | 'recorded'
  | 'recording_complete'
  | 'transcript_review'
  | 'editing'
  | 'launch_scheduled'
  | 'launch_soon'
  | 'live'
  | 'needs_share'
  | 'done';

export type ContactChannel = 'email' | 'instagram' | 'linkedin' | 'phone' | 'other';
export type AssetStatus = 'needed' | 'requested' | 'received' | 'not_needed';

export type ClipPlatform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'other';

export type GuestSource =
  | 'linkedin'
  | 'instagram'
  | 'jason_referral'
  | 'sourcing_service'
  | 'inbound'
  | 'other';

export type RecordingType =
  | 'in_person_preferred'
  | 'remote_requested'
  | 'remote_approved'
  | 'remote_only';

export type TranscriptStatus =
  | 'not_available'
  | 'available'
  | 'review_requested'
  | 'review_complete';

export type ClipLink = {
  id: string;
  title: string;
  url: string;
  platform?: ClipPlatform;
  suggestedCaption?: string;
};

export type AvailableDate = {
  id: string;
  date: string;
  timeWindow?: string;
  status: 'open' | 'selected' | 'confirmed' | 'withdrawn';
  note?: string;
};

export type ProducerMessage = {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  type:
    | 'info'
    | 'reminder'
    | 'action_needed'
    | 'scheduling'
    | 'launch'
    | 'transcript'
    | 'internal';
  visibility: 'guest_visible' | 'internal_only';
};

export type GuestNote = {
  id: string;
  createdAt: string;
  body: string;
  type:
    | 'scheduling_request'
    | 'missing_info'
    | 'transcript_edit'
    | 'social_links'
    | 'general';
  contactName?: string;
  contactEmail?: string;
};

export type Guest = {
  id: string;
  name: string;
  company?: string;
  title?: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
  websiteUrl?: string;
  phone?: string;
  otherSocialLinks?: string;
  source?: GuestSource;

  showName: string;
  episodeTitle?: string;
  stage: GuestStage;
  preferredChannel: ContactChannel;

  lastContactedAt?: string;
  firstContactedAt?: string;
  lastResponseAt?: string;
  nextFollowUpAt?: string;
  outreachHistory?: string;

  recordingDate?: string;
  launchDate?: string;
  availableDates: AvailableDate[];
  selectedDateId?: string;
  confirmedDateId?: string;
  recordingType: RecordingType;
  riversideLink?: string;
  schedulingNotes?: string;

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

  suggestedTopics?: string;
  guestProvidedTopics?: string;
  questionsToAsk?: string;
  subscribedToChannel?: boolean;
  specialInstructions?: string;
  guestPrepNotes?: string;

  transcriptStatus: TranscriptStatus;
  transcriptLink?: string;
  transcriptNotes?: string;

  hostName?: string;
  hostEmail?: string;
  producerName?: string;
  producerEmail?: string;
  producerPhone?: string;
  interviewLocationName?: string;
  interviewAddress?: string;
  parkingNotes?: string;
  arrivalInstructions?: string;
  recordingPrepNotes?: string;
  showInstructions?: string;
  calendarLink?: string;
  recordingLink?: string;
  episodeLink?: string;
  spotifyLink?: string;
  appleLink?: string;
  youtubeLink?: string;
  websiteEpisodeLink?: string;
  pressKitLink?: string;
  releaseFormLink?: string;
  clipLinks: ClipLink[];
  suggestedPostCopy?: string;
  teamShareMessage?: string;

  messages: ProducerMessage[];
  guestNotes: GuestNote[];

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
    | 'referral'
    | 'dates_offer'
    | 'date_confirmation'
    | 'recording_details'
    | 'share_kit'
    | 'team_share'
    | 'transcript_review';
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
