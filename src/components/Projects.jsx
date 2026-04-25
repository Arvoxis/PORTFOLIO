import { useEffect, useRef } from 'react'
import { projects } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const GithubIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.3 9.4 7.87 10.93.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
)

const PipelineDiagram = () => (
  <svg
    viewBox="0 0 360 560"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Hawk-I pipeline: drone capture, Jetson edge inference, LLM report, dashboard"
  >
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill="#6ee7b7" />
      </marker>
    </defs>

    <g fontFamily="'JetBrains Mono', ui-monospace, monospace" fontSize="10">
      {/* CAPTURE */}
      <g>
        <rect x="100" y="16" width="160" height="48" rx="2" fill="none" stroke="#2a2f44" strokeWidth="1" />
        <text x="180" y="36" textAnchor="middle" fill="#64748b" fontSize="8" letterSpacing="1.5">01 · CAPTURE</text>
        <text x="180" y="54" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">DRONE</text>
      </g>
      <line x1="180" y1="68" x2="180" y2="94" stroke="#6ee7b7" strokeWidth="1.2" markerEnd="url(#arrow)" />

      {/* JETSON EDGE */}
      <g>
        <rect x="16" y="102" width="328" height="196" rx="2" fill="none" stroke="#6ee7b7" strokeWidth="1.2" />
        <text x="28" y="120" fill="#6ee7b7" fontSize="8" letterSpacing="1.5">02 · EDGE · JETSON ORIN NANO</text>

        <g>
          <rect x="28" y="134" width="146" height="70" rx="2" fill="#0f1117" stroke="#2a2f44" />
          <text x="101" y="152" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">YOLOv11n</text>
          <text x="101" y="168" textAnchor="middle" fill="#94a3b8" fontSize="9">TensorRT INT8</text>
          <text x="101" y="184" textAnchor="middle" fill="#64748b" fontSize="8">defect detection</text>
        </g>
        <g>
          <rect x="186" y="134" width="146" height="70" rx="2" fill="#0f1117" stroke="#2a2f44" />
          <text x="259" y="152" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Grounding DINO</text>
          <text x="259" y="168" textAnchor="middle" fill="#94a3b8" fontSize="9">FP16 · zero-shot</text>
          <text x="259" y="184" textAnchor="middle" fill="#64748b" fontSize="8">open-vocab prompts</text>
        </g>
        <g>
          <rect x="28" y="214" width="146" height="70" rx="2" fill="#0f1117" stroke="#2a2f44" />
          <text x="101" y="232" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">SAM 2</text>
          <text x="101" y="248" textAnchor="middle" fill="#94a3b8" fontSize="9">segmentation</text>
          <text x="101" y="264" textAnchor="middle" fill="#64748b" fontSize="8">GSD area calc</text>
        </g>
        <g>
          <rect x="186" y="214" width="146" height="70" rx="2" fill="#0f1117" stroke="#2a2f44" />
          <text x="259" y="232" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">DINOv2</text>
          <text x="259" y="248" textAnchor="middle" fill="#94a3b8" fontSize="9">cosine similarity</text>
          <text x="259" y="264" textAnchor="middle" fill="#64748b" fontSize="8">temporal anomaly</text>
        </g>
      </g>
      <line x1="180" y1="298" x2="180" y2="324" stroke="#6ee7b7" strokeWidth="1.2" markerEnd="url(#arrow)" />

      {/* GEMMA */}
      <g>
        <rect x="60" y="332" width="240" height="64" rx="2" fill="none" stroke="#2a2f44" />
        <text x="180" y="350" textAnchor="middle" fill="#64748b" fontSize="8" letterSpacing="1.5">03 · REASONING</text>
        <text x="180" y="370" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Gemma-3 LLM</text>
        <text x="180" y="386" textAnchor="middle" fill="#94a3b8" fontSize="9">IRC / IS 456 grounded report</text>
      </g>
      <line x1="180" y1="396" x2="180" y2="422" stroke="#6ee7b7" strokeWidth="1.2" markerEnd="url(#arrow)" />

      {/* BACKEND */}
      <g>
        <rect x="60" y="430" width="240" height="48" rx="2" fill="none" stroke="#2a2f44" />
        <text x="180" y="450" textAnchor="middle" fill="#64748b" fontSize="8" letterSpacing="1.5">04 · SERVE</text>
        <text x="180" y="468" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">FastAPI · WebSocket · PostGIS</text>
      </g>
      <line x1="180" y1="478" x2="180" y2="504" stroke="#6ee7b7" strokeWidth="1.2" markerEnd="url(#arrow)" />

      {/* DASHBOARD */}
      <g>
        <rect x="60" y="512" width="240" height="40" rx="2" fill="none" stroke="#6ee7b7" strokeWidth="1.2" />
        <text x="180" y="538" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="600" letterSpacing="1">GPS MAP DASHBOARD</text>
      </g>
    </g>
  </svg>
)

export default function Projects() {
  const [headRef, headVis] = useScrollAnimation()
  const [featRef, featVis] = useScrollAnimation()
  const [gridRef, gridVis] = useScrollAnimation()
  const gridWrapRef = useRef(null)

  useEffect(() => {
    const root = gridWrapRef.current
    if (!root) return
    const handlers = []
    root.querySelectorAll('.project-card').forEach((card) => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mx', x + '%')
        card.style.setProperty('--my', y + '%')
      }
      card.addEventListener('mousemove', onMove)
      handlers.push([card, onMove])
    })
    return () => handlers.forEach(([c, fn]) => c.removeEventListener('mousemove', fn))
  }, [])

  const f = projects.featured

  return (
    <section id="projects" className="section" ref={headRef}>
      <div className="container">
        <span className="section-watermark" aria-hidden="true">02 Work</span>
        <div className={`section-head reveal ${headVis ? 'in' : ''}`}>
          <span className="index">Selected work</span>
          <h2>Projects</h2>
          <p className="sub">Things I've built that actually shipped: Jetson edge pipelines, offline mobile ML, research tooling, and the occasional gesture game.</p>
        </div>

        <article className={`featured-project reveal ${featVis ? 'in' : ''}`} ref={featRef}>
          <div>
            <span className="badge">{f.badge}</span>
            <h3>{f.title}</h3>
            <p className="desc">{f.description}</p>
            <div className="tag-row">
              {f.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="project-ctas">
              <a
                href={f.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                <GithubIcon /> GitHub
              </a>
            </div>
          </div>
          <div className="pipeline-art" aria-label="Hawk-I pipeline diagram">
            <PipelineDiagram />
          </div>
        </article>

        <div
          className={`projects-grid reveal-stagger ${gridVis ? 'in' : ''}`}
          ref={(node) => {
            gridRef.current = node
            gridWrapRef.current = node
          }}
        >
          {projects.grid.map((p) => (
            <article className="project-card" key={p.slug}>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="github-corner"
                aria-label={`${p.title} on GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon />
              </a>
              {p.badge && <span className="badge">{p.badge}</span>}
              <h3>{p.title}</h3>
              <p className="desc">{p.description}</p>
              <div className="tag-row" style={{ marginBottom: 0 }}>
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
