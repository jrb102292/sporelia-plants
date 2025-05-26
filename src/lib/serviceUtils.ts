// Service utilities for error handling and processing
import { Plant } from '../types';

export const processApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
  return response.json();
};

export const handleServiceError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    console.error(error.message);
    return error.message;
  } else {
    console.error(defaultMessage, error);
    return defaultMessage;
  }
};

export const extractPlantTypes = (plants: Plant[]): string[] => {
  const types = plants
    .map(plant => plant.plantType || 'Uncategorized')
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();
  
  return types;
};
