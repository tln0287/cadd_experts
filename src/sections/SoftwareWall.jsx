import { software } from '../data/site'
import BlueprintArt from '../components/BlueprintArt'
import { SectionHead } from '../components/ui'

function SoftwareCard({ s, hidden }) {
  return (
    <li className={`sw-card sw-card--${s.domain}`} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : 0}>
      <div className="sw-card__inner">
        <div className="sw-card__face">
          <span className="sw-card__mono">{s.short}</span>
          <span className="sw-card__name">{s.name}</span>
          <span className="sw-card__domain mono">{s.domain === 'both' ? 'CIVIL · MECH' : s.domain.toUpperCase()}</span>
        </div>
        <div className="sw-card__reveal">
          <div className="sw-card__art"><BlueprintArt variant={s.art} title={s.name} animate={false} /></div>
          <p>{s.desc}</p>
        </div>
      </div>
    </li>
  )
}

/** Floating 3D software cards on a continuously drifting track. */
export default function SoftwareWall({ title = 'Professional Software Ecosystem' }) {
  const rowA = software.slice(0, 7)
  const rowB = software.slice(7)
  return (
    <section className="section sw" aria-labelledby="sw-title">
      <div className="container">
        <SectionHead
          id="sw-title"
          eyebrow="Software Wall"
          title={title}
          intro="Train on the platforms engineering firms actually use. Hover a card to see what it is used for."
        />
      </div>
      <div className="sw__stage">
        {[rowA, rowB].map((row, r) => (
          <div className={`sw__row ${r ? 'is-reverse' : ''}`} key={r}>
            <ul className="sw__track">
              {row.map((s) => <SoftwareCard key={s.name} s={s} />)}
              {row.map((s) => <SoftwareCard key={`${s.name}-dup`} s={s} hidden />)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
