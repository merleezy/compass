export default function ListCard({ title, actions, children }) {
  // No overflow-hidden on the card — dropdowns in the actions slot must
  // overlay past the card edge; the header rounds its own top corners instead
  return (
    <div className="bg-surface rounded-xl shadow-sm">
      <div className="px-8 py-5 flex items-center justify-between bg-surface-subtle/80 rounded-t-xl">
        <h3 className="text-lg font-headline font-bold text-text">
          {title}
        </h3>
        {actions ? <div>{actions}</div> : null}
      </div>

      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
