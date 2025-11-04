import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Eye, FileDown } from 'lucide-react'
import { APPRAISALS, FEEDBACK_ENTRIES, type Appraisal } from '@/lib/payrollPerformanceStatic'

export default function Appraisals() {
  const [appraisals, setAppraisals] = useState<Appraisal[]>(APPRAISALS)
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewAppraisal, setViewAppraisal] = useState<Appraisal | null>(null)
  const [newRecommendation, setNewRecommendation] = useState('')

  const filteredAppraisals = appraisals.filter(a => {
    if (selectedDept !== 'all' && a.dept !== selectedDept) return false
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false
    return true
  })

  const getRecommendationBadge = (rec: Appraisal['recommendation']) => {
    const variants = {
      Promotion: 'bg-purple-100 text-purple-800',
      Increment: 'bg-blue-100 text-blue-800',
      Training: 'bg-orange-100 text-orange-800',
      None: 'bg-gray-100 text-gray-800'
    }
    return variants[rec]
  }

  const empFeedback = viewAppraisal 
    ? FEEDBACK_ENTRIES.filter(f => f.empId === viewAppraisal.empId)
    : []

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Appraisals</h2>
          <p className="text-gray-600">Manage employee performance appraisals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium mb-1 block">Period</label>
              <Select defaultValue="2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024 Annual</SelectItem>
                  <SelectItem value="2023">2023 Annual</SelectItem>
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
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appraisals ({filteredAppraisals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KPI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppraisals.map((appraisal) => (
                  <tr key={appraisal.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{appraisal.empId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{appraisal.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{appraisal.dept}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{appraisal.designation}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{appraisal.kpiScore}</td>
                    <td className="px-4 py-3 text-sm">{appraisal.peerFeedback.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm">{appraisal.supervisorFeedback.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-blue-600">{appraisal.finalScore}</td>
                    <td className="px-4 py-3">
                      <Badge className={getRecommendationBadge(appraisal.recommendation)}>
                        {appraisal.recommendation}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={appraisal.status === 'Completed' ? 'default' : 'secondary'}>
                        {appraisal.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewAppraisal(appraisal)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileDown className="w-4 h-4" />
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

      <Sheet open={!!viewAppraisal} onOpenChange={() => setViewAppraisal(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Appraisal Details</SheetTitle>
          </SheetHeader>
          {viewAppraisal && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employee ID</label>
                    <p className="text-sm font-semibold">{viewAppraisal.empId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm font-semibold">{viewAppraisal.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-sm">{viewAppraisal.dept}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p className="text-sm">{viewAppraisal.designation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Period</label>
                    <p className="text-sm">{viewAppraisal.appraisalPeriod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-sm">{viewAppraisal.status}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Performance Scores</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">KPI Score</span>
                      <span className="text-sm font-semibold">{viewAppraisal.kpiScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Peer Feedback</span>
                      <span className="text-sm font-semibold">{viewAppraisal.peerFeedback.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Supervisor Feedback</span>
                      <span className="text-sm font-semibold">{viewAppraisal.supervisorFeedback.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Final Score</span>
                      <span className="text-xl font-bold text-blue-600">{viewAppraisal.finalScore}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4 mt-4">
                {empFeedback.map(fb => (
                  <div key={fb.id} className="border p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-semibold">{fb.from}</p>
                        <p className="text-xs text-gray-500">{fb.type} • {fb.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{fb.comments}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="recommendation" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Current Recommendation</label>
                  <div className="mt-2">
                    <Badge className={getRecommendationBadge(viewAppraisal.recommendation)}>
                      {viewAppraisal.recommendation}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Update Recommendation</label>
                  <Select defaultValue={viewAppraisal.recommendation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Promotion">Promotion</SelectItem>
                      <SelectItem value="Increment">Increment</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Remarks</label>
                  <Textarea 
                    value={newRecommendation}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                    rows={4}
                    placeholder="Enter remarks..."
                  />
                </div>
                <Button className="w-full">Save Recommendation</Button>
              </TabsContent>

              <TabsContent value="history" className="space-y-3 mt-4">
                <div className="border p-3 rounded-lg">
                  <p className="text-sm font-semibold">2023 Annual Appraisal</p>
                  <p className="text-xs text-gray-500">Final Score: 82% • Increment</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm font-semibold">2022 Annual Appraisal</p>
                  <p className="text-xs text-gray-500">Final Score: 78% • Training</p>
                </div>
                <div className="border p-3 rounded-lg">
                  <p className="text-sm font-semibold">2021 Annual Appraisal</p>
                  <p className="text-xs text-gray-500">Final Score: 75% • Increment</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
