import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EmergencyButton from './components/EmergencyButton'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import LandingPage from './pages/LandingPage'
import SubmitReportPage from './pages/SubmitReportPage'
import ReportSubmittedPage from './pages/ReportSubmittedPage'
import TrackReportPage from './pages/TrackReportPage'
import LoginPage from './pages/LoginPage'
import VerifyBlockchainPage from './pages/VerifyBlockchainPage'

// Dashboard pages
import DashboardHome from './pages/dashboard/DashboardHome'
import DashboardReports from './pages/dashboard/DashboardReports'
import ExportPage from './pages/dashboard/ExportPage'
import ManageUsers from './pages/dashboard/ManageUsers'
import FlaggedReports from './pages/dashboard/FlaggedReports'
import ReportDetail from './pages/dashboard/ReportDetail'
import AuditLogs from './pages/dashboard/AuditLogs'
import CompromisedReports from './pages/dashboard/CompromisedReports'

function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  // Dashboard pages use their own layout (sidebar), no Navbar/Footer
  if (isDashboard) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/reports" element={<DashboardReports />} />
            <Route path="/dashboard/compromised" element={<CompromisedReports />} />
            <Route path="/dashboard/export" element={<ExportPage />} />
            <Route path="/dashboard/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/flagged" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FlaggedReports />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/logs" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogs />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/review/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReportDetail />
              </ProtectedRoute>
            } />
          </Routes>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // Public pages use Navbar + Footer
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/submit-report" element={<SubmitReportPage />} />
          <Route path="/report-submitted" element={<ReportSubmittedPage />} />
          <Route path="/track-report" element={<TrackReportPage />} />
          <Route path="/verify" element={<VerifyBlockchainPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
      <EmergencyButton />
    </div>
  )
}

export default App
