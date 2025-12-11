import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Link2, Unlink, Download, Settings } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { BankStatement, Payment } from '../data/types'
import { formatCurrency, exportTableToCSV, downloadCSV } from '../utils/financeUtils'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import { bankStatementsStatic, paymentsStatic } from '../data/staticSeeds'
import { ensureMinRows, buildDemoBankStmt, buildDemoPayment } from '../utils/demoFillers'

export default function BankReconciliationView() {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tolerance, setTolerance] = useState(100)
  const [isToleranceDialogOpen, setIsToleranceDialogOpen] = useState(false)
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false)
  const [selectedStatement, setSelectedStatement] = useState<BankStatement | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<string>('')

  useEffect(() => {
    loadData()
    const unsub1 = Repo.subscribe('finance-bank-statements', loadData)
    const unsub2 = Repo.subscribe('finance-payments', loadData)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const loadData = () => {
    // Apply data amplification for demo mode (≥120 bank statements, 80% matched)
    const baseStatements = DEMO_MODE ? bankStatementsStatic : Repo.get<BankStatement>('finance-bank-statements')
    const basePayments = DEMO_MODE ? paymentsStatic : Repo.get<Payment>('finance-payments')

    const amplifiedStatements = ensureMinRows(baseStatements, 120, (i) => buildDemoBankStmt(i, { matchRatio: 0.80 }))
    const amplifiedPayments = ensureMinRows(basePayments, 120, buildDemoPayment)

    setStatements(amplifiedStatements)
    setPayments(amplifiedPayments)
  }

  const matchedStatements = statements.filter(s => s.matched)
  const unmatchedStatements = statements.filter(s => !s.matched)

  const handleOpenMatchDialog = (statement: BankStatement) => {
    setSelectedStatement(statement)
    setSelectedReceipt('')
    setIsMatchDialogOpen(true)
  }

  const handleMatch = () => {
    if (!selectedStatement || !selectedReceipt) {
      alert('Please select a receipt')
      return
    }

    if (DEMO_MODE) {
      alert(showDemoToast('Match bank statement'))
      setIsMatchDialogOpen(false)
      return
    }

    Repo.update('finance-bank-statements', selectedStatement.id, {
      matched: true,
      matchedReceiptNo: selectedReceipt
    })

    setIsMatchDialogOpen(false)
    alert('Matched successfully')
  }

  const handleUnmatch = (id: string) => {
    if (DEMO_MODE) {
      alert(showDemoToast('Unmatch bank statement'))
      return
    }

    if (confirm('Unmatch this statement?')) {
      Repo.update('finance-bank-statements', id, {
        matched: false,
        matchedReceiptNo: undefined
      })
    }
  }

  const handleExport = () => {
    const headers = ['Date', 'Reference', 'Amount', 'Status', 'Matched Receipt', 'Notes']
    const rows = statements.map(s => [
      s.date,
      s.reference,
      s.amount.toString(),
      s.matched ? 'Matched' : 'Unmatched',
      s.matchedReceiptNo || 'N/A',
      s.notes || ''
    ])

    const csv = exportTableToCSV(headers, rows)
    downloadCSV('bank-reconciliation.csv', csv)
  }

  const availableReceipts = payments.filter(p => {
    if (!selectedStatement) return false
    const amountDiff = Math.abs(p.totalAmount - selectedStatement.amount)
    return amountDiff <= tolerance && !statements.find(s => s.matchedReceiptNo === p.receiptNo)
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Bank Reconciliation</h1>
          <p className="text-sm text-gray-600">Manual matching with tolerance settings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsToleranceDialogOpen(true)} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Tolerance: ±{formatCurrency(tolerance)}
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Statements</p>
              <p className="text-3xl font-bold text-deep-plum">{statements.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Matched</p>
              <p className="text-3xl font-bold text-green-600">{matchedStatements.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Unmatched</p>
              <p className="text-3xl font-bold text-red-600">{unmatchedStatements.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unmatched Statements ({unmatchedStatements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Reference</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Notes</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {unmatchedStatements.map(statement => (
                  <tr key={statement.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{statement.date}</td>
                    <td className="p-3 text-sm font-mono">{statement.reference}</td>
                    <td className="p-3 text-sm text-right font-semibold">{formatCurrency(statement.amount)}</td>
                    <td className="p-3 text-sm text-gray-600">{statement.notes}</td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenMatchDialog(statement)}
                        >
                          <Link2 className="w-4 h-4 mr-2" />
                          Match
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {unmatchedStatements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No unmatched statements</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matched Statements ({matchedStatements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Reference</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Matched Receipt</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Notes</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matchedStatements.map(statement => (
                  <tr key={statement.id} className="border-b hover:bg-gray-50 bg-green-50">
                    <td className="p-3 text-sm">{statement.date}</td>
                    <td className="p-3 text-sm font-mono">{statement.reference}</td>
                    <td className="p-3 text-sm text-right font-semibold">{formatCurrency(statement.amount)}</td>
                    <td className="p-3 text-sm">
                      <Badge className="bg-green-100 text-green-800">{statement.matchedReceiptNo}</Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{statement.notes}</td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnmatch(statement.id)}
                        >
                          <Unlink className="w-4 h-4 mr-2" />
                          Unmatch
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {matchedStatements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No matched statements yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isToleranceDialogOpen} onOpenChange={setIsToleranceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Tolerance</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Tolerance Amount (±BDT)
            </label>
            <Input
              type="number"
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
              placeholder="100"
            />
            <p className="text-xs text-gray-600 mt-2">
              Statements within ±{tolerance} BDT will be shown as potential matches
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsToleranceDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsToleranceDialogOpen(false)} className="nu-button-primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Match Statement to Receipt</DialogTitle>
          </DialogHeader>

          {selectedStatement && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-4">
                <p className="text-sm font-medium mb-2">Bank Statement:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Date: {selectedStatement.date}</div>
                  <div>Amount: <span className="font-semibold">{formatCurrency(selectedStatement.amount)}</span></div>
                  <div className="col-span-2">Reference: {selectedStatement.reference}</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Select Receipt (within ±{formatCurrency(tolerance)} tolerance):</p>
                <div className="border rounded max-h-64 overflow-y-auto">
                  {availableReceipts.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-2"></th>
                          <th className="text-left p-2 text-xs">Receipt No</th>
                          <th className="text-left p-2 text-xs">Student</th>
                          <th className="text-right p-2 text-xs">Amount</th>
                          <th className="text-right p-2 text-xs">Diff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableReceipts.map(receipt => {
                          const diff = receipt.totalAmount - selectedStatement.amount
                          return (
                            <tr key={receipt.id} className="border-t hover:bg-gray-50">
                              <td className="p-2">
                                <input
                                  type="radio"
                                  name="receipt"
                                  value={receipt.receiptNo}
                                  checked={selectedReceipt === receipt.receiptNo}
                                  onChange={() => setSelectedReceipt(receipt.receiptNo)}
                                  className="w-4 h-4"
                                />
                              </td>
                              <td className="p-2 text-xs font-mono">{receipt.receiptNo}</td>
                              <td className="p-2 text-xs">{receipt.studentName}</td>
                              <td className="p-2 text-xs text-right font-semibold">{formatCurrency(receipt.totalAmount)}</td>
                              <td className="p-2 text-xs text-right">
                                <Badge className={diff === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                                </Badge>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No receipts found within tolerance range</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMatchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMatch} className="nu-button-primary" disabled={!selectedReceipt}>
              <Link2 className="w-4 h-4 mr-2" />
              Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
