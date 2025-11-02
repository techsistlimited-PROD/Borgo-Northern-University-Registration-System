import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Lock, Unlock, FileText, Send, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function StudentLedger() {
  const [showLedgerDetail, setShowLedgerDetail] = useState(false)
  const [activeTab, setActiveTab] = useState('ledger')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const students = [
    { 
      id: 'CSE-25-01-0037', 
      name: 'Md. Arif Hossain', 
      program: 'B.Sc. in CSE / Batch 25C', 
      semester: 'Fall 2025', 
      balance: 18750, 
      status: ['Active', 'HOLD'],
      statusColors: ['bg-green-100 text-green-800', 'bg-purple-100 text-purple-800'],
      balanceStatus: 'Overdue'
    },
    { 
      id: 'BBA-24-03-0121', 
      name: 'Nusrat Jahan', 
      program: 'BBA / Batch 24B', 
      semester: 'Fall 2025', 
      balance: 0, 
      status: ['Active'],
      statusColors: ['bg-green-100 text-green-800'],
      balanceStatus: 'Paid'
    },
    { 
      id: 'MBA-23-01-0094', 
      name: 'Tanvir Ahmed', 
      program: 'MBA / Evening 23E', 
      semester: 'Fall 2025', 
      balance: 42500, 
      status: ['Active'],
      statusColors: ['bg-green-100 text-green-800'],
      balanceStatus: 'PartiallyPaid'
    }
  ]

  const ledgerEntries = [
    { date: '2025-09-10', type: 'Charge', description: 'Tuition Fee (Per Credit)', ref: 'INV-2025-000923', debit: 45000, credit: 0, balance: 45000 },
    { date: '2025-09-10', type: 'Charge', description: 'Computer Lab & Library Fee', ref: 'INV-2025-000923', debit: 2500, credit: 0, balance: 47500 },
    { date: '2025-09-12', type: 'Payment', description: 'Online Gateway (bKash)', ref: 'MR-2025-44112', debit: 0, credit: 25000, balance: 22500 },
    { date: '2025-09-25', type: 'Fine', description: 'Late Fee <70% payment', ref: 'FINE-2025-771', debit: 2000, credit: 0, balance: 24500 },
    { date: '2025-10-01', type: 'Waiver', description: 'Merit Scholarship 30% Tuition', ref: 'WAIV-2025-118', debit: 0, credit: 5750, balance: 18750 }
  ]

  const getBalanceBadge = (status: string) => {
    const styles: any = {
      'Overdue': 'bg-red-100 text-red-800',
      'PartiallyPaid': 'bg-amber-100 text-amber-800',
      'Paid': 'bg-green-100 text-green-800'
    }
    return <Badge className={styles[status]}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Student Accounts</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
          <CardDescription>Search by Student ID / Name / Mobile / UGC ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input placeholder="Search by Student ID / Name / Mobile / UGC ID" />
            </div>
            <div>
              <select className="w-full p-2 border rounded-md">
                <option>All Semesters</option>
                <option>Fall 2025</option>
                <option>Summer 2025</option>
              </select>
            </div>
            <div>
              <select className="w-full p-2 border rounded-md">
                <option>All Programs</option>
                <option>CSE</option>
                <option>BBA</option>
                <option>MBA</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="nu-button-primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer">Active</Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 cursor-pointer">On Hold</Badge>
              <Badge variant="outline" className="cursor-pointer">Graduated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Program / Batch</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Current Semester</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Balance (BDT)</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">{student.id}</td>
                    <td className="p-3 text-sm font-medium">{student.name}</td>
                    <td className="p-3 text-sm">{student.program}</td>
                    <td className="p-3 text-sm">{student.semester}</td>
                    <td className="p-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold">{student.balance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                        {getBalanceBadge(student.balanceStatus)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {student.status.map((s, i) => (
                          <Badge key={i} className={student.statusColors[i]}>{s}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student)
                            setShowLedgerDetail(true)
                          }}
                        >
                          View Ledger
                        </Button>
                        {student.status.includes('HOLD') && (
                          <Button variant="ghost" size="sm">
                            <Unlock className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLedgerDetail} onOpenChange={setShowLedgerDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-deep-plum rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedStudent?.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <DialogTitle>{selectedStudent?.name}</DialogTitle>
                <DialogDescription className="space-y-1 mt-2">
                  <div className="flex gap-4 text-sm">
                    <span><strong>Student ID:</strong> {selectedStudent?.id}</span>
                    <span><strong>UGC ID:</strong> 029-25-1-00-08131-027</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span><strong>Program:</strong> {selectedStudent?.program}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedStudent?.status.map((s: string, i: number) => (
                      <Badge key={i} className={selectedStudent?.statusColors[i]}>{s}</Badge>
                    ))}
                    <Badge className="bg-red-100 text-red-800">
                      Balance: BDT {selectedStudent?.balance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </Badge>
                  </div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="border-b">
            <div className="flex space-x-4">
              {['ledger', 'invoices', 'waivers', 'holds'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab ? 'border-deep-plum text-deep-plum' : 'border-transparent text-gray-500'
                  }`}
                >
                  {tab === 'invoices' ? 'Invoices & Receipts' : tab === 'waivers' ? 'Waivers / Adjustments' : tab === 'holds' ? 'Holds & Clearance' : 'Ledger'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {activeTab === 'ledger' && (
              <>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Print Statement PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send Dues Reminder SMS
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Ref / MR No.</th>
                        <th className="text-right p-2">Debit (+)</th>
                        <th className="text-right p-2">Credit (-)</th>
                        <th className="text-right p-2">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerEntries.map((entry, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{entry.date}</td>
                          <td className="p-2">
                            <Badge variant="outline" className="text-xs">{entry.type}</Badge>
                          </td>
                          <td className="p-2">{entry.description}</td>
                          <td className="p-2 font-mono text-xs">{entry.ref}</td>
                          <td className="p-2 text-right text-red-600">{entry.debit > 0 ? entry.debit.toLocaleString('en-BD', { minimumFractionDigits: 2 }) : '—'}</td>
                          <td className="p-2 text-right text-green-600">{entry.credit > 0 ? entry.credit.toLocaleString('en-BD', { minimumFractionDigits: 2 }) : '—'}</td>
                          <td className="p-2 text-right font-semibold">{entry.balance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'invoices' && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Invoices & Receipts view</p>
              </div>
            )}

            {activeTab === 'waivers' && (
              <div className="text-center py-8 text-gray-500">
                <p>Waivers / Adjustments view</p>
              </div>
            )}

            {activeTab === 'holds' && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-100 border border-purple-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">⚠ Finance HOLD placed on this student</p>
                      <p className="text-sm text-purple-700 mt-1">
                        Registration, Admit Card, and Transcript release are blocked until dues are cleared.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Send Fee Reminder SMS/Email
                  </Button>
                  <Button variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Grant Temporary Clearance (24h)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
