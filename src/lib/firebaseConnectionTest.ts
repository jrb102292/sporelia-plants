'use client';

// Firebase Connection Diagnostic Test
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

interface TestResult {
  success: boolean;
  message: string;
  error?: unknown;
  details?: {
    testDocId?: string;
    plantDocId?: string;
    plantCount?: number;
    cleanupStatus?: {
      testDocsRemoved: number;
      testPlantsRemoved: number;
    };
  };
}

// Run cleanup on module load
cleanupTestData().catch(console.error);

export async function cleanupTestData(): Promise<{ success: boolean; message: string; details: { testDocsRemoved: number; testPlantsRemoved: number } }> {
  console.log('🧹 Starting test data cleanup...');
  let testDocsRemoved = 0;
  let testPlantsRemoved = 0;
  
  try {
    // Use a batch write for atomic operations
    const batch = writeBatch(db);
    
    // Clean up test documents
    console.log('📝 Cleaning up test documents...');
    const testCollection = collection(db, 'connection-test');
    const testSnapshot = await getDocs(testCollection);
    const testDocs = testSnapshot.docs;
    
    // Clean up test plants
    console.log('🌱 Cleaning up test plants...');
    const plantsCollection = collection(db, 'plants');
    const testPlantsQuery = query(plantsCollection, where('name', '==', 'Firebase Test Plant'));
    const testPlantsSnapshot = await getDocs(testPlantsQuery);
    const testPlants = testPlantsSnapshot.docs;

    // Add all deletions to batch
    testDocs.forEach(doc => {
      batch.delete(doc.ref);
      testDocsRemoved++;
    });

    testPlants.forEach(doc => {
      batch.delete(doc.ref);
      testPlantsRemoved++;
    });

    // Commit all deletions in one atomic operation
    await batch.commit();

    console.log(`✅ Cleanup complete: Removed ${testDocsRemoved} test docs and ${testPlantsRemoved} test plants`);
    return {
      success: true,
      message: `Cleaned up ${testDocsRemoved} test documents and ${testPlantsRemoved} test plants`,
      details: {
        testDocsRemoved,
        testPlantsRemoved
      }
    };
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    return {
      success: false,
      message: `Failed to clean up test data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        testDocsRemoved,
        testPlantsRemoved
      }
    };
  }
}

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

export async function testFirebaseConnection(): Promise<TestResult> {
  console.log('🔥 Testing Firebase Connection...');
  
  try {
    // First, clean up any existing test data
    const cleanupResult = await cleanupTestData();
    console.log('🧹 Initial cleanup result:', cleanupResult);
    
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
    
    // Test 3: Test adding a plant with custom ID
    console.log('🌱 Testing plant creation...');
    const testPlantId = generatePlantId('Test');
    const testPlant = {
      id: testPlantId,
      name: 'Firebase Test Plant',
      plantType: 'Test',
      status: 'Healthy',
      acquisitionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const plantRef = await addDoc(collection(db, 'plants'), testPlant);
    console.log('✅ Successfully created test plant with ID:', plantRef.id);
    
    // Clean up after successful test
    const finalCleanupResult = await cleanupTestData();
    console.log('🧹 Final cleanup result:', finalCleanupResult);
    
    return { 
      success: true, 
      message: 'All Firebase tests passed!',
      details: {
        testDocId: docRef.id,
        plantDocId: plantRef.id,
        plantCount: snapshot.size,
        cleanupStatus: finalCleanupResult.details
      }
    };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    // Enhanced error handling
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    return {
      success: false,
      message: `Firebase test failed: ${errorMessage}`,
      error
    };
  }
} 