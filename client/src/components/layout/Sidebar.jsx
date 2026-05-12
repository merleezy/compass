import { NavLink } from 'react-router-dom'
import {
  Compass,
  LayoutDashboard,
  Repeat2,
  CircleCheck,
  Trophy,
  Settings,
  Brain
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits', icon: Repeat2, label: 'Habits' },
  { to: '/tasks', icon: CircleCheck, label: 'Tasks' },
  { to: '/reflections', icon: Brain, label: 'Reflections' },
  { to: '/goals', icon: Trophy, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className='fixed inset-y-0 left-0 w-64 bg-sidebar flex flex-col z-50 py-8'>
      {/* Logo Area */}
      <div className='px-6 mb-10 flex items-center gap-3'>
        <div className="p-2.5 rounded-xl bg-primary
                        shadow-[0_6px_10px_rgba(0,163,148,0.3)]">
          <Compass size={26} className="text-white" />
        </div>
        <div>
          <h1 className='text-white font-headline font-bold tracking-tight text-xl'>
            Compass
          </h1>
          <p className='text-[11px] uppercase tracking-widest text-slate-400 font-body'>
            Personal Dashboard
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className='flex-1 px-4 space-y-1'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
              `flex items-center gap=3 px-4 py-3 rounded-lg text-sm 
              font-body transition-colors duration-150
              ${isActive
                ? 'bg-primary text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            <span className='font-headline tracking-wide ml-2'>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}