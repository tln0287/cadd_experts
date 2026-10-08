import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useKit, applyKit, Part, Dimension, damp, clamp01, COLORS } from './kit'

/**
 * Parametric multi-storey building used across the site.
 *
 * `targets` (plain object, may be mutated every frame by the parent):
 *   plan, grid, columns, beams, slabs, mep, facade, blueprint, section, analysis   (0..1)
 *   wireframe (bool)
 * Values are damped internally so any change animates smoothly.
 */
export const BUILDING_DEFAULTS = {
  plan: 0, grid: 0, columns: 1, beams: 1, slabs: 1, mep: 0, facade: 1,
  blueprint: 0, section: 0, analysis: 0, wireframe: false,
}

export default function Building({ targets, floors = 6, nx = 3, nz = 2, bay = [1.2, 1.1], h = 0.6, dims = false, speed = 2.6, ...props }) {
  const kit = useKit([0, 0, -1])
  const cur = useRef({ ...BUILDING_DEFAULTS, ...targets })
  const tRef = useRef(targets)
  tRef.current = targets

  const W = nx * bay[0]
  const D = nz * bay[1]
  const H = floors * h

  const g = useMemo(() => {
    const colXs = Array.from({ length: nx + 1 }, (_, i) => -W / 2 + i * bay[0])
    const colZs = Array.from({ length: nz + 1 }, (_, j) => -D / 2 + j * bay[1])
    const col = new THREE.BoxGeometry(0.11, H, 0.11).translate(0, H / 2, 0)
    const beamX = new THREE.BoxGeometry(W, 0.07, 0.08)
    const beamZ = new THREE.BoxGeometry(0.08, 0.07, D)
    const slab = new THREE.BoxGeometry(W + 0.16, 0.05, D + 0.16)
    const panelX = new THREE.PlaneGeometry(bay[0] - 0.03, h - 0.07)
    const panelZ = new THREE.PlaneGeometry(bay[1] - 0.03, h - 0.07)
    const riser = new THREE.CylinderGeometry(0.035, 0.035, H, 12).translate(0, H / 2, 0)
    const ductX = new THREE.CylinderGeometry(0.025, 0.025, W - 0.2, 10).rotateZ(Math.PI / 2)
    const ductZ = new THREE.CylinderGeometry(0.025, 0.025, D - 0.2, 10).rotateX(Math.PI / 2)
    const footing = new THREE.BoxGeometry(0.34, 0.12, 0.34)
    const core = new THREE.BoxGeometry(0.7, 0.35, 0.5)
    const arrow = new THREE.ConeGeometry(0.06, 0.2, 10).rotateX(Math.PI)

    // floor plan walls (pairs of points)
    const x0 = -W / 2, x1 = W / 2, z0 = -D / 2, z1 = D / 2, y = 0.01
    const P = (x, z) => [x, y, z]
    const plan = [
      P(x0, z0), P(x1, z0), P(x1, z0), P(x1, z1), P(x1, z1), P(x0, z1), P(x0, z1), P(x0, z0),
      P(x0 + bay[0], z0), P(x0 + bay[0], 0.15), P(x1 - bay[0], -0.15), P(x1 - bay[0], z1),
      P(x0, 0), P(x0 + bay[0] * 0.7, 0), P(x1 - bay[0], -0.15), P(x1, -0.15),
      P(x0 + bay[0], 0.15), P(x0 + bay[0] * 2, 0.15),
    ]
    // door swings
    const arc = (cx, cz, r, a0, a1) => {
      const pts = []
      const n = 10
      for (let i = 0; i < n; i++) {
        const t0 = a0 + ((a1 - a0) * i) / n
        const t1 = a0 + ((a1 - a0) * (i + 1)) / n
        pts.push(P(cx + Math.cos(t0) * r, cz + Math.sin(t0) * r), P(cx + Math.cos(t1) * r, cz + Math.sin(t1) * r))
      }
      return pts
    }
    plan.push(...arc(x0 + bay[0], 0.15, 0.35, 0, Math.PI / 2), ...arc(x1 - bay[0], -0.15, 0.35, Math.PI, Math.PI * 1.5))

    return { colXs, colZs, col, beamX, beamZ, slab, panelX, panelZ, riser, ductX, ductZ, footing, core, arrow, plan }
  }, [W, D, H, h, nx, nz, bay])

  const mats = useMemo(() => {
    // per-column materials so analysis can colour them by load
    const colMats = []
    g.colXs.forEach((x, i) =>
      g.colZs.forEach((z, j) => {
        const interior = i > 0 && i < nx && j > 0 && j < nz
        const edgeCol = i === 0 || i === nx || j === 0 || j === nz
        const corner = (i === 0 || i === nx) && (j === 0 || j === nz)
        const alt = interior ? COLORS.orange : corner ? COLORS.blue : edgeCol ? COLORS.cyan : COLORS.cyan
        colMats.push(kit.solid({ color: '#c9d3dc', metalness: 0.2, roughness: 0.55, alt }))
      }),
    )
    return {
      colMats,
      concrete: kit.solid({ color: '#9fb0be', metalness: 0.15, roughness: 0.7 }),
      steel: kit.solid({ color: '#6f8293', metalness: 0.6, roughness: 0.35 }),
      glass: kit.solid({ color: COLORS.cyan, metalness: 0.9, roughness: 0.08, opacity: 0.22, emissive: '#0b3b55', emissiveIntensity: 0.4 }),
      mepA: kit.solid({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 0.35 }),
      mepB: kit.solid({ color: COLORS.cyan, emissive: COLORS.cyan, emissiveIntensity: 0.35 }),
      edge: kit.edge(COLORS.cyan),
      edgeSoft: kit.edge('#6fb6e8'),
      arrow: new THREE.MeshBasicMaterial({ color: COLORS.orange, transparent: true, opacity: 0, toneMapped: false }),
    }
  }, [g, kit, nx, nz])

  const refs = {
    columns: useRef(), floorsBeams: useRef([]), floorsSlabs: useRef([]), facade: useRef(), mep: useRef(),
    ducts: useRef([]), plan: useRef(), grid: useRef(), arrows: useRef(), footings: useRef(),
  }

  useFrame((_, dt) => {
    const t = { ...BUILDING_DEFAULTS, ...tRef.current }
    const c = cur.current
    for (const k of ['plan', 'grid', 'columns', 'beams', 'slabs', 'mep', 'facade', 'blueprint', 'section', 'analysis']) {
      c[k] = damp(c[k], t[k], speed, dt)
    }
    applyKit(kit, { blueprint: c.blueprint, wireframe: t.wireframe, alt: c.analysis, section: c.section, sectionAt: 0 })

    if (refs.columns.current) {
      refs.columns.current.scale.y = Math.max(0.001, c.columns)
      refs.columns.current.visible = c.columns > 0.01
    }
    if (refs.footings.current) refs.footings.current.visible = c.columns > 0.01 || c.grid > 0.3
    refs.floorsBeams.current.forEach((grp, i) => {
      if (!grp) return
      const v = clamp01(c.beams * floors - i)
      grp.visible = v > 0.01
      grp.scale.set(Math.max(v, 0.001), 1, Math.max(v, 0.001))
    })
    refs.floorsSlabs.current.forEach((grp, i) => {
      if (!grp) return
      const v = clamp01(c.slabs * floors - i)
      grp.visible = v > 0.01
      grp.position.y = (i + 1) * h + (1 - v) * 0.9
    })
    if (refs.facade.current) {
      refs.facade.current.visible = c.facade > 0.01
      refs.facade.current.scale.y = Math.max(0.001, c.facade)
    }
    if (refs.mep.current) {
      refs.mep.current.visible = c.mep > 0.01
      refs.mep.current.scale.y = Math.max(0.001, c.mep)
    }
    refs.ducts.current.forEach((d, i) => {
      if (d) d.visible = c.mep * floors > i + 0.2
    })
    if (refs.plan.current) {
      refs.plan.current.material.opacity = c.plan
      refs.plan.current.visible = c.plan > 0.01
    }
    if (refs.grid.current) {
      refs.grid.current.visible = c.grid > 0.01
      refs.grid.current.traverse((o) => {
        if (o.material) o.material.opacity = c.grid * (o.userData.op ?? 1)
      })
    }
    mats.arrow.opacity = c.analysis
    if (refs.arrows.current) {
      refs.arrows.current.visible = c.analysis > 0.01
      refs.arrows.current.position.y = H + 0.35 + Math.sin(performance.now() / 300) * 0.04
    }
  })

  const ext = 0.7
  return (
    <group {...props}>
      {/* floor plan */}
      <Line ref={refs.plan} points={g.plan} segments color={COLORS.cyan} lineWidth={1.6} transparent opacity={0} />

      {/* structural grid with bubbles */}
      <group ref={refs.grid}>
        {g.colXs.map((x, i) => (
          <group key={`gx${i}`}>
            <Line points={[[x, 0.005, -D / 2 - ext], [x, 0.005, D / 2 + ext]]} color={COLORS.blue} lineWidth={1} dashed dashSize={0.12} gapSize={0.06} transparent />
            <mesh position={[x, 0.005, D / 2 + ext + 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.1, 0.12, 32]} />
              <meshBasicMaterial color={COLORS.cyan} transparent toneMapped={false} />
            </mesh>
          </group>
        ))}
        {g.colZs.map((z, j) => (
          <group key={`gz${j}`}>
            <Line points={[[-W / 2 - ext, 0.005, z], [W / 2 + ext, 0.005, z]]} color={COLORS.blue} lineWidth={1} dashed dashSize={0.12} gapSize={0.06} transparent />
            <mesh position={[-W / 2 - ext - 0.14, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.1, 0.12, 32]} />
              <meshBasicMaterial color={COLORS.orange} transparent toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* footings */}
      <group ref={refs.footings}>
        {g.colXs.map((x) => g.colZs.map((z) => (
          <Part key={`f${x}${z}`} geometry={g.footing} material={mats.concrete} edge={mats.edgeSoft} position={[x, -0.06, z]} />
        )))}
      </group>

      {/* columns */}
      <group ref={refs.columns}>
        {g.colXs.map((x, i) => g.colZs.map((z, j) => (
          <Part key={`c${i}${j}`} geometry={g.col} material={mats.colMats[i * g.colZs.length + j]} edge={mats.edge} position={[x, 0, z]} />
        )))}
      </group>

      {/* beams, floor by floor */}
      {Array.from({ length: floors }, (_, f) => (
        <group key={`b${f}`} ref={(el) => (refs.floorsBeams.current[f] = el)} position={[0, (f + 1) * h - 0.06, 0]}>
          {g.colZs.map((z) => <Part key={`bx${z}`} geometry={g.beamX} material={mats.steel} edge={mats.edge} position={[0, 0, z]} />)}
          {g.colXs.map((x) => <Part key={`bz${x}`} geometry={g.beamZ} material={mats.steel} edge={mats.edge} position={[x, 0, 0]} />)}
        </group>
      ))}

      {/* slabs */}
      {Array.from({ length: floors }, (_, f) => (
        <group key={`s${f}`} ref={(el) => (refs.floorsSlabs.current[f] = el)} position={[0, (f + 1) * h, 0]}>
          <Part geometry={g.slab} material={mats.concrete} edge={mats.edge} />
        </group>
      ))}

      {/* MEP risers and ducts */}
      <group ref={refs.mep}>
        <Part geometry={g.riser} material={mats.mepA} position={[0.12, 0, 0.12]} />
        <Part geometry={g.riser} material={mats.mepB} position={[-0.12, 0, 0.12]} />
        <Part geometry={g.riser} material={mats.mepB} position={[0.12, 0, -0.12]} />
      </group>
      {Array.from({ length: floors }, (_, f) => (
        <group key={`d${f}`} ref={(el) => (refs.ducts.current[f] = el)} position={[0, (f + 1) * h - 0.14, 0]}>
          <Part geometry={g.ductX} material={mats.mepB} position={[0, 0, D / 4]} />
          <Part geometry={g.ductZ} material={mats.mepA} position={[W / 4, 0, 0]} />
        </group>
      ))}

      {/* glazed facade */}
      <group ref={refs.facade}>
        {Array.from({ length: floors }, (_, f) => {
          const y = f * h + h / 2 + 0.02
          return (
            <group key={`fa${f}`}>
              {Array.from({ length: nx }, (_, i) => {
                const x = -W / 2 + bay[0] * (i + 0.5)
                return [
                  <Part key={`fz${i}a`} geometry={g.panelX} material={mats.glass} edge={mats.edgeSoft} position={[x, y, D / 2 + 0.07]} />,
                  <Part key={`fz${i}b`} geometry={g.panelX} material={mats.glass} edge={mats.edgeSoft} position={[x, y, -D / 2 - 0.07]} />,
                ]
              })}
              {Array.from({ length: nz }, (_, j) => {
                const z = -D / 2 + bay[1] * (j + 0.5)
                return [
                  <Part key={`fx${j}a`} geometry={g.panelZ} material={mats.glass} edge={mats.edgeSoft} position={[W / 2 + 0.07, y, z]} rotation={[0, Math.PI / 2, 0]} />,
                  <Part key={`fx${j}b`} geometry={g.panelZ} material={mats.glass} edge={mats.edgeSoft} position={[-W / 2 - 0.07, y, z]} rotation={[0, Math.PI / 2, 0]} />,
                ]
              })}
            </group>
          )
        })}
        <Part geometry={g.core} material={mats.concrete} edge={mats.edge} position={[W / 4, H + 0.2, 0]} />
      </group>

      {/* analysis load arrows */}
      <group ref={refs.arrows}>
        {g.colXs.map((x) => g.colZs.map((z) => (
          <mesh key={`a${x}${z}`} geometry={g.arrow} material={mats.arrow} position={[x, 0, z]} />
        )))}
      </group>

      {/* dimensions */}
      <Dimension visible={dims} start={[-W / 2, 0, D / 2]} end={[W / 2, 0, D / 2]} offset={[0, 0, 0.7]} label={`${(W * 5).toFixed(1)} m`} />
      <Dimension visible={dims} start={[W / 2, 0, D / 2]} end={[W / 2, H, D / 2]} offset={[0.7, 0, 0]} label={`${(H * 5).toFixed(1)} m`} />
      <Dimension visible={dims} start={[-W / 2, H, -D / 2]} end={[-W / 2 + bay[0], H, -D / 2]} offset={[0, 0.45, 0]} label={`BAY ${(bay[0] * 5).toFixed(1)} m`} color={COLORS.orange} />
    </group>
  )
}
