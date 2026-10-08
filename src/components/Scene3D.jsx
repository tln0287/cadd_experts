import { lazy, Suspense, forwardRef, Component } from 'react'
import { getDeviceTier } from '../hooks/useDevice'
import BlueprintArt from './BlueprintArt'

// Three.js and every scene live in a separate chunk, loaded only when needed.
const load = (name) => lazy(() => import('../three/scenes').then((m) => ({ default: m[name] })))
const Lazy = {
  hero: load('HeroScene'),
  domain: load('DomainScene'),
  civil: load('CivilScene'),
  mech: load('MechScene'),
  reality: load('RealityScene'),
  viewer: load('ViewerScene'),
  emblem: load('EmblemScene'),
}

class GLBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Renders a 3D scene, or on low-end / no-WebGL devices an animated
 * technical drawing (`fallback` art variant) instead.
 */
const Scene3D = forwardRef(function Scene3D({ kind, fallback = 'building', fallbackTitle, ...props }, ref) {
  const Comp = Lazy[kind]
  const art = (
    <div className="scene-fallback">
      <BlueprintArt variant={fallback} title={fallbackTitle} />
    </div>
  )
  if (getDeviceTier() === 'low') return art
  return (
    <GLBoundary fallback={art}>
      <Suspense fallback={<div className="scene-loading"><span /></div>}>
        <Comp ref={ref} {...props} />
      </Suspense>
    </GLBoundary>
  )
})

export default Scene3D
