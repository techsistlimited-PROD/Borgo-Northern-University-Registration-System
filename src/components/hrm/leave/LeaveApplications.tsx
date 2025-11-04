import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, CheckCircle, XCircle, Ban, Printer, Search } from 'lucide-react'
import { HRM_LEAVE_APPLICATIONS, type LeaveApplication } from '@/lib/hrmStatic'

export default function LeaveApplications() {
  const [applications, setApplications] = useState<LeaveApplication[]>(HRM_LEAVE_APPLICATIONS)
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState<LeaveApplication | null>(null)

  const filteredApps = applications.filter(app => {
    if (selectedDept !== 'all' && app.dept !== selectedDept) return false
    if (selectedType !== 'all' && app.type !== selectedType) return false
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false
    if (searchTerm && !app.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !app.empId.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const pendingCount = applications.filter(a => a.status === 'Pending').length
  const approvedCount = applications.filter(a => a.status === 'Approved').length
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length

  const getStatusBadge = (status: LeaveApplication['status']) => {
    const variants = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Cancelled: 'bg-gray-100 text-gray-800'
    }
    return variants[status]
  }

  const getWorkflowProgress = (workflow: LeaveApplication['workflow']) => {
    const stages = ['hod', 'dean', 'hr', 'registrar', 'vc'] as const
    const approved = stages.filter(stage => workflow[stage] === 'Approved').length
    return (approved / stages.length) * 100
  }

  const handleApprove = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Approved' as const } : app
    ))
  }

  const handleReject = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Rejected' as const } : app
    ))
  }

  const handleCancel = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Cancelled' as const } : app
    ))
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Leave Applications</h2>
          <p className="text-gray-600">Manage and track leave requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Leave Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Earn">Earn</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                  <SelectItem value="Duty">Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Name or ID" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApps.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From - To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workflow</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.dept}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{app.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {app.from} to {app.to}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{app.totalDays}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusBadge(app.status)}>{app.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${getWorkflowProgress(app.workflow)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(getWorkflowProgress(app.workflow))}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.appliedOn}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {app.status === 'Pending' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(app.id)}>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(app.id)}>
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(app.id)}>
                          <Ban className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Leave Application Details</SheetTitle>
          </SheetHeader>
          {selectedApp && (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="remarks">Remarks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Application ID</label>
                    <p className="text-sm font-semibold">{selectedApp.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employee Name</label>
                    <p className="text-sm font-semibold">{selectedApp.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-sm">{selectedApp.dept}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leave Type</label>
                    <p className="text-sm">{selectedApp.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">From Date</label>
                    <p className="text-sm">{selectedApp.from}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">To Date</label>
                    <p className="text-sm">{selectedApp.to}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Days</label>
                    <p className="text-sm font-semibold">{selectedApp.totalDays}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applied On</label>
                    <p className="text-sm">{selectedApp.appliedOn}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reason</label>
                  <p className="text-sm mt-1">{selectedApp.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadge(selectedApp.status)}>{selectedApp.status}</Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="workflow" className="space-y-3 mt-4">
                {(['hod', 'dean', 'hr', 'registrar', 'vc'] as const).map((stage) => (
                  <div key={stage} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium capitalize">{stage.toUpperCase()}</span>
                    <Badge className={
                      selectedApp.workflow[stage] === 'Approved' ? 'bg-green-100 text-green-800' :
                      selectedApp.workflow[stage] === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {selectedApp.workflow[stage]}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="remarks" className="mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedApp.remarks || 'No remarks'}</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
