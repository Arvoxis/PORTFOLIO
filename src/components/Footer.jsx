import { personal } from '../config/data'

export default function Footer() {
  const year     = new Date().getFullYear()
  const initials = `${personal.name.first[0]}${personal.name.last[0]}`

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <p className="footer-copy">
            © {year} {personal.name.first} {personal.name.last}
          </p>
          <div className="footer-brand">{initials}.</div>
        </div>
      </div>
    </footer>
  )
}
