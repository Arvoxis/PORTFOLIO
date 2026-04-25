import { experience } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Experience() {
  const [ref, vis] = useScrollAnimation()
  const [tlRef, tlVis] = useScrollAnimation()

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <span className="section-watermark" aria-hidden="true">04 Roles</span>
        <div className={`section-head reveal ${vis ? 'in' : ''}`}>
          <span className="index">Affiliations</span>
          <h2>Experience &amp; Leadership</h2>
          <p className="sub">Roles I hold and have held on campus.</p>
        </div>

        <div className={`timeline reveal-stagger ${tlVis ? 'in' : ''}`} ref={tlRef}>
          {experience.map((e, i) => (
            <div
              className={`timeline-entry ${i === 0 ? 'active' : ''}`}
              key={`${e.role}-${e.org}`}
            >
              <div className="period">{e.period}</div>
              <h3>{e.role}</h3>
              <div className="org">
                {e.org}
                <span className="sep">·</span>
                {e.location}
              </div>
              <p className="desc">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
