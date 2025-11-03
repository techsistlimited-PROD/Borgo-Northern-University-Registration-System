import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { WaiverPolicy, AssignedWaiver, Student } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'

export default function WaiverScholarshipManagement() {
  const [policies, setPolicies] = useState<WaiverPolicy[]>([])
  const [assigned, setAssigned] = useState<AssignedWaiver[]>([])
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    loadData()
    const unsubPolicies = Repo.subscribe<WaiverPolicy>('waiverPolicies', setPolicies)
    const unsubAssigned = Repo.subscribe<AssignedWaiver>('assignedWaivers', setAssigned)
    const unsubStudents = Repo.subscribe<Student>('students', setStudents)

    return () => {
      unsubPolicies()
      unsubAssigned()
      unsubStudents()
    }
  }, [])

  const loadData = () => {
    setPolicies(Repo.get<WaiverPolicy>('waiverPolicies'))
    setAssigned(Repo.get<AssignedWaiver>('assignedWaivers'))
    setStudents(Repo.get<Student>('students'))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Waiver & Scholarship</h1>
          <p className="text-sm text-gray-600">Manage waivers and scholarships</p>
        </div>
        <Button onClick={() => exportToCSV(policies, 'policies')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Percent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Criteria</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {policies.map(policy => (
                    <tr key={policy.id}>
                      <td className="px-4 py-3 text-sm font-medium">{policy.code}</td>
                      <td className="px-4 py-3 text-sm">{policy.name}</td>
                      <td className="px-4 py-3 text-sm"><Badge>{policy.type}</Badge></td>
                      <td className="px-4 py-3 text-sm">{policy.percent}%</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{policy.criteria}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>{policy.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Policy</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Percent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Effective Term</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Assigned By</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assigned.map(a => {
                    const student = students.find(s => s.id === a.studentId)
                    const policy = policies.find(p => p.id === a.policyId)
                    return (
                      <tr key={a.id}>
                        <td className="px-4 py-3 text-sm">{student?.name}</td>
                        <td className="px-4 py-3 text-sm">{policy?.code}</td>
                        <td className="px-4 py-3 text-sm">{a.percent}%</td>
                        <td className="px-4 py-3 text-sm">{a.effectiveTerm}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{a.assignedBy}</td>
                      </tr>
                    )
                  })}
                  {assigned.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">No assigned waivers/scholarships</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
