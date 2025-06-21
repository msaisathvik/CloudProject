// Firebase connectivity test
import { auth, db, storage, functions } from './firebase';

export const testFirebaseConnection = async () => {
  console.log('Testing Firebase connection...');
  
  try {
    // Test Auth
    console.log('✅ Firebase Auth initialized:', auth ? 'Yes' : 'No');
    
    // Test Firestore
    console.log('✅ Firestore initialized:', db ? 'Yes' : 'No');
    
    // Test Storage
    console.log('✅ Storage initialized:', storage ? 'Yes' : 'No');
    
    // Test Functions
    console.log('✅ Functions initialized:', functions ? 'Yes' : 'No');
    
    // Test current user
    const currentUser = auth.currentUser;
    console.log('👤 Current user:', currentUser ? currentUser.email : 'None');
    
    return {
      success: true,
      auth: !!auth,
      firestore: !!db,
      storage: !!storage,
      functions: !!functions,
      currentUser: currentUser ? currentUser.email : null
    };
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run test when imported
testFirebaseConnection(); 