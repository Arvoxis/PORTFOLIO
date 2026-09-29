// Cyanotype "plates": one inline SVG illustration per project.
// Classes: .d = drafted in with a dash-draw (pathLength=1), .f = fades in, .det = red detection that pops in last.

const D = { pathLength: 1, className: 'd' }

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

function Hawki() {
  return (
    <>
      <defs>
        <pattern id="hatch-h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className="dim" />
        </pattern>
      </defs>
      {/* dimension line over the deck */}
      <g className="f">
        <line x1="40" y1="118" x2="600" y2="118" className="dim" />
        <line x1="40" y1="110" x2="40" y2="126" className="dim" />
        <line x1="600" y1="110" x2="600" y2="126" className="dim" />
        <text x="320" y="110" className="lbl" textAnchor="middle">SPAN 48.0 M</text>
      </g>
      <rect x="40" y="140" width="560" height="26" {...D} />
      <line x1="40" y1="178" x2="600" y2="178" {...D} />
      <rect x="130" y="166" width="80" height="14" {...D} />
      <rect x="430" y="166" width="80" height="14" {...D} />
      <rect x="145" y="180" width="50" height="160" fill="url(#hatch-h)" {...D} />
      <rect x="445" y="180" width="50" height="160" fill="url(#hatch-h)" {...D} />
      <line x1="20" y1="340" x2="620" y2="340" {...D} />
      {/* the defects */}
      <path d="M462 196 L467 214 L461 232 L469 250 L464 268 L468 282" {...D} className="d crack" />
      <path d="M156 286 q12 -9 24 -1 q9 11 -3 19 q-16 7 -21 -18 z" {...D} className="d crack" />
      {/* drone and its camera footprint */}
      <g className="f">
        <line x1="534" y1="72" x2="452" y2="192" className="dash" />
        <line x1="534" y1="72" x2="486" y2="292" className="dash" />
      </g>
      <rect x="516" y="56" width="36" height="10" {...D} />
      <line x1="506" y1="58" x2="562" y2="58" {...D} />
      <ellipse cx="500" cy="54" rx="16" ry="3" {...D} />
      <ellipse cx="568" cy="54" rx="16" ry="3" {...D} />
      <circle cx="534" cy="70" r="4" {...D} />
      <text x="632" y="84" className="lbl f" textAnchor="end">12.97N 79.16E</text>
      <Box x="450" y="190" w="32" h="98" label="crack 0.81" />
      <Box x="150" y="276" w="42" h="36" label="spalling 36% · 2486 cm²" />
      {/* pipeline strip */}
      <g className="f">
        {['edge · yolo', 'sam 2', 'postgis', 'report'].map((s, i) => (
          <g key={s}>
            <rect x={40 + i * 150} y="362" width="110" height="24" className="dim" />
            <text x={95 + i * 150} y="378" className="lbl" textAnchor="middle">{s}</text>
            {i < 3 && <line x1={150 + i * 150} y1="374" x2={190 + i * 150} y2="374" className="dim" />}
          </g>
        ))}
      </g>
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

function Khoj() {
  const links = []
  NODES.forEach((a, i) => NODES.slice(i + 1).forEach((b) => links.push([a, b])))
  return (
    <>
      <defs>
        <pattern id="grid-k" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0 H0 V32" fill="none" className="faint" />
        </pattern>
        <pattern id="hatch-k" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="7" className="dim" />
        </pattern>
      </defs>
      <rect x="24" y="24" width="592" height="352" fill="url(#grid-k)" className="f" />
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
          <path d={`M${x} ${y - 9} L${x + 9} ${y} L${x} ${y + 9} L${x - 9} ${y} Z`} {...D} />
          <text x={x + 14} y={y - 10} className="lbl f">A{i + 1}</text>
        </g>
      ))}
      {/* lost agent */}
      <g className="f">
        <path d="M48 170 l12 12 M60 170 l-12 12" className="dim" />
        <text x="68" y="181" className="lbl">A6 lost · re-auctioned</text>
      </g>
      <text x="138" y="140" className="lbl f">bid 0.42</text>
      {/* two-agent confirmation */}
      <g className="det">
        <line x1="470" y1="130" x2="456" y2="222" className="r" />
        <line x1="520" y1="300" x2="456" y2="222" className="r" />
        <circle cx="456" cy="222" r="16" className="r" />
        <path d="M450 222 h12 M456 216 v12" className="r" />
      </g>
      <Label x={476} y={214}>
        confirmed · 2 agents
      </Label>
    </>
  )
}

const GRAPH = [
  [330, 120], [420, 80], [500, 140], [400, 190], [300, 230],
  [470, 250], [560, 210], [360, 310], [530, 330],
]
const EDGES = [
  [0, 1], [1, 2], [0, 3], [3, 2], [3, 4], [3, 5], [2, 6], [5, 6], [4, 7], [5, 7], [5, 8],
]

function Research() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={40 + i * 12} y={110 + i * 14} width="110" height="140" {...D} className="d paper" />
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <line
              key={l}
              x1={56 + i * 12}
              y1={140 + i * 14 + l * 16}
              x2={(l === 5 ? 110 : 134) + i * 12}
              y2={140 + i * 14 + l * 16}
              className="dim f"
            />
          ))}
        </g>
      ))}
      <text x="40" y="96" className="lbl f">arXiv · 3 papers</text>
      <g className="f">
        <line x1="190" y1="200" x2="270" y2="200" className="dim" />
        <path d="M262 194 L272 200 L262 206" className="dim" />
        <text x="230" y="186" className="lbl" textAnchor="middle">MiniLM · FAISS</text>
      </g>
      {EDGES.map(([a, b], i) => (
        <line key={i} x1={GRAPH[a][0]} y1={GRAPH[a][1]} x2={GRAPH[b][0]} y2={GRAPH[b][1]} {...D} />
      ))}
      {GRAPH.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 3 || i === 5 ? 11 : 7} {...D} className="d node" />
      ))}
      <g className="det">
        <line x1="300" y1="230" x2="360" y2="310" className="r dash" />
      </g>
      <Label x={228} y={290}>
        contradicts · NLI 0.91
      </Label>
      <g className="det">
        <circle cx="590" cy="90" r="18" className="r dash" />
      </g>
      <Label x={560} y={62}>
        gap
      </Label>
    </>
  )
}

const RUNS = [
  ['run_01', 40, 186],
  ['run_02', 190, 106],
  ['run_03', 190, 266],
  ['run_04', 340, 60],
  ['run_05', 340, 150],
  ['run_07', 490, 150],
  ['run_06', 490, 290],
]

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
          <text x={x + 45} y={y + 18} className="lbl f" textAnchor="middle">{name}</text>
        </g>
      ))}
      {/* graveyard and revival */}
      <g className="f">
        <path d={`M280 280 C300 300 300 320 322 330`} className="dash dim" />
        <path d="M330 360 v-26 a16 16 0 0 1 32 0 v26 z" className="dim" />
        <path d="M346 338 v12 M340 343 h12" className="dim" />
        <text x="346" y="382" className="lbl" textAnchor="middle">graveyard</text>
      </g>
      <g className="det">
        <path d="M366 336 C420 330 440 310 488 305" className="r dash" />
        <path d="M478 298 L490 304 L479 312" className="r" />
      </g>
      <Label x={392} y={344}>
        revived
      </Label>
      <g className="det">
        <rect x="484" y="144" width="102" height="40" className="r" />
      </g>
      <Label x={484} y={140}>
        best · acc 0.94
      </Label>
      <text x="40" y="360" className="lbl f">lineage: WITH RECURSIVE ...</text>
    </>
  )
}

function Kisan() {
  return (
    <>
      <rect x="240" y="24" width="170" height="352" rx="24" {...D} />
      <rect x="252" y="56" width="146" height="290" rx="6" {...D} className="d dim" />
      <line x1="304" y1="40" x2="346" y2="40" {...D} />
      {/* leaf */}
      <path d="M325 318 C250 270 262 150 325 88 C388 150 400 270 325 318 Z" {...D} />
      <path d="M325 318 V92" {...D} />
      {[130, 170, 210, 250].map((y, i) => (
        <g key={y}>
          <path d={`M325 ${y + 24} Q${300 - i * 2} ${y + 10} ${290 - i * 2} ${y - 6}`} {...D} />
          <path d={`M325 ${y + 24} Q${350 + i * 2} ${y + 10} ${360 + i * 2} ${y - 6}`} {...D} />
        </g>
      ))}
      <g className="f">
        <circle cx="352" cy="214" r="5" className="spot" />
        <circle cx="362" cy="228" r="3.5" className="spot" />
        <circle cx="344" cy="232" r="3" className="spot" />
      </g>
      <Box x="334" y="200" w="40" h="42" label="early blight 0.93" />
      {/* on-device model chip */}
      <g className="f">
        <rect x="448" y="78" width="32" height="32" className="dim" />
        <rect x="456" y="86" width="16" height="16" className="dim" />
        <path d="M454 78 v-6 M464 78 v-6 M474 78 v-6 M454 110 v6 M464 110 v6 M474 110 v6 M448 88 h-6 M448 100 h-6 M480 88 h6 M480 100 h6" className="dim" />
        <text x="440" y="136" className="lbl">on-device</text>
        <text x="440" y="152" className="lbl">TFLite</text>
      </g>
      {/* crop risk gauge */}
      <path d="M60 300 A80 80 0 0 1 220 300" {...D} />
      <g className="f">
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.PI - (i / 4) * Math.PI
          return (
            <line key={i} x1={140 + Math.cos(a) * 72} y1={300 - Math.sin(a) * 72} x2={140 + Math.cos(a) * 80} y2={300 - Math.sin(a) * 80} className="dim" />
          )
        })}
        <line x1="140" y1="300" x2={140 + Math.cos(Math.PI * 0.66) * 64} y2={300 - Math.sin(Math.PI * 0.66) * 64} className="r" />
        <text x="140" y="330" className="lbl" textAnchor="middle">crop risk 34 / 100</text>
      </g>
    </>
  )
}

// open, high, low, close, on a 0-100 scale
const CANDLES = [
  [40, 46, 36, 44], [44, 48, 40, 41], [41, 45, 37, 43], [43, 50, 42, 48], [48, 52, 44, 46],
  [46, 49, 41, 42], [42, 47, 40, 46], [46, 53, 45, 51], [51, 54, 47, 49], [49, 52, 43, 45],
  [45, 50, 44, 49], [49, 55, 48, 53], [53, 57, 50, 52], [52, 56, 49, 55], [55, 84, 54, 80],
  [80, 86, 72, 76],
]

function Stock() {
  const y = (v) => 350 - v * 3.2
  const x = (i) => 70 + i * 32
  let ema = CANDLES[0][3]
  const emaPts = CANDLES.map((c, i) => {
    ema = ema + (c[3] - ema) * 0.35
    return `${x(i)},${y(ema).toFixed(1)}`
  })
  return (
    <>
      <line x1="40" y1="30" x2="40" y2="350" {...D} />
      <line x1="40" y1="350" x2="600" y2="350" {...D} />
      <g className="f">
        {[20, 40, 60, 80].map((v) => (
          <line key={v} x1="40" y1={y(v)} x2="600" y2={y(v)} className="faint" />
        ))}
      </g>
      {CANDLES.map(([o, h, l, c], i) => (
        <g key={i}>
          <line x1={x(i)} y1={y(h)} x2={x(i)} y2={y(l)} {...D} />
          <rect x={x(i) - 8} y={y(Math.max(o, c))} width="16" height={Math.max(2, Math.abs(o - c) * 3.2)} {...D} className={c < o ? 'd fill' : 'd'} />
        </g>
      ))}
      <polyline points={emaPts.join(' ')} className="dash dim f" />
      <text x="530" y={y(58)} className="lbl f">EMA 12</text>
      <g className="det">
        <rect x={x(14) - 16} y={y(88)} width="32" height={y(52) - y(88)} className="r" />
        <line x1={x(14) - 16} y1={y(80)} x2="300" y2="70" className="r" />
      </g>
      <Label x={120} y={70}>
        why is it moving? · +45%
      </Label>
      <text x="124" y="90" className="lbl f">earnings beat, guidance raised</text>
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
