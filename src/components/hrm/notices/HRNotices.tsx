import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye } from 'lucide-react'
import { NOTICES, type Notice } from '@/lib/hrmDemoSeed'

export default function HRNotices() {
  const [notices, setNotices] = useState<Notice[]>(NOTICES)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

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
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
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
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
