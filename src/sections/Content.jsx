import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { whyUs, process, careers, testimonials, gallery, galleryCategories, facilities, faqs } from '../data/site'
import Glyph from '../components/Glyph'
import BlueprintArt from '../components/BlueprintArt'
import { SectionHead, Reveal, Tilt, Accordion, Magnetic } from '../components/ui'
import { getLenis } from '../hooks/useLenis'

/* Image that prefers a real photo (AVIF/WebP) and falls back to generated art */
export function Media({ item, animate = false }) {
  if (item.image) {
    const base = item.image.replace(/\.(avif|webp|jpe?g|png)$/i, '')
    return (
      <picture>
        <source srcSet={`${base}.avif`} type="image/avif" />
        <source srcSet={`${base}.webp`} type="image/webp" />
        <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
      </picture>
    )
  }
  return <BlueprintArt variant={item.art} title={item.title} animate={animate} />
}

/* WHY ------------------------------------------------------------------ */
export function WhyUs() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <SectionHead id="why-title" eyebrow="Why CADD-EXPERTS" title={<>Built Like an Engineering Studio.<br /><em>Run Like a Training Institute.</em></>} />
        <div className="why-grid">
          {whyUs.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.08}>
              <Tilt className="why-card">
                <span className="why-card__icon" style={{ animationDelay: `${i * -0.7}s` }}><Glyph name={w.icon} size={46} /></span>
                <span className="why-card__n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* PROCESS ---------------------------------------------------------------- */
export function TrainingProcess() {
  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" eyebrow="Training Process" title="Six Steps From Learner to Design Engineer" align="center" />
        <ol className="timeline">
          {process.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 0.08} className="timeline__item">
              <span className="timeline__node" aria-hidden="true"><i /></span>
              <span className="timeline__n mono">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* CAREERS ---------------------------------------------------------------- */
export function CareerPaths({ cta = true, headingLevel = 'h2' }) {
  return (
    <section className="section careers" aria-labelledby="careers-title">
      <div className="container">
        <SectionHead id="careers-title" as={headingLevel} eyebrow="Career Paths" title={<>Turn CAD Skills <em>Into a Career</em></>} intro="Every program maps to real job roles. Build the skills and the portfolio that those roles ask for." />
        <div className="career-cols">
          {[['civil', 'Civil Engineering', 'building'], ['mechanical', 'Mechanical Engineering', 'gear']].map(([k, label, icon]) => (
            <Reveal key={k} className={`career-col career-col--${k}`}>
              <div className="career-col__head">
                <span className="career-col__icon"><Glyph name={icon} size={36} /></span>
                <h3>{label}</h3>
              </div>
              <ul>
                {careers[k].map((c, i) => (
                  <li key={c} style={{ '--i': i }}>
                    <span className="career-col__dot" aria-hidden="true" />
                    <span>{c}</span>
                    <span className="career-col__arrow" aria-hidden="true">↗</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        {cta && (
          <div className="center-row">
            <Magnetic to="/enroll" variant="accent" arrow>Start Your Engineering Career</Magnetic>
          </div>
        )}
      </div>
    </section>
  )
}

/* TESTIMONIALS ----------------------------------------------------------- */
export function Testimonials() {
  const [i, setI] = useState(0)
  const n = testimonials.length
  const go = useCallback((d) => setI((v) => (v + d + n) % n), [n])
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
  }, [go, paused])

  return (
    <section className="section testimonials" aria-labelledby="t-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container">
        <SectionHead id="t-title" eyebrow="Student Testimonials" title="What Our Engineers Say" align="center" />
        <div className="t-stage" aria-roledescription="carousel" aria-label="Student testimonials">
          {testimonials.map((t, k) => {
            let off = k - i
            if (off > n / 2) off -= n
            if (off < -n / 2) off += n
            const abs = Math.abs(off)
            return (
              <motion.figure
                key={k}
                className="t-card"
                aria-hidden={off !== 0}
                animate={{
                  x: `${off * 70}%`,
                  rotateY: off * -30,
                  z: -abs * 220,
                  opacity: abs > 2 ? 0 : abs === 0 ? 1 : abs === 1 ? 0.4 : 0.12,
                  scale: 1 - abs * 0.1,
                  filter: abs ? 'blur(2px) saturate(0.6)' : 'blur(0px) saturate(1)',
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: 10 - abs, pointerEvents: off === 0 ? 'auto' : 'none' }}
              >
                <div className="t-card__quote" aria-hidden="true">“</div>
                <blockquote>{t.text}</blockquote>
                <figcaption>
                  {t.photo ? <img src={t.photo} alt="" className="t-card__avatar" loading="lazy" /> : <span className="t-card__avatar">{t.initials}</span>}
                  <span>
                    <strong>{t.name}</strong>
                    <span className="mono">{t.course} · {t.discipline}</span>
                  </span>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
        <div className="t-controls">
          <button className="round-btn" onClick={() => go(-1)} aria-label="Previous testimonial">←</button>
          <div className="t-dots">
            {testimonials.map((_, k) => (
              <button key={k} className={k === i ? 'is-on' : ''} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} aria-current={k === i} />
            ))}
          </div>
          <button className="round-btn" onClick={() => go(1)} aria-label="Next testimonial">→</button>
        </div>
      </div>
    </section>
  )
}

/* GALLERY ---------------------------------------------------------------- */
export function Gallery({ limit, headingLevel = 'h2' }) {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(-1)
  let items = gallery.filter((g) => cat === 'All' || g.cat === cat)
  if (limit) items = items.slice(0, limit)

  useEffect(() => {
    if (open < 0) return
    getLenis()?.stop()
    const key = (e) => {
      if (e.key === 'Escape') setOpen(-1)
      if (e.key === 'ArrowRight') setOpen((v) => (v + 1) % items.length)
      if (e.key === 'ArrowLeft') setOpen((v) => (v - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      getLenis()?.start()
    }
  }, [open, items.length])

  return (
    <section className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHead id="gallery-title" as={headingLevel} eyebrow="Gallery" title="Inside the Engineering Lab" />
        <div className="filter-row" role="tablist" aria-label="Gallery categories">
          {galleryCategories.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip-btn ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <motion.div layout className="masonry">
          <AnimatePresence mode="popLayout">
            {items.map((g, k) => (
              <motion.button
                layout
                key={g.title + g.cat}
                className={`masonry__item ${g.tall ? 'is-tall' : ''} ${g.wide ? 'is-wide' : ''}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45 }}
                onClick={() => setOpen(k)}
                aria-label={`Open ${g.title}`}
              >
                <Media item={g} />
                <span className="masonry__cap"><span className="mono">{g.cat}</span>{g.title}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open >= 0 && items[open] && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={items[open].title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(-1)}>
            <motion.div key={open} className="lightbox__frame" initial={{ scale: 0.9, opacity: 0, rotateX: 10 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <Media item={items[open]} animate />
              <p className="lightbox__cap"><span className="mono">{items[open].cat}</span> {items[open].title}</p>
            </motion.div>
            <button className="lightbox__btn is-prev" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length) }} aria-label="Previous image">←</button>
            <button className="lightbox__btn is-next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length) }} aria-label="Next image">→</button>
            <button className="lightbox__close" onClick={() => setOpen(-1)} aria-label="Close viewer" autoFocus>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* FACILITIES ------------------------------------------------------------- */
export function Facilities() {
  return (
    <section className="section facilities" aria-labelledby="fac-title">
      <div className="container">
        <SectionHead id="fac-title" eyebrow="Facilities" title="A Studio Built for Engineering Design" />
      </div>
      <div className="fac-track">
        {facilities.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06} className="fac-card">
            <div className="fac-card__media"><Media item={f} /></div>
            <div className="fac-card__body">
              <span className="mono label">{String(i + 1).padStart(2, '0')} / {String(facilities.length).padStart(2, '0')}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* FAQ -------------------------------------------------------------------- */
export function FAQ({ headingLevel = 'h2', limit }) {
  const list = limit ? faqs.slice(0, limit) : faqs
  return (
    <section className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div>
          <SectionHead id="faq-title" as={headingLevel} eyebrow="FAQ" title="Questions, Answered" intro="Everything you need to know before you start. Still unsure? Talk to a counsellor." />
          <Magnetic to="/contact" variant="ghost" arrow>Ask a Question</Magnetic>
        </div>
        <Accordion items={list} />
      </div>
    </section>
  )
}
