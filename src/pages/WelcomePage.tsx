import WaveBar from '../components/WaveBar';

type Props = {
  onEnter: () => void;
};

export default function WelcomePage({ onEnter }: Props) {
  return (
    <div className="welcome">
      <div className="welcome__strip">
        <div className="welcome__strip-left">
          <strong>High Functioning</strong>
          <span className="welcome__strip-divider" />
          <span>Guest Portal · Internal v1</span>
        </div>
        <div className="welcome__strip-right">
          <span className="welcome__strip-dot" />
          <span>Powered by GuestFlow · Local-first</span>
        </div>
      </div>

      <div className="welcome__container">
        <header>
          <span className="welcome__chip">High Functioning Podcast · Producer console</span>
          <h1 className="welcome__title">Send one link. Stop chasing guests.</h1>
          <p className="welcome__sub">
            Everything guests need before and after recording — recording date, studio details, parking, missing info, and the launch share kit — in one portal link. Producers stop juggling email, DMs, and spreadsheets.
          </p>
          <div className="welcome__cta">
            <button className="btn-primary" onClick={onEnter}>Open dashboard →</button>
            <a className="btn-link" href="https://github.com/fuzmaster/guestflow" target="_blank" rel="noreferrer">View source</a>
          </div>
        </header>

        <div className="welcome__wave-divider">
          <span className="timestamp left">00:00</span>
          <div className="wave"><WaveBar bars={64} size="sm" /></div>
          <span className="timestamp right">45:00</span>
        </div>

        <section className="sheet-section">
          <div className="sheet-section__header">
            <span>The job</span><span>Sheet 01</span>
          </div>
          <div className="three-up">
            <article className="three-up__card">
              <p className="eyebrow">01 / The mess</p>
              <h3>Scattered everywhere</h3>
              <p>Calendar invite in one inbox. Bio request in another. Headshot in a DM. Release form in Drive. Guest forgot the parking note.</p>
            </article>
            <article className="three-up__card three-up__card--highlight">
              <p className="eyebrow">02 / The fix</p>
              <h3>One portal link</h3>
              <p>Date, location, prep notes, missing assets, episode links, clips, and captions — all in one place a guest can re-open the night before.</p>
            </article>
            <article className="three-up__card">
              <p className="eyebrow">03 / The result</p>
              <h3>One calm morning</h3>
              <p>Open one dashboard each morning — who needs a nudge, what to copy, what's overdue. No more chasing across five apps.</p>
            </article>
          </div>
        </section>

        <section className="sheet-section portal-mock">
          <div className="sheet-section__header">
            <span>What the guest sees</span><span>Sheet 02</span>
          </div>
          <div className="portal-mock__frame">
            <div className="portal-mock__bar">
              <span className="portal-mock__url">guestflow.app/g/operator-stories-maya-chen</span>
              <span className="portal-mock__status">Live link</span>
            </div>
            <div className="portal-mock__body">
              <div className="portal-mock__head">
                <div>
                  <p className="eyebrow eyebrow--accent">Operator Stories · EP 14</p>
                  <h2>Hi Maya,</h2>
                  <p>You're 80% ready for your interview.</p>
                </div>
                <div className="portal-mock__mini-wave">
                  <WaveBar bars={16} size="sm" />
                </div>
              </div>
              <div className="portal-mock__grid">
                <div>
                  <p className="eyebrow">When</p>
                  <p className="value">Tue · Jun 23</p>
                </div>
                <div>
                  <p className="eyebrow">Where</p>
                  <p className="value">Studio B · BOS</p>
                </div>
                <div className="needs">
                  <p className="eyebrow">Still need</p>
                  <p className="value">Bio + release</p>
                </div>
                <div>
                  <p className="eyebrow">After launch</p>
                  <p className="value">Clips ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="spec-sheet">
          <div className="spec-sheet__head">
            <span>Spec sheet</span><span>Local · v0.1</span>
          </div>
          <div className="spec-sheet__body">
            <h3>Local-first. On purpose.</h3>
            <p>Runs entirely in your browser. No backend, no auth, no email or Instagram automation. Export your data as JSON or CSV any time. Validate the workflow before bolting on integrations.</p>
            <div className="spec-sheet__stats">
              <div>
                <p className="eyebrow">Storage</p>
                <p className="value">Browser only</p>
              </div>
              <div>
                <p className="eyebrow">Export</p>
                <p className="value">JSON · CSV</p>
              </div>
              <div>
                <p className="eyebrow">Integrations</p>
                <p className="value">None yet</p>
              </div>
              <div>
                <p className="eyebrow">Stack</p>
                <p className="value">React · Vite</p>
              </div>
            </div>
            <button className="btn-primary spec-sheet__cta" onClick={onEnter}>Open dashboard →</button>
          </div>
        </section>

        <div className="welcome__footer-spacing" />
      </div>
    </div>
  );
}
