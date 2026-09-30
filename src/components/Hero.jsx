import { personal } from '../config/data'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="wrap hero-wrap">
        <div className="hero-copy">
          <p className="kicker ld" style={{ '--i': 0 }}>
            Sheet 01 / 06 · General arrangement
          </p>
          <h1 className="hero-name ld" style={{ '--i': 1 }} data-detect="person.rakshit">
            <span>{personal.first}</span>{' '}
            <em>{personal.last}</em>
          </h1>
          <p className="hero-dim">
            <span>{personal.role}</span>
          </p>
          <p className="hero-tag ld" style={{ '--i': 3 }}>
            {personal.tagline}
          </p>
          <p className="hero-disc ld" style={{ '--i': 4 }}>
            {personal.standing}
            <br />
            <span>{personal.disciplines.join(' / ')}</span>
          </p>
          <div className="hero-cta ld" style={{ '--i': 5 }}>
            <a href="#drawings" className="btn btn-primary" data-detect="cta.projects">
              View projects <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="text-link">
              or get in touch
            </a>
          </div>
        </div>

        <div className="hero-foot ld" style={{ '--i': 6 }}>
          <dl className="hero-tb" aria-hidden="true">
            <div><dt>Drawn by</dt><dd>R. Sinha</dd></div>
            <div><dt>Subject</dt><dd>Quadcopter, edge AI</dd></div>
            <div><dt>Scale</dt><dd>1 : 1</dd></div>
            <div><dt>Date</dt><dd>2026-09</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}
