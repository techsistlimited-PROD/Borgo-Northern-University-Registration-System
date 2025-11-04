import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Users, Settings, BookOpen, ClipboardCheck, Wallet, Shield } from 'lucide-react'

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
            Access your student portal, teacher dashboard, or academic affairs panel.
            Choose your role below to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

          {/* Teacher Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Teacher Portal</CardTitle>
              <CardDescription>
                Manage classes, mark attendance, grade students, and track academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/teacher-login">
                <Button className="w-full nu-button-primary">
                  Access Teacher Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo ID: T001
              </p>
            </CardContent>
          </Card>

          {/* ACAD Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">ACAD Portal</CardTitle>
              <CardDescription>
                Manage academic affairs, courses, students, and generate comprehensive reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/acad-login">
                <Button className="w-full nu-button-primary">
                  Access ACAD Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo Username: academic
              </p>
            </CardContent>
          </Card>

          {/* COE Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <ClipboardCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">COE Portal</CardTitle>
              <CardDescription>
                Controller of Examinations - Manage exams, eligibility, results, and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/coe-login">
                <Button className="w-full nu-button-primary">
                  Access COE Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo Username: coe
              </p>
            </CardContent>
          </Card>

          {/* Finance Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Finance Portal</CardTitle>
              <CardDescription>
                Student finance management - billing, payments, waivers, and reconciliation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/finance-login">
                <Button className="w-full nu-button-primary">
                  Access Finance Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo Username: finance
              </p>
            </CardContent>
          </Card>

          {/* Guardian Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Guardian Portal</CardTitle>
              <CardDescription>
                Track your ward's attendance, academic performance, and finances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/guardian-login">
                <Button className="w-full nu-button-primary">
                  Access Guardian Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Demo: father.cse@demo.nu
              </p>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-plum to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-plum">Admin Portal</CardTitle>
              <CardDescription>
                System administration - users, roles, access control, and compliance logs
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

          {/* HRM Portal */}
          <Card className="text-center group hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-violet to-soft-plum rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-deep-violet font-poppins">HRM Portal</CardTitle>
              <CardDescription>
                Human Resource Management - payroll, recruitment, training, compliance, and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/hrm-login">
                <Button className="w-full bg-gradient-to-r from-deep-violet to-soft-plum text-white hover:opacity-90">
                  Access HRM Portal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Staff Access
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
