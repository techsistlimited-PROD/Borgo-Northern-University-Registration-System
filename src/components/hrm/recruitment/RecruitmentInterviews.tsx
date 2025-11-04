import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Video, MapPin } from 'lucide-react'
import { INTERVIEW_PANELS, RECRUITMENT_CANDIDATES } from '@/lib/recruitmentStatic'

export default function RecruitmentInterviews() {
  const scheduledToday = INTERVIEW_PANELS.flatMap(p => p.slots).filter(s => s.date === new Date().toISOString().slice(0, 10)).length

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{scheduledToday}</p>
            <p className="text-sm">Scheduled Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{INTERVIEW_PANELS.flatMap(p => p.slots).length}</p>
            <p className="text-sm">Total Slots</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{INTERVIEW_PANELS.length}</p>
            <p className="text-sm">Active Panels</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Interview Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {INTERVIEW_PANELS.map(panel => (
              <div key={panel.panelId} className="border rounded-lg p-4">
                <div className="mb-3">
                  <h3 className="font-semibold">{panel.panelName}</h3>
                  <p className="text-sm text-gray-600">Vacancy: {panel.vacancyRef}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {panel.members.map((m, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {m.name} ({m.designation})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {panel.slots.map(slot => {
                    const candidates = slot.candidates.map(id => RECRUITMENT_CANDIDATES.find(c => c.id === id)).filter(Boolean)
                    return (
                      <div key={slot.slotId} className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{slot.date} | {slot.start} - {slot.end}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              {slot.mode === 'Online' ? (
                                <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Online</span>
                              ) : (
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {slot.room}</span>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">{slot.candidates.length} Candidates</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {candidates.map(c => c && (
                            <span key={c.id} className="text-xs bg-white px-2 py-1 rounded border">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
