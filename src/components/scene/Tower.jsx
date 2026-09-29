import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { INK, RED, segs, ss, lerp, lineMat, pin } from './util'

const HB = 3.0 // lattice body height
const PEAK = 0.45 // earth-wire peak above the body
const ARM = 1.15 // cross-arm reach
const ARMS_Y = [HB * 0.7, HB * 0.9]
const hw = (y) => lerp(0.62, 0.2, y / HB) // tapering half-width

// Where the tower stands on screen. The drone reads this too, to hover over the tagged insulator.
export function towerPlace({ width: vw, height: vh, aspect }, mobile) {
  const narrow = aspect < 1.45
  const s = (vh * (mobile ? 0.6 : narrow ? 0.62 : 0.7)) / (HB + PEAK)
  return { x: vw * (mobile ? 0.2 : 0.3), y: -vh * 0.5 + 0.1, s }
}

// Lattice members as [x1,y1,z1,x2,y2,z2] pairs, emitted bottom-up so drafting grows from the ground.
function lattice() {
  const p = []
  const L = 8
  const corners = (y) => {
    const w = hw(y)
    return [[-w, y, -w], [w, y, -w], [w, y, w], [-w, y, w]]
  }
  for (let i = 0; i <= L; i++) {
    const c = corners((i / L) * HB)
    for (let k = 0; k < 4; k++) p.push([...c[k], ...c[(k + 1) % 4]])
    if (i === L) break
    const d = corners(((i + 1) / L) * HB)
    for (let k = 0; k < 4; k++) {
      const n = (k + 1) % 4
      p.push([...c[k], ...d[k]]) // leg
      p.push([...c[k], ...d[n]], [...c[n], ...d[k]]) // X brace
    }
  }
  corners(HB).forEach((c) => p.push([...c, 0, HB + PEAK, 0]))
  ARMS_Y.forEach((y) => {
    const w = hw(y)
    ;[-1, 1].forEach((side) => {
      ;[-w, w].forEach((z) => {
        p.push([side * w, y, z, side * ARM, y, z * 0.15]) // chord
        p.push([side * w, y - 0.3, z, side * ARM, y, z * 0.15]) // stay
      })
    })
  })
  return p
}

// insulator strings hang from each arm tip; TAG is the one the scan "detects" (upper arm, nearest the camera)
const INSULATORS = ARMS_Y.flatMap((y) => [-1, 1].map((side) => [side * ARM * 0.96, y]))
const TAG = 2
const DISCS = [0.1, 0.17, 0.24, 0.31]

// YOLO-style corner brackets around one insulator string
const BA = 0.13
const BB = 0.26
const BC = 0.07
function bracket() {
  const p = []
  ;[-1, 1].forEach((sx) =>
    [-1, 1].forEach((sy) => {
      p.push(sx * BA, sy * BB, 0, sx * (BA - BC), sy * BB, 0)
      p.push(sx * BA, sy * BB, 0, sx * BA, sy * (BB - BC), 0)
    })
  )
  return segs(p)
}

// strings, plus conductors that sag away through the tower on both sides
function wires() {
  const p = []
  INSULATORS.forEach(([x, y]) => {
    p.push(x, y, 0, x, y - 0.38, 0)
    for (let i = 0; i < 24; i++) {
      const z0 = -3.5 + (i / 24) * 7
      const z1 = -3.5 + ((i + 1) / 24) * 7
      p.push(x, y - 0.38 - 0.03 * z0 * z0, z0, x, y - 0.38 - 0.03 * z1 * z1, z1)
    }
  })
  return segs(p)
}

const SQUARE = segs([-1, 0, -1, 1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, -1])
const Y = new THREE.Vector3(0, 1, 0)

export default function Tower({ stage, callouts }) {
  const root = useRef()
  const beams = useRef()
  const discs = useRef()
  const scan = useRef()
  const brackets = useRef([])
  const hits = useRef(INSULATORS.map(() => 0))
  const card = useRef(null)

  const members = useMemo(lattice, [])
  const memberGeo = useMemo(() => segs(members.flat()), [members])
  const wireGeo = useMemo(wires, [])
  // drafted look to match the drone: dark graphite members under ink linework
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#26313d', roughness: 0.6, metalness: 0.2, transparent: true, opacity: 0 }),
    []
  )
  const ink = useMemo(() => lineMat(INK), [])
  const wireMat = useMemo(() => lineMat(INK), [])
  const ceramic = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ece6d9', roughness: 0.3, metalness: 0, transparent: true, opacity: 0 }),
    []
  )
  const scanFill = useMemo(
    () => new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
    []
  )
  const scanLine = useMemo(() => lineMat(RED), [])
  const bracketGeo = useMemo(bracket, [])
  const bracketMats = useMemo(() => INSULATORS.map(() => lineMat(RED)), [])

  // steel angle members: one unit box per member, stretched and rotated onto its segment
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    const q = new THREE.Quaternion()
    const sc = new THREE.Vector3()
    members.forEach((s, i) => {
      a.set(s[0], s[1], s[2])
      b.set(s[3], s[4], s[5])
      const len = a.distanceTo(b)
      q.setFromUnitVectors(Y, b.clone().sub(a).normalize())
      sc.set(0.026, len, 0.026)
      m.compose(a.clone().add(b).multiplyScalar(0.5), q, sc)
      beams.current.setMatrixAt(i, m)
    })
    beams.current.instanceMatrix.needsUpdate = true

    let k = 0
    INSULATORS.forEach(([x, y]) =>
      DISCS.forEach((d) => {
        m.makeTranslation(x, y - d, 0)
        discs.current.setMatrixAt(k++, m)
      })
    )
    discs.current.instanceMatrix.needsUpdate = true
  }, [members])

  // light up the matching figure in the Skylark card while the scan has the insulator boxed
  const lightCard = (on) => {
    card.current ??= document.querySelector('[data-scan]')
    if (card.current && card.current.classList.contains('hit') !== on) card.current.classList.toggle('hit', on)
  }

  useFrame((state, dt) => {
    const { s, mobile, off, reduce } = stage.current
    const t = reduce ? 0 : state.clock.elapsedTime
    const { aspect } = state.viewport

    const draft = ss(1.5, 2.0, s)
    const vis = ss(1.5, 1.7, s) * (1 - ss(2.55, 2.95, s))
    const dim = mobile ? 0.3 : aspect < 1.45 ? 0.75 : 1
    const r = root.current
    const tag = callouts.current[4]
    r.visible = vis * dim > 0.01 && !off
    if (!r.visible) {
      if (tag) tag.style.opacity = '0'
      lightCard(false)
      return
    }

    const n = Math.floor(members.length * draft)
    beams.current.count = n
    memberGeo.setDrawRange(0, n * 2)
    steel.opacity = vis * dim * 0.55
    ink.opacity = vis * dim * 0.85
    ceramic.opacity = ss(0.9, 1, draft) * vis * dim
    wireMat.opacity = ss(0.9, 1, draft) * vis * dim * 0.35

    const P = towerPlace(state.viewport, mobile)
    r.scale.setScalar(P.s)
    r.position.set(P.x, P.y, -0.5)
    r.rotation.y = 0.55 + Math.sin(t * 0.2) * 0.12

    // scan plane sweeps top to bottom every 4 s once the tower is drawn; reduced motion parks it
    // below the insulators so every box is simply on
    const phase = reduce ? 0.95 : (t * 0.25) % 1
    const scanY = (HB + PEAK) * (1 - phase)
    const w = hw(Math.min(scanY, HB)) + 0.22
    scan.current.position.y = scanY
    scan.current.scale.set(w, 1, w)
    const scanOn = reduce ? 0 : vis * dim * ss(0.95, 1, draft)
    scanFill.opacity = scanOn * 0.14
    scanLine.opacity = scanOn * 0.9

    const k = reduce ? 1 : 1 - Math.exp(-dt * 10)
    INSULATORS.forEach(([, y], i) => {
      const target = draft > 0.98 && scanY < y - 0.19 ? 1 : 0
      hits.current[i] += (target - hits.current[i]) * k
      const h = hits.current[i]
      const b = brackets.current[i]
      b.scale.setScalar(1 + (1 - h) * 0.5)
      b.rotation.y = -r.rotation.y // keep boxes facing the camera
      bracketMats[i].opacity = h * vis * dim
    })
    lightCard(hits.current[TAG] > 0.5 && vis > 0.5)

    r.updateMatrixWorld()
    // tag hangs below the box, clear of the drone above it and of the text to the left
    if (tag) {
      pin(tag, brackets.current[TAG], state, mobile ? 0 : hits.current[TAG] * vis, -BA * P.s * (state.size.width / state.viewport.width), 56)
    }
  })

  return (
    <group ref={root}>
      <instancedMesh ref={beams} args={[null, null, members.length]} material={steel}>
        <boxGeometry />
      </instancedMesh>
      <lineSegments geometry={memberGeo} material={ink} />
      <lineSegments geometry={wireGeo} material={wireMat} />
      <instancedMesh ref={discs} args={[null, null, INSULATORS.length * DISCS.length]} material={ceramic}>
        <cylinderGeometry args={[0.055, 0.055, 0.022, 20]} />
      </instancedMesh>
      {INSULATORS.map(([x, y], i) => (
        <lineSegments
          key={i}
          position={[x, y - 0.19, 0]}
          geometry={bracketGeo}
          material={bracketMats[i]}
          ref={(el) => {
            brackets.current[i] = el
          }}
        />
      ))}
      <group ref={scan}>
        <mesh rotation-x={-Math.PI / 2} material={scanFill}>
          <planeGeometry args={[2, 2]} />
        </mesh>
        <lineSegments geometry={SQUARE} material={scanLine} />
      </group>
    </group>
  )
}
