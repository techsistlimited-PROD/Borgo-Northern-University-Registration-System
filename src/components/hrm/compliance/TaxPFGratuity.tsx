import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { TAX_LEDGER, PF_LEDGER, GRATUITY_ACCRUALS } from '@/lib/hrmDemoSeed'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TaxPFGratuity() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Tax & PF/Gratuity</h2>
        <Button className="flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Download Statements
        </Button>
      </div>

      <Tabs defaultValue="tds">
        <TabsList>
          <TabsTrigger value="tds">TDS</TabsTrigger>
          <TabsTrigger value="pf">PF</TabsTrigger>
          <TabsTrigger value="gratuity">Gratuity</TabsTrigger>
        </TabsList>

        <TabsContent value="tds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TDS Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={TAX_LEDGER}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tds" stroke="#ef4444" name="TDS Amount" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TDS Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Month</th>
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-left">Gross</th>
                    <th className="px-3 py-2 text-left">Taxable</th>
                    <th className="px-3 py-2 text-left">TDS</th>
                    <th className="px-3 py-2 text-left">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {TAX_LEDGER.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{entry.month}</td>
                      <td className="px-3 py-2">{entry.year}</td>
                      <td className="px-3 py-2">৳{entry.gross.toLocaleString()}</td>
                      <td className="px-3 py-2">৳{entry.taxable.toLocaleString()}</td>
                      <td className="px-3 py-2 text-red-600">৳{entry.tds.toLocaleString()}</td>
                      <td className="px-3 py-2 font-bold">৳{entry.netAfterTax.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pf" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PF Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={PF_LEDGER}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="employee" fill="#3b82f6" name="Employee (10%)" stackId="a" />
                  <Bar dataKey="employer" fill="#22c55e" name="Employer (10%)" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PF Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Month</th>
                    <th className="px-3 py-2 text-left">Employee</th>
                    <th className="px-3 py-2 text-left">Employer</th>
                    <th className="px-3 py-2 text-left">Opening</th>
                    <th className="px-3 py-2 text-left">Closing</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {PF_LEDGER.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{entry.month}</td>
                      <td className="px-3 py-2">৳{entry.employee.toLocaleString()}</td>
                      <td className="px-3 py-2">৳{entry.employer.toLocaleString()}</td>
                      <td className="px-3 py-2">৳{entry.opening.toLocaleString()}</td>
                      <td className="px-3 py-2 font-bold">৳{entry.closing.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gratuity">
          <Card>
            <CardHeader>
              <CardTitle>Gratuity Accruals</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-left">Opening</th>
                    <th className="px-3 py-2 text-left">Accrual</th>
                    <th className="px-3 py-2 text-left">Utilization</th>
                    <th className="px-3 py-2 text-left">Closing</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {GRATUITY_ACCRUALS.map(entry => (
                    <tr key={entry.year}>
                      <td className="px-3 py-2">{entry.year}</td>
                      <td className="px-3 py-2">৳{entry.opening.toLocaleString()}</td>
                      <td className="px-3 py-2 text-green-600">+৳{entry.accrual.toLocaleString()}</td>
                      <td className="px-3 py-2 text-red-600">-৳{entry.utilization.toLocaleString()}</td>
                      <td className="px-3 py-2 font-bold">৳{entry.closing.toLocaleString()}</td>
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
