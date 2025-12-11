import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, AlertCircle } from 'lucide-react'

interface OtpVerificationModalProps {
  open: boolean
  onVerify: (success: boolean, attempts: number) => void
  userEmail: string
}

export default function OtpVerificationModal({ open, onVerify, userEmail }: OtpVerificationModalProps) {
  const [otp, setOtp] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      // Generate a random 6-digit OTP for demo
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000))
      setDemoOtp(generatedOtp)
      setOtp('')
      setAttempts(0)
      setError('')
    }
  }, [open])

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    // Simulate verification delay
    setTimeout(() => {
      const newAttempts = attempts + 1

      if (otp === demoOtp) {
        // Success
        setLoading(false)
        onVerify(true, newAttempts)
      } else {
        // Failed
        setAttempts(newAttempts)
        setLoading(false)

        if (newAttempts >= 3) {
          setError('Maximum attempts exceeded. Login failed.')
          setTimeout(() => {
            onVerify(false, newAttempts)
          }, 1500)
        } else {
          setError(`Incorrect OTP. ${3 - newAttempts} attempt(s) remaining.`)
          setOtp('')
        }
      }
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerify()
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-deep-plum/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-deep-plum" />
            </div>
          </div>
          <DialogTitle className="text-center">Email OTP Verification</DialogTitle>
          <DialogDescription className="text-center">
            A 6-digit verification code has been sent to
            <br />
            <span className="font-medium text-deep-plum">{userEmail}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Demo OTP Display */}
          <div className="bg-mint-green/20 border border-mint-green/40 rounded-md p-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Demo Mode - OTP Code:</p>
            <p className="text-2xl font-mono font-bold text-deep-plum text-center tracking-widest">
              {demoOtp}
            </p>
            <p className="text-xs text-gray-600 mt-2 text-center">
              In production, this would be sent via email
            </p>
          </div>

          {/* OTP Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP Code
            </label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              className="text-center text-2xl font-mono tracking-widest"
              disabled={loading || attempts >= 3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Attempts Counter */}
          <div className="text-center text-sm text-gray-600">
            Attempts: {attempts} / 3
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading || attempts >= 3}
            className="nu-button-primary w-full sm:w-auto"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </DialogFooter>

        <div className="text-xs text-gray-500 text-center pb-2">
          Didn't receive the code?{' '}
          <button className="text-deep-plum hover:underline font-medium">
            Resend OTP
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
