interface SignatureBlockProps {
  type: 'department-summary' | 'individual-monthly'
  employeeName?: string
  employeeDesignation?: string
}

export default function SignatureBlock({ type, employeeName, employeeDesignation }: SignatureBlockProps) {
  if (type === 'department-summary') {
    return (
      <div className="print-signature-block mt-8 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-8">
          <div>Prepared By ___________________</div>
          <div>Checked By ___________________</div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>Recommended By ___________________</div>
          <div>Approved By ___________________</div>
        </div>
      </div>
    )
  }

  return (
    <div className="print-signature-block mt-8 flex justify-between text-sm">
      <div>
        <p className="font-medium">{employeeName}</p>
        <p className="text-gray-600">{employeeDesignation}</p>
      </div>
      <div>
        <p>Prepared by ___________________</p>
      </div>
    </div>
  )
}
