import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FileDown, Printer, Eye, Search } from 'lucide-react'
import { HRM_ATTENDANCE, HRM_EMPLOYEES, type AttendanceRecord } from '@/lib/hrmStatic'
import PrintableHeader from '@/components/hrm/reports/PrintableHeader'
import SignatureBlock from '@/components/hrm/reports/SignatureBlock'

interface EmployeeSummary {
  sl: number
  employeeId: string
  employeeName: string
  designation: string
  dept: string
  joinDate: string
  totalDays: number
  weekend: number
  holiday: number
  leave: number
  lateIn: number
  earlyOut: number
  absent: number
  totalPresent: number
  totalDutyHrs: string
  defaultHrs: string
  surplusHrs: string
  remark: string
}

interface DailyRecord {
  sl: number
  date: string
  day: string
  officeTime: string
  inTime: string
  outTime: string
  lateIn: number
  earlyOut: number
  duration: string
  surplusDefault: string
  status: string
  remarks: string
}

// Generate demo employees if needed
const generateDemoSummary = (count: number, selectedDept: string, selectedMonth: string): EmployeeSummary[] => {
  const demoEmployees = HRM_EMPLOYEES.slice(0, count)
  return demoEmployees.map((emp, index) => ({
    sl: index + 1,
    employeeId: emp.id,
    employeeName: emp.name,
    designation: emp.designation,
    dept: selectedDept === 'all' ? emp.department : selectedDept,
    joinDate: emp.joiningDate,
    totalDays: 31,
    weekend: 8,
    holiday: 2,
    leave: Math.floor(Math.random() * 3),
    lateIn: Math.floor(Math.random() * 3),
    earlyOut: Math.floor(Math.random() * 2),
    absent: Math.floor(Math.random() * 2),
    totalPresent: 28 + Math.floor(Math.random() * 3),
    totalDutyHrs: (140 + Math.random() * 20).toFixed(2),
    defaultHrs: Math.random() > 0.5 ? (Math.random() * 5).toFixed(2) : '',
    surplusHrs: Math.random() > 0.5 ? (Math.random() * 20).toFixed(2) : '',
    remark: ''
  }))
}

// Generate 31-day individual report
const generate31DayReport = (empId: string, selectedMonth: string): DailyRecord[] => {
  const [year, month] = selectedMonth.split('-')
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
  const records: DailyRecord[] = []
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekendDays = [5, 6] // Friday, Saturday (0-indexed)
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`
    const date = new Date(parseInt(year), parseInt(month) - 1, day)
    const dayOfWeek = date.getDay()
    const dayName = dayNames[dayOfWeek]
    const isWeekend = weekendDays.includes(dayOfWeek)
    const isHoliday = day === 6 || day === 14 // Mock holidays
    
    // Try to find actual record
    const actualRecord = HRM_ATTENDANCE.find(r => r.empId === empId && r.date === dateStr)
    
    if (actualRecord) {
      const duration = actualRecord.status === 'Absent' ? '-' : `${actualRecord.hours}:00`
      const surplus = actualRecord.hours > 8 ? `+${(actualRecord.hours - 8).toFixed(2)}` : 
                     actualRecord.hours < 8 && actualRecord.hours > 0 ? `-${(8 - actualRecord.hours).toFixed(2)}` : '-'
      
      records.push({
        sl: day,
        date: `${String(day).padStart(2, '0')}/${month}/${year}`,
        day: dayName.toUpperCase(),
        officeTime: '09:30 AM – 5:30 PM',
        inTime: actualRecord.inTime,
        outTime: actualRecord.outTime,
        lateIn: actualRecord.late || 0,
        earlyOut: 0,
        duration,
        surplusDefault: surplus,
        status: actualRecord.status,
        remarks: actualRecord.remarks || ''
      })
    } else {
      // Generate mock record
      let status = 'Present'
      let inTime = '09:30 AM'
      let outTime = '05:30 PM'
      let lateIn = 0
      let duration = '8:00'
      let surplus = '-'
      
      if (isWeekend) {
        status = 'Weekend'
        inTime = '-'
        outTime = '-'
        duration = '-'
        surplus = '-'
      } else if (isHoliday) {
        status = 'Holiday'
        inTime = '-'
        outTime = '-'
        duration = '-'
        surplus = '-'
      } else if (Math.random() > 0.9) {
        status = 'Absent'
        inTime = '-'
        outTime = '-'
        duration = '-'
        surplus = '-'
      } else if (Math.random() > 0.8) {
        status = 'Late'
        lateIn = Math.floor(Math.random() * 30) + 5
        inTime = `09:${30 + lateIn} AM`
        duration = '7:30'
        surplus = '-0:30'
      }
      
      records.push({
        sl: day,
        date: `${String(day).padStart(2, '0')}/${month}/${year}`,
        day: dayName.toUpperCase(),
        officeTime: '09:30 AM – 5:30 PM',
        inTime,
        outTime,
        lateIn,
        earlyOut: 0,
        duration,
        surplusDefault: surplus,
        status,
        remarks: status === 'Holiday' ? (day === 6 ? 'Ashura Holiday' : 'Janmashtami Holiday') : ''
      })
    }
  }
  
  return records
}

export default function MonthlyReports() {
  const [selectedMonth, setSelectedMonth] = useState('2025-01')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewDetailsEmp, setViewDetailsEmp] = useState<string | null>(null)

  const [year, month] = selectedMonth.split('-')
  const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })

  // Calculate employee summaries
  const employeeSummaries = useMemo(() => {
    const activeEmployees = HRM_EMPLOYEES.filter(e => e.status === 'Active')
    const monthRecords = HRM_ATTENDANCE.filter(a => a.date.startsWith(selectedMonth))
    
    const summaries: EmployeeSummary[] = activeEmployees.map((emp, index) => {
      const empRecords = monthRecords.filter(r => r.empId === emp.id)
      const totalDays = 31 // Full month
      const present = empRecords.filter(r => r.status === 'Present' || r.status === 'Late').length
      const absent = empRecords.filter(r => r.status === 'Absent').length
      const leave = empRecords.filter(r => r.status === 'On Leave').length
      const late = empRecords.filter(r => r.status === 'Late').length
      const weekend = 8 // Mock
      const holiday = 2 // Mock
      const earlyOut = 0 // Mock
      
      const totalDutyHrs = empRecords.reduce((sum, r) => sum + r.hours, 0)
      const expectedHrs = present * 8
      const variance = totalDutyHrs - expectedHrs
      
      return {
        sl: index + 1,
        employeeId: emp.id,
        employeeName: emp.name,
        designation: emp.designation,
        dept: emp.department,
        joinDate: emp.joiningDate,
        totalDays,
        weekend,
        holiday,
        leave,
        lateIn: late,
        earlyOut,
        absent,
        totalPresent: present,
        totalDutyHrs: totalDutyHrs.toFixed(2),
        defaultHrs: variance < 0 ? Math.abs(variance).toFixed(2) : '',
        surplusHrs: variance > 0 ? variance.toFixed(2) : '',
        remark: ''
      }
    })

    // Filter by department and search
    let filtered = summaries.filter(s => {
      if (selectedDept !== 'all' && s.dept !== selectedDept) return false
      if (searchTerm && !s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })

    // Pad to 20 rows if needed
    if (filtered.length < 20) {
      const demoRows = generateDemoSummary(20 - filtered.length, selectedDept, selectedMonth)
      filtered = [...filtered, ...demoRows]
    }

    return filtered
  }, [selectedMonth, selectedDept, searchTerm])

  const showDemoNotice = employeeSummaries.some(s => s.employeeId.startsWith('EMP-') && s.totalPresent === 28)

  const formatDate = (dateStr: string) => {
    const [y, m] = dateStr.split('-')
    return `${m}/${y}`
  }

  const handleExportPDF = () => {
    alert('PDF export functionality - Demo Mode')
  }

  const handleExportExcel = () => {
    // Use same CSV logic with .xlsx extension for demo
    handleExportCSV()
  }

  const handleExportCSV = () => {
    const deptName = selectedDept === 'all' ? 'All' : selectedDept
    const campusName = selectedCampus === 'all' ? 'All' : selectedCampus
    const [year, month] = selectedMonth.split('-')
    const formattedMonth = `${month}-${year}` // MM-YYYY

    const headers = ['Sl', 'Employee ID', 'Employee Name', 'Designation', 'Dept.', 'Join Date', 'Total Days', 'Weekend', 'Holiday', 'Leave', 'Late In', 'Early Out', 'Absent', 'Total Present', 'Total Duty Hrs', 'Default', 'Surplus', 'Remark']
    const rows = employeeSummaries.map(s => [
      s.sl, s.employeeId, s.employeeName, s.designation, s.dept, s.joinDate,
      s.totalDays, s.weekend, s.holiday, s.leave, s.lateIn, s.earlyOut, s.absent,
      s.totalPresent, s.totalDutyHrs, s.defaultHrs, s.surplusHrs, s.remark
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Attendance_Report_Dept-${deptName}_Campus-${campusName}_${formattedMonth}.xlsx`
    a.click()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleIndividualExportCSV = () => {
    if (!viewDetailsEmp || !selectedEmployee) return

    const [year, month] = selectedMonth.split('-')
    const formattedMonth = `${month}-${year}` // MM-YYYY

    const headers = ['Sl', 'Date', 'Day', 'Office Time', 'In Time', 'Out Time', 'Late In', 'Early Out', 'Duration', 'Surplus / Default', 'Status', 'Remarks']
    const rows = individualRecords.map(r => [
      r.sl, r.date, r.day, r.officeTime, r.inTime, r.outTime,
      r.lateIn, r.earlyOut, r.duration, r.surplusDefault, r.status, r.remarks
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Individual_Report_${selectedEmployee.id}_${formattedMonth}.csv`
    a.click()
  }

  // Individual report data
  const individualRecords = useMemo(() => {
    if (!viewDetailsEmp) return []
    return generate31DayReport(viewDetailsEmp, selectedMonth)
  }, [viewDetailsEmp, selectedMonth])

  const individualSummary = useMemo(() => {
    if (!individualRecords.length) return null
    
    const totalDays = individualRecords.length
    const present = individualRecords.filter(r => r.status === 'Present').length
    const late = individualRecords.filter(r => r.status === 'Late').length
    const absent = individualRecords.filter(r => r.status === 'Absent').length
    const leave = individualRecords.filter(r => r.status === 'On Leave').length
    const weekend = individualRecords.filter(r => r.status === 'Weekend').length
    const holidays = individualRecords.filter(r => r.status === 'Holiday').length
    const earlyOut = individualRecords.filter(r => r.earlyOut > 0).length
    
    const totalOfficeHour = (present + late) * 8
    const totalDuration = individualRecords.reduce((sum, r) => {
      if (r.duration === '-') return sum
      const [h, m] = r.duration.split(':')
      return sum + parseInt(h) + (parseInt(m || '0') / 60)
    }, 0)
    
    const surplus = totalDuration - totalOfficeHour
    
    return {
      totalDays,
      totalPresent: present + late,
      totalLeave: leave,
      totalLate: late,
      totalWeekend: weekend,
      totalHolidays: holidays,
      totalEarlyOut: earlyOut,
      totalAbsent: absent,
      totalOfficeHour: `${totalOfficeHour}:00`,
      totalDuration: `${Math.floor(totalDuration)}:${Math.round((totalDuration % 1) * 60).toString().padStart(2, '0')}`,
      halfDayLeave: 0,
      surplusDefault: surplus > 0 ? `${surplus.toFixed(2)}` : surplus < 0 ? `-${Math.abs(surplus).toFixed(2)}` : '0.00'
    }
  }, [individualRecords])

  const selectedEmployee = viewDetailsEmp ? HRM_EMPLOYEES.find(e => e.id === viewDetailsEmp) : null

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* PDF Header - Print Only */}
      <div className="hidden print:block">
        <PrintableHeader
          title="Attendance Report"
          subtitle={`Campus: ${selectedCampus === 'all' ? 'All Campuses' : selectedCampus}`}
          dateLine={`Date Range: ${formatDate(selectedMonth)}`}
        />
      </div>

      {/* Screen Header */}
      <div className="print:hidden space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">Northern University Bangladesh (NUB)</h1>
            <p className="text-sm text-gray-600">111/2 Kawlar Jame Mosjid Road, Ashkona, (Near Haji Camp) Dakshinkhan, Dhaka-1230</p>
            <h2 className="text-xl font-bold text-gray-900 mt-3">Attendance Report</h2>
            <p className="text-sm text-gray-700">Campus: {selectedCampus === 'all' ? 'All Campuses' : selectedCampus}</p>
            <p className="text-sm text-gray-700 font-medium">Date Range: {formatDate(selectedMonth)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export CSV
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
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Month</label>
              <Input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Campus</label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Permanent Campus">Permanent Campus</SelectItem>
                  <SelectItem value="Banani Campus">Banani Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Employee Name or ID" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      {showDemoNotice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> No exact matches. Showing demo sample (20 rows) based on current filters.
          </p>
        </div>
      )}

      {/* Summary Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sl</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept.</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Total Days</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Weekend</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Holiday</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Leave</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Late In</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Early Out</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Absent</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Total Present</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Total Duty Hrs</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Default</th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Surplus</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeSummaries.map((summary) => (
                  <tr key={summary.employeeId}>
                    <td className="px-2 py-3 text-sm text-gray-900">{summary.sl}</td>
                    <td className="px-2 py-3 text-sm text-gray-900">{summary.employeeId}</td>
                    <td className="px-2 py-3 text-sm font-medium text-gray-900">{summary.employeeName}</td>
                    <td className="px-2 py-3 text-sm text-gray-600">{summary.designation}</td>
                    <td className="px-2 py-3 text-sm text-gray-600">{summary.dept}</td>
                    <td className="px-2 py-3 text-sm text-gray-600">{summary.joinDate}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.totalDays}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.weekend}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.holiday}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.leave}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.lateIn}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.earlyOut}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.absent}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.totalPresent}</td>
                    <td className="px-2 py-3 text-sm text-right text-gray-600 print-align-right">{summary.totalDutyHrs}</td>
                    <td className="px-2 py-3 text-sm text-right text-red-600 print-align-right print-text-red">{summary.defaultHrs}</td>
                    <td className="px-2 py-3 text-sm text-right text-green-600 print-align-right print-text-green">{summary.surplusHrs}</td>
                    <td className="px-2 py-3 text-sm text-gray-600">{summary.remark}</td>
                    <td className="px-2 py-3 print:hidden">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewDetailsEmp(summary.employeeId)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature Block - Print Only */}
          <div className="hidden print:block px-6">
            <SignatureBlock type="department-summary" />
          </div>

          <div className="hidden print:block text-center mt-8 text-sm text-gray-600">
            Page 1 of 1
          </div>
        </CardContent>
      </Card>

      {/* Individual Report Dialog */}
      <Dialog open={!!viewDetailsEmp} onOpenChange={() => setViewDetailsEmp(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Individual Report Header */}
          <div className="print:block">
            <PrintableHeader
              title="Individual Report"
              dateLine={`Date: ${formatDate(selectedMonth)}`}
            />
          </div>

          {/* Employee Info */}
          {selectedEmployee && (
            <div className="mb-4 space-y-1">
              <p className="text-sm"><strong>Name:</strong> {selectedEmployee.name}</p>
              <p className="text-sm"><strong>ID:</strong> {selectedEmployee.id}</p>
              <p className="text-sm"><strong>Designation:</strong> {selectedEmployee.designation}</p>
              <p className="text-sm"><strong>Department:</strong> {selectedEmployee.department}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4 print:hidden">
            <Button variant="outline" size="sm" onClick={() => alert('Export PDF - Demo')}>
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleIndividualExportCSV()}>
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Daily Records Table */}
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sl</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase print-align-center">Office Time</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase print-align-center">In Time</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase print-align-center">Out Time</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Late In</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Early Out</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Duration</th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase print-align-right">Surplus / Default</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase print-align-center">Status</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {individualRecords.map((record) => (
                  <tr key={record.sl} className={
                    record.status === 'Late' ? 'bg-yellow-50' :
                    record.status === 'Absent' ? 'bg-red-50' :
                    record.status === 'Weekend' || record.status === 'Holiday' ? 'bg-gray-50' : ''
                  }>
                    <td className="px-2 py-2">{record.sl}</td>
                    <td className="px-2 py-2">{record.date}</td>
                    <td className="px-2 py-2">{record.day}</td>
                    <td className="px-2 py-2 text-center text-xs print-align-center">{record.officeTime}</td>
                    <td className="px-2 py-2 text-center print-align-center">{record.inTime}</td>
                    <td className="px-2 py-2 text-center print-align-center">{record.outTime}</td>
                    <td className="px-2 py-2 text-right print-align-right">{record.lateIn || '-'}</td>
                    <td className="px-2 py-2 text-right print-align-right">{record.earlyOut || '-'}</td>
                    <td className="px-2 py-2 text-right print-align-right">{record.duration}</td>
                    <td className="px-2 py-2 text-right print-align-right">{record.surplusDefault}</td>
                    <td className="px-2 py-2 text-center print-align-center">{record.status}</td>
                    <td className="px-2 py-2 text-xs">{record.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Block */}
          {individualSummary && (
            <div className="mt-6 border rounded p-4 bg-gray-50">
              <h3 className="font-bold mb-3">Summary</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><strong>Total Days:</strong> {individualSummary.totalDays}</div>
                <div><strong>Total Leave:</strong> {individualSummary.totalLeave}</div>
                <div><strong>Total Late:</strong> {individualSummary.totalLate}</div>
                <div><strong>Total Office Hour:</strong> {individualSummary.totalOfficeHour}</div>
                
                <div><strong>Total Present:</strong> {individualSummary.totalPresent}</div>
                <div><strong>Total Weekend:</strong> {individualSummary.totalWeekend}</div>
                <div><strong>Total Early Out:</strong> {individualSummary.totalEarlyOut}</div>
                <div><strong>Total Duration:</strong> {individualSummary.totalDuration}</div>
                
                <div><strong>Total Absent:</strong> {individualSummary.totalAbsent}</div>
                <div><strong>Total Holidays:</strong> {individualSummary.totalHolidays}</div>
                <div><strong>Half Day Leave:</strong> {individualSummary.halfDayLeave}</div>
                <div><strong>Surplus / Default:</strong> <span className={parseFloat(individualSummary.surplusDefault) >= 0 ? 'text-green-600' : 'text-red-600'}>{individualSummary.surplusDefault}</span></div>
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div className="hidden print:block">
            <SignatureBlock
              type="individual-monthly"
              employeeName={selectedEmployee?.name}
              employeeDesignation={selectedEmployee?.designation}
            />
          </div>

          <div className="hidden print:block text-center mt-4 text-sm text-gray-600">
            Page 1 of 1
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
