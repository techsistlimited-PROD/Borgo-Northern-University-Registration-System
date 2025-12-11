import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/RegistrationAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, ArrowLeft } from 'lucide-react'

export default function ACADLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login({
      username: credentials.username.trim(),
      password: credentials.password.trim(),
      role: 'acad'
    })

    setLoading(false)

    if (success) {
      navigate('/acad/dashboard')
    } else {
      setError('Invalid username or password')
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
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl text-deep-plum">ACAD Portal</CardTitle>
              <CardDescription className="mt-2">
                Enter your credentials to access the academic affairs portal
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
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
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full nu-button-primary"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-mint-green/20 rounded-md">
              <p className="text-sm text-gray-700 font-medium">Demo Credentials:</p>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-600">
                  <p>Username: academic</p>
                  <p>Password: academic123</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="ml-4"
                  onClick={() => setCredentials({ username: 'academic', password: 'academic123' })}
                >
                  Fill Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
