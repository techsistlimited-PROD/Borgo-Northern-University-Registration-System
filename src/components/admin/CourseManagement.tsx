import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react'
import { COURSES, PROGRAMS } from '@/lib/seedData'

interface Course {
  code: string
  title: string
  credit: number
  type: string
  program: string
  prereq: string | null
  group?: string
}

interface CourseGroup {
  id: string
  name: string
  program: string
  description: string
  courses: string[]
}

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState<'courses' | 'groups'>('courses')
  const [courses, setCourses] = useState<Course[]>([...COURSES])
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([
    { id: '1', name: 'Core CSE Courses', program: 'CSE', description: 'Mandatory core courses for CSE program', courses: ['CSE1101', 'CSE2205'] },
    { id: '2', name: 'BBA Major Courses', program: 'BBA', description: 'Major courses for BBA program', courses: ['BUS1302'] },
    { id: '3', name: 'Law Foundation', program: 'LLB', description: 'Foundation courses for Law program', courses: ['LAW2107'] }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProgram, setFilterProgram] = useState('All')
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false)
  const [showEditCourseDialog, setShowEditCourseDialog] = useState(false)
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseFormData, setCourseFormData] = useState<Course>({
    code: '',
    title: '',
    credit: 3,
    type: 'Core',
    program: '',
    prereq: null
  })
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    program: '',
    description: '',
    courses: [] as string[]
  })

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram = filterProgram === 'All' || course.program === filterProgram
    return matchesSearch && matchesProgram
  })

  const filteredGroups = courseGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram = filterProgram === 'All' || group.program === filterProgram
    return matchesSearch && matchesProgram
  })

  const handleAddCourse = () => {
    setCourses([...courses, { ...courseFormData }])
    setShowAddCourseDialog(false)
    resetCourseForm()
  }

  const handleEditCourse = () => {
    setCourses(courses.map(c => c.code === selectedCourse?.code ? { ...courseFormData } : c))
    setShowEditCourseDialog(false)
    resetCourseForm()
  }

  const handleDeleteCourse = (code: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.code !== code))
    }
  }

  const handleAddGroup = () => {
    const newGroup: CourseGroup = {
      id: String(courseGroups.length + 1),
      ...groupFormData
    }
    setCourseGroups([...courseGroups, newGroup])
    setShowAddGroupDialog(false)
    resetGroupForm()
  }

  const handleDeleteGroup = (id: string) => {
    if (confirm('Are you sure you want to delete this course group?')) {
      setCourseGroups(courseGroups.filter(g => g.id !== id))
    }
  }

  const openEditCourseDialog = (course: Course) => {
    setSelectedCourse(course)
    setCourseFormData(course)
    setShowEditCourseDialog(true)
  }

  const resetCourseForm = () => {
    setCourseFormData({
      code: '',
      title: '',
      credit: 3,
      type: 'Core',
      program: '',
      prereq: null
    })
    setSelectedCourse(null)
  }

  const resetGroupForm = () => {
    setGroupFormData({
      name: '',
      program: '',
      description: '',
      courses: []
    })
  }

  const toggleCourseInGroup = (courseCode: string) => {
    if (groupFormData.courses.includes(courseCode)) {
      setGroupFormData({
        ...groupFormData,
        courses: groupFormData.courses.filter(c => c !== courseCode)
      })
    } else {
      setGroupFormData({
        ...groupFormData,
        courses: [...groupFormData.courses, courseCode]
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Course & Course Group Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage courses and their groupings</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 font-medium ${activeTab === 'courses' ? 'text-deep-plum border-b-2 border-deep-plum' : 'text-gray-500'}`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Courses
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 font-medium ${activeTab === 'groups' ? 'text-deep-plum border-b-2 border-deep-plum' : 'text-gray-500'}`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Course Groups
        </button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={activeTab === 'courses' ? 'Search courses...' : 'Search groups...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option>All</option>
            {PROGRAMS.map(program => (
              <option key={program.code} value={program.code}>{program.code}</option>
            ))}
          </select>
          <Button 
            onClick={() => activeTab === 'courses' ? setShowAddCourseDialog(true) : setShowAddGroupDialog(true)} 
            className="bg-deep-plum hover:bg-deep-plum/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab === 'courses' ? 'Course' : 'Group'}
          </Button>
        </div>
      </Card>

      {activeTab === 'courses' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Course Code</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Course Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Credit</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Program</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Prerequisite</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.code} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-deep-plum">{course.code}</td>
                    <td className="p-4 text-sm">{course.title}</td>
                    <td className="p-4 text-sm">{course.credit}</td>
                    <td className="p-4">
                      <Badge variant="outline">{course.type}</Badge>
                    </td>
                    <td className="p-4 text-sm">{course.program}</td>
                    <td className="p-4 text-sm text-gray-500">{course.prereq || 'None'}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditCourseDialog(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.code)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses found</p>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-deep-plum">{group.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Badge>{group.program}</Badge>
                  <span className="text-gray-500">{group.courses.length} courses</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.courses.map(courseCode => (
                    <Badge key={courseCode} variant="outline" className="text-xs">
                      {courseCode}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          
          {filteredGroups.length === 0 && (
            <Card className="col-span-2 p-12">
              <div className="text-center">
                <p className="text-gray-500">No course groups found</p>
              </div>
            </Card>
          )}
        </div>
      )}

      <Dialog open={showAddCourseDialog} onOpenChange={setShowAddCourseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Enter course details</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Code</label>
              <Input
                value={courseFormData.code}
                onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CSE1101"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                value={courseFormData.program}
                onChange={(e) => setCourseFormData({ ...courseFormData, program: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {PROGRAMS.map(program => (
                  <option key={program.code} value={program.code}>{program.code}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <Input
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                placeholder="e.g., Programming Fundamentals"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Credit Hours</label>
              <Input
                type="number"
                value={courseFormData.credit}
                onChange={(e) => setCourseFormData({ ...courseFormData, credit: parseFloat(e.target.value) || 0 })}
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Course Type</label>
              <select
                value={courseFormData.type}
                onChange={(e) => setCourseFormData({ ...courseFormData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Core</option>
                <option>Major</option>
                <option>Minor</option>
                <option>Elective</option>
                <option>Lab</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Prerequisite Course (Optional)</label>
              <Input
                value={courseFormData.prereq || ''}
                onChange={(e) => setCourseFormData({ ...courseFormData, prereq: e.target.value || null })}
                placeholder="e.g., CSE1101"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddCourseDialog(false); resetCourseForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddCourse} className="bg-deep-plum hover:bg-deep-plum/90">
              Add Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditCourseDialog} onOpenChange={setShowEditCourseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course details</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Code</label>
              <Input
                value={courseFormData.code}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                value={courseFormData.program}
                onChange={(e) => setCourseFormData({ ...courseFormData, program: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {PROGRAMS.map(program => (
                  <option key={program.code} value={program.code}>{program.code}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <Input
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Credit Hours</label>
              <Input
                type="number"
                value={courseFormData.credit}
                onChange={(e) => setCourseFormData({ ...courseFormData, credit: parseFloat(e.target.value) || 0 })}
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Course Type</label>
              <select
                value={courseFormData.type}
                onChange={(e) => setCourseFormData({ ...courseFormData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option>Core</option>
                <option>Major</option>
                <option>Minor</option>
                <option>Elective</option>
                <option>Lab</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Prerequisite Course (Optional)</label>
              <Input
                value={courseFormData.prereq || ''}
                onChange={(e) => setCourseFormData({ ...courseFormData, prereq: e.target.value || null })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditCourseDialog(false); resetCourseForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEditCourse} className="bg-deep-plum hover:bg-deep-plum/90">
              Update Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Course Group</DialogTitle>
            <DialogDescription>Create a new course grouping</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Group Name</label>
              <Input
                value={groupFormData.name}
                onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                placeholder="e.g., Core CSE Courses"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                value={groupFormData.program}
                onChange={(e) => setGroupFormData({ ...groupFormData, program: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Program</option>
                {PROGRAMS.map(program => (
                  <option key={program.code} value={program.code}>{program.code}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={groupFormData.description}
                onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                placeholder="Brief description of the group"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Courses</label>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {courses
                  .filter(c => !groupFormData.program || c.program === groupFormData.program)
                  .map(course => (
                    <div key={course.code} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={groupFormData.courses.includes(course.code)}
                        onChange={() => toggleCourseInGroup(course.code)}
                        className="rounded"
                      />
                      <label className="text-sm cursor-pointer flex-1">
                        <span className="font-medium">{course.code}</span> - {course.title}
                      </label>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{groupFormData.courses.length} courses selected</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddGroupDialog(false); resetGroupForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup} className="bg-deep-plum hover:bg-deep-plum/90">
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
