import { Payment } from '../data/types'
import { formatCurrency } from '../utils/financeUtils'
import { numberToWords } from '../utils/moneyInWords'

interface MoneyReceiptPrintProps {
  payment: Payment & { 
    bankName?: string
    branchName?: string
    purpose?: string
  }
  onClose: () => void
}

export default function MoneyReceiptPrint({ payment, onClose }: MoneyReceiptPrintProps) {
  const handlePrint = () => {
    window.print()
  }

  const formatCompactId = (studentId: string, program: string): string => {
    const cleaned = studentId.replace(/[-\s]/g, '')
    return program.toUpperCase() + cleaned
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate().toString().padStart(2, '0')
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const ReceiptCopy = ({ copyType }: { copyType: 'Student' | 'Office' }) => (
    <div className="relative p-8 border-2 border-gray-800" style={{ minHeight: '48vh' }}>
      <div className="absolute top-4 right-4 opacity-20 text-5xl font-bold text-gray-400 rotate-[-15deg]">
        {copyType} COPY
      </div>

      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold uppercase">Northern University Bangladesh</h1>
        <p className="text-xs mt-1">Banani, Dhaka-1213, Bangladesh</p>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold underline">MONEY RECEIPT</h2>
      </div>

      <div className="space-y-3 mb-6 text-sm">
        <div className="flex items-center">
          <span className="font-semibold w-40">MR. No.:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 font-mono font-bold">
            {payment.receiptNo}
          </span>
          <span className="font-semibold w-20 ml-4">Date:</span>
          <span className="w-32 border-b border-dotted border-gray-600">
            {formatDate(payment.paymentDate)}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-40">Received with thanks from:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 font-medium">
            {payment.studentName}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-40">Program:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {payment.program}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-40">ID No.:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 font-mono">
            {formatCompactId(payment.studentId, payment.program)}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-40">For:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {payment.purpose || 'Installment Payment'}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-40">Taka in words:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 italic">
            {numberToWords(payment.totalAmount)}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold w-40">Pay by:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 font-medium">
            {payment.method}
          </span>
        </div>

        {payment.method === 'Bank' && (
          <>
            <div className="flex items-center">
              <span className="font-semibold w-40">Bank:</span>
              <span className="flex-1 border-b border-dotted border-gray-600">
                {payment.bankName || '____________________'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Branch:</span>
              <span className="flex-1 border-b border-dotted border-gray-600">
                {payment.branchName || '____________________'}
              </span>
            </div>
          </>
        )}

        {payment.transactionRef && payment.method !== 'Bank' && (
          <div className="flex items-center">
            <span className="font-semibold w-40">Transaction Ref:</span>
            <span className="flex-1 border-b border-dotted border-gray-600 font-mono text-xs">
              {payment.transactionRef}
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 bg-gray-100 border-2 border-gray-800 p-4 text-center">
        <p className="text-xs font-semibold mb-1">AMOUNT</p>
        <p className="text-3xl font-bold">Tk. {payment.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="grid grid-cols-2 gap-12 mt-10">
        <div className="text-center">
          <div className="border-t-2 border-gray-800 pt-2 mt-8">
            <p className="text-xs font-semibold">Received by:</p>
            <p className="text-xs mt-1">_______________________</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-800 pt-2 mt-8">
            <p className="text-xs font-semibold">Authorized by:</p>
            <p className="text-xs mt-1">_______________________</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-600">
        <p>This is a computer-generated receipt</p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="no-print sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Money Receipt - {payment.receiptNo}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-accent-purple text-white rounded hover:bg-deep-plum transition-colors"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="print-content p-8" id="receipt-print-area">
          <style>{`
            @media print {
              .no-print { display: none !important; }
              body * { visibility: hidden; }
              #receipt-print-area, #receipt-print-area * { visibility: visible; }
              #receipt-print-area { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%;
                margin: 0;
                padding: 0;
              }
              .page-break { page-break-after: always; }
            }
          `}</style>

          <ReceiptCopy copyType="Student" />

          <div className="border-t-4 border-dashed border-gray-400 my-8" />

          <ReceiptCopy copyType="Office" />
        </div>
      </div>
    </div>
  )
}
