import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Download, Eye, CheckCircle } from 'lucide-react'
import { DEMO_MODE, DEMO_STATIC_GUARDIAN } from '@/config/demo'
import { GuardianDemo } from '@/services/guardianDemo'
import {
  attendanceService,
  resultService,
  financeService,
  notificationService,
  guardianService,
  LogService
} from '@/lib/guardianServices'
import { Repo } from '@/lib/repo'
import { AttendanceRecord, Notification, Guardian, GuardianLink, Student, Course, Section, Offering } from '@/lib/seedAll'
import { exportToCSV } from '@/lib/exportUtils'

// Guardian Attendance Component
export function GuardianAttendance({ wardId, termId }: { wardId: string; termId: string }) {
  const [records, setRecords] = useState<any[]>([])
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, percentage: 0 })
  const [filters, setFilters] = useState({ from: '', to: '', status: '', course: '' })
  const isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN

  useEffect(() => {
    loadData()

    if (!isStaticMode) {
      const unsub = attendanceService.subscribeStudentStream(wardId, (newRecord) => {
        loadData()
      })
      return unsub
    }
  }, [wardId, termId, filters])

  const loadData = () => {
    if (isStaticMode) {
      const data = GuardianDemo.getAttendance(wardId, filters)
      setRecords(data)
      setStats(GuardianDemo.getAttendanceStats(wardId))
    } else {
      const data = attendanceService.listByStudent(wardId, { termId, ...filters })
      setRecords(data)
      setStats(attendanceService.getStats(wardId, termId))
    }
  }

  const handleExport = () => {
    const exportData = records.map(r => ({
      Date: r.date,
      Course: isStaticMode ? `${r.course} - ${r.title}` : r.sectionId,
      Status: r.status === 'P' ? 'Present' : r.status === 'L' ? 'Late' : 'Absent'
    }))
    exportToCSV(exportData, 'attendance')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Attendance</h1>
          <p className="text-sm text-gray-600">Track your ward's attendance</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Present</div><div className="text-2xl font-bold text-green-600">{stats.present}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Absent</div><div className="text-2xl font-bold text-red-600">{stats.absent}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Late</div><div className="text-2xl font-bold text-orange-600">{stats.late}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Attendance %</div><div className="text-2xl font-bold text-deep-plum">{stats.percentage}%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} placeholder="From Date" />
            <Input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} placeholder="To Date" />
            <Input type="text" value={filters.course} onChange={(e) => setFilters({ ...filters, course: e.target.value })} placeholder="Course Code" />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="border rounded-md px-3 py-2">
              <option value="">All Status</option>
              <option value="P">Present</option>
              <option value="A">Absent</option>
              <option value="L">Late</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Course</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record, idx) => {
                let courseDisplay = ''
                let timeDisplay = ''

                if (isStaticMode) {
                  courseDisplay = `${record.course} - ${record.title}`
                  timeDisplay = record.slot || 'N/A'
                } else {
                  const sections = Repo.get<Section>('sections')
                  const offerings = Repo.get<Offering>('offerings')
                  const courses = Repo.get<Course>('courses')
                  const section = sections.find(s => s.id === record.sectionId)
                  const offering = section ? offerings.find(o => o.id === section.offeringId) : null
                  const course = offering ? courses.find(c => c.id === offering.courseId) : null
                  courseDisplay = course ? `${course.code} - ${course.title}` : 'N/A'
                  timeDisplay = new Date(record.recordedAt).toLocaleString()
                }

                return (
                  <tr key={record.id || `${record.wardId}-${idx}`}>
                    <td className="px-4 py-3 text-sm">{record.date}</td>
                    <td className="px-4 py-3 text-sm">{courseDisplay}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={record.status === 'P' ? 'default' : record.status === 'L' ? 'secondary' : 'destructive'}>
                        {record.status === 'P' ? 'Present' : record.status === 'L' ? 'Late' : 'Absent'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{timeDisplay}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {records.length === 0 && <div className="text-center py-12 text-gray-500">No attendance records found</div>}
        </CardContent>
      </Card>
    </div>
  )
}

// Guardian Academics Component (with gating)
export function GuardianAcademics({ wardId, termId }: { wardId: string; termId: string }) {
  const [results, setResults] = useState<any>(null)
  const [unlockStatus, setUnlockStatus] = useState({ unlocked: true, reasons: [] as string[] })
  const isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN

  useEffect(() => {
    loadData()
  }, [wardId, termId])

  const loadData = () => {
    if (isStaticMode) {
      const res = GuardianDemo.getResults(wardId)
      setResults(res)

      const blocked = res.gates.dues > 0 || res.gates.terPending
      const reasons = []
      if (res.gates.dues > 0) reasons.push(`Outstanding dues: ${res.gates.dues} BDT must be cleared`)
      if (res.gates.terPending) reasons.push('Teacher Evaluation Report (TER) not submitted')

      setUnlockStatus({ unlocked: !blocked, reasons })
    } else {
      const status = resultService.isResultUnlocked(wardId, termId)
      setUnlockStatus(status)

      if (status.unlocked) {
        const termRes = resultService.getTermSummary(wardId, termId)
        const courseRes = resultService.listCourseResults(wardId, termId)
        setResults({ termResult: termRes, courseResults: courseRes })
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Academic Results</h1>

      {!unlockStatus.unlocked && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <div className="font-medium text-red-900">Results Locked</div>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2">
                {unlockStatus.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {unlockStatus.unlocked && results && (
        <>
          {isStaticMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">CGPA</div><div className="text-3xl font-bold text-deep-plum">{results.cgpa.toFixed(2)}</div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Total Semesters</div><div className="text-3xl font-bold text-deep-plum">{results.semesters.length}</div></CardContent></Card>
              </div>

              {results.semesters.map((sem: any, semIdx: number) => (
                <Card key={semIdx} className="mt-4">
                  <CardHeader>
                    <CardTitle>{sem.term} - GPA: {sem.gpa.toFixed(2)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Course Code</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Credit</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sem.courses.map((course: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-sm font-medium">{course.code}</td>
                            <td className="px-4 py-3 text-sm">{course.title}</td>
                            <td className="px-4 py-3 text-sm">{course.credit}</td>
                            <td className="px-4 py-3 text-sm"><Badge>{course.grade}</Badge></td>
                            <td className="px-4 py-3 text-sm">{course.gp.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">GPA</div><div className="text-3xl font-bold text-deep-plum">{results.termResult.gpa.toFixed(2)}</div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">CGPA</div><div className="text-3xl font-bold text-deep-plum">{results.termResult.cgpa.toFixed(2)}</div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Credits Earned</div><div className="text-3xl font-bold text-deep-plum">{results.termResult.creditsEarned}</div></CardContent></Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Course Results</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Course Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Credit</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {results.courseResults.map((result: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm font-medium">{result.courseCode}</td>
                          <td className="px-4 py-3 text-sm">{result.title}</td>
                          <td className="px-4 py-3 text-sm">{result.credit}</td>
                          <td className="px-4 py-3 text-sm"><Badge>{result.grade}</Badge></td>
                          <td className="px-4 py-3 text-sm">{result.gradePoint.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  )
}

// Guardian Finance Component
export function GuardianFinance({ wardId, termId }: { wardId: string; termId: string }) {
  const [finance, setFinance] = useState<any>(null)
  const isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN

  useEffect(() => {
    if (isStaticMode) {
      setFinance(GuardianDemo.getFinance(wardId))
    } else {
      setFinance(financeService.getStatement(wardId, { termId }))
    }
  }, [wardId, termId])

  if (!finance) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Finance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Total Bill</div><div className="text-2xl font-bold">{(isStaticMode ? finance.summary.totalBill : finance.totalBill).toFixed(2)} BDT</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Total Paid</div><div className="text-2xl font-bold text-green-600">{(isStaticMode ? finance.summary.totalPaid : finance.totalPaid).toFixed(2)} BDT</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-gray-600">Outstanding</div><div className="text-2xl font-bold text-red-600">{(isStaticMode ? finance.summary.due : finance.outstanding).toFixed(2)} BDT</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Bills & Dues</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Bill No / Head</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {finance.payables.map((p: any, idx: number) => (
                <tr key={p.id || p.mr || idx}>
                  <td className="px-4 py-3 text-sm">{isStaticMode ? `${p.mr} - ${p.head}` : p.billNo}</td>
                  <td className="px-4 py-3 text-sm">{p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{p.due || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm"><Badge variant={p.status === 'Paid' ? 'default' : 'destructive'}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">MR No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {finance.payments.map((p: any, idx: number) => (
                <tr key={p.id || p.mr || idx}>
                  <td className="px-4 py-3 text-sm">{p.mr || p.moneyReceiptNo}</td>
                  <td className="px-4 py-3 text-sm">{p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm"><Badge variant="outline">{p.method}</Badge></td>
                  <td className="px-4 py-3 text-sm">{p.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <Button size="sm" variant="ghost" onClick={() => isStaticMode ? window.print() : financeService.downloadReceipt(p.moneyReceiptNo)}>
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// Guardian Notifications Component
export function GuardianNotifications({ guardianId }: { guardianId: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN

  useEffect(() => {
    loadData()

    if (!isStaticMode) {
      const unsub = notificationService.subscribe(loadData)
      return unsub
    }
  }, [guardianId])

  const loadData = () => {
    if (isStaticMode) {
      setNotifications(GuardianDemo.getNotifications())
    } else {
      setNotifications(notificationService.listForGuardian(guardianId))
    }
  }

  const handleMarkRead = (id: string) => {
    if (isStaticMode) {
      GuardianDemo.markAsRead(id)
    } else {
      notificationService.markAsRead(id)
    }
    loadData()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Notifications</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Channel</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Message</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notifications.map(notif => {
                const isUnread = isStaticMode ? !notif.read : notif.status === 'Unread'
                const timestamp = isStaticMode ? notif.ts : notif.createdAt
                const channel = isStaticMode ? 'ERP' : notif.channel

                return (
                  <tr key={notif.id} className={isUnread ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-3 text-sm">{new Date(timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm"><Badge variant="outline">{channel}</Badge></td>
                    <td className="px-4 py-3 text-sm font-medium">{notif.title}</td>
                    <td className="px-4 py-3 text-sm">{isStaticMode ? notif.body : notif.message}</td>
                    <td className="px-4 py-3 text-sm"><Badge variant={isUnread ? 'default' : 'secondary'}>{isUnread ? 'Unread' : 'Read'}</Badge></td>
                    <td className="px-4 py-3 text-sm">
                      {isUnread && (
                        <Button size="sm" variant="ghost" onClick={() => handleMarkRead(notif.id)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {notifications.length === 0 && <div className="text-center py-12 text-gray-500">No notifications</div>}
        </CardContent>
      </Card>
    </div>
  )
}

// Guardian Profile Component
export function GuardianProfile({ guardianId }: { guardianId: string }) {
  const [guardian, setGuardian] = useState<any>(null)
  const [wards, setWards] = useState<any[]>([])
  const [prefs, setPrefs] = useState({ erpPush: true, sms: true, email: true })
  const isStaticMode = DEMO_MODE && DEMO_STATIC_GUARDIAN

  useEffect(() => {
    if (isStaticMode) {
      const userStr = localStorage.getItem('nu-user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setGuardian({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: 'N/A',
          status: 'Active',
          preferences: { erpPush: true, sms: true, email: true }
        })
      }

      const wardList = GuardianDemo.getWards()
      setWards(wardList.map(w => ({
        student: w,
        link: { relation: 'Guardian', isPrimary: true }
      })))
    } else {
      const g = guardianService.getMyProfile(guardianId)
      setGuardian(g)
      if (g?.preferences) setPrefs(g.preferences)

      const wardList = guardianService.getMyWards(guardianId)
      const links = Repo.get<GuardianLink>('guardianLinks').filter(l => l.guardianId === guardianId)
      setWards(wardList.map(student => ({
        student,
        link: links.find(l => l.studentId === student.id)!
      })))
    }
  }, [guardianId])

  const handleSavePreferences = () => {
    if (!isStaticMode) {
      guardianService.updatePreferences(guardianId, prefs)
    }
    alert('Preferences saved successfully')
  }

  if (!guardian) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Profile</h1>

      <Card>
        <CardHeader><CardTitle>Guardian Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><span className="font-medium">Name:</span> {guardian.name}</div>
          <div><span className="font-medium">Email:</span> {guardian.email}</div>
          <div><span className="font-medium">Mobile:</span> {guardian.mobile}</div>
          <div><span className="font-medium">Status:</span> <Badge>{guardian.status}</Badge></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Linked Wards</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Program</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Relation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Primary</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {wards.map(({ student, link }) => {
                const studentId = isStaticMode ? student.universityId : student.id
                const programName = isStaticMode ? student.program : student.programName

                return (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-sm">{student.name}</td>
                    <td className="px-4 py-3 text-sm">{studentId}</td>
                    <td className="px-4 py-3 text-sm">{programName}</td>
                    <td className="px-4 py-3 text-sm"><Badge variant="outline">{link.relation}</Badge></td>
                    <td className="px-4 py-3 text-sm">{link.isPrimary ? <CheckCircle className="w-4 h-4 text-green-600" /> : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>ERP Push Notifications</span>
            <input type="checkbox" checked={prefs.erpPush} onChange={(e) => setPrefs({ ...prefs, erpPush: e.target.checked })} className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <span>SMS Notifications</span>
            <input type="checkbox" checked={prefs.sms} onChange={(e) => setPrefs({ ...prefs, sms: e.target.checked })} className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" checked={prefs.email} onChange={(e) => setPrefs({ ...prefs, email: e.target.checked })} className="toggle" />
          </div>
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
