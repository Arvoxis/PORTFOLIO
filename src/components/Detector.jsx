import { useEffect, useRef } from 'react'

// Stable fake confidence per class name, 0.90 to 0.99
function confidence(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return 0.9 + (h % 100) / 1000
}

// One shared YOLO-style bracket box that snaps onto whatever [data-detect] element is hovered or focused.
// On first load it detects the hero name once, then lets go.
export default function Detector() {
  const box = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let target = null
    let raf = 0
    let count = 0

    const place = () => {
      raf = 0
      const el = box.current
      if (!target) {
        el.classList.remove('on')
        return
      }
      const r = target.getBoundingClientRect()
      const pad = 8
      el.style.transform = `translate3d(${r.left - pad}px, ${r.top - pad}px, 0)`
      el.style.width = `${r.width + pad * 2}px`
      el.style.height = `${r.height + pad * 2}px`
      el.classList.add('on')
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(place)
    }

    // confidence counts up 0.00 -> score, like a detector warming up
    const show = (name) => {
      cancelAnimationFrame(count)
      const score = confidence(name)
      const t0 = performance.now()
      const tick = (now) => {
        const k = reduce ? 1 : Math.min(1, (now - t0) / 320)
        label.current.textContent = `${name} ${(score * k).toFixed(2)}`
        if (k < 1) count = requestAnimationFrame(tick)
      }
      count = requestAnimationFrame(tick)
    }

    const aim = (t) => {
      if (t === target) return
      target = t
      if (t) show(t.dataset.detect)
      queue()
    }
    const pick = (e) => {
      clearTimeout(intro)
      aim(e.target instanceof Element ? e.target.closest('[data-detect]') : null)
    }
    const leave = (e) => {
      if (!e.relatedTarget) aim(null)
    }

    // one-time intro detection on the hero name
    const name = document.querySelector('.hero-name')
    let intro = setTimeout(() => {
      if (window.scrollY > 40 || target) return
      aim(name)
      intro = setTimeout(() => target === name && aim(null), 1800)
    }, 1600)

    document.addEventListener('pointerover', pick)
    document.addEventListener('focusin', pick)
    document.addEventListener('pointerout', leave)
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      clearTimeout(intro)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(count)
      document.removeEventListener('pointerover', pick)
      document.removeEventListener('focusin', pick)
      document.removeEventListener('pointerout', leave)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])

  return (
    <div ref={box} className="detector" aria-hidden="true">
      <span ref={label} />
    </div>
  )
}
