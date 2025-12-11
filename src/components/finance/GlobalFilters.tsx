export default function GlobalFilters() {
  return (
    <div className="bg-white border-b shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Semester</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>Fall 2025</option>
            <option>Summer 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Campus</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>Banani Campus</option>
            <option>Dhanmondi Campus</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Program</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>All Programs</option>
            <option>BBA</option>
            <option>CSE</option>
            <option>LLB</option>
            <option>MBA</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fiscal Period</label>
          <select className="w-full p-2 border rounded-md text-sm">
            <option>2025-Q4</option>
            <option>2025-Q3</option>
            <option>2025-Q2</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Student Search</label>
          <input 
            type="text" 
            placeholder="ID / Name / Mobile" 
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  )
}
