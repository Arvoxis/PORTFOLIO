import { useEffect, useRef } from 'react'

const COLS = 'ABCDEFGH'.split('')
const ROWS = ['1', '2', '3', '4', '5', '6']

// Fixed drawing border: zone letters, ruler ticks, a scroll marker and a live coordinate readout.
export default function SheetFrame() {
  const readout = useRef(null)
  const marker = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    let x = 0
    let y = 0
    let raf = 0

    const paint = () => {
      raf = 0
      const max = root.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      const rail = marker.current.parentElement.clientHeight - 36 - 2
      marker.current.style.transform = `translateY(${(p * rail).toFixed(1)}px)`
      readout.current.textContent = `X ${String(x).padStart(4, '0')}  Y ${String(y + Math.round(window.scrollY)).padStart(5, '0')}`
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const move = (e) => {
      x = Math.round(e.clientX)
      y = Math.round(e.clientY)
      queue()
    }

    paint()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <div className="frame" aria-hidden="true">
      <div className="frame-zones top">
        {COLS.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div className="frame-zones side">
        {ROWS.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
      <div className="frame-marker" ref={marker} />
      <div className="frame-readout" ref={readout} />
    </div>
  )
}
