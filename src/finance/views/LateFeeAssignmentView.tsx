import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Repo } from '@/lib/repo'
import { StudentBill, BillLineItem } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'

interface EligibleBill extends StudentBill {
  presentSemesterPayable: number
  previousDues: number
  hundredPercentPayable: number
  totalPaid: number
  dueAmount: number
  paidPercent: number
}

export default function LateFeeAssignmentView() {
  const [semester, setSemester] = useState('Fall 2025')
  const [program, setProgram] = useState('All')
  const [duesAmount, setDuesAmount] = useState('')
  const [fineAmount, setFineAmount] = useState('')
  const [campus, setCampus] = useState('All')
  const [defaulterAsDate, setDefaulterAsDate] = useState(new Date().toISOString().split('T')[0])
  const [payablePercent, setPayablePercent] = useState<'40' | '70' | '100'>('40')
  
  const [eligibleBills, setEligibleBills] = useState<EligibleBill[]>([])
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (semester && payablePercent) {
      handleSearch()
    }
  }, [semester, program, campus, payablePercent, defaulterAsDate, duesAmount])

  const handleSearch = () => {
    const bills = Repo.get<StudentBill>('finance-student-bills')
    const payments = Repo.get('finance-payments')
    
    const minDues = duesAmount ? parseFloat(duesAmount) : 0
    const thresholdPercent = parseInt(payablePercent)
    
    const eligible = bills
      .filter(bill => {
        const matchesSemester = bill.semester === semester
        const matchesProgram = program === 'All' || bill.program === program
        const matchesCampus = campus === 'All' || bill.campus === campus
        const hasDues = bill.balanceDue >= minDues
        
        return matchesSemester && matchesProgram && matchesCampus && hasDues
      })
      .map(bill => {
        const studentPayments = payments.filter((p: any) => 
          p.studentId === bill.studentId && 
          new Date(p.paymentDate) <= new Date(defaulterAsDate)
        )
        const totalPaid = studentPayments.reduce((sum: number, p: any) => sum + p.totalAmount, 0)
        const paidPercent = bill.netTotal > 0 ? (bill.paidAmount / bill.netTotal) * 100 : 0
        
        const previousBills = bills.filter(b => 
          b.studentId === bill.studentId && 
          b.semester !== semester &&
          new Date(b.billDate) < new Date(bill.billDate)
        )
        const previousDues = previousBills.reduce((sum, b) => sum + b.balanceDue, 0)
        
        return {
          ...bill,
          presentSemesterPayable: bill.netTotal,
          previousDues,
          hundredPercentPayable: bill.netTotal,
          totalPaid: bill.paidAmount,
          dueAmount: bill.balanceDue,
          paidPercent
        }
      })
      .filter(bill => bill.paidPercent < thresholdPercent)
    
    setEligibleBills(eligible)
  }

  const handleAssignLateFee = () => {
    if (selectedBills.size === 0) {
      alert('Please select at least one student')
      return
    }

    if (!fineAmount || parseFloat(fineAmount) <= 0) {
      alert('Please enter a valid fine amount')
      return
    }

    if (!confirm(`Apply late fee of ${formatCurrency(parseFloat(fineAmount))} to ${selectedBills.size} selected bills?`)) {
      return
    }

    const costHeads = Repo.get('finance-cost-heads')
    const lateFeeHead = costHeads.find((ch: any) => ch.code === '014' || ch.name.toLowerCase().includes('late'))
    const costHeadCode = lateFeeHead?.code || '014'
    const costHeadName = lateFeeHead?.name || 'Late fine'

    eligibleBills.forEach(bill => {
      if (!selectedBills.has(bill.id)) return

      const existingLateFee = bill.lineItems.find(li => li.costHeadCode === costHeadCode)
      if (existingLateFee) {
        return
      }

      const lateFeeLineItem: BillLineItem = {
        id: `li-${Date.now()}-${Math.random()}`,
        costHeadCode,
        costHeadName,
        mode: 'Flat',
        quantity: 1,
        rate: parseFloat(fineAmount),
        subtotal: parseFloat(fineAmount),
        waiverPercent: 0,
        scholarshipPercent: 0,
        deduction: 0,
        netAmount: parseFloat(fineAmount)
      }

      const updatedLineItems = [...bill.lineItems, lateFeeLineItem]
      const grossTotal = updatedLineItems.reduce((sum, li) => sum + li.subtotal, 0)
      const netTotal = updatedLineItems.reduce((sum, li) => sum + li.netAmount, 0)

      Repo.update('finance-student-bills', bill.id, {
        lineItems: updatedLineItems,
        grossTotal,
        netTotal,
        balanceDue: netTotal - bill.paidAmount,
        updatedAt: new Date().toISOString()
      })
    })

    alert(`Late fee assigned to ${selectedBills.size} bills successfully!`)
    setSelectedBills(new Set())
    handleSearch()
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedBills)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedBills(newSelected)
  }

  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']
  const programs = ['All', 'CSE', 'BBA', 'LLB', 'EEE', 'English']
  const campuses = ['All', 'Main Campus', 'Banani Campus', 'Permanent Campus', 'Uttara', 'Lakshmipur']

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deep-plum">Assign Late Fee</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Semester *</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Program *</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {programs.map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dues Amount *</label>
                <Input
                  type="number"
                  placeholder="Minimum dues amount"
                  value={duesAmount}
                  onChange={(e) => setDuesAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fine Amount *</label>
                <Input
                  type="number"
                  placeholder="Late fee amount"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Annex/Campus *</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {campuses.map(camp => (
                    <option key={camp} value={camp}>{camp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Defaulter As *</label>
                <Input
                  type="date"
                  value={defaulterAsDate}
                  onChange={(e) => setDefaulterAsDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payable Percent</label>
                <select
                  value={payablePercent}
                  onChange={(e) => setPayablePercent(e.target.value as '40' | '70' | '100')}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="40">40</option>
                  <option value="70">70</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">#</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Student Name</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Present Semester Payable</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Previous Dues</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">100.0% Payable</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Total Paid</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Due Amount</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">Select</th>
                </tr>
              </thead>
              <tbody>
                {eligibleBills.map((bill, index) => (
                  <tr key={bill.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm text-center">{index + 1}</td>
                    <td className="p-3 text-sm">{bill.studentId}</td>
                    <td className="p-3 text-sm font-medium">{bill.studentName}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(bill.presentSemesterPayable)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(bill.previousDues)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(bill.hundredPercentPayable)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(bill.totalPaid)}</td>
                    <td className="p-3 text-sm text-right font-semibold text-red-600">
                      {formatCurrency(bill.dueAmount)}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedBills.has(bill.id)}
                        onChange={() => handleToggleSelect(bill.id)}
                        className="w-4 h-4"
                      />
                    </td>
                  </tr>
                ))}
                {eligibleBills.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-500">
                      No eligible students found. Adjust your filters and search again.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleAssignLateFee}
              disabled={selectedBills.size === 0}
              className="nu-button-primary"
            >
              Assign Late Fee ({selectedBills.size} selected)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
