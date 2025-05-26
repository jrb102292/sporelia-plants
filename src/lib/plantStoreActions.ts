import { Plant } from '../types';

// Action types
export const ASYNC_ACTION_START = 'ASYNC_ACTION_START';
export const ASYNC_ACTION_SUCCESS = 'ASYNC_ACTION_SUCCESS';
export const ASYNC_ACTION_ERROR = 'ASYNC_ACTION_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const UPDATE_DYNAMIC_PLANT_TYPES = 'UPDATE_DYNAMIC_PLANT_TYPES';

// Operation names for metadata
export const OPERATIONS = {
  LOAD_PLANTS: 'LOAD_PLANTS',
  ADD_PLANT: 'ADD_PLANT',
  ADD_BULK_CUTTINGS: 'ADD_BULK_CUTTINGS',
  UPDATE_PLANT: 'UPDATE_PLANT',
  DELETE_PLANT: 'DELETE_PLANT',
};

// Basic action interfaces
export interface AsyncActionStart {
  type: typeof ASYNC_ACTION_START;
  meta: {
    operation: string;
    entityId?: string;
  };
}

export interface AsyncActionSuccess<T> {
  type: typeof ASYNC_ACTION_SUCCESS;
  payload: T;
  meta: {
    operation: string;
    entityId?: string;
  };
}

export interface AsyncActionError {
  type: typeof ASYNC_ACTION_ERROR;
  error: string;
  meta: {
    operation: string;
    entityId?: string;
  };
}

export interface ClearErrorAction {
  type: typeof CLEAR_ERROR;
}

export interface UpdateDynamicPlantTypesAction {
  type: typeof UPDATE_DYNAMIC_PLANT_TYPES;
  payload: Plant[];
}

// Union type for all possible actions
export type PlantStoreAction = 
  | AsyncActionStart
  | AsyncActionSuccess<any>
  | AsyncActionError
  | ClearErrorAction
  | UpdateDynamicPlantTypesAction;

// Action creators
export const startAsyncAction = (operation: string, entityId?: string): AsyncActionStart => ({
  type: ASYNC_ACTION_START,
  meta: { operation, entityId }
});

export const successAsyncAction = <T>(operation: string, payload: T, entityId?: string): AsyncActionSuccess<T> => ({
  type: ASYNC_ACTION_SUCCESS,
  payload,
  meta: { operation, entityId }
});

export const errorAsyncAction = (operation: string, error: string, entityId?: string): AsyncActionError => ({
  type: ASYNC_ACTION_ERROR,
  error,
  meta: { operation, entityId }
});

export const clearError = (): ClearErrorAction => ({
  type: CLEAR_ERROR
});

export const updateDynamicPlantTypes = (plants: Plant[]): UpdateDynamicPlantTypesAction => ({
  type: UPDATE_DYNAMIC_PLANT_TYPES,
  payload: plants
});
