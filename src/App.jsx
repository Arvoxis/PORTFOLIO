import { lazy, Suspense, useEffect } from 'react'
import SheetFrame from './components/SheetFrame'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Detector from './components/Detector'

// three.js is the heaviest chunk: load it after the text has painted, and not at all on data-saver
// If the chunk fails to load (say, a stale tab after a redeploy), carry on without the 3D rather than blank the page.
const Scene = lazy(() => import('./components/scene/Scene').catch(() => ({ default: () => null })))
const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData

export default function App() {
  // the page renders after load, so a shared link to a section or project (#dwg-khoj) has to be scrolled to by hand
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [])

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      {!saveData && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
      <SheetFrame />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Detector />
    </>
  )
}
