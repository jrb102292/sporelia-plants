import PlantDetailViewWrapper from '../../../src/components/nextjs/PlantDetailViewWrapper'

interface PlantDetailPageProps {
  params: {
    id: string
  }
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  return <PlantDetailViewWrapper plantId={params.id} />
}
