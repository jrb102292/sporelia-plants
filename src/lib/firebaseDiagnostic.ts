// Firebase Security Rules Test
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function diagnoseFirebaseIssue() {
  console.log('🔍 Diagnosing Firebase connection issue...');
  
  try {
    // Test 1: Try to read from a collection (should show permission error if rules are the issue)
    console.log('📖 Testing read access...');
    const testRead = await getDocs(collection(db, 'plants'));
    console.log('✅ Read access works - found', testRead.size, 'documents');
    
    // Test 2: Try to write (this is where permission errors usually show up)
    console.log('✍️ Testing write access...');
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Security rules test'
    };
    
    const writeResult = await addDoc(collection(db, 'test-security'), testDoc);
    console.log('✅ Write access works - created document:', writeResult.id);
    
    return {
      success: true,
      message: 'Firebase is working correctly',
      readAccess: true,
      writeAccess: true
    };
    
  } catch (error: any) {
    console.error('❌ Firebase issue detected:', error);
    
    const diagnosis = {
      success: false,
      readAccess: false,
      writeAccess: false,
      errorCode: error?.code,
      errorMessage: error?.message,
      diagnosis: 'Unknown error'
    };
      // Analyze the specific error
    if (error?.code === 'permission-denied') {
      diagnosis.diagnosis = 'SECURITY_RULES_EXPIRED';
      console.error('🚫 DIAGNOSIS: Firestore security rules are blocking access');
      console.error('💡 SOLUTION: Update your Firestore rules in Firebase Console');
      console.error('🔗 URL: https://console.firebase.google.com/project/sporelia-plants/firestore/rules');
      console.error('');
      console.error('📝 QUICK FIX - Replace your rules with this:');
      console.error(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}`);
      console.error('');
      console.error('⚡ Run this in console for detailed instructions: displayFirebaseFixInstructions()');
    }else if (error?.code === 'unavailable') {
      diagnosis.diagnosis = 'NETWORK_ISSUE';
      console.error('📡 DIAGNOSIS: Network connectivity issue');
      console.error('💡 SOLUTION: Check your internet connection');
    } else if (error?.code === 'invalid-argument') {
      diagnosis.diagnosis = 'INVALID_DATA';
      console.error('📝 DIAGNOSIS: Invalid data format');
      console.error('💡 SOLUTION: Check data structure and types');
    } else {
      diagnosis.diagnosis = 'UNKNOWN_ERROR';
      console.error('❓ DIAGNOSIS: Unknown Firebase error');
      console.error('💡 SOLUTION: Check Firebase project configuration');
    }
    
    return diagnosis;
  }
}

// Export for browser console testing
(window as any).diagnoseFirebaseIssue = diagnoseFirebaseIssue;
