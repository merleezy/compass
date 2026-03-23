import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="ml-64 p-10">
        <Outlet />
      </main>
    </div>
  )
}