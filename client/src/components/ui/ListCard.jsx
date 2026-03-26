export default function ListCard({ title, actions, children }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
      <div className="px-8 py-5 flex items-center justify-between bg-surface-subtle/30">
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
