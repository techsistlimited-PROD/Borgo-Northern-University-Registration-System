import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye, Archive } from 'lucide-react'
import { SALARY_TEMPLATES, type SalaryTemplate } from '@/lib/payrollPerformanceStatic'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function SalaryStructure() {
  const [templates, setTemplates] = useState<SalaryTemplate[]>(SALARY_TEMPLATES)
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleEdit = (template: SalaryTemplate) => {
    if (DEMO_MODE) {
      alert(showDemoToast(`Edit salary structure: ${template.name}`))
      return
    }

    alert(`Edit dialog would open for ${template.name} in production`)
  }
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewTemplate, setViewTemplate] = useState<SalaryTemplate | null>(null)

  const [newTemplate, setNewTemplate] = useState({
    grade: '',
    designation: '',
    basic: 0,
    houseRent: 0,
    medical: 0,
    transport: 0,
    other: 0
  })

  const filteredTemplates = templates.filter(t => {
    if (selectedGrade !== 'all' && t.grade !== selectedGrade) return false
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false
    return true
  })

  const chartData = templates.filter(t => t.status === 'Active').map(t => ({
    grade: t.grade,
    salary: t.total
  }))

  const calculateTotal = () => {
    return newTemplate.basic + newTemplate.houseRent + newTemplate.medical + 
           newTemplate.transport + newTemplate.other
  }

  const handleAddTemplate = () => {
    const template: SalaryTemplate = {
      id: `ST-${(templates.length + 1).toString().padStart(3, '0')}`,
      ...newTemplate,
      total: calculateTotal(),
      effectiveFrom: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    setTemplates([...templates, template])
    setIsAddOpen(false)
    setNewTemplate({
      grade: '',
      designation: '',
      basic: 0,
      houseRent: 0,
      medical: 0,
      transport: 0,
      other: 0
    })
  }

  const handleArchive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, status: 'Inactive' as const } : t
    ))
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Salary Structure</h2>
          <p className="text-gray-600">Manage salary templates and compensation structure</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Salary Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Grade</label>
                  <Input 
                    value={newTemplate.grade}
                    onChange={(e) => setNewTemplate({...newTemplate, grade: e.target.value})}
                    placeholder="e.g. G-9"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Designation</label>
                  <Input 
                    value={newTemplate.designation}
                    onChange={(e) => setNewTemplate({...newTemplate, designation: e.target.value})}
                    placeholder="e.g. Associate Professor"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Basic Salary</label>
                  <Input 
                    type="number"
                    value={newTemplate.basic}
                    onChange={(e) => setNewTemplate({...newTemplate, basic: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">House Rent</label>
                  <Input 
                    type="number"
                    value={newTemplate.houseRent}
                    onChange={(e) => setNewTemplate({...newTemplate, houseRent: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Medical Allowance</label>
                  <Input 
                    type="number"
                    value={newTemplate.medical}
                    onChange={(e) => setNewTemplate({...newTemplate, medical: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Transport Allowance</label>
                  <Input 
                    type="number"
                    value={newTemplate.transport}
                    onChange={(e) => setNewTemplate({...newTemplate, transport: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Other Allowance</label>
                  <Input 
                    type="number"
                    value={newTemplate.other}
                    onChange={(e) => setNewTemplate({...newTemplate, other: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Total (Auto-calculated)</label>
                  <Input 
                    type="number"
                    value={calculateTotal()}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
              <Button onClick={handleAddTemplate} className="w-full mt-4">Add Template</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Grade</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="G-11">G-11</SelectItem>
                  <SelectItem value="G-10">G-10</SelectItem>
                  <SelectItem value="G-9">G-9</SelectItem>
                  <SelectItem value="G-7">G-7</SelectItem>
                  <SelectItem value="G-6">G-6</SelectItem>
                  <SelectItem value="G-5">G-5</SelectItem>
                  <SelectItem value="G-4">G-4</SelectItem>
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Salary by Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="grade" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="salary" fill="#3b82f6" name="Total Salary" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salary Templates ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">House Rent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transport</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Other</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{template.grade}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{template.designation}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{template.basic.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{template.houseRent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{template.medical.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{template.transport.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{template.other.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">৳{template.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={template.status === 'Active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewTemplate(template)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {template.status === 'Active' && (
                          <Button variant="ghost" size="sm" onClick={() => handleArchive(template.id)}>
                            <Archive className="w-4 h-4 text-orange-600" />
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

      <Dialog open={!!viewTemplate} onOpenChange={() => setViewTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salary Structure Details</DialogTitle>
          </DialogHeader>
          {viewTemplate && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade</label>
                  <p className="text-sm font-semibold">{viewTemplate.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Designation</label>
                  <p className="text-sm font-semibold">{viewTemplate.designation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Basic Salary</label>
                  <p className="text-sm">৳{viewTemplate.basic.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">House Rent</label>
                  <p className="text-sm">৳{viewTemplate.houseRent.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Medical</label>
                  <p className="text-sm">৳{viewTemplate.medical.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Transport</label>
                  <p className="text-sm">৳{viewTemplate.transport.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Other</label>
                  <p className="text-sm">৳{viewTemplate.other.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total</label>
                  <p className="text-sm font-bold text-blue-600">৳{viewTemplate.total.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Effective From</label>
                  <p className="text-sm">{viewTemplate.effectiveFrom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm">{viewTemplate.status}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
