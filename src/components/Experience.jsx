import { experience } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function ExpItem({ item, index }) {
  const [ref, visible] = useScrollAnimation()
  return (
    <li
      ref={ref}
      className={`exp-item fade-up ${visible ? 'in' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="exp-meta">
        <div className="exp-period">{item.period}</div>
        <div className="exp-loc">{item.location}</div>
      </div>
      <div className="exp-body">
        <div className="exp-role">{item.role}</div>
        <div className="exp-company">{item.company}</div>
        <ul className="exp-bullets">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-label">
          <span className="s-num">02</span>
          <span className="s-title">Experience</span>
        </div>
        <ul className="exp-list">
          {experience.map((item, i) => (
            <ExpItem key={i} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
