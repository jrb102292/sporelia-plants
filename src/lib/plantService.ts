import { Plant, ServiceResponse } from '../types';
import FirebasePlantRepository from './FirebasePlantRepository';
import { deriveChildId } from './plantIdHelpers';
import { withErrorHandling } from './serviceUtils';

const plantRepo = FirebasePlantRepository;

export const getPlants = async (): Promise<ServiceResponse<Plant[]>> => {
  return withErrorHandling(
    async () => {
      return await plantRepo.getAll();
    },
    "plantService.getPlants"
  );
};

export const addPlant = async (plantData: Omit<Plant, 'id'>): Promise<ServiceResponse<Plant>> => {
  return withErrorHandling(
    async () => {
      // Create plant without custom ID first - let Firebase assign one
      const plantWithoutId = { ...plantData } as Plant;
      return await plantRepo.save(plantWithoutId);
    },
    "plantService.addPlant"
  );
};

export const addCutting = async (parentId: string, plantData: Omit<Plant, 'id'>, existingPlants: Plant[]): Promise<ServiceResponse<Plant>> => {
  return withErrorHandling(
    async () => {
      // Generate child ID for cutting
      const id = deriveChildId(existingPlants, parentId);
      const newCutting: Plant = { ...plantData, id, parentPlantId: parentId };
      
      return await plantRepo.save(newCutting);
    },
    "plantService.addCutting"
  );
};

export const addBulkCuttings = async (parentId: string, plantData: Omit<Plant, 'id'>, count: number, existingPlants: Plant[]): Promise<ServiceResponse<Plant[]>> => {
  return withErrorHandling(
    async () => {
      const newCuttings: Plant[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate unique child ID for each cutting
        const id = deriveChildId([...existingPlants, ...newCuttings], parentId);
        const newCutting: Plant = { 
          ...plantData, 
          id, 
          parentPlantId: parentId,
          name: `${plantData.name} Cutting ${i + 1}`
        };
        
        const savedCutting = await plantRepo.save(newCutting);
        newCuttings.push(savedCutting);
      }
      
      return newCuttings;
    },
    "plantService.addBulkCuttings"
  );
};

export const updatePlant = async (updatedPlant: Plant): Promise<ServiceResponse<Plant>> => {
  return withErrorHandling(
    async () => {
      return await plantRepo.save(updatedPlant);
    },
    "plantService.updatePlant"
  );
};

export const deletePlant = async (plantId: string): Promise<ServiceResponse<string>> => {
  return withErrorHandling(
    async () => {
      const success = await plantRepo.delete(plantId);
      if (success) {
        return plantId;
      } else {
        throw new Error("Plant not found.");
      }
    },
    "plantService.deletePlant"
  );
};

export const getPlantById = async (plantId: string): Promise<ServiceResponse<Plant | null>> => {
  return withErrorHandling(
    async () => {
      const plant = await plantRepo.getById(plantId);
      if (plant) {
        return plant;
      } else {
        throw new Error("Failed to find plant.");
      }
    },
    "plantService.getPlantById"
  );
};
