// Meta line (sheet number + plain section name, drawn-in rule, zone) above the themed sheet title.
export default function SheetHead({ n, title, sub, zone, hideTitle = false }) {
  return (
    <header className="sheet-head wrap">
      <p className="sheet-meta">
        <span className="sheet-no">
          Sheet {n} / 06 · <b>{sub}</b>
        </span>
        <span className="sheet-rule" aria-hidden="true" />
        <span aria-hidden="true">Zone {zone}</span>
      </p>
      <h2 className={hideTitle ? 'sr-only' : undefined}>{title}</h2>
    </header>
  )
}
