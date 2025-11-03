import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { RecheckAppeal, Student, Course, Faculty } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Download, Eye, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'

export default function RecheckAppealsManagement() {
  const [appeals, setAppeals] = useState<RecheckAppeal[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])

  const [filters, setFilters] = useState({
    component: '',
    feeStatus: '',
    status: '',
    search: ''
  })

  const [selectedAppeal, setSelectedAppeal] = useState<RecheckAppeal | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [actionReason, setActionReason] = useState('')

  useEffect(() => {
    loadData()
    const unsubAppeals = Repo.subscribe<RecheckAppeal>('recheckAppeals', setAppeals)
    const unsubStudents = Repo.subscribe<Student>('students', setStudents)
    const unsubCourses = Repo.subscribe<Course>('courses', setCourses)
    const unsubFaculty = Repo.subscribe<Faculty>('faculty', setFaculty)

    return () => {
      unsubAppeals()
      unsubStudents()
      unsubCourses()
      unsubFaculty()
    }
  }, [])

  const loadData = () => {
    setAppeals(Repo.get<RecheckAppeal>('recheckAppeals'))
    setStudents(Repo.get<Student>('students'))
    setCourses(Repo.get<Course>('courses'))
    setFaculty(Repo.get<Faculty>('faculty'))
  }

  const getFilteredAppeals = () => {
    return appeals.filter(appeal => {
      if (filters.component && appeal.component !== filters.component) return false
      if (filters.feeStatus && appeal.feeStatus !== filters.feeStatus) return false
      if (filters.status && appeal.status !== filters.status) return false
      if (filters.search) {
        const student = students.find(s => s.id === appeal.studentId)
        const course = courses.find(c => c.id === appeal.courseId)
        const searchLower = filters.search.toLowerCase()
        if (
          !student?.name.toLowerCase().includes(searchLower) &&
          !student?.id.includes(searchLower) &&
          !course?.code.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }
      return true
    })
  }

  const getAppealDetails = (appeal: RecheckAppeal) => {
    const student = students.find(s => s.id === appeal.studentId)
    const course = courses.find(c => c.id === appeal.courseId)
    const reviewer = appeal.reviewerId ? faculty.find(f => f.id === appeal.reviewerId) : null
    return { student, course, reviewer }
  }

  const handleAssignReviewer = (appealId: string, facultyId: string) => {
    Repo.update<RecheckAppeal>('recheckAppeals', appealId, {
      reviewerId: facultyId,
      status: 'Under Review',
      timeline: [
        ...appeals.find(a => a.id === appealId)!.timeline,
        { date: new Date().toISOString().split('T')[0], action: 'Assigned to reviewer', by: 'COE Officer' }
      ]
    })
  }

  const handleMarkFeePaid = (appealId: string) => {
    Repo.update<RecheckAppeal>('recheckAppeals', appealId, {
      feeStatus: 'Paid',
      timeline: [
        ...appeals.find(a => a.id === appealId)!.timeline,
        { date: new Date().toISOString().split('T')[0], action: 'Fee marked as paid', by: 'COE Officer' }
      ]
    })
  }

  const handleApprove = (appealId: string, reason: string) => {
    Repo.update<RecheckAppeal>('recheckAppeals', appealId, {
      status: 'Approved',
      timeline: [
        ...appeals.find(a => a.id === appealId)!.timeline,
        { date: new Date().toISOString().split('T')[0], action: `Approved: ${reason}`, by: 'COE Officer' }
      ]
    })
    setShowDetailsDialog(false)
    setActionReason('')
  }

  const handleReject = (appealId: string, reason: string) => {
    Repo.update<RecheckAppeal>('recheckAppeals', appealId, {
      status: 'Rejected',
      timeline: [
        ...appeals.find(a => a.id === appealId)!.timeline,
        { date: new Date().toISOString().split('T')[0], action: `Rejected: ${reason}`, by: 'COE Officer' }
      ]
    })
    setShowDetailsDialog(false)
    setActionReason('')
  }

  const handleRefund = (appealId: string) => {
    Repo.update<RecheckAppeal>('recheckAppeals', appealId, {
      feeStatus: 'Refunded',
      timeline: [
        ...appeals.find(a => a.id === appealId)!.timeline,
        { date: new Date().toISOString().split('T')[0], action: 'Fee refunded', by: 'COE Officer' }
      ]
    })
  }

  const handleExport = () => {
    const filtered = getFilteredAppeals()
    const exportData = filtered.map(appeal => {
      const { student, course, reviewer } = getAppealDetails(appeal)
      return {
        'Appeal ID': appeal.id,
        'Student ID': student?.id || '',
        'Student Name': student?.name || '',
        'Course': course?.code || '',
        'Component': appeal.component,
        'Fee Amount': appeal.feeAmount,
        'Fee Status': appeal.feeStatus,
        'Status': appeal.status,
        'Reviewer': reviewer?.name || 'Not Assigned',
        'Submitted Date': appeal.submittedDate
      }
    })
    exportToCSV(exportData, 'recheck-appeals')
  }

  const filteredAppeals = getFilteredAppeals()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Recheck / Appeals</h1>
          <p className="text-sm text-gray-600">Manage recheck requests and appeals</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {appeals.filter(a => a.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {appeals.filter(a => a.status === 'Under Review').length}
              </div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appeals.filter(a => a.status === 'Approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {appeals.filter(a => a.status === 'Rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Component</label>
              <select
                value={filters.component}
                onChange={(e) => setFilters({ ...filters, component: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Components</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="CA">CA</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Fee Status</label>
              <select
                value={filters.feeStatus}
                onChange={(e) => setFilters({ ...filters, feeStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <input
                type="text"
                placeholder="Student name, ID, or course code..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Appeal ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Component</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fee Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reviewer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAppeals.map(appeal => {
                  const { student, course, reviewer } = getAppealDetails(appeal)
                  
                  return (
                    <tr key={appeal.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{appeal.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>{student?.name}</div>
                        <div className="text-xs text-gray-600">{student?.id}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>{course?.code}</div>
                        <div className="text-xs text-gray-600">{course?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{appeal.component}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={appeal.feeStatus === 'Paid' ? 'default' : appeal.feeStatus === 'Unpaid' ? 'destructive' : 'secondary'}>
                            {appeal.feeStatus}
                          </Badge>
                          <span className="text-xs text-gray-600">{appeal.feeAmount} BDT</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge 
                          variant={
                            appeal.status === 'Approved' ? 'default' : 
                            appeal.status === 'Rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {appeal.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {reviewer ? (
                          <div>
                            <div className="font-medium">{reviewer.name}</div>
                            <div className="text-xs text-gray-600">{reviewer.designation}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppeal(appeal)
                            setShowDetailsDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredAppeals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No appeals found matching the filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Appeal Details</DialogTitle>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-600">Appeal ID</div>
                  <div className="font-medium">{selectedAppeal.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Submitted Date</div>
                  <div className="font-medium">{selectedAppeal.submittedDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Student</div>
                  <div className="font-medium">{getAppealDetails(selectedAppeal).student?.name}</div>
                  <div className="text-xs text-gray-500">{getAppealDetails(selectedAppeal).student?.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Course</div>
                  <div className="font-medium">{getAppealDetails(selectedAppeal).course?.code}</div>
                  <div className="text-xs text-gray-500">{getAppealDetails(selectedAppeal).course?.title}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Component</div>
                  <div className="font-medium">{selectedAppeal.component}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Fee</div>
                  <div className="font-medium">{selectedAppeal.feeAmount} BDT - {selectedAppeal.feeStatus}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">Timeline</div>
                <div className="space-y-2">
                  {selectedAppeal.timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded text-sm">
                      <div className="text-xs text-gray-500 w-24">{entry.date}</div>
                      <div className="flex-1">{entry.action}</div>
                      <div className="text-xs text-gray-600">{entry.by}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAppeal.status === 'Pending' || selectedAppeal.status === 'Under Review' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action Reason / Notes</label>
                    <Textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Enter reason for approval or rejection..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 flex-wrap pt-4 border-t">
                    {selectedAppeal.feeStatus === 'Unpaid' && (
                      <Button
                        variant="outline"
                        onClick={() => handleMarkFeePaid(selectedAppeal.id)}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Mark Fee Paid
                      </Button>
                    )}
                    {!selectedAppeal.reviewerId && (
                      <select
                        className="px-3 py-2 border rounded-md text-sm"
                        onChange={(e) => handleAssignReviewer(selectedAppeal.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="">Assign Reviewer...</option>
                        {faculty.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedAppeal.id, actionReason || 'No reason provided')}
                      disabled={!actionReason}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedAppeal.id, actionReason || 'Approved')}
                      disabled={!actionReason}
                      className="bg-deep-plum hover:bg-deep-plum/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  {selectedAppeal.feeStatus === 'Paid' && selectedAppeal.status === 'Rejected' && (
                    <Button
                      variant="outline"
                      onClick={() => handleRefund(selectedAppeal.id)}
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Refund Fee
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
