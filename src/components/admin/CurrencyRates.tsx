import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, DollarSign } from 'lucide-react'

interface CurrencyRate {
  id: string
  currencyCode: string
  currencyName: string
  symbol: string
  exchangeRate: number
  lastUpdated: string
  status: 'Active' | 'Inactive'
}

export default function CurrencyRates() {
  const [rates, setRates] = useState<CurrencyRate[]>([
    { id: '1', currencyCode: 'BDT', currencyName: 'Bangladeshi Taka', symbol: '৳', exchangeRate: 1.00, lastUpdated: '2025-01-15', status: 'Active' },
    { id: '2', currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$', exchangeRate: 110.50, lastUpdated: '2025-01-15', status: 'Active' },
    { id: '3', currencyCode: 'EUR', currencyName: 'Euro', symbol: '€', exchangeRate: 120.75, lastUpdated: '2025-01-15', status: 'Active' },
    { id: '4', currencyCode: 'GBP', currencyName: 'British Pound', symbol: '£', exchangeRate: 140.25, lastUpdated: '2025-01-15', status: 'Active' },
    { id: '5', currencyCode: 'INR', currencyName: 'Indian Rupee', symbol: '₹', exchangeRate: 1.33, lastUpdated: '2025-01-15', status: 'Active' }
  ])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedRate, setSelectedRate] = useState<CurrencyRate | null>(null)
  const [formData, setFormData] = useState({
    currencyCode: '',
    currencyName: '',
    symbol: '',
    exchangeRate: 1.00
  })

  const handleAdd = () => {
    const newRate: CurrencyRate = {
      id: String(rates.length + 1),
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    setRates([...rates, newRate])
    setShowAddDialog(false)
    resetForm()
  }

  const handleEdit = () => {
    setRates(rates.map(r => 
      r.id === selectedRate?.id 
        ? { ...r, ...formData, lastUpdated: new Date().toISOString().split('T')[0] } 
        : r
    ))
    setShowEditDialog(false)
    resetForm()
  }

  const openEditDialog = (rate: CurrencyRate) => {
    setSelectedRate(rate)
    setFormData({
      currencyCode: rate.currencyCode,
      currencyName: rate.currencyName,
      symbol: rate.symbol,
      exchangeRate: rate.exchangeRate
    })
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      currencyCode: '',
      currencyName: '',
      symbol: '',
      exchangeRate: 1.00
    })
    setSelectedRate(null)
  }

  const handleToggleStatus = (id: string) => {
    setRates(rates.map(r => 
      r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Currency & Exchange Rates</h1>
          <p className="text-gray-600 text-sm mt-1">Manage currency exchange rates for international transactions</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-deep-plum hover:bg-deep-plum/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Currency
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Currency Code</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Currency Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Symbol</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Exchange Rate (BDT)</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Last Updated</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-deep-plum">{rate.currencyCode}</td>
                  <td className="p-4 text-sm">{rate.currencyName}</td>
                  <td className="p-4 text-lg">{rate.symbol}</td>
                  <td className="p-4 text-sm font-medium">
                    {rate.currencyCode === 'BDT' ? '1.00' : `${rate.exchangeRate.toFixed(2)} BDT`}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{rate.lastUpdated}</td>
                  <td className="p-4">
                    <Badge 
                      variant={rate.status === 'Active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(rate.id)}
                    >
                      {rate.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(rate)}
                      disabled={rate.currencyCode === 'BDT'}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Currency</DialogTitle>
            <DialogDescription>Add a new currency and its exchange rate</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <Input
                value={formData.currencyCode}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
                placeholder="e.g., USD, EUR"
                maxLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Currency Name</label>
              <Input
                value={formData.currencyName}
                onChange={(e) => setFormData({ ...formData, currencyName: e.target.value })}
                placeholder="e.g., US Dollar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Symbol</label>
              <Input
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="e.g., $, €, £"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exchange Rate (in BDT)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.exchangeRate}
                onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 0 })}
                placeholder="e.g., 110.50"
              />
              <p className="text-xs text-gray-500 mt-1">1 {formData.currencyCode || 'Currency'} = {formData.exchangeRate} BDT</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Currency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Exchange Rate</DialogTitle>
            <DialogDescription>Update the currency exchange rate</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <Input
                value={formData.currencyCode}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Currency Name</label>
              <Input
                value={formData.currencyName}
                onChange={(e) => setFormData({ ...formData, currencyName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Symbol</label>
              <Input
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exchange Rate (in BDT)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.exchangeRate}
                onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-gray-500 mt-1">1 {formData.currencyCode} = {formData.exchangeRate} BDT</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-deep-plum hover:bg-deep-plum/90">
              Update Rate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
