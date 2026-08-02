import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/slices/authSlice'

// Public pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'

// Admin pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import TenantsPage from './pages/admin/TenantsPage'
import RoomsPage from './pages/admin/RoomsPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import ComplaintsPage from './pages/admin/ComplaintsPage'
import VisitorsPage from './pages/admin/VisitorsPage'
import NoticesPage from './pages/admin/NoticesPage'
import AdminProfile from './pages/admin/AdminProfile'

// Tenant pages
import TenantLayout from './layouts/TenantLayout'
import TenantDashboard from './pages/tenant/TenantDashboard'
import TenantProfile from './pages/tenant/TenantProfile'
import TenantPayments from './pages/tenant/TenantPayments'
import TenantComplaints from './pages/tenant/TenantComplaints'
import TenantNotices from './pages/tenant/TenantNotices'
import TenantVisitors from './pages/tenant/TenantVisitors'

// Route guards
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)

  useEffect(() => {
    if (token) dispatch(getMe())
  }, [token, dispatch])

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tenants" element={<TenantsPage />} />
            <Route path="/admin/rooms" element={<RoomsPage />} />
            <Route path="/admin/payments" element={<PaymentsPage />} />
            <Route path="/admin/complaints" element={<ComplaintsPage />} />
            <Route path="/admin/visitors" element={<VisitorsPage />} />
            <Route path="/admin/notices" element={<NoticesPage />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Tenant */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="tenant" />}>
          <Route element={<TenantLayout />}>
            <Route path="/tenant" element={<TenantDashboard />} />
            <Route path="/tenant/profile" element={<TenantProfile />} />
            <Route path="/tenant/payments" element={<TenantPayments />} />
            <Route path="/tenant/complaints" element={<TenantComplaints />} />
            <Route path="/tenant/notices" element={<TenantNotices />} />
            <Route path="/tenant/visitors" element={<TenantVisitors />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
