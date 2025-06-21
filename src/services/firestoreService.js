import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Firestore Database Service
export class FirestoreService {
  // Generic CRUD operations
  static async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  }

  static async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      } else {
        return { data: null, error: 'Document not found' };
      }
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  static async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async getDocuments(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      // Apply conditions (where clauses)
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: documents, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  // Specific operations for your app's collections
  static async addDetection(detectionData) {
    return this.addDocument('detections', detectionData);
  }

  static async getDetections(limitCount = 50) {
    try {
      const q = query(
        collection(db, 'detections'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const detections = [];
      
      querySnapshot.forEach((doc) => {
        detections.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: detections, error: null };
    } catch (error) {
      // Fallback to createdAt if timestamp doesn't exist
      try {
        const q = query(
          collection(db, 'detections'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
        
        const querySnapshot = await getDocs(q);
        const detections = [];
        
        querySnapshot.forEach((doc) => {
          detections.push({ id: doc.id, ...doc.data() });
        });
        
        return { data: detections, error: null };
      } catch (fallbackError) {
        return { data: [], error: fallbackError.message };
      }
    }
  }

  static async addAlert(alertData) {
    return this.addDocument('alerts', alertData);
  }

  static async getAlerts() {
    try {
      const q = query(
        collection(db, 'alerts'),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const alerts = [];
      
      querySnapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: alerts, error: null };
    } catch (error) {
      // Fallback to createdAt if timestamp doesn't exist
      try {
        const q = query(
          collection(db, 'alerts'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const alerts = [];
        
        querySnapshot.forEach((doc) => {
          alerts.push({ id: doc.id, ...doc.data() });
        });
        
        return { data: alerts, error: null };
      } catch (fallbackError) {
        return { data: [], error: fallbackError.message };
      }
    }
  }

  static async addCamera(cameraData) {
    return this.addDocument('cameras', cameraData);
  }

  static async getCameras() {
    return this.getDocuments('cameras');
  }

  // Real-time listeners
  static onDetectionsChange(callback) {
    const q = query(
      collection(db, 'detections'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const detections = [];
      querySnapshot.forEach((doc) => {
        detections.push({ id: doc.id, ...doc.data() });
      });
      callback(detections);
    }, (error) => {
      // Fallback to createdAt if timestamp doesn't exist
      const fallbackQ = query(
        collection(db, 'detections'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      return onSnapshot(fallbackQ, (querySnapshot) => {
        const detections = [];
        querySnapshot.forEach((doc) => {
          detections.push({ id: doc.id, ...doc.data() });
        });
        callback(detections);
      });
    });
  }

  static onAlertsChange(callback) {
    const q = query(
      collection(db, 'alerts'),
      orderBy('timestamp', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const alerts = [];
      querySnapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      callback(alerts);
    }, (error) => {
      // Fallback to createdAt if timestamp doesn't exist
      const fallbackQ = query(
        collection(db, 'alerts'),
        orderBy('createdAt', 'desc')
      );
      
      return onSnapshot(fallbackQ, (querySnapshot) => {
        const alerts = [];
        querySnapshot.forEach((doc) => {
          alerts.push({ id: doc.id, ...doc.data() });
        });
        callback(alerts);
      });
    });
  }
} 