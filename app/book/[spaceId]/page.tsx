import BookSpacePage from '@/components/pages/book-space-page'
export const dynamic = 'force-dynamic';
interface BookSpaceRouteProps {
  params: { spaceId: string }
}

export default function BookSpaceRoute({ params }: BookSpaceRouteProps) {
  return <BookSpacePage spaceId={params.spaceId} />
}
