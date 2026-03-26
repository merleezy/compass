import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div className="h-screen overflow-hidden bg-bg text-text">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-24 px-30 pb-12 h-full overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}