import AgencyProfilePage from '@/components/pages/agency-profile-page'

interface AgencyProfileRouteProps {
  params: { id: string }
}

export default function AgencyProfileRoute({ params }: AgencyProfileRouteProps) {
  return <AgencyProfilePage agencyId={params.id} />
}
