import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react'

// Mock semester schedule data - modified from real data
const semesterSchedules = [
  {
    semester: 'Summer 2025',
    status: 'Current',
    registrationStartDate: '20/04/2025',
    registrationEndDate: '30/04/2025',
    classStartDate: '05/06/2025',
    classEndDate: '10/09/2025',
    firstInstallmentDate: '20/06/2025',
    secondInstallmentDate: '20/07/2025',
    thirdInstallmentDate: '10/09/2025',
    semesterDropDate: '25/06/2025',
    addDropStartDate: '06/06/2025',
    addDropEndDate: '17/06/2025',
    midTermStartDate: '22/07/2025',
    midTermEndDate: '01/08/2025',
    finalExamStartDate: '12/09/2025',
    finalExamEndDate: '25/09/2025',
    terFillUpStartDate: '25/08/2025',
    terFillUpEndDate: '15/09/2025'
  },
  {
    semester: 'Spring 2025',
    status: 'Previous',
    registrationStartDate: '28/12/2024',
    registrationEndDate: '18/01/2025',
    classStartDate: '05/02/2025',
    classEndDate: '17/05/2025',
    firstInstallmentDate: '20/02/2025',
    secondInstallmentDate: '20/03/2025',
    thirdInstallmentDate: '17/05/2025',
    semesterDropDate: '25/02/2025',
    addDropStartDate: '05/02/2025',
    addDropEndDate: '12/02/2025',
    midTermStartDate: '15/03/2025',
    midTermEndDate: '26/03/2025',
    finalExamStartDate: '19/05/2025',
    finalExamEndDate: '29/05/2025',
    terFillUpStartDate: '10/04/2025',
    terFillUpEndDate: '12/05/2025'
  },
  {
    semester: 'Fall 2024',
    status: 'Admission Semester',
    registrationStartDate: '05/09/2024',
    registrationEndDate: '15/10/2024',
    classStartDate: '24/10/2024',
    classEndDate: '24/11/2024',
    firstInstallmentDate: '12/11/2024',
    secondInstallmentDate: '25/11/2024',
    thirdInstallmentDate: '12/01/2025',
    semesterDropDate: '05/11/2024',
    addDropStartDate: '26/10/2024',
    addDropEndDate: '02/11/2024',
    midTermStartDate: '25/11/2024',
    midTermEndDate: '07/12/2024',
    finalExamStartDate: '13/01/2025',
    finalExamEndDate: '26/01/2025',
    terFillUpStartDate: '19/12/2024',
    terFillUpEndDate: '15/01/2025'
  }
]

interface ScheduleItemProps {
  label: string
  date: string
  icon: React.ReactNode
  isImportant?: boolean
}

const ScheduleItem = ({ label, date, icon, isImportant = false }: ScheduleItemProps) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${isImportant ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
    <div className="flex items-center space-x-3">
      <div className={`${isImportant ? 'text-yellow-600' : 'text-gray-600'}`}>
        {icon}
      </div>
      <span className={`font-medium ${isImportant ? 'text-yellow-800' : 'text-gray-700'}`}>
        {label}
      </span>
    </div>
    <span className={`font-semibold ${isImportant ? 'text-yellow-800' : 'text-deep-plum'}`}>
      {date}
    </span>
  </div>
)

export const SemesterSchedule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Semester Schedule</h1>
        <Badge className="bg-blue-100 text-blue-800">
          <Calendar className="w-4 h-4 mr-1" />
          Academic Calendar
        </Badge>
      </div>

      <div className="grid gap-6">
        {semesterSchedules.map((schedule, index) => (
          <Card key={index} className={schedule.status === 'Current' ? 'border-2 border-deep-plum' : ''}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-deep-plum">{schedule.semester}</CardTitle>
                <Badge className={
                  schedule.status === 'Current' 
                    ? 'bg-green-100 text-green-800'
                    : schedule.status === 'Admission Semester'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }>
                  {schedule.status}
                </Badge>
              </div>
              {schedule.status === 'Current' && (
                <CardDescription className="text-green-600 font-medium">
                  This is your current active semester
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-deep-plum flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Registration & Classes
                  </h4>
                  
                  <ScheduleItem
                    label="Registration Start Date"
                    date={schedule.registrationStartDate}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Registration End Date"
                    date={schedule.registrationEndDate}
                    icon={<Calendar className="w-4 h-4" />}
                    isImportant={schedule.status === 'Current'}
                  />
                  
                  <ScheduleItem
                    label="Class Start Date"
                    date={schedule.classStartDate}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Class End Date"
                    date={schedule.classEndDate}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  
                  <h4 className="font-semibold text-deep-plum flex items-center mt-6">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payment Deadlines
                  </h4>
                  
                  <ScheduleItem
                    label="First Installment (40%)"
                    date={schedule.firstInstallmentDate}
                    icon={<DollarSign className="w-4 h-4" />}
                    isImportant={schedule.status === 'Current'}
                  />
                  
                  <ScheduleItem
                    label="Second Installment (30%)"
                    date={schedule.secondInstallmentDate}
                    icon={<DollarSign className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Third Installment (30%)"
                    date={schedule.thirdInstallmentDate}
                    icon={<DollarSign className="w-4 h-4" />}
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-deep-plum flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Important Deadlines
                  </h4>
                  
                  <ScheduleItem
                    label="Semester Drop Last Date"
                    date={schedule.semesterDropDate}
                    icon={<AlertCircle className="w-4 h-4" />}
                    isImportant={schedule.status === 'Current'}
                  />
                  
                  <ScheduleItem
                    label="Add/Drop Start Date"
                    date={schedule.addDropStartDate}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Add/Drop End Date"
                    date={schedule.addDropEndDate}
                    icon={<Calendar className="w-4 h-4" />}
                    isImportant={schedule.status === 'Current'}
                  />
                  
                  <h4 className="font-semibold text-deep-plum flex items-center mt-6">
                    <FileText className="w-4 h-4 mr-2" />
                    Examinations
                  </h4>
                  
                  <ScheduleItem
                    label="Mid Term Start Date"
                    date={schedule.midTermStartDate}
                    icon={<FileText className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Mid Term End Date"
                    date={schedule.midTermEndDate}
                    icon={<FileText className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Final Exam Start Date"
                    date={schedule.finalExamStartDate}
                    icon={<FileText className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="Final Exam End Date"
                    date={schedule.finalExamEndDate}
                    icon={<FileText className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="TER Fill Up Start Date"
                    date={schedule.terFillUpStartDate}
                    icon={<FileText className="w-4 h-4" />}
                  />
                  
                  <ScheduleItem
                    label="TER Fill Up End Date"
                    date={schedule.terFillUpEndDate}
                    icon={<FileText className="w-4 h-4" />}
                    isImportant={schedule.status === 'Current'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All dates are subject to change. Please check for updates regularly</li>
                <li>• Payment deadlines are strictly enforced. Late payments may incur penalties</li>
                <li>• Add/Drop period allows you to modify your course registration</li>
                <li>• TER (Teacher Evaluation Report) submission is mandatory for all courses</li>
                <li>• Contact the academic office for any schedule-related queries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
