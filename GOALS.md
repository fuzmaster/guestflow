# GuestFlow Goals

GuestFlow is a local-first producer dashboard and guest portal for podcasters, creator collabs, and interview shows.

The core idea is simple:

Send one link instead of making busy guests dig through emails.

GuestFlow is built around the frustration of running a podcast or interview show where every guest has important information scattered across email threads, Instagram DMs, calendar invites, Google Drive folders, notes, and memory.

The goal is to give producers one place to track the guest workflow and give guests one clean portal with everything they need before, during, and after their episode.

## The problem

Running an interview show creates a messy middle between "the guest said yes" and "the episode is fully launched and shared."

A guest may need:

- recording date and time
- calendar link
- location or remote recording link
- parking details
- arrival instructions
- prep notes
- talking points
- headshot request
- bio request
- social handles
- release form
- launch date
- YouTube / Spotify / Apple links
- clips and reels
- suggested captions
- Instagram collab reminders
- post-launch sharing instructions

Today, most of this gets buried in:

- Gmail
- Instagram DMs
- LinkedIn messages
- calendar invites
- Google Drive links
- notes apps
- Slack messages
- the producer's memory

That creates stress for the producer and confusion for the guest.

GuestFlow exists to clean that up.

## Product vision

GuestFlow should become the simple "episode hub" for each guest.

Instead of sending ten separate emails, the producer sends one link.

That link gives the guest everything they need:

- where to go
- when to show up
- what to prepare
- what assets are missing
- when the episode launches
- what links to share
- what clips are ready
- what captions they can copy

At the same time, the producer gets a dashboard that shows:

- who needs a follow-up
- who is missing assets
- who is recording soon
- who is launching soon
- who has not accepted the Instagram collab
- who has not shared the episode
- what message to send next

## One-line positioning

GuestFlow is a guest portal and follow-up dashboard for podcast producers.

## Better positioning

GuestFlow gives every podcast guest one link with everything they need before, during, and after their episode — while producers get a clean dashboard showing who needs a nudge.

## Simple marketing promise

Send one link. Stop chasing guests.

## Core user

GuestFlow is for:

- podcast producers
- interview show hosts
- YouTube interview channels
- creator managers
- event panel organizers
- small content teams
- branded podcast teams
- agency teams managing client interviews
- producers working with busy founders, CEOs, authors, doctors, creators, and experts

The best user is someone who is already booking guests manually and constantly loses track of follow-ups, missing assets, and launch-day sharing.

## Core pain

Guests are busy.

Even if they are excited to be on the show, they may forget to reply, miss an email, lose the recording details, forget to send their headshot, miss the launch-day message, or never share the episode.

The producer then has to chase them across multiple channels.

GuestFlow should reduce that chase.

## What GuestFlow is

GuestFlow is:

- a producer dashboard
- a guest follow-up tracker
- a guest onboarding hub
- a launch-day checklist
- a post-launch sharing tracker
- a simple guest portal link
- a manual workflow tool for podcast and interview teams

## What GuestFlow is not

GuestFlow is not trying to be:

- a full CRM
- a guest marketplace
- a podcast hosting platform
- a recording platform
- an email automation platform
- a social media scheduler
- a team project management app
- a replacement for Riverside, Zencastr, SquadCast, Calendly, Gmail, or Google Drive

GuestFlow should sit between those tools and make the guest experience easier.

## MVP goal

The MVP should prove one thing:

Producers will use a simple dashboard and guest portal to keep guest communication, assets, launch links, and sharing steps organized.

The MVP does not need advanced automation.

The MVP should feel useful even if everything is entered manually.

## MVP principles

1. Keep it manual first.
2. Keep it local-first.
3. Make the guest portal the "wow" feature.
4. Make the producer dashboard practical.
5. Avoid building a full CRM.
6. Avoid integrations until the workflow is validated.
7. Make every screen answer: "Who needs what next?"
8. Make every guest page answer: "What do I need to know or do?"

## Main product sections

### 1. Today Dashboard

The producer should immediately see:

- guests needing follow-up
- recordings coming soon
- launches coming soon
- missing assets
- social sharing issues
- suggested next actions

This page should be the daily command center.

### 2. Guest Pipeline

The producer should see every guest grouped by stage.

Example stages:

- Target
- Contacted
- Interested
- Booked
- Needs Assets
- Recording Soon
- Recorded
- Editing
- Launch Soon
- Live
- Needs Share
- Done

This should help the producer understand the full guest workflow at a glance.

### 3. Guest Detail

Each guest should have a detailed internal record showing:

- profile info
- show info
- episode title
- recording date
- launch date
- contact channel
- follow-up notes
- asset checklist
- launch/share checklist
- suggested next action

This is the internal producer view.

### 4. Guest Portal

Each guest should have a simple portal link.

The portal should show:

- guest greeting
- interview details
- recording date and time
- location or remote recording link
- parking notes
- arrival instructions
- prep notes
- what to expect
- missing assets
- release form link
- episode links
- clips
- suggested captions
- launch/share checklist

This is the guest-facing view and should feel polished, simple, and helpful.

### 5. Missing Assets

The producer should see every guest missing:

- bio
- headshot
- social handles
- release form

This should make it easy to know who needs a reminder.

### 6. Launch / Share

The producer should track whether the guest has received or completed:

- episode link
- clips
- suggested copy
- Instagram collab invite
- Instagram collab acceptance
- guest sharing
- thank-you message

This page should feel like a launch checklist.

### 7. Templates

The app should include copyable message templates for common guest communication.

Examples:

- first invite
- soft follow-up
- booking confirmation
- day-before recording reminder
- missing asset request
- launch tomorrow message
- episode is live message
- Instagram collab reminder
- clip sharing message
- thank-you message
- referral request

For the MVP, templates should be copy/paste only.

No automatic sending.

### 8. Settings / Export

The MVP should let the producer:

- export guest data as JSON
- export guest data as CSV
- import guest data from JSON
- reset mock data

The user should own their data.

## Current MVP scope

The current version is intentionally simple.

It includes:

- React
- TypeScript
- Vite
- plain CSS
- localStorage persistence
- mock guest data
- producer dashboard
- guest pipeline
- guest detail page
- guest portal preview/editor
- missing assets page
- launch/share page
- templates
- settings/export tools

There is currently no backend, auth, public sharing, file uploads, Gmail integration, Instagram API, or automatic sending.

That is intentional.

## Unique angle

Most podcast tools focus on one of these:

- finding guests
- booking guests
- recording guests
- publishing episodes
- tracking analytics

GuestFlow focuses on the messy middle:

Everything the guest needs after saying yes, and everything the producer needs to keep the episode moving.

The unique feature is the guest portal.

A CRM tracks the relationship.

GuestFlow helps the guest actually show up prepared, send the right assets, and share the episode after launch.

## Short-term goals

### Goal 1: Make the guest portal feel real

The guest portal should feel like something a producer could actually send to a guest.

It should look clean, trustworthy, and simple.

The guest should immediately understand:

- when the interview is
- where it is
- what they need to prepare
- what assets are missing
- what links and clips are ready
- what to share after launch

### Goal 2: Make the producer dashboard useful every morning

The Today page should tell the producer what needs attention.

The producer should not have to think too hard.

The app should clearly show:

- who is overdue
- who records soon
- who launches soon
- who is missing assets
- who has not shared
- what message to copy

### Goal 3: Reduce repeated guest emails

The product should reduce messages like:

- "Where do I go?"
- "What time is it again?"
- "What do you need from me?"
- "Where is the episode link?"
- "Can you send the clip again?"
- "What should I post?"
- "Where is the release form?"
- "Did I send you my bio?"

The answer should be:

"It's all in your GuestFlow link."

### Goal 4: Keep the MVP simple enough to test fast

Do not overbuild before validating.

Before adding complex integrations, test whether producers actually want to use:

- a manual guest board
- a guest portal link
- missing asset tracking
- launch/share checklists
- copyable templates

## Medium-term goals

After the manual MVP is validated, consider adding:

- real hosted guest portal links
- basic authentication
- shareable private guest URLs
- file upload support
- reusable show templates
- reusable location templates
- reusable launch kits
- per-show branding
- calendar file generation
- email copy generation
- optional Gmail integration
- optional Google Drive integration
- optional calendar integration
- status history
- reminders
- simple analytics on guest completion

## Long-term goals

GuestFlow could eventually become the operating system for interview-based content teams.

Possible future features:

- multi-show support
- team accounts
- client portals
- branded guest portals
- automated reminders
- approval workflows
- release form e-signature
- media kit builder
- clip delivery system
- referral tracking
- sponsor/client sharing kits
- white-label portals for agencies
- integrations with Riverside, Calendly, Google Drive, YouTube, Spotify, and Instagram

But none of this matters unless the simple workflow works first.

## Product north star

GuestFlow should make every guest feel prepared and every producer feel in control.

The product wins if a producer can say:

"I used to dig through emails and chase people all week. Now I just send one GuestFlow link and check my dashboard."

## Design direction

GuestFlow should feel:

- clean
- dark
- modern
- calm
- practical
- trustworthy
- producer-focused
- guest-friendly
- more polished than a spreadsheet
- simpler than a CRM

The UI should avoid feeling like a generic todo app.

It should feel like a real production tool for people managing interviews, launches, and guest relationships.

## Brand phrases

Useful phrases:

- Send one link.
- Stop chasing guests.
- Everything your guest needs in one place.
- From first yes to final share.
- The guest portal for podcast producers.
- Keep every guest informed.
- Know who needs a nudge.
- Make guests feel prepared.
- Turn scattered emails into one clean portal.
- A better guest experience from booking to launch.

Avoid phrases:

- workflow intelligence
- relationship orchestration
- synergy
- engagement automation
- all-in-one CRM
- game-changing platform
- revolutionary solution

## Success criteria for the MVP

The MVP is successful if:

1. A producer can add a guest.
2. A producer can track where that guest is in the episode workflow.
3. A producer can see what is missing.
4. A producer can create or preview a guest portal.
5. A guest portal clearly explains what the guest needs to know.
6. A producer can track launch and sharing tasks.
7. A producer can copy useful messages.
8. The app persists data locally.
9. The app feels real enough to show to another podcast producer.
10. The core idea is easy to explain in one sentence.

## Current one-sentence explanation

GuestFlow gives podcast producers a dashboard to track guest follow-up and gives every guest one portal link with interview details, missing assets, launch links, clips, and share copy.

## Current build status

The current repository is a local-first MVP.

Repo: `fuzmaster/guestflow`

Current commit: initial MVP scaffold.

Status:

- site is up
- mock data is included
- localStorage works
- producer dashboard exists
- guest portal concept exists
- export/import exists
- no backend yet
- no auth yet
- no real public guest links yet

## Next best improvements

Recommended next improvements:

1. Make the guest portal page more beautiful and realistic.
2. Add a "Copy guest portal link" button.
3. Add a "Guest readiness score."
4. Add a "Producer next action" queue.
5. Add editable show-level defaults.
6. Add reusable location/prep templates.
7. Add sample launch kit content.
8. Add a public landing page explaining the product.
9. Add screenshots or concept images to the README.
10. Deploy the current MVP and test it with real podcast workflows.

## Immediate next build prompt

Use this prompt for the next implementation pass:

```txt
Improve GuestFlow around the main product goal: one guest portal link plus a producer dashboard.

Focus on making the guest portal and daily producer workflow feel more real.

Add:
1. A copyable guest portal link button.
2. A guest readiness score based on missing assets, recording details, launch links, and share checklist completion.
3. A "Next Action Queue" page that lists every guest who needs action and the recommended message/template.
4. Reusable show settings/defaults for host name, show name, location, parking, recording prep notes, and default links.
5. A more polished guest portal layout with sections for Before the Interview, What We Need From You, Recording Day, After We Launch, Clips & Captions.
6. Better empty states and sample data.
7. A simple landing page route that explains GuestFlow to potential users.

Keep everything local-first.
Do not add a backend.
Do not add auth.
Do not add automatic sending.
Do not add Gmail or Instagram integrations yet.

Run the build and fix all TypeScript errors.
```

## Reminder

Do not turn this into a giant CRM too early.

The product should stay focused on this job:

Help producers stop chasing guests by giving every guest one clear link and every producer one clear dashboard.
