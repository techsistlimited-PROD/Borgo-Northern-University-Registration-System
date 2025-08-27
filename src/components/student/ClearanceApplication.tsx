import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  FileText,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  GraduationCap
} from 'lucide-react'

// Mock clearance application data
const mockApplicationHistory = [
  {
    id: 'APP001',
    type: 'exam',
    semester: 'Fall 2024',
    examType: 'Mid Term',
    appliedDate: '2024-09-15',
    status: 'approved',
    approvedDate: '2024-09-16',
    comments: 'All requirements met. Approved for midterm examination.'
  },
  {
    id: 'APP002', 
    type: 'exam',
    semester: 'Fall 2024',
    examType: 'Final',
    appliedDate: '2024-09-20',
    status: 'pending',
    approvedDate: null,
    comments: null
  },
  {
    id: 'APP003',
    type: 'final',
    semester: null,
    examType: null,
    appliedDate: '2024-09-18',
    status: 'pending',
    approvedDate: null,
    comments: null
  }
]

const currentSemesterInfo = {
  semester: 'Fall 2024',
  examDates: {
    midterm: '2024-10-15',
    final: '2024-12-20'
  }
}

interface ClearanceApplicationProps {
  activeTab?: string
}

export const ClearanceApplication = ({ activeTab = 'exam-clearance' }: ClearanceApplicationProps) => {
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedExamType, setSelectedExamType] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const semesters = ['Fall 2024', 'Spring 2025']
  const examTypes = ['Mid Term', 'Final']

  const handleSubmitExamClearance = () => {
    if (!selectedSemester || !selectedExamType) {
      alert('Please select both semester and exam type.')
      return
    }

    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      alert(`✅ EXAM CLEARANCE APPLICATION SUBMITTED\n\nSemester: ${selectedSemester}\nExam Type: ${selectedExamType}\n\nStatus: Pending Review\n\nYour application has been submitted to the admin for review. You will be notified once approved.`)
      setSubmitting(false)
      setSelectedSemester('')
      setSelectedExamType('')
    }, 2000)
  }

  const handleSubmitFinalClearance = () => {
    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      alert(`✅ FINAL CLEARANCE APPLICATION SUBMITTED\n\nType: Final Clearance for Certificates\n\nStatus: Pending Review\n\nYour application has been submitted for final degree clearance. The admin will review your academic, financial, and other clearance requirements before approval.`)
      setSubmitting(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Clearance Applications</h1>
        <Badge className="bg-purple-100 text-purple-800">
          <FileText className="w-4 h-4 mr-1" />
          Application Portal
        </Badge>
      </div>

      <Tabs value={activeTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exam-clearance">Clearance for Exams</TabsTrigger>
          <TabsTrigger value="final-clearance">Final Clearance for Certificates</TabsTrigger>
        </TabsList>

        {/* Exam Clearance Tab */}
        <TabsContent value="exam-clearance">
          <div className="space-y-6">
            {/* Apply for Exam Clearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-deep-plum" />
                  <span>Apply for Exam Clearance</span>
                </CardTitle>
                <CardDescription>
                  Submit application for exam clearance (Mid Term / Final)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Select Semester</Label>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="examType">Exam Type</Label>
                    <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSubmitExamClearance}
                      className="nu-button-primary w-full"
                      disabled={!selectedSemester || !selectedExamType || submitting}
                    >
                      {submitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Clearance Requirements:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• All semester dues must be cleared</li>
                        <li>• Library clearance is required</li>
                        <li>• Must be registered for the semester</li>
                        <li>• TER submission must be completed</li>
                        <li>• No disciplinary issues pending</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Upcoming Exam Dates */}
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Upcoming Exam Dates - {currentSemesterInfo.semester}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">
                        <strong>Mid Term:</strong> {currentSemesterInfo.examDates.midterm}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">
                        <strong>Final:</strong> {currentSemesterInfo.examDates.final}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Clearance History */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Clearance History</CardTitle>
                <CardDescription>Your previous exam clearance applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApplicationHistory
                      .filter(app => app.type === 'exam')
                      .map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.id}</TableCell>
                          <TableCell>{application.semester}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{application.examType}</Badge>
                          </TableCell>
                          <TableCell>{application.appliedDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(application.status)}
                              <Badge className={getStatusColor(application.status)}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{application.approvedDate || '-'}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Final Clearance Tab */}
        <TabsContent value="final-clearance">
          <div className="space-y-6">
            {/* Apply for Final Clearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-deep-plum" />
                  <span>Apply for Final Clearance for Certificates</span>
                </CardTitle>
                <CardDescription>
                  Submit application for final degree clearance and certificate issuance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <Button 
                      onClick={handleSubmitFinalClearance}
                      className="nu-button-primary px-8 py-3"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Final Clearance Application
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <GraduationCap className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-2">Final Clearance Requirements:</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• All required credits completed (152 out of 152)</li>
                          <li>• All financial obligations cleared</li>
                          <li>• Library clearance with no outstanding books or fines</li>
                          <li>• Lab clearance with all equipment returned</li>
                          <li>• Student welfare clearance for conduct and behavior</li>
                          <li>• No pending disciplinary actions</li>
                          <li>• Thesis/project submission completed (if applicable)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">Automatic Eligibility Check:</h4>
                        <p className="text-sm text-green-700">
                          The system will automatically verify your eligibility based on credit completion, 
                          financial status, and clearance from various departments. Manual review will be 
                          conducted by admin for final approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Clearance History */}
            <Card>
              <CardHeader>
                <CardTitle>Final Clearance Applications</CardTitle>
                <CardDescription>Your final degree clearance applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Application Type</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApplicationHistory
                      .filter(app => app.type === 'final')
                      .map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.id}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-800">
                              Final Clearance for Certificates
                            </Badge>
                          </TableCell>
                          <TableCell>{application.appliedDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(application.status)}
                              <Badge className={getStatusColor(application.status)}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={application.comments || 'No comments'}>
                              {application.comments || 'Under review'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {mockApplicationHistory.filter(app => app.type === 'final').length === 0 && (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500">
                      You haven't submitted any final clearance applications yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
