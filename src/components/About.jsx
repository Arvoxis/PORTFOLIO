import { stats, techStack, personalInfo } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const ICONS = {
  academic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  ),
  club: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M2.5 20c.5-3.5 3.2-6 6.5-6s6 2.5 6.5 6" />
      <path d="M15 18c.3-2.2 2-3.8 4-3.8" />
    </svg>
  ),
  hack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
}

export default function About() {
  const [ref, visible] = useScrollAnimation()
  const [gridRef, gridVisible] = useScrollAnimation()

  const sentences = personalInfo.longBio.match(/[^.!?]+[.!?]+/g) || [personalInfo.longBio]
  const firstHalf = sentences.slice(0, 2).join(' ').trim()
  const secondHalf = sentences.slice(2).join(' ').trim()

  const accentByIcon = {
    academic: 'stat-card--emerald',
    club: 'stat-card--amber',
    hack: 'stat-card--indigo',
    work: 'stat-card--pulse',
  }

  return (
    <section id="about" className="section section-alt" ref={ref}>
      <div className="container">
        <span className="section-watermark" aria-hidden="true">01 About</span>
        <div className={`section-head reveal ${visible ? 'in' : ''}`}>
          <span className="index">Background</span>
          <h2>About</h2>
          <p className="sub">Student, club lead, engineer. In that order, for now.</p>
        </div>

        <div className="about-grid">
          <div className={`about-text reveal ${visible ? 'in' : ''}`}>
            <figure className="about-portrait">
              <img src="/avatar.jpeg" alt="Rakshit Sinha" loading="lazy" />
              <figcaption>Rakshit Sinha, Vellore, 2026</figcaption>
            </figure>
            <p>{firstHalf}</p>
            {secondHalf && <p>{secondHalf}</p>}
          </div>

          <div
            className={`stats-grid reveal-stagger ${gridVisible ? 'in' : ''}`}
            ref={gridRef}
          >
            {stats.map((s) => (
              <div className={`stat-card ${accentByIcon[s.icon] || ''}`} key={s.k}>
                <div className="icon" aria-hidden="true">
                  {ICONS[s.icon]}
                </div>
                <div className="k">{s.k}</div>
                <div className="v">{s.v}</div>
                <div className="note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tech-strip" aria-label="Tech stack">
          <div className="tech-track">
            {[...techStack, ...techStack].map((t, i) => (
              <span className="tech-tag" key={i}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
