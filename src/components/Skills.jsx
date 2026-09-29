import { skills } from '../config/data'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import SheetHead from './SheetHead'

export default function Skills() {
  const [ref, vis] = useScrollAnimation()

  return (
    <section id="materials" ref={ref} className={`sheet ${vis ? 'in' : ''}`}>
      <SheetHead n="05" title="Bill of materials" sub="Skills" zone="E" />
      <div className="wrap">
        <table className="bom rv">
          <caption className="sr-only">Skills grouped by area</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Part</th>
              <th scope="col">Components</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s, i) => (
              <tr key={s.part} data-detect={`part.${s.part.toLowerCase().replace(/[^a-z]+/g, '_')}`}>
                <td>{String(i + 1).padStart(3, '0')}</td>
                <th scope="row">{s.part}</th>
                <td>{s.items.join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
