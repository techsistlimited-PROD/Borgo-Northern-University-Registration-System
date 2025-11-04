import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, Eye } from 'lucide-react'
import { ESS_PAYSLIPS, ESS_TAX_CERTIFICATES } from '@/lib/hrmDemoSeed'

export default function PayrollTax() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Payroll (Payslips & Tax)</h2>

      <Card>
        <CardHeader>
          <CardTitle>Payslips</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Month</th>
                <th className="px-3 py-2 text-left">Year</th>
                <th className="px-3 py-2 text-left">Gross</th>
                <th className="px-3 py-2 text-left">Deductions</th>
                <th className="px-3 py-2 text-left">Net</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ESS_PAYSLIPS.map((slip, idx) => {
                const deductions = slip.pf + slip.tax + slip.loan
                return (
                  <tr key={idx}>
                    <td className="px-3 py-2">{slip.month}</td>
                    <td className="px-3 py-2">{slip.year}</td>
                    <td className="px-3 py-2">৳{slip.basic + slip.houseRent + slip.medical + slip.transport + slip.other}</td>
                    <td className="px-3 py-2 text-red-600">৳{deductions}</td>
                    <td className="px-3 py-2 font-bold text-green-600">৳{slip.net}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Year</th>
                <th className="px-3 py-2 text-left">Gross</th>
                <th className="px-3 py-2 text-left">Taxable</th>
                <th className="px-3 py-2 text-left">Tax Paid</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ESS_TAX_CERTIFICATES.map(cert => (
                <tr key={cert.year}>
                  <td className="px-3 py-2">{cert.year}</td>
                  <td className="px-3 py-2">৳{cert.gross.toLocaleString()}</td>
                  <td className="px-3 py-2">৳{cert.taxable.toLocaleString()}</td>
                  <td className="px-3 py-2">৳{cert.taxPaid.toLocaleString()}</td>
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
    </div>
  )
}
