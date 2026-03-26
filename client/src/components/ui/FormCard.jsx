export default function FormCard({ icon: Icon, title, footer, children }) {
  return (
    <section className="bg-surface-raised/60 rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        {Icon ? <Icon size={20} className="text-primary" /> : null}
        <h3 className="text-lg font-headline font-bold text-text">
          {title}
        </h3>
      </div>

      <div className="space-y-5">
        {children}
      </div>

      {footer ? (
        <p className="text-[10px] text-center text-text-muted mt-4 font-body italic">
          {footer}
        </p>
      ) : null}
    </section>
  )
}
