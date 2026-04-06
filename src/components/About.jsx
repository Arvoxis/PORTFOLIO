import { personal } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function About() {
  const [imgRef,     imgVis]     = useScrollAnimation()
  const [contentRef, contentVis] = useScrollAnimation()

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-label">
          <span className="s-num">01</span>
          <span className="s-title">About</span>
        </div>

        <div className="about-grid">
          {/* Image column */}
          <div
            ref={imgRef}
            className={`about-img-wrap fade-up ${imgVis ? 'in' : ''}`}
          >
            <div className="about-img-frame">
              <img src="/avatar.jpeg" alt={`${personal.name.first} ${personal.name.last}`} className="about-img-photo" />
            </div>
            <div className="about-img-badge">{personal.location}</div>
          </div>

          {/* Content column */}
          <div
            ref={contentRef}
            className={`fade-up ${contentVis ? 'in' : ''}`}
            style={{ transitionDelay: '120ms' }}
          >
            <p className="about-bio">{personal.bio}</p>

            <div className="about-stats">
              <div className="stat">
                <div className="stat-val">2<sup>+</sup></div>
                <div className="stat-label">Years Exp.</div>
              </div>
              <div className="stat">
                <div className="stat-val">10<sup>+</sup></div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat">
                <div className="stat-val">15<sup>+</sup></div>
                <div className="stat-label">Events</div>
              </div>
            </div>

            <div className="about-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {personal.location}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
