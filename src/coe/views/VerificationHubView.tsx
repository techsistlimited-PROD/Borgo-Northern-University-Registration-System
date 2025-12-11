import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { VerificationProfile, VERIFICATION_PROFILES } from '../data/verification'
import { downloadVerificationCsv } from '../utils/verification'
import VerificationSearchBar from '../components/VerificationSearchBar'
import VerificationResultCard from '../components/VerificationResultCard'
import VerificationPreviewDrawer from '../components/VerificationPreviewDrawer'

export default function VerificationHubView() {
  const [profiles, setProfiles] = useState<VerificationProfile[]>(VERIFICATION_PROFILES)
  const [selectedProfile, setSelectedProfile] = useState<VerificationProfile | null>(null)
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    program: 'all',
    status: 'all'
  })

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      if (filters.program !== 'all' && p.program !== filters.program) return false
      if (filters.status !== 'all' && p.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          p.studentId.toLowerCase().includes(searchLower) ||
          p.token.toLowerCase().includes(searchLower) ||
          p.name.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [profiles, filters])

  const handleVerify = (profileId: string, remarks: string) => {
    setProfiles(profiles.map(p =>
      p.id === profileId
        ? {
            ...p,
            status: 'Verified' as const,
            remarks,
            verifiedBy: 'COE Office',
            verifiedDate: new Date().toISOString().split('T')[0],
            history: [
              ...p.history,
              {
                action: 'Verified',
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks
              }
            ]
          }
        : p
    ))
    setShowPreviewDrawer(false)
  }

  const handleReject = (profileId: string, reason: string) => {
    setProfiles(profiles.map(p =>
      p.id === profileId
        ? {
            ...p,
            status: 'Rejected' as const,
            remarks: reason,
            verifiedBy: 'COE Office',
            verifiedDate: new Date().toISOString().split('T')[0],
            history: [
              ...p.history,
              {
                action: 'Rejected',
                by: 'COE Office',
                date: new Date().toISOString(),
                remarks: reason
              }
            ]
          }
        : p
    ))
    setShowPreviewDrawer(false)
  }

  const handlePrint = (profile: VerificationProfile) => {
    window.print()
  }

  const handlePreview = (profile: VerificationProfile) => {
    setSelectedProfile(profile)
    setShowPreviewDrawer(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Verification Hub</h1>
          <p className="text-gray-600 mt-1">
            Student and degree verification management
          </p>
        </div>
        <Button variant="outline" onClick={() => downloadVerificationCsv(profiles)}>
          <Download className="w-4 h-4 mr-2" />
          Export Records
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationSearchBar
            searchQuery={filters.search}
            onSearchChange={(v) => setFilters({ ...filters, search: v })}
            programFilter={filters.program}
            onProgramChange={(v) => setFilters({ ...filters, program: v })}
            statusFilter={filters.status}
            onStatusChange={(v) => setFilters({ ...filters, status: v })}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-deep-plum">
          Verification Records
        </h2>
        <div className="text-sm text-gray-500">
          {filteredProfiles.length} record{filteredProfiles.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No verification records found
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <VerificationResultCard
              key={profile.id}
              profile={profile}
              onPreview={handlePreview}
            />
          ))
        )}
      </div>

      <VerificationPreviewDrawer
        open={showPreviewDrawer}
        onClose={() => setShowPreviewDrawer(false)}
        profile={selectedProfile}
        onVerify={handleVerify}
        onReject={handleReject}
        onPrint={handlePrint}
      />
    </div>
  )
}
