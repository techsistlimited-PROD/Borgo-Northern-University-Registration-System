import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Eye } from 'lucide-react'
import { NOTICES, type Notice } from '@/lib/hrmDemoSeed'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function HRNotices() {
  const [notices, setNotices] = useState<Notice[]>(NOTICES)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewNotice, setViewNotice] = useState<Notice | null>(null)
  const [newNotice, setNewNotice] = useState({
    title: '',
    type: 'Academic' as Notice['type'],
    audience: 'All',
    content: '',
    publishedOn: new Date().toISOString().split('T')[0],
    expiry: ''
  })

  const handleCreateNotice = () => {
    setCreateDialogOpen(true)
  }

  const handleSubmitNotice = () => {
    const notice: Notice = {
      id: `NOT-${(notices.length + 1).toString().padStart(3, '0')}`,
      ...newNotice,
      status: 'Published',
      pinned: false
    }
    setNotices([notice, ...notices])
    setCreateDialogOpen(false)
    setNewNotice({
      title: '',
      type: 'Academic',
      audience: 'All',
      content: '',
      publishedOn: new Date().toISOString().split('T')[0],
      expiry: ''
    })
  }

  const handleViewNotice = (notice: Notice) => {
    setViewNotice(notice)
  }

  const filteredNotices = notices.filter(n => {
    if (selectedType !== 'all' && n.type !== selectedType) return false
    if (selectedStatus !== 'all' && n.status !== selectedStatus) return false
    return true
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  const isExpired = (expiry: string) => new Date(expiry) < new Date()

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">HR Notices</h2>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleCreateNotice}>
          <Plus className="w-4 h-4" />
          Create Notice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Holiday">Holiday</SelectItem>
                <SelectItem value="Exam">Exam</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Accounts">Accounts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notices ({filteredNotices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Audience</th>
                <th className="px-3 py-2 text-left">Published</th>
                <th className="px-3 py-2 text-left">Expires</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredNotices.map(notice => (
                <tr key={notice.id} className={isExpired(notice.expiry) ? 'opacity-50' : ''}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {notice.pinned && <span className="text-blue-600">📌</span>}
                      <span className="font-medium">{notice.title}</span>
                      {isExpired(notice.expiry) && (
                        <Badge variant="destructive" className="text-xs">Expired</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">{notice.type}</td>
                  <td className="px-3 py-2">{notice.audience}</td>
                  <td className="px-3 py-2">{notice.publishedOn || '-'}</td>
                  <td className="px-3 py-2">{notice.expiry}</td>
                  <td className="px-3 py-2">
                    <Badge variant={notice.status === 'Published' ? 'default' : 'secondary'}>
                      {notice.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewNotice(notice)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Create Notice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                placeholder="Enter notice title"
                value={newNotice.title}
                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <Select value={newNotice.type} onValueChange={(val: Notice['type']) => setNewNotice({...newNotice, type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="Exam">Exam</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Accounts">Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Audience</label>
                <Select value={newNotice.audience} onValueChange={(val) => setNewNotice({...newNotice, audience: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Publish Date</label>
                <Input
                  type="date"
                  value={newNotice.publishedOn}
                  onChange={(e) => setNewNotice({...newNotice, publishedOn: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                <Input
                  type="date"
                  value={newNotice.expiry}
                  onChange={(e) => setNewNotice({...newNotice, expiry: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content</label>
              <Textarea
                placeholder="Enter notice content..."
                rows={6}
                value={newNotice.content}
                onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitNotice}>Publish Notice</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Notice Dialog */}
      <Dialog open={!!viewNotice} onOpenChange={() => setViewNotice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewNotice?.title}</DialogTitle>
          </DialogHeader>
          {viewNotice && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Notice ID</label>
                  <p className="text-sm font-semibold">{viewNotice.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <div className="text-sm"><Badge variant="outline">{viewNotice.type}</Badge></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Audience</label>
                  <p className="text-sm">{viewNotice.audience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="text-sm">
                    <Badge variant={viewNotice.status === 'Published' ? 'default' : 'secondary'}>
                      {viewNotice.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Published On</label>
                  <p className="text-sm">{viewNotice.publishedOn || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expires On</label>
                  <p className="text-sm">{viewNotice.expiry}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Content</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{viewNotice.content}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
