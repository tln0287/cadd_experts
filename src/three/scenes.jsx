import { useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import Stage from './Stage'
import CameraRig from './CameraRig'
import Building, { BUILDING_DEFAULTS } from './Building'
import Gearbox, { makeGear } from './Gearbox'
import { Axes, Tag, Dimension, clamp01, pointer, COLORS } from './kit'
import { useHeroScroll } from '../hooks/useScrollProgress'
import { usePrefersReducedMotion } from '../hooks/useDevice'

/* ================================================================== */
/* HERO — building + gearbox around a glowing coordinate system        */
/* ================================================================== */
function HeroContent({ reduced }) {
  const scroll = useHeroScroll()
  const { size } = useThree()
  const aspect = size.width / size.height
  const bT = useRef({ ...BUILDING_DEFAULTS, columns: 0, beams: 0, slabs: 0, facade: 0 })
  const gT = useRef({ explode: 3, blueprint: 0 })
  const rig = useRef()
  const bld = useRef()
  const gbx = useRef()
  const dimsShown = useRef(false)
  const [dims, setDims] = useState(reduced)

  useFrame(({ clock }, dt) => {
    const t = reduced ? 30 : clock.elapsedTime
    const s = clamp01(scroll.current * 1.3)
    const r = (start, dur) => clamp01((t - start) / dur)
    Object.assign(bT.current, {
      grid: r(0.2, 0.8) * 0.9,
      plan: r(0.5, 0.8) * (0.25 + 0.75 * s),
      columns: r(0.9, 0.9),
      beams: r(1.3, 1.0),
      slabs: r(1.7, 1.0),
      facade: r(2.3, 1.0) * (1 - s),
      mep: s,
      blueprint: s,
    })
    gT.current.explode = 3 * (1 - r(1.0, 1.8)) + s * 1.15
    gT.current.blueprint = s * 0.7
    if (!dimsShown.current && t > 2.9) {
      dimsShown.current = true
      setDims(true)
    }
    if (bld.current) bld.current.rotation.y = -0.35 + Math.sin(t * 0.12) * 0.35
    if (gbx.current) gbx.current.rotation.y = 0.55 + t * 0.12
    if (rig.current) {
      const k = 1 - Math.exp(-2.5 * dt)
      rig.current.rotation.y += (pointer.x * 0.18 - rig.current.rotation.y) * k
      rig.current.rotation.x += (-pointer.y * 0.06 - rig.current.rotation.x) * k
    }
  })

  // fit ~10 world units of width regardless of canvas aspect
  const narrow = aspect < 1
  const dist = Math.max(11.5, 5 / (Math.tan((34 / 2) * (Math.PI / 180)) * aspect))
  const cam = [0.3, dist * 0.28, dist]

  return (
    <>
      <CameraRig position={cam} lookAt={[0, 1.4, 0]} parallax={0.3} fit={false} />
      <group ref={rig}>
        <group position={[-2.75, 0, 0]} scale={0.82} ref={bld}>
          <Building targets={bT.current} floors={6} dims={dims} />
        </group>
        <group position={[2.85, 0, 0.2]} scale={0.88} ref={gbx}>
          <Gearbox targets={gT.current} />
        </group>
        <Axes position={[0, 0.02, 1.1]} size={1.1} />
        <Tag position={[-3.6, 4.3, 0]} delay={reduced ? 0 : 2600}>{narrow ? 'CIVIL' : 'CIVIL ENGINEERING'}</Tag>
        <Tag position={[narrow ? 2.3 : 1.7, 2.9, 0]} delay={reduced ? 0 : 2800}>{narrow ? 'MECHANICAL' : 'MECHANICAL ENGINEERING'}</Tag>
        <Tag position={[0.25, 1.35, 1.1]} delay={reduced ? 0 : 3000} accent>CAD</Tag>
        <Tag position={[-1.4, 2.3, 1.2]} delay={reduced ? 0 : 3150}>BIM</Tag>
        {!narrow && <Tag position={[2.6, 0.2, 1.7]} delay={reduced ? 0 : 3300}>3D DESIGN</Tag>}
      </group>
    </>
  )
}

export function HeroScene() {
  const reduced = usePrefersReducedMotion()
  return (
    <Stage className="stage--hero" camera={{ position: [0, 6, 18], fov: 34 }} label="3D model of a building and a gearbox around a CAD coordinate system">
      <HeroContent reduced={reduced} />
    </Stage>
  )
}

/* ================================================================== */
/* DOMAIN SPLIT — hover transforms                                     */
/* ================================================================== */
function DomainContent({ kind, active }) {
  const since = useRef(null)
  const targets = useRef({})
  useFrame(({ clock }) => {
    if (active && since.current === null) since.current = clock.elapsedTime
    if (!active) since.current = null
    const el = since.current === null ? -1 : clock.elapsedTime - since.current
    if (kind === 'civil') {
      Object.assign(targets.current, {
        blueprint: active ? 0 : 1, plan: active ? 0.15 : 1, grid: active ? 0.4 : 1,
        facade: active ? 1 : 0, columns: 1, beams: 1, slabs: 1,
      })
    } else {
      Object.assign(targets.current, {
        blueprint: el < 0 ? 1 : 0,
        explode: el > 0.9 ? 1 : 0,
      })
    }
  })
  if (kind === 'civil') {
    return (
      <>
        <CameraRig position={active ? [6.5, 4.5, 8.5] : [0.01, 15, 2]} lookAt={active ? [0, 1.4, 0] : [0, 0, 0]} speed={1.8} parallax={0.25} />
        <Building targets={targets.current} floors={5} />
      </>
    )
  }
  return (
    <>
      <CameraRig position={active ? [5, 3.5, 7] : [4.5, 3, 6]} lookAt={[0, 0.9, 0]} speed={1.8} parallax={0.25} />
      <Gearbox targets={targets.current} />
    </>
  )
}

export function DomainScene({ domain: kind, active }) {
  return (
    <Stage className="stage--fill" camera={{ position: [6, 5, 8], fov: 35 }} label={kind === 'civil' ? 'Building model transforming from blueprint to 3D' : 'Gearbox transforming from wireframe to exploded assembly'}>
      <DomainContent kind={kind} active={active} />
    </Stage>
  )
}

/* ================================================================== */
/* CIVIL EXPERIENCE — 9 scroll stages                                  */
/* ================================================================== */
export const CIVIL_STAGES = [
  { name: 'Floor Plan', t: { plan: 1, grid: 0, columns: 0, beams: 0, slabs: 0, facade: 0, blueprint: 1 }, cam: [0.01, 11, 1.4], look: [0, 0, 0] },
  { name: 'Structural Grid', t: { plan: 0.5, grid: 1, columns: 0, beams: 0, slabs: 0, facade: 0, blueprint: 1 }, cam: [3.5, 9, 6.5], look: [0, 0, 0] },
  { name: 'Columns', t: { plan: 0.3, grid: 1, columns: 1, beams: 0, slabs: 0, facade: 0, blueprint: 0.3 }, cam: [7.5, 5, 9], look: [0, 1.4, 0] },
  { name: 'Beams', t: { plan: 0.2, grid: 0.8, columns: 1, beams: 1, slabs: 0, facade: 0, blueprint: 0.2 }, cam: [8.5, 6.2, 7.5], look: [0, 1.6, 0] },
  { name: 'Slabs', t: { plan: 0, grid: 0.6, columns: 1, beams: 1, slabs: 1, facade: 0, blueprint: 0.1 }, cam: [-8, 5.5, 9], look: [0, 1.6, 0] },
  { name: 'MEP', t: { grid: 0.4, columns: 1, beams: 1, slabs: 1, mep: 1, facade: 0, blueprint: 0.75 }, cam: [-6.5, 4.2, 7.5], look: [0, 1.8, 0] },
  { name: 'Elevation', t: { grid: 0.3, columns: 1, beams: 1, slabs: 1, facade: 1, blueprint: 1 }, cam: [0, 1.9, 13], look: [0, 1.8, 0], dims: true },
  { name: 'Section', t: { grid: 0.3, columns: 1, beams: 1, slabs: 1, mep: 1, facade: 1, blueprint: 0.3, section: 1 }, cam: [4, 2.8, 10.5], look: [0, 1.8, 0] },
  { name: 'Final Visualization', t: { grid: 0.2, columns: 1, beams: 1, slabs: 1, facade: 1, blueprint: 0 }, cam: [8.5, 4.2, 9.5], look: [0, 1.7, 0], orbit: 0.06 },
]

export function CivilScene({ stage }) {
  const s = CIVIL_STAGES[stage]
  const targets = useMemo(() => ({ ...BUILDING_DEFAULTS, mep: 0, section: 0, ...s.t }), [s])
  return (
    <Stage className="stage--fill" camera={{ position: [0, 9, 2], fov: 36 }} label={`Building model: ${s.name}`}>
      <CameraRig position={s.cam} lookAt={s.look} orbit={s.orbit || 0} speed={1.6} parallax={0.25} />
      <Building targets={targets} floors={6} dims={!!s.dims} />
    </Stage>
  )
}

/* ================================================================== */
/* MECHANICAL EXPERIENCE — 7 scroll stages                              */
/* ================================================================== */
export const MECH_STAGES = [
  { name: 'Individual Components', t: { explode: 2.3, blueprint: 0 }, cam: [6, 5, 9], look: [0, 0.9, 0] },
  { name: 'Assembly', t: { explode: 0, blueprint: 0 }, cam: [4.5, 3, 6], look: [0, 0.9, 0] },
  { name: 'Exploded View', t: { explode: 1.1, blueprint: 0 }, cam: [6, 4, 7.5], look: [0, 1, 0] },
  { name: 'Technical Drawing', t: { explode: 0, blueprint: 1 }, cam: [0.01, 1.2, 9], look: [0, 1, 0] },
  { name: 'Dimensions', t: { explode: 0, blueprint: 1 }, cam: [3.5, 4, 7], look: [0, 1, 0], dims: true },
  { name: 'Section View', t: { explode: 0, blueprint: 0.2, section: 1 }, cam: [3, 2.2, 6.5], look: [0, 1, 0], dims: true },
  { name: 'Final Rendered Component', t: { explode: 0, blueprint: 0 }, cam: [5, 3, 6.5], look: [0, 0.9, 0], orbit: 0.08 },
]

export function MechScene({ stage }) {
  const s = MECH_STAGES[stage]
  const targets = useMemo(() => ({ section: 0, ...s.t }), [s])
  return (
    <Stage className="stage--fill" camera={{ position: [6, 5, 9], fov: 36 }} label={`Gearbox model: ${s.name}`}>
      <CameraRig position={s.cam} lookAt={s.look} orbit={s.orbit || 0} speed={1.6} parallax={0.25} />
      <Gearbox targets={targets} dims={!!s.dims} />
    </Stage>
  )
}

/* ================================================================== */
/* BLUEPRINT → REALITY — 5 steps                                        */
/* ================================================================== */
const REALITY = [
  { t: { plan: 1, grid: 1, columns: 0, beams: 0, slabs: 0, facade: 0, blueprint: 1 }, cam: [0.01, 9.5, 1], look: [0, 0, 0] },
  { t: { plan: 0.4, grid: 0.6, columns: 1, beams: 1, slabs: 1, facade: 0, blueprint: 1 }, cam: [6, 4.5, 7], look: [0, 1.6, 0] },
  { t: { grid: 0.4, columns: 1, beams: 1, slabs: 1, facade: 0, blueprint: 0.35, analysis: 1 }, cam: [5.5, 3.5, 7.5], look: [0, 1.8, 0] },
  { t: { grid: 0.4, columns: 1, beams: 1, slabs: 1, facade: 1, blueprint: 1 }, cam: [0, 2, 11], look: [0, 1.8, 0], dims: true },
  { t: { grid: 0.15, columns: 1, beams: 1, slabs: 1, facade: 1, blueprint: 0 }, cam: [7, 3.4, 8.5], look: [0, 1.7, 0], orbit: 0.07 },
]

export function RealityScene({ stage }) {
  const s = REALITY[stage]
  const targets = useMemo(() => ({ ...BUILDING_DEFAULTS, ...s.t }), [s])
  return (
    <Stage className="stage--fill" camera={{ position: [0, 9, 2], fov: 36 }} label="Engineering drawing transforming into a 3D building">
      <CameraRig position={s.cam} lookAt={s.look} orbit={s.orbit || 0} speed={1.5} parallax={0.25} />
      <Building targets={targets} floors={6} dims={!!s.dims} />
    </Stage>
  )
}

/* ================================================================== */
/* PROJECT VIEWER — lightweight CAD viewer                              */
/* ================================================================== */
const ViewerContent = forwardRef(function ViewerContent({ model, opts }, ref) {
  const controls = useRef()
  const { camera } = useThree()
  const drawingCam = useRef(false)

  useImperativeHandle(ref, () => ({
    zoom(f) {
      const c = controls.current
      if (!c) return
      const dir = camera.position.clone().sub(c.target).multiplyScalar(f)
      camera.position.copy(c.target).add(dir)
      c.update()
    },
    reset() {
      camera.position.set(6, 4, 8)
      controls.current?.target.set(0, 1.2, 0)
      controls.current?.update()
    },
  }))

  // snap to a front elevation when the technical drawing view is switched on
  useFrame((_, dt) => {
    if (opts.drawing && !drawingCam.current) {
      drawingCam.current = true
    }
    if (!opts.drawing) drawingCam.current = false
    if (opts.drawing && controls.current) {
      const k = 1 - Math.exp(-3 * dt)
      camera.position.lerp({ x: 0.001, y: 1.4, z: 10 }, k)
      controls.current.target.lerp({ x: 0, y: 1.2, z: 0 }, k)
      controls.current.update()
    }
  })

  const bTargets = useMemo(() => ({
    ...BUILDING_DEFAULTS, mep: opts.explode ? 1 : 0, facade: opts.explode ? 0 : 1, grid: 0.6,
    blueprint: opts.drawing ? 1 : 0, wireframe: opts.wireframe, section: opts.explode ? 1 : 0,
  }), [opts])
  const gTargets = useMemo(() => ({
    explode: opts.explode ? 1 : 0, blueprint: opts.drawing ? 1 : 0, wireframe: opts.wireframe,
  }), [opts])

  return (
    <>
      <OrbitControls ref={controls} target={[0, 1.2, 0]} enableDamping autoRotate={opts.rotate && !opts.drawing} autoRotateSpeed={0.8} minDistance={3} maxDistance={20} maxPolarAngle={Math.PI * 0.49} enablePan />
      {model === 'building'
        ? <Building targets={bTargets} dims={opts.dims} floors={6} />
        : <Gearbox targets={gTargets} dims={opts.dims} />}
    </>
  )
})

export const ViewerScene = forwardRef(function ViewerScene({ model, opts }, ref) {
  return (
    <Stage className="stage--fill" camera={{ position: [6, 4, 8], fov: 35 }} label={`Interactive 3D viewer: ${model}`}>
      <ViewerContent ref={ref} model={model} opts={opts} />
    </Stage>
  )
})

/* ================================================================== */
/* ABOUT — gear emblem on a coordinate system                          */
/* ================================================================== */
function Emblem() {
  const gear = useMemo(() => makeGear(24, 0.95, 1.08, 0.3, 0.32), [])
  const small = useMemo(() => makeGear(12, 0.42, 0.52, 0.26, 0.14), [])
  const a = useRef()
  const b = useRef()
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.3
    if (b.current) b.current.rotation.z -= dt * 0.6
  })
  return (
    <>
      <CameraRig position={[3.2, 2.6, 5.4]} lookAt={[0.4, 1.1, 0]} parallax={0.5} />
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[0, 1.25, 0]}>
          <mesh ref={a} geometry={gear}>
            <meshStandardMaterial color="#d6dee6" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh ref={b} geometry={small} position={[1.48, 0.12, 0]}>
            <meshStandardMaterial color={COLORS.orange} metalness={0.6} roughness={0.3} />
          </mesh>
          <Dimension start={[-1.08, 0, 0.2]} end={[1.08, 0, 0.2]} offset={[0, -1.35, 0]} label="Ø 216" />
        </group>
      </Float>
      <Axes position={[-1.7, 0.01, 0.8]} size={0.8} />
    </>
  )
}

export function EmblemScene() {
  return (
    <Stage className="stage--fill" camera={{ position: [3, 3, 6], fov: 35 }} label="Rotating gear model with dimensions">
      <Emblem />
    </Stage>
  )
}
