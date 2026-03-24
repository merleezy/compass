export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40
                        bg-bg flex items-center justify-end px-10">

      <div className="w-9 h-9 rounded-lg bg-slate-700
                      flex items-center justify-center
                      select-none cursor-pointer">
        <span className="text-white font-headline font-bold text-sm">
          I
        </span>
      </div>

    </header>
  )
}