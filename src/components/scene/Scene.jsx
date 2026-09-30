import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import Drone from './Drone'
import Tower from './Tower'
import { MODEL_URL } from './model'
import { droneParts } from '../../config/data'

// Sections the scene is choreographed against, in scroll order.
const STAGES = ['home', 'notes', 'revisions', 'drawings']

// DOM labels pinned to 3D parts. 0-3 belong to the drone (their key is also printed under the notes), 4 to the tower.
const CALLOUTS = [...droneParts, { mark: 'insulator 0.76', label: 'OBB', tag: true }]

// Section tops/heights in page coordinates, re-measured only when the layout changes.
// Also records where the notes text ends, so drone callouts know how far left they may go.
function useSections(stage) {
  const boxes = useRef([])
  useEffect(() => {
    const measure = () => {
      boxes.current = STAGES.map((id) => {
        const el = document.getElementById(id)
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { top: r.top + window.scrollY, h: r.height }
      })
      stage.current.textRight = document.querySelector('.notes-col')?.getBoundingClientRect().right ?? 0
      stage.current.revRight = document.querySelector('.revs')?.getBoundingClientRect().right ?? 0
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [stage])
  return boxes
}

// Continuous stage: 0 at the top of #home, 1 when #notes reaches the top of the viewport, ...
function readStage(boxes) {
  const y = window.scrollY
  let s = 0
  boxes.forEach((b, i) => {
    if (b && y >= b.top) s = i + Math.min(1, (y - b.top) / b.h)
  })
  return s
}

// Eases the shared stage toward the scroll position once per frame. Once the choreography is over (past the
// tower, or past the hero on phones and with reduced motion) there is nothing left to draw, so it stops the render
// loop and drops the canvas layer; scrolling back up wakes it.
function Rig({ stage, boxes, wrap }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const idle = useRef(false)
  const end = () => (stage.current.mobile || stage.current.reduce ? 0.75 : 3.0)

  useEffect(() => {
    const wake = () => {
      const pinned = import.meta.env.DEV ? window.__stage : undefined
      if (!idle.current || (pinned ?? readStage(boxes.current)) > end()) return
      idle.current = false
      wrap.current.style.visibility = ''
      setFrameloop('always')
    }
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    return () => {
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
    }
  }, [])

  useFrame((state, dt) => {
    const st = stage.current
    // dev only: window.__stage pins the choreography for screenshots (stripped from production builds)
    const pinned = import.meta.env.DEV ? window.__stage : undefined
    const target = pinned ?? readStage(boxes.current)
    // reduced motion: follow the page exactly, no easing
    st.s = st.reduce ? target : st.s + (target - st.s) * (1 - Math.exp(-Math.min(dt, 0.1) * 4))
    // phones and reduced motion only get the drone in the hero: no scroll-driven 3D after it
    const off = (st.mobile || st.reduce) && st.s > 0.6
    if (off !== st.off) wrap.current.classList.toggle('off', off)
    st.off = off

    if (st.s > end() + 0.02 && target > end()) {
      idle.current = true
      wrap.current.style.visibility = 'hidden'
      setFrameloop('never')
    }
  })
  return null
}

export default function Scene() {
  const wrap = useRef()
  // full sharpness by default; drops to 1x if the device can't hold the frame rate
  const [dpr, setDpr] = useState(1.25)
  const callouts = useRef([])
  const stage = useRef({ s: 0, mobile: false, off: false, reduce: false, textRight: 0, revRight: 0 })
  // only draw the drone once its model is known to be there, so a missing file can't take the page down with it
  const [model, setModel] = useState(false)
  useEffect(() => {
    fetch(MODEL_URL, { method: 'HEAD' })
      .then((r) => setModel(r.ok))
      .catch(() => setModel(false))
  }, [])
  const boxes = useSections(stage)

  // same queries as the CSS, so the scene and the layout agree on "phone" (a canvas width would miss the scrollbar)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const phone = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      stage.current.reduce = reduce.matches
      stage.current.mobile = phone.matches
    }
    sync()
    reduce.addEventListener('change', sync)
    phone.addEventListener('change', sync)
    return () => {
      reduce.removeEventListener('change', sync)
      phone.removeEventListener('change', sync)
    }
  }, [])

  return (
    <>
      <div className="scene" ref={wrap} aria-hidden="true">
        <Canvas
          dpr={[1, dpr]}
          camera={{ position: [0, 0, 6.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          eventSource={document.getElementById('root')}
          eventPrefix="client"
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          <fog attach="fog" args={['#0f2a4a', 6.5, 12]} />
          <hemisphereLight args={['#f3ead8', '#0b2140', 0.7]} />
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          <directionalLight position={[-4, 1, -3]} intensity={0.5} color="#8fb4e0" />
          {/* studio softboxes baked into an env map once: gives the ceramic and steel real reflections */}
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} rotation-x={Math.PI / 3} />
            <Lightformer intensity={1.2} position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
            <Lightformer intensity={0.8} position={[5, 0, -2]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} color="#bcd4f0" />
          </Environment>

          <Rig stage={stage} boxes={boxes} wrap={wrap} />
          <Tower stage={stage} callouts={callouts} />
          {model && (
            <Suspense fallback={null}>
              <Drone stage={stage} callouts={callouts} />
            </Suspense>
          )}
        </Canvas>
      </div>
      <div className="callouts" aria-hidden="true">
        {CALLOUTS.map((c, i) => (
          <div
            key={c.mark}
            className={c.tag ? 'callout tag' : 'callout'}
            ref={(el) => {
              callouts.current[i] = el
            }}
          >
            {!c.tag && <i />}
            <b>{c.mark}</b>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
