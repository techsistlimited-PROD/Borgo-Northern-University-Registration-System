import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, TrendingUp } from 'lucide-react'

export default function ComplianceReports() {
  const reports = [
    { name: 'Pass/Fail Summary by Program', description: 'Semester-wise pass rates and statistics', lastGenerated: '02 Dec 2025' },
    { name: 'Gold Medal Eligibility List', description: 'Top CGPA graduates for convocation', lastGenerated: '01 Dec 2025' },
    { name: 'Convocation Candidates', description: 'Students who completed required credits', lastGenerated: '30 Nov 2025' },
    { name: 'Scholarship Eligibility Summary', description: 'Students qualifying for merit scholarships', lastGenerated: '28 Nov 2025' },
    { name: 'Result Publication Timestamp Log', description: 'Compliance audit trail for result publishing', lastGenerated: '02 Dec 2025' },
    { name: 'Document Issue Counts', description: 'Transcript/Certificate issuance statistics', lastGenerated: '01 Dec 2025' }
  ]

  const analytics = [
    { label: 'Pass Rate Trend (CSE)', value: '78% → 81% → 82%', change: '+4%', trend: 'up' },
    { label: 'Avg GPA This Semester (BBA)', value: '3.11', change: '-0.05', trend: 'down' },
    { label: 'Students Under Probation (CGPA < 2.0)', value: '27', change: '-3', trend: 'up' },
    { label: 'Unpublished Sections Left', value: '3', change: '-18', trend: 'up' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Compliance reports and examination analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Programs</option>
            <option>BSc CSE</option>
            <option>BBA</option>
            <option>LLB</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <select className="w-full p-2 border rounded-md">
            <option>All Campuses</option>
            <option>Permanent Campus</option>
            <option>Banani Campus</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((item, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                {item.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                )}
                <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </span>
                <span className="text-xs text-gray-500">vs last semester</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Reports</CardTitle>
          <CardDescription>Generate reports for UGC, accreditation, and audit purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-deep-plum" />
                    <div>
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <p className="text-xs text-gray-600">{report.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Last: {report.lastGenerated}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      XLSX
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grade Distribution (Fall 2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { grade: 'A+', count: 142, percent: 18 },
                { grade: 'A', count: 215, percent: 27 },
                { grade: 'A-', count: 168, percent: 21 },
                { grade: 'B+', count: 134, percent: 17 },
                { grade: 'B', count: 89, percent: 11 },
                { grade: 'C+/Below', count: 48, percent: 6 }
              ].map((item) => (
                <div key={item.grade}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.grade}</span>
                    <span>{item.count} ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-deep-plum h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Semester Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Candidates</span>
                  <span className="font-semibold">1,284 <Badge className="ml-2 bg-green-100 text-green-800">+12%</Badge></span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Pass Rate</span>
                  <span className="font-semibold">81.4% <Badge className="ml-2 bg-green-100 text-green-800">+2.3%</Badge></span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Average CGPA</span>
                  <span className="font-semibold">3.27 <Badge className="ml-2 bg-amber-100 text-amber-800">-0.08</Badge></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Probation Cases</span>
                  <span className="font-semibold">27 <Badge className="ml-2 bg-green-100 text-green-800">-3</Badge></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
