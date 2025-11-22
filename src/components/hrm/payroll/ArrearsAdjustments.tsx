import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Eye } from 'lucide-react'
import { ARREARS, type Arrear } from '@/lib/payrollPerformanceStatic'

export default function ArrearsAdjustments() {
  const [arrears, setArrears] = useState<Arrear[]>(ARREARS)
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewArrear, setViewArrear] = useState<Arrear | null>(null)

  const [newArrear, setNewArrear] = useState({
    empId: '',
    name: '',
    dept: '',
    month: 'December',
    year: 2024,
    type: 'Arrear' as 'Arrear' | 'Bonus' | 'Adjustment',
    description: '',
    amount: 0
  })

  const filteredArrears = arrears.filter(a => {
    if (selectedDept !== 'all' && a.dept !== selectedDept) return false
    if (selectedMonth !== 'all' && a.month !== selectedMonth) return false
    if (selectedType !== 'all' && a.type !== selectedType) return false
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false
    return true
  })

  const getTypeBadge = (type: Arrear['type']) => {
    const variants = {
      Arrear: 'bg-orange-100 text-orange-800',
      Bonus: 'bg-green-100 text-green-800',
      Adjustment: 'bg-blue-100 text-blue-800'
    }
    return variants[type]
  }

  const handleAdd = () => {
    const arrear: Arrear = {
      id: `ARR-${(arrears.length + 1).toString().padStart(3, '0')}`,
      ...newArrear,
      status: 'Pending'
    }
    setArrears([...arrears, arrear])
    setIsAddOpen(false)
    setNewArrear({
      empId: '',
      name: '',
      dept: '',
      month: 'December',
      year: 2024,
      type: 'Arrear',
      description: '',
      amount: 0
    })
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Arrears & Adjustments</h2>
          <p className="text-gray-600">Manage salary arrears, bonuses, and adjustments</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Arrear/Adjustment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Employee ID</label>
                <Input 
                  value={newArrear.empId}
                  onChange={(e) => setNewArrear({...newArrear, empId: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Employee Name</label>
                <Input 
                  value={newArrear.name}
                  onChange={(e) => setNewArrear({...newArrear, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Input 
                  value={newArrear.dept}
                  onChange={(e) => setNewArrear({...newArrear, dept: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Month</label>
                  <Select value={newArrear.month} onValueChange={(val) => setNewArrear({...newArrear, month: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="December">December</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input type="number" value={newArrear.year} onChange={(e) => setNewArrear({...newArrear, year: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newArrear.type} onValueChange={(val: 'Arrear' | 'Bonus' | 'Adjustment') => setNewArrear({...newArrear, type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arrear">Arrear</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" value={newArrear.amount} onChange={(e) => setNewArrear({...newArrear, amount: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={newArrear.description}
                  onChange={(e) => setNewArrear({...newArrear, description: e.target.value})}
                  rows={3}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Add Adjustment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="September">September</SelectItem>
                  <SelectItem value="October">October</SelectItem>
                  <SelectItem value="November">November</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Arrear">Arrear</SelectItem>
                  <SelectItem value="Bonus">Bonus</SelectItem>
                  <SelectItem value="Adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Arrears & Adjustments ({filteredArrears.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArrears.map((arrear) => (
                  <tr key={arrear.id}>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{arrear.name}</div>
                        <div className="text-xs text-gray-500">{arrear.empId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{arrear.dept}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{arrear.month} {arrear.year}</td>
                    <td className="px-4 py-3">
                      <Badge className={getTypeBadge(arrear.type)}>{arrear.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{arrear.description}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">৳{arrear.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={arrear.status === 'Approved' ? 'default' : 'secondary'}>
                        {arrear.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => setViewArrear(arrear)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewArrear} onOpenChange={() => setViewArrear(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arrear/Adjustment Details</DialogTitle>
          </DialogHeader>
          {viewArrear && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-sm font-semibold">{viewArrear.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <div className="text-sm">
                    <Badge className={getTypeBadge(viewArrear.type)}>{viewArrear.type}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="text-sm font-semibold">{viewArrear.empId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee Name</label>
                  <p className="text-sm font-semibold">{viewArrear.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-sm">{viewArrear.dept}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Period</label>
                  <p className="text-sm">{viewArrear.month} {viewArrear.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-sm font-bold text-green-600">৳{viewArrear.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="text-sm">
                    <Badge variant={viewArrear.status === 'Approved' ? 'default' : 'secondary'}>
                      {viewArrear.status}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{viewArrear.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
