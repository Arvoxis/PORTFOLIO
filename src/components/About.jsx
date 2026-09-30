import { notes, spec, droneParts } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import SheetHead from './SheetHead'

export default function About() {
  const [ref, vis] = useScrollAnimation()

  return (
    <section id="notes" ref={ref} className={`sheet ${vis ? 'in' : ''}`}>
      <SheetHead n="02" title="General notes" sub="About" zone="B" />
      <div className="wrap">
        <div className="notes-col">
          <ol className="notes">
            {notes.map((n, i) => (
              <li key={i} className="rv" style={{ '--i': i }}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <p>{n}</p>
              </li>
            ))}
          </ol>

          {/* key to the lettered callouts on the exploded drone beside the notes */}
          <p className="parts-key rv" style={{ '--i': 4 }} aria-hidden="true">
            <span>Fig. key</span>
            {droneParts.map((p) => (
              <span key={p.mark}>
                <b>{p.mark}</b> {p.label}
              </span>
            ))}
          </p>

          <div className="notes-spec rv" style={{ '--i': 4 }}>
            <figure className="cyano ticks" data-detect="person.rakshit">
              <div className="cyano-img">
                <img src="/avatar.webp" alt="Portrait of Rakshit Sinha" width="360" height="450" loading="lazy" />
              </div>
              <figcaption>Fig. 1 · The engineer</figcaption>
            </figure>
            <table className="spec">
              <caption className="sr-only">Specification</caption>
              <tbody>
                {spec.map((s) => (
                  <tr key={s.k}>
                    <th scope="row">{s.k}</th>
                    <td>{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
