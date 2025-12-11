import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { FEEDBACK_ENTRIES, HRM_EMPLOYEES, type Feedback } from '@/lib/payrollPerformanceStatic'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function FeedbackRecommendations() {
  const [feedback, setFeedback] = useState<Feedback[]>(FEEDBACK_ENTRIES)
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const [newFeedback, setNewFeedback] = useState({
    empId: '',
    from: '',
    rating: 5,
    comments: '',
    type: 'Peer' as 'Peer' | 'Supervisor' | 'Self'
  })

  const filteredFeedback = feedback.filter(f => {
    const emp = HRM_EMPLOYEES.find(e => e.id === f.empId)
    if (selectedDept !== 'all' && emp?.department !== selectedDept) return false
    if (selectedType !== 'all' && f.type !== selectedType) return false
    if (selectedRating !== 'all') {
      const ratingRange = selectedRating === '5' ? [5, 5] :
                          selectedRating === '4' ? [4, 4] :
                          selectedRating === '3' ? [3, 3] : [1, 2]
      if (f.rating < ratingRange[0] || f.rating > ratingRange[1]) return false
    }
    return true
  })

  const avgByType = ['Peer', 'Supervisor', 'Self'].map(type => {
    const typeFeedback = feedback.filter(f => f.type === type)
    const avg = typeFeedback.length > 0 
      ? typeFeedback.reduce((sum, f) => sum + f.rating, 0) / typeFeedback.length
      : 0
    return { type, average: avg.toFixed(1) }
  })

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} ★`,
    count: feedback.filter(f => f.rating === rating).length
  }))

  const handleAdd = () => {
    const emp = HRM_EMPLOYEES.find(e => e.id === newFeedback.empId)
    if (!emp) return

    const fb: Feedback = {
      id: `FB-${(feedback.length + 1).toString().padStart(3, '0')}`,
      empId: newFeedback.empId,
      empName: emp.name,
      from: newFeedback.from,
      fromId: 'SELF',
      date: new Date().toISOString().split('T')[0],
      rating: newFeedback.rating,
      comments: newFeedback.comments,
      type: newFeedback.type
    }
    setFeedback([...feedback, fb])
    setIsAddOpen(false)
    setNewFeedback({
      empId: '',
      from: '',
      rating: 5,
      comments: '',
      type: 'Peer'
    })
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Feedback & Recommendations</h2>
          <p className="text-gray-600">Manage performance feedback and peer reviews</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Employee</label>
                <Select value={newFeedback.empId} onValueChange={(val) => setNewFeedback({...newFeedback, empId: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {HRM_EMPLOYEES.filter(e => e.status === 'Active').map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">From</label>
                <Input 
                  value={newFeedback.from}
                  onChange={(e) => setNewFeedback({...newFeedback, from: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newFeedback.type} onValueChange={(val: 'Peer' | 'Supervisor' | 'Self') => setNewFeedback({...newFeedback, type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Peer">Peer</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Self">Self</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Rating (1-5)</label>
                <Select value={newFeedback.rating.toString()} onValueChange={(val) => setNewFeedback({...newFeedback, rating: Number(val)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 ★★★★★</SelectItem>
                    <SelectItem value="4">4 ★★★★</SelectItem>
                    <SelectItem value="3">3 ★★★</SelectItem>
                    <SelectItem value="2">2 ★★</SelectItem>
                    <SelectItem value="1">1 ★</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Comments</label>
                <Textarea 
                  value={newFeedback.comments}
                  onChange={(e) => setNewFeedback({...newFeedback, comments: e.target.value})}
                  rows={4}
                  placeholder="Enter feedback comments..."
                />
              </div>
              <Button onClick={handleAdd} className="w-full">Add Feedback</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {avgByType.map(item => (
          <Card key={item.type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg {item.type} Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{item.average}</div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.floor(Number(item.average)) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <SelectItem value="Accounts">Accounts</SelectItem>
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
                  <SelectItem value="Peer">Peer</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Self">Self</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Rating Range</label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="1-2">1-2 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" name="Number of Feedbacks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Entries ({filteredFeedback.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFeedback.map((fb) => (
                  <tr key={fb.id}>
                    <td className="px-4 py-3 text-sm text-gray-600">{fb.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fb.from}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{fb.empName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fb.type}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-sm font-semibold">{fb.rating}.0</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fb.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
