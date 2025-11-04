import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, ArrowLeft, User, Lock, Shield } from 'lucide-react'

type HRMRole = 'hr_officer' | 'hr_head' | 'system_admin'

export default function HRMLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<HRMRole>('hr_officer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login({ username, password, role: selectedRole })
      if (success) {
        navigate('/hrm/dashboard')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemo = (role: HRMRole) => {
    setSelectedRole(role)
    switch (role) {
      case 'hr_officer':
        setUsername('hr_officer')
        setPassword('hrm123')
        break
      case 'hr_head':
        setUsername('hr_head')
        setPassword('hrm123')
        break
      case 'system_admin':
        setUsername('sys_admin')
        setPassword('hrm123')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-growth-green to-metal-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-white hover:text-white/80 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-growth-green to-metal-black rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold font-poppins text-growth-green">HRM Portal</CardTitle>
              <CardDescription className="font-inter">Human Resource Management System</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as HRMRole)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr_officer">HR Officer</SelectItem>
                      <SelectItem value="hr_head">HR Head</SelectItem>
                      <SelectItem value="system_admin">System Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-growth-green to-metal-black hover:opacity-90 text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 text-center">Quick Demo Login:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFillDemo('hr_officer')}
                    className="text-xs"
                  >
                    Officer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFillDemo('hr_head')}
                    className="text-xs"
                  >
                    HR Head
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFillDemo('system_admin')}
                    className="text-xs"
                  >
                    Sys Admin
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 mt-4 space-y-1">
                <p className="font-medium">Demo Credentials:</p>
                <p className="text-xs">HR Officer: hr_officer / hrm123</p>
                <p className="text-xs">HR Head: hr_head / hrm123</p>
                <p className="text-xs">System Admin: sys_admin / hrm123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
