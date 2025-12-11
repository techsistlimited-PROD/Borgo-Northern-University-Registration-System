import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ESS_LOANS } from '@/lib/hrmDemoSeed'

export default function LoansAdvances() {
  const totalBalance = ESS_LOANS.reduce((sum, l) => sum + l.balance, 0)
  const activeLoans = ESS_LOANS.filter(l => l.status === 'Active').length
  const totalEMI = ESS_LOANS.reduce((sum, l) => sum + l.emi, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Loans & Advances</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeLoans}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳{totalBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">EMI This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳{totalEMI.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Principal</th>
                <th className="px-3 py-2 text-left">Tenure</th>
                <th className="px-3 py-2 text-left">EMI</th>
                <th className="px-3 py-2 text-left">Paid</th>
                <th className="px-3 py-2 text-left">Balance</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ESS_LOANS.map(loan => (
                <tr key={loan.id}>
                  <td className="px-3 py-2">{loan.type}</td>
                  <td className="px-3 py-2">৳{loan.principal.toLocaleString()}</td>
                  <td className="px-3 py-2">{loan.tenureMonths} months</td>
                  <td className="px-3 py-2">৳{loan.emi.toLocaleString()}</td>
                  <td className="px-3 py-2">{loan.paidInstallments}/{loan.tenureMonths}</td>
                  <td className="px-3 py-2 font-bold text-red-600">৳{loan.balance.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <Badge variant={loan.status === 'Active' ? 'default' : 'secondary'}>
                      {loan.status}
                    </Badge>
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
