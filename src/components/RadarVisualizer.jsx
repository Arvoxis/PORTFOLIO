import { useEffect, useRef } from 'react'

const HUD_FONT = '9px "JetBrains Mono", ui-monospace, monospace'
const FULL_REV_MS = 4000
const ANG_VEL = 360 / FULL_REV_MS

const BLIPS_DEF = [
  { label: 'YOLOv11',  angle: 25,  dist: 0.55, confidence: 0.94 },
  { label: 'TensorRT', angle: 70,  dist: 0.65, confidence: 0.91 },
  { label: 'DINOv2',   angle: 110, dist: 0.38, confidence: 0.87 },
  { label: 'Jetson',   angle: 145, dist: 0.92, confidence: 0.90 },
  { label: 'FastAPI',  angle: 155, dist: 0.70, confidence: 0.96 },
  { label: 'PyTorch',  angle: 200, dist: 0.50, confidence: 0.89 },
  { label: 'React',    angle: 240, dist: 0.78, confidence: 0.93 },
  { label: 'OpenCV',   angle: 285, dist: 0.42, confidence: 0.85 },
  { label: 'PostGIS',  angle: 320, dist: 0.65, confidence: 0.88 },
  { label: 'SAM 2',    angle: 350, dist: 0.88, confidence: 0.92 },
]

class RadarViz {
  constructor(canvas, container) {
    this.canvas = canvas
    this.container = container
    this.ctx = canvas.getContext('2d')
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    this.width = 0
    this.height = 0
    this.cx = 0
    this.cy = 0
    this.outerR = 0

    this.staticCanvas = null
    this.sweepAngle = 0
    this.prevSweepAngle = 0
    this.lastReal = null
    this.speedBoostUntil = 0

    this.blips = BLIPS_DEF.map(def => ({ ...def, pingAt: null, x: 0, y: 0 }))

    this.hoveredBlip = null
    this.mouseX = -9999
    this.mouseY = -9999

    this.rafId = 0
    this.running = false
    this.inViewport = true
    this.io = null
    this.resizeTimer = null

    this._handleResize = this._handleResize.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseLeave = this._onMouseLeave.bind(this)
    this._onClick = this._onClick.bind(this)
    this._onVisibility = this._onVisibility.bind(this)
    this._tick = this._tick.bind(this)
  }

  init() {
    this._resize()
    this._buildStaticCanvas()
    window.addEventListener('resize', this._handleResize)
    this.canvas.addEventListener('mousemove', this._onMouseMove)
    this.canvas.addEventListener('mouseleave', this._onMouseLeave)
    this.canvas.addEventListener('click', this._onClick)
    document.addEventListener('visibilitychange', this._onVisibility)
    if (typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(
        (entries) => {
          this.inViewport = entries[0].isIntersecting
          this._evaluateRunState()
        },
        { threshold: 0.05 },
      )
      this.io.observe(this.canvas)
    }
    this._evaluateRunState()
  }

  destroy() {
    this._stopLoop()
    window.removeEventListener('resize', this._handleResize)
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave)
    this.canvas.removeEventListener('click', this._onClick)
    document.removeEventListener('visibilitychange', this._onVisibility)
    if (this.io) this.io.disconnect()
    if (this.resizeTimer) clearTimeout(this.resizeTimer)
  }

  _evaluateRunState() {
    const shouldRun = this.inViewport && !document.hidden
    if (shouldRun && !this.running) {
      this.running = true
      this.lastReal = null
      this._startLoop()
    } else if (!shouldRun && this.running) {
      this.running = false
      this._stopLoop()
    }
  }

  _startLoop() {
    const tick = (now) => {
      this.rafId = requestAnimationFrame(tick)
      this._tick(now)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  _stopLoop() {
    cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  _onVisibility() {
    this._evaluateRunState()
  }

  _handleResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      this._resize()
      this._buildStaticCanvas()
    }, 150)
  }

  _resize() {
    const rect = this.container.getBoundingClientRect()
    this.width = Math.max(280, rect.width)
    this.height = Math.max(280, rect.height)
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.cx = this.width / 2
    this.cy = this.height / 2
    this.outerR = Math.min(
      Math.min(this.width, this.height) * 0.42,
      this.width / 2 - 20,
      this.height / 2 - 20,
    )
    this._updateBlipPositions()
  }

  _updateBlipPositions() {
    for (const blip of this.blips) {
      const rad = blip.angle * Math.PI / 180
      blip.x = this.cx + this.outerR * blip.dist * Math.sin(rad)
      blip.y = this.cy - this.outerR * blip.dist * Math.cos(rad)
    }
  }

  get _isMobile() { return this.width <= 300 }

  _buildStaticCanvas() {
    const c = document.createElement('canvas')
    c.width = Math.round(this.width * this.dpr)
    c.height = Math.round(this.height * this.dpr)
    const sctx = c.getContext('2d')
    sctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    const { cx, cy, width: w, height: h } = this
    const R = this.outerR

    // Outer circle
    sctx.strokeStyle = 'rgba(110, 231, 183, 0.12)'
    sctx.lineWidth = 1
    sctx.beginPath()
    sctx.arc(cx, cy, R, 0, Math.PI * 2)
    sctx.stroke()

    // Concentric rings at 66% and 33%
    sctx.strokeStyle = 'rgba(110, 231, 183, 0.06)'
    for (const frac of [0.66, 0.33]) {
      sctx.beginPath()
      sctx.arc(cx, cy, R * frac, 0, Math.PI * 2)
      sctx.stroke()
    }

    // Crosshair lines across full diameter
    sctx.strokeStyle = 'rgba(110, 231, 183, 0.08)'
    sctx.lineWidth = 1
    sctx.beginPath()
    sctx.moveTo(cx - R, cy)
    sctx.lineTo(cx + R, cy)
    sctx.moveTo(cx, cy - R)
    sctx.lineTo(cx, cy + R)
    sctx.stroke()

    // Center dot
    sctx.fillStyle = 'rgba(110, 231, 183, 0.5)'
    sctx.beginPath()
    sctx.arc(cx, cy, 3, 0, Math.PI * 2)
    sctx.fill()

    // Corner brackets (L-shapes)
    const bracketLen = this._isMobile ? 10 : 14
    sctx.strokeStyle = 'rgba(110, 231, 183, 0.15)'
    sctx.lineWidth = 1
    const br = (x, y, dx, dy) => {
      sctx.beginPath()
      sctx.moveTo(x, y + dy * bracketLen)
      sctx.lineTo(x, y)
      sctx.lineTo(x + dx * bracketLen, y)
      sctx.stroke()
    }
    br(0.5, 0.5, 1, 1)
    br(w - 0.5, 0.5, -1, 1)
    br(0.5, h - 0.5, 1, -1)
    br(w - 0.5, h - 0.5, -1, -1)

    // Static HUD top-left (hidden on mobile — too cramped)
    if (!this._isMobile) {
      sctx.fillStyle = 'rgba(100, 116, 139, 0.5)'
      sctx.font = HUD_FONT
      sctx.textAlign = 'left'
      sctx.textBaseline = 'top'
      sctx.fillText('SYSTEM  HAWK-I v2.1', 14, 14)
      sctx.fillText('MODE    AREA SCAN', 14, 26)
      sctx.fillText('STATUS  ACTIVE', 14, 38)
    }

    this.staticCanvas = c
  }

  _onClick() {
    this.speedBoostUntil = performance.now() + 2000
  }

  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect()
    this.mouseX = e.clientX - rect.left
    this.mouseY = e.clientY - rect.top
    this._updateHoveredBlip()
  }

  _onMouseLeave() {
    this.mouseX = -9999
    this.mouseY = -9999
    this.hoveredBlip = null
  }

  _updateHoveredBlip() {
    const now = performance.now()
    let found = null
    for (const blip of this.blips) {
      if (blip.pingAt === null) continue
      if (now - blip.pingAt > 6600) continue
      const dx = blip.x - this.mouseX
      const dy = blip.y - this.mouseY
      if (dx * dx + dy * dy < 14 * 14) { found = blip; break }
    }
    this.hoveredBlip = found
  }

  _tick(realNow) {
    if (this.lastReal === null) this.lastReal = realNow
    const delta = Math.min(64, realNow - this.lastReal)
    this.lastReal = realNow

    const speedMult = realNow < this.speedBoostUntil ? 2 : 1
    const dAngle = ANG_VEL * delta * speedMult

    this.prevSweepAngle = this.sweepAngle
    this.sweepAngle = (this.sweepAngle + dAngle) % 360

    // Detect blip crossings
    const prev = this.prevSweepAngle
    const curr = this.sweepAngle
    for (const blip of this.blips) {
      const crossed = prev <= curr
        ? blip.angle > prev && blip.angle <= curr
        : blip.angle > prev || blip.angle <= curr
      if (crossed) blip.pingAt = realNow
    }

    this._draw(realNow)
  }

  _draw(realNow) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    if (this.staticCanvas) {
      ctx.drawImage(this.staticCanvas, 0, 0, this.width, this.height)
    }

    // Trailing glow: 7 lines stepping 5° back (35°), fading 0.07 → 0
    for (let i = 7; i >= 1; i--) {
      const ta = ((this.sweepAngle - i * 5) + 360) % 360
      const alpha = 0.07 * (1 - i / 7)
      this._drawSweepLine(ctx, ta, `rgba(110, 231, 183, ${alpha})`, 1)
    }

    // Main sweep line
    this._drawSweepLine(ctx, this.sweepAngle, 'rgba(110, 231, 183, 0.8)', this._isMobile ? 1 : 1.5)

    // Blips
    for (const blip of this.blips) {
      this._drawBlip(ctx, blip, realNow)
    }

    // Dynamic HUD
    this._drawHUD(ctx, realNow)

    // Tooltip
    if (this.hoveredBlip) {
      this._drawTooltip(ctx, this.hoveredBlip)
    }
  }

  _drawSweepLine(ctx, angleDeg, color, lineWidth) {
    const rad = angleDeg * Math.PI / 180
    const ex = this.cx + this.outerR * Math.sin(rad)
    const ey = this.cy - this.outerR * Math.cos(rad)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(this.cx, this.cy)
    ctx.lineTo(ex, ey)
    ctx.stroke()
  }

  _drawBlip(ctx, blip, realNow) {
    if (blip.pingAt === null) return
    const elapsed = realNow - blip.pingAt
    if (elapsed > 6600) return

    // Expanding ping ring (0–600ms)
    if (elapsed < 600) {
      const t = elapsed / 600
      ctx.strokeStyle = `rgba(110, 231, 183, ${0.8 * (1 - t)})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(blip.x, blip.y, 14 * t, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Dot alpha: fades in during ping, fades out over 6s
    const dotAlpha = elapsed < 600
      ? elapsed / 600
      : Math.max(0, 1 - (elapsed - 600) / 6000)

    if (dotAlpha <= 0) return

    ctx.fillStyle = `rgba(110, 231, 183, ${dotAlpha})`
    ctx.beginPath()
    ctx.arc(blip.x, blip.y, 3, 0, Math.PI * 2)
    ctx.fill()

    // Label: angle 315°–135° (through 0°) → right; 135°–315° → left
    ctx.fillStyle = `rgba(110, 231, 183, ${0.7 * dotAlpha})`
    ctx.font = this._isMobile ? '8px "JetBrains Mono", ui-monospace, monospace' : HUD_FONT
    ctx.textBaseline = 'middle'
    const onRight = blip.angle <= 135 || blip.angle >= 315
    if (onRight) {
      ctx.textAlign = 'left'
      ctx.fillText(blip.label, blip.x + 8, blip.y)
    } else {
      ctx.textAlign = 'right'
      ctx.fillText(blip.label, blip.x - 8, blip.y)
    }
  }

  _drawHUD(ctx, realNow) {
    if (this._isMobile) return
    const hdg = Math.round(this.sweepAngle)
    const visible = this.blips.filter(b => b.pingAt !== null && realNow - b.pingAt <= 6600).length

    ctx.font = HUD_FONT
    ctx.textBaseline = 'bottom'

    // Bottom-right: live heading
    ctx.fillStyle = 'rgba(110, 231, 183, 0.45)'
    ctx.textAlign = 'right'
    ctx.fillText(`HDG  ${String(hdg).padStart(3, '0')}\u00B0`, this.width - 14, this.height - 14)

    // Bottom-left: detected count
    ctx.fillStyle = 'rgba(100, 116, 139, 0.5)'
    ctx.textAlign = 'left'
    ctx.fillText(`DETECTED  ${visible}/10`, 14, this.height - 14)
  }

  _drawTooltip(ctx, blip) {
    const text = `Unit: ${blip.label} \u00B7 Confidence: ${blip.confidence.toFixed(2)}`
    ctx.font = HUD_FONT
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    const pad = 7
    const textW = ctx.measureText(text).width
    const boxW = textW + pad * 2
    const boxH = 12 + pad * 2
    let x = blip.x + 12
    let y = blip.y - boxH / 2
    if (x + boxW > this.width - 4) x = blip.x - boxW - 12
    if (y < 4) y = 4
    if (y + boxH > this.height - 4) y = this.height - boxH - 4
    ctx.fillStyle = 'rgba(10, 12, 16, 0.94)'
    ctx.fillRect(x, y, boxW, boxH)
    ctx.strokeStyle = 'rgba(110, 231, 183, 1)'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, boxW - 1, boxH - 1)
    ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
    ctx.fillText(text, x + pad, y + pad)
  }
}

export default function RadarVisualizer() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const viz = new RadarViz(canvasRef.current, containerRef.current)
    viz.init()
    return () => viz.destroy()
  }, [])

  return (
    <div ref={containerRef} className="hero-viz" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-viz-canvas" />
      <div className="hero-viz-scanlines" />
    </div>
  )
}
