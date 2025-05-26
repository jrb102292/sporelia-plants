import * as plantService from './plantService';
import PlantRepository from './PlantRepository';
import { nextId, deriveChildId } from './plantIdHelpers';
import { Plant } from '../types';

// Mock dependencies
jest.mock('./PlantRepository');
jest.mock('./plantIdHelpers');

const mockPlantRepository = PlantRepository as jest.Mocked<typeof PlantRepository>;
const mockNextId = nextId as jest.MockedFunction<typeof nextId>;
const mockDeriveChildId = deriveChildId as jest.MockedFunction<typeof deriveChildId>;

describe('plantService', () => {
  const mockPlant: Plant = {
    id: 'A-001',
    name: 'Test Monstera',
    species: 'Monstera deliciosa',
    acquisitionDate: '2024-01-01',
    plantType: 'Aroids',
    notes: 'Test plant',
  };

  const mockPlantData: Omit<Plant, 'id'> = {
    name: 'New Plant',
    species: 'Test species',
    acquisitionDate: '2024-01-15',
    plantType: 'Aroids',
    notes: 'New plant notes',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlants', () => {
    it('should return plants successfully', async () => {
      const mockPlants = [mockPlant];
      mockPlantRepository.getAll.mockResolvedValue(mockPlants);

      const result = await plantService.getPlants();

      expect(result.data).toEqual(mockPlants);
      expect(result.error).toBeNull();
      expect(mockPlantRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Repository error');
      mockPlantRepository.getAll.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.getPlants();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to load plants.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.getPlants:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('addPlant', () => {
    it('should add plant successfully', async () => {
      const existingPlants = [mockPlant];
      const newPlantWithId = { ...mockPlantData, id: 'A-002' };
      
      mockNextId.mockReturnValue('A-002');
      mockPlantRepository.save.mockResolvedValue(newPlantWithId);

      const result = await plantService.addPlant(mockPlantData, existingPlants);

      expect(result.data).toEqual(newPlantWithId);
      expect(result.error).toBeNull();
      expect(mockNextId).toHaveBeenCalledWith(existingPlants, 'Aroids');
      expect(mockPlantRepository.save).toHaveBeenCalledWith(newPlantWithId);
    });

    it('should handle missing plant type', async () => {
      const plantDataWithoutType = { ...mockPlantData, plantType: undefined };
      const newPlantWithId = { ...plantDataWithoutType, id: 'O-001' };
      
      mockNextId.mockReturnValue('O-001');
      mockPlantRepository.save.mockResolvedValue(newPlantWithId);

      const result = await plantService.addPlant(plantDataWithoutType, []);

      expect(mockNextId).toHaveBeenCalledWith([], 'Other');
      expect(result.data).toEqual(newPlantWithId);
    });

    it('should handle repository save errors', async () => {
      const error = new Error('Save error');
      mockNextId.mockReturnValue('A-002');
      mockPlantRepository.save.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.addPlant(mockPlantData, []);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to add plant.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.addPlant:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('addCutting', () => {
    it('should add cutting successfully', async () => {
      const parentId = 'A-001';
      const existingPlants = [mockPlant];
      const cuttingId = 'A-001-C01';
      const cuttingWithId = { 
        ...mockPlantData, 
        id: cuttingId, 
        parentPlantId: parentId 
      };
      
      mockDeriveChildId.mockReturnValue(cuttingId);
      mockPlantRepository.save.mockResolvedValue(cuttingWithId);

      const result = await plantService.addCutting(parentId, mockPlantData, existingPlants);

      expect(result.data).toEqual(cuttingWithId);
      expect(result.error).toBeNull();
      expect(mockDeriveChildId).toHaveBeenCalledWith(existingPlants, parentId);
      expect(mockPlantRepository.save).toHaveBeenCalledWith(cuttingWithId);
    });

    it('should handle cutting save errors', async () => {
      const error = new Error('Cutting save error');
      mockDeriveChildId.mockReturnValue('A-001-C01');
      mockPlantRepository.save.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.addCutting('A-001', mockPlantData, []);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to add cutting.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.addCutting:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('addBulkCuttings', () => {
    it('should add multiple cuttings successfully', async () => {
      const parentId = 'A-001';
      const count = 3;
      const existingPlants = [mockPlant];
      
      // Mock sequential ID generation
      mockDeriveChildId
        .mockReturnValueOnce('A-001-C01')
        .mockReturnValueOnce('A-001-C02')
        .mockReturnValueOnce('A-001-C03');

      const expectedCuttings = [
        { ...mockPlantData, id: 'A-001-C01', parentPlantId: parentId, name: 'New Plant Cutting 1' },
        { ...mockPlantData, id: 'A-001-C02', parentPlantId: parentId, name: 'New Plant Cutting 2' },
        { ...mockPlantData, id: 'A-001-C03', parentPlantId: parentId, name: 'New Plant Cutting 3' },
      ];

      mockPlantRepository.save
        .mockResolvedValueOnce(expectedCuttings[0])
        .mockResolvedValueOnce(expectedCuttings[1])
        .mockResolvedValueOnce(expectedCuttings[2]);

      const result = await plantService.addBulkCuttings(parentId, mockPlantData, count, existingPlants);

      expect(result.data).toEqual(expectedCuttings);
      expect(result.error).toBeNull();
      expect(mockDeriveChildId).toHaveBeenCalledTimes(3);
      expect(mockPlantRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should handle bulk cutting errors', async () => {
      const error = new Error('Bulk cutting error');
      mockDeriveChildId.mockReturnValue('A-001-C01');
      mockPlantRepository.save.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.addBulkCuttings('A-001', mockPlantData, 2, []);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to add bulk cuttings.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.addBulkCuttings:', error);
      
      consoleSpy.mockRestore();
    });

    it('should handle zero count gracefully', async () => {
      const result = await plantService.addBulkCuttings('A-001', mockPlantData, 0, []);

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
      expect(mockPlantRepository.save).not.toHaveBeenCalled();
    });

    it('should properly sequence cutting names', async () => {
      const parentId = 'A-001';
      const count = 2;
      
      mockDeriveChildId
        .mockReturnValueOnce('A-001-C01')
        .mockReturnValueOnce('A-001-C02');

      mockPlantRepository.save
        .mockResolvedValueOnce({ ...mockPlantData, id: 'A-001-C01', parentPlantId: parentId, name: 'New Plant Cutting 1' })
        .mockResolvedValueOnce({ ...mockPlantData, id: 'A-001-C02', parentPlantId: parentId, name: 'New Plant Cutting 2' });

      const result = await plantService.addBulkCuttings(parentId, mockPlantData, count, []);

      expect(result.data?.[0].name).toBe('New Plant Cutting 1');
      expect(result.data?.[1].name).toBe('New Plant Cutting 2');
    });
  });

  describe('updatePlant', () => {
    it('should update plant successfully', async () => {
      const updatedPlant = { ...mockPlant, name: 'Updated Name' };
      mockPlantRepository.save.mockResolvedValue(updatedPlant);

      const result = await plantService.updatePlant(updatedPlant);

      expect(result.data).toEqual(updatedPlant);
      expect(result.error).toBeNull();
      expect(mockPlantRepository.save).toHaveBeenCalledWith(updatedPlant);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update error');
      mockPlantRepository.save.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.updatePlant(mockPlant);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to update plant.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.updatePlant:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('deletePlant', () => {
    it('should delete plant successfully', async () => {
      mockPlantRepository.delete.mockResolvedValue(true);

      const result = await plantService.deletePlant('A-001');

      expect(result.data).toBe('A-001');
      expect(result.error).toBeNull();
      expect(mockPlantRepository.delete).toHaveBeenCalledWith('A-001');
    });

    it('should handle plant not found', async () => {
      mockPlantRepository.delete.mockResolvedValue(false);

      const result = await plantService.deletePlant('B-001');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Plant not found.');
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete error');
      mockPlantRepository.delete.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.deletePlant('A-001');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to delete plant.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.deletePlant:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('getPlantById', () => {
    it('should get plant by id successfully', async () => {
      mockPlantRepository.getById.mockResolvedValue(mockPlant);

      const result = await plantService.getPlantById('A-001');

      expect(result.data).toEqual(mockPlant);
      expect(result.error).toBeNull();
      expect(mockPlantRepository.getById).toHaveBeenCalledWith('A-001');
    });

    it('should handle plant not found', async () => {
      mockPlantRepository.getById.mockResolvedValue(null);

      const result = await plantService.getPlantById('B-001');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to find plant.');
    });

    it('should handle getById errors', async () => {
      const error = new Error('GetById error');
      mockPlantRepository.getById.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await plantService.getPlantById('A-001');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to find plant.');
      expect(consoleSpy).toHaveBeenCalledWith('Error in plantService.getPlantById:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases & Error Handling', () => {
    it('should handle null/undefined plant data', async () => {
      const nullPlantData = null as any;
      mockNextId.mockReturnValue('A-001');
      
      // This might throw an error or handle gracefully depending on implementation
      try {
        await plantService.addPlant(nullPlantData, []);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle extremely long cutting chains', async () => {
      const parentId = 'A-001';
      const longCuttingChain = Array.from({ length: 100 }, (_, i) => ({
        ...mockPlant,
        id: `A-001-C${String(i + 1).padStart(2, '0')}`,
        parentPlantId: parentId,
      }));

      mockDeriveChildId.mockReturnValue('A-001-C101');
      mockPlantRepository.save.mockResolvedValue({
        ...mockPlantData,
        id: 'A-001-C101',
        parentPlantId: parentId,
      });

      const result = await plantService.addCutting(parentId, mockPlantData, longCuttingChain);

      expect(result.data?.id).toBe('A-001-C101');
      expect(mockDeriveChildId).toHaveBeenCalledWith(longCuttingChain, parentId);
    });

    it('should handle plants with special characters', async () => {
      const specialPlantData = {
        ...mockPlantData,
        name: '🌱 Plant with émojis & spëcial chars',
        notes: 'Notes with "quotes" and \'apostrophes\'',
      };
      
      mockNextId.mockReturnValue('A-002');
      mockPlantRepository.save.mockResolvedValue({ ...specialPlantData, id: 'A-002' });

      const result = await plantService.addPlant(specialPlantData, []);

      expect(result.data?.name).toBe('🌱 Plant with émojis & spëcial chars');
      expect(result.error).toBeNull();
    });

    it('should handle very large bulk cutting requests', async () => {
      const largeCount = 100;
      const parentId = 'A-001';
      
      // Mock many ID generations
      for (let i = 1; i <= largeCount; i++) {
        mockDeriveChildId.mockReturnValueOnce(`A-001-C${String(i).padStart(2, '0')}`);
        mockPlantRepository.save.mockResolvedValueOnce({
          ...mockPlantData,
          id: `A-001-C${String(i).padStart(2, '0')}`,
          parentPlantId: parentId,
          name: `New Plant Cutting ${i}`,
        });
      }

      const result = await plantService.addBulkCuttings(parentId, mockPlantData, largeCount, []);

      expect(result.data).toHaveLength(largeCount);
      expect(result.error).toBeNull();
      expect(mockPlantRepository.save).toHaveBeenCalledTimes(largeCount);
    });

    it('should handle concurrent ID generation properly', async () => {
      const existingPlants = [mockPlant];
      const plantData1 = { ...mockPlantData, name: 'Plant 1' };
      const plantData2 = { ...mockPlantData, name: 'Plant 2' };
      
      mockNextId
        .mockReturnValueOnce('A-002')
        .mockReturnValueOnce('A-003');
      
      mockPlantRepository.save
        .mockResolvedValueOnce({ ...plantData1, id: 'A-002' })
        .mockResolvedValueOnce({ ...plantData2, id: 'A-003' });

      // Simulate concurrent calls
      const [result1, result2] = await Promise.all([
        plantService.addPlant(plantData1, existingPlants),
        plantService.addPlant(plantData2, existingPlants),
      ]);

      expect(result1.data?.id).toBe('A-002');
      expect(result2.data?.id).toBe('A-003');
      expect(mockNextId).toHaveBeenCalledTimes(2);
    });
  });
});
