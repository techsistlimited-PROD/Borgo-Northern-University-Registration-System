import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Download, FileText, Bell } from 'lucide-react'
import { Repo } from '@/lib/repo'
import { EmployeeNotice, NoticeCategory } from '../data/types'

export default function EmployeeNoticesView() {
  const [notices, setNotices] = useState<EmployeeNotice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All')

  useEffect(() => {
    loadNotices()
    const unsub = Repo.subscribe('finance-employee-notices', loadNotices)
    return unsub
  }, [])

  const loadNotices = () => {
    const data = Repo.get<EmployeeNotice>('finance-employee-notices')
    setNotices(data.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()))
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryBadge = (category: NoticeCategory) => {
    const colors = {
      HR: 'bg-blue-100 text-blue-800',
      Accounts: 'bg-green-100 text-green-800',
      General: 'bg-gray-100 text-gray-800'
    }
    return <Badge className={colors[category]}>{category}</Badge>
  }

  const newNoticesCount = notices.filter(n => n.isNew).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum flex items-center gap-2">
            Employee Notices
            {newNoticesCount > 0 && (
              <Badge className="bg-red-500 text-white">
                <Bell className="w-3 h-3 mr-1" />
                {newNoticesCount} new
              </Badge>
            )}
          </h1>
          <p className="text-sm text-gray-600">HR, Accounts, and general notices (read-only)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {(['All', 'HR', 'Accounts', 'General'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-accent-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotices.map(notice => (
              <Card key={notice.id} className={notice.isNew ? 'border-accent-purple border-2' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.isNew && (
                          <Badge className="bg-red-500 text-white text-xs">NEW</Badge>
                        )}
                        {getCategoryBadge(notice.category)}
                        <span className="text-xs text-gray-500">{notice.publishedDate}</span>
                      </div>
                      <CardTitle className="text-lg">{notice.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">{notice.content}</p>
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="flex gap-2">
                      {notice.attachments.map((attachment, idx) => (
                        <Button key={idx} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredNotices.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notices found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
