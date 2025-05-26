import { Plant, PlantFormData, PlantFilters } from '@/types/plant';
import { persistenceRepo } from '@/lib/PersistenceRepository';

const PLANTS_STORAGE_KEY = 'plants';

export const plantService = {
  getAll: (): Plant[] => {
    return persistenceRepo.loadAll<Plant>(PLANTS_STORAGE_KEY);
  },

  getById: (id: string): Plant | undefined => {
    const plants = persistenceRepo.loadAll<Plant>(PLANTS_STORAGE_KEY);
    return plants.find(plant => plant.id === id);
  },

  create: (plantData: PlantFormData): Plant => {
    const plants = persistenceRepo.loadAll<Plant>(PLANTS_STORAGE_KEY);
    const newPlant: Plant = {
      ...plantData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    persistenceRepo.addOne(PLANTS_STORAGE_KEY, newPlant);
    return newPlant;
  },

  update: (id: string, plantData: PlantFormData): Plant | undefined => {
    const plants = persistenceRepo.loadAll<Plant>(PLANTS_STORAGE_KEY);
    const existingPlant = plants.find(plant => plant.id === id);
    
    if (!existingPlant) return undefined;

    const updatedPlant: Plant = {
      ...existingPlant,
      ...plantData,
      updatedAt: new Date().toISOString(),
    };

    persistenceRepo.updateOne(PLANTS_STORAGE_KEY, updatedPlant);
    return updatedPlant;
  },

  delete: (id: string): boolean => {
    const plants = persistenceRepo.loadAll<Plant>(PLANTS_STORAGE_KEY);
    const plantExists = plants.some(plant => plant.id === id);
    
    if (!plantExists) return false;

    persistenceRepo.deleteOne(PLANTS_STORAGE_KEY, id);
    return true;
  },

  filter: (filters: PlantFilters): Plant[] => {
    let plants = persistenceRepo.loadAll<Plant>(PLANTS_STORAGE_KEY);

    if (filters.category) {
      plants = plants.filter(plant => plant.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      plants = plants.filter(
        plant =>
          plant.name.toLowerCase().includes(searchLower) ||
          plant.species.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sortBy) {
      plants.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];
        
        if (filters.sortDirection === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return plants;
  },
}; 