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

class FirebasePlantRepository {
  private collectionName = 'plants';

  // Convert Firestore document to Plant object
  private docToPlant(doc: DocumentData): Plant {
    return {
      id: doc.id,
      ...doc.data()
    } as Plant;
  }

  async getAll(): Promise<Plant[]> {
    try {
      const plantsCollection = collection(db, this.collectionName);
      const plantsQuery = query(plantsCollection, orderBy('acquisitionDate', 'desc'));
      const snapshot = await getDocs(plantsQuery);
      
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching plants from Firebase:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Plant | null> {
    try {
      const plantDoc = doc(db, this.collectionName, id);
      const snapshot = await getDoc(plantDoc);
      
      return snapshot.exists() ? this.docToPlant(snapshot) : null;
    } catch (error) {
      console.error('Error fetching plant by ID from Firebase:', error);
      throw error;
    }
  }

  async save(plant: Plant): Promise<Plant> {
    try {
      if (plant.id) {
        // Update existing plant
        const plantDoc = doc(db, this.collectionName, plant.id);
        const { id, ...plantData } = plant;
        await updateDoc(plantDoc, plantData);
        return plant;
      } else {
        // Create new plant
        const plantsCollection = collection(db, this.collectionName);
        const docRef = await addDoc(plantsCollection, plant);
        return {
          ...plant,
          id: docRef.id
        };
      }
    } catch (error) {
      console.error('Error saving plant to Firebase:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const plantDoc = doc(db, this.collectionName, id);
      await deleteDoc(plantDoc);
    } catch (error) {
      console.error('Error deleting plant from Firebase:', error);
      throw error;
    }
  }

  async getByPlantType(plantType: string): Promise<Plant[]> {
    try {
      const plantsCollection = collection(db, this.collectionName);
      const plantsQuery = query(
        plantsCollection, 
        where('plantType', '==', plantType),
        orderBy('acquisitionDate', 'desc')
      );
      
      const snapshot = await getDocs(plantsQuery);
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching plants by type from Firebase:', error);
      throw error;
    }
  }

  async getAllPlantTypes(): Promise<string[]> {
    try {
      const plants = await this.getAll();
      const plantTypes = plants
        .map(plant => plant.plantType || 'Uncategorized')
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      return plantTypes;
    } catch (error) {
      console.error('Error fetching plant types from Firebase:', error);
      throw error;
    }
  }
}

export default new FirebasePlantRepository();
