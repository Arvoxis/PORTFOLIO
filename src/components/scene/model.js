import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// DJI Avata 2 by raphael.harris.gaffga (CC BY 4.0), optimized to ~0.6 MB with meshopt.
// Everything below the parts parent is in millimetres: +Y up, +Z towards the nose.
export const MODEL_URL = '/models/drone.glb'
const PARTS_PARENT = 'DJI_Avata2_PARTS_PARENT_10'

// scene units per mm: makes the 212 mm drone about 3.1 units wide
export const MM = 3.1 / 212

// explode offset (mm), finish, and where on the part's box a callout pins (0-1 per axis)
export const PARTS = {
  DJI_Avata2_Body_Main_2: { off: [0, 0, 0], mat: 'ceramic', pin: [0.5, 1, 0.4] },
  DJI_Avata2_Body_Secondary_3: { off: [0, -52, 0], mat: 'graphite' },
  DJI_Avata2_Arms_Motors_1: { off: [0, 34, -6], mat: 'steel', pin: [0.06, 1, 0.25] },
  DJI_Avata2_Propeller_Rings_7: { off: [0, 70, 0], mat: 'ceramic', pin: [0.95, 0.7, 0.82] },
  DJI_Avata2_Gimbal_Housing_4: { off: [0, -14, 38], mat: 'graphite' },
  DJI_Avata2_Lens_6: { off: [0, -14, 64], mat: 'glass', pin: [0.5, 0.5, 1] },
  DJI_Avata2_Hardware_Small_5: { off: [0, 20, 0], mat: 'steel' },
  DJI_Avata2_Red_Stripes_8: { off: [0, 8, 6], mat: 'red' },
  DJI_Logo_White_9: { off: [0, 48, 0], mat: 'graphite' },
  AVATA2_Text_0: { off: [0, 6, -34], mat: 'graphite' },
}

// quantized glTF attributes -> plain floats, so geometry can be baked and measured
function toFloat(attr) {
  const out = new Float32Array(attr.count * 3)
  for (let i = 0; i < attr.count; i++) {
    out[i * 3] = attr.getX(i)
    out[i * 3 + 1] = attr.getY(i)
    out[i * 3 + 2] = attr.getZ(i)
  }
  return new THREE.BufferAttribute(out, 3)
}

function build(scene) {
  scene.updateMatrixWorld(true)
  const root = scene.getObjectByName(PARTS_PARENT)
  const toParts = root.matrixWorld.clone().invert()
  const all = new THREE.Box3()
  const parts = []

  root.children.forEach((group) => {
    const cfg = PARTS[group.name]
    if (!cfg) return
    const box = new THREE.Box3()
    const meshes = []
    group.traverse((o) => {
      if (!o.isMesh) return
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', toFloat(o.geometry.attributes.position))
      if (o.geometry.attributes.normal) geo.setAttribute('normal', toFloat(o.geometry.attributes.normal))
      geo.setIndex(o.geometry.index)
      geo.applyMatrix4(toParts.clone().multiply(o.matrixWorld)) // bake into the mm parts frame
      geo.computeBoundingBox()
      box.union(geo.boundingBox)
      meshes.push({ geo, edges: new THREE.EdgesGeometry(geo, 30) })
    })
    all.union(box)

    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const anchor = cfg.pin && box.min.clone().add(size.clone().multiply(new THREE.Vector3(...cfg.pin)))
    parts.push({ name: group.name, meshes, center, anchor, ...cfg })
  })

  return { parts, center: all.getCenter(new THREE.Vector3()) }
}

const cache = new WeakMap()

// Loads the GLB once and returns baked parts; every caller shares the same geometry.
export function useDrone() {
  const { scene } = useGLTF(MODEL_URL, false, true)
  if (!cache.has(scene)) cache.set(scene, build(scene))
  return cache.get(scene)
}

useGLTF.preload(MODEL_URL, false, true)

// Technical-render finishes
export const FINISH = {
  ceramic: { color: '#ece6d9', roughness: 0.52, metalness: 0 },
  graphite: { color: '#26313d', roughness: 0.6, metalness: 0.2 },
  steel: { color: '#9aabbd', roughness: 0.32, metalness: 0.8 },
  glass: { color: '#0a1a30', roughness: 0.06, metalness: 0.5 },
  red: { color: '#ff5a36', roughness: 0.55, metalness: 0 },
}

export function finishMaterials() {
  const out = {}
  for (const [k, v] of Object.entries(FINISH)) {
    out[k] = new THREE.MeshStandardMaterial({
      ...v,
      transparent: true,
      opacity: 0,
      polygonOffset: true, // lets the ink edges sit on top without z-fighting
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    })
  }
  return out
}

// Ink silhouette: back faces pushed out along their normals (inverted hull)
export function hullMaterial(color, thickness) {
  const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, transparent: true, opacity: 0 })
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\ntransformed += normalize(normal) * ${thickness.toFixed(3)};`
    )
  }
  return m
}
