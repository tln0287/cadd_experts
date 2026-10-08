import { useEffect, useState } from 'react'
import Scene3D from '../components/Scene3D'
import { SectionHead, Magnetic } from '../components/ui'

const DOMAINS = [
  {
    kind: 'civil',
    code: '01',
    title: 'Civil Engineering',
    text: 'Transform ideas into structures through advanced CAD, BIM, structural and infrastructure design.',
    cta: 'Explore Civil Courses',
    to: '/civil-engineering',
    hint: 'Hover · Blueprint → 3D Model',
    fallback: 'building',
  },
  {
    kind: 'mechanical',
    code: '02',
    title: 'Mechanical Engineering',
    text: 'Design, model and visualize complex mechanical components using professional CAD and engineering tools.',
    cta: 'Explore Mechanical Courses',
    to: '/mechanical-engineering',
    hint: 'Hover · Wireframe → Solid → Exploded',
    fallback: 'gear',
  },
]

export default function Domains() {
  const [active, setActive] = useState(null)
  const [touch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
  const [auto, setAuto] = useState(false)

  // touch devices have no hover: cycle the transformation automatically
  useEffect(() => {
    if (!touch) return
    const id = setInterval(() => setAuto((a) => !a), 3800)
    return () => clearInterval(id)
  }, [touch])

  return (
    <section className="section domains" aria-labelledby="domains-title">
      <div className="container">
        <SectionHead id="domains-title" eyebrow="Two Core Domains" title="Choose Your Engineering Domain" align="center" />
      </div>
      <div className="domains__split">
        {DOMAINS.map((d) => {
          const on = touch ? auto : active === d.kind
          return (
            <article
              key={d.kind}
              className={`domain domain--${d.kind} ${on ? 'is-active' : ''} ${active && active !== d.kind ? 'is-dim' : ''}`}
              onMouseEnter={() => setActive(d.kind)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(d.kind)}
              onBlur={() => setActive(null)}
            >
              <div className="domain__scene">
                <Scene3D kind="domain" domain={d.kind} active={on} fallback={d.fallback} />
              </div>
              <div className="domain__content">
                <span className="domain__code mono">{d.code} / {d.kind.toUpperCase()}</span>
                <h3 className="domain__title">{d.title}</h3>
                <p>{d.text}</p>
                <Magnetic to={d.to} variant={d.kind === 'civil' ? 'primary' : 'ghost'} arrow>{d.cta}</Magnetic>
                <span className="domain__hint mono">{d.hint}</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
