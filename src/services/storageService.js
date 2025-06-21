import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from '../lib/firebase';

// Firebase Storage Service
export class StorageService {
  // Upload a file to Firebase Storage
  static async uploadFile(file, path, metadata = {}) {
    try {
      const storageRef = ref(storage, path);
      
      // Upload the file with metadata
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type,
        ...metadata
      });
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { 
        url: downloadURL, 
        path: snapshot.ref.fullPath,
        metadata: snapshot.metadata,
        error: null 
      };
    } catch (error) {
      return { url: null, path: null, metadata: null, error: error.message };
    }
  }

  // Upload an image with automatic path generation
  static async uploadImage(file, folder = 'images') {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const path = `${folder}/${fileName}`;
    
    return this.uploadFile(file, path, {
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  // Upload a video with automatic path generation
  static async uploadVideo(file, folder = 'videos') {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const path = `${folder}/${fileName}`;
    
    return this.uploadFile(file, path, {
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  // Upload a document with automatic path generation
  static async uploadDocument(file, folder = 'documents') {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const path = `${folder}/${fileName}`;
    
    return this.uploadFile(file, path, {
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  // Get download URL for a file
  static async getDownloadURL(path) {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return { url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  }

  // Delete a file from Firebase Storage
  static async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  // List all files in a folder
  static async listFiles(folderPath) {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      
      const files = [];
      
      // Get metadata for each file
      for (const itemRef of result.items) {
        try {
          const metadata = await getMetadata(itemRef);
          const url = await getDownloadURL(itemRef);
          
          files.push({
            name: itemRef.name,
            path: itemRef.fullPath,
            url: url,
            metadata: metadata,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated
          });
        } catch (error) {
          console.error(`Error getting metadata for ${itemRef.name}:`, error);
        }
      }
      
      return { files, error: null };
    } catch (error) {
      return { files: [], error: error.message };
    }
  }

  // Get file metadata
  static async getFileMetadata(path) {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      return { metadata, error: null };
    } catch (error) {
      return { metadata: null, error: error.message };
    }
  }

  // Upload camera thumbnail
  static async uploadCameraThumbnail(file, cameraId) {
    const path = `cameras/${cameraId}/thumbnail_${Date.now()}.jpg`;
    return this.uploadFile(file, path, {
      customMetadata: {
        cameraId: cameraId,
        type: 'thumbnail',
        uploadedAt: new Date().toISOString()
      }
    });
  }

  // Upload detection image
  static async uploadDetectionImage(file, detectionId) {
    const path = `detections/${detectionId}/image_${Date.now()}.jpg`;
    return this.uploadFile(file, path, {
      customMetadata: {
        detectionId: detectionId,
        type: 'detection',
        uploadedAt: new Date().toISOString()
      }
    });
  }

  // Upload alert attachment
  static async uploadAlertAttachment(file, alertId) {
    const path = `alerts/${alertId}/attachment_${Date.now()}_${file.name}`;
    return this.uploadFile(file, path, {
      customMetadata: {
        alertId: alertId,
        type: 'attachment',
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });
  }
} 