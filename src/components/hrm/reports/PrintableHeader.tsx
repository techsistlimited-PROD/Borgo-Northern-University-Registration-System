interface PrintableHeaderProps {
  title: string
  subtitle?: string
  dateLine: string
}

export default function PrintableHeader({ title, subtitle, dateLine }: PrintableHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold">Northern University Bangladesh (NUB)</h1>
      <p className="text-sm text-gray-600">111/2 Kawlar Jame Mosjid Road, Ashkona, (Near Haji Camp) Dakshinkhan, Dhaka-1230</p>
      <h2 className="text-lg font-bold mt-4">{title}</h2>
      {subtitle && <p className="text-sm">{subtitle}</p>}
      <p className="text-sm">{dateLine}</p>
    </div>
  )
}
