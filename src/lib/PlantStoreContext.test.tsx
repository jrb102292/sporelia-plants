import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { PlantStoreProvider, usePlantStore, OPERATIONS } from './PlantStoreContext';
import { Plant } from '../types';
import { startAsyncAction, successAsyncAction, errorAsyncAction, clearError } from './plantStoreActions';
import * as plantService from './plantService';

// Mock the plant service
jest.mock('./plantService');
const mockPlantService = plantService as jest.Mocked<typeof plantService>;

describe('PlantStoreContext', () => {
  const mockPlant: Plant = {
    id: 'A-001',
    name: 'Test Monstera',
    species: 'Monstera deliciosa',
    acquisitionDate: '2024-01-01',
    plantType: 'Aroids',
    notes: 'Test plant',
  };

  const mockCutting: Plant = {
    id: 'A-002',
    name: 'Test Monstera Cutting',
    species: 'Monstera deliciosa',
    acquisitionDate: '2024-01-15',
    plantType: 'Aroids',
    notes: 'Cutting from A-001',
    parentPlantId: 'A-001',
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PlantStoreProvider>{children}</PlantStoreProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getPlants to return empty data immediately
    mockPlantService.getPlants.mockResolvedValue({ data: [], error: null });
  });

  describe('Initial State and Provider', () => {
    it('should provide initial state correctly', async () => {
      mockPlantService.getPlants.mockResolvedValue({ data: [], error: null });

      const { result } = renderHook(() => usePlantStore(), { wrapper });

      expect(result.current.state.plants).toEqual([]);
      expect(result.current.state.isLoading).toBe(true); // Loading initially
      expect(result.current.state.error).toBe(null);
      expect(result.current.state.dynamicPlantTypes).toEqual([]);

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });
    });

    it('should load plants on mount', async () => {
      mockPlantService.getPlants.mockResolvedValue({ data: [mockPlant], error: null });

      const { result } = renderHook(() => usePlantStore(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
        expect(result.current.state.plants).toEqual([mockPlant]);
        expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
      });
    });
  });

  describe('Action Creators', () => {
    it('should handle async start action', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      act(() => {
        result.current.dispatch(startAsyncAction(OPERATIONS.ADD_PLANT));
      });

      expect(result.current.state.isLoading).toBe(true);
      expect(result.current.state.error).toBe(null);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(true);
    });

    it('should handle async success action for adding plant', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.plants).toContain(mockPlant);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(false);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.error).toBe(null);
    });

    it('should handle async error action', () => {
      const errorMessage = 'Failed to add plant';
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, errorMessage));
      });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(false);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.error).toBe(errorMessage);
    });

    it('should handle clear error action', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // First set an error
      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, 'Some error'));
      });

      expect(result.current.state.error).toBe('Some error');

      // Then clear it
      act(() => {
        result.current.dispatch(clearError());
      });

      expect(result.current.state.error).toBe(null);
    });
  });

  describe('Plant Operations', () => {
    it('should handle load plants operation', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });
      const plants = [mockPlant, mockCutting];

      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.LOAD_PLANTS, plants));
      });

      expect(result.current.state.plants).toEqual(plants);
      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
    });

    it('should handle add plant operation', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      expect(result.current.state.plants).toContain(mockPlant);
      expect(result.current.state.plants).toHaveLength(1);
      expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
    });

    it('should handle bulk cuttings success', () => {
      const bulkCuttings = [mockCutting, { ...mockCutting, id: 'A-003' }];
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // First add the parent plant
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      // Then add bulk cuttings
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_BULK_CUTTINGS, bulkCuttings));
      });

      expect(result.current.state.plants).toHaveLength(3);
      expect(result.current.state.plants).toContain(mockPlant);
      expect(result.current.state.plants).toContain(bulkCuttings[0]);
      expect(result.current.state.plants).toContain(bulkCuttings[1]);
    });

    it('should handle plant update', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // First add a plant
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      // Then update it
      const updatedPlant = { ...mockPlant, name: 'Updated Monstera' };
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.UPDATE_PLANT, updatedPlant, updatedPlant.id));
      });

      expect(result.current.state.plants[0].name).toBe('Updated Monstera');
      expect(result.current.state.plants).toHaveLength(1);
    });

    it('should handle plant deletion', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // First add a plant
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      expect(result.current.state.plants).toHaveLength(1);

      // Then delete it
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.DELETE_PLANT, mockPlant.id));
      });

      expect(result.current.state.plants).toHaveLength(0);
    });

    it('should handle load plants error', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });
      const errorMessage = 'Failed to load plants';

      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.LOAD_PLANTS, errorMessage));
      });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.operations[OPERATIONS.LOAD_PLANTS]?.error).toBe(errorMessage);
    });

    it('should handle add plant error', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });
      const errorMessage = 'Failed to add plant';

      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, errorMessage));
      });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.error).toBe(errorMessage);
    });

    it('should handle update plant error', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });
      const errorMessage = 'Failed to update plant';

      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.UPDATE_PLANT, errorMessage));
      });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.operations[OPERATIONS.UPDATE_PLANT]?.error).toBe(errorMessage);
    });

    it('should handle delete plant error', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });
      const errorMessage = 'Failed to delete plant';

      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.DELETE_PLANT, errorMessage));
      });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.operations[OPERATIONS.DELETE_PLANT]?.error).toBe(errorMessage);
    });
  });

  describe('Dynamic Plant Types', () => {
    it('should calculate dynamic plant types correctly', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      const plantWithoutType = { ...mockPlant, plantType: undefined };
      const plants = [mockPlant, plantWithoutType];

      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.LOAD_PLANTS, plants));
      });

      expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
      expect(result.current.state.dynamicPlantTypes).toContain('Uncategorized');
      expect(result.current.state.dynamicPlantTypes[0]).toBe('Uncategorized'); // Should be first
    });

    it('should update dynamic plant types when plants are added', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // Start with empty state
      expect(result.current.state.dynamicPlantTypes).toEqual([]);

      // Add a plant with a new type
      const cactiPlant = { ...mockPlant, id: 'B-001', plantType: 'Cacti' };
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, cactiPlant, cactiPlant.id));
      });

      expect(result.current.state.dynamicPlantTypes).toContain('Cacti');

      // Add another plant with the existing type
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
      expect(result.current.state.dynamicPlantTypes).toContain('Cacti');
    });

    it('should update dynamic plant types when plants are deleted', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // Add plants with different types
      const cactiPlant = { ...mockPlant, id: 'B-001', plantType: 'Cacti' };
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, cactiPlant, cactiPlant.id));
      });

      expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
      expect(result.current.state.dynamicPlantTypes).toContain('Cacti');

      // Delete one type
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.DELETE_PLANT, 'B-001'));
      });

      expect(result.current.state.dynamicPlantTypes).toContain('Aroids');
      expect(result.current.state.dynamicPlantTypes).not.toContain('Cacti');
    });
  });

  describe('Operations State Tracking', () => {
    it('should track loading state for specific operations', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // Start add plant operation
      act(() => {
        result.current.dispatch(startAsyncAction(OPERATIONS.ADD_PLANT));
      });

      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(true);
      expect(result.current.state.operations[OPERATIONS.UPDATE_PLANT]?.isLoading).toBeUndefined();

      // Start update plant operation
      act(() => {
        result.current.dispatch(startAsyncAction(OPERATIONS.UPDATE_PLANT, 'A-001'));
      });

      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(true);
      expect(result.current.state.operations[OPERATIONS.UPDATE_PLANT]?.isLoading).toBe(true);
    });

    it('should track errors for specific operations', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      const addError = 'Failed to add plant';
      const updateError = 'Failed to update plant';

      // Set errors for different operations
      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, addError));
      });
      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.UPDATE_PLANT, updateError));
      });

      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.error).toBe(addError);
      expect(result.current.state.operations[OPERATIONS.UPDATE_PLANT]?.error).toBe(updateError);
    });

    it('should clear operation state on success', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // Start operation with error
      act(() => {
        result.current.dispatch(startAsyncAction(OPERATIONS.ADD_PLANT));
      });
      act(() => {
        result.current.dispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, 'Some error'));
      });

      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(false);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.error).toBe('Some error');

      // Success should clear the error
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.isLoading).toBe(false);
      expect(result.current.state.operations[OPERATIONS.ADD_PLANT]?.error).toBe(null);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed plant data gracefully', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      const malformedPlant = { ...mockPlant, plantType: null } as any;

      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, malformedPlant, malformedPlant.id));
      });

      expect(result.current.state.plants).toContain(malformedPlant);
      expect(result.current.state.dynamicPlantTypes).toContain('Uncategorized');
    });

    it('should handle updating non-existent plant', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // Add a plant first
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      // Try to update a different plant that doesn't exist
      const nonExistentPlant = { ...mockPlant, id: 'Z-999', name: 'Non-existent' };
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.UPDATE_PLANT, nonExistentPlant, nonExistentPlant.id));
      });

      // Should add the plant instead of updating
      expect(result.current.state.plants).toHaveLength(2);
      expect(result.current.state.plants.find(p => p.id === 'Z-999')).toBeDefined();
    });

    it('should handle deleting non-existent plant', () => {
      const { result } = renderHook(() => usePlantStore(), { wrapper });

      // Add a plant
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.ADD_PLANT, mockPlant, mockPlant.id));
      });

      expect(result.current.state.plants).toHaveLength(1);

      // Try to delete a plant that doesn't exist
      act(() => {
        result.current.dispatch(successAsyncAction(OPERATIONS.DELETE_PLANT, 'Z-999'));
      });

      // Should not change anything
      expect(result.current.state.plants).toHaveLength(1);
      expect(result.current.state.plants[0]).toEqual(mockPlant);
    });
  });
});
