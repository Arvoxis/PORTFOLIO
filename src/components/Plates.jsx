// Cyanotype "plates": one inline SVG illustration per project, drawn in a 640 x 400 sheet.
// Classes: .d = main linework, .dim / .faint = secondary lines, .f = annotations, .det = red detections.
// The row reveals the whole plate with a wipe (see .plate-frame::after), so nothing here animates per path.

const D = { className: 'd' }

// red detection tag; width follows the text (mono, ~7px per character at 11.5px)
function Label({ x, y, children }) {
  const w = String(children).length * 7 + 12
  return (
    <g className="det">
      <rect x={x} y={y - 15} width={w} height={17} className="tag-bg" />
      <text x={x + 6} y={y - 3} className="tag">
        {children}
      </text>
    </g>
  )
}

function Box({ x, y, w, h, label }) {
  return (
    <g className="det">
      <rect x={x} y={y} width={w} height={h} className="r" />
      <Label x={x - 0.75} y={y}>
        {label}
      </Label>
    </g>
  )
}

// DWG-01 · Hawk-I: the drone films a bridge pier, YOLO boxes the crack, SAM 2 masks the spalling and measures
// it, and the session ends in an auto-written report.
function Hawki() {
  return (
    <>
      <defs>
        <pattern id="hatch-h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className="dim" />
        </pattern>
        <pattern id="hatch-r" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="7" className="r" />
        </pattern>
      </defs>

      {/* report the session ends in */}
      <g className="f">
        <path d="M40 34 H92 L106 48 V128 H40 Z M92 34 V48 H106" className="dim" />
        {[62, 74, 86, 98, 110].map((y, i) => (
          <line key={y} x1="50" y1={y} x2={i === 4 ? 78 : 96} y2={y} className="faint" />
        ))}
        <text x="40" y="146" className="lbl">auto report · Gemma-3</text>
        <path d="M300 64 C230 40 160 40 112 70" className="dash dim" />
      </g>

      {/* the drone, side view, and its camera cone onto the right pier */}
      <line x1="288" y1="60" x2="372" y2="60" {...D} />
      <rect x="312" y="60" width="36" height="14" rx="3" {...D} />
      <ellipse cx="288" cy="56" rx="22" ry="3.5" {...D} />
      <ellipse cx="372" cy="56" rx="22" ry="3.5" {...D} />
      <circle cx="330" cy="82" r="5" {...D} />
      <g className="f">
        <path d="M330 87 L450 214 M330 87 L484 214" className="dash dim" />
        <text x="384" y="88" className="lbl">12.97N 79.16E</text>
      </g>

      {/* span dimension */}
      <g className="f">
        <line x1="40" y1="176" x2="600" y2="176" className="dim" />
        <line x1="40" y1="168" x2="40" y2="184" className="dim" />
        <line x1="600" y1="168" x2="600" y2="184" className="dim" />
        <text x="220" y="170" className="lbl" textAnchor="middle">SPAN 48.0 M</text>
      </g>

      {/* bridge */}
      <rect x="40" y="190" width="560" height="22" {...D} />
      <rect x="130" y="212" width="80" height="12" {...D} />
      <rect x="430" y="212" width="80" height="12" {...D} />
      <rect x="145" y="224" width="50" height="136" fill="url(#hatch-h)" {...D} />
      <rect x="445" y="224" width="50" height="136" fill="url(#hatch-h)" {...D} />
      <line x1="20" y1="360" x2="620" y2="360" {...D} />
      <path d={Array.from({ length: 38 }, (_, i) => `M${24 + i * 16} 360 l-8 10`).join(' ')} className="faint" />

      {/* YOLO: the crack on the right pier */}
      <path d="M462 236 L467 254 L461 272 L469 290 L464 308 L468 326" {...D} className="d crack" />
      <Box x="450" y="232" w="32" h="100" label="crack 0.81" />

      {/* SAM 2: the spalling on the left pier, masked and measured */}
      <g className="det">
        <path d="M150 292 l16 -12 l20 5 l8 15 l-4 18 l-18 9 l-17 -6 l-7 -15 z" fill="url(#hatch-r)" className="r" />
      </g>
      <Label x={200} y={296}>
        SAM 2 · 2486 cm²
      </Label>
    </>
  )
}

const NODES = [
  [130, 110],
  [300, 84],
  [470, 130],
  [210, 285],
  [520, 300],
]

// a quad-rotor seen from above: four rotors on an X
function Quad({ x, y }) {
  return (
    <g>
      <path d={`M${x - 8} ${y - 8} L${x + 8} ${y + 8} M${x + 8} ${y - 8} L${x - 8} ${y + 8}`} {...D} />
      {[
        [-8, -8],
        [8, -8],
        [-8, 8],
        [8, 8],
      ].map(([dx, dy]) => (
        <circle key={`${dx}${dy}`} cx={x + dx} cy={y + dy} r="4.5" {...D} />
      ))}
    </g>
  )
}

// belief around the survivor: log-odds fused from two drones, darkest where they agree
const HEAT = [
  [440, 216, 0.34],
  [408, 216, 0.14],
  [472, 216, 0.16],
  [440, 184, 0.12],
  [440, 248, 0.14],
  [408, 248, 0.06],
  [472, 184, 0.06],
]

// DWG-02 · KHOJ: a collapsed floor in plan, five leaderless drones auctioning cells over a mesh, and a survivor
// confirmed only when two of them agree.
function Khoj() {
  const links = []
  NODES.forEach((a, i) => NODES.slice(i + 1).forEach((b) => links.push([a, b])))
  return (
    <>
      <defs>
        <pattern id="grid-k" width="32" height="32" patternUnits="userSpaceOnUse" x="24" y="24">
          <path d="M32 0 H0 V32" fill="none" className="faint" />
        </pattern>
        <pattern id="hatch-k" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="7" className="dim" />
        </pattern>
      </defs>
      <rect x="24" y="24" width="592" height="352" fill="url(#grid-k)" className="f" />
      {HEAT.map(([x, y, o]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="32" height="32" className="heat f" fillOpacity={o} />
      ))}
      <rect x="24" y="24" width="592" height="352" {...D} />
      <path d="M24 200 H200 M260 200 H400 M400 24 V150 M400 210 V376" {...D} />
      {/* rubble */}
      <path d="M60 330 l40 -30 l50 12 l-8 40 z" fill="url(#hatch-k)" {...D} />
      <path d="M330 300 l46 -18 l20 38 l-50 18 z" fill="url(#hatch-k)" {...D} />
      <path d="M430 60 l60 -8 l10 36 l-56 10 z" fill="url(#hatch-k)" {...D} />
      <g className="f">
        {links.map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="dash faint" />
        ))}
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="54" className="dash dim" />
        ))}
      </g>
      {NODES.map(([x, y], i) => (
        <g key={i}>
          <Quad x={x} y={y} />
          <text x={x + 16} y={y - 12} className="lbl f">
            A{i + 1}
          </text>
        </g>
      ))}
      {/* lost agent and the auction that covers for it */}
      <g className="f">
        <path d="M48 170 l12 12 M60 170 l-12 12" className="dim" />
        <text x="68" y="181" className="lbl">A6 lost · re-auctioned</text>
        <text x="36" y="46" className="lbl">bid 0.42 · cell C4</text>
      </g>
      {/* two-agent confirmation */}
      <g className="det">
        <line x1="470" y1="130" x2="456" y2="232" className="r" />
        <line x1="520" y1="300" x2="456" y2="232" className="r" />
        <circle cx="456" cy="232" r="14" className="r" />
        <path d="M450 232 h12 M456 226 v12" className="r" />
      </g>
      <Label x={484} y={226}>
        confirmed · 2 agents
      </Label>
    </>
  )
}

// A tomato leaf drawn as a botanical specimen. The blighted leaflet is boxed, cropped to the model's
// 224 x 224 input, and classified by MobileNetV2 into its top-3 of the 38 disease classes.
const RACHIS = [
  [70, 372],
  [140, 210],
  [330, 70],
]
function onRachis(t) {
  const [a, b, c] = RACHIS
  const u = 1 - t
  const x = u * u * a[0] + 2 * u * t * b[0] + t * t * c[0]
  const y = u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]
  const dx = 2 * u * (b[0] - a[0]) + 2 * t * (c[0] - b[0])
  const dy = 2 * u * (b[1] - a[1]) + 2 * t * (c[1] - b[1])
  return [x, y, (Math.atan2(dy, dx) * 180) / Math.PI]
}

// one leaflet along +x from its stalk: serrated-looking almond outline, midrib, paired veins
function Leaflet({ x, y, a, len, w }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d={`M0 0 Q${len * 0.35} ${-w * 1.05} ${len * 0.7} ${-w * 0.6} Q${len * 0.9} ${-w * 0.3} ${len} 0 Q${len * 0.9} ${w * 0.3} ${len * 0.7} ${w * 0.6} Q${len * 0.35} ${w * 1.05} 0 0 Z`} {...D} />
      <path d={`M0 0 L${len * 0.94} 0`} className="dim" />
      {[0.2, 0.38, 0.56, 0.74].map((k) => (
        <path
          key={k}
          d={`M${len * k} 0 Q${len * (k + 0.06)} ${-w * 0.3} ${len * (k + 0.16)} ${-w * 0.62} M${len * k} 0 Q${len * (k + 0.06)} ${w * 0.3} ${len * (k + 0.16)} ${w * 0.62}`}
          className="dim f"
        />
      ))}
    </g>
  )
}

const TOP3 = [
  ['early blight', 1],
  ['late blight', 0.08],
  ['healthy', 0.04],
]

// DWG-03 · KisanSathi
function Kisan() {
  const leaflets = []
  ;[0.26, 0.5, 0.72].forEach((t) => {
    const [x, y, a] = onRachis(t)
    const len = 118 - t * 44
    const w = 27 - t * 7
    leaflets.push({ x, y, a: a - 58, len, w }, { x, y, a: a + 58, len, w })
  })
  const [tx, ty, ta] = onRachis(1)
  leaflets.push({ x: tx, y: ty, a: ta, len: 78, w: 22 })

  // the blighted leaflet: middle pair, lower side
  const sick = leaflets[3]
  const r = (sick.a * Math.PI) / 180
  const cx = sick.x + Math.cos(r) * sick.len * 0.52
  const cy = sick.y + Math.sin(r) * sick.len * 0.52

  return (
    <>
      <path d={`M${RACHIS[0][0]} ${RACHIS[0][1]} Q${RACHIS[1][0]} ${RACHIS[1][1]} ${RACHIS[2][0]} ${RACHIS[2][1]}`} {...D} />
      {leaflets.map((l, i) => (
        <Leaflet key={i} {...l} />
      ))}
      <g className="f">
        <circle cx={cx - 7} cy={cy - 3} r="5" className="spot" />
        <circle cx={cx + 8} cy={cy + 4} r="3.5" className="spot" />
        <circle cx={cx + 1} cy={cy + 10} r="2.5" className="spot" />
        <text x="118" y="390" className="lbl">Solanum lycopersicum · leaf specimen</text>
      </g>
      <Box x={cx - 30} y={cy - 24} w="60" h="46" label="early blight 0.93" />

      {/* crop -> model -> top-3 */}
      <g className="f">
        <path d={`M${cx + 30} ${cy - 24} L420 56`} className="dash dim" />
        <path d={`M${cx + 30} ${cy + 22} L420 136`} className="dash dim" />
        <rect x="420" y="56" width="80" height="80" className="dim" />
        <path d="M434 118 Q452 74 484 76 Q476 112 434 118 Z" className="dim" />
        <circle cx="462" cy="98" r="4.5" className="spot" />
        <circle cx="472" cy="90" r="3" className="spot" />
        <text x="420" y="154" className="lbl">224 × 224</text>
        <path d="M504 96 H522 M516 91 L522 96 L516 101" className="dim" />
      </g>
      <rect x="526" y="70" width="96" height="54" {...D} />
      <text x="574" y="94" className="lbl f" textAnchor="middle">MobileNetV2</text>
      <text x="574" y="111" className="lbl f" textAnchor="middle">TFLite</text>

      <text x="420" y="204" className="lbl f">top-3 of 38 classes</text>
      <line x1="420" y1="212" x2="622" y2="212" className="dim" />
      {TOP3.map(([name, v], i) => (
        <g key={name} className={i ? 'f' : 'det'}>
          <text x="420" y={240 + i * 38} className="lbl">
            {name}
          </text>
          <rect x="420" y={247 + i * 38} width={Math.max(4, 200 * v)} height="7" className={i ? 'spot' : 'tag-bg'} />
        </g>
      ))}
      <text x="622" y="240" className="lbl f" textAnchor="end">
        0.93
      </text>
    </>
  )
}

const GRAPH = [
  [330, 120], [420, 80], [500, 140], [400, 190], [300, 240],
  [470, 250], [560, 200], [370, 320], [520, 330],
]
const EDGES = [
  [0, 1], [1, 2], [0, 3], [3, 2], [3, 4], [3, 5], [2, 6], [5, 6], [4, 7], [5, 7], [5, 8],
]

// DWG-04 · Research engine: a sentence lifted from a paper becomes a claim node; NLI flags two claims that
// contradict, and the graph shows where nothing links two clusters.
function Research() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={40 + i * 12} y={110 + i * 14} width="116" height="150" {...D} className="d paper" />
          {[0, 1, 2, 3, 4, 5, 6].map((l) => (
            <line
              key={l}
              x1={54 + i * 12}
              y1={138 + i * 14 + l * 16}
              x2={(l === 6 ? 110 : 140) + i * 12}
              y2={138 + i * 14 + l * 16}
              className="dim f"
            />
          ))}
        </g>
      ))}
      <text x="40" y="96" className="lbl f">arXiv · 3 papers</text>
      {/* the extracted claim, underlined in the front paper and carried to its node */}
      <g className="det">
        <line x1="78" y1="198" x2="164" y2="198" className="r" />
      </g>
      <g className="f">
        <path d="M164 198 C220 198 240 236 290 240" className="dash dim" />
        <text x="192" y="272" className="lbl">spaCy claim</text>
        <text x="226" y="108" className="lbl" textAnchor="middle">MiniLM · FAISS</text>
        <path d="M194 120 H256 M250 115 L256 120 L250 125" className="dim" />
      </g>

      {EDGES.map(([a, b], i) => (
        <line key={i} x1={GRAPH[a][0]} y1={GRAPH[a][1]} x2={GRAPH[b][0]} y2={GRAPH[b][1]} {...D} />
      ))}
      {GRAPH.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 3 || i === 5 ? 11 : 7} {...D} className="d node" />
      ))}

      {/* contradiction between two claims */}
      <g className="det">
        <line x1="300" y1="240" x2="370" y2="320" className="r dash" />
      </g>
      <Label x={226} y={346}>
        contradicts · NLI 0.91
      </Label>

      {/* gap: two clusters no paper connects */}
      <g className="f">
        <path d="M560 200 L604 268 M520 330 L604 268" className="dash dim" />
      </g>
      <g className="det">
        <circle cx="604" cy="268" r="14" className="r dash" />
      </g>
      <Label x={560} y={300}>
        gap
      </Label>
    </>
  )
}

const RUNS = [
  ['run_01', 40, 176],
  ['run_02', 190, 106],
  ['run_03', 190, 246],
  ['run_04', 340, 60],
  ['run_05', 340, 150],
  ['run_07', 490, 150],
  ['run_06', 490, 262],
]

// DWG-05 · ML Experiment Tracker: run lineage from a recursive CTE, a trigger that flags a regression, a failed
// run revived from the graveyard, and a plain-English question turned into SQL.
function Tracker() {
  const c = (i) => [RUNS[i][1] + 45, RUNS[i][2] + 14]
  const link = (a, b) => {
    const [x1, y1] = c(a)
    const [x2, y2] = c(b)
    return `M${x1 + 45} ${y1} C${x1 + 90} ${y1} ${x2 - 90} ${y2} ${x2 - 45} ${y2}`
  }
  return (
    <>
      {[[0, 1], [0, 2], [1, 3], [1, 4], [4, 5]].map(([a, b]) => (
        <path key={`${a}${b}`} d={link(a, b)} {...D} />
      ))}
      {RUNS.map(([name, x, y]) => (
        <g key={name}>
          <rect x={x} y={y} width="90" height="28" {...D} />
          <text x={x + 45} y={y + 18} className="lbl f" textAnchor="middle">
            {name}
          </text>
        </g>
      ))}
      <text x="40" y="46" className="lbl f">lineage: WITH RECURSIVE runs AS (…)</text>

      {/* trigger on a regression */}
      <g className="det">
        <rect x="336" y="56" width="98" height="36" className="r" />
      </g>
      <Label x={440} y={74}>
        trigger · acc ↓
      </Label>

      {/* graveyard and revival */}
      <g className="f">
        <path d="M280 274 C300 294 300 314 322 324" className="dash dim" />
        <path d="M330 354 v-26 a16 16 0 0 1 32 0 v26 z" className="dim" />
        <path d="M346 332 v12 M340 337 h12" className="dim" />
        <text x="346" y="374" className="lbl" textAnchor="middle">graveyard</text>
      </g>
      <g className="det">
        <path d="M366 330 C420 324 440 300 488 280" className="r dash" />
        <path d="M478 273 L490 279 L480 287" className="r" />
      </g>
      <Label x={400} y={318}>
        revived
      </Label>
      <g className="det">
        <rect x="484" y="144" width="102" height="40" className="r" />
      </g>
      <Label x={484} y={140}>
        best · acc 0.94
      </Label>

      {/* plain English in, read-only SQL out */}
      <g className="f">
        <rect x="40" y="318" width="236" height="50" className="dim" />
        <text x="52" y="338" className="lbl">“best run this week?”</text>
        <text x="52" y="356" className="lbl">→ SELECT … ORDER BY acc DESC</text>
      </g>
    </>
  )
}

// open, high, low, close
const CANDLES = [
  [40, 46, 36, 44], [44, 48, 40, 41], [41, 45, 37, 43], [43, 50, 42, 48], [48, 52, 44, 46],
  [46, 49, 41, 42], [42, 47, 40, 46], [46, 53, 45, 51], [51, 54, 47, 49], [49, 52, 43, 45],
  [45, 50, 44, 49], [49, 55, 48, 53], [53, 57, 50, 52], [52, 56, 49, 55], [55, 84, 54, 80],
  [80, 86, 72, 76],
]

// DWG-06 · StockSense: candles with an EMA inside Bollinger bands, the "why is it moving?" call-out on the
// jump, and RSI underneath.
function Stock() {
  const x = (i) => 84 + i * 32
  const y = (v) => 250 - (v - 30) * 3.4
  const closes = CANDLES.map((c) => c[3])

  // EMA and a band of two rolling deviations around it
  let ema = closes[0]
  const mid = []
  const dev = []
  closes.forEach((c, i) => {
    ema = ema + (c - ema) * 0.35
    mid.push(ema)
    const win = closes.slice(Math.max(0, i - 4), i + 1)
    const mean = win.reduce((s, v) => s + v, 0) / win.length
    dev.push(Math.sqrt(win.reduce((s, v) => s + (v - mean) ** 2, 0) / win.length) * 2 + 2)
  })
  const upper = mid.map((m, i) => `${x(i)},${y(m + dev[i]).toFixed(1)}`)
  const lower = mid.map((m, i) => `${x(i)},${y(m - dev[i]).toFixed(1)}`).reverse()

  // RSI over 4 closes, drawn in its own panel (0-100 -> 370-290)
  const rsi = closes.map((_, i) => {
    let up = 0
    let down = 0
    for (let k = Math.max(1, i - 3); k <= i; k++) {
      const d = closes[k] - closes[k - 1]
      if (d > 0) up += d
      else down -= d
    }
    const v = up + down === 0 ? 50 : (100 * up) / (up + down)
    return `${x(i)},${(370 - v * 0.8).toFixed(1)}`
  })

  return (
    <>
      {/* price panel */}
      <line x1="56" y1="30" x2="56" y2="262" {...D} />
      <line x1="56" y1="262" x2="600" y2="262" {...D} />
      <g className="f">
        {[40, 55, 70, 85].map((v) => (
          <line key={v} x1="56" y1={y(v)} x2="600" y2={y(v)} className="faint" />
        ))}
        <polygon points={[...upper, ...lower].join(' ')} className="band" />
        <polyline points={upper.join(' ')} className="faint" />
        <polyline points={lower.reverse().join(' ')} className="faint" />
        <polyline points={mid.map((m, i) => `${x(i)},${y(m).toFixed(1)}`).join(' ')} className="dash dim" />
        <text x="420" y="250" className="lbl">EMA 12 · Bollinger bands</text>
      </g>
      {CANDLES.map(([o, h, l, c], i) => (
        <g key={i}>
          <line x1={x(i)} y1={y(h)} x2={x(i)} y2={y(l)} {...D} />
          <rect x={x(i) - 8} y={y(Math.max(o, c))} width="16" height={Math.max(2, Math.abs(o - c) * 3.4)} {...D} className={c < o ? 'd fill' : 'd'} />
        </g>
      ))}
      <g className="det">
        <rect x={x(14) - 16} y={y(88)} width="32" height={y(52) - y(88)} className="r" />
        <line x1={x(14) - 16} y1={y(80)} x2="330" y2="58" className="r" />
      </g>
      <Label x={80} y={58}>
        why is it moving? · +45%
      </Label>
      <text x="84" y="78" className="lbl f">earnings beat, guidance raised</text>

      {/* RSI panel */}
      <g className="f">
        <line x1="56" y1="290" x2="600" y2="290" className="faint" />
        <line x1="56" y1="370" x2="600" y2="370" className="dim" />
        <line x1="56" y1={370 - 70 * 0.8} x2="600" y2={370 - 70 * 0.8} className="dash faint" />
        <line x1="56" y1={370 - 30 * 0.8} x2="600" y2={370 - 30 * 0.8} className="dash faint" />
        <text x="60" y="286" className="lbl">RSI</text>
      </g>
      <polyline points={rsi.join(' ')} {...D} />
    </>
  )
}

const PLATES = { hawki: Hawki, khoj: Khoj, research: Research, tracker: Tracker, kisan: Kisan, stock: Stock }

// decorative: the row's heading and text already say what the plate shows
export default function Plate({ name }) {
  const Art = PLATES[name]
  return (
    <svg viewBox="0 0 640 400" className="plate" aria-hidden="true">
      <Art />
    </svg>
  )
}
