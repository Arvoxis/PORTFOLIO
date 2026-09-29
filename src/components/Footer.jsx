import { personal, modelCredit } from '../config/data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <span>© 2026 {personal.name} · Drawn in React and three.js</span>
        <span>
          Drone model:{' '}
          <a href={modelCredit.url} target="_blank" rel="noreferrer">
            {modelCredit.text}
          </a>
          ,{' '}
          <a href={modelCredit.licenseUrl} target="_blank" rel="noreferrer">
            {modelCredit.license}
          </a>
        </span>
        <a href="#home">Back to sheet 01 ↑</a>
      </div>
    </footer>
  )
}
