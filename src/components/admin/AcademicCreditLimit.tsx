import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, GraduationCap } from 'lucide-react'
import { PROGRAMS } from '@/lib/seedData'

interface CreditLimit {
  program: string
  programName: string
  minCredit: number
  maxCredit: number
  overloadCredit: number
  overloadCGPA: number
  underloadCredit: number
  underloadReason: string
}

export default function AcademicCreditLimit() {
  const [limits, setLimits] = useState<CreditLimit[]>(
    PROGRAMS.map(p => ({
      program: p.code,
      programName: p.name,
      minCredit: p.durationUnit === 'Trimester' ? 9 : 12,
      maxCredit: p.durationUnit === 'Trimester' ? 18 : 21,
      overloadCredit: p.durationUnit === 'Trimester' ? 21 : 24,
      overloadCGPA: 3.5,
      underloadCredit: p.durationUnit === 'Trimester' ? 6 : 9,
      underloadReason: 'Medical/Special circumstances'
    }))
  )

  const handleUpdate = (program: string, field: keyof CreditLimit, value: number | string) => {
    setLimits(limits.map(limit => 
      limit.program === program 
        ? { ...limit, [field]: value }
        : limit
    ))
  }

  const handleSave = () => {
    alert('Credit limits saved successfully!')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Academic Credit Limit</h1>
          <p className="text-gray-600 text-sm mt-1">Configure credit hour limits for each program</p>
        </div>
        <Button onClick={handleSave} className="bg-deep-plum hover:bg-deep-plum/90">
          <Save className="w-4 h-4 mr-2" />
          Save All Limits
        </Button>
      </div>

      <div className="space-y-4">
        {limits.map((limit) => (
          <Card key={limit.program} className="p-6">
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
              <GraduationCap className="w-5 h-5 text-deep-plum" />
              <div>
                <h3 className="font-semibold text-deep-plum">{limit.program}</h3>
                <p className="text-xs text-gray-500">{limit.programName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Normal Load</h4>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Minimum Credits</label>
                  <Input
                    type="number"
                    value={limit.minCredit}
                    onChange={(e) => handleUpdate(limit.program, 'minCredit', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Maximum Credits</label>
                  <Input
                    type="number"
                    value={limit.maxCredit}
                    onChange={(e) => handleUpdate(limit.program, 'maxCredit', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div className="p-3 bg-mint-green/10 rounded-md">
                  <p className="text-xs text-gray-600">Normal Range:</p>
                  <p className="font-semibold text-sm">{limit.minCredit} - {limit.maxCredit} credits</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Overload Policy</h4>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Overload Credits</label>
                  <Input
                    type="number"
                    value={limit.overloadCredit}
                    onChange={(e) => handleUpdate(limit.program, 'overloadCredit', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Minimum CGPA for Overload</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={limit.overloadCGPA}
                    onChange={(e) => handleUpdate(limit.program, 'overloadCGPA', parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-gray-600">Overload Allowed:</p>
                  <p className="font-semibold text-sm">Up to {limit.overloadCredit} credits</p>
                  <p className="text-xs text-gray-500 mt-1">If CGPA ≥ {limit.overloadCGPA}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Underload Policy</h4>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Underload Credits</label>
                  <Input
                    type="number"
                    value={limit.underloadCredit}
                    onChange={(e) => handleUpdate(limit.program, 'underloadCredit', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Underload Reason</label>
                  <Input
                    value={limit.underloadReason}
                    onChange={(e) => handleUpdate(limit.program, 'underloadReason', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="p-3 bg-yellow-50 rounded-md">
                  <p className="text-xs text-gray-600">Underload Allowed:</p>
                  <p className="font-semibold text-sm">Down to {limit.underloadCredit} credits</p>
                  <p className="text-xs text-gray-500 mt-1">With approval</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Min: {limit.minCredit}</Badge>
                <Badge variant="outline">Max: {limit.maxCredit}</Badge>
                <Badge variant="secondary">Overload: {limit.overloadCredit}</Badge>
                <Badge variant="secondary">Underload: {limit.underloadCredit}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-sm mb-3 text-blue-900">Important Notes</h4>
        <div className="space-y-2 text-xs text-blue-800">
          <p>• Students must register for credits within the minimum and maximum range each semester</p>
          <p>• Overload requires maintaining the specified CGPA threshold and advisor approval</p>
          <p>• Underload is only permitted with valid reasons (medical, personal emergency, etc.)</p>
          <p>• Final semester students may be exempted from minimum credit requirements</p>
          <p>• Credit limits are enforced during online course registration</p>
        </div>
      </Card>
    </div>
  )
}
