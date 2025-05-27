// Firebase Connection Diagnostic Test
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...');
  
  try {
    // Test 1: Basic connection test
    console.log('📡 Testing basic Firestore connection...');
    const testCollection = collection(db, 'connection-test');
    const testDoc = {
      timestamp: new Date().toISOString(),
      test: 'connection-test'
    };
    
    const docRef = await addDoc(testCollection, testDoc);
    console.log('✅ Successfully wrote test document with ID:', docRef.id);
    
    // Test 2: Read from plants collection
    console.log('📖 Testing read from plants collection...');
    const plantsCollection = collection(db, 'plants');
    const snapshot = await getDocs(plantsCollection);
    console.log(`✅ Successfully read plants collection. Found ${snapshot.size} documents.`);
    
    // Test 3: Test adding a plant
    console.log('🌱 Testing plant creation...');
    const testPlant = {
      name: 'Firebase Test Plant',
      plantType: 'Test',
      status: 'Healthy',
      acquisitionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const plantRef = await addDoc(collection(db, 'plants'), testPlant);
    console.log('✅ Successfully created test plant with ID:', plantRef.id);
    
    return { success: true, message: 'All Firebase tests passed!' };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return { 
      success: false, 
      message: `Firebase test failed: ${error}`,
      error 
    };
  }
}

// Export for manual testing in browser console (only in browser)
if (typeof window !== 'undefined') {
  (window as any).testFirebaseConnection = testFirebaseConnection;
}
