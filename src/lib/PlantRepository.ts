import { Plant } from '../types';

/**
 * The storage key used for localStorage
 * @private
 */
const STORAGE_KEY = 'sporelia_plants';

/**
 * PlantRepository provides a data access layer for plant operations.
 * 
 * This class follows the Repository Pattern to abstract the data source.
 * Currently using localStorage, but designed to be easily replaced with
 * a real database implementation in the future.
 * 
 * Usage:
 * - Use the singleton instance: PlantRepository.getInstance()
 * - Call methods like: await plantRepo.getAll(), await plantRepo.save(plant)
 * 
 * Future database migration:
 * When moving to a real database, implement the same methods with proper DB calls
 * while maintaining the same interface. This will minimize changes to service layers.
 */
export class PlantRepository {
  private static instance: PlantRepository;

  /**
   * Storage adapter - currently localStorage
   * When migrating to a real database, this would be replaced with a DB connection/client
   * @private
   */
  private constructor() {
    // In future DB implementation, connection initialization would go here
  }

  /**
   * Gets the singleton instance of PlantRepository
   * This ensures only one instance exists during the application lifecycle
   */
  static getInstance(): PlantRepository {
    if (!PlantRepository.instance) {
      PlantRepository.instance = new PlantRepository();
    }
    return PlantRepository.instance;
  }

  /**
   * Retrieves all plants from storage
   * 
   * @returns Promise resolving to an array of Plant objects
   */
  async getAll(): Promise<Plant[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading plants from localStorage:', error);
      return [];
    }
  }

  /**
   * Gets a single plant by its ID
   * 
   * @param id - The unique identifier of the plant
   * @returns Promise resolving to the plant or null if not found
   */
  async getById(id: string): Promise<Plant | null> {
    const plants = await this.getAll();
    return plants.find(plant => plant.id === id) || null;
  }

  /**
   * Saves a plant to storage
   * If the plant exists (has same ID), it will be updated
   * If the plant doesn't exist, it will be added
   * 
   * @param plant - The plant object to save
   * @returns Promise resolving to the saved plant
   */
  async save(plant: Plant): Promise<Plant> {
    const plants = await this.getAll();
    const existingIndex = plants.findIndex(p => p.id === plant.id);
    
    if (existingIndex >= 0) {
      plants[existingIndex] = plant;
    } else {
      plants.push(plant);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    } catch (error) {
      console.error('Error saving plants to localStorage:', error);
    }
    return plant;
  }

  /**
   * Deletes a plant from storage by its ID
   * 
   * @param id - The unique identifier of the plant to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const plants = await this.getAll();
    const filteredPlants = plants.filter(plant => plant.id !== id);
    
    if (filteredPlants.length === plants.length) {
      return false; // Plant not found
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlants));
    } catch (error) {
      console.error('Error saving plants to localStorage:', error);
    }
    return true;
  }

  /**
   * Clears all plants from storage
   * 
   * @returns Promise resolving when operation is complete
   */
  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing plants from localStorage:', error);
    }
  }

  /**
   * Saves multiple plants at once, replacing all existing plants
   * 
   * @param plants - Array of plant objects to save
   * @returns Promise resolving to the saved plants array
   */
  async saveAll(plants: Plant[]): Promise<Plant[]> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    } catch (error) {
      console.error('Error saving plants to localStorage:', error);
    }
    return plants;
  }
}

/**
 * The default singleton instance of the PlantRepository.
 * Use this for all plant data operations.
 * 
 * Example:
 * ```typescript
 * import plantRepo from './PlantRepository';
 * 
 * // Get all plants
 * const plants = await plantRepo.getAll();
 * 
 * // Save a plant
 * await plantRepo.save(myPlant);
 * ```
 */
export default PlantRepository.getInstance();
