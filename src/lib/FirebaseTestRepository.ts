import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export class FirebaseTestRepository {
  private readonly testCollection = 'test_documents';
  private readonly testPlantsCollection = 'plants';

  async deleteAll(): Promise<void> {
    try {
      // Delete all test documents
      const testDocs = await getDocs(collection(db, this.testCollection));
      const testDeletePromises = testDocs.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(testDeletePromises);

      // Delete all test plants
      const testPlantsQuery = query(
        collection(db, this.testPlantsCollection),
        where('isTest', '==', true)
      );
      const testPlants = await getDocs(testPlantsQuery);
      const plantDeletePromises = testPlants.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(plantDeletePromises);
    } catch (error) {
      console.error('Error deleting test data:', error);
      throw error;
    }
  }
}

export const testRepository = new FirebaseTestRepository(); 