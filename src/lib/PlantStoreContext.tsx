'use client';

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { Plant } from '../types';
import * as plantService from './plantService';
import {
  PlantStoreAction,
  ASYNC_ACTION_START,
  ASYNC_ACTION_SUCCESS,
  ASYNC_ACTION_ERROR,
  CLEAR_ERROR,
  UPDATE_DYNAMIC_PLANT_TYPES,
  OPERATIONS,
  startAsyncAction,
  successAsyncAction,
  errorAsyncAction
} from './plantStoreActions';

/**
 * The state shape for the plant store
 */
export interface PlantState {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  dynamicPlantTypes: string[];
  operations: {
    [key: string]: {
      isLoading: boolean;
      error: string | null;
    };
  };
}

const initialState: PlantState = {
  plants: [],
  isLoading: false,
  error: null,
  dynamicPlantTypes: [],
  operations: {},
};

/**
 * Calculate the unique plant types from the plants array
 * @param plants Array of plants to extract types from
 * @returns Sorted array of unique plant types
 */
const calculateDynamicPlantTypes = (plants: Plant[]): string[] => {
  const types = new Set<string>();
  plants.forEach(plant => {
    types.add(plant.plantType || "Uncategorized");
  });
  
  // Sort, ensuring "Uncategorized" comes first if present, then alphabetically
  const sortedTypes = Array.from(types).sort((a, b) => {
    if (a === "Uncategorized") return -1;
    if (b === "Uncategorized") return 1;
    return a.localeCompare(b);
  });
  return sortedTypes;
};

/**
 * The reducer function for the plant store
 * Handles all plant-related state changes
 */
const plantReducer = (state: PlantState, action: PlantStoreAction): PlantState => {
  let newPlants: Plant[];
  let updatedDynamicTypes: string[];

  switch (action.type) {
    case ASYNC_ACTION_START:
      // Update both global loading state and operation-specific loading state
      return {
        ...state,
        isLoading: true,
        error: null,
        operations: {
          ...state.operations,
          [action.meta.operation]: {
            isLoading: true,
            error: null
          }
        }
      };

    case ASYNC_ACTION_SUCCESS:
      // Handle the success case based on the operation
      switch (action.meta.operation) {
        case OPERATIONS.LOAD_PLANTS:
          updatedDynamicTypes = calculateDynamicPlantTypes(action.payload);
          return {
            ...state,
            isLoading: false,
            plants: action.payload,
            dynamicPlantTypes: updatedDynamicTypes,
            error: null,
            operations: {
              ...state.operations,
              [action.meta.operation]: {
                isLoading: false,
                error: null
              }
            }
          };

        case OPERATIONS.ADD_PLANT:
          newPlants = [...state.plants, action.payload];
          updatedDynamicTypes = calculateDynamicPlantTypes(newPlants);
          return {
            ...state,
            isLoading: false,
            plants: newPlants,
            dynamicPlantTypes: updatedDynamicTypes,
            error: null,
            operations: {
              ...state.operations,
              [action.meta.operation]: {
                isLoading: false,
                error: null
              }
            }
          };

        case OPERATIONS.ADD_BULK_CUTTINGS:
          newPlants = [...state.plants, ...action.payload];
          updatedDynamicTypes = calculateDynamicPlantTypes(newPlants);
          return {
            ...state,
            isLoading: false,
            plants: newPlants,
            dynamicPlantTypes: updatedDynamicTypes,
            error: null,
            operations: {
              ...state.operations,
              [action.meta.operation]: {
                isLoading: false,
                error: null
              }
            }
          };

        case OPERATIONS.UPDATE_PLANT:
          newPlants = state.plants.map(p => 
            p.id === action.payload.id ? action.payload : p
          );
          updatedDynamicTypes = calculateDynamicPlantTypes(newPlants);
          return {
            ...state,
            isLoading: false,
            plants: newPlants,
            dynamicPlantTypes: updatedDynamicTypes,
            error: null,
            operations: {
              ...state.operations,
              [action.meta.operation]: {
                isLoading: false,
                error: null
              }
            }
          };

        case OPERATIONS.DELETE_PLANT:
          newPlants = state.plants.filter(p => p.id !== action.payload);
          updatedDynamicTypes = calculateDynamicPlantTypes(newPlants);
          return {
            ...state,
            isLoading: false,
            plants: newPlants,
            dynamicPlantTypes: updatedDynamicTypes,
            error: null,
            operations: {
              ...state.operations,
              [action.meta.operation]: {
                isLoading: false,
                error: null
              }
            }
          };

        default:
          // Generic success handler for any other operations
          return {
            ...state,
            isLoading: false,
            error: null,
            operations: {
              ...state.operations,
              [action.meta.operation]: {
                isLoading: false,
                error: null
              }
            }
          };
      }

    case ASYNC_ACTION_ERROR:
      // Handle error state for the operation
      return {
        ...state,
        isLoading: false,
        error: action.error,
        operations: {
          ...state.operations,
          [action.meta.operation]: {
            isLoading: false,
            error: action.error
          }
        }
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case UPDATE_DYNAMIC_PLANT_TYPES:
      updatedDynamicTypes = calculateDynamicPlantTypes(action.payload);
      return {
        ...state,
        dynamicPlantTypes: updatedDynamicTypes
      };

    default:
      return state;
  }
};

// Create the context with typed state and dispatch
const PlantStoreContext = createContext<{
  state: PlantState;
  dispatch: React.Dispatch<PlantStoreAction>;
} | undefined>(undefined);

interface PlantStoreProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the plant store
 * Manages plant state and provides access to dispatch
 */
export const PlantStoreProvider: React.FC<PlantStoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  // Load plants when the application starts
  useEffect(() => {
    const loadPlants = async () => {
      // Use the new action creators
      dispatch(startAsyncAction(OPERATIONS.LOAD_PLANTS));
      
      try {
        const response = await plantService.getPlants();
        if (response.data) {
          dispatch(successAsyncAction(OPERATIONS.LOAD_PLANTS, response.data));
        } else {
          dispatch(errorAsyncAction(OPERATIONS.LOAD_PLANTS, response.error || 'Failed to load plants'));
        }
      } catch (error) {
        dispatch(errorAsyncAction(OPERATIONS.LOAD_PLANTS, 'Failed to load plants'));
      }
    };

    loadPlants();
  }, []);

  return (
    <PlantStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </PlantStoreContext.Provider>
  );
};

/**
 * Hook to access the plant store
 * @returns The plant store state and dispatch function
 */
export const usePlantStore = () => {
  const context = useContext(PlantStoreContext);
  if (context === undefined) {
    throw new Error('usePlantStore must be used within a PlantStoreProvider');
  }
  return context;
};

// Export the operations for use in components
export { OPERATIONS };
