import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, CheckCircle } from 'lucide-react'
import { ONBOARDING_RECORDS, RECRUITMENT_CANDIDATES } from '@/lib/recruitmentStatic'

export default function RecruitmentOnboarding() {
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
                              className="bg-blue-600 h-2 rounded-full" 
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
                          <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                          {record.status === 'In Progress' && progress === 100 && (
                            <Button size="sm" variant="ghost" className="text-green-600">
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
