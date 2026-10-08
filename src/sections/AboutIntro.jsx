import Scene3D from '../components/Scene3D'
import { SectionHead, Counter, Reveal, Magnetic } from '../components/ui'
import { stats } from '../data/site'

export function Stats() {
  return (
    <dl className="stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="stat">
          <dt>{s.label}</dt>
          <dd><Counter value={s.value} suffix={s.suffix} /></dd>
          <span className="stat__tick" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        </Reveal>
      ))}
    </dl>
  )
}

export default function AboutIntro({ more = true }) {
  return (
    <section className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div>
          <SectionHead
            id="about-title"
            eyebrow="About CADD-EXPERTS"
            title={<>Engineering Skills.<br />Digital Precision.<br /><em>Industry Readiness.</em></>}
          />
          <Reveal delay={0.2}>
            <p className="lead">
              CADD-EXPERTS provides professional training in engineering design and CAD technologies for students, graduates,
              working professionals and engineering aspirants. Every program follows the way design actually happens in
              industry — from concept sketches to analysed, documented and presentation-ready models.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="body-muted">
              Our Civil and Mechanical tracks pair the world&apos;s leading CAD, BIM and CAE platforms with project-based
              learning, so you graduate with skills — and a portfolio — that employers recognise.
            </p>
          </Reveal>
          {more && (
            <Reveal delay={0.34}>
              <Magnetic to="/about" variant="ghost" arrow>More About Us</Magnetic>
            </Reveal>
          )}
        </div>
        <div className="about__visual frame-corners">
          <Scene3D kind="emblem" fallback="gear" fallbackTitle="Spur gear" />
          <span className="about__caption mono">FIG. 01 — SPUR GEAR · Z24 · m4</span>
        </div>
      </div>
      <div className="container">
        <Stats />
      </div>
    </section>
  )
}
