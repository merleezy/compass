import { NavLink } from 'react-router-dom'
import {
  Compass,
  LayoutDashboard,
  Repeat2,
  CircleCheck,
  Wallet,
  Trophy,
  Settings
} from 'lucide-react'

const NavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits', icon: Repeat2, label: 'Habits' },
  { to: '/tasks', icon: CircleCheck, label: 'Tasks' },
  { to: '/finances', icon: Wallet, label: 'Finances' },
  { to: '/goals', icon: Trophy, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className='fixed inset-y-0 left-0 w-64 bg-sidebar flex flex-col z-50 py-8'>
      {/* Logo Area */}
      <div className='px-6 mb-10 flex items-center gap-3'>
        <div className='p-2 rounded-xl bg-primary'>

        </div>
      </div>
    </aside>
  )
}