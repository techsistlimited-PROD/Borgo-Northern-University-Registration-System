import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap,
  BookOpen,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react'

interface DashboardOverviewProps {
  user: any
}

const upcomingDeadlines = [
  { title: 'TER Fill Up Deadline', date: '15/09/2025', type: 'academic', urgent: true },
  { title: 'Final Payment (30%)', date: '20/09/2025', type: 'payment', urgent: true },
  { title: 'Final Exams Start', date: '12/09/2025', type: 'exam', urgent: false },
  { title: 'Add/Drop Period Ends', date: '17/06/2025', type: 'registration', urgent: false }
]

const currentSemesterCourses = [
  { code: 'CSE 2301', title: 'Database Management Systems', section: 'A', credits: 3.0 },
  { code: 'CSE 2315', title: 'Software Engineering', section: 'B', credits: 3.0 },
  { code: 'CSE 2345', title: 'Computer Networks', section: 'A', credits: 3.0 },
  { code: 'ENG 2201', title: 'Technical Writing', section: 'C', credits: 2.0 },
  { code: 'MATH 2203', title: 'Statistics & Probability', section: 'A', credits: 2.0 }
]

const quickStats = {
  currentGPA: 3.85,
  totalCredits: 45,
  completedCredits: 30,
  currentSemesterCredits: 15,
  waiverPercentage: 20,
  waiverStatus: 'Active',
  outstandingDues: 11100,
  nextPaymentDue: '20/09/2025'
}

export const StudentDashboardOverview = ({ user }: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-deep-plum">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Here's your academic overview at a glance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Student ID: {user?.id}</p>
          <p className="text-sm text-gray-600">{user?.program}</p>
          <Badge className="mt-1 bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active Student
          </Badge>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Current GPA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{quickStats.currentGPA}</p>
            <p className="text-sm text-gray-600">Out of 4.00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Credits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{quickStats.completedCredits}</p>
            <p className="text-sm text-gray-600">{quickStats.totalCredits - quickStats.completedCredits} remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span>Waiver</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{quickStats.waiverPercentage}%</p>
            <p className="text-sm text-gray-600">{quickStats.waiverStatus}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              <span>Dues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">৳{quickStats.outstandingDues.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span>Urgent Actions Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDeadlines.filter(deadline => deadline.urgent).map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    deadline.type === 'payment' ? 'bg-red-500' : 
                    deadline.type === 'academic' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-red-800">{deadline.title}</p>
                    <p className="text-sm text-red-600">Due: {deadline.date}</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Semester Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-deep-plum" />
              <span>Current Semester Courses</span>
            </CardTitle>
            <CardDescription>Fall 2025 - Registered Courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentSemesterCourses.map((course, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-lavender-bg rounded-lg">
                  <div>
                    <p className="font-semibold text-deep-plum">{course.code}</p>
                    <p className="text-sm text-gray-600">{course.title}</p>
                    <p className="text-xs text-gray-500">Section {course.section} • {course.credits} credits</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Total Credits This Semester:</span>
                <span className="font-semibold text-deep-plum">{quickStats.currentSemesterCredits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-deep-plum" />
              <span>Academic Progress</span>
            </CardTitle>
            <CardDescription>Your journey towards graduation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Program Completion</span>
                  <span className="text-sm text-gray-600">
                    {Math.round((quickStats.completedCredits / quickStats.totalCredits) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-deep-plum h-2 rounded-full" 
                    style={{ width: `${(quickStats.completedCredits / quickStats.totalCredits) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{quickStats.currentGPA}</div>
                  <div className="text-sm text-green-700">Current GPA</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{quickStats.completedCredits}</div>
                  <div className="text-sm text-blue-700">Credits Earned</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-deep-plum mb-2">Next Milestones</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete current semester: 15 credits</li>
                  <li>• Maintain GPA above 3.5 for waiver</li>
                  <li>• Graduation expected: Summer 2026</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Schedule & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-deep-plum" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      deadline.type === 'payment' ? 'bg-red-500' : 
                      deadline.type === 'academic' ? 'bg-orange-500' : 
                      deadline.type === 'exam' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{deadline.title}</p>
                      <p className="text-sm text-gray-600">{deadline.date}</p>
                    </div>
                  </div>
                  <Badge variant={deadline.urgent ? 'destructive' : 'secondary'}>
                    {deadline.urgent ? 'Urgent' : 'Upcoming'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-deep-plum" />
              <span>Financial Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">৳{quickStats.outstandingDues.toLocaleString()}</div>
                  <div className="text-sm text-red-700">Outstanding Dues</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{quickStats.waiverPercentage}%</div>
                  <div className="text-sm text-purple-700">Active Waiver</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-deep-plum mb-2">Payment Reminders</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Next payment due: {quickStats.nextPaymentDue}</li>
                  <li>• Maintain waiver GPA requirement: 3.5+</li>
                  <li>• Current waiver status: {quickStats.waiverStatus}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
