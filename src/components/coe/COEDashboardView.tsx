import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, AlertTriangle, FileText, TrendingUp, Download } from 'lucide-react'

export default function COEDashboardView() {
  const [filters, setFilters] = useState({
    semester: 'Fall 2025',
    examType: 'Final',
    program: 'All Programs',
    campus: 'All Campuses'
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-plum">Examination Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-mint-green text-deep-plum">Fall 2025 · Published</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select 
            className="w-full p-2 border rounded-md text-sm"
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          >
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
          <select 
            className="w-full p-2 border rounded-md text-sm"
            value={filters.examType}
            onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
          >
            <option>Final</option>
            <option>Midterm</option>
            <option>Improvement</option>
            <option>Special</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select 
            className="w-full p-2 border rounded-md text-sm"
            value={filters.program}
            onChange={(e) => setFilters({ ...filters, program: e.target.value })}
          >
            <option>All Programs</option>
            <option>BSc CSE</option>
            <option>BBA</option>
            <option>LLB</option>
            <option>MBA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <select 
            className="w-full p-2 border rounded-md text-sm"
            value={filters.campus}
            onChange={(e) => setFilters({ ...filters, campus: e.target.value })}
          >
            <option>All Campuses</option>
            <option>Permanent Campus</option>
            <option>Banani Campus</option>
            <option>Mirpur Campus</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total Registered</CardDescription>
            <CardTitle className="text-3xl text-deep-plum">1,284</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">Eligible to sit Final Exam</p>
            <Badge className="mt-2 bg-green-100 text-green-800">+42 since yesterday</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-amber-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Pending Invigilator</CardDescription>
            <CardTitle className="text-3xl text-amber-600">12 rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">Not assigned for 02 Nov 2025</p>
            <Button variant="link" className="p-0 h-auto mt-2 text-xs">Assign now →</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Mark Submission</CardDescription>
            <CardTitle className="text-lg text-deep-plum">CSE: 18/24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">BBA: 9/14 submitted</p>
            <div className="flex gap-1 mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">On Track</Badge>
              <Badge className="bg-red-100 text-red-800 text-xs">Delayed</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Incidents Reported</CardDescription>
            <CardTitle className="text-3xl text-red-600">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">2 Pending Controller decision</p>
            <Badge className="mt-2 bg-red-100 text-red-800">Requires Action</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Candidate Distribution by Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { program: 'BSc CSE', count: 412, color: 'bg-deep-plum' },
                { program: 'BBA', count: 305, color: 'bg-accent-purple' },
                { program: 'LLB', count: 188, color: 'bg-mint-green' },
                { program: 'MBA', count: 112, color: 'bg-amber-500' },
                { program: 'Others', count: 267, color: 'bg-gray-400' }
              ].map((item) => (
                <div key={item.program}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.program}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${(item.count / 1284) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mark Submission Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { dept: 'CSE', submitted: 18, total: 24, percent: 75 },
                { dept: 'BBA', submitted: 9, total: 14, percent: 60 },
                { dept: 'Law', submitted: 12, total: 12, percent: 100 },
                { dept: 'English', submitted: 3, total: 10, percent: 30 }
              ].map((item) => (
                <div key={item.dept}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.dept}</span>
                    <span className="font-semibold">{item.submitted}/{item.total} ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.percent === 100 ? 'bg-green-500' : item.percent >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Sessions</CardTitle>
          <CardDescription>Ongoing and upcoming examination sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Time Slot</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Course Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Course Title</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Room Block</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Invigilators</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    time: '10:00–12:00',
                    code: 'CSE 2211',
                    title: 'Data Structures',
                    room: 'Center A / Room 501',
                    invigilators: 'Dr. Nusrat Jahan, Md. Shakil',
                    status: 'Attendance Submitted',
                    statusColor: 'bg-green-100 text-green-800'
                  },
                  {
                    time: '10:00–12:00',
                    code: 'BBA 1102',
                    title: 'Principles of Management',
                    room: 'Center B / Room 301',
                    invigilators: 'Farzana Kabir',
                    status: 'Pending Attendance',
                    statusColor: 'bg-amber-100 text-amber-800'
                  },
                  {
                    time: '14:00–16:00',
                    code: 'LAW 302',
                    title: 'Constitutional Law II',
                    room: 'Center A / Auditorium',
                    invigilators: 'Md. Shakil Rahman',
                    status: 'Incident Filed',
                    statusColor: 'bg-red-100 text-red-800'
                  }
                ].map((session, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="p-3 text-sm">{session.time}</td>
                    <td className="p-3 text-sm font-medium">{session.code}</td>
                    <td className="p-3 text-sm">{session.title}</td>
                    <td className="p-3 text-sm">{session.room}</td>
                    <td className="p-3 text-sm text-gray-600">{session.invigilators}</td>
                    <td className="p-3">
                      <Badge className={session.statusColor}>{session.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
