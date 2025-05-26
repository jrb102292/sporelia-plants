export interface Plant {
  id: string;
  name: string;
  species: string;
  category: string;
  imageUrl?: string;
  description?: string;
  careInstructions?: {
    watering: string;
    sunlight: string;
    temperature: string;
    humidity: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlantCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface PlantFormData extends Omit<Plant, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export type PlantSortOption = 'name' | 'species' | 'category' | 'createdAt';
export type PlantSortDirection = 'asc' | 'desc';

export interface PlantFilters {
  category?: string;
  search?: string;
  sortBy?: PlantSortOption;
  sortDirection?: PlantSortDirection;
} 