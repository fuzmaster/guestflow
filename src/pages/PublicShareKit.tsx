import { useState, useMemo } from 'react';
import { readSharedPortalFromUrl } from '../lib/portalShare';
import Footer from '../components/Footer';

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); } catch { /* noop */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <button type="button" className="btn-ghost btn-sm" onClick={copy} disabled={!value}>
      {copied ? 'Copied' : label}
    </button>
  );
}

export default function PublicShareKit({ onOpenApp }: { onOpenApp: () => void }) {
  const shared = useMemo(() => readSharedPortalFromUrl(), []);

  if (!shared) {
    return (
      <div className="welcome-shell">
        <div className="public-portal__strip">
          <div className="welcome__strip-left">
            <strong>High Functioning</strong>
            <span className="welcome__strip-divider" />
            <span>Episode share kit</span>
          </div>
          <div className="welcome__strip-right">
            <span className="welcome__strip-dot" />
            <span>Powered by GuestFlow</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '64px 24px' }}>
          <div className="empty-state" style={{ maxWidth: 520 }}>
            <strong>This share kit link looks empty.</strong>
            <p>Ask your producer for a fresh link — it should include all episode links, clips, and copy.</p>
            <div className="button-row" style={{ marginTop: 16, justifyContent: 'center' }}>
              <button className="btn-primary" onClick={onOpenApp}>Open dashboard →</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const g = shared.guest;
  const allLinks = [g.youtubeLink, g.spotifyLink, g.appleLink, g.websiteEpisodeLink || g.episodeLink].filter(Boolean).join('\n');

  return (
    <div className="welcome-shell">
      <div className="public-portal__strip">
        <div className="welcome__strip-left">
          <strong>High Functioning</strong>
          <span className="welcome__strip-divider" />
          <span>Episode share kit</span>
        </div>
        <div className="welcome__strip-right">
          <span className="welcome__strip-dot" />
          <span>{g.showName} · Powered by GuestFlow</span>
        </div>
      </div>

      <div className="public-portal__container">
        <div className="portal-page">
          <section className="portal-pass">
            <div className="portal-pass__strip">
              <span className="accent">Episode Share Kit</span>
              <span className="quiet">{g.episodeTitle ? `· ${g.episodeTitle}` : g.showName}</span>
            </div>
            <div className="portal-pass__body">
              <div className="portal-pass__inner">
                <div className="portal-pass__text">
                  <p className="eyebrow eyebrow--accent">{g.showName}</p>
                  <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>{g.name}</h2>
                  <p className="sentence">{g.episodeTitle || 'New episode'}</p>
                  <p className="sub">{g.launchDate ? `Live ${g.launchDate}` : 'Launching soon'} · Forward this link to anyone who should share it.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="portal-section">
            <header>
              <p className="eyebrow">Episode links</p>
              <h3>Listen / watch.</h3>
            </header>
            <div className="portal-chips">
              {g.youtubeLink ? <a className="portal-chip" href={g.youtubeLink} target="_blank" rel="noreferrer">YouTube</a> : null}
              {g.spotifyLink ? <a className="portal-chip" href={g.spotifyLink} target="_blank" rel="noreferrer">Spotify</a> : null}
              {g.appleLink ? <a className="portal-chip" href={g.appleLink} target="_blank" rel="noreferrer">Apple Podcasts</a> : null}
              {g.websiteEpisodeLink ? <a className="portal-chip" href={g.websiteEpisodeLink} target="_blank" rel="noreferrer">Website</a> : null}
              {g.episodeLink ? <a className="portal-chip" href={g.episodeLink} target="_blank" rel="noreferrer">Main episode</a> : null}
            </div>
            <div className="share-kit__actions">
              <CopyButton value={allLinks} label="Copy all links" />
              <CopyButton value={g.suggestedPostCopy ?? ''} label="Copy suggested post" />
              <CopyButton value={g.teamShareMessage ?? ''} label="Copy team share message" />
            </div>
          </section>

          {g.suggestedPostCopy && (
            <section className="portal-section">
              <header>
                <p className="eyebrow">Suggested post copy</p>
                <h3>Paste-ready.</h3>
              </header>
              <div className="portal-block">
                <p className="body" style={{ color: 'var(--text-2)', whiteSpace: 'pre-line' }}>{g.suggestedPostCopy}</p>
              </div>
            </section>
          )}

          {g.teamShareMessage && (
            <section className="portal-section">
              <header>
                <p className="eyebrow">Team / coworker share message</p>
                <h3>Forward to anyone who should share.</h3>
              </header>
              <div className="portal-block">
                <p className="body" style={{ color: 'var(--text-2)', whiteSpace: 'pre-line' }}>{g.teamShareMessage}</p>
              </div>
            </section>
          )}

          <section className="portal-section">
            <header>
              <p className="eyebrow">Clips &amp; captions</p>
              <h3>Ready-to-post moments.</h3>
            </header>
            {g.clipLinks.length === 0 ? (
              <div className="empty-state">
                <strong>Clips drop here after edits</strong>
                <p>Clips and copy-ready captions appear here a few days before launch.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {g.clipLinks.map((clip) => (
                  <article key={clip.id} className="portal-clip">
                    <div className="portal-clip__head">
                      <div>
                        <strong>{clip.title}</strong>
                        <p className="portal-clip__platform">{clip.platform || 'clip'}</p>
                      </div>
                      {clip.url && <a className="btn-ghost btn-sm" href={clip.url} target="_blank" rel="noreferrer">Open clip</a>}
                    </div>
                    {clip.suggestedCaption && (
                      <div className="portal-clip__caption">
                        <p>“{clip.suggestedCaption}”</p>
                      </div>
                    )}
                    {clip.suggestedCaption && <CopyButton value={clip.suggestedCaption} label="Copy caption" />}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
