import { useEffect, useState } from 'react'
import { personalInfo } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
const GhIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.3 9.4 7.87 10.93.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
)
const LiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.1 0 4.9 2.7 4.9 6.3V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9V9Z" />
  </svg>
)
const MdIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12ZM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12Z" />
  </svg>
)

function formatIST(d = new Date()) {
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function Contact() {
  const [ref, vis] = useScrollAnimation()
  const [cardsRef, cardsVis] = useScrollAnimation()
  const [istTime, setIstTime] = useState(() => formatIST())

  useEffect(() => {
    const update = () => setIstTime(formatIST())
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="contact" className="section section-alt contact" ref={ref}>
      <div className="container">
        <span className="section-watermark" aria-hidden="true">05 Contact</span>
        <h2 className={`reveal ${vis ? 'in' : ''}`}>
          <span className="line-1">Let's build</span>
          <span className="line-2">something.</span>
        </h2>
        <p className={`sub reveal ${vis ? 'in' : ''}`}>
          I'm actively looking for ML/SDE internship opportunities for Summer/Fall 2025. Open to research
          collaborations and interesting problems.
        </p>

        <div className={`contact-cards reveal-stagger ${cardsVis ? 'in' : ''}`} ref={cardsRef}>
          <a href={`mailto:${personalInfo.email}`} className="contact-card">
            <MailIcon />
            <span className="label">Email</span>
            <span className="handle">{personalInfo.email}</span>
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <GhIcon />
            <span className="label">GitHub</span>
            <span className="handle">@{personalInfo.githubHandle}</span>
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <LiIcon />
            <span className="label">LinkedIn</span>
            <span className="handle">/{personalInfo.linkedinHandle}</span>
          </a>
          <a
            href={personalInfo.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <MdIcon />
            <span className="label">Medium</span>
            <span className="handle">{personalInfo.mediumHandle}</span>
          </a>
        </div>

        <div className="contact-footer-line">
          <span>Based in {personalInfo.location}</span>
          <span className="sep">·</span>
          <span className="ist-clock">{istTime} IST</span>
          <span className="sep">·</span>
          <span>{personalInfo.availability}</span>
        </div>
      </div>
    </section>
  )
}
