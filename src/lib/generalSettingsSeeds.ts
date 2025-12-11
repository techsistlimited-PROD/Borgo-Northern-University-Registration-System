// General Settings Seeds - Demo data for all General Settings screens
// Uses deterministic LCG RNG for consistent demo data

// LCG Random Number Generator (same as adminSecuritySeeds)
let seed = 42
function lcg() {
  seed = (1103515245 * seed + 12345) % 2147483648
  return seed / 2147483648
}
function rand() { return lcg() }
function randInt(min: number, max: number) { return Math.floor(rand() * (max - min + 1)) + min }
function randItem<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)] }

// Institute Profile (single record)
export interface InstituteProfile {
  name: string
  shortName: string
  code: string
  address: string
  website: string
  email: string
  phone: string
  logo: string
  establishedYear: number
  about: string
}

export const instituteProfileData: InstituteProfile = {
  name: 'Northern University Bangladesh',
  shortName: 'NUB',
  code: 'NUB-001',
  address: 'Plot #14/A, Road #4, Banani, Dhaka-1213, Bangladesh',
  website: 'https://www.nub.ac.bd',
  email: 'info@nub.ac.bd',
  phone: '+880-2-9852702',
  logo: '/placeholder-logo.png',
  establishedYear: 2002,
  about: 'Northern University Bangladesh (NUB) is a leading private university committed to providing quality education in various disciplines including Business, Engineering, Arts, and Science. Established in 2002, NUB has grown to become one of the premier educational institutions in Bangladesh.'
}

// Study Level & Term
export interface StudyLevelTerm {
  id: string
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma'
  termName: 'Semester' | 'Trimester' | 'Bi-semester' | 'Quarter'
  termsPerYear: number
  creditsPerTerm: string
  active: boolean
}

export const studyLevelTermStatic: StudyLevelTerm[] = [
  { id: 'SLT001', level: 'Undergraduate', termName: 'Semester', termsPerYear: 2, creditsPerTerm: '12-18', active: true },
  { id: 'SLT002', level: 'Undergraduate', termName: 'Trimester', termsPerYear: 3, creditsPerTerm: '9-15', active: true },
  { id: 'SLT003', level: 'Postgraduate', termName: 'Semester', termsPerYear: 2, creditsPerTerm: '6-12', active: true },
  { id: 'SLT004', level: 'Postgraduate', termName: 'Trimester', termsPerYear: 3, creditsPerTerm: '6-9', active: true },
  { id: 'SLT005', level: 'Diploma', termName: 'Semester', termsPerYear: 2, creditsPerTerm: '15-21', active: true },
  { id: 'SLT006', level: 'Undergraduate', termName: 'Bi-semester', termsPerYear: 2, creditsPerTerm: '15-21', active: false },
  { id: 'SLT007', level: 'Postgraduate', termName: 'Quarter', termsPerYear: 4, creditsPerTerm: '6-9', active: false },
  { id: 'SLT008', level: 'Diploma', termName: 'Trimester', termsPerYear: 3, creditsPerTerm: '12-18', active: true }
]

// Credit Transfer Institutes
export interface CreditTransferInstitute {
  id: string
  instituteName: string
  country: string
  type: 'Public' | 'Private' | 'International Partner'
  status: 'Active' | 'Inactive' | 'Pending'
  contactEmail: string
}

const countries = ['Bangladesh', 'USA', 'UK', 'Canada', 'Australia', 'Malaysia', 'India', 'Singapore']
const instTypes: Array<'Public' | 'Private' | 'International Partner'> = ['Public', 'Private', 'International Partner']
const statuses: Array<'Active' | 'Inactive' | 'Pending'> = ['Active', 'Inactive', 'Pending']

export const creditTransferInstitutesStatic: CreditTransferInstitute[] = Array.from({ length: 15 }, (_, i) => ({
  id: `CTI${String(i + 1).padStart(3, '0')}`,
  instituteName: randItem([
    'University of Dhaka', 'BUET', 'Rajshahi University', 'MIT', 'Stanford University',
    'University of Oxford', 'University of Cambridge', 'University of Toronto', 'McGill University',
    'University of Melbourne', 'University of Sydney', 'University of Malaya', 'IIT Delhi',
    'National University of Singapore', 'Nanyang Technological University'
  ]),
  country: randItem(countries),
  type: randItem(instTypes),
  status: i < 12 ? 'Active' : randItem(statuses),
  contactEmail: `contact${i + 1}@university.edu`
}))

// Geographic Settings - Country
export interface Country {
  id: string
  code: string
  name: string
  active: boolean
}

export const countriesStatic: Country[] = [
  { id: 'C001', code: 'BD', name: 'Bangladesh', active: true },
  { id: 'C002', code: 'IN', name: 'India', active: true }
]

// Division
export interface Division {
  id: string
  code: string
  name: string
  countryCode: string
  active: boolean
}

export const divisionsStatic: Division[] = [
  { id: 'D001', code: 'DHA', name: 'Dhaka', countryCode: 'BD', active: true },
  { id: 'D002', code: 'CTG', name: 'Chattogram', countryCode: 'BD', active: true },
  { id: 'D003', code: 'RAJ', name: 'Rajshahi', countryCode: 'BD', active: true },
  { id: 'D004', code: 'KHU', name: 'Khulna', countryCode: 'BD', active: true },
  { id: 'D005', code: 'BAR', name: 'Barishal', countryCode: 'BD', active: true },
  { id: 'D006', code: 'SYL', name: 'Sylhet', countryCode: 'BD', active: true },
  { id: 'D007', code: 'RAN', name: 'Rangpur', countryCode: 'BD', active: true },
  { id: 'D008', code: 'MYM', name: 'Mymensingh', countryCode: 'BD', active: true }
]

// District
export interface District {
  id: string
  code: string
  name: string
  divisionCode: string
  active: boolean
}

const districtNames = [
  'Dhaka', 'Gazipur', 'Narayanganj', 'Chattogram', 'Cox\'s Bazar', 'Rajshahi', 'Khulna', 'Barishal',
  'Sylhet', 'Rangpur', 'Mymensingh', 'Cumilla', 'Bogura', 'Dinajpur', 'Faridpur', 'Jessore',
  'Pabna', 'Tangail', 'Sirajganj', 'Kushtia', 'Netrokona', 'Jamalpur'
]

export const districtsStatic: District[] = districtNames.map((name, i) => ({
  id: `DIS${String(i + 1).padStart(3, '0')}`,
  code: name.substring(0, 3).toUpperCase(),
  name,
  divisionCode: randItem(['DHA', 'CTG', 'RAJ', 'KHU', 'BAR', 'SYL', 'RAN', 'MYM']),
  active: true
}))

// Police Station
export interface PoliceStation {
  id: string
  code: string
  name: string
  districtCode: string
  active: boolean
}

const psNames = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara', 'Mohammadpur', 'Savar', 'Tongi',
  'Agrabad', 'Panchlaish', 'Kotwali', 'Badda', 'Tejgaon', 'Jatrabari', 'Motijheel',
  'Sutrapur', 'Lalbagh', 'Ramna', 'Shahbag', 'Cantonment'
]

export const policeStationsStatic: PoliceStation[] = psNames.map((name, i) => ({
  id: `PS${String(i + 1).padStart(3, '0')}`,
  code: `PS${String(i + 1).padStart(3, '0')}`,
  name,
  districtCode: randItem(['DHA', 'GAZ', 'CTG']),
  active: true
}))

// Post Office
export interface PostOffice {
  id: string
  code: string
  name: string
  policeStationCode: string
  active: boolean
}

const poNames = [
  'Dhanmondi PO', 'Gulshan PO', 'Banani PO', 'Mirpur-1 PO', 'Mirpur-10 PO', 'Uttara PO',
  'Mohammadpur PO', 'Savar PO', 'Tongi PO', 'Agrabad PO', 'Panchlaish PO', 'Kotwali PO',
  'Badda PO', 'Tejgaon PO', 'Jatrabari PO', 'Motijheel PO', 'Sutrapur PO', 'Lalbagh PO',
  'Ramna PO', 'Shahbag PO', 'Cantonment PO', 'Gazipur PO', 'Narayanganj PO', 'Comilla PO',
  'Bogura PO', 'Dinajpur PO', 'Faridpur PO', 'Jessore PO', 'Pabna PO', 'Tangail PO'
]

export const postOfficesStatic: PostOffice[] = poNames.map((name, i) => ({
  id: `PO${String(i + 1).padStart(4, '0')}`,
  code: `PO-${String(i + 1000).padStart(4, '0')}`,
  name,
  policeStationCode: randItem(psNames.map((_, idx) => `PS${String(idx + 1).padStart(3, '0')}`)),
  active: true
}))

// Student Quota Types
export interface StudentQuota {
  id: string
  code: string
  name: string
  percentageCap: number
  active: boolean
}

export const studentQuotasStatic: StudentQuota[] = [
  { id: 'SQ001', code: 'FF', name: 'Freedom Fighter', percentageCap: 10, active: true },
  { id: 'SQ002', code: 'TRI', name: 'Tribal/Indigenous', percentageCap: 5, active: true },
  { id: 'SQ003', code: 'DIS', name: 'Disability', percentageCap: 5, active: true },
  { id: 'SQ004', code: 'WOM', name: 'Women', percentageCap: 15, active: true },
  { id: 'SQ005', code: 'RUR', name: 'Rural', percentageCap: 10, active: true },
  { id: 'SQ006', code: 'POV', name: 'Poverty', percentageCap: 5, active: true },
  { id: 'SQ007', code: 'SPO', name: 'Sports', percentageCap: 3, active: true },
  { id: 'SQ008', code: 'CUL', name: 'Cultural', percentageCap: 2, active: true },
  { id: 'SQ009', code: 'MER', name: 'Merit', percentageCap: 45, active: true },
  { id: 'SQ010', code: 'EMP', name: 'Employee Child', percentageCap: 5, active: true }
]

// Guardian/Parent Occupations
export interface GuardianOccupation {
  id: string
  code: string
  occupationName: string
  category: 'Government' | 'Private' | 'Self-Employed' | 'Other'
  active: boolean
}

const occupations = [
  { name: 'Teacher', category: 'Government' as const },
  { name: 'Doctor', category: 'Government' as const },
  { name: 'Engineer', category: 'Government' as const },
  { name: 'Civil Servant', category: 'Government' as const },
  { name: 'Police Officer', category: 'Government' as const },
  { name: 'Army Officer', category: 'Government' as const },
  { name: 'Software Engineer', category: 'Private' as const },
  { name: 'Bank Officer', category: 'Private' as const },
  { name: 'Accountant', category: 'Private' as const },
  { name: 'Manager', category: 'Private' as const },
  { name: 'Sales Executive', category: 'Private' as const },
  { name: 'Marketing Professional', category: 'Private' as const },
  { name: 'Business Owner', category: 'Self-Employed' as const },
  { name: 'Shop Owner', category: 'Self-Employed' as const },
  { name: 'Farmer', category: 'Self-Employed' as const },
  { name: 'Freelancer', category: 'Self-Employed' as const },
  { name: 'Consultant', category: 'Self-Employed' as const },
  { name: 'Contractor', category: 'Self-Employed' as const },
  { name: 'Retired', category: 'Other' as const },
  { name: 'Unemployed', category: 'Other' as const },
  { name: 'Homemaker', category: 'Other' as const },
  { name: 'Student', category: 'Other' as const }
]

export const guardianOccupationsStatic: GuardianOccupation[] = occupations.map((occ, i) => ({
  id: `GO${String(i + 1).padStart(3, '0')}`,
  code: `OCC${String(i + 1).padStart(3, '0')}`,
  occupationName: occ.name,
  category: occ.category,
  active: true
}))

// Relationship List
export interface Relationship {
  id: string
  code: string
  relationship: string
  active: boolean
}

const relationships = [
  'Father', 'Mother', 'Legal Guardian', 'Spouse', 'Brother', 'Sister', 
  'Uncle (Paternal)', 'Uncle (Maternal)', 'Aunt (Paternal)', 'Aunt (Maternal)',
  'Grandfather (Paternal)', 'Grandfather (Maternal)', 'Grandmother (Paternal)', 'Grandmother (Maternal)',
  'Cousin', 'Other Relative', 'Non-Relative Guardian'
]

export const relationshipsStatic: Relationship[] = relationships.map((rel, i) => ({
  id: `REL${String(i + 1).padStart(3, '0')}`,
  code: `R${String(i + 1).padStart(3, '0')}`,
  relationship: rel,
  active: true
}))

// Utility function to ensure minimum rows (same pattern as adminSecuritySeeds)
export function ensureMinGeneralRows<T>(base: T[], minCount: number, builder: (index: number) => T): T[] {
  if (base.length >= minCount) return base
  const additional = Array.from({ length: minCount - base.length }, (_, i) => builder(base.length + i))
  return [...base, ...additional]
}
