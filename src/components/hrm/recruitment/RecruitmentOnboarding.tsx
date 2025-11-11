import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, CheckCircle, ArrowLeft, UserCheck, Calendar, FileText } from 'lucide-react'
import { ONBOARDING_RECORDS, RECRUITMENT_CANDIDATES, type OnboardingRecord } from '@/lib/recruitmentStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function RecruitmentOnboarding() {
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null)

  const stats = {
    inProgress: ONBOARDING_RECORDS.filter(o => o.status === 'In Progress').length,
    completed: ONBOARDING_RECORDS.filter(o => o.status === 'Completed').length,
    hold: ONBOARDING_RECORDS.filter(o => o.status === 'Hold').length
  }

  const getProgress = (checklist: typeof ONBOARDING_RECORDS[0]['checklist']) => {
    const done = checklist.filter(item => item.status === 'Done').length
    return Math.round((done / checklist.length) * 100)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'In Progress': 'outline',
      'Completed': 'default',
      'Hold': 'secondary',
      'Cancelled': 'destructive'
    }
    return colors[status] || 'outline'
  }

  const handleViewRecord = (record: OnboardingRecord) => {
    setSelectedRecord(record)
  }

  const handleCompleteOnboarding = (onbId: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Complete onboarding and convert to employee'))
    }
  }

  const handleUpdateChecklist = (itemKey: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Update checklist item'))
    }
  }

  // Detail View
  if (selectedRecord) {
    const candidate = RECRUITMENT_CANDIDATES.find(c => c.id === selectedRecord.candidateId)
    const progress = getProgress(selectedRecord.checklist)
    const completedItems = selectedRecord.checklist.filter(item => item.status === 'Done').length
    const totalItems = selectedRecord.checklist.length

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-deep-plum">Onboarding Details</h1>
              <p className="text-gray-600 text-sm mt-1">{selectedRecord.onbId}</p>
            </div>
          </div>
          {selectedRecord.status === 'In Progress' && progress === 100 && (
            <Button onClick={() => handleCompleteOnboarding(selectedRecord.onbId)} className="bg-green-600 hover:bg-green-700">
              <UserCheck className="w-4 h-4 mr-2" />
              Complete Onboarding
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Candidate Name</p>
                  <p className="font-medium">{candidate?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{candidate?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vacancy Reference</p>
                  <p className="font-medium">{selectedRecord.vacancyRef}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{candidate?.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {completedItems} of {totalItems} items completed
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={getStatusColor(selectedRecord.status)} className="mt-1">
                  {selectedRecord.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{selectedRecord.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedRecord.convertedEmployee && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Employee Conversion Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Employee ID</p>
                  <p className="font-medium">{selectedRecord.convertedEmployee.employeeId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Designation</p>
                  <p className="font-medium">{selectedRecord.convertedEmployee.designation}</p>
                </div>
                <div>
                  <p className="text-gray-600">Department</p>
                  <p className="font-medium">{selectedRecord.convertedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-gray-600">Joining Date</p>
                  <p className="font-medium">{selectedRecord.convertedEmployee.joiningDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Supervisor</p>
                  <p className="font-medium">{selectedRecord.convertedEmployee.supervisor}</p>
                </div>
                <div>
                  <p className="text-gray-600">Employee Type</p>
                  <p className="font-medium">{selectedRecord.convertedEmployee.employeeType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Assigned Mentor</p>
                <p className="font-medium">{selectedRecord.assignedMentor || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Supervisor</p>
                <p className="font-medium">{selectedRecord.supervisor || 'Not assigned'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{selectedRecord.lastUpdated}</span>
              </div>
              {selectedRecord.convertedEmployee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined On</span>
                  <span className="font-medium">{selectedRecord.convertedEmployee.joiningDate}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Onboarding Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedRecord.checklist.map((item, idx) => (
                <div 
                  key={item.key}
                  className={`p-4 rounded-lg border ${
                    item.status === 'Done' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {item.status === 'Done' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${item.status === 'Done' ? 'text-green-900' : 'text-gray-900'}`}>
                          {item.label}
                        </p>
                        {item.remarks && (
                          <p className="text-sm text-gray-600 mt-1">{item.remarks}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.status === 'Done' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      {item.status === 'Pending' && selectedRecord.status === 'In Progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateChecklist(item.key)}
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.hold}</p>
            <p className="text-sm">On Hold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Candidate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vacancy/Dept</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Last Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mentor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Supervisor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ONBOARDING_RECORDS.map(record => {
                  const candidate = RECRUITMENT_CANDIDATES.find(c => c.id === record.candidateId)
                  const progress = getProgress(record.checklist)
                  
                  return (
                    <tr key={record.onbId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{candidate?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>{record.vacancyRef}</div>
                        <div className="text-xs text-gray-500">{candidate?.department}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                            <div 
                              className={`h-2 rounded-full ${progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{record.lastUpdated}</td>
                      <td className="px-4 py-3 text-sm">{record.assignedMentor || '-'}</td>
                      <td className="px-4 py-3 text-sm">{record.supervisor || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleViewRecord(record)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {record.status === 'In Progress' && progress === 100 && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-green-600"
                              onClick={() => handleCompleteOnboarding(record.onbId)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
