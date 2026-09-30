import { personal, modelCredit } from '../config/data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <span>© 2026 {personal.name} · Drawn in React and three.js</span>
        <span>
          Drone model:{' '}
          <a className="ext" href={modelCredit.url} target="_blank" rel="noreferrer">
            {modelCredit.text}
            <span className="sr-only"> on Sketchfab, opens in a new tab</span>
          </a>
          ,{' '}
          <a className="ext" href={modelCredit.licenseUrl} target="_blank" rel="noreferrer">
            {modelCredit.license}
            <span className="sr-only"> licence, opens in a new tab</span>
          </a>
        </span>
        <a href="#home">Back to sheet 01 ↑</a>
      </div>
    </footer>
  )
}
