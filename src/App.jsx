import { lazy, Suspense } from 'react'
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
const Scene = lazy(() => import('./components/scene/Scene'))
const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData

export default function App() {
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
