import { NUB_LOGO_PATH } from '@/lib/hrmStatic'

interface PrintableHeaderProps {
  title: string
  subtitle?: string
  dateLine: string
}

export default function PrintableHeader({ title, subtitle, dateLine }: PrintableHeaderProps) {
  return (
    <div className="text-center mb-6">
      {/* Logo - Left aligned, print only */}
      <div className="hidden print:flex print:justify-start print:mb-2">
        <img 
          src={NUB_LOGO_PATH} 
          alt="NUB Logo" 
          className="print-letterhead-logo"
        />
      </div>
      
      {/* Institution Name */}
      <h1 className="print-letterhead-institution text-xl font-bold">
        Northern University Bangladesh (NUB)
      </h1>
      
      {/* Address Line */}
      <p className="print-letterhead-address text-sm text-gray-600">
        111/2 Kawlar Jame Mosjid Road, Ashkona, (Near Haji Camp) Dakshinkhan, Dhaka-1230
      </p>
      
      {/* Report Title */}
      <h2 className="print-letterhead-title text-lg font-bold mt-4">
        {title}
      </h2>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="print-letterhead-subtitle text-sm">
          {subtitle}
        </p>
      )}
      
      {/* Date Line */}
      <p className="print-letterhead-dateline text-sm">
        {dateLine}
      </p>
    </div>
  )
}
