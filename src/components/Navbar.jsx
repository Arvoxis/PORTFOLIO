import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../config/data'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const toggle = useRef()

  // highlight the sheet currently crossing the middle of the viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' }
    )
    // #home is watched too so nothing stays highlighted back on the hero
    ;['#home', ...navLinks.map((l) => l.href)].forEach((href) => {
      const el = document.querySelector(href)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    // closing hides the links, so hand focus back to the toggle rather than lose it
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <a href="#home" className="nav-brand" data-detect="logo.rs">
        RS<span>/ Drawing set 2026</span>
      </a>
      <button
        ref={toggle}
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Index'}
      </button>
      <nav id="nav-links" className={open ? 'open' : ''} aria-label="Sections">
        <ul>
          {navLinks.map((l, i) => {
            const on = active === l.href.slice(1)
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={on ? 'active' : ''}
                  aria-current={on ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span>0{i + 2}</span>
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
