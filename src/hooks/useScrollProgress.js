import { useEffect, useRef, useState } from 'react'

/**
 * Tracks how far a (tall, sticky) section has been scrolled through.
 * Returns a mutable ref (0..1, for per-frame 3D use without re-renders)
 * and a discrete `step` state for UI that needs to re-render.
 */
export function useScrollProgress(ref, steps = 1) {
  const progress = useRef(0)
  const [step, setStep] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
      progress.current = p
      const s = Math.min(steps - 1, Math.floor(p * steps))
      setStep((prev) => (prev === s ? prev : s))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, steps])

  return { progress, step }
}

/** Scroll position relative to the first viewport (0 at top, 1 after one screen). */
export function useHeroScroll() {
  const progress = useRef(0)
  useEffect(() => {
    const fn = () => {
      progress.current = Math.min(1.5, window.scrollY / window.innerHeight)
    }
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return progress
}

/** Becomes true once (or while) an element is near the viewport. */
export function useInView(ref, { rootMargin = '200px', once = false } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, once])
  return inView
}
