import { FirestoreService } from './firestoreService';

// Data Migration Service - Migrate from Supabase to Firebase
export class DataMigrationService {
  
  // Sample data structure for migration
  static getSampleData() {
    return {
      detections: [
        {
          id: 'det_001',
          camera_id: 'CAM_01',
          label: 'person',
          confidence: 0.95,
          timestamp: new Date('2024-01-15T10:30:00Z'),
          location: 'Main Street',
          frame_url: 'https://example.com/frame1.jpg',
          status: 'detected'
        },
        {
          id: 'det_002',
          camera_id: 'CAM_02',
          label: 'vehicle',
          confidence: 0.87,
          timestamp: new Date('2024-01-15T10:35:00Z'),
          location: 'Highway Exit',
          frame_url: 'https://example.com/frame2.jpg',
          status: 'detected'
        },
        {
          id: 'det_003',
          camera_id: 'CAM_01',
          label: 'accident',
          confidence: 0.92,
          timestamp: new Date('2024-01-15T11:00:00Z'),
          location: 'Main Street',
          frame_url: 'https://example.com/frame3.jpg',
          status: 'alert'
        },
        {
          id: 'det_004',
          camera_id: 'CAM_03',
          label: 'person',
          confidence: 0.88,
          timestamp: new Date('2024-01-15T11:15:00Z'),
          location: 'Shopping Mall',
          frame_url: 'https://example.com/frame4.jpg',
          status: 'detected'
        },
        {
          id: 'det_005',
          camera_id: 'CAM_02',
          label: 'vehicle',
          confidence: 0.91,
          timestamp: new Date('2024-01-15T11:30:00Z'),
          location: 'Highway Exit',
          frame_url: 'https://example.com/frame5.jpg',
          status: 'detected'
        },
        {
          id: 'det_006',
          camera_id: 'CAM_01',
          label: 'person',
          confidence: 0.76,
          timestamp: new Date('2024-01-15T12:00:00Z'),
          location: 'Main Street',
          frame_url: 'https://example.com/frame6.jpg',
          status: 'detected'
        },
        {
          id: 'det_007',
          camera_id: 'CAM_03',
          label: 'vehicle',
          confidence: 0.94,
          timestamp: new Date('2024-01-15T12:15:00Z'),
          location: 'Shopping Mall',
          frame_url: 'https://example.com/frame7.jpg',
          status: 'detected'
        },
        {
          id: 'det_008',
          camera_id: 'CAM_02',
          label: 'accident',
          confidence: 0.89,
          timestamp: new Date('2024-01-15T12:30:00Z'),
          location: 'Highway Exit',
          frame_url: 'https://example.com/frame8.jpg',
          status: 'alert'
        },
        {
          id: 'det_009',
          camera_id: 'CAM_01',
          label: 'person',
          confidence: 0.82,
          timestamp: new Date('2024-01-15T13:00:00Z'),
          location: 'Main Street',
          frame_url: 'https://example.com/frame9.jpg',
          status: 'detected'
        },
        {
          id: 'det_010',
          camera_id: 'CAM_03',
          label: 'vehicle',
          confidence: 0.96,
          timestamp: new Date('2024-01-15T13:15:00Z'),
          location: 'Shopping Mall',
          frame_url: 'https://example.com/frame10.jpg',
          status: 'detected'
        },
        {
          id: 'det_011',
          camera_id: 'CAM_04',
          label: 'person',
          confidence: 0.78,
          timestamp: new Date('2024-01-15T14:00:00Z'),
          location: 'University Campus',
          frame_url: 'https://example.com/frame11.jpg',
          status: 'detected'
        },
        {
          id: 'det_012',
          camera_id: 'CAM_05',
          label: 'vehicle',
          confidence: 0.85,
          timestamp: new Date('2024-01-15T14:30:00Z'),
          location: 'Hospital Entrance',
          frame_url: 'https://example.com/frame12.jpg',
          status: 'detected'
        },
        {
          id: 'det_013',
          camera_id: 'CAM_06',
          label: 'person',
          confidence: 0.91,
          timestamp: new Date('2024-01-15T15:00:00Z'),
          location: 'Parking Garage',
          frame_url: 'https://example.com/frame13.jpg',
          status: 'detected'
        },
        {
          id: 'det_014',
          camera_id: 'CAM_07',
          label: 'vehicle',
          confidence: 0.73,
          timestamp: new Date('2024-01-15T15:30:00Z'),
          location: 'Bus Station',
          frame_url: 'https://example.com/frame14.jpg',
          status: 'detected'
        },
        {
          id: 'det_015',
          camera_id: 'CAM_08',
          label: 'person',
          confidence: 0.88,
          timestamp: new Date('2024-01-15T16:00:00Z'),
          location: 'Library',
          frame_url: 'https://example.com/frame15.jpg',
          status: 'detected'
        }
      ],
      
      alerts: [
        {
          id: 'alert_001',
          detect_id: 'det_003',
          type: 'accident',
          severity: 'high',
          message: 'Accident detected at Main Street',
          camera_id: 'CAM_01',
          timestamp: new Date('2024-01-15T11:00:00Z'),
          status: 'sent',
          acknowledged_at: null
        },
        {
          id: 'alert_002',
          detect_id: 'det_001',
          type: 'suspicious_activity',
          severity: 'medium',
          message: 'Suspicious person detected',
          camera_id: 'CAM_01',
          timestamp: new Date('2024-01-15T10:30:00Z'),
          status: 'sent',
          acknowledged_at: new Date('2024-01-15T10:32:00Z')
        },
        {
          id: 'alert_003',
          detect_id: 'det_008',
          type: 'accident',
          severity: 'high',
          message: 'Accident detected at Highway Exit',
          camera_id: 'CAM_02',
          timestamp: new Date('2024-01-15T12:30:00Z'),
          status: 'sent',
          acknowledged_at: null
        },
        {
          id: 'alert_004',
          detect_id: 'det_004',
          type: 'unauthorized_access',
          severity: 'medium',
          message: 'Unauthorized person detected at Shopping Mall',
          camera_id: 'CAM_03',
          timestamp: new Date('2024-01-15T11:15:00Z'),
          status: 'pending',
          acknowledged_at: null
        },
        {
          id: 'alert_005',
          detect_id: 'det_006',
          type: 'suspicious_activity',
          severity: 'low',
          message: 'Suspicious activity detected at Main Street',
          camera_id: 'CAM_01',
          timestamp: new Date('2024-01-15T12:00:00Z'),
          status: 'sent',
          acknowledged_at: new Date('2024-01-15T12:05:00Z')
        },
        {
          id: 'alert_006',
          detect_id: 'det_007',
          type: 'traffic_violation',
          severity: 'medium',
          message: 'Traffic violation detected at Shopping Mall',
          camera_id: 'CAM_03',
          timestamp: new Date('2024-01-15T12:15:00Z'),
          status: 'pending',
          acknowledged_at: null
        },
        {
          id: 'alert_007',
          detect_id: 'det_009',
          type: 'loitering',
          severity: 'low',
          message: 'Loitering detected at Main Street',
          camera_id: 'CAM_01',
          timestamp: new Date('2024-01-15T13:00:00Z'),
          status: 'sent',
          acknowledged_at: null
        },
        {
          id: 'alert_008',
          detect_id: 'det_010',
          type: 'speeding',
          severity: 'medium',
          message: 'Speeding vehicle detected at Shopping Mall',
          camera_id: 'CAM_03',
          timestamp: new Date('2024-01-15T13:15:00Z'),
          status: 'pending',
          acknowledged_at: null
        },
        {
          id: 'alert_009',
          detect_id: 'det_011',
          type: 'trespassing',
          severity: 'medium',
          message: 'Trespassing detected at University Campus',
          camera_id: 'CAM_04',
          timestamp: new Date('2024-01-15T14:00:00Z'),
          status: 'sent',
          acknowledged_at: new Date('2024-01-15T14:02:00Z')
        },
        {
          id: 'alert_010',
          detect_id: 'det_012',
          type: 'unauthorized_vehicle',
          severity: 'low',
          message: 'Unauthorized vehicle at Hospital Entrance',
          camera_id: 'CAM_05',
          timestamp: new Date('2024-01-15T14:30:00Z'),
          status: 'sent',
          acknowledged_at: null
        }
      ],
      
      cameras: [
        {
          id: 'CAM_01',
          location: 'Main Street',
          area: 'Downtown',
          status: 'active',
          last_active_at: new Date('2024-01-15T13:00:00Z'),
          ip_address: '192.168.1.100',
          resolution: '1080p'
        },
        {
          id: 'CAM_02',
          location: 'Highway Exit',
          area: 'Suburbs',
          status: 'active',
          last_active_at: new Date('2024-01-15T12:30:00Z'),
          ip_address: '192.168.1.101',
          resolution: '720p'
        },
        {
          id: 'CAM_03',
          location: 'Shopping Mall',
          area: 'Commercial',
          status: 'active',
          last_active_at: new Date('2024-01-15T13:15:00Z'),
          ip_address: '192.168.1.102',
          resolution: '1080p'
        },
        {
          id: 'CAM_04',
          location: 'University Campus',
          area: 'Educational',
          status: 'active',
          last_active_at: new Date('2024-01-15T14:00:00Z'),
          ip_address: '192.168.1.103',
          resolution: '1080p'
        },
        {
          id: 'CAM_05',
          location: 'Hospital Entrance',
          area: 'Healthcare',
          status: 'offline',
          last_active_at: new Date('2024-01-14T18:30:00Z'),
          ip_address: '192.168.1.104',
          resolution: '720p'
        },
        {
          id: 'CAM_06',
          location: 'Parking Garage',
          area: 'Transportation',
          status: 'active',
          last_active_at: new Date('2024-01-15T15:00:00Z'),
          ip_address: '192.168.1.105',
          resolution: '1080p'
        },
        {
          id: 'CAM_07',
          location: 'Bus Station',
          area: 'Transportation',
          status: 'maintenance',
          last_active_at: new Date('2024-01-15T09:00:00Z'),
          ip_address: '192.168.1.106',
          resolution: '720p'
        },
        {
          id: 'CAM_08',
          location: 'Library',
          area: 'Educational',
          status: 'active',
          last_active_at: new Date('2024-01-15T16:00:00Z'),
          ip_address: '192.168.1.107',
          resolution: '1080p'
        },
        {
          id: 'CAM_09',
          location: 'City Park',
          area: 'Recreation',
          status: 'active',
          last_active_at: new Date('2024-01-15T16:30:00Z'),
          ip_address: '192.168.1.108',
          resolution: '720p'
        },
        {
          id: 'CAM_10',
          location: 'Police Station',
          area: 'Government',
          status: 'active',
          last_active_at: new Date('2024-01-15T17:00:00Z'),
          ip_address: '192.168.1.109',
          resolution: '1080p'
        }
      ],
      
      detection_history: [
        {
          detect_id: 'det_001',
          date: '2024-01-15',
          location: 'Main Street',
          camera_id: 'CAM_01',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T10:30:00Z')
        },
        {
          detect_id: 'det_002',
          date: '2024-01-15',
          location: 'Highway Exit',
          camera_id: 'CAM_02',
          anomly: 'vehicle',
          status: 'Pending',
          timestamp: new Date('2024-01-15T10:35:00Z')
        },
        {
          detect_id: 'det_003',
          date: '2024-01-15',
          location: 'Main Street',
          camera_id: 'CAM_01',
          anomly: 'accident',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T11:00:00Z')
        },
        {
          detect_id: 'det_004',
          date: '2024-01-15',
          location: 'Shopping Mall',
          camera_id: 'CAM_03',
          anomly: 'person',
          status: 'Under Investigation',
          timestamp: new Date('2024-01-15T11:15:00Z')
        },
        {
          detect_id: 'det_005',
          date: '2024-01-15',
          location: 'Highway Exit',
          camera_id: 'CAM_02',
          anomly: 'vehicle',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T11:30:00Z')
        },
        {
          detect_id: 'det_006',
          date: '2024-01-15',
          location: 'Main Street',
          camera_id: 'CAM_01',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T12:00:00Z')
        },
        {
          detect_id: 'det_007',
          date: '2024-01-15',
          location: 'Shopping Mall',
          camera_id: 'CAM_03',
          anomly: 'vehicle',
          status: 'Pending',
          timestamp: new Date('2024-01-15T12:15:00Z')
        },
        {
          detect_id: 'det_008',
          date: '2024-01-15',
          location: 'Highway Exit',
          camera_id: 'CAM_02',
          anomly: 'accident',
          status: 'Under Investigation',
          timestamp: new Date('2024-01-15T12:30:00Z')
        },
        {
          detect_id: 'det_009',
          date: '2024-01-15',
          location: 'Main Street',
          camera_id: 'CAM_01',
          anomly: 'person',
          status: 'Pending',
          timestamp: new Date('2024-01-15T13:00:00Z')
        },
        {
          detect_id: 'det_010',
          date: '2024-01-15',
          location: 'Shopping Mall',
          camera_id: 'CAM_03',
          anomly: 'vehicle',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T13:15:00Z')
        },
        {
          detect_id: 'det_011',
          date: '2024-01-15',
          location: 'University Campus',
          camera_id: 'CAM_04',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T14:00:00Z')
        },
        {
          detect_id: 'det_012',
          date: '2024-01-15',
          location: 'Hospital Entrance',
          camera_id: 'CAM_05',
          anomly: 'vehicle',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T14:30:00Z')
        },
        {
          detect_id: 'det_013',
          date: '2024-01-15',
          location: 'Parking Garage',
          camera_id: 'CAM_06',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T15:00:00Z')
        },
        {
          detect_id: 'det_014',
          date: '2024-01-15',
          location: 'Bus Station',
          camera_id: 'CAM_07',
          anomly: 'vehicle',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T15:30:00Z')
        },
        {
          detect_id: 'det_015',
          date: '2024-01-15',
          location: 'Library',
          camera_id: 'CAM_08',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-15T16:00:00Z')
        },
        {
          detect_id: 'det_016',
          date: '2024-01-14',
          location: 'Main Street',
          camera_id: 'CAM_01',
          anomly: 'vehicle',
          status: 'Resolved',
          timestamp: new Date('2024-01-14T16:30:00Z')
        },
        {
          detect_id: 'det_017',
          date: '2024-01-14',
          location: 'Shopping Mall',
          camera_id: 'CAM_03',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-14T17:00:00Z')
        },
        {
          detect_id: 'det_018',
          date: '2024-01-14',
          location: 'Highway Exit',
          camera_id: 'CAM_02',
          anomly: 'accident',
          status: 'Resolved',
          timestamp: new Date('2024-01-14T17:30:00Z')
        },
        {
          detect_id: 'det_019',
          date: '2024-01-13',
          location: 'University Campus',
          camera_id: 'CAM_04',
          anomly: 'person',
          status: 'Resolved',
          timestamp: new Date('2024-01-13T14:15:00Z')
        },
        {
          detect_id: 'det_020',
          date: '2024-01-13',
          location: 'Hospital Entrance',
          camera_id: 'CAM_05',
          anomly: 'vehicle',
          status: 'Resolved',
          timestamp: new Date('2024-01-13T15:30:00Z')
        }
      ],
      
      profiles: [
        {
          id: 'user_001',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          designation: 'Security Officer',
          phone_number: '+1234567890',
          gender: 'Male',
          avatar_url: 'https://example.com/avatar1.jpg',
          created_at: new Date('2024-01-01T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_002',
          full_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          designation: 'System Administrator',
          phone_number: '+1234567891',
          gender: 'Female',
          avatar_url: 'https://example.com/avatar2.jpg',
          created_at: new Date('2024-01-01T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_003',
          full_name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          designation: 'Security Manager',
          phone_number: '+1234567892',
          gender: 'Male',
          avatar_url: 'https://example.com/avatar3.jpg',
          created_at: new Date('2024-01-02T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_004',
          full_name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          designation: 'IT Specialist',
          phone_number: '+1234567893',
          gender: 'Female',
          avatar_url: 'https://example.com/avatar4.jpg',
          created_at: new Date('2024-01-03T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_005',
          full_name: 'David Brown',
          email: 'david.brown@example.com',
          designation: 'Security Analyst',
          phone_number: '+1234567894',
          gender: 'Male',
          avatar_url: 'https://example.com/avatar5.jpg',
          created_at: new Date('2024-01-04T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_006',
          full_name: 'Emily Davis',
          email: 'emily.davis@example.com',
          designation: 'Operations Manager',
          phone_number: '+1234567895',
          gender: 'Female',
          avatar_url: 'https://example.com/avatar6.jpg',
          created_at: new Date('2024-01-05T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_007',
          full_name: 'Robert Taylor',
          email: 'robert.taylor@example.com',
          designation: 'Network Engineer',
          phone_number: '+1234567896',
          gender: 'Male',
          avatar_url: 'https://example.com/avatar7.jpg',
          created_at: new Date('2024-01-06T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        },
        {
          id: 'user_008',
          full_name: 'Lisa Anderson',
          email: 'lisa.anderson@example.com',
          designation: 'Security Consultant',
          phone_number: '+1234567897',
          gender: 'Female',
          avatar_url: 'https://example.com/avatar8.jpg',
          created_at: new Date('2024-01-07T00:00:00Z'),
          updated_at: new Date('2024-01-15T00:00:00Z')
        }
      ]
    };
  }

  // Migrate all sample data to Firestore
  static async migrateSampleData() {
    try {
      console.log('Starting data migration to Firebase...');
      const sampleData = this.getSampleData();
      
      const results = {
        detections: [],
        alerts: [],
        cameras: [],
        detection_history: [],
        profiles: []
      };

      // Migrate detections
      console.log('Migrating detections...');
      for (const detection of sampleData.detections) {
        const result = await FirestoreService.addDetection(detection);
        results.detections.push(result);
      }

      // Migrate alerts
      console.log('Migrating alerts...');
      for (const alert of sampleData.alerts) {
        const result = await FirestoreService.addAlert(alert);
        results.alerts.push(result);
      }

      // Migrate cameras
      console.log('Migrating cameras...');
      for (const camera of sampleData.cameras) {
        const result = await FirestoreService.addCamera(camera);
        results.cameras.push(result);
      }

      // Migrate detection history
      console.log('Migrating detection history...');
      for (const history of sampleData.detection_history) {
        const result = await FirestoreService.addDocument('detection_history', history);
        results.detection_history.push(result);
      }

      // Migrate profiles
      console.log('Migrating profiles...');
      for (const profile of sampleData.profiles) {
        const result = await FirestoreService.addDocument('profiles', profile);
        results.profiles.push(result);
      }

      console.log('Data migration completed successfully!');
      return {
        success: true,
        results,
        summary: {
          detections: results.detections.filter(r => !r.error).length,
          alerts: results.alerts.filter(r => !r.error).length,
          cameras: results.cameras.filter(r => !r.error).length,
          detection_history: results.detection_history.filter(r => !r.error).length,
          profiles: results.profiles.filter(r => !r.error).length
        }
      };

    } catch (error) {
      console.error('Data migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Migrate specific collection
  static async migrateCollection(collectionName, data) {
    try {
      console.log(`Migrating ${collectionName}...`);
      const results = [];

      for (const item of data) {
        let result;
        switch (collectionName) {
          case 'detections':
            result = await FirestoreService.addDetection(item);
            break;
          case 'alerts':
            result = await FirestoreService.addAlert(item);
            break;
          case 'cameras':
            result = await FirestoreService.addCamera(item);
            break;
          default:
            result = await FirestoreService.addDocument(collectionName, item);
        }
        results.push(result);
      }

      return {
        success: true,
        collection: collectionName,
        results,
        migrated: results.filter(r => !r.error).length,
        errors: results.filter(r => r.error).length
      };

    } catch (error) {
      console.error(`Migration of ${collectionName} failed:`, error);
      return {
        success: false,
        collection: collectionName,
        error: error.message
      };
    }
  }

  // Clear all data from Firestore (for testing)
  static async clearAllData() {
    try {
      console.log('Clearing all data from Firestore...');
      
      // Note: This is a simplified version. In production, you'd want to be more careful
      const collections = ['detections', 'alerts', 'cameras', 'detection_history', 'profiles'];
      
      for (const collection of collections) {
        // Get all documents in the collection
        const { data } = await FirestoreService.getDocuments(collection);
        
        // Delete each document
        for (const doc of data) {
          await FirestoreService.deleteDocument(collection, doc.id);
        }
      }

      console.log('All data cleared successfully!');
      return { success: true };

    } catch (error) {
      console.error('Failed to clear data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get migration status
  static async getMigrationStatus() {
    try {
      const collections = ['detections', 'alerts', 'cameras', 'detection_history', 'profiles'];
      const status = {};

      for (const collection of collections) {
        const { data } = await FirestoreService.getDocuments(collection);
        status[collection] = data.length;
      }

      return {
        success: true,
        status,
        total: Object.values(status).reduce((sum, count) => sum + count, 0)
      };

    } catch (error) {
      console.error('Failed to get migration status:', error);
      return { success: false, error: error.message };
    }
  }
} 