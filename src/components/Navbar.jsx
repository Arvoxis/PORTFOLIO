import { useState, useEffect } from 'react'
import { personalInfo, navLinks } from '../config/data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
        <div className="container">
          <div className="nav-inner">
            <a href="#home" className="nav-logo" aria-label="Home" onClick={close}>
              <span className="badge">{personalInfo.initials}</span>
              <span>Rakshit Sinha</span>
            </a>

            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={active === link.href.slice(1) ? 'active' : ''}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav-right">
              <span className="status-badge" aria-live="polite">
                <span className="status-dot" aria-hidden="true" />
                {personalInfo.status}
              </span>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.3 9.4 7.87 10.93.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                </svg>
              </a>
              <button
                className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="container">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>
                  {link.label} <span style={{ float: 'right', opacity: 0.4 }}>↗</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                GitHub <span style={{ float: 'right', opacity: 0.4 }}>↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
