import { PlantRepository } from './PlantRepository';
import { Plant } from '../types';

// Mock localStorage with more robust implementation
const createLocalStorageMock = () => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

const localStorageMock = createLocalStorageMock();

// Override global localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('PlantRepository', () => {
  let repository: PlantRepository;
  const mockPlant: Plant = {
    id: 'A-001',
    name: 'Test Monstera',
    species: 'Monstera deliciosa',
    acquisitionDate: '2024-01-01',
    plantType: 'Aroids',
    notes: 'Test plant for repository testing',
  };

  beforeEach(() => {
    // Reset all mocks and internal store
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Reset singleton instance to ensure fresh state
    (PlantRepository as any).instance = undefined;
    
    // Get fresh instance for each test
    repository = PlantRepository.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PlantRepository.getInstance();
      const instance2 = PlantRepository.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getAll', () => {
    it('should return empty array when localStorage is empty', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const plants = await repository.getAll();
      
      expect(plants).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('sporelia_plants');
    });

    it('should return parsed plants from localStorage', async () => {
      const mockPlants = [mockPlant];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPlants));
      
      const plants = await repository.getAll();
      
      expect(plants).toEqual(mockPlants);
    });

    it('should handle JSON parse errors gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const plants = await repository.getAll();
      
      expect(plants).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading plants from localStorage:', 
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle localStorage access errors', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const plants = await repository.getAll();
      
      expect(plants).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getById', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockPlant]));
    });

    it('should return plant when found', async () => {
      const plant = await repository.getById('A-001');
      
      expect(plant).toEqual(mockPlant);
    });

    it('should return null when plant not found', async () => {
      const plant = await repository.getById('B-001');
      
      expect(plant).toBeNull();
    });

    it('should handle empty storage', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const plant = await repository.getById('A-001');
      
      expect(plant).toBeNull();
    });
  });

  describe('save', () => {
    it('should add new plant to empty storage', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const savedPlant = await repository.save(mockPlant);
      
      expect(savedPlant).toEqual(mockPlant);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sporelia_plants',
        JSON.stringify([mockPlant])
      );
    });

    it('should add new plant to existing plants', async () => {
      const existingPlant: Plant = { ...mockPlant, id: 'A-002' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingPlant]));
      
      const savedPlant = await repository.save(mockPlant);
      
      expect(savedPlant).toEqual(mockPlant);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sporelia_plants',
        JSON.stringify([existingPlant, mockPlant])
      );
    });

    it('should update existing plant', async () => {
      const updatedPlant = { ...mockPlant, name: 'Updated Monstera' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockPlant]));
      
      const savedPlant = await repository.save(updatedPlant);
      
      expect(savedPlant).toEqual(updatedPlant);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sporelia_plants',
        JSON.stringify([updatedPlant])
      );
    });    it('should handle storage errors during save', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue(null);
      
      // Create a temporary mock that throws an error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      // Should not throw error but log it
      const savedPlant = await repository.save(mockPlant);
      expect(savedPlant).toEqual(mockPlant);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving plants to localStorage:',
        expect.any(Error)
      );
      
      // Restore original mock
      localStorageMock.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      const plants = [mockPlant, { ...mockPlant, id: 'A-002', name: 'Second Plant' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(plants));
    });

    it('should delete existing plant', async () => {
      const result = await repository.delete('A-001');
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sporelia_plants',
        JSON.stringify([{ ...mockPlant, id: 'A-002', name: 'Second Plant' }])
      );
    });

    it('should return false when plant not found', async () => {
      const result = await repository.delete('B-001');
      
      expect(result).toBe(false);
      // Should not call setItem when no deletion occurred
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should handle empty storage', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = await repository.delete('A-001');
      
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all plants from storage', async () => {
      await repository.clear();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('sporelia_plants');
    });
  });

  describe('saveAll', () => {
    it('should save array of plants to storage', async () => {
      const plants = [mockPlant, { ...mockPlant, id: 'A-002' }];
      
      const result = await repository.saveAll(plants);
      
      expect(result).toEqual(plants);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sporelia_plants',
        JSON.stringify(plants)
      );
    });

    it('should handle empty array', async () => {
      const result = await repository.saveAll([]);
      
      expect(result).toEqual([]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sporelia_plants',
        JSON.stringify([])
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large plant collections', async () => {
      const largePlantCollection = Array.from({ length: 1000 }, (_, i) => ({
        ...mockPlant,
        id: `A-${String(i + 1).padStart(3, '0')}`,
        name: `Plant ${i + 1}`,
      }));
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(largePlantCollection));
      
      const plants = await repository.getAll();
      expect(plants).toHaveLength(1000);
    });

    it('should handle plants with special characters in data', async () => {
      const specialCharPlant: Plant = {
        ...mockPlant,
        name: '🌱 Test Plant with émojis & spëcial chars',
        notes: 'Notes with "quotes" and \'apostrophes\' and \n newlines',
      };
      
      localStorageMock.getItem.mockReturnValue(null);
      
      await repository.save(specialCharPlant);
      
      const saveCall = localStorageMock.setItem.mock.calls[0];
      expect(() => JSON.parse(saveCall[1])).not.toThrow();
    });

    it('should handle corrupted localStorage data', async () => {
      localStorageMock.getItem.mockReturnValue('{"incomplete": json}');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const plants = await repository.getAll();
      
      expect(plants).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle plants without required fields', async () => {
      const incompletePlant = {
        id: 'A-001',
        name: 'Incomplete Plant',
        // Missing required fields like species, acquisitionDate
      } as Plant;
      
      localStorageMock.getItem.mockReturnValue(null);
      
      const savedPlant = await repository.save(incompletePlant);
      expect(savedPlant).toEqual(incompletePlant);
    });
  });
});
