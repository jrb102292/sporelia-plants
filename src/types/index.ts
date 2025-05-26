export type PlantStatus = 'Healthy' | 'Needs Attention' | 'Unhealthy';

export interface Plant {
  id: string;
  name: string;
  plantType: string;
  species?: string;
  acquisitionDate?: string;
  lastWatered?: string;
  imageUrl?: string;
  status: PlantStatus;
  isCutting?: boolean;
  parentPlantId?: string;
  notes?: string;
  location?: string;
  careInstructions?: string;
  lastFertilized?: string;
  lastRepotted?: string;
  nextWateringDate?: string;
  nextFertilizingDate?: string;
  nextRepottingDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Type guard to check if an object is a Plant
export function isPlant(obj: unknown): obj is Plant {
  if (!obj || typeof obj !== 'object') return false;
  
  const plant = obj as Plant;
  return (
    typeof plant.id === 'string' &&
    typeof plant.name === 'string' &&
    typeof plant.plantType === 'string' &&
    typeof plant.status === 'string' &&
    ['Healthy', 'Needs Attention', 'Unhealthy'].includes(plant.status) &&
    typeof plant.createdAt === 'string' &&
    typeof plant.updatedAt === 'string'
  );
} 