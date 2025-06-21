// Looker Studio Service for Google Data Studio Integration
export class LookerStudioService {
  
  // Configuration for Looker Studio API
  static config = {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || null,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || null,
    projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID || null,
    datasetId: import.meta.env.VITE_LOOKER_DATASET_ID || null,
    reportId: import.meta.env.VITE_LOOKER_REPORT_ID || null
  };

  // Check if configuration is complete
  static isConfigured() {
    return !!(this.config.apiKey && this.config.clientId && this.config.projectId);
  }

  // Initialize Looker Studio with Google API
  static async initialize() {
    try {
      // Check if configuration is available
      if (!this.isConfigured()) {
        console.warn('Looker Studio configuration incomplete. Please set up environment variables.');
        return { 
          success: false, 
          error: 'Configuration incomplete. Please check environment variables.',
          missingConfig: true
        };
      }

      // Load Google API client
      await this.loadGoogleAPI();
      
      // Initialize the API client
      await window.gapi.client.init({
        apiKey: this.config.apiKey,
        clientId: this.config.clientId,
        scope: 'https://www.googleapis.com/auth/datastudio.readonly'
      });

      console.log('Looker Studio API initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Looker Studio:', error);
      return { success: false, error: error.message };
    }
  }

  // Load Google API client
  static loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', resolve);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Create a new Looker Studio dashboard
  static async createDashboard(dashboardConfig) {
    try {
      const response = await window.gapi.client.request({
        path: 'https://datastudio.googleapis.com/v1/reports',
        method: 'POST',
        body: {
          name: dashboardConfig.name,
          type: 'REPORT',
          dataSourceId: dashboardConfig.dataSourceId,
          charts: dashboardConfig.charts || []
        }
      });

      return { success: true, reportId: response.result.reportId };
    } catch (error) {
      console.error('Failed to create dashboard:', error);
      return { success: false, error: error.message };
    }
  }

  // Get existing dashboards
  static async getDashboards() {
    try {
      const response = await window.gapi.client.request({
        path: 'https://datastudio.googleapis.com/v1/reports',
        method: 'GET'
      });

      return { success: true, dashboards: response.result.reports || [] };
    } catch (error) {
      console.error('Failed to get dashboards:', error);
      return { success: false, error: error.message };
    }
  }

  // Create data source from Firestore
  static async createFirestoreDataSource() {
    try {
      const dataSourceConfig = {
        name: 'Smart City Firestore Data',
        type: 'FIREBASE_FIRESTORE',
        parameters: {
          projectId: this.config.projectId,
          collectionId: 'detections'
        }
      };

      const response = await window.gapi.client.request({
        path: 'https://datastudio.googleapis.com/v1/dataSources',
        method: 'POST',
        body: dataSourceConfig
      });

      return { success: true, dataSourceId: response.result.dataSourceId };
    } catch (error) {
      console.error('Failed to create data source:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate dashboard URL for embedding
  static getDashboardUrl(reportId, params = {}) {
    const baseUrl = `https://datastudio.google.com/embed/reporting/${reportId}/page/`;
    const queryParams = new URLSearchParams(params);
    return `${baseUrl}?${queryParams.toString()}`;
  }

  // Create sample dashboard configuration
  static getSampleDashboardConfig() {
    return {
      name: 'Smart City Analytics Dashboard',
      charts: [
        {
          type: 'TIME_SERIES',
          title: 'Detection Trends Over Time',
          dataSource: 'detections',
          dimensions: ['timestamp'],
          metrics: ['count']
        },
        {
          type: 'PIE_CHART',
          title: 'Detection Types Distribution',
          dataSource: 'detections',
          dimensions: ['label'],
          metrics: ['count']
        },
        {
          type: 'BAR_CHART',
          title: 'Alerts by Severity',
          dataSource: 'alerts',
          dimensions: ['severity'],
          metrics: ['count']
        },
        {
          type: 'GEO_CHART',
          title: 'Detections by Location',
          dataSource: 'detections',
          dimensions: ['location'],
          metrics: ['count']
        }
      ]
    };
  }

  // Export dashboard data
  static async exportDashboardData(reportId, format = 'CSV') {
    try {
      const response = await window.gapi.client.request({
        path: `https://datastudio.googleapis.com/v1/reports/${reportId}:export`,
        method: 'POST',
        body: {
          format: format,
          timezone: 'UTC'
        }
      });

      return { success: true, data: response.result };
    } catch (error) {
      console.error('Failed to export dashboard data:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule automated reports
  static async scheduleReport(reportId, scheduleConfig) {
    try {
      const response = await window.gapi.client.request({
        path: `https://datastudio.googleapis.com/v1/reports/${reportId}/schedules`,
        method: 'POST',
        body: {
          delivery: {
            email: scheduleConfig.email,
            subject: scheduleConfig.subject || 'Smart City Analytics Report'
          },
          schedule: {
            frequency: scheduleConfig.frequency || 'DAILY',
            startDate: scheduleConfig.startDate || new Date().toISOString()
          }
        }
      });

      return { success: true, scheduleId: response.result.scheduleId };
    } catch (error) {
      console.error('Failed to schedule report:', error);
      return { success: false, error: error.message };
    }
  }

  // Get real-time data updates
  static async getRealTimeData(dataSourceId) {
    try {
      const response = await window.gapi.client.request({
        path: `https://datastudio.googleapis.com/v1/dataSources/${dataSourceId}/data`,
        method: 'GET'
      });

      return { success: true, data: response.result };
    } catch (error) {
      console.error('Failed to get real-time data:', error);
      return { success: false, error: error.message };
    }
  }
} 