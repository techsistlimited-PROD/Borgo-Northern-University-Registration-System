import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Gift,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

// Mock waiver data - modified from real data
const waiverData = {
  waiverCode: 'STUDENT-WAIVER-00012345',
  waiverName: 'Merit Scholarship - Student ID: 20241601234',
  totalAllowedWaiver: 20,
  isActive: true,
  currentGPA: 3.85,
  minimumGPARequired: 3.50,
  semestersOnWaiver: 4,
  waiverType: 'Merit Based',
  effectiveFrom: 'Fall 2024',
  lastReviewDate: 'Spring 2025',
  nextReviewDate: 'Fall 2025'
}

const waiverHistory = [
  {
    semester: 'Fall 2024',
    gpa: 3.90,
    status: 'Active',
    waiverAmount: '20%',
    remarks: 'Excellent academic performance'
  },
  {
    semester: 'Spring 2025', 
    gpa: 3.85,
    status: 'Active',
    waiverAmount: '20%',
    remarks: 'Maintained required GPA'
  },
  {
    semester: 'Summer 2025',
    gpa: 3.80,
    status: 'Active', 
    waiverAmount: '20%',
    remarks: 'Above minimum threshold'
  }
]

export const WaiverInfo = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Waiver Information</h1>
      </div>

      {/* Waiver Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-6 h-6 text-deep-plum" />
            <span>Current Waiver Status</span>
          </CardTitle>
          <CardDescription>Your scholarship and waiver details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Waiver Code:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {waiverData.waiverCode}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Waiver Name:</span>
                <span className="text-sm">{waiverData.waiverName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Allowed Waiver:</span>
                <span className="text-lg font-bold text-deep-plum">{waiverData.totalAllowedWaiver}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Waiver Type:</span>
                <span>{waiverData.waiverType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Effective From:</span>
                <span>{waiverData.effectiveFrom}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Status:</span>
                <Badge className={waiverData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {waiverData.isActive ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mr-1" />
                  )}
                  {waiverData.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Current GPA:</span>
                <span className="text-lg font-bold text-green-600">{waiverData.currentGPA}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Minimum Required:</span>
                <span className="text-lg font-semibold">{waiverData.minimumGPARequired}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Semesters on Waiver:</span>
                <span>{waiverData.semestersOnWaiver}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Next Review:</span>
                <span>{waiverData.nextReviewDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waiver Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span>Waiver Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Important Notice:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You must maintain a minimum GPA of {waiverData.minimumGPARequired} to keep your waiver active</li>
              <li>• If your GPA falls below the minimum for two consecutive semesters, the waiver will become inactive</li>
              <li>• Waiver status is reviewed at the end of each semester</li>
              <li>• Contact the finance office if you have questions about your waiver</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* GPA Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>GPA Performance Tracking</CardTitle>
          <CardDescription>Your academic performance history with waiver status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {waiverHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="font-semibold text-deep-plum">{record.semester}</div>
                    <div className="text-sm text-gray-600">Semester</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{record.gpa}</div>
                    <div className="text-sm text-gray-600">GPA</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-deep-plum">{record.waiverAmount}</div>
                    <div className="text-sm text-gray-600">Waiver</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800 mb-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {record.status}
                  </Badge>
                  <div className="text-sm text-gray-600">{record.remarks}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>GPA Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current GPA vs Minimum Required</span>
              <span className="text-sm text-gray-600">
                {waiverData.currentGPA} / {waiverData.minimumGPARequired}
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full flex items-center justify-end pr-2"
                  style={{ 
                    width: `${Math.min((waiverData.currentGPA / 4.0) * 100, 100)}%` 
                  }}
                >
                  <span className="text-xs font-semibold text-white">
                    {waiverData.currentGPA}
                  </span>
                </div>
              </div>
              
              {/* Minimum threshold indicator */}
              <div 
                className="absolute top-0 h-4 w-1 bg-red-500"
                style={{ 
                  left: `${(waiverData.minimumGPARequired / 4.0) * 100}%` 
                }}
              >
                <div className="absolute -top-6 -left-4 text-xs text-red-600 font-semibold">
                  Min: {waiverData.minimumGPARequired}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              You are {(waiverData.currentGPA - waiverData.minimumGPARequired).toFixed(2)} points above the minimum requirement
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
