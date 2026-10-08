import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, Grid } from '@react-three/drei'
import { useInView } from '../hooks/useScrollProgress'
import { getDeviceTier } from '../hooks/useDevice'
import { COLORS } from './kit'

/**
 * Canvas wrapper used by every 3D scene:
 *  - mounts WebGL only when the section approaches the viewport
 *  - pauses rendering while off-screen
 *  - scales pixel ratio by device tier
 */
export default function Stage({ children, camera = { position: [6, 4, 8], fov: 35 }, className = '', grid = true, label, style }) {
  const wrap = useRef(null)
  const near = useInView(wrap, { rootMargin: '300px', once: true })
  const visible = useInView(wrap, { rootMargin: '50px' })
  const tier = getDeviceTier()
  const dpr = tier === 'high' ? [1, 2] : [1, 1.4]

  return (
    <div ref={wrap} className={`stage ${className}`} style={style} role="img" aria-label={label}>
      {near && (
        <Canvas
          dpr={dpr}
          camera={camera}
          frameloop={visible ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.localClippingEnabled = true
          }}
        >
          <Suspense fallback={null}>
            <Lights />
            {grid && (
              <Grid
                position={[0, -0.001, 0]}
                args={[40, 40]}
                cellSize={0.3}
                cellThickness={0.6}
                cellColor="#123049"
                sectionSize={1.5}
                sectionThickness={1}
                sectionColor="#1a5a8a"
                fadeDistance={22}
                fadeStrength={1.6}
                infiniteGrid
              />
            )}
            {children}
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 6]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-6, 4, -4]} intensity={0.6} color={COLORS.cyan} />
      <pointLight position={[0, 3, 4]} intensity={6} distance={14} color={COLORS.blue} />
      {/* Studio reflections built from light panels — no HDR download needed */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, -6]} scale={[12, 3, 1]} color="#dff4ff" />
        <Lightformer form="rect" intensity={1.4} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color={COLORS.cyan} />
        <Lightformer form="rect" intensity={1.2} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={0.8} position={[0, 6, 4]} scale={4} color={COLORS.orange} />
      </Environment>
    </>
  )
}
