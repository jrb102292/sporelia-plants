import { Plant } from '../types';

// Category mappings for plant type prefixes
const CATEGORY_PREFIXES: Record<string, string> = {
  'Aroids': 'A',
  'Cacti': 'C', 
  'Orchids': 'O',
  'Succulents': 'S',
  'Ferns': 'F',
  'Palms': 'P',
  'Tropical': 'T',
  'Native': 'N',
  'Uncategorized': 'U'
};

// Default prefix for unrecognized plant types
const DEFAULT_PREFIX = 'U';

/**
 * Gets the prefix for a plant type
 */
export function getPlantTypePrefix(plantType: string): string {
  return CATEGORY_PREFIXES[plantType] || DEFAULT_PREFIX;
}

/**
 * Alias for getPlantTypePrefix for backward compatibility
 */
export function getTypePrefix(plantType: string | undefined): string {
  if (!plantType) return DEFAULT_PREFIX;
  return CATEGORY_PREFIXES[plantType] || DEFAULT_PREFIX;
}

/**
 * Generates the next available ID for a given plant type
 */
export function nextId(plants: Plant[], plantType: string): string {
  const prefix = getPlantTypePrefix(plantType);
  
  // Find all plants with the same prefix
  const samePrefixPlants = plants
    .filter(plant => plant.id.startsWith(prefix + '-'))
    .map(plant => {
      const match = plant.id.match(/^[A-Z]-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));

  // Find the next available number
  const maxNumber = samePrefixPlants.length > 0 ? Math.max(...samePrefixPlants) : 0;
  const nextNumber = maxNumber + 1;
  
  return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
}

/**
 * Derives a child ID for cuttings/propagations from a parent plant
 */
export function deriveChildId(plants: Plant[], parentId: string): string {
  // Find all plants that are children of this parent
  const childPattern = new RegExp(`^${parentId}-C(\\d+)$`);
  const childNumbers = plants
    .filter(plant => childPattern.test(plant.id))
    .map(plant => {
      const match = plant.id.match(childPattern);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));

  // Find the next available child number
  const maxChildNumber = childNumbers.length > 0 ? Math.max(...childNumbers) : 0;
  const nextChildNumber = maxChildNumber + 1;
  
  return `${parentId}-C${nextChildNumber.toString().padStart(2, '0')}`;
}

/**
 * Validates if an ID follows the correct format
 */
export function isValidPlantId(id: string): boolean {
  // Main plant ID format: [A-Z]-[0-9]{3}
  const mainIdPattern = /^[A-Z]-\d{3}$/;
  
  // Child ID format: [A-Z]-[0-9]{3}-C[0-9]{2}
  const childIdPattern = /^[A-Z]-\d{3}-C\d{2}$/;
  
  return mainIdPattern.test(id) || childIdPattern.test(id);
}

/**
 * Extracts the plant type from an ID based on the prefix
 */
export function getPlantTypeFromId(id: string): string {
  const prefix = id.charAt(0);
  
  // Find the plant type for this prefix
  for (const [plantType, typePrefix] of Object.entries(CATEGORY_PREFIXES)) {
    if (typePrefix === prefix) {
      return plantType;
    }
  }
  
  return 'Other'; // Default plant type
}

/**
 * Checks if a plant ID represents a cutting/propagation
 */
export function isCuttingId(id: string): boolean {
  return /-C\d{2}$/.test(id);
}

/**
 * Gets the parent ID from a cutting ID
 */
export function getParentId(cuttingId: string): string | null {
  const match = cuttingId.match(/^(.+-\d{3})-C\d{2}$/);
  return match ? match[1] : null;
}