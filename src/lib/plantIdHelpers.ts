// Plant ID generation and manipulation helpers
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a new plant ID with optional prefix
 * @param prefix Optional prefix for the ID
 * @returns String ID for a plant
 */
export const generatePlantId = (prefix = 'plant'): string => {
  return `${prefix}_${uuidv4().substring(0, 8)}`;
};

/**
 * Extract parent plant ID from a cutting ID
 * @param cuttingId ID of the cutting plant
 * @returns Parent ID or null if not a cutting
 */
export const extractParentId = (cuttingId: string): string | null => {
  // Format: cutting_[parentId]_[timestamp]
  if (!cuttingId || !cuttingId.startsWith('cutting_')) {
    return null;
  }
  
  const parts = cuttingId.split('_');
  if (parts.length < 3) {
    return null;
  }
  
  return parts[1];
};

/**
 * Check if the given plant ID is a cutting
 * @param id Plant ID to check
 * @returns Boolean true if plant is a cutting
 */
export const isCutting = (id: string): boolean => {
  return id && id.startsWith('cutting_');
};

/**
 * Create a cutting ID from a parent plant ID
 * @param parentId ID of the parent plant
 * @returns String ID for the cutting
 */
export const createCuttingId = (parentId: string): string => {
  const timestamp = Date.now().toString().substring(6); // Last 7 digits of timestamp
  return `cutting_${parentId}_${timestamp}`;
};
