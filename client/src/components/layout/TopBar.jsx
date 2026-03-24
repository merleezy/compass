export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40
                        bg-bg flex items-center justify-end px-10">

      {/* rounded-lg: rounded square instead of a full circle
          p-2: breathing room so the initial doesn't touch the edges
          w-10 h-10: slightly larger to compensate for the padding */}
      <div className="w-9 h-9 rounded-lg bg-primary/20
                      flex items-center justify-center
                      select-none cursor-pointer">
        <span className="text-primary font-headline font-bold text-sm">
          I
        </span>
      </div>

    </header>
  )
}