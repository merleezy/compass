import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  // Desktop: collapsed = icon-only rail; Mobile: collapsed = fully hidden
  const [collapsed, setCollapsed] = useState(false);
  // Mobile-only drawer open state (separate from desktop collapse)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer whenever the viewport grows past the lg breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const sidebarW = collapsed ? 'lg:w-16' : 'lg:w-64';

  return (
    <div className="h-screen overflow-hidden bg-bg text-text">

      {/* Mobile backdrop — shown when drawer is open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <TopBar
        collapsed={collapsed}
        onMenuClick={() => setMobileOpen((o) => !o)}
      />

      {/* Main content shifts with the sidebar on desktop */}
      <main
        className={`pt-16 pb-12 h-full overflow-auto transition-all duration-300
                    px-6 md:px-10 lg:px-14
                    ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
      >
        <div className="py-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
}