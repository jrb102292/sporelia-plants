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
  }  // Helper function to remove undefined values
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
      
      if (plant.id) {
        // Update existing plant
        console.log('📝 Updating existing plant with ID:', plant.id);
        const plantDoc = doc(db, this.collectionName, plant.id);
        const { id, ...plantData } = plant;
        const cleanedData = this.cleanData(plantData);
        console.log('📤 Cleaned plant data:', cleanedData);
        await updateDoc(plantDoc, cleanedData);
        console.log('✅ Plant updated successfully');
        return plant;
      } else {
        // Create new plant
        console.log('➕ Creating new plant:', plant.name);
        const { id, ...plantData } = plant;
        const cleanedData = this.cleanData(plantData);
        console.log('📤 Cleaned plant data to save:', cleanedData);
        const docRef = await addDoc(collection(db, this.collectionName), cleanedData);
        console.log('✅ Plant created successfully with ID:', docRef.id);
        return { ...plant, id: docRef.id };
      }
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
  async delete(id: string): Promise<boolean> {
    try {
      const plantDoc = doc(db, this.collectionName, id);
      await deleteDoc(plantDoc);
      return true;
    } catch (error) {
      console.error('Error deleting plant from Firebase:', error);
      return false;
    }
  }

  async saveWithCustomId(plant: Plant): Promise<Plant> {
    try {
      console.log('🆔 Saving plant with custom ID:', plant.id);
      const plantDoc = doc(db, this.collectionName, plant.id);
      const { id, ...plantData } = plant;
      const cleanedData = this.cleanData(plantData);
      
      // Use setDoc to create document with custom ID
      await setDoc(plantDoc, cleanedData);
      console.log('✅ Plant saved with custom ID successfully');
      return plant;
    } catch (error) {
      console.error('❌ Error saving plant with custom ID:', error);
      throw error;
    }
  }

  // Advanced queries for large plant collections
  async getByStatus(status: string): Promise<Plant[]> {
    try {
      const plantsCollection = collection(db, this.collectionName);
      const statusQuery = query(
        plantsCollection, 
        where('status', '==', status),
        orderBy('name')
      );
      const snapshot = await getDocs(statusQuery);
      
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching plants by status:', error);
      throw error;
    }
  }

  async getByCategory(plantType: string): Promise<Plant[]> {
    try {
      const plantsCollection = collection(db, this.collectionName);
      const categoryQuery = query(
        plantsCollection, 
        where('plantType', '==', plantType),
        orderBy('name')
      );
      const snapshot = await getDocs(categoryQuery);
      
      return snapshot.docs.map(doc => this.docToPlant(doc));
    } catch (error) {
      console.error('Error fetching plants by category:', error);
      throw error;
    }
  }
}

export default new FirebasePlantRepository();
