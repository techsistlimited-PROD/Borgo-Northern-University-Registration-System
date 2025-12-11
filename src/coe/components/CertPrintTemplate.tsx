import { CertificateRequest, getCertificateTypeCode } from '@/coe/data/certificates'
import { getTranscriptByStudent } from '@/coe/data/transcripts'

interface CertPrintTemplateProps {
  request: CertificateRequest
}

export default function CertPrintTemplate({ request }: CertPrintTemplateProps) {
  const transcript = getTranscriptByStudent(request.studentId)
  const typeCode = getCertificateTypeCode(request.documentType)
  const isTranscriptType = ['OTRN', 'PTRN', 'UTRP'].includes(typeCode)
  const isLetterFormat = ['MIGR', 'MOI', 'LRP', 'GRDL', 'PVCE', 'BACK'].includes(typeCode)
  const isTestimonialFormat = ['TEST', 'CHAR', 'RECO'].includes(typeCode)
  const isCertificateFormat = ['PROV', 'MAIN'].includes(typeCode)

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto print:shadow-none" style={{ fontFamily: 'serif' }}>
      <style>{`
        @media print {
          body { margin: 0; }
          @page { size: A4; margin: 15mm; }
        }
      `}</style>

      <div className="border-4 border-deep-plum p-8">
        <div className="text-center mb-6 border-b-2 border-accent-purple pb-4">
          <div className="text-xs text-gray-600 mb-1">REPUBLIC OF BANGLADESH</div>
          <h1 className="text-2xl font-bold text-deep-plum mb-1">NORTHERN UNIVERSITY BANGLADESH</h1>
          <div className="text-sm text-gray-700">Bashundhara, Dhaka-1229, Bangladesh</div>
          <div className="text-xs text-gray-600 mt-1">Office of the Controller of Examinations</div>
        </div>

        {isCertificateFormat && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center text-deep-plum border-b pb-2">
              {request.documentType.toUpperCase()}
            </h2>
            <div className="text-center my-6">
              <div className="text-sm mb-2">This is to certify that</div>
              <div className="text-2xl font-bold text-deep-plum my-3">{request.studentName}</div>
              <div className="text-sm mb-2">Student ID: {request.studentId}</div>
              <div className="text-sm">
                has {typeCode === 'PROV' ? 'provisionally completed' : 'successfully completed'} the requirements
                for the degree of <span className="font-semibold">{transcript?.programName || request.programCode}</span>
              </div>
              {request.cgpa && (
                <div className="text-sm mt-2">
                  with a CGPA of <span className="font-bold text-deep-plum">{request.cgpa.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-between items-end">
              <div className="text-center">
                <div className="border-t border-gray-800 pt-1 w-32">Seal</div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-800 pt-1 w-48">Controller of Examinations</div>
                <div className="text-xs text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            {request.serial && (
              <div className="mt-6 text-xs text-gray-600 flex justify-between items-center border-t pt-2">
                <span>Serial: {request.serial}</span>
                <span>QR: {request.qrToken}</span>
              </div>
            )}
          </div>
        )}

        {isTestimonialFormat && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center text-deep-plum border-b pb-2">
              {request.documentType.toUpperCase()}
            </h2>
            <div className="text-sm leading-relaxed space-y-3 mt-4">
              <p>To Whom It May Concern,</p>
              <p>
                This is to certify that <span className="font-semibold">{request.studentName}</span>,
                Student ID <span className="font-semibold">{request.studentId}</span>, is a bonafide student
                of <span className="font-semibold">{transcript?.programName || request.programCode}</span> program
                at Northern University Bangladesh.
              </p>
              {typeCode === 'CHAR' && (
                <p>
                  During their academic tenure, the student has demonstrated good character and conduct.
                  They have maintained discipline and adhered to university regulations.
                </p>
              )}
              {typeCode === 'RECO' && (
                <p>
                  The student has shown commendable academic performance with a CGPA of {request.cgpa?.toFixed(2) || 'N/A'}.
                  I recommend this student for {request.purpose || 'further academic pursuits'}.
                </p>
              )}
              <p>This certificate is issued upon request for {request.purpose || 'official purposes'}.</p>
              <p className="mt-6">Sincerely,</p>
            </div>
            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="border-t border-gray-800 pt-1 w-48">Controller of Examinations</div>
                <div className="text-xs text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {isLetterFormat && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center text-deep-plum border-b pb-2">
              {request.documentType.toUpperCase()}
            </h2>
            <div className="text-sm space-y-2 mt-4">
              <table className="w-full">
                <tbody>
                  <tr><td className="font-semibold w-40">Student Name:</td><td>{request.studentName}</td></tr>
                  <tr><td className="font-semibold">Student ID:</td><td>{request.studentId}</td></tr>
                  <tr><td className="font-semibold">Program:</td><td>{transcript?.programName || request.programCode}</td></tr>
                  <tr><td className="font-semibold">Batch:</td><td>{request.batch}</td></tr>
                  <tr><td className="font-semibold">Credits Completed:</td><td>{request.creditsCompleted}</td></tr>
                  {request.cgpa && <tr><td className="font-semibold">CGPA:</td><td>{request.cgpa.toFixed(2)}</td></tr>}
                </tbody>
              </table>
              <div className="mt-4 text-sm leading-relaxed">
                {typeCode === 'MOI' && (
                  <p>This is to certify that the medium of instruction for the above program is English.</p>
                )}
                {typeCode === 'MIGR' && (
                  <p>This certificate is issued for migration purposes as requested by the student.</p>
                )}
                {typeCode === 'GRDL' && (
                  <p>The grading system follows a 4.0 scale with Letter Grades and Grade Points as per university policy.</p>
                )}
                {typeCode === 'BACK' && (
                  <p>This letter confirms any pending course backlogs or academic obligations.</p>
                )}
                {typeCode === 'LRP' && (
                  <p>Results for the student have been officially published on the university portal.</p>
                )}
                {typeCode === 'PVCE' && (
                  <p>This letter confirms the equivalency of the student's qualifications as per PVC requirements.</p>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="border-t border-gray-800 pt-1 w-48">Controller of Examinations</div>
                <div className="text-xs text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {isTranscriptType && transcript && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center text-deep-plum border-b pb-2">
              {request.documentType.toUpperCase()}
            </h2>
            <div className="text-sm space-y-2">
              <div><span className="font-semibold">Name:</span> {request.studentName}</div>
              <div><span className="font-semibold">Student ID:</span> {request.studentId}</div>
              <div><span className="font-semibold">Program:</span> {transcript.programName}</div>
              <div><span className="font-semibold">Cumulative CGPA:</span> {request.cgpa?.toFixed(2) || 'N/A'}</div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2 border-b">Academic Performance Summary</h3>
              {transcript.semesters.slice(0, typeCode === 'PTRN' ? 3 : undefined).map((sem, idx) => (
                <div key={idx} className="mb-3 text-xs">
                  <div className="font-semibold text-deep-plum">{sem.semesterName}</div>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    <div>Credits: {sem.earnedCredit}</div>
                    <div>GPA: {sem.gpa.toFixed(2)}</div>
                    <div>CGPA: {sem.cgpa.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-xs text-gray-600">
              {typeCode === 'UTRP' && <div className="italic">Unofficial - For Reference Only</div>}
              {typeCode === 'PTRN' && <div className="italic">Partial Transcript - Selected Semesters Only</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
