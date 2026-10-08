import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useKit, applyKit, Part, Dimension, damp, COLORS } from './kit'

/** Extruded spur gear with a bore, axis along +Z, centred. */
export function makeGear(teeth, rootR, tipR, width, boreR, segs = 3) {
  const shape = new THREE.Shape()
  const step = (Math.PI * 2) / teeth
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const pts = [
      [rootR, a],
      [tipR, a + step * 0.18],
      [tipR, a + step * 0.42],
      [rootR, a + step * 0.6],
    ]
    pts.forEach(([r, ang], k) => {
      const x = Math.cos(ang) * r
      const y = Math.sin(ang) * r
      if (i === 0 && k === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    })
    // root arc to next tooth
    for (let s = 1; s <= segs; s++) {
      const ang = a + step * 0.6 + (step * 0.4 * s) / segs
      shape.lineTo(Math.cos(ang) * rootR, Math.sin(ang) * rootR)
    }
  }
  const hole = new THREE.Path()
  hole.absarc(0, 0, boreR, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  // lightening holes on larger gears
  if (rootR > 0.45) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const p = new THREE.Path()
      p.absarc(Math.cos(a) * rootR * 0.58, Math.sin(a) * rootR * 0.58, rootR * 0.16, 0, Math.PI * 2, true)
      shape.holes.push(p)
    }
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false, curveSegments: 18 })
  geo.translate(0, 0, -width / 2)
  return geo
}

/** Plate in the Y–Z plane (thickness along X) with circular bores. */
function makePlate(w, hgt, t, holes) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(w / 2, 0)
  s.lineTo(w / 2, hgt - 0.15)
  s.quadraticCurveTo(w / 2, hgt, w / 2 - 0.15, hgt)
  s.lineTo(-w / 2 + 0.15, hgt)
  s.quadraticCurveTo(-w / 2, hgt, -w / 2, hgt - 0.15)
  s.closePath()
  holes.forEach(([x, y, r]) => {
    const p = new THREE.Path()
    p.absarc(x, y, r, 0, Math.PI * 2, true)
    s.holes.push(p)
  })
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 24 })
  g.translate(0, 0, -t / 2)
  g.rotateY(Math.PI / 2)
  return g
}

export const GEARBOX_DEFAULTS = { explode: 0, blueprint: 0, section: 0, wireframe: false, spin: 1 }

const SHAFT_Y = 0.95
const CD = 0.9 // centre distance
const ZP = -CD / 2 // pinion shaft z
const ZG = CD / 2 // gear shaft z

/**
 * Single-stage spur gear reducer.
 * `targets`: explode (0 assembled → 1 exploded, >1 = laid out), blueprint, section, wireframe, spin
 */
export default function Gearbox({ targets, dims = false, speed = 2.4, ...props }) {
  const kit = useKit([0, 0, -1])
  const cur = useRef({ ...GEARBOX_DEFAULTS, ...targets })
  const tRef = useRef(targets)
  tRef.current = targets
  const angle = useRef(0)

  const g = useMemo(() => ({
    pinion: makeGear(14, 0.27, 0.33, 0.34, 0.07),
    gear: makeGear(28, 0.57, 0.63, 0.3, 0.09),
    shaftP: new THREE.CylinderGeometry(0.07, 0.07, 3.3, 24).rotateZ(Math.PI / 2),
    shaftG: new THREE.CylinderGeometry(0.09, 0.09, 3.0, 24).rotateZ(Math.PI / 2),
    base: new THREE.BoxGeometry(3.3, 0.16, 2.0),
    plate: makePlate(1.9, 1.75, 0.14, [[-ZP, SHAFT_Y, 0.13], [-ZG, SHAFT_Y, 0.15]]),
    bearing: new THREE.TorusGeometry(0.15, 0.05, 12, 32).rotateY(Math.PI / 2),
    bearingInner: new THREE.CylinderGeometry(0.1, 0.1, 0.1, 24).rotateZ(Math.PI / 2),
    cover: new THREE.BoxGeometry(2.5, 0.9, 1.9),
    bolt: new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6),
    motor: new THREE.CylinderGeometry(0.32, 0.32, 0.8, 32).rotateZ(Math.PI / 2),
    key: new THREE.BoxGeometry(0.3, 0.04, 0.04),
  }), [])

  const m = useMemo(() => ({
    steel: kit.solid({ color: '#c3ced8', metalness: 0.85, roughness: 0.28 }),
    dark: kit.solid({ color: '#3b4b5c', metalness: 0.6, roughness: 0.45 }),
    gear: kit.solid({ color: '#d6dee6', metalness: 0.9, roughness: 0.22 }),
    accent: kit.solid({ color: COLORS.orange, metalness: 0.5, roughness: 0.35 }),
    blue: kit.solid({ color: COLORS.blue, metalness: 0.5, roughness: 0.35 }),
    cover: kit.solid({ color: COLORS.cyan, metalness: 0.9, roughness: 0.1, opacity: 0.14 }),
    edge: kit.edge(COLORS.cyan),
    edgeSoft: kit.edge('#6fb6e8'),
  }), [kit])

  // Part layout: base position + explode direction
  const parts = useMemo(() => [
    { key: 'base', geo: g.base, mat: m.dark, pos: [0, 0.08, 0], dir: [0, -0.9, 0] },
    { key: 'plateL', geo: g.plate, mat: m.steel, pos: [-1.2, 0.16, 0], dir: [-1.1, 0, 0] },
    { key: 'plateR', geo: g.plate, mat: m.steel, pos: [1.2, 0.16, 0], dir: [1.1, 0, 0] },
    { key: 'cover', geo: g.cover, mat: m.cover, pos: [0, 1.5, 0], dir: [0, 1.4, 0] },
    { key: 'bL1', geo: g.bearing, mat: m.accent, pos: [-1.2, SHAFT_Y + 0.16, ZP], dir: [-1.8, 0.2, -0.2] },
    { key: 'bR1', geo: g.bearing, mat: m.accent, pos: [1.2, SHAFT_Y + 0.16, ZP], dir: [1.8, 0.2, -0.2] },
    { key: 'bL2', geo: g.bearing, mat: m.accent, pos: [-1.2, SHAFT_Y + 0.16, ZG], dir: [-1.8, 0.2, 0.2] },
    { key: 'bR2', geo: g.bearing, mat: m.accent, pos: [1.2, SHAFT_Y + 0.16, ZG], dir: [1.8, 0.2, 0.2] },
    { key: 'motor', geo: g.motor, mat: m.blue, pos: [-2.15, SHAFT_Y + 0.16, ZP], dir: [-1.6, 0, 0] },
    ...[[-1.45, -0.8], [1.45, -0.8], [-1.45, 0.8], [1.45, 0.8]].map(([x, z], i) => ({
      key: `bolt${i}`, geo: g.bolt, mat: m.steel, pos: [x, 0.2, z], dir: [0, 1.1, 0],
    })),
  ], [g, m])

  const partRefs = useRef({})
  const pinionGrp = useRef()
  const gearGrp = useRef()
  const pinionSpin = useRef()
  const gearSpin = useRef()

  useFrame((_, dt) => {
    const t = { ...GEARBOX_DEFAULTS, ...tRef.current }
    const c = cur.current
    for (const k of ['explode', 'blueprint', 'section', 'spin']) c[k] = damp(c[k], t[k], speed, dt)
    applyKit(kit, { blueprint: c.blueprint, wireframe: t.wireframe, section: c.section, sectionAt: 0 })
    const e = c.explode
    for (const p of parts) {
      const o = partRefs.current[p.key]
      if (o) o.position.set(p.pos[0] + p.dir[0] * e, p.pos[1] + p.dir[1] * e, p.pos[2] + p.dir[2] * e)
    }
    if (pinionGrp.current) pinionGrp.current.position.set(0, SHAFT_Y + 0.16 + e * 0.5, ZP - e * 0.9)
    if (gearGrp.current) gearGrp.current.position.set(0, SHAFT_Y + 0.16 + e * 0.5, ZG + e * 0.9)
    angle.current += dt * 1.2 * c.spin
    if (pinionSpin.current) pinionSpin.current.rotation.x = angle.current
    if (gearSpin.current) gearSpin.current.rotation.x = -angle.current * (14 / 28) + Math.PI / 28
  })

  return (
    <group {...props}>
      {parts.map((p) => (
        <group key={p.key} ref={(el) => (partRefs.current[p.key] = el)} position={p.pos}>
          <Part geometry={p.geo} material={p.mat} edge={p.key === 'cover' ? m.edgeSoft : m.edge} />
        </group>
      ))}

      {/* pinion sub-assembly */}
      <group ref={pinionGrp}>
        <group ref={pinionSpin}>
          <Part geometry={g.shaftP} material={m.steel} edge={m.edge} position={[-0.15, 0, 0]} />
          <Part geometry={g.pinion} material={m.gear} edge={m.edge} rotation={[0, Math.PI / 2, 0]} />
          <Part geometry={g.key} material={m.accent} position={[0, 0.07, 0]} />
        </group>
      </group>

      {/* output gear sub-assembly */}
      <group ref={gearGrp}>
        <group ref={gearSpin}>
          <Part geometry={g.shaftG} material={m.steel} edge={m.edge} position={[0.15, 0, 0]} />
          <Part geometry={g.gear} material={m.gear} edge={m.edge} rotation={[0, Math.PI / 2, 0]} />
          <Part geometry={g.key} material={m.accent} position={[0, 0.09, 0]} />
        </group>
      </group>

      <Dimension visible={dims} start={[-1.65, 0, 1.0]} end={[1.65, 0, 1.0]} offset={[0, 0, 0.6]} label="330" />
      <Dimension visible={dims} start={[1.27, 0.16, -0.95]} end={[1.27, 1.91, -0.95]} offset={[0.6, 0, 0]} label="175" />
      <Dimension visible={dims} start={[-1.3, SHAFT_Y + 0.16, ZP]} end={[-1.3, SHAFT_Y + 0.16, ZG]} offset={[0, 1.1, 0]} label="C/D 90" color={COLORS.orange} />
    </group>
  )
}
