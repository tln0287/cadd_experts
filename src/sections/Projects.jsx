import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/site'
import BlueprintArt from '../components/BlueprintArt'
import Scene3D from '../components/Scene3D'
import { SectionHead, Tilt, Reveal } from '../components/ui'

export function ProjectCard({ p, i = 0 }) {
  return (
    <Tilt as="article" className={`project-card ${i % 5 === 0 ? 'is-feature' : ''}`} max={5}>
      <Link to={`/projects/${p.slug}`} className="project-card__link" aria-label={`${p.title} case study`}>
        <div className="project-card__media">
          <BlueprintArt variant={p.art} title={p.title} animate={false} />
        </div>
        <div className="project-card__body">
          <span className="mono label">{p.domain === 'civil' ? 'CIVIL' : 'MECHANICAL'} · {String(i + 1).padStart(2, '0')}</span>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <ul className="tags">{p.software.map((s) => <li key={s}>{s}</li>)}</ul>
          <span className="project-card__cta">View Case Study <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </Tilt>
  )
}

export function ProjectShowcase({ limit, domain: initial = 'all', headingLevel = 'h2', title = 'Engineering Projects' }) {
  const [domain, setDomain] = useState(initial)
  let list = projects.filter((p) => domain === 'all' || p.domain === domain)
  if (limit) list = list.slice(0, limit)
  return (
    <section className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="courses__head">
          <SectionHead id="projects-title" as={headingLevel} eyebrow="Project Showcase" title={title} intro="Portfolio-grade work across structures, infrastructure, machines and products — each with a full case study." />
          <div className="tabs" role="tablist" aria-label="Filter projects">
            {[['all', 'All'], ['civil', 'Civil'], ['mechanical', 'Mechanical']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={domain === k} className={`tab ${domain === k ? 'is-active' : ''}`} onClick={() => setDomain(k)}>
                {domain === k && <motion.span layoutId="proj-tab" className="tab__bg" />}
                <span>{l}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div layout key={p.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: i * 0.04 }} className={i % 5 === 0 ? 'span-2' : ''}>
                <ProjectCard p={p} i={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {limit && (
          <div className="center-row">
            <Link to="/projects" className="link-arrow">See all projects <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Lightweight CAD viewer                                              */
/* ------------------------------------------------------------------ */
export function ProjectViewer({ initialModel = 'gearbox', lockModel = false, title = 'Interactive 3D Project Viewer' }) {
  const [model, setModel] = useState(initialModel)
  const [opts, setOpts] = useState({ rotate: true, wireframe: false, explode: false, dims: false, drawing: false })
  const api = useRef(null)
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }))
  const T = ({ k, children }) => (
    <button className={`vbtn ${opts[k] ? 'is-on' : ''}`} aria-pressed={opts[k]} onClick={() => toggle(k)}>
      <span className="vbtn__led" aria-hidden="true" />{children}
    </button>
  )
  return (
    <section className="section viewer" aria-labelledby="viewer-title">
      <div className="container">
        <SectionHead id="viewer-title" eyebrow="3D Project Viewer" title={title} intro="Rotate, zoom and pan. Toggle wireframe, exploded view, dimensions and the technical drawing — a lightweight CAD viewer in your browser." />
        <Reveal className="viewer__shell frame-corners">
          <div className="viewer__bar">
            <span className="viewer__dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="mono">CADD-EXPERTS VIEWER — {model === 'gearbox' ? 'GEARBOX_ASM.step' : 'RES_BLOCK_G+5.rvt'}</span>
            {!lockModel && (
              <div className="viewer__models" role="group" aria-label="Model">
                <button className={model === 'gearbox' ? 'is-on' : ''} aria-pressed={model === 'gearbox'} onClick={() => setModel('gearbox')}>Gearbox</button>
                <button className={model === 'building' ? 'is-on' : ''} aria-pressed={model === 'building'} onClick={() => setModel('building')}>Building</button>
              </div>
            )}
          </div>
          <div className="viewer__canvas" data-lenis-prevent>
            <Scene3D kind="viewer" ref={api} model={model} opts={opts} fallback={model === 'gearbox' ? 'gear' : 'building'} />
            <div className="viewer__hud mono" aria-hidden="true">
              <span>VIEW: {opts.drawing ? 'FRONT / DRAWING' : 'PERSPECTIVE'}</span>
              <span>MODE: {opts.wireframe ? 'WIREFRAME' : 'SHADED + EDGES'}</span>
              <span>DRAG · ROTATE &nbsp; SCROLL · ZOOM &nbsp; RIGHT-DRAG · PAN</span>
            </div>
          </div>
          <div className="viewer__tools" role="toolbar" aria-label="Viewer controls">
            <T k="rotate">ROTATE</T>
            <button className="vbtn" onClick={() => api.current?.zoom(0.8)}>ZOOM +</button>
            <button className="vbtn" onClick={() => api.current?.zoom(1.25)}>ZOOM −</button>
            <T k="wireframe">WIREFRAME</T>
            <T k="explode">{model === 'building' ? 'EXPLODE / SECTION' : 'EXPLODE'}</T>
            <T k="dims">DIMENSIONS</T>
            <T k="drawing">TECH DRAWING</T>
            <button className="vbtn" onClick={() => { setOpts({ rotate: false, wireframe: false, explode: false, dims: false, drawing: false }); api.current?.reset() }}>RESET</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
