import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ESS_LEAVE_BALANCE, ESS_LEAVE_REQUESTS, ESS_ATTENDANCE } from '@/lib/hrmDemoSeed'

export default function LeaveAttendance() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Leave & Attendance</h2>

      <Tabs defaultValue="leave">
        <TabsList>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(ESS_LEAVE_BALANCE).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">{key}</p>
                    <p className="text-2xl font-bold text-blue-600">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <Button onClick={() => alert('Apply Leave - Demo Feature: In production, this will open a form to submit a new leave application with leave type, dates, reason, and supporting documents.')}>
                  Apply Leave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">From - To</th>
                    <th className="px-3 py-2 text-left">Days</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Approver</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ESS_LEAVE_REQUESTS.map(req => (
                    <tr key={req.id}>
                      <td className="px-3 py-2">{req.type}</td>
                      <td className="px-3 py-2">{req.from} to {req.to}</td>
                      <td className="px-3 py-2">{req.days}</td>
                      <td className="px-3 py-2">
                        <Badge variant={req.status === 'Approved' ? 'default' : req.status === 'Rejected' ? 'destructive' : 'secondary'}>
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">{req.approver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">In Time</th>
                      <th className="px-3 py-2 text-left">Out Time</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ESS_ATTENDANCE.map(att => (
                      <tr key={att.date}>
                        <td className="px-3 py-2">{att.date}</td>
                        <td className="px-3 py-2">{att.inTime}</td>
                        <td className="px-3 py-2">{att.outTime}</td>
                        <td className="px-3 py-2">
                          <Badge variant={att.status === 'Present' ? 'default' : 'secondary'}>
                            {att.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">{att.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
