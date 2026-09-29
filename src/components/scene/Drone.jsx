import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { INK, segs, ss, lerp, lineMat } from './util'
import { useDrone, MM, finishMaterials, hullMaterial } from './model'
import { towerPlace } from './Tower'

const tmp = new THREE.Vector3()

// Width dimension under the drone, clear of its lowest point: |<——— ———>|
const DIMS = [
  -1.55, -1.1, 0, 1.55, -1.1, 0,
  -1.55, -1.02, 0, -1.55, -1.18, 0,
  1.55, -1.02, 0, 1.55, -1.18, 0,
  -1.55, -1.1, 0, -1.45, -1.06, 0,
  -1.55, -1.1, 0, -1.45, -1.14, 0,
  1.55, -1.1, 0, 1.45, -1.06, 0,
  1.55, -1.1, 0, 1.45, -1.14, 0,
]

// callout index on the page for each pinned part
const CALLOUT = {
  DJI_Avata2_Body_Main_2: 0,
  DJI_Avata2_Lens_6: 1,
  DJI_Avata2_Propeller_Rings_7: 2,
  DJI_Avata2_Arms_Motors_1: 3,
}

// the exploded view holds this angle, so the stack reads and the callouts stay put
const HOLD_X = 0.22
const HOLD_Y = -0.9

export default function Drone({ stage, callouts }) {
  const { parts, center } = useDrone()
  const root = useRef()
  const under = useRef()
  const shadow = useRef()
  const groups = useRef([])
  const anchors = useRef([])
  const solids = useRef({})
  const phone = useRef(false)
  const born = useRef(null)
  const [shadowOn, setShadowOn] = useState(false)

  const mats = useMemo(finishMaterials, [])
  // phones: hidden-line drawing (paper fill, ink outlines), so hero text over it stays readable
  const paper = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#0f2a4a', transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
    []
  )
  const hull = useMemo(() => hullMaterial(INK, 0.9), [])
  const edgeMat = useMemo(() => lineMat(INK), [])
  const dimMat = useMemo(() => lineMat(INK), [])
  const dims = useMemo(() => segs(DIMS), [])
  // a sparse sample of each part's vertices, for finding the drone's real outline on screen
  const samples = useMemo(
    () =>
      parts.map((p) => {
        const pts = []
        p.meshes.forEach(({ geo }) => {
          const a = geo.attributes.position
          for (let v = 0; v < a.count; v += 60) pts.push(new THREE.Vector3(a.getX(v), a.getY(v), a.getZ(v)))
        })
        return pts
      }),
    [parts]
  )

  // dashed assembly axes: each part's centre to where it ends up exploded
  const axes = useMemo(() => {
    const pts = []
    parts.forEach((p) => {
      if (!p.off.some(Boolean)) return
      pts.push(p.center.x, p.center.y, p.center.z, p.center.x + p.off[0], p.center.y + p.off[1], p.center.z + p.off[2])
    })
    const line = new THREE.LineSegments(segs(pts), new THREE.LineDashedMaterial({ color: INK, dashSize: 3, gapSize: 3, transparent: true, opacity: 0 }))
    line.computeLineDistances()
    return line
  }, [parts])

  useFrame((state) => {
    const { s, mobile, off, reduce } = stage.current
    const t = state.clock.elapsedTime
    if (born.current === null) born.current = t
    const age = reduce ? 10 : t - born.current
    const { width: vw, height: vh, aspect } = state.viewport

    const explode = ss(0.35, 0.9, s) * (1 - ss(1.45, 1.8, s))
    const fly = ss(1.5, 2.1, s) // off to inspect the tower
    const fade = 1 - ss(2.55, 2.95, s)
    // narrow laptops: the exploded drone shares space with text, so draw its lines a little lighter
    const dim = mobile ? 0.5 : aspect < 1.45 ? lerp(1, 0.75, explode) : 1

    // load sequence: ink edges draft in first, then the solid surfaces
    const edgeIn = ss(0.1, 1.1, age)
    const solidIn = ss(0.8, 2.0, age)

    parts.forEach((p, i) => {
      groups.current[i].position.set(p.off[0] * explode, p.off[1] * explode, p.off[2] * explode)
    })

    const home = mobile ? [0, vh * 0.3, 0] : [vw * (0.22 + 0.1 * explode), 0.1, 0]
    // hover above the tagged insulator on the tower's near cross-arm, outside the lattice
    const T = towerPlace(state.viewport, mobile)
    const inspect = [T.x - 0.94 * T.s, T.y + 3.35 * T.s, -0.5 + 0.6 * T.s]
    const bob = reduce ? 0 : Math.sin(t * 1.3) * 0.05
    const r = root.current
    r.position.set(lerp(home[0], inspect[0], fly), lerp(home[1], inspect[1], fly) + bob, lerp(home[2], inspect[2], fly))
    const size = mobile ? 0.62 : Math.min(1.15, vw * 0.115) * (1 - 0.3 * explode)
    r.scale.setScalar(lerp(size, size * 0.4, fly))
    if (reduce) {
      r.rotation.set(lerp(0.42, HOLD_X, explode), lerp(-0.65, HOLD_Y, explode), 0)
    } else {
      // slow orbit leaning toward the pointer, settling on the hold angle (shortest way round) as it explodes
      const orbit = -0.6 + t * 0.18 + state.pointer.x * 0.3
      const d = Math.atan2(Math.sin(orbit - HOLD_Y), Math.cos(orbit - HOLD_Y))
      r.rotation.y = HOLD_Y + d * (1 - explode) + state.pointer.x * 0.08 * explode
      r.rotation.x = lerp(0.42 - state.pointer.y * 0.12, HOLD_X, explode)
      r.rotation.z = lerp(0, -0.15, fly)
    }
    r.visible = fade * dim > 0.01 && !off

    // shadow and dimension line live in an unrotated frame under the drone
    under.current.position.copy(r.position)
    under.current.scale.copy(r.scale)
    under.current.visible = r.visible

    if (mobile !== phone.current) {
      phone.current = mobile
      for (const m of Object.values(solids.current)) if (m) m.mesh.material = mobile ? paper : mats[m.mat]
    }
    const solid = solidIn * fade
    for (const m of Object.values(mats)) m.opacity = solid
    paper.opacity = solid
    hull.opacity = edgeIn * fade * dim * 0.9
    edgeMat.opacity = edgeIn * fade * dim * 0.55
    axes.material.opacity = explode * fade * dim * 0.7
    dimMat.opacity = mobile ? 0 : (1 - ss(0.15, 0.45, s)) * edgeIn * dim * 0.55
    // the shadow re-renders the scene into its own target; once invisible it renders one last frame and stops
    const shadowOp = mobile ? 0 : solid * (1 - fly) * 0.55
    if (shadowOp > 0.01 !== shadowOn) setShadowOn(shadowOp > 0.01)
    shadow.current?.traverse((o) => {
      if (o.isMesh) o.material.opacity = shadowOp
    })

    r.updateMatrixWorld()
    layoutCallouts(state, mobile || off ? 0 : ss(0.55, 0.95, explode) * fade)
  })

  // Labels sit in one right-aligned column just left of the drone's exploded outline, each joined to
  // its part by a leader. Where that column would run into the notes text, only the lettered markers show.
  const dom = useRef(null)
  const shown = useRef(0)
  const layoutCallouts = (state, show) => {
    if (show < 0.001 && shown.current < 0.001) return
    shown.current = show
    const W = state.size.width
    const H = state.size.height
    dom.current ??= callouts.current.slice(0, 4).map((el) => {
      const span = el.querySelector('span')
      return { el, i: el.querySelector('i'), span, w: span.offsetWidth }
    })

    let left = Infinity
    samples.forEach((pts, i) => {
      const m = groups.current[i].matrixWorld
      for (const v of pts) left = Math.min(left, (tmp.copy(v).applyMatrix4(m).project(state.camera).x * 0.5 + 0.5) * W)
    })
    const colX = left - 24
    const widest = Math.max(...dom.current.map((d) => d.w))
    const bare = colX - widest < stage.current.textRight + 24

    const list = []
    parts.forEach((p, i) => {
      const k = CALLOUT[p.name]
      if (k === undefined) return
      anchors.current[i].getWorldPosition(tmp).project(state.camera)
      list.push({ d: dom.current[k], x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H })
    })
    list.sort((a, b) => a.y - b.y)

    let prev = -Infinity
    for (const { d, x, y } of list) {
      const ly = Math.max(y, prev + 28)
      prev = ly
      const dx = colX - x
      const dy = ly - y
      if (d.el.classList.contains('bare') !== bare) d.el.classList.toggle('bare', bare)
      d.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      d.el.style.opacity = show.toFixed(3)
      if (bare) continue
      d.i.style.width = `${Math.hypot(dx, dy).toFixed(1)}px`
      d.i.style.transform = `rotate(${Math.atan2(dy, dx).toFixed(4)}rad)`
      d.span.style.transform = `translate3d(${(dx - d.w).toFixed(1)}px, ${dy.toFixed(1)}px, 0)`
    }
  }

  return (
    <>
      <group ref={root}>
        <group scale={MM} position={[-center.x * MM, -center.y * MM, -center.z * MM]}>
          {parts.map((p, i) => (
            <group
              key={p.name}
              ref={(el) => {
                groups.current[i] = el
              }}
            >
              {p.meshes.map((m, j) => (
                <group key={j}>
                  <mesh
                    geometry={m.geo}
                    material={mats[p.mat]}
                    ref={(el) => {
                      solids.current[`${i}.${j}`] = el && { mesh: el, mat: p.mat }
                    }}
                  />
                  <mesh geometry={m.geo} material={hull} />
                  <lineSegments geometry={m.edges} material={edgeMat} />
                </group>
              ))}
              <object3D
                position={p.anchor || p.center}
                ref={(el) => {
                  anchors.current[i] = el
                }}
              />
            </group>
          ))}
          <primitive object={axes} />
        </group>
      </group>
      <group ref={under}>
        <lineSegments geometry={dims} material={dimMat} />
        <ContactShadows
          ref={shadow}
          frames={shadowOn ? Infinity : 1}
          position={[0, -0.75, 0]}
          scale={4}
          far={1.6}
          blur={2.4}
          resolution={256}
          opacity={0}
          color="#04101f"
        />
      </group>
    </>
  )
}
