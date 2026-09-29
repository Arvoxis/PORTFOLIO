import * as THREE from 'three'

export const INK = '#f3ead8'
export const RED = '#ff5a36'

// smoothstep: 0 below a, 1 above b, eased in between
export function ss(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export const lerp = (a, b, t) => a + (b - a) * t

export const edges = (geometry) => new THREE.EdgesGeometry(geometry)

// flat [x1,y1,z1, x2,y2,z2, ...] pairs -> LineSegments geometry
export function segs(points) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return g
}

// circle in the XZ plane as segment pairs
export function ring(r, n = 32, y = 0) {
  const out = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const b = ((i + 1) / n) * Math.PI * 2
    out.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(b) * r, y, Math.sin(b) * r)
  }
  return out
}

export const lineMat = (color) =>
  new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })

// Project an object's world position to page pixels and move a DOM callout there.
const v = new THREE.Vector3()
export function pin(el, obj, state, opacity, dx = 0, dy = 0) {
  if (!el) return
  obj.getWorldPosition(v).project(state.camera)
  const x = (v.x * 0.5 + 0.5) * state.size.width + dx
  const y = (-v.y * 0.5 + 0.5) * state.size.height + dy
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  el.style.opacity = opacity.toFixed(3)
}
