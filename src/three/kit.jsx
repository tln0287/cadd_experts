import { useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export const COLORS = {
  bg: '#07111F',
  blue: '#1687D9',
  cyan: '#20C4D9',
  silver: '#B8C4CE',
  white: '#F5F8FA',
  orange: '#FF8A3D',
}
const BLUE = new THREE.Color(COLORS.blue)

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const damp = THREE.MathUtils.damp

/* ------------------------------------------------------------------ */
/* Global pointer (normalised -1..1), shared by every scene so models  */
/* react to the mouse even when HTML sits on top of the canvas.        */
/* ------------------------------------------------------------------ */
export const pointer = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    },
    { passive: true },
  )
}

/* ------------------------------------------------------------------ */
/* Blueprint material kit                                              */
/* Every solid gets a matching edge outline. `applyKit` blends the     */
/* whole model between a rendered solid and a CAD wire drawing.        */
/* ------------------------------------------------------------------ */
export function useKit(clipNormal = [0, 0, -1]) {
  return useMemo(() => {
    const plane = new THREE.Plane(new THREE.Vector3(...clipNormal), 100)
    const solids = []
    const edges = []
    const solid = (opts = {}) => {
      const { alt, ...rest } = opts
      const m = new THREE.MeshStandardMaterial({
        transparent: true,
        clippingPlanes: [plane],
        side: THREE.DoubleSide,
        ...rest,
      })
      m.userData.base = m.color.clone()
      m.userData.baseOpacity = rest.opacity ?? 1
      if (alt) m.userData.alt = new THREE.Color(alt)
      solids.push(m)
      return m
    }
    const edge = (color = COLORS.cyan) => {
      const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25, clippingPlanes: [plane] })
      edges.push(m)
      return m
    }
    return { plane, solids, edges, solid, edge }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/** blueprint: 0 solid → 1 drawing. alt: blend toward each material's alt colour (analysis). */
export function applyKit(kit, { blueprint = 0, wireframe = false, alt = 0, section = 0, sectionAt = 0 }) {
  for (const m of kit.solids) {
    const o = m.userData.baseOpacity * (1 - 0.94 * blueprint)
    m.opacity = o
    m.depthWrite = o > 0.6
    m.wireframe = wireframe
    m.color.copy(m.userData.base).lerp(BLUE, blueprint * 0.5)
    if (m.userData.alt) m.color.lerp(m.userData.alt, alt)
  }
  const eo = wireframe ? 0 : 0.16 + 0.84 * blueprint
  for (const m of kit.edges) m.opacity = eo
  // section: 0 = no cut (plane far away), 1 = cut at `sectionAt`
  kit.plane.constant = THREE.MathUtils.lerp(100, sectionAt, section)
}

const edgeCache = new WeakMap()
export function edgesOf(geometry) {
  let e = edgeCache.get(geometry)
  if (!e) {
    e = new THREE.EdgesGeometry(geometry, 30)
    edgeCache.set(geometry, e)
  }
  return e
}

/** A mesh plus its CAD edge outline. */
export function Part({ geometry, material, edge, children, ...props }) {
  return (
    <group {...props}>
      <mesh geometry={geometry} material={material} />
      {edge && <lineSegments geometry={edgesOf(geometry)} material={edge} />}
      {children}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Dimension line with extension lines, ticks and a floating label     */
/* ------------------------------------------------------------------ */
export function Dimension({ start, end, offset = [0, 0, 0.4], label, visible = true, color = COLORS.cyan }) {
  const pts = useMemo(() => {
    const a = new THREE.Vector3(...start)
    const b = new THREE.Vector3(...end)
    const off = new THREE.Vector3(...offset)
    const a2 = a.clone().add(off)
    const b2 = b.clone().add(off)
    const da = a.clone().add(off.clone().multiplyScalar(0.8))
    const db = b.clone().add(off.clone().multiplyScalar(0.8))
    const dir = db.clone().sub(da).normalize()
    const n = off.clone().normalize()
    const tick = dir.clone().add(n).normalize().multiplyScalar(0.07)
    return {
      segs: [
        a.clone().add(off.clone().multiplyScalar(0.1)), a2,
        b.clone().add(off.clone().multiplyScalar(0.1)), b2,
        da, db,
        da.clone().sub(tick), da.clone().add(tick),
        db.clone().sub(tick), db.clone().add(tick),
      ],
      mid: da.clone().add(db).multiplyScalar(0.5).add(n.multiplyScalar(0.12)),
    }
  }, [start, end, offset])
  if (!visible) return null
  return (
    <group>
      <Line points={pts.segs} segments color={color} lineWidth={1.1} transparent opacity={0.85} />
      <Html position={pts.mid} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span className="dim-label">{label}</span>
      </Html>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Glowing CAD coordinate system                                       */
/* ------------------------------------------------------------------ */
export function Axes({ size = 1.4, labels = true, ...props }) {
  const ring = useRef()
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.25
  })
  const axes = [
    { d: [size, 0, 0], c: COLORS.orange, l: 'X', r: [0, 0, -Math.PI / 2] },
    { d: [0, size, 0], c: COLORS.cyan, l: 'Y', r: [0, 0, 0] },
    { d: [0, 0, size], c: COLORS.blue, l: 'Z', r: [Math.PI / 2, 0, 0] },
  ]
  return (
    <group {...props}>
      {axes.map((a) => (
        <group key={a.l}>
          <Line points={[[0, 0, 0], a.d]} color={a.c} lineWidth={2.2} />
          <Line points={[[0, 0, 0], a.d.map((v) => v * 1.8)]} color={a.c} lineWidth={1} transparent opacity={0.25} dashed dashSize={0.08} gapSize={0.06} />
          <mesh position={a.d} rotation={a.r}>
            <coneGeometry args={[0.05, 0.16, 16]} />
            <meshBasicMaterial color={a.c} toneMapped={false} />
          </mesh>
          {labels && (
            <Html position={a.d.map((v) => v * 1.12)} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
              <span className="axis-label" style={{ color: a.c }}>{a.l}</span>
            </Html>
          )}
        </group>
      ))}
      <mesh>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <group ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.5, 0.515, 96, 1, 0, Math.PI * 1.6]} />
          <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.66, 0.67, 96]} />
          <meshBasicMaterial color={COLORS.blue} transparent opacity={0.35} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/** Floating annotation tag attached to a 3D point. */
export function Tag({ position, children, accent, delay = 0 }) {
  const [show, setShow] = useState(delay === 0)
  useEffect(() => {
    if (delay === 0) return
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  if (!show) return null
  return (
    <Html position={position} style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
      <span className={`scene-tag${accent ? ' is-accent' : ''}`}>{children}</span>
    </Html>
  )
}
