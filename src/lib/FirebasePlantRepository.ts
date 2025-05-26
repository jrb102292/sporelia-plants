// Firebase-powered Plant Repository for scalable plant management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy,
  where,
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';
import { Plant } from '../types';

// Helper function to generate a plant ID
function generatePlantId(plantType: string, isCutting: boolean = false, parentId?: string): string {
  // Get first two letters of plant type, uppercase
  const prefix = plantType.substring(0, 2).toUpperCase();
  
  // Generate a timestamp-based number (last 6 digits)
  const timestamp = Date.now().toString().slice(-6);
  
  // Add cutting indicator and parent ID if it's a cutting
  const cuttingSuffix = isCutting ? `-C${parentId ? parentId.slice(-4) : ''}` : '';
  
  return `${prefix}${timestamp}${cuttingSuffix}`;
}

class FirebasePlantRepository {
  private collectionName = 'plants';

  // Convert Firestore document to Plant object
  private docToPlant(doc: DocumentData): Plant {
    return {
      id: doc.id,
      ...doc.data()
    } as Plant;
  }

  // Clean data before saving
  private cleanData(data: any): any {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== '') {
        cleaned[key] = value;
      } else if (value === '') {
        // Convert empty strings to null for optional fields
        cleaned[key] = null;
      }
    }
    return cleaned;
  }

  async save(plant: Plant): Promise<Plant> {
    try {
      console.log('🌱 Firebase save operation started:', { plant, hasId: !!plant.id });
      
      // Generate a new ID if this is a new plant
      if (!plant.id) {
        plant.id = generatePlantId(
          plant.plantType,
          plant.isCutting || false,
          plant.parentPlantId
        );
      }
      
      const plantDoc = doc(db, this.collectionName, plant.id);
      const { id, ...plantData } = plant;
      const cleanedData = this.cleanData(plantData);
      
      console.log('📤 Saving plant with ID:', plant.id);
      console.log('📤 Cleaned plant data:', cleanedData);
      
      await setDoc(plantDoc, cleanedData);
      console.log('✅ Plant saved successfully');
      
      return plant;
    } catch (error) {
      console.error('❌ Error saving plant to Firebase:', error);
      console.error('Error details:', {
        code: (error as any)?.code,
        message: (error as any)?.message,
        stack: (error as any)?.stack
      });
      throw error;
    }
  }

  async findAll(): Promise<Plant[]> {
    try {
      const plantsQuery = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(plantsQuery);
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Plant | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? this.docToPlant(docSnap) : null;
    } catch (error) {
      console.error('Error fetching plant by ID:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  }

  async findByType(plantType: string): Promise<Plant[]> {
    try {
      const plantsQuery = query(
        collection(db, this.collectionName),
        where('plantType', '==', plantType),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(plantsQuery);
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching plants by type:', error);
      throw error;
    }
  }

  async findCuttings(parentId: string): Promise<Plant[]> {
    try {
      const plantsQuery = query(
        collection(db, this.collectionName),
        where('parentPlantId', '==', parentId),
        where('isCutting', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(plantsQuery);
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching cuttings:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    try {
      const plants = await this.findAll();
      const deletePromises = plants.map(plant => this.delete(plant.id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting all plants:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const plantRepository = new FirebasePlantRepository();
