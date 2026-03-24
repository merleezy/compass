import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div className="h-screen overflow-hidden bg-bg text-text">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-24 px-48 pb-12">
        <Outlet />
      </main>
    </div>
  )
}