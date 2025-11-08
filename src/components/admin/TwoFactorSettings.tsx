import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, Smartphone, Key, AlertCircle } from 'lucide-react'

export default function TwoFactorSettings() {
  const [otpEnabled, setOtpEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [appEnabled, setAppEnabled] = useState(false)

  const handleToggle = (type: 'otp' | 'sms' | 'app') => {
    if (type === 'otp') {
      setOtpEnabled(!otpEnabled)
    } else if (type === 'sms') {
      setSmsEnabled(!smsEnabled)
    } else {
      setAppEnabled(!appEnabled)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-plum">Two-Factor Authentication (2FA)</h1>
          <p className="text-sm text-gray-600 mt-1">Configure additional security layers for system access</p>
        </div>
        <Badge className="bg-mint-green/30 text-deep-plum border-mint-green">
          Demo Mode Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email OTP Card */}
        <Card className={otpEnabled ? 'border-mint-green shadow-md' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${otpEnabled ? 'bg-mint-green/20' : 'bg-gray-100'}`}>
                  <Mail className={`w-5 h-5 ${otpEnabled ? 'text-deep-plum' : 'text-gray-400'}`} />
                </div>
                <div>
                  <CardTitle className="text-base">Email OTP</CardTitle>
                  <Badge className={otpEnabled ? 'bg-green-100 text-green-800 mt-1' : 'bg-gray-100 text-gray-600 mt-1'}>
                    {otpEnabled ? '🟢 Active' : '⚪ Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm mb-4">
              Send a 6-digit code to user's registered email address at each login.
            </CardDescription>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-mint-green rounded-full"></div>
                <span>Code expires in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-mint-green rounded-full"></div>
                <span>3 attempts allowed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-mint-green rounded-full"></div>
                <span>Logs all verification attempts</span>
              </div>
            </div>
            <Button 
              variant={otpEnabled ? 'outline' : 'default'}
              className={`w-full ${otpEnabled ? '' : 'nu-button-primary'}`}
              onClick={() => handleToggle('otp')}
            >
              {otpEnabled ? 'Disable' : 'Enable'} Email OTP
            </Button>
          </CardContent>
        </Card>

        {/* SMS OTP Card */}
        <Card className={smsEnabled ? 'border-mint-green shadow-md' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${smsEnabled ? 'bg-mint-green/20' : 'bg-gray-100'}`}>
                  <Smartphone className={`w-5 h-5 ${smsEnabled ? 'text-deep-plum' : 'text-gray-400'}`} />
                </div>
                <div>
                  <CardTitle className="text-base">SMS OTP</CardTitle>
                  <Badge className={smsEnabled ? 'bg-green-100 text-green-800 mt-1' : 'bg-gray-100 text-gray-600 mt-1'}>
                    {smsEnabled ? '🟢 Active' : '⚪ Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm mb-4">
              Send a 6-digit code to user's mobile number via SMS gateway.
            </CardDescription>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Requires SMS provider setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Additional cost per SMS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Not available in demo</span>
              </div>
            </div>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => handleToggle('sms')}
              disabled
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Authenticator App Card */}
        <Card className={appEnabled ? 'border-mint-green shadow-md' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${appEnabled ? 'bg-mint-green/20' : 'bg-gray-100'}`}>
                  <Key className={`w-5 h-5 ${appEnabled ? 'text-deep-plum' : 'text-gray-400'}`} />
                </div>
                <div>
                  <CardTitle className="text-base">Authenticator App</CardTitle>
                  <Badge className={appEnabled ? 'bg-green-100 text-green-800 mt-1' : 'bg-gray-100 text-gray-600 mt-1'}>
                    {appEnabled ? '🟢 Active' : '⚪ Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm mb-4">
              Use Google Authenticator or Microsoft Authenticator for TOTP codes.
            </CardDescription>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Requires QR code setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Offline code generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Not available in demo</span>
              </div>
            </div>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => handleToggle('app')}
              disabled
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-medium mb-1">Demo Mode Notice</p>
          <p>
            In <strong>Email OTP</strong> demo mode, the 6-digit code is displayed inline in the login modal instead of being sent via email. 
            Failed OTP attempts are logged in the Email Verification Log. In production, actual email delivery would be handled by your SMTP provider.
          </p>
        </div>
      </div>

      {/* Configuration Details */}
      <Card>
        <CardHeader>
          <CardTitle>2FA Configuration Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Expiry Time (minutes)
                </label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md" 
                  defaultValue={5} 
                  disabled={!otpEnabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Attempts
                </label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md" 
                  defaultValue={3} 
                  disabled={!otpEnabled}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply to Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {['System Admin', 'Registrar', 'Exam Controller', 'Finance Officer'].map((role) => (
                  <Badge key={role} className="bg-deep-plum/10 text-deep-plum cursor-pointer hover:bg-deep-plum/20">
                    ✓ {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="nu-button-primary" disabled={!otpEnabled}>
                Save Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
