import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileDown, Printer, Search } from 'lucide-react'
import { HRM_ATTENDANCE, HRM_EMPLOYEES, HRM_SHIFTS, type AttendanceRecord } from '@/lib/hrmStatic'
import { DEMO_MODE, showDemoToast } from '@/config/demo'
import PrintableHeader from '@/components/hrm/reports/PrintableHeader'
import SignatureBlock from '@/components/hrm/reports/SignatureBlock'

type StatusType = 'Present' | 'Absent' | 'Late present' | 'all'
type ViewType = 'details' | 'summary'

// Helper to get employee designation
const getEmployeeDesignation = (empId: string): string => {
  const emp = HRM_EMPLOYEES.find(e => e.id === empId)
  return emp?.designation || 'Staff'
}

// Helper to get shift office time
const getOfficeTime = (shiftId: string): string => {
  const shift = HRM_SHIFTS.find(s => s.id === shiftId)
  if (!shift) return '09:00 AM - 5:00 PM'
  
  const formatTime = (time: string) => {
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }
  
  return `${formatTime(shift.start)} - ${formatTime(shift.end)}`
}

// Helper to calculate duration
const getDuration = (inTime: string, outTime: string, status: string): string => {
  if (status === 'Absent' || status === 'On Leave') return '-'
  if (inTime === '-' || outTime === '-') return '-'
  
  const parseTime = (time: string) => {
    const [h, m] = time.split(':')
    return parseInt(h) * 60 + parseInt(m)
  }
  
  const inMins = parseTime(inTime)
  const outMins = parseTime(outTime)
  const diff = outMins - inMins
  const hours = Math.floor(diff / 60)
  const mins = diff % 60
  
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

// Helper to calculate surplus/deficit in hours
const getSurplusDeficit = (duration: string, status: string): string => {
  if (status === 'Absent' || status === 'On Leave' || duration === '-') return '-'
  
  const [h, m] = duration.split(':')
  const totalMins = parseInt(h) * 60 + parseInt(m)
  const expectedMins = 8 * 60 // 8 hours
  const diff = totalMins - expectedMins
  
  if (diff === 0) return '-'
  
  const hours = Math.floor(Math.abs(diff) / 60)
  const mins = Math.abs(diff) % 60
  const sign = diff > 0 ? '+' : '-'
  
  return `${sign}${hours}:${mins.toString().padStart(2, '0')}`
}

// Generate demo fallback data
const generateDemoData = (status: StatusType, dept: string, date: string): AttendanceRecord[] => {
  const demoEmployees = HRM_EMPLOYEES.slice(0, 8)
  return demoEmployees.map((emp, index) => {
    const demoStatus = status === 'all' ? 'Present' : status === 'Late present' ? 'Late' : status
    const late = demoStatus === 'Late' ? 15 + index * 5 : 0
    const hours = demoStatus === 'Present' ? 8 : demoStatus === 'Late' ? 7.5 : 0
    const inTime = demoStatus === 'Absent' ? '-' : demoStatus === 'Late' ? `09:${late}` : '08:30'
    const outTime = demoStatus === 'Absent' ? '-' : '16:30'
    
    return {
      id: `DEMO-${index}`,
      empId: emp.id,
      name: emp.name,
      dept: dept === 'all' ? emp.department : dept,
      date,
      inTime,
      outTime,
      hours,
      late,
      status: demoStatus,
      shift: 'R1',
      remarks: demoStatus === 'Absent' ? 'No attendance marked' : ''
    }
  })
}

export default function DailyAttendance() {
  const [selectedDate, setSelectedDate] = useState('2025-01-12')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState<ViewType>('details')
  const [isFullDayPrint, setIsFullDayPrint] = useState(false)

  const filteredRecords = useMemo(() => {
    let filtered = HRM_ATTENDANCE.filter(record => {
      if (record.date !== selectedDate) return false
      if (selectedDept !== 'all' && record.dept !== selectedDept) return false
      if (selectedStatus !== 'all') {
        const statusMatch = selectedStatus === 'Late present' ? 'Late' : selectedStatus
        if (record.status !== statusMatch) return false
      }
      if (searchTerm && !record.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !record.empId.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })

    // If no results, generate demo data
    if (filtered.length === 0) {
      filtered = generateDemoData(selectedStatus, selectedDept, selectedDate)
    }

    return filtered
  }, [selectedDate, selectedDept, selectedStatus, searchTerm])

  // Separate records for full day print
  const presentRecords = useMemo(() => {
    let filtered = HRM_ATTENDANCE.filter(record => {
      if (record.date !== selectedDate) return false
      if (selectedDept !== 'all' && record.dept !== selectedDept) return false
      if (record.status !== 'Present') return false
      return true
    })
    if (filtered.length === 0) {
      filtered = generateDemoData('Present', selectedDept, selectedDate)
    }
    return filtered
  }, [selectedDate, selectedDept])

  const absentRecords = useMemo(() => {
    let filtered = HRM_ATTENDANCE.filter(record => {
      if (record.date !== selectedDate) return false
      if (selectedDept !== 'all' && record.dept !== selectedDept) return false
      if (record.status !== 'Absent') return false
      return true
    })
    if (filtered.length === 0) {
      filtered = generateDemoData('Absent', selectedDept, selectedDate)
    }
    return filtered
  }, [selectedDate, selectedDept])

  const lateRecords = useMemo(() => {
    let filtered = HRM_ATTENDANCE.filter(record => {
      if (record.date !== selectedDate) return false
      if (selectedDept !== 'all' && record.dept !== selectedDept) return false
      if (record.status !== 'Late') return false
      return true
    })
    if (filtered.length === 0) {
      filtered = generateDemoData('Late present', selectedDept, selectedDate)
    }
    return filtered
  }, [selectedDate, selectedDept])

  const showDemoNotice = !HRM_ATTENDANCE.some(r =>
    r.date === selectedDate &&
    (selectedDept === 'all' || r.dept === selectedDept) &&
    (selectedStatus === 'all' || r.status === (selectedStatus === 'Late present' ? 'Late' : selectedStatus))
  )

  // Summary counts
  const summaryCounts = useMemo(() => {
    const allRecords = HRM_ATTENDANCE.filter(record => {
      if (record.date !== selectedDate) return false
      if (selectedDept !== 'all' && record.dept !== selectedDept) return false
      if (searchTerm && !record.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !record.empId.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })

    const presentCount = allRecords.filter(r => r.status === 'Present').length
    const absentCount = allRecords.filter(r => r.status === 'Absent').length
    const lateCount = allRecords.filter(r => r.status === 'Late').length

    // Generate demo counts if no data
    if (allRecords.length === 0) {
      return {
        present: Math.floor(Math.random() * 30) + 20,
        absent: Math.floor(Math.random() * 10),
        late: Math.floor(Math.random() * 15),
        isDemo: true
      }
    }

    return {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      isDemo: false
    }
  }, [selectedDate, selectedDept, searchTerm])

  const getRowClass = (status: string) => {
    switch (status) {
      case 'Late': return 'bg-yellow-50'
      case 'Absent': return 'bg-red-50'
      case 'On Leave': return 'bg-blue-50'
      default: return ''
    }
  }

  const getReportTitle = () => {
    if (activeView === 'summary') return 'Daily Summary Report'
    if (selectedStatus === 'Present') return 'Daily Report : Present'
    if (selectedStatus === 'Absent') return 'Daily Report : Absent'
    if (selectedStatus === 'Late present') return 'Daily Report : Late present'
    return 'Daily Report : All Attendance'
  }

  const getDeptName = () => {
    return selectedDept === 'all' ? 'All Departments' : selectedDept
  }

  const getCampusName = () => {
    return selectedCampus === 'all' ? 'All Campuses' : selectedCampus
  }

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFullDayPrint = () => {
    setIsFullDayPrint(true)
    setTimeout(() => {
      window.print()
      setIsFullDayPrint(false)
    }, 100)
  }

  const handleDownloadPDF = () => {
    alert('PDF download functionality - Demo Mode')
  }

  const handleDownloadCSV = () => {
    if (activeView === 'summary') {
      const headers = ['SL', 'Status Type', 'Count', 'Remarks']
      const rows = [
        ['1', 'Present', summaryCounts.present.toString(), ''],
        ['2', 'Absent', summaryCounts.absent.toString(), ''],
        ['3', 'Late present', summaryCounts.late.toString(), '']
      ]
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `daily_summary_${selectedDate}.csv`
      a.click()
      return
    }

    const headers = ['SL', 'ID', 'Name', 'Designation', 'Dept.', 'Office Time', 'In', 'Out', 'Late In (M)', 'Early Out (M)', 'Duration', 'Surplus/Deficit', 'Status', 'Remarks']
    const rows = filteredRecords.map((record, index) => {
      const designation = getEmployeeDesignation(record.empId)
      const officeTime = getOfficeTime(record.shift)
      const earlyOut = record.status === 'Absent' ? '-' : '0'
      const duration = getDuration(record.inTime, record.outTime, record.status)
      const surplus = getSurplusDeficit(duration, record.status)
      
      return [
        index + 1,
        record.empId,
        record.name,
        designation,
        record.dept,
        officeTime,
        record.inTime,
        record.outTime,
        record.status === 'Absent' ? '-' : record.late.toString(),
        earlyOut,
        duration,
        surplus,
        record.status,
        record.remarks || ''
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily_attendance_${selectedDate}.csv`
    a.click()
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* PDF Header - Print Only */}
      <div className="hidden print:block">
        <PrintableHeader
          title={getReportTitle()}
          subtitle={`${getDeptName()}, ${getCampusName()}`}
          dateLine={`Date : ${formatDate(selectedDate)}`}
        />
      </div>

      {/* Screen Header - Hide on Print */}
      <div className="print:hidden space-y-4">
        {/* Institution Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">Northern University Bangladesh (NUB)</h1>
            <p className="text-sm text-gray-600">111/2 Kawlar Jame Mosjid Road, Ashkona, (Near Haji Camp) Dakshinkhan, Dhaka-1230</p>
            <h2 className="text-xl font-bold text-gray-900 mt-3">{getReportTitle()}</h2>
            <p className="text-sm text-gray-700">{getDeptName()}, {getCampusName()}</p>
            <p className="text-sm text-gray-700 font-medium">Date : {formatDate(selectedDate)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleFullDayPrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Full Day Report (All Sections)
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleDownloadCSV} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Download CSV
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Admission">Admission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Campus</label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Permanent Campus">Permanent Campus</SelectItem>
                  <SelectItem value="Banani Campus">Banani Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as StatusType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late present">Late present</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Name or ID" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card className="print:hidden">
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => { setActiveView('details'); setSelectedStatus('Present') }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'details' && selectedStatus === 'Present'
                  ? 'border-deep-plum text-deep-plum'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Present
            </button>
            <button
              onClick={() => { setActiveView('details'); setSelectedStatus('Absent') }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'details' && selectedStatus === 'Absent'
                  ? 'border-deep-plum text-deep-plum'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Absent
            </button>
            <button
              onClick={() => { setActiveView('details'); setSelectedStatus('Late present') }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'details' && selectedStatus === 'Late present'
                  ? 'border-deep-plum text-deep-plum'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Late present
            </button>
            <button
              onClick={() => setActiveView('summary')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'summary'
                  ? 'border-deep-plum text-deep-plum'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Summary
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      {activeView === 'details' && showDemoNotice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> No exact matches. Showing demo sample ({filteredRecords.length} rows) based on current filters.
          </p>
        </div>
      )}

      {activeView === 'summary' && summaryCounts.isDemo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> No exact matches. Showing demo summary based on current filters.
          </p>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {activeView === 'summary' ? (
            /* Summary View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Type</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-3 py-4 text-sm text-gray-900">1</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">Present</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{summaryCounts.present}</td>
                    <td className="px-3 py-4 text-sm text-gray-600"></td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-3 py-4 text-sm text-gray-900">2</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">Absent</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{summaryCounts.absent}</td>
                    <td className="px-3 py-4 text-sm text-gray-600"></td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-3 py-4 text-sm text-gray-900">3</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">Late present</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{summaryCounts.late}</td>
                    <td className="px-3 py-4 text-sm text-gray-600"></td>
                  </tr>
                </tbody>
              </table>

              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between print:hidden">
                <p className="text-sm text-gray-600">
                  Summary for {formatDate(selectedDate)}
                </p>
              </div>

              <div className="hidden print:block text-center mt-8 text-sm text-gray-600">
                Page 1 of 1
              </div>
            </div>
          ) : (
            /* Details View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept.</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Time</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late In (M)</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Early Out (M)</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surplus / Deficit</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => {
                    const designation = getEmployeeDesignation(record.empId)
                    const officeTime = getOfficeTime(record.shift)
                    const earlyOut = record.status === 'Absent' ? '-' : '0'
                    const duration = getDuration(record.inTime, record.outTime, record.status)
                    const surplus = getSurplusDeficit(duration, record.status)

                    return (
                      <tr key={record.id} className={getRowClass(record.status)}>
                        <td className="px-3 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-3 py-3 text-sm text-gray-900">{record.empId}</td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">{record.name}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{designation}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{record.dept}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{officeTime}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{record.inTime}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{record.outTime}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">
                          {record.status === 'Absent' ? '-' : record.late > 0 ? record.late : '-'}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-600">{earlyOut}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{duration}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{surplus}</td>
                        <td className="px-3 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'Present' ? 'bg-green-100 text-green-800' :
                            record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                            record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-600">{record.remarks || ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Footer */}
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between print:hidden">
                <p className="text-sm text-gray-600">
                  Showing {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Print Footer */}
              <div className="hidden print:block text-center mt-8 text-sm text-gray-600">
                Page 1 of 1
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
