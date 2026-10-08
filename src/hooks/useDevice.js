import { useEffect, useState } from 'react'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

/**
 * Rendering tier for 3D content.
 *  high — desktop: full scenes, DPR up to 2
 *  mid  — tablets / modest laptops: reduced DPR and detail
 *  low  — low-end phones, no WebGL: animated SVG fallbacks instead of WebGL
 */
let cachedTier
export function getDeviceTier() {
  if (cachedTier) return cachedTier
  if (typeof window === 'undefined') return 'high'
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 768
  const saveData = navigator.connection?.saveData
  if (!hasWebGL() || saveData || (coarse && small && (cores <= 4 || mem <= 3))) cachedTier = 'low'
  else if (coarse || window.innerWidth < 1100 || cores <= 4) cachedTier = 'mid'
  else cachedTier = 'high'
  return cachedTier
}

export function useDeviceTier() {
  const [tier] = useState(getDeviceTier)
  return tier
}

export function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [bp])
  return m
}
