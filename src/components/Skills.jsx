import { skills } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function SkillGroup({ category, tags, index }) {
  const [ref, visible] = useScrollAnimation()
  return (
    <div
      ref={ref}
      className={`skill-group fade-up ${visible ? 'in' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="skill-cat">{category}</div>
      <div className="skill-tags">
        {tags.map(tag => (
          <span key={tag} className="skill-tag">{tag}</span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-label">
          <span className="s-num">04</span>
          <span className="s-title">Skills</span>
        </div>
        <div className="skills-grid">
          {Object.entries(skills).map(([cat, tags], i) => (
            <SkillGroup key={cat} category={cat} tags={tags} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
