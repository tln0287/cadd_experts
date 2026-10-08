import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import Scene3D from '../components/Scene3D'
import { Magnetic } from '../components/ui'
import { site } from '../data/site'
import { usePrefersReducedMotion } from '../hooks/useDevice'

/**
 * Signature hero. Intro sequence:
 * background → grid → CAD lines draw → (3D assembles) → annotations →
 * brand reveal → headline → CTAs
 */
export default function Hero() {
  const root = useRef(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero__grid', { opacity: 0, duration: 1.2 }, 0.1)
        .fromTo('.hero__lines path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, stagger: 0.12, ease: 'power2.inOut' }, 0.5)
        .from('.hero__coords span', { opacity: 0, y: 6, stagger: 0.08, duration: 0.6 }, 2.2)
        .from('.hero__brand', { opacity: 0, letterSpacing: '0.6em', duration: 1.1 }, 2.6)
        .from('.hero__title .word > span', { yPercent: 110, duration: 1.1, stagger: 0.07, ease: 'power4.out' }, 2.85)
        .from('.hero__lead', { opacity: 0, y: 20, duration: 0.9 }, 3.3)
        .from('.hero__ctas > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, 3.5)
        .from('.hero__specs > *', { opacity: 0, y: 10, stagger: 0.08, duration: 0.6 }, 3.8)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  // [word, style] — 1 = accent, 2 = outline
  const lines = [
    [['Design', 0], ['the', 0]],
    [['Future.', 1]],
    [['Engineer', 0], ['the', 0]],
    [['World.', 2]],
  ]

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true" />
      <svg className="hero__lines" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M0 640H1440" />
        <path pathLength="1" d="M760 0V900" />
        <path pathLength="1" d="M0 160H1440" className="faint" />
        <path pathLength="1" d="M1080 900L1440 520" className="faint" />
        <path pathLength="1" d="M60 900V60" className="faint" />
        <path pathLength="1" d="M880 640a120 120 0 0 1 120 -120" className="accent" />
      </svg>
      <div className="hero__coords" aria-hidden="true">
        <span style={{ left: '41%', top: '14%' }}>X 0.000 · Y 0.000</span>
        <span style={{ left: '53.5%', top: '6%' }}>A-A</span>
        <span style={{ right: '3%', bottom: '8%' }}>Ø 1080 ±0.05</span>
        <span style={{ right: '3%', top: '14%' }}>GRID 1:100</span>
      </div>

      <div className="hero__scene">
        <Scene3D kind="hero" fallback="building" fallbackTitle="Civil + Mechanical" />
      </div>

      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__brand">
            <span className="hero__brand-dot" aria-hidden="true" />
            {site.name} · CAD Training Institute
          </p>
          <h1 className="hero__title" id="hero-title">
            {lines.map((line, li) => (
              <span className="line" key={li}>
                {line.map(([w, style], wi) => (
                  <span className={`word${style === 1 ? ' is-em' : style === 2 ? ' is-outline' : ''}`} key={wi}>
                    <span>{w}</span>{' '}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero__lead">
            Master industry-ready CAD, BIM and engineering design skills with professional training in Civil and Mechanical Engineering.
          </p>
          <div className="hero__ctas">
            <Magnetic to="/courses" variant="accent" arrow>Explore Courses</Magnetic>
            <Magnetic to="/enroll" variant="ghost">Join CADD-EXPERTS</Magnetic>
            <Link to="/courses" className="link-arrow">View Our Programs <span aria-hidden="true">→</span></Link>
          </div>
          <dl className="hero__specs">
            <div><dt>Domains</dt><dd>Civil · Mechanical</dd></div>
            <div><dt>Platforms</dt><dd>20+ CAD / BIM / CAE</dd></div>
            <div><dt>Format</dt><dd>Project-based</dd></div>
          </dl>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
