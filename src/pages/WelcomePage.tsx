type Props = {
  onEnter: () => void;
};

export default function WelcomePage({ onEnter }: Props) {
  return (
    <div className="welcome">
      <section className="welcome__hero">
        <p className="eyebrow">For podcast producers, creator collabs, and interview shows</p>
        <h1>Send one link. Stop chasing guests.</h1>
        <p className="welcome__sub">
          GuestFlow gives every guest one portal with recording details, missing asset
          reminders, launch links, clips, and ready-to-paste captions — so producers stop
          digging through Gmail, DMs, and Drive.
        </p>
        <div className="welcome__cta">
          <button className="primary" onClick={onEnter}>Open the dashboard</button>
          <a className="welcome__link" href="https://github.com/fuzmaster/guestflow" target="_blank" rel="noreferrer">View on GitHub →</a>
        </div>
      </section>

      <section className="welcome__three-up">
        <article>
          <h3>The mess</h3>
          <p>Calendar invites in one inbox. Bio request in another. Headshot stuck in a DM. Release form sitting in Drive. Guest forgot the parking note.</p>
        </article>
        <article>
          <h3>The fix</h3>
          <p>One portal link per guest. Date, location, prep notes, missing assets, episode links, clips, and captions — all in one place they can re-open the night before.</p>
        </article>
        <article>
          <h3>The result</h3>
          <p>Producers open one dashboard each morning that shows who needs a nudge, what to copy, and what's overdue. No more chasing across five apps.</p>
        </article>
      </section>

      <section className="welcome__preview">
        <div className="welcome__preview-frame">
          <div className="welcome__preview-bar">
            <span /><span /><span />
            <p>guestflow.app/g/operator-stories-maya-chen</p>
          </div>
          <div className="welcome__preview-body">
            <p className="eyebrow">Operator Stories</p>
            <h2>Hi Maya,</h2>
            <p className="welcome__preview-sentence">You're 80% ready for your interview.</p>
            <div className="welcome__preview-grid">
              <div>
                <h4>When</h4>
                <p>Tue, Jun 23</p>
              </div>
              <div>
                <h4>Where</h4>
                <p>Studio B · Boston</p>
              </div>
              <div>
                <h4>What we still need</h4>
                <p>Bio + release form</p>
              </div>
              <div>
                <h4>After we launch</h4>
                <p>Clips + caption ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="welcome__principles">
        <h3>Local-first. On purpose.</h3>
        <p className="muted">
          GuestFlow runs entirely in your browser. No backend, no auth, no email or
          Instagram automation. Export your data as JSON or CSV any time. The point is
          to validate the workflow before bolting on integrations.
        </p>
        <button className="primary" onClick={onEnter}>Open the dashboard</button>
      </section>
    </div>
  );
}
