import { useState } from 'react'
import RecruitmentVacancies from './RecruitmentVacancies'
import RecruitmentCandidates from './RecruitmentCandidates'
import RecruitmentShortlisting from './RecruitmentShortlisting'
import RecruitmentInterviews from './RecruitmentInterviews'
import RecruitmentOffers from './RecruitmentOffers'
import RecruitmentOnboarding from './RecruitmentOnboarding'

type RecruitmentView = 'vacancies' | 'candidates' | 'shortlisting' | 'interviews' | 'offers' | 'onboarding'

type Props = {
  view: RecruitmentView
}

export default function RecruitmentPages({ view }: Props) {
  switch (view) {
    case 'vacancies':
      return <RecruitmentVacancies />
    case 'candidates':
      return <RecruitmentCandidates />
    case 'shortlisting':
      return <RecruitmentShortlisting />
    case 'interviews':
      return <RecruitmentInterviews />
    case 'offers':
      return <RecruitmentOffers />
    case 'onboarding':
      return <RecruitmentOnboarding />
    default:
      return <RecruitmentVacancies />
  }
}
