import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RECRUITMENT_CANDIDATES, SHORTLIST_RULES } from '@/lib/recruitmentStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'

export default function RecruitmentShortlisting() {
  const [selected, setSelected] = useState<string[]>([])
  const candidates = RECRUITMENT_CANDIDATES.filter(c => c.status === 'Screened' || c.status === 'Applied')

  const getEligibility = (c: typeof candidates[0]) => {
    const { cgpa, experienceYears, university } = c
    const { minGPA, minExperience, preferredUniversities } = SHORTLIST_RULES
    
    if (cgpa >= minGPA && experienceYears >= minExperience && preferredUniversities.includes(university)) {
      return { label: 'Eligible', color: 'bg-green-100 text-green-800' }
    } else if (cgpa >= minGPA - 0.2 && experienceYears >= minExperience - 1) {
      return { label: 'Borderline', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { label: 'Not Eligible', color: 'bg-red-100 text-red-800' }
  }

  const eligible = candidates.filter(c => getEligibility(c).label === 'Eligible').length
  const borderline = candidates.filter(c => getEligibility(c).label === 'Borderline').length
  const notEligible = candidates.filter(c => getEligibility(c).label === 'Not Eligible').length

  const handleAutoShortlist = () => {
    const autoSelected = candidates.filter(c => getEligibility(c).label === 'Eligible').map(c => c.id)
    setSelected(autoSelected)

    if (DEMO_MODE) {
      alert(showDemoToast(`Auto-shortlisted ${autoSelected.length} candidates`))
    } else {
      alert(`Auto-shortlisted ${autoSelected.length} eligible candidates`)
    }
  }

  const handleShortlistSelected = () => {
    if (selected.length === 0) return

    if (DEMO_MODE) {
      alert(showDemoToast(`Shortlist ${selected.length} candidates`))
      return
    }

    if (confirm(`Shortlist ${selected.length} selected candidates?`)) {
      alert('Candidates shortlisted successfully')
      setSelected([])
    }
  }

  const handleRejectSelected = () => {
    if (selected.length === 0) return

    if (DEMO_MODE) {
      alert(showDemoToast(`Reject ${selected.length} candidates`))
      return
    }

    if (confirm(`Reject ${selected.length} selected candidates? This action cannot be undone.`)) {
      alert('Candidates rejected successfully')
      setSelected([])
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bulk Shortlisting</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleAutoShortlist} variant="outline">Auto Shortlist</Button>
              <Button disabled={selected.length === 0} onClick={handleShortlistSelected}>Shortlist Selected ({selected.length})</Button>
              <Button disabled={selected.length === 0} variant="destructive" onClick={handleRejectSelected}>Reject Selected</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-green-50">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">{eligible}</p>
                <p className="text-sm">Eligible</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-yellow-600">{borderline}</p>
                <p className="text-sm">Borderline</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-red-600">{notEligible}</p>
                <p className="text-sm">Not Eligible</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map(c => {
              const eligibility = getEligibility(c)
              return (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selected.includes(c.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelected([...selected, c.id])
                          } else {
                            setSelected(selected.filter(id => id !== c.id))
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{c.name}</p>
                        <p className="text-xs text-gray-600 truncate">{c.appliedForTitle}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs"><span className="font-medium">{c.highestDegree}</span> from {c.university}</p>
                          <p className="text-xs">CGPA: {c.cgpa.toFixed(2)} | Exp: {c.experienceYears}y</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {c.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${eligibility.color}`}>
                            {eligibility.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
