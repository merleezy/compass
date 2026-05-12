import { Menu, X } from 'lucide-react'

export default function TopBar({ collapsed, onMenuClick }) {
  return (
    <header
      className={`fixed top-0 right-0 z-40 h-16 bg-bg
                  flex items-center justify-between px-6
                  transition-all duration-300
                  /* On desktop, left edge follows the sidebar width */
                  lg:px-10
                  ${collapsed ? 'lg:left-16' : 'lg:left-64'}
                  /* On mobile the topbar spans the full width */
                  left-0`}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg text-text-muted
                   hover:text-text hover:bg-white/5 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      {/* Spacer so avatar stays right on desktop where hamburger is hidden */}
      <div className="hidden lg:block" />

      {/* Avatar */}
      <div className="w-9 h-9 rounded-lg bg-slate-700
                      flex items-center justify-center
                      select-none cursor-pointer shrink-0">
        <span className="text-white font-headline font-bold text-sm">I</span>
      </div>
    </header>
  )
}