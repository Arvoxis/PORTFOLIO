import { featured, writeup, projects, archive } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import SheetHead from './SheetHead'
import Plate from './Plates'

function Row({ p, flip, children }) {
  const [ref, vis] = useScrollAnimation()
  return (
    <article ref={ref} className={`row ${flip ? 'flip' : ''} ${vis ? 'in' : ''}`} data-detect={p.detect}>
      <figure className="plate-frame">
        <Plate name={p.plate} />
        <figcaption>
          <span>{p.dwg}</span>
          <span>{p.context}</span>
        </figcaption>
      </figure>
      <div className="row-text">
        <h3 className="row-title">{p.title}</h3>
        <p className="row-sub">{p.subtitle}</p>
        <p className="hero-num">
          <strong>{p.hero.v}</strong>
          <span>{p.hero.l}</span>
        </p>
        <p className="row-desc">{p.description}</p>
        {children}
        <p className="stack">{p.stack.join(' · ')}</p>
        {p.github ? (
          <a className="text-link ext" href={p.github} target="_blank" rel="noreferrer">
            Source<span className="sr-only">: {p.title} on GitHub, opens in a new tab</span>
          </a>
        ) : (
          <span className="note">{p.note}</span>
        )}
      </div>
    </article>
  )
}

export default function Projects() {
  const [ref, vis] = useScrollAnimation()
  const f = featured

  return (
    <section id="drawings" ref={ref} className={`sheet ${vis ? 'in' : ''}`}>
      <SheetHead n="04" title="Drawings" sub="Projects" zone="D" />
      <div className="wrap">
        <Row p={f}>
          <ol className="pipeline" aria-label="Pipeline">
            {f.pipeline.map((s, i) => (
              <li key={s}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
          <a className="writeup" href={writeup.url} target="_blank" rel="noreferrer" data-detect="ref.r1">
            <span className="writeup-ref">Write-up [{writeup.ref}]</span>
            <strong>{writeup.title}</strong>
            <span className="writeup-meta">
              {writeup.date} · {writeup.readTime} · Medium ↗
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </Row>

        {projects.map((p, i) => (
          <Row key={p.dwg} p={p} flip={i % 2 === 0}>
            <ul className="facts">
              {p.facts.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Row>
        ))}

        <p className="archive rv">
          <span className="archive-label">Archive</span>
          {archive.map((a) => (
            <a key={a.title} className="text-link ext" href={a.github} target="_blank" rel="noreferrer">
              {a.title}
              <span className="sr-only"> on GitHub, opens in a new tab</span>
            </a>
          ))}
        </p>
      </div>
    </section>
  )
}
