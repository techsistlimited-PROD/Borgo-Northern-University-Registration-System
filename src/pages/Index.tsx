import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Users, Settings } from 'lucide-react'

const Header = () => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-deep-plum rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">NU</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-deep-plum">Northern University Bangladesh</h1>
            <p className="text-sm text-gray-600">Registration & Advising System</p>
          </div>
        </div>
      </div>
    </div>
  </header>
)

export default function Index() {
  return (
    <div className="min-h-screen bg-lavender-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-plum mb-4">
            Welcome to NU Registration System
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access your student portal, advisor dashboard, or administrative panel.
            Choose your role below to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Student Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Student Portal</CardTitle>
              <CardDescription>
                Register for courses, view academic history, and manage your academic journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student-login">
                <Button className="w-full nu-button-primary">
                  Access Student Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo ID: 2021-1-60-001
              </p>
            </CardContent>
          </Card>

          {/* Advisor Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Advisor Portal</CardTitle>
              <CardDescription>
                Guide students, approve registrations, and monitor academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/advisor-login">
                <Button className="w-full nu-button-primary">
                  Access Advisor Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo ID: ADV001
              </p>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Admin Portal</CardTitle>
              <CardDescription>
                Manage system settings, courses, users, and generate comprehensive reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin-login">
                <Button className="w-full nu-button-primary">
                  Access Admin Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo Username: admin
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-mint-green rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-deep-plum font-bold text-lg">📚</span>
            </div>
            <h3 className="font-semibold text-deep-plum">Course Registration</h3>
            <p className="text-sm text-gray-600">Seamless course enrollment system</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-mint-green rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-deep-plum font-bold text-lg">📊</span>
            </div>
            <h3 className="font-semibold text-deep-plum">Academic Tracking</h3>
            <p className="text-sm text-gray-600">Monitor progress and grades</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-mint-green rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-deep-plum font-bold text-lg">⏰</span>
            </div>
            <h3 className="font-semibold text-deep-plum">Class Schedules</h3>
            <p className="text-sm text-gray-600">Dynamic routine management</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-mint-green rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-deep-plum font-bold text-lg">👥</span>
            </div>
            <h3 className="font-semibold text-deep-plum">Academic Advising</h3>
            <p className="text-sm text-gray-600">Personalized guidance system</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Northern University Bangladesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
