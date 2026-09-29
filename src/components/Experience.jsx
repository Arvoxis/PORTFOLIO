import { experience } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import SheetHead from './SheetHead'

function Points({ items }) {
  return (
    <ul className="points">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  )
}

export default function Experience() {
  const [ref, vis] = useScrollAnimation()

  return (
    <section id="revisions" ref={ref} className={`sheet ${vis ? 'in' : ''}`}>
      <SheetHead n="03" title="Revision history" sub="Experience" zone="C" />
      <div className="wrap">
        <div className="revs">
          {experience.map((e, i) => {
            const shown = e.points.slice(0, e.lead)
            const more = e.points.slice(e.lead)
            return (
              <article
                key={e.org}
                className="rev panel ticks rv"
                style={{ '--i': i }}
                data-detect={`rev.${e.rev.toLowerCase()}`}
              >
                <div className="rev-mark" aria-hidden="true">
                  <svg viewBox="0 0 44 40">
                    <path d="M22 2 L42 38 L2 38 Z" />
                    <text x="22" y="33">{e.rev}</text>
                  </svg>
                </div>
                <div className="rev-body">
                  <header className="rev-top">
                    <h3>{e.role}</h3>
                    <span className="rev-period">{e.period}</span>
                    <p className="rev-org">
                      {e.org} · {e.place}
                    </p>
                  </header>
                  <p className="rev-sum">{e.summary}</p>

                  {e.metrics.length > 0 && (
                    <dl className="metrics">
                      {e.metrics.map((m) => (
                        <div key={m.l} data-scan={m.scan ? '' : undefined}>
                          <dt>{m.l}</dt>
                          <dd>{m.v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {shown.length > 0 && <Points items={shown} />}
                  {more.length > 0 && (
                    <details className="more">
                      <summary>
                        {more.length} more <span aria-hidden="true">+</span>
                      </summary>
                      <Points items={more} />
                    </details>
                  )}

                  {e.stack.length > 0 && <p className="stack">{e.stack.join(' · ')}</p>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
