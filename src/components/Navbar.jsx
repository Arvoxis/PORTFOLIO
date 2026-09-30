import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../config/data'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const toggle = useRef()
  const header = useRef()

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

  // the open phone menu closes on Escape (focus back to the toggle), a tap outside it, or a scroll
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current.focus()
    }
    const onDown = (e) => header.current.contains(e.target) || setOpen(false)
    const onScroll = () => setOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  return (
    <header className="nav" ref={header}>
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
