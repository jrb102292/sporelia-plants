// Simple Firebase connection test
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to add a simple test document
    const testData = {
      name: 'Test Plant',
      species: 'Test Species',
      acquisitionDate: new Date().toISOString().split('T')[0],
      plantType: 'Test',
      notes: 'Firebase connection test'
    };
    
    const docRef = await addDoc(collection(db, 'plants'), testData);
    console.log('✅ Firebase connection successful! Document ID:', docRef.id);
    return { success: true, docId: docRef.id };
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { success: false, error: error };
  }
};

// Add this to window for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testFirebaseConnection = testFirebaseConnection;
}
