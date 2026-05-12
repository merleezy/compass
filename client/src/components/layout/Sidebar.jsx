import { NavLink } from 'react-router-dom'
import {
  Compass, LayoutDashboard, Repeat2, CircleCheck,
  Trophy, Settings, Brain, ChevronLeft, ChevronRight, X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/habits',      icon: Repeat2,         label: 'Habits'      },
  { to: '/tasks',       icon: CircleCheck,     label: 'Tasks'       },
  { to: '/reflections', icon: Brain,           label: 'Reflections' },
  { to: '/goals',       icon: Trophy,          label: 'Goals'       },
  { to: '/settings',    icon: Settings,        label: 'Settings'    },
]

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 bg-sidebar flex flex-col py-8
        transition-all duration-300 ease-in-out
        /* Mobile: full-width drawer, slides in/out */
        w-72
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        /* Desktop: always visible, width toggles between 64 and 16 */
        lg:translate-x-0
        ${collapsed ? 'lg:w-16' : 'lg:w-64'}
      `}
    >
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className={`mb-10 flex items-center overflow-hidden
                       transition-all duration-300 relative
                       ${collapsed ? 'lg:justify-center lg:px-0 lg:gap-0 pl-6 pr-2 gap-3' : 'lg:px-6 pl-6 pr-2 gap-3'}`}>
        <div className="shrink-0 p-2.5 rounded-xl bg-primary
                        shadow-[0_6px_10px_rgba(0,163,148,0.3)]">
          <Compass size={22} className="text-white" />
        </div>

        {/* Text — hidden when collapsed on desktop */}
        <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap
                         ${collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
          <h1 className='text-white font-headline font-bold tracking-tight text-xl'>
            Compass
          </h1>
          <p className='text-[11px] uppercase tracking-widest text-slate-400 font-body'>
            Personal Dashboard
          </p>
        </div>

        {/* Mobile-only close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute right-3 shrink-0 p-1.5 rounded-lg text-slate-400
                     hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Nav Links ─────────────────────────────────────────────── */}
      <nav className={`flex-1 space-y-1 transition-all duration-300
                       ${collapsed ? 'lg:px-1' : 'px-4'}`}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)} // close drawer on mobile nav
            title={collapsed ? label : undefined}  // tooltip when icon-only
            className={({ isActive }) =>
              `flex items-center py-3 rounded-lg text-sm font-body
               transition-colors duration-150 group relative
               ${collapsed ? 'lg:justify-center lg:px-0 lg:gap-0 px-4 gap-3' : 'px-4 gap-3'}
               ${isActive
                 ? 'bg-primary text-white font-semibold'
                 : 'text-slate-400 hover:text-white hover:bg-white/5'
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="shrink-0" />

                {/* Label — hidden when collapsed on desktop */}
                <span className={`font-headline tracking-wide whitespace-nowrap
                                  overflow-hidden transition-all duration-300
                                  ${collapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
                  {label}
                </span>

                {/* Tooltip for icon-only mode */}
                {collapsed && (
                  <span className="hidden lg:block absolute left-full ml-3 px-2.5 py-1.5
                                   rounded-lg bg-surface border border-border
                                   text-text text-xs font-body whitespace-nowrap
                                   opacity-0 group-hover:opacity-100 pointer-events-none
                                   transition-opacity duration-150 shadow-lg z-50">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Collapse toggle (desktop only) ────────────────────────── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center mx-auto mt-4
                   w-8 h-8 rounded-lg text-slate-400 hover:text-white
                   hover:bg-white/10 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

    </aside>
  )
}