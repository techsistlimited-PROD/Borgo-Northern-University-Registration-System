import { useState, useEffect } from 'react'
import { Repo } from '@/lib/repo'
import { BankStatement, Receipt } from '@/lib/seedAll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, RefreshCw } from 'lucide-react'
import { exportToCSV } from '@/lib/exportUtils'

export default function BankReconciliationManagement() {
  const [bankStatements, setBankStatements] = useState<BankStatement[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])

  useEffect(() => {
    loadData()
    const unsubStatements = Repo.subscribe<BankStatement>('bankStatements', setBankStatements)
    const unsubReceipts = Repo.subscribe<Receipt>('receipts', setReceipts)

    return () => {
      unsubStatements()
      unsubReceipts()
    }
  }, [])

  const loadData = () => {
    setBankStatements(Repo.get<BankStatement>('bankStatements'))
    setReceipts(Repo.get<Receipt>('receipts'))
  }

  const handleAutoMatch = () => {
    let matched = 0
    bankStatements.forEach(statement => {
      if (statement.matched) return
      
      const matchingReceipt = receipts.find(r => 
        Math.abs(r.amount - statement.amount) <= 100 &&
        r.reference === statement.reference
      )

      if (matchingReceipt) {
        Repo.update<BankStatement>('bankStatements', statement.id, {
          matched: true,
          receiptId: matchingReceipt.id
        })
        matched++
      }
    })

    alert(`Auto-matched ${matched} items`)
    loadData()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Bank Reconciliation</h1>
          <p className="text-sm text-gray-600">Match bank statements with system receipts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAutoMatch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto-Match
          </Button>
          <Button onClick={() => exportToCSV(bankStatements, 'bank-statements')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bank Statements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Reference</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bankStatements.map(statement => (
                    <tr key={statement.id} className={statement.matched ? 'bg-green-50' : ''}>
                      <td className="px-4 py-2 text-xs">{statement.date}</td>
                      <td className="px-4 py-2 text-xs">{statement.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs">{statement.reference}</td>
                      <td className="px-4 py-2 text-xs">
                        <Badge variant={statement.matched ? 'default' : 'secondary'}>
                          {statement.matched ? 'Matched' : 'Unmatched'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">System Receipts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">MR No</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {receipts.slice(0, 30).map(receipt => (
                    <tr key={receipt.id}>
                      <td className="px-4 py-2 text-xs">{receipt.date}</td>
                      <td className="px-4 py-2 text-xs">{receipt.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs">{receipt.moneyReceiptNo}</td>
                      <td className="px-4 py-2 text-xs">{receipt.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
