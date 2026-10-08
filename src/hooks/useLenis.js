import { useEffect } from 'react'
import Lenis from 'lenis'

let instance = null
export const getLenis = () => instance

/** Smooth scrolling (disabled for reduced-motion users). */
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return
    instance = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf
    const loop = (t) => {
      instance.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      instance.destroy()
      instance = null
    }
  }, [enabled])
}
