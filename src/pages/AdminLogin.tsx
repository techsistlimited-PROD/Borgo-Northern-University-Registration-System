import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react'
import OtpVerificationModal from '@/components/admin/OtpVerificationModal'
import { ipBlocklistStatic } from '@/lib/adminSecuritySeeds'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Demo: 2FA OTP is enabled by default
  const otpEnabled = true

  // Mock IP address for demo
  const userIP = '103.102.101.1'

  // Brute-force tracking (in-memory for demo)
  const [failedAttempts, setFailedAttempts] = useState<Record<string, { count: number, timestamp: number }>>({})
  const [lockedAccounts, setLockedAccounts] = useState<Set<string>>(new Set())

  const checkIPBlocking = (): boolean => {
    // Check if IP is in blocklist
    const blockedIP = ipBlocklistStatic.find(ip => 
      ip.category === 'Blocklist' && 
      ip.status === 'Active' && 
      ip.ip === userIP
    )

    if (blockedIP) {
      setError(`Access denied. IP blocked: ${blockedIP.reason}`)
      return true
    }

    // Check if IP is whitelisted
    const whitelistedIP = ipBlocklistStatic.find(ip => 
      ip.category === 'Whitelist' && 
      ip.status === 'Active' && 
      ip.ip === userIP
    )

    if (whitelistedIP) {
      console.log('IP whitelisted, bypassing additional checks')
    }

    return false
  }

  const trackFailedAttempt = (username: string) => {
    const now = Date.now()
    const key = username.toLowerCase()
    const existing = failedAttempts[key] || { count: 0, timestamp: now }
    
    // Reset if window expired (10 minutes)
    const windowExpired = now - existing.timestamp > 10 * 60 * 1000
    
    if (windowExpired) {
      setFailedAttempts({ ...failedAttempts, [key]: { count: 1, timestamp: now } })
    } else {
      const newCount = existing.count + 1
      setFailedAttempts({ ...failedAttempts, [key]: { count: newCount, timestamp: existing.timestamp } })
      
      // Auto-lock after 5 failed attempts within 10 minutes
      if (newCount >= 5) {
        setLockedAccounts(new Set([...lockedAccounts, key]))
        setError('Account locked due to repeated login failures (5 attempts in 10 minutes). Contact system administrator.')
        
        // Log to Invalid Attempts (demo only - would be real DB in production)
        console.log('INVALID ATTEMPT LOGGED:', {
          username,
          ip: userIP,
          attemptCount: newCount,
          action: 'Lock Applied',
          reason: 'Exceeded 5 attempts in 10 minutes'
        })
        return true
      }
      
      setError(`Invalid credentials. ${5 - newCount} attempt(s) remaining before account lock.`)
    }
    
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const username = credentials.username.trim()
    const password = credentials.password.trim()

    // 1. Check if IP is blocked
    if (checkIPBlocking()) {
      setLoading(false)
      return
    }

    // 2. Check if account is locked
    if (lockedAccounts.has(username.toLowerCase())) {
      setError('Account is locked due to repeated failures. Please contact system administrator.')
      setLoading(false)
      return
    }

    // 3. Attempt login
    const success = await login({
      username,
      password,
      role: 'admin'
    })

    setLoading(false)

    if (success) {
      // Clear failed attempts on successful credentials
      const key = username.toLowerCase()
      if (failedAttempts[key]) {
        const updated = { ...failedAttempts }
        delete updated[key]
        setFailedAttempts(updated)
      }

      // 4. Check if OTP is required
      if (otpEnabled) {
        setOtpModalOpen(true)
        setPendingNavigation(true)
        
        // Log successful credential validation (demo)
        console.log('LOGIN HISTORY LOGGED:', {
          user: 'System Admin',
          username,
          ip: userIP,
          result: 'Pending OTP',
          timestamp: new Date().toLocaleString()
        })
      } else {
        // Navigate directly if no OTP required
        console.log('LOGIN HISTORY LOGGED:', {
          user: 'System Admin',
          username,
          ip: userIP,
          result: 'Success',
          timestamp: new Date().toLocaleString()
        })
        navigate('/admin/dashboard')
      }
    } else {
      // Track failed attempt
      const locked = trackFailedAttempt(username)
      
      if (!locked && !error) {
        setError('Invalid username or password')
      }
      
      // Log failed attempt (demo)
      console.log('LOGIN HISTORY LOGGED:', {
        user: username,
        username,
        ip: userIP,
        result: 'Failed',
        timestamp: new Date().toLocaleString()
      })
    }
  }

  const handleOtpVerify = (success: boolean, attempts: number) => {
    if (success) {
      // OTP verified successfully
      console.log('EMAIL LOG LOGGED:', {
        user: 'System Admin',
        event: 'OTP Verification',
        status: 'Success',
        ip: userIP,
        timestamp: new Date().toLocaleString()
      })
      
      console.log('LOGIN HISTORY LOGGED:', {
        user: 'System Admin',
        username: credentials.username,
        ip: userIP,
        result: 'Success',
        otpAttempts: attempts,
        timestamp: new Date().toLocaleString()
      })
      
      setOtpModalOpen(false)
      navigate('/admin/dashboard')
    } else {
      // OTP verification failed
      if (attempts >= 3) {
        // Lock account after 3 failed OTP attempts
        const key = credentials.username.toLowerCase()
        setLockedAccounts(new Set([...lockedAccounts, key]))
        
        console.log('EMAIL LOG LOGGED:', {
          user: 'System Admin',
          event: 'OTP Verification',
          status: 'Failed',
          ip: userIP,
          attempts: attempts,
          timestamp: new Date().toLocaleString()
        })
        
        console.log('LOGIN HISTORY LOGGED:', {
          user: 'System Admin',
          username: credentials.username,
          ip: userIP,
          result: 'OTP Failed',
          otpAttempts: attempts,
          timestamp: new Date().toLocaleString()
        })
        
        setOtpModalOpen(false)
        setError('Account locked due to failed OTP verification. Contact system administrator.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-plum via-accent-purple to-deep-plum flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-white mb-6 hover:text-mint-green transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4 pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl text-deep-plum">Admin & Security Portal</CardTitle>
              <CardDescription className="mt-2">
                Enter your credentials to access the admin control panel
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* Security Features Notice */}
            {otpEnabled && (
              <div className="mb-4 p-3 bg-mint-green/20 border border-mint-green/40 rounded-md flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-deep-plum mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-700">
                  <p className="font-medium">Enhanced Security Active</p>
                  <p className="mt-1">• Email OTP verification required</p>
                  <p>• Brute-force protection (5 attempts / 10 mins)</p>
                  <p>• IP blocking enforcement enabled</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full nu-button-primary"
                disabled={loading || lockedAccounts.has(credentials.username.toLowerCase())}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-mint-green/20 rounded-md">
              <p className="text-sm text-gray-700 font-medium">Demo Credentials:</p>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-600">
                  <p>Username: admin</p>
                  <p>Password: admin123</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="ml-4"
                  onClick={() => setCredentials({ username: 'admin', password: 'admin123' })}
                  disabled={loading}
                >
                  Fill Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (Demo Mode Only) */}
        <div className="mt-4 text-xs text-white/60 text-center">
          Demo Mode • IP: {userIP} • OTP: {otpEnabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        open={otpModalOpen}
        onVerify={handleOtpVerify}
        userEmail="admin@nub.ac.bd"
      />
    </div>
  )
}
