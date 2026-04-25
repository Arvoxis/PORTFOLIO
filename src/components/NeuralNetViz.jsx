import { useEffect, useRef } from 'react'

const LAYER_SIZES = [3, 6, 6, 8, 5, 3]
const LAYER_LABELS = ['INPUT', 'CONV', 'POOL', 'FC', 'FC', 'OUTPUT']
const OUTPUT_LABELS = ['Defect', 'Anomaly', 'Clear']
const PREC_OPTIONS = ['INT8 TensorRT', 'FP16', 'INT8 TensorRT']
const MAX_OUT_PER_NODE = 3
const MAX_SIGNALS = 8
const MAX_ACTIVE_NODES = 6
const HUD_FONT = '9px "JetBrains Mono", ui-monospace, monospace'

class NeuralNetVisualizer {
  constructor(canvas, container, scanlinesEl) {
    this.canvas = canvas
    this.container = container
    this.scanlinesEl = scanlinesEl
    this.ctx = canvas.getContext('2d')
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    this.width = 0
    this.height = 0

    this.nodes = []
    this.edges = []
    this.adjacency = []

    this.staticCanvas = null

    this.passNumber = 46
    this.pass = null
    this.firstPassAt = 600
    this.nextPassAt = 600

    this.hoveredNode = null
    this.mouseInside = false
    this.mouseX = 0
    this.mouseY = 0

    this.timeScale = 1
    this.targetTimeScale = 1
    this.vTime = 0
    this.lastReal = null

    this.fadeInStart = 0
    this.ms = 23.4
    this.precIdx = 0
    this.precFlicker = null
    this.flashStart = 0

    this.rafId = 0
    this.fallbackId = 0
    this.lastRafTime = 0
    this.hudIntervalId = 0

    this.documentVisible = !document.hidden
    this.inViewport = true
    this.running = false
    this.resizeTimer = null
    this.io = null

    this._handleResize = this._handleResize.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseEnter = this._onMouseEnter.bind(this)
    this._onMouseLeave = this._onMouseLeave.bind(this)
    this._onClick = this._onClick.bind(this)
    this._onVisibility = this._onVisibility.bind(this)
    this._tick = this._tick.bind(this)
    this._tickHUD = this._tickHUD.bind(this)
  }

  init() {
    this._resize()
    this._buildEdges()
    this._buildStaticCanvas()

    window.addEventListener('resize', this._handleResize)
    this.canvas.addEventListener('mousemove', this._onMouseMove)
    this.canvas.addEventListener('mouseenter', this._onMouseEnter)
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

    this.hudIntervalId = setInterval(this._tickHUD, 800)
    this._evaluateRunState()
  }

  destroy() {
    this._stopLoop()
    clearInterval(this.hudIntervalId)
    window.removeEventListener('resize', this._handleResize)
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
    this.canvas.removeEventListener('mouseenter', this._onMouseEnter)
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave)
    this.canvas.removeEventListener('click', this._onClick)
    document.removeEventListener('visibilitychange', this._onVisibility)
    if (this.io) this.io.disconnect()
    if (this.resizeTimer) clearTimeout(this.resizeTimer)
  }

  _evaluateRunState() {
    const shouldRun = this.inViewport
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
    this.lastRafTime = performance.now()
    const rafTick = (now) => {
      this.lastRafTime = now
      this._tick(now)
      this.rafId = requestAnimationFrame(rafTick)
    }
    this.rafId = requestAnimationFrame(rafTick)
    this.fallbackId = setInterval(() => {
      const now = performance.now()
      if (now - this.lastRafTime > 100) {
        this.lastRafTime = now
        this._tick(now)
      }
    }, 16)
  }

  _stopLoop() {
    cancelAnimationFrame(this.rafId)
    clearInterval(this.fallbackId)
    this.fallbackId = 0
  }

  _onVisibility() {
    this.documentVisible = !document.hidden
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
    this.height = Math.max(360, rect.height)
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this._layoutNodes()
  }

  _layoutNodes() {
    const prev = this.nodes
    this.nodes = []
    const padX = 42
    const padY = 50
    const innerW = this.width - 2 * padX
    const innerH = this.height - 2 * padY
    const nLayers = LAYER_SIZES.length
    for (let li = 0; li < nLayers; li++) {
      const x = padX + (innerW * li) / (nLayers - 1)
      const count = LAYER_SIZES[li]
      const totalH = count > 1 ? innerH * 0.86 : 0
      const startY = padY + (innerH - totalH) / 2
      const layerNodes = []
      for (let ni = 0; ni < count; ni++) {
        const y = count === 1 ? this.height / 2 : startY + (totalH * ni) / (count - 1)
        const previous = prev[li] && prev[li][ni]
        layerNodes.push({
          x,
          y,
          layerIdx: li,
          nodeIdx: ni,
          activatedAt: previous ? previous.activatedAt : -Infinity,
          activation: previous ? previous.activation : Math.random(),
          isWinner: previous ? previous.isWinner : false,
        })
      }
      this.nodes.push(layerNodes)
    }
  }

  _buildEdges() {
    this.edges = []
    this.adjacency = []
    for (let li = 0; li < LAYER_SIZES.length - 1; li++) {
      const fromCount = LAYER_SIZES[li]
      const toCount = LAYER_SIZES[li + 1]
      const k = Math.min(MAX_OUT_PER_NODE, toCount)
      const layerAdj = []
      for (let i = 0; i < fromCount; i++) {
        const pool = []
        for (let t = 0; t < toCount; t++) pool.push(t)
        const targets = []
        while (targets.length < k) {
          const idx = Math.floor(Math.random() * pool.length)
          const toIdx = pool.splice(idx, 1)[0]
          this.edges.push({ layerIdx: li, fromIdx: i, toIdx })
          targets.push(toIdx)
        }
        layerAdj.push(targets)
      }
      this.adjacency.push(layerAdj)
    }
  }

  _buildStaticCanvas() {
    const c = document.createElement('canvas')
    c.width = Math.round(this.width * this.dpr)
    c.height = Math.round(this.height * this.dpr)
    const sctx = c.getContext('2d')
    sctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    sctx.strokeStyle = 'rgba(110, 231, 183, 0.15)'
    sctx.lineWidth = 1
    const s = 12
    const w = this.width
    const h = this.height
    const corner = (x, y, hx, hy) => {
      sctx.beginPath()
      sctx.moveTo(x, y + hy * s)
      sctx.lineTo(x, y)
      sctx.lineTo(x + hx * s, y)
      sctx.stroke()
    }
    corner(0.5, 0.5, 1, 1)
    corner(w - 0.5, 0.5, -1, 1)
    corner(0.5, h - 0.5, 1, -1)
    corner(w - 0.5, h - 0.5, -1, -1)

    sctx.strokeStyle = 'rgba(110, 231, 183, 0.06)'
    sctx.lineWidth = 0.5
    sctx.beginPath()
    for (const e of this.edges) {
      const from = this.nodes[e.layerIdx][e.fromIdx]
      const to = this.nodes[e.layerIdx + 1][e.toIdx]
      sctx.moveTo(from.x, from.y)
      sctx.lineTo(to.x, to.y)
    }
    sctx.stroke()

    sctx.fillStyle = 'rgba(15, 17, 23, 0.9)'
    sctx.strokeStyle = 'rgba(110, 231, 183, 0.22)'
    sctx.lineWidth = 1
    for (const layer of this.nodes) {
      for (const node of layer) {
        sctx.beginPath()
        sctx.arc(node.x, node.y, 10, 0, Math.PI * 2)
        sctx.fill()
        sctx.stroke()
      }
    }

    sctx.fillStyle = 'rgba(100, 116, 139, 0.7)'
    sctx.font = HUD_FONT
    sctx.textAlign = 'center'
    sctx.textBaseline = 'top'
    for (let li = 0; li < LAYER_SIZES.length; li++) {
      const layer = this.nodes[li]
      let maxY = -Infinity
      for (const n of layer) if (n.y > maxY) maxY = n.y
      sctx.fillText(LAYER_LABELS[li], layer[0].x, maxY + 18)
    }

    sctx.fillStyle = 'rgba(100, 116, 139, 0.5)'
    sctx.textAlign = 'left'
    sctx.fillText('MODEL  YOLOv11n-edge', 14, 14)
    sctx.fillText('DEVICE Jetson Orin Nano', 14, 26)

    this.staticCanvas = c
  }

  startPass(vNow) {
    this.pass = { startTime: vNow, signals: [] }

    const l0Total = LAYER_SIZES[0]
    const l0Count = Math.max(1, Math.round(l0Total * (0.6 + Math.random() * 0.2)))
    const l0Pool = []
    for (let i = 0; i < l0Total; i++) l0Pool.push(i)
    const l0Firing = []
    while (l0Firing.length < l0Count) {
      l0Firing.push(l0Pool.splice(Math.floor(Math.random() * l0Pool.length), 1)[0])
    }

    for (let li = 0; li < LAYER_SIZES.length; li++) {
      for (let ni = 0; ni < LAYER_SIZES[li]; ni++) {
        this.nodes[li][ni].activation = Math.random()
        this.nodes[li][ni].isWinner = false
      }
    }

    for (const ni of l0Firing) this.nodes[0][ni].activatedAt = vNow

    const firingSets = new Array(LAYER_SIZES.length)
    firingSets[0] = new Set(l0Firing)

    let layerStart = 0
    const transitionStep = 480
    for (let li = 0; li < LAYER_SIZES.length - 1; li++) {
      const fromFiring = firingSets[li]
      const targetsHit = new Set()
      for (const fromIdx of fromFiring) {
        const fireDelay = Math.random() * 80
        const adj = this.adjacency[li][fromIdx]
        for (const toIdx of adj) {
          this.pass.signals.push({
            layerIdx: li,
            fromIdx,
            toIdx,
            fireAt: vNow + layerStart + fireDelay,
            duration: 400,
            arrived: false,
          })
          targetsHit.add(toIdx)
        }
      }
      firingSets[li + 1] = targetsHit
      layerStart += transitionStep
    }

    let finalFiring = [...firingSets[firingSets.length - 1]]
    if (finalFiring.length === 0) finalFiring = [0]
    const winnerIdx = finalFiring[Math.floor(Math.random() * finalFiring.length)]
    this.pass.winnerIdx = winnerIdx
    this.nodes[LAYER_SIZES.length - 1][winnerIdx].isWinner = true

    this.pass.outputAppearAt = vNow + layerStart
    this.pass.endAt = this.pass.outputAppearAt + 1500

    this.passNumber += 1
    let totalFired = 0
    for (const set of firingSets) totalFired += set.size
    this.pass.totalFired = totalFired
    this.pass.totalNodes = LAYER_SIZES.reduce((a, b) => a + b, 0)
    this.nextPassAt = this.pass.outputAppearAt + 1200
  }

  _onMouseEnter() {
    this.mouseInside = true
    this.targetTimeScale = 0.4
    if (this.scanlinesEl?.parentElement) {
      this.scanlinesEl.parentElement.classList.add('hover')
    }
  }

  _onMouseLeave() {
    this.mouseInside = false
    this.targetTimeScale = 1
    this.hoveredNode = null
    if (this.scanlinesEl?.parentElement) {
      this.scanlinesEl.parentElement.classList.remove('hover')
    }
  }

  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect()
    this.mouseX = e.clientX - rect.left
    this.mouseY = e.clientY - rect.top
    let hovered = null
    let bestDist = 18 * 18
    for (const layer of this.nodes) {
      for (const node of layer) {
        const dx = node.x - this.mouseX
        const dy = node.y - this.mouseY
        const d = dx * dx + dy * dy
        if (d < bestDist) {
          bestDist = d
          hovered = node
        }
      }
    }
    this.hoveredNode = hovered
  }

  _onClick() {
    this.flashStart = this.vTime
    this.startPass(this.vTime)
  }

  _tickHUD() {
    const drift = (Math.random() - 0.5) * 1.4
    this.ms = Math.max(21.2, Math.min(26.8, this.ms + drift))
  }

  _tick(realNow) {
    if (this.lastReal === null) {
      this.lastReal = realNow
      this.fadeInStart = realNow
    }
    const realDelta = Math.min(64, realNow - this.lastReal)
    this.lastReal = realNow
    this.timeScale += (this.targetTimeScale - this.timeScale) * 0.18
    this.vTime += realDelta * this.timeScale

    this._update(this.vTime)
    this._draw(this.vTime, realNow)
  }

  _update(vNow) {
    if (!this.pass && vNow >= this.firstPassAt) {
      this.startPass(vNow)
    } else if (this.pass && vNow >= this.nextPassAt) {
      this.startPass(vNow)
    }

    if (this.pass) {
      const signals = this.pass.signals
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i]
        if (s.arrived) continue
        const arrival = s.fireAt + s.duration
        if (vNow >= arrival) {
          s.arrived = true
          const node = this.nodes[s.layerIdx + 1][s.toIdx]
          if (node.activatedAt < arrival) node.activatedAt = arrival
        }
      }
    }

    if (!this.precFlicker || vNow >= this.precFlicker.start + 6000) {
      this.precFlicker = { start: vNow, end: vNow + 600 }
      this.precIdx = (this.precIdx + 1) % PREC_OPTIONS.length
    }
  }

  _draw(vNow, realNow) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    const fadeT = (realNow - this.fadeInStart - 600) / 800
    const fadeIn = Math.max(0, Math.min(1, fadeT))
    if (fadeIn <= 0) return
    ctx.globalAlpha = fadeIn

    if (this.staticCanvas) {
      ctx.drawImage(this.staticCanvas, 0, 0, this.width, this.height)
    }

    this._drawSignals(ctx, vNow)
    this._drawActiveNodes(ctx, vNow)
    this._drawWinnerNode(ctx, vNow)
    this._drawOutputLabels(ctx, vNow)
    this._drawHUDDynamic(ctx, vNow)
    this._drawClickFlash(ctx, vNow)
    this._drawTooltip(ctx)

    ctx.globalAlpha = 1
  }

  _drawSignals(ctx, vNow) {
    if (!this.pass) return
    const active = []
    const signals = this.pass.signals
    for (let i = 0; i < signals.length; i++) {
      const s = signals[i]
      if (vNow < s.fireAt) continue
      const elapsed = vNow - s.fireAt
      if (elapsed > s.duration) continue
      active.push({ s, elapsed })
      if (active.length >= MAX_SIGNALS * 2) break
    }
    if (active.length > MAX_SIGNALS) {
      active.sort((a, b) => a.elapsed - b.elapsed)
      active.length = MAX_SIGNALS
    }
    if (active.length === 0) return

    ctx.strokeStyle = 'rgba(110, 231, 183, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i < active.length; i++) {
      const { s } = active[i]
      const from = this.nodes[s.layerIdx][s.fromIdx]
      const to = this.nodes[s.layerIdx + 1][s.toIdx]
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
    }
    ctx.stroke()

    ctx.fillStyle = '#6ee7b7'
    for (let i = 0; i < active.length; i++) {
      const { s, elapsed } = active[i]
      const t = elapsed / s.duration
      const eased = t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) * (2 - 2 * t) * 0.5
      const from = this.nodes[s.layerIdx][s.fromIdx]
      const to = this.nodes[s.layerIdx + 1][s.toIdx]
      const x = from.x + (to.x - from.x) * eased
      const y = from.y + (to.y - from.y) * eased
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  _drawActiveNodes(ctx, vNow) {
    const candidates = []
    for (const layer of this.nodes) {
      for (const node of layer) {
        const since = vNow - node.activatedAt
        if (since >= 0 && since < 600) {
          candidates.push({ node, since, activeAmt: 1 - since / 600 })
        }
      }
    }
    if (candidates.length === 0) return
    if (candidates.length > MAX_ACTIVE_NODES) {
      candidates.sort((a, b) => a.since - b.since)
      candidates.length = MAX_ACTIVE_NODES
    }

    for (let i = 0; i < candidates.length; i++) {
      const { node, activeAmt } = candidates[i]
      ctx.fillStyle = `rgba(110, 231, 183, ${0.14 * activeAmt})`
      ctx.beginPath()
      ctx.arc(node.x, node.y, 16, 0, Math.PI * 2)
      ctx.fill()
    }

    for (let i = 0; i < candidates.length; i++) {
      const { node, activeAmt } = candidates[i]
      const r = 15 + (110 - 15) * activeAmt
      const g = 17 + (231 - 17) * activeAmt
      const b = 23 + (183 - 23) * activeAmt
      const fa = 0.9 - 0.5 * activeAmt
      ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${fa})`
      ctx.strokeStyle = `rgba(110, 231, 183, ${0.55 + 0.4 * activeAmt})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
  }

  _drawWinnerNode(ctx, vNow) {
    if (!this.pass) return
    if (vNow < this.pass.outputAppearAt || vNow > this.pass.endAt + 400) return
    const last = this.nodes[this.nodes.length - 1]
    for (let i = 0; i < last.length; i++) {
      const node = last[i]
      if (!node.isWinner) continue
      ctx.fillStyle = 'rgba(110, 231, 183, 0.16)'
      ctx.beginPath()
      ctx.arc(node.x, node.y, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 14
      ctx.shadowColor = 'rgba(110, 231, 183, 0.7)'
      ctx.fillStyle = 'rgba(110, 231, 183, 0.22)'
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.95)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0
      return
    }
  }

  _drawOutputLabels(ctx, vNow) {
    if (!this.pass) return
    const start = this.pass.outputAppearAt
    const end = this.pass.endAt
    if (vNow < start || vNow > end + 400) return
    let alpha
    if (vNow < start + 300) alpha = (vNow - start) / 300
    else if (vNow < end - 400) alpha = 1
    else alpha = Math.max(0, (end - vNow) / 400 + 1)
    if (alpha <= 0) return
    const lastLayer = this.nodes[this.nodes.length - 1]
    ctx.font = HUD_FONT
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < lastLayer.length; i++) {
      const node = lastLayer[i]
      ctx.fillStyle = node.isWinner
        ? `rgba(110, 231, 183, ${0.7 * alpha})`
        : `rgba(100, 116, 139, ${0.4 * alpha})`
      ctx.fillText(OUTPUT_LABELS[i] || '', node.x + 16, node.y)
    }
  }

  _drawHUDDynamic(ctx, vNow) {
    ctx.font = HUD_FONT
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'

    let precAlpha = 0.5
    if (this.precFlicker) {
      const t = vNow - this.precFlicker.start
      if (t < 300) {
        const phase = Math.floor((t / 300) * 6)
        precAlpha = phase % 2 === 0 ? 0.5 : 0.12
      }
    }
    ctx.fillStyle = `rgba(100, 116, 139, ${precAlpha})`
    ctx.fillText(`PREC   ${PREC_OPTIONS[this.precIdx]}`, 14, 38)

    ctx.fillStyle = 'rgba(100, 116, 139, 0.45)'
    const blY = this.height - 30
    ctx.fillText(`PASS  #${String(this.passNumber).padStart(4, '0')}`, 14, blY)
    const totalFired = this.pass ? this.pass.totalFired : 0
    const totalNodes = LAYER_SIZES.reduce((a, b) => a + b, 0)
    ctx.fillText(`FIRED ${totalFired}/${totalNodes}`, 14, blY + 12)

    ctx.fillStyle = 'rgba(110, 231, 183, 0.42)'
    ctx.textAlign = 'right'
    const fps = (1000 / this.ms).toFixed(1)
    const ms = this.ms.toFixed(1)
    ctx.fillText(`${ms}ms  \u25C6 ${fps} FPS`, this.width - 14, this.height - 18)
    ctx.textAlign = 'left'
  }

  _drawTooltip(ctx) {
    if (!this.hoveredNode) return
    const node = this.hoveredNode
    const layerLbl = `${LAYER_LABELS[node.layerIdx]}_${node.layerIdx}`
    const lines = [
      `Layer: ${layerLbl}`,
      `Unit:  #${node.nodeIdx}`,
      `Act:   ${node.activation.toFixed(3)}`,
    ]
    ctx.font = HUD_FONT
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    const padding = 7
    const lineH = 12
    let maxW = 0
    for (let i = 0; i < lines.length; i++) {
      const w = ctx.measureText(lines[i]).width
      if (w > maxW) maxW = w
    }
    const boxW = maxW + padding * 2
    const boxH = lines.length * lineH + padding * 2
    let x = node.x + 18
    let y = node.y - boxH / 2
    if (x + boxW > this.width - 4) x = node.x - boxW - 18
    if (y < 4) y = 4
    if (y + boxH > this.height - 4) y = this.height - boxH - 4
    ctx.fillStyle = 'rgba(10, 12, 16, 0.94)'
    ctx.fillRect(x, y, boxW, boxH)
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.6)'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, boxW - 1, boxH - 1)
    ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x + padding, y + padding + i * lineH)
    }
  }

  _drawClickFlash(ctx, vNow) {
    if (!this.flashStart) return
    const t = vNow - this.flashStart
    if (t > 200) {
      this.flashStart = 0
      return
    }
    const a = (1 - t / 200) * 0.02
    ctx.fillStyle = `rgba(110, 231, 183, ${a})`
    ctx.fillRect(0, 0, this.width, this.height)
  }
}

export default function NeuralNetViz() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const scanlinesRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const viz = new NeuralNetVisualizer(
      canvasRef.current,
      containerRef.current,
      scanlinesRef.current,
    )
    viz.init()
    return () => viz.destroy()
  }, [])

  return (
    <div ref={containerRef} className="hero-viz" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-viz-canvas" />
      <div ref={scanlinesRef} className="hero-viz-scanlines" />
    </div>
  )
}
