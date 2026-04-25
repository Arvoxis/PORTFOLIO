import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Writing from './components/Writing'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-cursor')

    let dx = window.innerWidth / 2
    let dy = window.innerHeight / 2
    let rx = dx
    let ry = dy
    let raf = 0

    const move = (e) => {
      dx = e.clientX
      dy = e.clientY
    }

    const tick = () => {
      rx += (dx - rx) * 0.18
      ry += (dy - ry) * 0.18
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const enter = () => document.documentElement.classList.add('cursor-hover')
    const leave = () => document.documentElement.classList.remove('cursor-hover')

    const bind = () => {
      document
        .querySelectorAll('a, button, .project-card, .stat-card, .contact-card')
        .forEach((el) => {
          el.addEventListener('mouseenter', enter)
          el.addEventListener('mouseleave', leave)
        })
    }

    bind()
    const obs = new MutationObserver(bind)
    obs.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      obs.disconnect()
      document.documentElement.classList.remove('has-cursor', 'cursor-hover')
    }
  }, [])

  return (
    <>
      <div className="ambient ambient-1" aria-hidden="true" />
      <div className="ambient ambient-2" aria-hidden="true" />
      <div className="ambient ambient-3" aria-hidden="true" />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Writing />
        <Experience />
        <Contact />
      </main>
      <Footer />

      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
