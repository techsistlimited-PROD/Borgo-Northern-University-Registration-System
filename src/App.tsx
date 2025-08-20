import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/RegistrationAuthContext'
import Index from '@/pages/Index'
import StudentLogin from '@/pages/StudentLogin'
import AdvisorLogin from '@/pages/AdvisorLogin'
import AdminLogin from '@/pages/AdminLogin'
import StudentDashboard from '@/pages/StudentDashboard'

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

// Placeholder components for other dashboards
function AdvisorDashboard() {
  const { logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-lavender-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-deep-plum mb-4">Advisor Dashboard</h1>
        <p className="text-gray-600 mb-6">Coming soon - Advanced advising features</p>
        <button 
          onClick={() => { logout(); window.location.href = '/' }}
          className="px-6 py-2 bg-deep-plum text-white rounded-lg hover:bg-accent-purple transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-lavender-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-deep-plum mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Coming soon - Complete administrative control</p>
        <button 
          onClick={() => { logout(); window.location.href = '/' }}
          className="px-6 py-2 bg-deep-plum text-white rounded-lg hover:bg-accent-purple transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/advisor-login" element={<AdvisorLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
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
        path="/advisor/dashboard" 
        element={
          <ProtectedRoute allowedRole="advisor">
            <AdvisorDashboard />
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
