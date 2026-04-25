import { personalInfo } from '../config/data'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div>
            © 2026 {personalInfo.name}. Typeset in Syne, DM Sans, and JetBrains Mono.
          </div>
          <ul className="footer-links">
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Back to top ↑
              </a>
            </li>
            <li>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
