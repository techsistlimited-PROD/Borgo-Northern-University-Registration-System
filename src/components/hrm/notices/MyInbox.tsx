import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Mail } from 'lucide-react'
import { INBOX_ITEMS, NOTICES, type InboxItem } from '@/lib/hrmDemoSeed'

export default function MyInbox() {
  const [inbox, setInbox] = useState<InboxItem[]>(INBOX_ITEMS)

  const handleAcknowledge = (noticeId: string) => {
    setInbox(inbox.map(i => 
      i.noticeId === noticeId ? {...i, acknowledged: true, ackAt: new Date().toISOString().split('T')[0]} : i
    ))
  }

  const inboxWithNotices = inbox.map(item => ({
    ...item,
    notice: NOTICES.find(n => n.id === item.noticeId)!
  }))

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">My Inbox (Acknowledgments)</h2>

      <Card>
        <CardHeader>
          <CardTitle>Inbox ({inbox.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">From</th>
                <th className="px-3 py-2 text-left">Published</th>
                <th className="px-3 py-2 text-left">Requires Ack</th>
                <th className="px-3 py-2 text-left">Read</th>
                <th className="px-3 py-2 text-left">Acknowledged</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inboxWithNotices.map(item => (
                <tr key={item.noticeId} className={!item.read ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 font-medium">
                    {!item.read && <Mail className="inline w-4 h-4 mr-2 text-blue-600" />}
                    {item.notice.title}
                  </td>
                  <td className="px-3 py-2">{item.notice.type}</td>
                  <td className="px-3 py-2">{item.notice.publishedOn}</td>
                  <td className="px-3 py-2">
                    {item.requireAck ? (
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {item.read ? '✓' : '✗'}
                  </td>
                  <td className="px-3 py-2">
                    {item.acknowledged ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs">{item.ackAt}</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2">
                    {item.requireAck && !item.acknowledged && (
                      <Button
                        size="sm"
                        onClick={() => handleAcknowledge(item.noticeId)}
                      >
                        Acknowledge
                      </Button>
                    )}
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
