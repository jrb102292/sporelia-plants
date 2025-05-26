// Immediate Firebase Test for Quick Feedback
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function quickFirebaseTest() {
  console.log('⚡ Quick Firebase Test Starting...');
  
  try {
    // Attempt to write a minimal test document
    const testData = { 
      test: true, 
      timestamp: new Date().toISOString(),
      message: 'Quick connectivity test'
    };
    
    const result = await addDoc(collection(db, 'quick-test'), testData);
    console.log('✅ FIREBASE WORKING! Document created:', result.id);
    
    return { 
      success: true, 
      message: 'Firebase is working correctly',
      docId: result.id 
    };
    
  } catch (error: any) {
    console.error('❌ FIREBASE ERROR:', error.code || error.message);
    
    if (error.code === 'permission-denied') {
      console.error('');
      console.error('🔧 SOLUTION: Your Firestore security rules need to be updated.');
      console.error('📋 Steps:');
      console.error('   1. Open: https://console.firebase.google.com/project/sporelia-plants/firestore/rules');
      console.error('   2. Replace rules with: allow read, write: if true;');
      console.error('   3. Click Publish');
      console.error('   4. Refresh this page');
      console.error('');
      console.error('⚠️  This error prevents saving plants! Fix immediately.');
      
      return {
        success: false,
        error: 'PERMISSION_DENIED',
        message: 'Firebase security rules are blocking access',
        fixUrl: 'https://console.firebase.google.com/project/sporelia-plants/firestore/rules'
      };
    }
    
    return {
      success: false,
      error: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'Unknown Firebase error'
    };
  }
}

// Auto-run on import for immediate feedback
quickFirebaseTest().then(result => {
  if (!result.success) {
    console.error('🚨 FIREBASE CONNECTION FAILED!');
    console.error('   This will prevent plants from being saved.');
    console.error('   Error:', result.error);
    console.error('   Message:', result.message);
  }
}).catch(error => {
  console.error('🚨 FIREBASE TEST CRASHED:', error);
});

// Export for manual testing
(window as any).quickFirebaseTest = quickFirebaseTest;
