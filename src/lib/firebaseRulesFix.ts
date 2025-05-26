// Automatic Firebase Rules Fix
// This script helps diagnose and provides instructions to fix Firestore security rules

export const FIREBASE_RULES_SOLUTION = {
  projectId: 'sporelia-plants',
  consoleUrl: 'https://console.firebase.google.com/project/sporelia-plants/firestore/rules',
  
  // Development rules (allows all read/write - use only for development!)
  developmentRules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`,

  // Production-ready rules (for later deployment)
  productionRules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Plants collection - allow read/write for authenticated users
    match /plants/{plantId} {
      allow read, write: if request.auth != null;
    }
    
    // Test collections for debugging
    match /test-security/{docId} {
      allow read, write: if true;
    }
    
    match /connection-test/{docId} {
      allow read, write: if true;
    }
    
    // User-specific data (for future user auth)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`,

  instructions: [
    '1. Open Firebase Console: https://console.firebase.google.com/project/sporelia-plants/firestore/rules',
    '2. Click on the "Rules" tab if not already selected',
    '3. Replace the existing rules with the development rules provided above',
    '4. Click "Publish" to save the changes',
    '5. Refresh your app at http://localhost:5182',
    '6. Check the browser console for "✅ Firebase diagnostic result: { success: true }"'
  ],

  troubleshooting: {
    'permission-denied': 'Security rules are blocking access. Update Firestore rules.',
    'unavailable': 'Network connectivity issue. Check your internet connection.',
    'invalid-argument': 'Invalid data format. Check plant data structure.',
    'not-found': 'Firebase project not found. Verify project configuration.',
    'unauthenticated': 'Authentication required but no auth set up. Use development rules for now.'
  }
};

export function displayFirebaseFixInstructions() {
  console.log('🔧 FIREBASE RULES FIX INSTRUCTIONS');
  console.log('=====================================');
  console.log('');
  console.log('📋 Quick Fix Steps:');
  FIREBASE_RULES_SOLUTION.instructions.forEach(instruction => {
    console.log(instruction);
  });
  console.log('');
  console.log('🔗 Firebase Console URL:');
  console.log(FIREBASE_RULES_SOLUTION.consoleUrl);
  console.log('');
  console.log('📝 Development Rules (copy this):');
  console.log(FIREBASE_RULES_SOLUTION.developmentRules);
  console.log('');
  console.log('⚠️  WARNING: These rules allow all access. Only use for development!');
  console.log('🚀 For production, use authentication and the production rules provided.');
}

// Make available in browser console
(window as any).displayFirebaseFixInstructions = displayFirebaseFixInstructions;
(window as any).FIREBASE_RULES_SOLUTION = FIREBASE_RULES_SOLUTION;
