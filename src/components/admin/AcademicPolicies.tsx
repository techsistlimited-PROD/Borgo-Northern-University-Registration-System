import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, FileText } from 'lucide-react'

interface Policy {
  category: string
  policies: { key: string; label: string; value: string; type: 'text' | 'number' | 'select'; options?: string[] }[]
}

export default function AcademicPolicies() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      category: 'Grading System',
      policies: [
        { key: 'passingGrade', label: 'Minimum Passing Grade', value: 'D', type: 'select', options: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'] },
        { key: 'gradingScale', label: 'Grading Scale', value: '4.0', type: 'select', options: ['4.0', '5.0', '10.0'] },
        { key: 'retakePolicy', label: 'Retake Policy', value: 'Maximum 2 retakes per course', type: 'text' }
      ]
    },
    {
      category: 'Attendance Requirements',
      policies: [
        { key: 'minAttendance', label: 'Minimum Attendance %', value: '75', type: 'number' },
        { key: 'examEligibility', label: 'Exam Eligibility Attendance %', value: '70', type: 'number' },
        { key: 'attendanceGraceDay', label: 'Grace Days for Medical', value: '3', type: 'number' }
      ]
    },
    {
      category: 'Course Registration',
      policies: [
        { key: 'minCredit', label: 'Minimum Credit per Semester', value: '9', type: 'number' },
        { key: 'maxCredit', label: 'Maximum Credit per Semester', value: '18', type: 'number' },
        { key: 'addDropDuration', label: 'Add/Drop Period (days)', value: '7', type: 'number' },
        { key: 'lateRegFine', label: 'Late Registration Fine (BDT)', value: '1000', type: 'number' }
      ]
    },
    {
      category: 'Academic Probation',
      policies: [
        { key: 'probationCGPA', label: 'Probation CGPA Threshold', value: '2.0', type: 'number' },
        { key: 'warningCGPA', label: 'Warning CGPA Threshold', value: '2.5', type: 'number' },
        { key: 'probationDuration', label: 'Probation Period (semesters)', value: '2', type: 'number' }
      ]
    },
    {
      category: 'Degree Requirements',
      policies: [
        { key: 'minCGPA', label: 'Minimum CGPA for Graduation', value: '2.5', type: 'number' },
        { key: 'residencyRule', label: 'Minimum Residency (semesters)', value: '6', type: 'number' },
        { key: 'maxStudyDuration', label: 'Maximum Study Period (years)', value: '7', type: 'number' }
      ]
    }
  ])

  const handlePolicyChange = (categoryIndex: number, policyIndex: number, value: string) => {
    const newPolicies = [...policies]
    newPolicies[categoryIndex].policies[policyIndex].value = value
    setPolicies(newPolicies)
  }

  const handleSave = () => {
    alert('Academic policies saved successfully!')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Academic Policies</h1>
          <p className="text-gray-600 text-sm mt-1">Configure institutional academic policies and rules</p>
        </div>
        <Button onClick={handleSave} className="bg-deep-plum hover:bg-deep-plum/90">
          <Save className="w-4 h-4 mr-2" />
          Save All Policies
        </Button>
      </div>

      <div className="space-y-4">
        {policies.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="p-6">
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
              <FileText className="w-5 h-5 text-deep-plum" />
              <h3 className="font-semibold text-lg text-deep-plum">{category.category}</h3>
              <Badge>{category.policies.length} policies</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.policies.map((policy, policyIndex) => (
                <div key={policy.key}>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {policy.label}
                  </label>
                  {policy.type === 'text' && (
                    <Input
                      value={policy.value}
                      onChange={(e) => handlePolicyChange(categoryIndex, policyIndex, e.target.value)}
                    />
                  )}
                  {policy.type === 'number' && (
                    <Input
                      type="number"
                      value={policy.value}
                      onChange={(e) => handlePolicyChange(categoryIndex, policyIndex, e.target.value)}
                    />
                  )}
                  {policy.type === 'select' && (
                    <select
                      value={policy.value}
                      onChange={(e) => handlePolicyChange(categoryIndex, policyIndex, e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {policy.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
