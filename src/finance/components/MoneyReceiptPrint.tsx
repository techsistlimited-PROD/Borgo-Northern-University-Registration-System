import { Payment } from '../data/types'
import { formatCurrency, formatShortId } from '../utils/financeUtils'

interface MoneyReceiptPrintProps {
  payment: Payment
  onClose: () => void
}

export default function MoneyReceiptPrint({ payment, onClose }: MoneyReceiptPrintProps) {
  const handlePrint = () => {
    window.print()
  }

  const ReceiptCopy = ({ copyType }: { copyType: 'Student' | 'Office' }) => (
    <div className="relative p-8 border-2 border-gray-800" style={{ minHeight: '50vh' }}>
      <div className="absolute top-4 right-4 opacity-20 text-6xl font-bold text-gray-400 rotate-[-15deg]">
        {copyType} COPY
      </div>

      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold">Northern University Bangladesh</h1>
        <p className="text-sm">Finance Department</p>
        <p className="text-xs">Mirpur, Dhaka-1216, Bangladesh</p>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold underline">MONEY RECEIPT</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm">
        <div className="flex">
          <span className="font-semibold w-32">Receipt No:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 font-mono font-bold">
            {payment.receiptNo}
          </span>
        </div>
        <div className="flex">
          <span className="font-semibold w-32">Date:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
          </span>
        </div>
        <div className="flex col-span-2">
          <span className="font-semibold w-32">Received from:</span>
          <span className="flex-1 border-b border-dotted border-gray-600 font-medium">
            {payment.studentName}
          </span>
        </div>
        <div className="flex">
          <span className="font-semibold w-32">Student ID:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {formatShortId(payment.studentId, payment.program)}
          </span>
        </div>
        <div className="flex">
          <span className="font-semibold w-32">Program:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {payment.program}
          </span>
        </div>
        <div className="flex">
          <span className="font-semibold w-32">Semester:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {payment.semester}
          </span>
        </div>
        <div className="flex">
          <span className="font-semibold w-32">Campus:</span>
          <span className="flex-1 border-b border-dotted border-gray-600">
            {payment.campus}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-sm mb-2">Particulars (Cost Heads):</p>
        <div className="border border-gray-600 rounded">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 text-xs font-semibold border-b border-gray-600">Bill No</th>
                <th className="text-right p-2 text-xs font-semibold border-b border-gray-600">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              {payment.allocations.map((alloc, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="p-2 text-xs">{alloc.billNo}</td>
                  <td className="p-2 text-xs text-right">{alloc.allocatedAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex mb-2">
            <span className="font-semibold text-sm w-32">Payment Mode:</span>
            <span className="flex-1 border-b border-dotted border-gray-600 text-sm font-medium">
              {payment.method}
            </span>
          </div>
          {payment.transactionRef && (
            <div className="flex">
              <span className="font-semibold text-sm w-32">Transaction Ref:</span>
              <span className="flex-1 border-b border-dotted border-gray-600 text-xs font-mono">
                {payment.transactionRef}
              </span>
            </div>
          )}
        </div>
        <div className="bg-gray-100 border-2 border-gray-800 p-3 text-center">
          <p className="text-xs font-semibold mb-1">TOTAL AMOUNT RECEIVED</p>
          <p className="text-2xl font-bold">BDT {payment.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {payment.notes && (
        <div className="mb-6">
          <p className="font-semibold text-sm">Notes:</p>
          <p className="text-xs border-t border-gray-400 pt-1">{payment.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center">
          <div className="border-t border-gray-800 pt-2">
            <p className="text-xs font-semibold">Student Signature</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-800 pt-2">
            <p className="text-xs font-semibold">Authorized Signature</p>
            <p className="text-xs mt-1">{payment.collectedBy}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-600">
        <p>This is a computer-generated receipt.</p>
        <p>Printed on: {new Date().toLocaleString('en-GB')}</p>
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
