import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  GraduationCap,
  CheckCircle,
  Award
} from 'lucide-react'

// Mock academic transcript data
const academicTranscript = {
  totalCredit: 31.0,
  cgpa: 2.871,
  courses: [
    { serial: 1, courseCode: 'CSE 1101', courseTitle: 'Introduction to Computers', creditHour: 2.0, gradeLetter: 'A', gradePoint: 3.75, tgp: 7.5 },
    { serial: 2, courseCode: 'CSE 1102', courseTitle: 'Structured Programming Language', creditHour: 3.0, gradeLetter: 'B-', gradePoint: 2.75, tgp: 8.25 },
    { serial: 3, courseCode: 'CSE 1157', courseTitle: 'Structured Programming Language Lab Work', creditHour: 1.0, gradeLetter: 'A-', gradePoint: 3.5, tgp: 3.5 },
    { serial: 4, courseCode: 'CSE 1258', courseTitle: 'Discrete Mathematics', creditHour: 3.0, gradeLetter: 'C', gradePoint: 2.25, tgp: 6.75 },
    { serial: 5, courseCode: 'CSE 1307', courseTitle: 'Object-Oriented Programming-I (C++)', creditHour: 3.0, gradeLetter: 'B', gradePoint: 3.0, tgp: 9.0 },
    { serial: 6, courseCode: 'CSE 1360', courseTitle: 'Object-Oriented Programming-I Lab Work', creditHour: 1.0, gradeLetter: 'A', gradePoint: 3.75, tgp: 3.75 },
    { serial: 7, courseCode: 'CSE 2111', courseTitle: 'Data Structure', creditHour: 3.0, gradeLetter: 'C', gradePoint: 2.25, tgp: 6.75 },
    { serial: 8, courseCode: 'CSE 2162', courseTitle: 'Data Structure Lab Work', creditHour: 1.0, gradeLetter: 'B+', gradePoint: 3.25, tgp: 3.25 },
    { serial: 9, courseCode: 'ENG 1100', courseTitle: 'English Language-I : Sentence and their Elements', creditHour: 0.0, gradeLetter: 'B', gradePoint: 3.0, tgp: 0.0 },
    { serial: 10, courseCode: 'ENG 1102', courseTitle: 'English Language-II : Listening and Speaking', creditHour: 3.0, gradeLetter: 'B-', gradePoint: 2.75, tgp: 8.25 },
    { serial: 11, courseCode: 'ENG 1203', courseTitle: 'English Language-III : Reading and Writing', creditHour: 3.0, gradeLetter: 'B+', gradePoint: 3.25, tgp: 9.75 },
    { serial: 12, courseCode: 'GED 1202', courseTitle: 'Emergence of Bangladesh', creditHour: 3.0, gradeLetter: 'B+', gradePoint: 3.25, tgp: 9.75 },
    { serial: 13, courseCode: 'MATH 1101', courseTitle: 'Mathematics-I (Differential Calculus and Integral Calculus)', creditHour: 3.0, gradeLetter: 'C+', gradePoint: 2.5, tgp: 7.5 },
    { serial: 14, courseCode: 'MATH 1302', courseTitle: 'Mathematics-II (Differential Equation & Fourier Analysis)', creditHour: 2.0, gradeLetter: 'C+', gradePoint: 2.5, tgp: 5.0 }
  ]
}

// Mock semester-wise transcript data
const semesterWiseTranscript = [
  {
    semester: 'Fall 2024',
    cgpa: 3.375,
    courses: [
      { courseCode: 'CSE 1101', courseName: 'Introduction to Computers', credit: 2.0, grade: 'A', gp: 3.75, tgp: 7.5, isFinal: 'Yes' },
      { courseCode: 'ENG 1100', courseName: 'English Language-I : Sentence and their Elements', credit: 0.0, grade: 'B', gp: 3.0, tgp: 0.0, isFinal: 'Yes' },
      { courseCode: 'ENG 1203', courseName: 'English Language-III : Reading and Writing', credit: 3.0, grade: 'B+', gp: 3.25, tgp: 9.75, isFinal: 'Yes' },
      { courseCode: 'GED 1202', courseName: 'Emergence of Bangladesh', credit: 3.0, grade: 'B+', gp: 3.25, tgp: 9.75, isFinal: 'Yes' }
    ],
    totalCredit: 8.0,
    totalTGP: 27.0
  },
  {
    semester: 'Spring 2025',
    cgpa: 2.917,
    courses: [
      { courseCode: 'CSE 1102', courseName: 'Structured Programming Language', credit: 3.0, grade: 'B-', gp: 2.75, tgp: 8.25, isFinal: 'Yes' },
      { courseCode: 'CSE 1157', courseName: 'Structured Programming Language Lab Work', credit: 1.0, grade: 'A-', gp: 3.5, tgp: 3.5, isFinal: 'Yes' },
      { courseCode: 'CSE 1258', courseName: 'Discrete Mathematics', credit: 3.0, grade: 'C', gp: 2.25, tgp: 6.75, isFinal: 'Yes' },
      { courseCode: 'ENG 1102', courseName: 'English Language-II : Listening and Speaking', credit: 3.0, grade: 'B-', gp: 2.75, tgp: 8.25, isFinal: 'Yes' },
      { courseCode: 'MATH 1101', courseName: 'Mathematics-I (Differential Calculus and Integral Calculus)', credit: 3.0, grade: 'C+', gp: 2.5, tgp: 7.5, isFinal: 'Yes' }
    ],
    totalCredit: 13.0,
    totalTGP: 34.25
  },
  {
    semester: 'Summer 2025',
    cgpa: 2.871,
    courses: [
      { courseCode: 'CSE 1307', courseName: 'Object-Oriented Programming-I (C++)', credit: 3.0, grade: 'B', gp: 3.0, tgp: 9.0, isFinal: 'Yes' },
      { courseCode: 'CSE 1360', courseName: 'Object-Oriented Programming-I Lab Work', credit: 1.0, grade: 'A', gp: 3.75, tgp: 3.75, isFinal: 'Yes' },
      { courseCode: 'CSE 2111', courseName: 'Data Structure', credit: 3.0, grade: 'C', gp: 2.25, tgp: 6.75, isFinal: 'Yes' },
      { courseCode: 'CSE 2162', courseName: 'Data Structure Lab Work', credit: 1.0, grade: 'B+', gp: 3.25, tgp: 3.25, isFinal: 'Yes' },
      { courseCode: 'MATH 1302', courseName: 'Mathematics-II (Differential Equation & Fourier Analysis)', credit: 2.0, grade: 'C+', gp: 2.5, tgp: 5.0, isFinal: 'Yes' }
    ],
    totalCredit: 10.0,
    totalTGP: 27.75
  }
]

export const ExamResults = () => {
  const [selectedResultSemester, setSelectedResultSemester] = useState('')

  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']

  const getSelectedSemesterResult = () => {
    if (!selectedResultSemester) return null
    
    if (selectedResultSemester === 'Fall 2024') {
      return {
        semester: 'Fall 2024',
        cgpa: 3.375,
        courses: [
          { courseCode: 'CSE 1101', courseName: 'Introduction to Computers', credit: 2.0, grade: 'A', gp: 3.75, tgp: 7.5, isFinal: 'Yes' },
          { courseCode: 'ENG 1100', courseName: 'English Language-I : Sentence and their Elements', credit: 0.0, grade: 'B', gp: 3.0, tgp: 0.0, isFinal: 'Yes' },
          { courseCode: 'GED 1202', courseName: 'Emergence of Bangladesh', credit: 3.0, grade: 'B+', gp: 3.25, tgp: 9.75, isFinal: 'Yes' },
          { courseCode: 'ENG 1203', courseName: 'English Language-III : Reading and Writing', credit: 3.0, grade: 'B+', gp: 3.25, tgp: 9.75, isFinal: 'Yes' }
        ],
        totalCredit: 8.0,
        totalTGP: 27.0
      }
    }
    
    return semesterWiseTranscript.find(s => s.semester === selectedResultSemester)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep-plum">Academic Results</h1>
        <Badge className="bg-purple-100 text-purple-800">
          <GraduationCap className="w-4 h-4 mr-1" />
          Academic Records
        </Badge>
      </div>

      <Tabs defaultValue="academic-transcript" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic-transcript">Academic Transcript</TabsTrigger>
          <TabsTrigger value="semester-wise-transcript">Semester-wise Transcript</TabsTrigger>
          <TabsTrigger value="semester-wise-result">Semester-wise Result</TabsTrigger>
        </TabsList>

        {/* Academic Transcript */}
        <TabsContent value="academic-transcript">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-deep-plum" />
                <span>Academic Transcript</span>
              </CardTitle>
              <CardDescription>Complete academic record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Credit Hour</TableHead>
                      <TableHead>Grade Letter</TableHead>
                      <TableHead>Grade Point</TableHead>
                      <TableHead>TGP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicTranscript.courses.map((course) => (
                      <TableRow key={course.serial}>
                        <TableCell>{course.serial}</TableCell>
                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                        <TableCell>{course.courseTitle}</TableCell>
                        <TableCell>{course.creditHour}</TableCell>
                        <TableCell>
                          <Badge className={
                            course.gradeLetter.startsWith('A') ? 'bg-green-100 text-green-800' :
                            course.gradeLetter.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            course.gradeLetter.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {course.gradeLetter}
                          </Badge>
                        </TableCell>
                        <TableCell>{course.gradePoint}</TableCell>
                        <TableCell>{course.tgp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 p-4 bg-deep-plum text-white rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{academicTranscript.totalCredit}</div>
                    <div className="text-sm opacity-90">Total Credit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{academicTranscript.cgpa}</div>
                    <div className="text-sm opacity-90">Your CGPA</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Semester-wise Transcript */}
        <TabsContent value="semester-wise-transcript">
          <div className="space-y-6">
            {semesterWiseTranscript.map((semester, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{semester.semester}</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      CGPA: {semester.cgpa}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credit</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>GP</TableHead>
                        <TableHead>TGP</TableHead>
                        <TableHead>Is Final</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semester.courses.map((course, courseIndex) => (
                        <TableRow key={courseIndex}>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>{course.credit}</TableCell>
                          <TableCell>
                            <Badge className={
                              course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                              course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                              course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {course.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.gp}</TableCell>
                          <TableCell>{course.tgp}</TableCell>
                          <TableCell>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 pt-4 border-t text-right">
                    <span className="font-semibold">Total: {semester.totalCredit} credits, TGP: {semester.totalTGP}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Semester-wise Result */}
        <TabsContent value="semester-wise-result">
          <Card>
            <CardHeader>
              <CardTitle>Semester-wise Result</CardTitle>
              <CardDescription>Select a semester to view detailed results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="resultSemester">Select Semester</Label>
                <Select value={selectedResultSemester} onValueChange={setSelectedResultSemester}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose semester to view results" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.slice(0, 3).map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedResultSemester && (() => {
                const semesterResult = getSelectedSemesterResult()
                if (!semesterResult) return null

                return (
                  <div>
                    <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-purple-800">
                          Semester: {semesterResult.semester}
                        </span>
                        <span className="font-bold text-purple-800">
                          Semester GPA: {semesterResult.cgpa}
                        </span>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Course Title</TableHead>
                          <TableHead>Credit Hour</TableHead>
                          <TableHead>Letter Grade</TableHead>
                          <TableHead>Grade Point</TableHead>
                          <TableHead>TGP</TableHead>
                          <TableHead>Is Final</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semesterResult.courses.map((course, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{course.courseCode}</TableCell>
                            <TableCell>{course.courseName}</TableCell>
                            <TableCell>{course.credit}</TableCell>
                            <TableCell>
                              <Badge className={
                                course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                                course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {course.grade}
                              </Badge>
                            </TableCell>
                            <TableCell>{course.gp}</TableCell>
                            <TableCell>{course.tgp}</TableCell>
                            <TableCell>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-4 pt-4 border-t text-right">
                      <span className="font-semibold">
                        Total: {semesterResult.totalCredit} credits, TGP: {semesterResult.totalTGP}
                      </span>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
