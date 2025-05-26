// src/lib/PersistenceRepository.ts

export class PersistenceRepository {
  loadAll<T>(key: string): T[] {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return [];
      }
      return JSON.parse(serializedData) as T[];
    } catch (error) {
      console.error(`Error loading all data from localStorage for key "${key}":`, error);
      return [];
    }
  }

  saveAll<T>(key: string, items: T[]): void {
    try {
      const serializedData = JSON.stringify(items);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Error saving all data to localStorage for key "${key}":`, error);
    }
  }

  // If needed, more granular methods can be added, but usually managing the full list in the store is simpler.
  // For example, if we strictly wanted to use addOne, updateOne, deleteOne here:

  addOne<T extends { id: string }>(key: string, item: T): T[] {
    const items = this.loadAll<T>(key);
    const updatedItems = [...items, item];
    this.saveAll(key, updatedItems);
    return updatedItems;
  }

  updateOne<T extends { id: string }>(key: string, updatedItem: T): T[] {
    let items = this.loadAll<T>(key);
    items = items.map(item => (item.id === updatedItem.id ? updatedItem : item));
    this.saveAll(key, items);
    return items;
  }

  deleteOne<T extends { id: string }>(key: string, itemId: string): T[] {
    let items = this.loadAll<T>(key);
    items = items.filter(item => item.id !== itemId);
    this.saveAll(key, items);
    return items;
  }
}

// Export a singleton instance
export const persistenceRepo = new PersistenceRepository();
