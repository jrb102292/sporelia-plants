import { ServiceResponse } from '../types';

/**
 * A utility function that wraps service operations with standardized error handling.
 * 
 * @param operation A function that performs the core service operation
 * @param operationName A descriptive name for logging and error messages
 * @returns A standardized ServiceResponse object
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<ServiceResponse<T>> {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
    
    // MVP: Handle specific error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage === "Plant not found.") {
      return { data: null, error: "Plant not found." };
    }
    
    // MVP: Use simple, user-friendly error messages
    const simpleMessages: Record<string, string> = {
      'plantService.getPlants': 'Failed to load plants.',
      'plantService.addPlant': 'Failed to add plant.',
      'plantService.addCutting': 'Failed to add cutting.',
      'plantService.addBulkCuttings': 'Failed to add bulk cuttings.',
      'plantService.updatePlant': 'Failed to update plant.',
      'plantService.deletePlant': 'Failed to delete plant.',
      'plantService.getPlantById': 'Failed to find plant.'
    };
    
    return { data: null, error: simpleMessages[operationName] || `Failed to ${operationName.toLowerCase()}.` };
  }
}
