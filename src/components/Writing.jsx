import { articles, personalInfo } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const MediumIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12ZM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12Z" />
  </svg>
)

export default function Writing() {
  const [ref, vis] = useScrollAnimation()
  const [listRef, listVis] = useScrollAnimation()

  return (
    <section id="writing" className="section section-alt" ref={ref}>
      <div className="container">
        <span className="section-watermark" aria-hidden="true">03 Notes</span>
        <div className={`section-head reveal ${vis ? 'in' : ''}`}>
          <span className="index">Notes &amp; essays</span>
          <h2>Writing</h2>
          <p className="sub">Technical deep-dives, published on Medium.</p>
        </div>

        <div className={`articles-list reveal-stagger ${listVis ? 'in' : ''}`} ref={listRef}>
          {articles.map((a) => (
            <article className="article-item" key={a.title}>
              <div className="article-date">{a.date}</div>
              <div className="article-body">
                <h3>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    {a.title}
                  </a>
                </h3>
                <p className="desc">{a.description}</p>
                <div className="article-meta">
                  <div className="tag-row" style={{ margin: 0 }}>
                    {a.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="read-time">{a.readTime}</span>
                </div>
              </div>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="article-link"
              >
                Read on Medium <span className="arrow">↗</span>
              </a>
            </article>
          ))}

          <a
            className="articles-placeholder"
            href={personalInfo.medium}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MediumIcon />
            More articles in progress — follow on Medium for updates
          </a>
        </div>
      </div>
    </section>
  )
}
