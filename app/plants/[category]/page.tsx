import PlantCollectionPageWrapper from '../../../src/components/nextjs/PlantCollectionPageWrapper'

interface PlantCategoryPageProps {
  params: {
    category: string
  }
}

export default function PlantCategoryPage({ params }: PlantCategoryPageProps) {
  return <PlantCollectionPageWrapper plantTypeFilter={params.category || 'All'} />
}
