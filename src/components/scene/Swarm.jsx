import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { INK, RED, segs, ring, ss, lineMat } from './util'
import { useDrone, MM, hullMaterial } from './model'

// KHOJ in plan view: five leaderless drones on a mesh, auction packets hopping between them,
// and a survivor that only turns "confirmed" when two drones are close to it at once.
// It plays as the drone and tower fade out and the Drawings sheet head comes up, then clears before the project rows.
const N = 5
const PAIRS = []
for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) PAIRS.push([i, j])

// per-drone Lissajous paths
const PATHS = Array.from({ length: N }, (_, i) => ({
  a: 0.21 + i * 0.037,
  b: 0.17 + i * 0.029,
  p: i * 1.7,
  q: i * 2.3,
}))

const SURVIVOR = [0.35, -0.25] // in units of the swarm radius
const SENSE = 0.45 // sensing range, same units
const MINI = ['DJI_Avata2_Body_Main_2', 'DJI_Avata2_Body_Secondary_3', 'DJI_Avata2_Propeller_Rings_7', 'DJI_Avata2_Arms_Motors_1']

const pos = (p, t, out) => out.set(Math.sin(t * p.a + p.p) * 0.95, Math.sin(t * p.b + p.q) * 0.75, 0)
const Z = new THREE.Vector3(0, 0, 1)
const ahead = new THREE.Vector3()

export default function Swarm({ stage }) {
  const { parts, center } = useDrone()
  const root = useRef()
  const slots = useRef([])
  const bodies = useRef([])
  const packet = useRef()
  const confirm = useRef()
  const hop = useRef({ pair: 0, t: 0, on: 0 })

  const mini = useMemo(() => parts.filter((p) => MINI.includes(p.name)), [parts])
  // paper fill with an ink silhouette: reads as a crisp plan-view drawing, not a see-through solid
  const fill = useMemo(() => new THREE.MeshBasicMaterial({ color: '#0f2a4a', transparent: true, opacity: 0 }), [])
  const outline = useMemo(() => hullMaterial(INK, 6), [])
  const rangeGeo = useMemo(() => segs(ring(SENSE, 48)).rotateX(Math.PI / 2), [])
  const links = useMemo(() => {
    const g = segs(new Array(PAIRS.length * 6).fill(0))
    // dash distances are written by hand each frame instead of computeLineDistances(), which reallocates
    g.setAttribute('lineDistance', new THREE.Float32BufferAttribute(new Array(PAIRS.length * 2).fill(0), 1))
    const l = new THREE.LineSegments(g, new THREE.LineDashedMaterial({ color: INK, dashSize: 0.02, gapSize: 0.02, transparent: true, opacity: 0 }))
    l.frustumCulled = false
    return l
  }, [])
  const survivorGeo = useMemo(() => segs([-0.05, 0, 0, 0.05, 0, 0, 0, -0.05, 0, 0, 0.05, 0]), [])
  const confirmGeo = useMemo(() => segs(ring(0.12, 32)).rotateX(Math.PI / 2), [])
  const faint = useMemo(() => lineMat(INK), [])
  const red = useMemo(() => lineMat(RED), [])
  const dotMat = useMemo(
    () => new THREE.PointsMaterial({ color: INK, size: 5, sizeAttenuation: false, transparent: true, opacity: 0 }),
    []
  )
  const packetGeo = useMemo(() => segs([0, 0, 0]), [])
  const xy = useMemo(() => Array.from({ length: N }, () => new THREE.Vector3()), [])

  useFrame((state, dt) => {
    const { s, mobile, reduce } = stage.current
    const t = reduce ? 0 : state.clock.elapsedTime
    const { width: vw, height: vh } = state.viewport

    const vis = ss(2.7, 2.9, s) * (1 - ss(3.0, 3.15, s)) * (mobile ? 0 : 1)
    root.current.visible = vis > 0.01
    if (!root.current.visible) return

    fill.opacity = vis
    outline.opacity = vis * 0.8
    links.material.opacity = faint.opacity = vis * 0.3
    red.opacity = vis
    dotMat.opacity = vis * 0.8

    // right of the sheet title, clear of the text column on the left
    const R = Math.min(vw, vh) * 0.3
    root.current.scale.setScalar(R)
    root.current.position.set(vw * 0.24, 0, -1)

    PATHS.forEach((p, i) => {
      pos(p, t, xy[i])
      pos(p, t + 0.05, ahead) // a step ahead, to face the direction of travel
      slots.current[i].position.copy(xy[i])
      // top-down (model +Y towards the camera), tilted a touch so it reads as 3D, nose along travel
      const body = bodies.current[i]
      body.rotation.set(Math.PI / 2 - 0.35, 0, 0)
      body.rotateOnWorldAxis(Z, Math.atan2(ahead.x - xy[i].x, -(ahead.y - xy[i].y)))
    })

    const g = links.geometry
    const arr = g.attributes.position.array
    const dist = g.attributes.lineDistance.array
    PAIRS.forEach(([a, b], k) => {
      arr[k * 6] = xy[a].x
      arr[k * 6 + 1] = xy[a].y
      arr[k * 6 + 3] = xy[b].x
      arr[k * 6 + 4] = xy[b].y
      dist[k * 2 + 1] = xy[a].distanceTo(xy[b])
    })
    g.attributes.position.needsUpdate = true
    g.attributes.lineDistance.needsUpdate = true

    // one auction packet at a time, hopping along a random mesh link (held still under reduced motion)
    const h = hop.current
    if (!reduce) h.t += dt * 1.4
    if (h.t >= 1) {
      h.t = 0
      h.pair = Math.floor(Math.random() * PAIRS.length)
    }
    const [a, b] = PAIRS[h.pair]
    packet.current.position.lerpVectors(xy[a], xy[b], h.t)

    // two-drone confirmation
    let near = 0
    for (const p of xy) if (Math.hypot(p.x - SURVIVOR[0], p.y - SURVIVOR[1]) < SENSE) near++
    h.on += ((near >= 2 ? 1 : 0) - h.on) * (1 - Math.exp(-dt * 6))
    confirm.current.scale.setScalar(1 + (1 - h.on) * 0.8)
    confirm.current.visible = h.on > 0.02
  })

  // mini drone is 0.18 swarm units across (the root is scaled by the swarm radius)
  const k = MM * (0.18 / 3.1)

  return (
    <group ref={root}>
      <primitive object={links} />
      {PATHS.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            slots.current[i] = el
          }}
        >
          <lineSegments geometry={rangeGeo} material={faint} />
          <group
            ref={(el) => {
              bodies.current[i] = el
            }}
          >
            <group scale={k} position={[-center.x * k, -center.y * k, -center.z * k]}>
              {mini.map((p) =>
                p.meshes.map((m, j) => (
                  <group key={p.name + j}>
                    <mesh geometry={m.geo} material={fill} />
                    <mesh geometry={m.geo} material={outline} />
                  </group>
                ))
              )}
            </group>
          </group>
        </group>
      ))}
      <group position={[SURVIVOR[0], SURVIVOR[1], 0]}>
        <lineSegments geometry={survivorGeo} material={red} />
        <lineSegments ref={confirm} geometry={confirmGeo} material={red} />
      </group>
      <points ref={packet} geometry={packetGeo} material={dotMat} />
    </group>
  )
}
