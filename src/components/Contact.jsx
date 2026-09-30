import { personal } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import SheetHead from './SheetHead'

export default function Contact() {
  const [ref, vis] = useScrollAnimation()
  const p = personal

  // the drawing's title block, doubling as the contact card
  const cells = [
    { k: 'Drawn by', v: p.name, big: true },
    { k: 'Location', v: p.location },
    { k: 'GitHub', v: p.githubHandle, href: p.github },
    { k: 'LinkedIn', v: p.linkedinHandle, href: p.linkedin },
    { k: 'Medium', v: p.mediumHandle, href: p.medium },
  ]

  return (
    <section id="contact" ref={ref} className={`sheet ${vis ? 'in' : ''}`}>
      <SheetHead n="06" title="Contact" sub="Contact" zone="F" hideTitle />
      <div className="wrap">
        <p className="contact-lead rv">
          Let's build something <em>that has to work.</em>
        </p>
        <a className="contact-mail rv" style={{ '--i': 1 }} href={`mailto:${p.email}`} data-detect="contact.email">
          {p.email}
        </a>

        <div className="tblock rv" style={{ '--i': 2 }}>
          {cells.map((c) =>
            c.href ? (
              <a key={c.k} href={c.href} target="_blank" rel="noreferrer" data-detect={`contact.${c.k.toLowerCase()}`}>
                <small>{c.k}</small>
                <strong className="ext">
                  {c.v}
                  <span className="sr-only">, opens in a new tab</span>
                </strong>
              </a>
            ) : (
              <div key={c.k} className={c.big ? 'big' : ''}>
                <small>{c.k}</small>
                <strong>{c.v}</strong>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
