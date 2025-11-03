import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Users } from 'lucide-react'

interface UserTask {
  taskName: string
  module: string
  users: { id: string; name: string; role: string; email: string }[]
}

export default function UserListByTask() {
  const [tasks] = useState<UserTask[]>([
    {
      taskName: 'Publish Exam Results',
      module: 'Exam Management',
      users: [
        { id: 'coe001', name: 'Md. Arif Hossain', role: 'Controller of Examinations', email: 'coe@nub.ac' },
        { id: 'coe002', name: 'Rafiq Ahmed', role: 'Deputy Controller', email: 'dcoe@nub.ac' }
      ]
    },
    {
      taskName: 'Collect Payments',
      module: 'Finance',
      users: [
        { id: 'fin001', name: 'Mahfuz Rahman', role: 'Finance Officer', email: 'finance@nub.ac' },
        { id: 'fin002', name: 'Sharmin Akter', role: 'Cashier', email: 'cashier@nub.ac' },
        { id: 'fin003', name: 'Kamal Uddin', role: 'Accounts Assistant', email: 'accounts@nub.ac' }
      ]
    },
    {
      taskName: 'Create Programs',
      module: 'Academic Setup',
      users: [
        { id: 'admin001', name: 'Md. Imran Hossain', role: 'System Administrator', email: 'admin@nub.ac' }
      ]
    },
    {
      taskName: 'Approve Student Clearance',
      module: 'Student Services',
      users: [
        { id: 'acad001', name: 'Dr. Tanvir Hasan', role: 'Academic Coordinator', email: 'acad@nub.ac' },
        { id: 'lib001', name: 'Nasrin Akter', role: 'Librarian', email: 'library@nub.ac' },
        { id: 'fin001', name: 'Mahfuz Rahman', role: 'Finance Officer', email: 'finance@nub.ac' }
      ]
    },
    {
      taskName: 'Generate Admit Cards',
      module: 'Exam Management',
      users: [
        { id: 'coe001', name: 'Md. Arif Hossain', role: 'Controller of Examinations', email: 'coe@nub.ac' }
      ]
    }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterModule, setFilterModule] = useState('All')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.users.some(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesModule = filterModule === 'All' || task.module === filterModule
    return matchesSearch && matchesModule
  })

  const modules = [...new Set(tasks.map(t => t.module))]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">User List by Task</h1>
          <p className="text-gray-600 text-sm mt-1">View which users can perform specific tasks</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by task or user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredTasks.map((task, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div>
                <h3 className="font-semibold text-lg text-deep-plum">{task.taskName}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.module}</p>
              </div>
              <Badge>{task.users.length} users</Badge>
            </div>

            <div className="space-y-3">
              {task.users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-deep-plum rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tasks found</p>
          </div>
        </Card>
      )}
    </div>
  )
}
