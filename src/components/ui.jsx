import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, animate } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/useDevice'

/* Magnetic button / link ------------------------------------------------ */
export function Magnetic({ to, href, children, variant = 'primary', className = '', arrow, onClick, type, ...rest }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  const cls = `btn btn--${variant} ${className}`
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {arrow && <span className="btn__arrow" aria-hidden="true">→</span>}
    </>
  )
  const common = { ref, className: cls, onMouseMove: onMove, onMouseLeave: onLeave, onClick, ...rest }
  if (to) return <Link to={to} {...common}>{inner}</Link>
  if (href) return <a href={href} {...common}>{inner}</a>
  return <button type={type || 'button'} {...common}>{inner}</button>
}

/* Tilt card -------------------------------------------------------------- */
export function Tilt({ children, className = '', max = 8, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${-py * max}deg`)
    el.style.setProperty('--ry', `${px * max}deg`)
    el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }
  return (
    <Tag ref={ref} className={`tilt ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </Tag>
  )
}

/* Scroll reveal ---------------------------------------------------------- */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const reduced = usePrefersReducedMotion()
  const M = motion[as]
  if (reduced) return <M className={className}>{children}</M>
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/* Section heading -------------------------------------------------------- */
export function SectionHead({ eyebrow, title, intro, align = 'left', as: H = 'h2', id }) {
  return (
    <header className={`section-head section-head--${align}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow"><span className="eyebrow__tick" />{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <H className="section-title" id={id}>{title}</H>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className="section-intro">{intro}</p>
        </Reveal>
      )}
    </header>
  )
}

/* Count-up number -------------------------------------------------------- */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)
  useEffect(() => {
    if (!inView || reduced) return
    const ctl = animate(0, value, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => ctl.stop()
  }, [inView, value, reduced])
  return (
    <span ref={ref} className="counter">
      {n.toLocaleString('en-IN')}
      <span className="counter__suffix">{suffix}</span>
    </span>
  )
}

/* Accordion -------------------------------------------------------------- */
export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q} className={`acc-item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button
                className="acc-q"
                aria-expanded={isOpen}
                aria-controls={`acc-${i}`}
                id={`acc-btn-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="acc-n">{String(i + 1).padStart(2, '0')}</span>
                <span>{it.q}</span>
                <span className="acc-icon" aria-hidden="true" />
              </button>
            </h3>
            <motion.div
              id={`acc-${i}`}
              role="region"
              aria-labelledby={`acc-btn-${i}`}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="acc-a"
            >
              <p>{it.a}</p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

/* Page header for inner pages ------------------------------------------- */
export function PageHero({ eyebrow, title, intro, children, code = 'SHT-01' }) {
  return (
    <section className="page-hero">
      <div className="page-hero__grid" aria-hidden="true" />
      <div className="container page-hero__inner">
        <div className="page-hero__text">
          <Reveal><p className="eyebrow"><span className="eyebrow__tick" />{eyebrow}</p></Reveal>
          <Reveal delay={0.08}><h1 className="page-title">{title}</h1></Reveal>
          {intro && <Reveal delay={0.16}><p className="page-intro">{intro}</p></Reveal>}
        </div>
        {children && <div className="page-hero__aside">{children}</div>}
      </div>
      <div className="page-hero__meta container" aria-hidden="true">
        <span>{code}</span><span>SCALE 1:1</span><span>REV A</span>
      </div>
    </section>
  )
}
