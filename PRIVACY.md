# GuestFlow privacy & data handling

Last updated: 2026-06-17.

GuestFlow is a **local-first** producer dashboard. The short version: your data stays in your browser. There is no GuestFlow server. There is no GuestFlow database.

This page tells you exactly what that means, what is collected, where it goes, and how to delete it.

## What's collected

When you use the dashboard, you may type in:

- Guest names, companies, titles
- Guest emails, phone numbers, Instagram and LinkedIn handles
- Episode titles, show names, host and producer names
- Recording and launch dates
- Location addresses, parking notes, arrival and prep instructions
- Episode links, clip URLs, suggested captions
- Free-form notes you write about a guest

You are typing this information *about your guests*. You are responsible for whether you have their permission to do so.

## Where it's stored

Everything you type lives in your browser's `localStorage` under these keys:

- `guestflow.guests.v2` — all guest records
- `guestflow.showDefaults.v1` — your show defaults
- `guestflow.welcomed.v1` — a flag so the welcome screen doesn't reappear

**It is not transmitted to any GuestFlow server.** There is no GuestFlow server.

It is stored unencrypted at rest, the same way any browser localStorage is. Anyone with access to your browser profile can read it. Treat it like a file on your laptop.

## What happens when you share a portal link

When you click **Copy share link** in the Guest Portal page, GuestFlow generates a URL that looks like:

```
https://<your-host>/g/<slug>#d=<base64-encoded-data>
```

The data after `#d=` is a base64-encoded JSON snapshot of that guest's portal information (no producer notes, no guest email, no guest phone — those fields are explicitly stripped before encoding).

Important things to understand about that URL:

- **The hash portion (`#...`) is never sent to any server.** Browsers don't transmit URL hashes to the server side. It's read entirely by JavaScript running in the guest's browser when they open the link.
- **The URL is the access control.** Anyone who has the URL can open the portal and see the encoded data. Treat it like an unguessable share-link, similar to a Google Drive "anyone with the link" share. Do not paste it into public posts, blogs, or threads.
- **The data is a snapshot at the moment you copied the link.** If you later update the guest (add a clip, change the recording date), the existing link still shows the old data. Re-copy and re-send the link after important updates.

## Third-party services

GuestFlow does **not** use:

- Analytics (no Google Analytics, no Mixpanel, no Plausible, no Pixel)
- Error monitoring (no Sentry, no LogRocket)
- Crash reporting
- Advertising networks
- First-party cookies

GuestFlow's hosting provider (Vercel) writes standard HTTP access logs that include your IP address and User-Agent string. This is Vercel's logging, not GuestFlow's, and it's the same as nearly any web page you visit.

GuestFlow self-hosts its fonts and does not load anything from Google Fonts or any other font CDN. (This was originally loaded from Google Fonts; the bundle has been switched to self-hosted fonts so no font request leaves your browser to a third-party origin.)

## Export, import, deletion

- **Export your data:** Settings → Data utilities → "Export guests as JSON" or "Export guests as CSV." You get a file you own.
- **Import data:** Same panel, "Import guests from JSON." Replaces what's currently in your browser.
- **Delete everything:** Either click "Reset mock data" in Settings (replaces your data with the sample data), or open browser DevTools → Application → Local Storage and clear the three `guestflow.*` keys, or clear browsing data for this site in your browser settings.

There is no GuestFlow account to delete because there is no GuestFlow account.

## Future accounts tier

Settings includes a "Coming soon: Accounts & multi-show sync" tile. That tile is informational — it does nothing today. When that feature ships, this privacy page will be updated to describe what new data leaves your browser and where it goes. Until that update, assume the local-first model above is in effect.

## Contact

Issues and questions: https://github.com/fuzmaster/guestflow/issues

## Changelog

- **2026-06-17** — Initial publication. Documented local-first model, share-link mechanics, third-party service inventory, and self-serve export/deletion paths.
