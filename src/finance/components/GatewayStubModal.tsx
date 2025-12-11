import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle } from 'lucide-react'

interface GatewayStubModalProps {
  isOpen: boolean
  onClose: () => void
  gatewayName: string
  onSuccess: (transactionRef: string) => void
}

export default function GatewayStubModal({ isOpen, onClose, gatewayName, onSuccess }: GatewayStubModalProps) {
  const [transactionRef] = useState(() => {
    const timestamp = Date.now().toString().slice(-5)
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `TXN-DEMO-${timestamp}${random}`
  })

  const handleSuccess = () => {
    onSuccess(transactionRef)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            Gateway Initialized (Demo)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Gateway Name</p>
            <p className="font-bold text-lg text-blue-900">{gatewayName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transaction Reference</label>
            <Input
              value={transactionRef}
              readOnly
              className="font-mono bg-gray-50"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> This is a simulated payment gateway. 
              No real transaction will occur. Click "Mark as Successful" to complete the demo payment.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSuccess} className="nu-button-primary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Successful
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
