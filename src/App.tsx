import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/RegistrationAuthContext'
import Index from '@/pages/Index'
import StudentLogin from '@/pages/StudentLogin'
import ACADLogin from '@/pages/ACADLogin'
import TeacherLogin from '@/pages/TeacherLogin'
import COELogin from '@/pages/COELogin'
import FinanceLogin from '@/pages/FinanceLogin'
import AdminLogin from '@/pages/AdminLogin'
import GuardianLogin from '@/pages/GuardianLogin'
import StudentDashboard from '@/pages/StudentDashboard'
import ACADDashboard from '@/pages/ACADDashboard'
import TeacherDashboard from '@/pages/TeacherDashboard'
import COEDashboard from '@/pages/COEDashboard'
import FinanceDashboard from '@/pages/FinanceDashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import GuardianDashboard from '@/pages/GuardianDashboard'

// Protected Route Component
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  if (user?.role !== allowedRole) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}


function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/acad-login" element={<ACADLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/coe-login" element={<COELogin />} />
      <Route path="/finance-login" element={<FinanceLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/guardian-login" element={<GuardianLogin />} />
      <Route path="/guardian/login" element={<GuardianLogin />} />

      {/* Protected Routes */}
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/acad/dashboard"
        element={
          <ProtectedRoute allowedRole="acad">
            <ACADDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coe/dashboard"
        element={
          <ProtectedRoute allowedRole="coe">
            <COEDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/dashboard"
        element={
          <ProtectedRoute allowedRole="finance">
            <FinanceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
