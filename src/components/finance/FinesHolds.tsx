import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Lock, Unlock } from 'lucide-react'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function FinesHolds() {
  const [activeTab, setActiveTab] = useState<'fines' | 'holds'>('fines')

  const handleReverseFine = (studentId: string, fineType: string, amount: number) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Reverse fine'))
      return
    }

    if (confirm(`Reverse ${fineType} of ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })} BDT for student ${studentId}?`)) {
      alert('Fine reversed successfully')
    }
  }

  const handleAddToInvoice = (studentId: string, fineType: string, amount: number) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Add fine to invoice'))
      return
    }

    if (confirm(`Add ${fineType} of ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })} BDT to student ${studentId}'s invoice?`)) {
      alert('Fine added to invoice successfully')
    }
  }

  const handleRemoveHold = (studentId: string, reason: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Remove hold'))
      return
    }

    if (confirm(`Remove hold for student ${studentId}? Reason: ${reason}`)) {
      alert('Hold removed successfully')
    }
  }

  const fines = [
    { studentId: 'CSE-25-01-0037', name: 'Md. Arif Hossain', type: 'Late Fee (<70% payment)', amount: 2000, reason: 'Outstanding >30% after 30-Sep-2025', assessedAt: '01-Oct-2025 10:10 AM', status: 'Active' },
    { studentId: 'BBA-24-03-0121', name: 'Nusrat Jahan', type: 'Special Mid-Term Exam Fee', amount: 1500, reason: 'Special Mid-term sitting approval by Controller', assessedAt: '12-Sep-2025 09:15 AM', status: 'Paid' }
  ]

  const holds = [
    { studentId: 'CSE-25-01-0037', name: 'Md. Arif Hossain', reason: 'Overdue >10k after grace', placedBy: 'Mahfuz Rahman', placedAt: '01-Oct-2025 10:15 AM', active: true },
    { studentId: 'MBA-23-01-0094', name: 'Tanvir Ahmed', reason: 'Unpaid Re-Admission Fee', placedBy: 'Accounts Desk', placedAt: '15-Sep-2025 03:10 PM', active: true }
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Fines & Holds</h1>

      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('fines')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'fines' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
            }`}
          >
            Late Fees / Penalties
          </button>
          <button
            onClick={() => setActiveTab('holds')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'holds' ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
            }`}
          >
            Finance Holds
          </button>
        </div>
      </div>

      {activeTab === 'fines' && (
        <>
          <div className="flex justify-end">
            <Button className="nu-button-primary">
              <AlertCircle className="w-4 h-4 mr-2" />
              Bulk Assign Late Fee
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Late Fees & Penalties</CardTitle>
              <CardDescription>Manage student late fees and penalties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Semester</label>
                  <select className="w-full p-2 border rounded-md text-sm">
                    <option>Fall 2025</option>
                    <option>Summer 2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fine Type</label>
                  <select className="w-full p-2 border rounded-md text-sm">
                    <option>All Types</option>
                    <option>Late Fee &lt;40%</option>
                    <option>Late Fee &lt;70%</option>
                    <option>Late Fee &lt;100%</option>
                    <option>Low Attendance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full p-2 border rounded-md text-sm">
                    <option>All Status</option>
                    <option>Assessed</option>
                    <option>Reversed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Program</label>
                  <select className="w-full p-2 border rounded-md text-sm">
                    <option>All Programs</option>
                    <option>CSE</option>
                    <option>BBA</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID / Name</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Fine Type</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700">Amount (BDT)</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Reason</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Assessed At</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fines.map((fine, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          <div className="font-mono text-xs">{fine.studentId}</div>
                          <div>{fine.name}</div>
                        </td>
                        <td className="p-3 text-sm">{fine.type}</td>
                        <td className="p-3 text-sm text-right font-semibold">{fine.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-sm text-gray-600">{fine.reason}</td>
                        <td className="p-3 text-sm">{fine.assessedAt}</td>
                        <td className="p-3">
                          <Badge className={fine.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {fine.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {fine.status === 'Active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReverseFine(fine.studentId, fine.type, fine.amount)}
                              >
                                🔒 Reverse
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddToInvoice(fine.studentId, fine.type, fine.amount)}
                            >
                              Add to Invoice
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
        </>
      )}

      {activeTab === 'holds' && (
        <Card>
          <CardHeader>
            <CardTitle>Finance Holds</CardTitle>
            <CardDescription>Active finance holds affecting student access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID / Name</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Reason</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Placed By</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Placed At</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Active?</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holds.map((hold, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        <div className="font-mono text-xs">{hold.studentId}</div>
                        <div>{hold.name}</div>
                      </td>
                      <td className="p-3 text-sm">{hold.reason}</td>
                      <td className="p-3 text-sm">{hold.placedBy}</td>
                      <td className="p-3 text-sm">{hold.placedAt}</td>
                      <td className="p-3">
                        {hold.active ? (
                          <Badge className="bg-purple-100 text-purple-800">YES</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">NO</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        {hold.active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveHold(hold.studentId, hold.reason)}
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            Remove Hold
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
