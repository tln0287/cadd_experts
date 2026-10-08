import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { courses } from '../data/site'
import Glyph from '../components/Glyph'
import { SectionHead, Tilt, Magnetic } from '../components/ui'
import { getLenis } from '../hooks/useLenis'

export function CourseCard({ course, onOpen }) {
  return (
    <Tilt className={`course-card course-card--${course.domain}`} as="article">
      <div className="course-card__glare" aria-hidden="true" />
      <div className="course-card__top">
        <span className="course-card__icon"><Glyph name={course.icon} size={44} /></span>
        <span className="chip">{course.domain === 'civil' ? 'Civil' : 'Mechanical'}</span>
      </div>
      <h3 className="course-card__title">{course.name}</h3>
      <p className="course-card__desc">{course.desc}</p>
      <dl className="course-card__meta">
        <div><dt>Duration</dt><dd>{course.duration}</dd></div>
        <div><dt>Level</dt><dd>{course.level}</dd></div>
      </dl>
      <div className="course-card__more">
        <p className="mono label">Software</p>
        <ul className="tags">{course.software.map((s) => <li key={s}>{s}</li>)}</ul>
        <p className="mono label">Careers</p>
        <p className="course-card__careers">{course.careers.join(' · ')}</p>
      </div>
      <button className="course-card__btn" onClick={() => onOpen(course)} aria-label={`View details for ${course.name}`}>
        View Details <span aria-hidden="true">→</span>
      </button>
    </Tilt>
  )
}

export function CourseModal({ course, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    if (!course) return
    const prev = document.activeElement
    closeRef.current?.focus()
    getLenis()?.stop()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('keydown', esc)
      getLenis()?.start()
      prev?.focus?.()
    }
  }, [course, onClose])

  return (
    <AnimatePresence>
      {course && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ y: 40, opacity: 0, rotateX: 8 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close">×</button>
            <div className="modal__head">
              <span className="course-card__icon"><Glyph name={course.icon} size={56} /></span>
              <div>
                <p className="eyebrow"><span className="eyebrow__tick" />{course.domain === 'civil' ? 'Civil Engineering' : 'Mechanical Engineering'} · {course.category}</p>
                <h2 id="modal-title" className="modal__title">{course.name}</h2>
              </div>
            </div>
            <p className="lead">{course.desc}</p>
            <div className="modal__grid">
              <div><p className="mono label">Duration</p><p>{course.duration}</p></div>
              <div><p className="mono label">Skill level</p><p>{course.level}</p></div>
              <div><p className="mono label">Software covered</p><ul className="tags">{course.software.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div><p className="mono label">Career opportunities</p><ul className="list-check">{course.careers.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
            <div className="modal__module">
              <p className="mono label">What you&apos;ll do</p>
              <ol className="steps-inline">
                <li>Fundamentals &amp; interface</li>
                <li>Guided modelling exercises</li>
                <li>Industry project</li>
                <li>Drawings &amp; portfolio review</li>
              </ol>
            </div>
            <div className="modal__ctas">
              <Magnetic to={`/enroll?course=${encodeURIComponent(course.name)}`} variant="accent" arrow>Enroll in {course.name}</Magnetic>
              <Magnetic to="/contact" variant="ghost">Talk to a Counsellor</Magnetic>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CourseExplorer({ domain = 'all', showTabs = true, limit, title = 'Master the Tools Used by Industry', eyebrow = 'Course Explorer', search = false, headingLevel = 'h2' }) {
  const [tab, setTab] = useState(domain)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const list = useMemo(() => {
    let l = courses.filter((c) => tab === 'all' || c.domain === tab)
    if (q) l = l.filter((c) => `${c.name} ${c.desc} ${c.software.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
    return limit ? l.slice(0, limit) : l
  }, [tab, q, limit])

  return (
    <section className="section courses" aria-labelledby="courses-title">
      <div className="container">
        <div className="courses__head">
          <SectionHead id="courses-title" eyebrow={eyebrow} title={title} as={headingLevel} />
          <div className="courses__controls">
            {showTabs && (
              <div className="tabs" role="tablist" aria-label="Filter courses by domain">
                {[['all', 'All'], ['civil', 'Civil'], ['mechanical', 'Mechanical']].map(([k, l]) => (
                  <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'is-active' : ''}`} onClick={() => setTab(k)}>
                    {tab === k && <motion.span layoutId="course-tab" className="tab__bg" />}
                    <span>{l}</span>
                  </button>
                ))}
              </div>
            )}
            {search && (
              <label className="search">
                <span className="sr-only">Search courses</span>
                <input type="search" placeholder="Search software or course…" value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
            )}
          </div>
        </div>

        <motion.div layout className="course-grid">
          <AnimatePresence mode="popLayout">
            {list.map((c, i) => (
              <motion.div
                layout
                key={c.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}
              >
                <CourseCard course={c} onOpen={setOpen} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="empty">No courses match “{q}”.</p>}
        {limit && (
          <div className="center-row">
            <Link to="/courses" className="link-arrow">View all {courses.length} courses <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </div>
      <CourseModal course={open} onClose={close} />
    </section>
  )
}
