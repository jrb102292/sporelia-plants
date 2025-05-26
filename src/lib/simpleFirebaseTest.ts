// Simple Firebase Write Test - Minimal Plant Creation
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function testSimpleFirebaseWrite() {
  console.log('🧪 Testing simple Firebase write...');
  
  try {
    // Test with minimal data first
    const simpleData = {
      name: 'Test Plant',
      species: 'Test Species',
      acquisitionDate: new Date().toISOString(),
      plantType: 'Test'
    };
    
    console.log('📝 Writing simple data:', simpleData);
    const docRef = await addDoc(collection(db, 'plants'), simpleData);
    console.log('✅ Success! Document ID:', docRef.id);
    
    return { success: true, docId: docRef.id };
    
  } catch (error) {
    console.error('❌ Simple write test failed:', error);
    console.error('Error code:', (error as any)?.code);
    console.error('Error message:', (error as any)?.message);
    
    // Check for specific Firebase errors
    if ((error as any)?.code === 'permission-denied') {
      console.error('🚫 Permission denied - check Firestore security rules');
    } else if ((error as any)?.code === 'unavailable') {
      console.error('📡 Firebase unavailable - check internet connection');
    }
    
    return { success: false, error };
  }
}

// Make available in browser console
(window as any).testSimpleFirebaseWrite = testSimpleFirebaseWrite;
