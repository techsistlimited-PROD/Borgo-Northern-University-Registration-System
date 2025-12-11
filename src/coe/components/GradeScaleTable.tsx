import { GradeScale } from '@/coe/data/types'

interface GradeScaleTableProps {
  gradeScale: GradeScale[]
  passingGrade?: string
}

export default function GradeScaleTable({ gradeScale, passingGrade = 'D' }: GradeScaleTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-deep-plum to-accent-purple text-white">
              <th className="p-3 text-left text-sm font-semibold">Letter Grade</th>
              <th className="p-3 text-left text-sm font-semibold">Grade Point</th>
              <th className="p-3 text-left text-sm font-semibold">Numerical Score</th>
              <th className="p-3 text-left text-sm font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {gradeScale.map((grade, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  grade.letterGrade === passingGrade ? 'bg-blue-50' : ''
                }`}
              >
                <td className="p-3">
                  <span className="font-bold text-deep-plum text-lg">{grade.letterGrade}</span>
                </td>
                <td className="p-3">
                  <span className="font-semibold text-gray-700">{grade.gradePoint.toFixed(2)}</span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-600">
                    {grade.minMarks} – {grade.maxMarks}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-600">{grade.description}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Minimum passing grade:</span>{' '}
          <span className="font-bold">{passingGrade}</span> (
          {gradeScale.find(g => g.letterGrade === passingGrade)?.gradePoint.toFixed(2)} GPA)
        </p>
      </div>
    </div>
  )
}
