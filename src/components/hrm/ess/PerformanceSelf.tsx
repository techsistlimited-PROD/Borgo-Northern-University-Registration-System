import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FileDown } from 'lucide-react'
import { ESS_APPRAISALS, ESS_TRAININGS_ATTENDED } from '@/lib/hrmDemoSeed'

export default function PerformanceSelf() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">My Performance</h2>

      <Tabs defaultValue="appraisals">
        <TabsList>
          <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
          <TabsTrigger value="training">Training History</TabsTrigger>
        </TabsList>

        <TabsContent value="appraisals">
          <Card>
            <CardHeader>
              <CardTitle>My Appraisals</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Period</th>
                    <th className="px-3 py-2 text-left">KPI</th>
                    <th className="px-3 py-2 text-left">Peer</th>
                    <th className="px-3 py-2 text-left">Supervisor</th>
                    <th className="px-3 py-2 text-left">Final</th>
                    <th className="px-3 py-2 text-left">Outcome</th>
                    <th className="px-3 py-2 text-left">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ESS_APPRAISALS.map((app, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{app.period}</td>
                      <td className="px-3 py-2">{app.kpiScore}%</td>
                      <td className="px-3 py-2">{app.peer}</td>
                      <td className="px-3 py-2">{app.supervisor}</td>
                      <td className="px-3 py-2 font-bold text-blue-600">{app.final}%</td>
                      <td className="px-3 py-2">
                        <Badge>{app.outcome}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        <Button variant="ghost" size="sm">
                          <FileDown className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Trainings Attended</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Training</th>
                    <th className="px-3 py-2 text-left">Score</th>
                    <th className="px-3 py-2 text-left">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ESS_TRAININGS_ATTENDED.map((tr, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{tr.title}</td>
                      <td className="px-3 py-2">
                        {tr.score && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < tr.score! ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <Button variant="ghost" size="sm">
                          <FileDown className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
