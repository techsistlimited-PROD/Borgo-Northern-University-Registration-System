import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TRAINING_EVALUATIONS } from '@/lib/hrmDemoSeed'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PostTrainingEvaluation() {
  const [selectedDept, setSelectedDept] = useState('all')

  const chartData = [
    { training: 'Advanced Excel', rating: 4.5 },
    { training: 'Research Method...', rating: 5 },
    { training: 'Digital Marketing', rating: 4 },
    { training: 'Python Analytics', rating: 5 }
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Post-Training Evaluation</h2>

      <Card>
        <CardHeader>
          <CardTitle>Average Ratings by Training</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="training" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#3b82f6" name="Avg Rating" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluations ({TRAINING_EVALUATIONS.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Employee</th>
                <th className="px-3 py-2 text-left">Rating</th>
                <th className="px-3 py-2 text-left">Feedback</th>
                <th className="px-3 py-2 text-left">Improvement</th>
                <th className="px-3 py-2 text-left">Follow-Up</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {TRAINING_EVALUATIONS.map(eval => (
                <tr key={eval.id}>
                  <td className="px-3 py-2 font-medium">{eval.empName}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < eval.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                      <span className="ml-1">{eval.rating}.0</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{eval.feedback}</td>
                  <td className="px-3 py-2">{eval.improvementObserved}</td>
                  <td className="px-3 py-2">{eval.followUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
