import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Play, Plus, Edit, Trash2 } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { StudentBill, LateFeePolicy, BillLineItem } from '../data/types'
import { formatCurrency, calculateLateFee } from '../utils/financeUtils'

export default function LateFeeAssignmentView() {
  const [bills, setBills] = useState<StudentBill[]>([])
  const [policies, setPolicies] = useState<LateFeePolicy[]>([])
  const [activePolicy, setActivePolicy] = useState<LateFeePolicy | null>(null)
  const [eligibleBills, setEligibleBills] = useState<Array<StudentBill & { paidPercent: number; lateFee: number }>>([])
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadData()
    const unsub1 = Repo.subscribe('finance-student-bills', loadData)
    const unsub2 = Repo.subscribe('finance-late-fee-policies', loadData)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const loadData = () => {
    const billData = Repo.get<StudentBill>('finance-student-bills')
    setBills(billData)

    const policyData = Repo.get<LateFeePolicy>('finance-late-fee-policies')
    setPolicies(policyData)

    const active = policyData.find(p => p.active)
    if (active) {
      setActivePolicy(active)
    }
  }

  const handlePreview = () => {
    if (!activePolicy) {
      alert('No active late fee policy')
      return
    }

    const eligible = bills
      .filter(b => b.balanceDue > 0 && b.status !== 'Paid')
      .map(b => {
        const paidPercent = (b.paidAmount / b.netTotal) * 100
        const lateFee = calculateLateFee(b, paidPercent, activePolicy.rules)
        return { ...b, paidPercent, lateFee }
      })
      .filter(b => b.lateFee > 0)

    setEligibleBills(eligible)
  }

  const handleApply = () => {
    if (selectedBills.size === 0) {
      alert('No bills selected')
      return
    }

    if (!confirm(`Apply late fee to ${selectedBills.size} selected bills?`)) {
      return
    }

    const costHeadCode = activePolicy!.costHeadCode
    const costHeads = Repo.get('finance-cost-heads')
    const costHead = costHeads.find((ch: any) => ch.code === costHeadCode)

    eligibleBills.forEach(eligible => {
      if (selectedBills.has(eligible.id)) {
        const bill = bills.find(b => b.id === eligible.id)
        if (!bill) return

        const existingLateFee = bill.lineItems.find(li => li.costHeadCode === costHeadCode)
        if (existingLateFee) {
          alert(`Bill ${bill.billNo} already has a late fee. Skipping.`)
          return
        }

        const lateFeeLineItem: BillLineItem = {
          id: `li-${Date.now()}-${Math.random()}`,
          costHeadCode,
          costHeadName: costHead?.name || 'Late Fine',
          mode: 'Flat',
          quantity: 1,
          rate: eligible.lateFee,
          subtotal: eligible.lateFee,
          waiverPercent: 0,
          scholarshipPercent: 0,
          deduction: 0,
          netAmount: eligible.lateFee
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
      }
    })

    alert(`Late fee applied to ${selectedBills.size} bills`)
    setEligibleBills([])
    setSelectedBills(new Set())
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

  const handleToggleSelectAll = () => {
    if (selectedBills.size === eligibleBills.length) {
      setSelectedBills(new Set())
    } else {
      setSelectedBills(new Set(eligibleBills.map(b => b.id)))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Late Fee Assignment</h1>
          <p className="text-sm text-gray-600">Auto-tier based late fee calculation and assignment</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Late Fee Policy</CardTitle>
        </CardHeader>
        <CardContent>
          {activePolicy ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{activePolicy.name}</p>
                  <p className="text-sm text-gray-600">Cost Head: {activePolicy.costHeadCode}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="font-medium text-sm mb-3">Tier Rules:</p>
                <div className="space-y-2">
                  {activePolicy.rules.sort((a, b) => a.order - b.order).map(rule => (
                    <div key={rule.id} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div>
                        <p className="font-medium text-sm">{rule.name}</p>
                        <p className="text-xs text-gray-600">If paid amount &lt; {rule.threshold}% of total</p>
                      </div>
                      <div className="text-right">
                        {rule.feeType === 'Flat' ? (
                          <p className="font-semibold text-red-600">{formatCurrency(rule.feeAmount)}</p>
                        ) : (
                          <p className="font-semibold text-red-600">{rule.feeAmount}% of bill</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active late fee policy configured</p>
            </div>
          )}
        </CardContent>
      </Card>

      {activePolicy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview & Apply</CardTitle>
              <Button onClick={handlePreview} className="nu-button-primary">
                <Play className="w-4 h-4 mr-2" />
                Preview Eligible Bills
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {eligibleBills.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Found {eligibleBills.length} eligible bills. Select bills to apply late fee.
                  </p>
                  {selectedBills.size > 0 && (
                    <Button onClick={handleApply} className="nu-button-primary">
                      Apply Late Fee ({selectedBills.size})
                    </Button>
                  )}
                </div>

                <div className="overflow-x-auto border rounded">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedBills.size === eligibleBills.length}
                            onChange={handleToggleSelectAll}
                            className="w-4 h-4"
                          />
                        </th>
                        <th className="text-left p-3 text-xs font-medium">Bill No</th>
                        <th className="text-left p-3 text-xs font-medium">Student</th>
                        <th className="text-left p-3 text-xs font-medium">Program</th>
                        <th className="text-right p-3 text-xs font-medium">Net Total</th>
                        <th className="text-right p-3 text-xs font-medium">Paid</th>
                        <th className="text-right p-3 text-xs font-medium">Paid %</th>
                        <th className="text-right p-3 text-xs font-medium">Late Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligibleBills.map(bill => (
                        <tr key={bill.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedBills.has(bill.id)}
                              onChange={() => handleToggleSelect(bill.id)}
                              className="w-4 h-4"
                            />
                          </td>
                          <td className="p-3 text-sm font-mono">{bill.billNo}</td>
                          <td className="p-3 text-sm">
                            <div className="font-medium">{bill.studentName}</div>
                            <div className="text-xs text-gray-500">{bill.studentId}</div>
                          </td>
                          <td className="p-3 text-sm">{bill.program}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(bill.netTotal)}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(bill.paidAmount)}</td>
                          <td className="p-3 text-sm text-right">
                            <Badge className={bill.paidPercent < 40 ? 'bg-red-100 text-red-800' : bill.paidPercent < 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                              {bill.paidPercent.toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-right font-semibold text-red-600">
                            {formatCurrency(bill.lateFee)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Click "Preview Eligible Bills" to see bills requiring late fees</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
