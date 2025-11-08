import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { StudentFine, StudentHold } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'
import { addLedgerEntry } from '../utils/ledger'

export default function FinesHoldsView() {
  const [tab, setTab] = useState<'fines' | 'holds'>('fines')

  const [fines, setFines] = useState<StudentFine[]>([])
  const [holds, setHolds] = useState<StudentHold[]>([])

  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')

  const [fineType, setFineType] = useState<'Late Fine' | 'Library Fine' | 'Exam Fine' | 'Misc Fine'>('Late Fine')
  const [fineAmount, setFineAmount] = useState('')
  const [fineRemarks, setFineRemarks] = useState('')

  const [holdType, setHoldType] = useState<'Finance Hold' | 'Registration Hold' | 'Exam Hold'>('Finance Hold')
  const [holdReason, setHoldReason] = useState('')

  const [viewFineDialogOpen, setViewFineDialogOpen] = useState(false)
  const [selectedFine, setSelectedFine] = useState<StudentFine | null>(null)
  const [viewHoldDialogOpen, setViewHoldDialogOpen] = useState(false)
  const [selectedHold, setSelectedHold] = useState<StudentHold | null>(null)

  useEffect(() => {
    loadData()
    const unsub1 = Repo.subscribe('finance-fines', loadData)
    const unsub2 = Repo.subscribe('finance-holds', loadData)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  useEffect(() => {
    if (studentId) {
      const bills = Repo.get('finance-student-bills')
      const payments = Repo.get('finance-payments')
      const studentBill = bills.find((b: any) => b.studentId === studentId)
      const studentPayment = payments.find((p: any) => p.studentId === studentId)
      const name = studentBill?.studentName || studentPayment?.studentName || ''
      setStudentName(name)
    } else {
      setStudentName('')
    }
  }, [studentId])

  const loadData = () => {
    setFines(Repo.get<StudentFine>('finance-fines'))
    setHolds(Repo.get<StudentHold>('finance-holds'))
  }

  const handleAddFine = () => {
    if (!studentId) {
      alert('Please enter Student ID')
      return
    }

    const amount = parseFloat(fineAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid fine amount')
      return
    }

    const fine: StudentFine = {
      id: `fine-${Date.now()}`,
      studentId,
      studentName,
      fineType,
      amount,
      date: new Date().toISOString().split('T')[0],
      remarks: fineRemarks,
      createdBy: 'Accounts Officer'
    }

    Repo.add('finance-fines', fine)

    addLedgerEntry(
      studentId,
      'Fine',
      fine.id,
      `${fineType} - ${fineRemarks || 'No remarks'}`,
      amount,
      0
    )

    alert('Fine added successfully!')
    setStudentId('')
    setFineAmount('')
    setFineRemarks('')
    loadData()
  }

  const handleDeleteFine = (id: string) => {
    if (confirm('Delete this fine?')) {
      Repo.delete('finance-fines', id)
      alert('Fine deleted')
      loadData()
    }
  }

  const handleAddHold = () => {
    if (!studentId) {
      alert('Please enter Student ID')
      return
    }

    if (!holdReason) {
      alert('Please enter hold reason')
      return
    }

    const hold: StudentHold = {
      id: `hold-${Date.now()}`,
      studentId,
      studentName,
      holdType,
      reason: holdReason,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdBy: 'Accounts Officer'
    }

    Repo.add('finance-holds', hold)

    alert('Hold added successfully!')
    setStudentId('')
    setHoldReason('')
    loadData()
  }

  const handleToggleHold = (hold: StudentHold) => {
    const newStatus = hold.status === 'Active' ? 'Removed' : 'Active'
    Repo.update('finance-holds', hold.id, {
      status: newStatus,
      removedDate: newStatus === 'Removed' ? new Date().toISOString().split('T')[0] : undefined,
      removedBy: newStatus === 'Removed' ? 'Accounts Officer' : undefined
    })
    loadData()
  }

  const handleViewFine = (fine: StudentFine) => {
    setSelectedFine(fine)
    setViewFineDialogOpen(true)
  }

  const handleViewHold = (hold: StudentHold) => {
    setSelectedHold(hold)
    setViewHoldDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Fines & Holds Management</h1>

      <div className="flex gap-2 border-b">
        <Button
          variant={tab === 'fines' ? 'default' : 'ghost'}
          onClick={() => setTab('fines')}
          className={tab === 'fines' ? 'nu-button-primary' : ''}
        >
          Fines
        </Button>
        <Button
          variant={tab === 'holds' ? 'default' : 'ghost'}
          onClick={() => setTab('holds')}
          className={tab === 'holds' ? 'nu-button-primary' : ''}
        >
          Holds
        </Button>
      </div>

      {tab === 'fines' ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Fine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student ID *</label>
                  <Input
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  {studentName && (
                    <p className="text-sm text-gray-600 mt-1">{studentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fine Type *</label>
                  <select
                    value={fineType}
                    onChange={(e) => setFineType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Late Fine">Late Fine</option>
                    <option value="Library Fine">Library Fine</option>
                    <option value="Exam Fine">Exam Fine</option>
                    <option value="Misc Fine">Misc Fine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amount *</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fineAmount}
                    onChange={(e) => setFineAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Remarks</label>
                  <Input
                    placeholder="Optional remarks"
                    value={fineRemarks}
                    onChange={(e) => setFineRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleAddFine} className="nu-button-primary">
                  Add Fine
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fines List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Student ID</th>
                      <th className="text-left p-3 text-sm font-medium">Student Name</th>
                      <th className="text-left p-3 text-sm font-medium">Fine Type</th>
                      <th className="text-right p-3 text-sm font-medium">Amount</th>
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Remarks</th>
                      <th className="text-center p-3 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fines.map(fine => (
                      <tr key={fine.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-sm">{fine.studentId}</td>
                        <td className="p-3 text-sm font-medium">{fine.studentName || '-'}</td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline">{fine.fineType}</Badge>
                        </td>
                        <td className="p-3 text-sm text-right font-semibold text-red-600">
                          {formatCurrency(fine.amount)}
                        </td>
                        <td className="p-3 text-sm">{fine.date}</td>
                        <td className="p-3 text-sm">{fine.remarks || '-'}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewFine(fine)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFine(fine.id)}
                              title="Delete Fine"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {fines.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-gray-500">
                          No fines recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Hold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student ID *</label>
                  <Input
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  {studentName && (
                    <p className="text-sm text-gray-600 mt-1">{studentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hold Type *</label>
                  <select
                    value={holdType}
                    onChange={(e) => setHoldType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Finance Hold">Finance Hold</option>
                    <option value="Registration Hold">Registration Hold</option>
                    <option value="Exam Hold">Exam Hold</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Reason *</label>
                  <Input
                    placeholder="Enter reason for hold"
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleAddHold} className="nu-button-primary">
                  Add Hold
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Holds List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Student ID</th>
                      <th className="text-left p-3 text-sm font-medium">Student Name</th>
                      <th className="text-left p-3 text-sm font-medium">Hold Type</th>
                      <th className="text-left p-3 text-sm font-medium">Reason</th>
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-center p-3 text-sm font-medium">Status</th>
                      <th className="text-center p-3 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holds.map(hold => (
                      <tr key={hold.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-sm">{hold.studentId}</td>
                        <td className="p-3 text-sm font-medium">{hold.studentName || '-'}</td>
                        <td className="p-3 text-sm">
                          <Badge 
                            variant="outline"
                            className={hold.holdType === 'Finance Hold' ? 'border-red-500 text-red-600' : ''}
                          >
                            {hold.holdType}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{hold.reason}</td>
                        <td className="p-3 text-sm">{hold.date}</td>
                        <td className="p-3 text-center">
                          <Badge 
                            className={hold.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                          >
                            {hold.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleHold(hold)}
                            title={hold.status === 'Active' ? 'Remove Hold' : 'Activate Hold'}
                          >
                            {hold.status === 'Active' ? (
                              <ToggleRight className="w-5 h-5 text-red-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {holds.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-gray-500">
                          No holds recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
