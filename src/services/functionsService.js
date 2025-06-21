import { 
  httpsCallable,
  connectFunctionsEmulator
} from 'firebase/functions';
import { functions } from '../lib/firebase';

// Firebase Cloud Functions Service
export class FunctionsService {
  // Call a Cloud Function
  static async callFunction(functionName, data = {}) {
    try {
      const callFunction = httpsCallable(functions, functionName);
      const result = await callFunction(data);
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Send notification
  static async sendNotification(notificationData) {
    return this.callFunction('sendNotification', {
      title: notificationData.title,
      body: notificationData.body,
      userId: notificationData.userId,
      type: notificationData.type || 'general',
      data: notificationData.data || {}
    });
  }

  // Process detection data
  static async processDetection(detectionData) {
    return this.callFunction('processDetection', {
      imageUrl: detectionData.imageUrl,
      cameraId: detectionData.cameraId,
      timestamp: detectionData.timestamp,
      confidence: detectionData.confidence,
      objectType: detectionData.objectType,
      location: detectionData.location
    });
  }

  // Generate alert
  static async generateAlert(alertData) {
    return this.callFunction('generateAlert', {
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      cameraId: alertData.cameraId,
      detectionId: alertData.detectionId,
      location: alertData.location
    });
  }

  // Send email notification
  static async sendEmailNotification(emailData) {
    return this.callFunction('sendEmailNotification', {
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      template: emailData.template || 'default'
    });
  }

  // Process image analysis
  static async analyzeImage(imageData) {
    return this.callFunction('analyzeImage', {
      imageUrl: imageData.imageUrl,
      analysisType: imageData.analysisType || 'object-detection',
      options: imageData.options || {}
    });
  }

  // Backup data
  static async backupData(backupData) {
    return this.callFunction('backupData', {
      collections: backupData.collections || ['detections', 'alerts', 'cameras'],
      format: backupData.format || 'json',
      destination: backupData.destination || 'storage'
    });
  }

  // Generate report
  static async generateReport(reportData) {
    return this.callFunction('generateReport', {
      type: reportData.type,
      dateRange: reportData.dateRange,
      filters: reportData.filters || {},
      format: reportData.format || 'pdf'
    });
  }

  // Sync data with external system
  static async syncData(syncData) {
    return this.callFunction('syncData', {
      source: syncData.source,
      destination: syncData.destination,
      dataType: syncData.dataType,
      options: syncData.options || {}
    });
  }

  // Process bulk operations
  static async processBulkOperation(operationData) {
    return this.callFunction('processBulkOperation', {
      operation: operationData.operation,
      data: operationData.data,
      options: operationData.options || {}
    });
  }

  // Health check
  static async healthCheck() {
    return this.callFunction('healthCheck', {});
  }

  // Get system statistics
  static async getSystemStats() {
    return this.callFunction('getSystemStats', {});
  }

  // Clean up old data
  static async cleanupOldData(cleanupData) {
    return this.callFunction('cleanupOldData', {
      collections: cleanupData.collections || ['detections', 'alerts'],
      olderThan: cleanupData.olderThan || '30d',
      dryRun: cleanupData.dryRun || false
    });
  }

  // Process camera feed
  static async processCameraFeed(feedData) {
    return this.callFunction('processCameraFeed', {
      cameraId: feedData.cameraId,
      feedUrl: feedData.feedUrl,
      processingOptions: feedData.processingOptions || {}
    });
  }

  // Send SMS notification
  static async sendSMSNotification(smsData) {
    return this.callFunction('sendSMSNotification', {
      phoneNumber: smsData.phoneNumber,
      message: smsData.message,
      priority: smsData.priority || 'normal'
    });
  }

  // Update system configuration
  static async updateSystemConfig(configData) {
    return this.callFunction('updateSystemConfig', {
      config: configData.config,
      restartServices: configData.restartServices || false
    });
  }

  // Test function (for development)
  static async testFunction(testData) {
    return this.callFunction('testFunction', {
      message: testData.message || 'Hello from client!',
      timestamp: new Date().toISOString()
    });
  }

  // Connect to functions emulator (for local development)
  static connectToEmulator(host = 'localhost', port = 5001) {
    try {
      connectFunctionsEmulator(functions, host, port);
      console.log(`Connected to Functions emulator at ${host}:${port}`);
    } catch (error) {
      console.error('Error connecting to Functions emulator:', error);
    }
  }
} 