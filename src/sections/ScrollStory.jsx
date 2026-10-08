import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { getLenis } from '../hooks/useLenis'

/**
 * Pinned, scroll-driven storytelling block.
 * The section is `steps.length * vhPerStep` tall; a sticky viewport shows
 * the 3D scene for the current step while the step list tracks progress.
 */
export default function ScrollStory({ id, eyebrow, title, steps, renderScene, vhPerStep = 70, side = 'left', footer, labelledBy }) {
  const ref = useRef(null)
  const { step } = useScrollProgress(ref, steps.length)
  const cur = steps[step]

  const jump = (i) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    const y = top + (total * (i + 0.5)) / steps.length
    const l = getLenis()
    l ? l.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section id={id} ref={ref} className={`story story--${side}`} style={{ height: `${steps.length * vhPerStep + 100}vh` }} aria-labelledby={labelledBy}>
      <div className="story__sticky">
        <div className="story__scene">{renderScene(step)}</div>
        <div className="story__vignette" aria-hidden="true" />
        <div className="container story__ui">
          <div className="story__panel">
            <p className="eyebrow"><span className="eyebrow__tick" />{eyebrow}</p>
            <h2 className="section-title story__title" id={labelledBy}>{title}</h2>
            <ol className="story__steps">
              {steps.map((s, i) => (
                <li key={s.name} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                  <button onClick={() => jump(i)} aria-current={i === step ? 'step' : undefined}>
                    <span className="story__n mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="story__name">{s.name}</span>
                  </button>
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait">
              {cur.text && (
                <motion.p
                  key={cur.name}
                  className="story__text"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  aria-live="polite"
                >
                  {cur.text}
                </motion.p>
              )}
            </AnimatePresence>
            {footer}
          </div>
          <div className="story__readout mono" aria-hidden="true">
            <span>STAGE {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
            <span className="story__bar"><i style={{ transform: `scaleX(${(step + 1) / steps.length})` }} /></span>
            <span>{cur.name.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
