import AgencyProfilePage from '@/components/pages/agency-profile-page'
import { use } from 'react'

interface AgencyProfileRouteProps {
  params: Promise<{ id: string }>
}

export default function AgencyProfileRoute({ params }: AgencyProfileRouteProps) {
  const { id } = use(params)
  return <AgencyProfilePage agencyId={id} />
}
