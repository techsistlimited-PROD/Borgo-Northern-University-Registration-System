import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Calendar, DollarSign, GraduationCap, TrendingUp } from 'lucide-react'
import { DEMO_MODE, DEMO_STATIC_GUARDIAN } from '@/config/demo'
import { GuardianDemo } from '@/services/guardianDemo'
import { attendanceService, resultService, financeService, terService } from '@/lib/guardianServices'
import { Repo } from '@/lib/repo'
import { Student, AttendanceRecord, Receipt, Section, Offering, Course } from '@/lib/seedAll'

interface Props {
  wardId: string
  termId: string
  onNavigate?: (section: 'attendance' | 'academics' | 'finance' | 'notifications' | 'profile') => void
}

export default function GuardianDashboardView({ wardId, termId, onNavigate }: Props) {
  const [student, setStudent] = useState<any>(null)
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, late: 0, percentage: 0 })
  const [financeStats, setFinanceStats] = useState({ totalDue: 0, lastPaymentDate: '' })
  const [academicStats, setAcademicStats] = useState({ gpa: 0, locked: false, reasons: [] as string[] })
  const [recentAttendance, setRecentAttendance] = useState<any[]>([])
  const [recentPayments, setRecentPayments] = useState<any[]>([])
  const isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN

  useEffect(() => {
    loadData()
  }, [wardId, termId])

  const loadData = () => {
    if (isStaticMode) {
      // Load from static demo
      const wards = GuardianDemo.getWards()
      const ward = wards.find(w => w.id === wardId)
      setStudent(ward || null)

      // Attendance stats
      const attStats = GuardianDemo.getAttendanceStats(wardId)
      setAttendanceStats(attStats)

      // Recent attendance (last 5)
      const recentAtt = GuardianDemo.getAttendance(wardId).slice(0, 5)
      setRecentAttendance(recentAtt)

      // Finance stats
      const finance = GuardianDemo.getFinance(wardId)
      setFinanceStats({
        totalDue: finance.summary.due,
        lastPaymentDate: finance.payments[0]?.date || 'N/A'
      })
      setRecentPayments(finance.payments.slice(0, 5))

      // Academic stats
      const results = GuardianDemo.getResults(wardId)
      const blocked = results.gates.dues > 0 || results.gates.terPending
      const reasons = []
      if (results.gates.dues > 0) reasons.push('Outstanding dues must be cleared')
      if (results.gates.terPending) reasons.push('TER not submitted')

      setAcademicStats({
        gpa: results.semesters[results.semesters.length - 1]?.gpa || 0,
        locked: blocked,
        reasons
      })
    } else {
      // Load from Repo
      const students = Repo.get<Student>('students')
      const ward = students.find(s => s.id === wardId)
      setStudent(ward || null)

      // Attendance stats
      const attStats = attendanceService.getStats(wardId, termId)
      setAttendanceStats(attStats)

      // Recent attendance
      const recentAtt = attendanceService.listByStudent(wardId, { termId }).slice(0, 5)
      setRecentAttendance(recentAtt)

      // Finance stats
      const statement = financeService.getStatement(wardId, { termId })
      const payments = financeService.listPayments(wardId, { termId })
      setFinanceStats({
        totalDue: statement.outstanding,
        lastPaymentDate: payments[0]?.date || 'N/A'
      })
      setRecentPayments(payments.slice(0, 5))

      // Academic stats
      const resultCheck = resultService.isResultUnlocked(wardId, termId)
      const termResult = resultService.getTermSummary(wardId, termId)
      setAcademicStats({
        gpa: termResult?.gpa || 0,
        locked: !resultCheck.unlocked,
        reasons: resultCheck.reasons
      })
    }
  }

  if (!student) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-deep-plum to-accent-purple text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <div className="mt-2 space-y-1 text-white/90">
                <div>University ID: {student.id}</div>
                <div>Program: {student.programName}</div>
                <div>Current Term: {termId}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">CGPA</div>
              <div className="text-4xl font-bold">{student.cgpa.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(financeStats.totalDue > 0 || academicStats.locked) && (
        <div className="space-y-3">
          {financeStats.totalDue > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-red-900">Outstanding Dues</div>
                  <div className="text-sm text-red-700 mt-1">
                    Result access locked due to outstanding dues of <span className="font-bold">{financeStats.totalDue.toFixed(2)} BDT</span> for {termId}.
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => onNavigate?.('finance')}
                  >
                    View Finance
                  </Button>
                </div>
              </div>
            </div>
          )}

          {academicStats.locked && academicStats.reasons.includes('TER not submitted') && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-orange-900">TER Pending</div>
                  <div className="text-sm text-orange-700 mt-1">
                    Result access locked until Teacher Evaluation Report (TER) is submitted.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Attendance This Term</div>
                <div className="text-3xl font-bold text-deep-plum mt-1">{attendanceStats.percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">{attendanceStats.absent} absences</div>
              </div>
              <Calendar className="w-12 h-12 text-deep-plum opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Outstanding Dues</div>
                <div className={`text-3xl font-bold mt-1 ${financeStats.totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {financeStats.totalDue.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">BDT</div>
              </div>
              <DollarSign className="w-12 h-12 text-deep-plum opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">GPA This Term</div>
                {academicStats.locked ? (
                  <Badge variant="destructive" className="mt-2">LOCKED</Badge>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-deep-plum mt-1">{academicStats.gpa.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 mt-1">out of 4.00</div>
                  </>
                )}
              </div>
              <GraduationCap className="w-12 h-12 text-deep-plum opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Attendance</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('attendance')}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Course</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Time Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentAttendance.map((att, idx) => {
                let courseDisplay = ''
                let timeDisplay = ''

                if (isStaticMode) {
                  courseDisplay = `${att.course} - ${att.title}`
                  timeDisplay = att.slot || 'N/A'
                } else {
                  const section = Repo.get<Section>('sections').find(s => s.id === att.sectionId)
                  const offering = section ? Repo.get<Offering>('offerings').find(o => o.id === section.offeringId) : null
                  const course = offering ? Repo.get<Course>('courses').find(c => c.id === offering.courseId) : null
                  courseDisplay = course ? `${course.code} - ${course.title}` : att.sectionId
                  timeDisplay = att.recordedAt ? new Date(att.recordedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
                }

                return (
                  <tr key={att.id || idx}>
                    <td className="px-4 py-2 text-sm">{att.date}</td>
                    <td className="px-4 py-2 text-sm">{courseDisplay}</td>
                    <td className="px-4 py-2 text-sm">
                      <Badge variant={att.status === 'P' ? 'default' : att.status === 'L' ? 'secondary' : 'destructive'}>
                        {att.status === 'P' ? 'Present' : att.status === 'L' ? 'Late' : 'Absent'}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{timeDisplay}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {recentAttendance.length === 0 && (
            <div className="text-center py-8 text-gray-500">No attendance records this term</div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Payments</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('finance')}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">MR No</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Method</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Paid At</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentPayments.map((payment, idx) => (
                <tr key={payment.id || payment.mr || idx}>
                  <td className="px-4 py-2 text-sm font-medium">{payment.mr || payment.moneyReceiptNo}</td>
                  <td className="px-4 py-2 text-sm">{payment.amount.toFixed(2)} BDT</td>
                  <td className="px-4 py-2 text-sm"><Badge variant="outline">{payment.method}</Badge></td>
                  <td className="px-4 py-2 text-sm">{payment.date}</td>
                  <td className="px-4 py-2 text-sm">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (isStaticMode) {
                          window.print()
                        } else {
                          financeService.downloadReceipt(payment.moneyReceiptNo)
                        }
                      }}
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">No payments this term</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
