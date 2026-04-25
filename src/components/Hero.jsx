import { useEffect, useState } from 'react'
import { personalInfo } from '../config/data'
import RadarVisualizer from './RadarVisualizer'

export default function Hero() {
  const roles = personalInfo.roles
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    setDisplay('')
    setPhase('typing')
    setIdx(0)
  }, [])

  useEffect(() => {
    const current = roles[idx]
    let t
    if (phase === 'typing') {
      if (display.length < current.length) {
        t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), 70)
      } else {
        t = setTimeout(() => setPhase('deleting'), 1600)
      }
    } else if (phase === 'deleting') {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), 35)
      } else {
        setIdx((i) => (i + 1) % roles.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(t)
  }, [display, phase, idx, roles])

  const [first, ...rest] = personalInfo.name.split(' ')
  const last = rest.join(' ')

  return (
    <section id="home" className="hero section">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-glow-2" aria-hidden="true" />
      <div className="container">
        <div className="hero-inner">
          <h1>
            <span>{first}</span>
            {last && <span className="name-last">{last}</span>}
          </h1>

          <div className="hero-role" aria-live="polite">
            <span>{display}</span>
            <span className="hero-cursor" aria-hidden="true" />
          </div>

          <p className="hero-bio">{personalInfo.shortBio}</p>

          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">
              View Projects <span className="arrow">→</span>
            </a>
            <a href="#writing" className="btn">
              Read Writing <span className="arrow">→</span>
            </a>
          </div>

          <RadarVisualizer />
        </div>
      </div>

    </section>
  )
}
