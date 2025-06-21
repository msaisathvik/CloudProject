// Export all Google Cloud services
export { AuthService } from './authService';
export { FirestoreService } from './firestoreService';
export { StorageService } from './storageService';
export { FunctionsService } from './functionsService';

// Re-export Firebase instances for direct access if needed
export { auth, db, storage, functions } from '../lib/firebase'; 