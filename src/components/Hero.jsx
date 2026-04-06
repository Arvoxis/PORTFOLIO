import { personal } from '../config/data'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        {/* Eyebrow row */}
        <div className="hero-eyebrow">
          <span className="bar bar-short" />
          <span>{personal.role}</span>
          <span className="bar bar-long" />
          <span>{personal.location}</span>
        </div>

        {/* Main name display */}
        <h1 className="hero-name">
          <span className="first">{personal.name.first}</span>
          <span className="last">
            {personal.name.last}
            <span className="period">.</span>
          </span>
        </h1>

        {/* Bottom row: tagline + CTAs */}
        <div className="hero-foot">
          <div className="hero-tagline">
            <h2>{personal.tagline}</h2>
            <p>{personal.subTagline}</p>
          </div>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              View Work ↗
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Decorative large background initials */}
      <div className="hero-bg-text" aria-hidden="true">
        {personal.name.first[0]}{personal.name.last[0]}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span className="hero-scroll-label">scroll</span>
      </div>
    </section>
  )
}
