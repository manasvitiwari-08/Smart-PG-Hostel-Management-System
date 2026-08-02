import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TenantSidebar from '../components/tenant/TenantSidebar'
import TenantNavbar from '../components/tenant/TenantNavbar'

export default function TenantLayout() {
  const { sidebarOpen } = useSelector((s) => s.ui)

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <TenantSidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <TenantNavbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
