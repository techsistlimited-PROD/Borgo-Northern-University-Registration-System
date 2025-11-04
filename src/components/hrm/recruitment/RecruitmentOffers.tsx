import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Send, CheckCircle, X } from 'lucide-react'
import { OFFER_LETTERS, RECRUITMENT_CANDIDATES } from '@/lib/recruitmentStatic'

export default function RecruitmentOffers() {
  const stats = {
    draft: OFFER_LETTERS.filter(o => o.status === 'Draft').length,
    sent: OFFER_LETTERS.filter(o => o.status === 'Sent').length,
    accepted: OFFER_LETTERS.filter(o => o.status === 'Accepted').length,
    rejected: OFFER_LETTERS.filter(o => o.status === 'Rejected').length
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Draft': 'secondary',
      'Sent': 'outline',
      'Accepted': 'default',
      'Rejected': 'destructive',
      'Expired': 'secondary'
    }
    return colors[status] || 'outline'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Draft', count: stats.draft, color: 'gray' },
          { label: 'Sent', count: stats.sent, color: 'blue' },
          { label: 'Accepted', count: stats.accepted, color: 'green' },
          { label: 'Rejected', count: stats.rejected, color: 'red' }
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
              <p className="text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Offer Management</CardTitle>
            <Button>Create Offer</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Offer ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Candidate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vacancy</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Base Salary</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total Package</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Joining Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {OFFER_LETTERS.map(offer => {
                  const candidate = RECRUITMENT_CANDIDATES.find(c => c.id === offer.candidateId)
                  const totalPackage = offer.baseSalary + offer.allowances.house + offer.allowances.medical + offer.allowances.transport + offer.allowances.other
                  
                  return (
                    <tr key={offer.offerId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{offer.offerId}</td>
                      <td className="px-4 py-3 text-sm">{candidate?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{offer.vacancyRef}</td>
                      <td className="px-4 py-3 text-sm">{offer.offeredDesignation}</td>
                      <td className="px-4 py-3 text-sm">{offer.grade}</td>
                      <td className="px-4 py-3 text-sm">{offer.baseSalary.toLocaleString()} BDT</td>
                      <td className="px-4 py-3 text-sm font-medium">{totalPackage.toLocaleString()} BDT</td>
                      <td className="px-4 py-3 text-sm">{offer.joiningDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getStatusColor(offer.status)}>{offer.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                          {offer.status === 'Draft' && <Button size="sm" variant="ghost"><Send className="w-4 h-4" /></Button>}
                          {offer.status === 'Sent' && (
                            <>
                              <Button size="sm" variant="ghost" className="text-green-600"><CheckCircle className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" className="text-red-600"><X className="w-4 h-4" /></Button>
                            </>
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
