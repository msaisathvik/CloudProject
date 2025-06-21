import React, { useState, useEffect, useContext } from 'react';
import { LookerStudioService } from '../services/lookerStudioService';
import LookerStudioDemo from '../components/LookerStudioDemo';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css';
import DetectionDataContext from '../context/DetectionDataContext';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Map, 
  Download, 
  Mail, 
  RefreshCw, 
  Settings,
  Eye,
  Plus,
  Code,
  Play
} from 'lucide-react';

const LookerStudio = () => {
  const { state } = useContext(DetectionDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [scheduleConfig, setScheduleConfig] = useState({
    email: '',
    frequency: 'DAILY',
    subject: 'Smart City Analytics Report'
  });

  useEffect(() => {
    if (!isDemoMode) {
      initializeLookerStudio();
    }
  }, [isDemoMode]);

  const initializeLookerStudio = async () => {
    setIsLoading(true);
    try {
      const result = await LookerStudioService.initialize();
      if (result.success) {
        setIsInitialized(true);
        await loadDashboards();
      } else {
        console.error('Failed to initialize Looker Studio:', result.error);
        if (result.missingConfig) {
          // Configuration is missing, stay in demo mode
          console.log('Staying in demo mode due to missing configuration');
        }
      }
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboards = async () => {
    try {
      const result = await LookerStudioService.getDashboards();
      if (result.success) {
        setDashboards(result.dashboards);
      }
    } catch (error) {
      console.error('Failed to load dashboards:', error);
    }
  };

  const createDashboard = async () => {
    setIsLoading(true);
    try {
      // First create data source
      const dataSourceResult = await LookerStudioService.createFirestoreDataSource();
      if (!dataSourceResult.success) {
        throw new Error('Failed to create data source');
      }

      // Create dashboard with sample configuration
      const dashboardConfig = LookerStudioService.getSampleDashboardConfig();
      dashboardConfig.dataSourceId = dataSourceResult.dataSourceId;

      const result = await LookerStudioService.createDashboard(dashboardConfig);
      if (result.success) {
        await loadDashboards();
        setShowCreateDialog(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportDashboard = async (reportId) => {
    try {
      const result = await LookerStudioService.exportDashboardData(reportId, 'CSV');
      if (result.success) {
        // Create download link
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smart-city-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export dashboard:', error);
    }
  };

  const scheduleReport = async () => {
    if (!selectedDashboard) return;

    try {
      const result = await LookerStudioService.scheduleReport(selectedDashboard.reportId, scheduleConfig);
      if (result.success) {
        setShowScheduleDialog(false);
        setScheduleConfig({ email: '', frequency: 'DAILY', subject: 'Smart City Analytics Report' });
      }
    } catch (error) {
      console.error('Failed to schedule report:', error);
    }
  };

  const getDashboardEmbedUrl = (reportId) => {
    return LookerStudioService.getDashboardUrl(reportId, {
      theme: 'light',
      showTitle: true,
      showNav: true
    });
  };

  // If in demo mode, show the demo component
  if (isDemoMode) {
    console.log('Rendering LookerStudioDemo component');
    return <LookerStudioDemo />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Helix size="45" speed="2.5" color="#1B59F8" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Looker Studio Analytics</h1>
          <p className="text-gray-600 mt-2">Advanced analytics and visualization for smart city data</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsDemoMode(true)}
            variant="outline"
          >
            <Play className="h-4 w-4 mr-2" />
            Demo Mode
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dashboard
          </Button>
          <Button
            onClick={loadDashboards}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={isInitialized ? 'text-green-600' : 'text-red-600'}>
              {isInitialized ? 'Connected to Looker Studio' : 'Not connected'}
            </span>
          </div>
          {!isInitialized && (
            <p className="text-sm text-gray-500 mt-2">
              Please check your Google API credentials and try refreshing the page.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dashboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.reportId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{dashboard.name}</CardTitle>
              <p className="text-sm text-gray-500">
                Created: {new Date(dashboard.createTime).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                {dashboard.viewCount || 0} views
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedDashboard(dashboard)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportDashboard(dashboard.reportId)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDashboard(dashboard);
                    setShowScheduleDialog(true);
                  }}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Dashboards Message */}
      {dashboards.length === 0 && isInitialized && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Dashboards Found</h3>
            <p className="text-gray-500 mb-4">
              Create your first dashboard to start analyzing smart city data
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Embed Modal */}
      {selectedDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedDashboard.name}</h2>
              <Button
                variant="outline"
                onClick={() => setSelectedDashboard(null)}
              >
                Close
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={getDashboardEmbedUrl(selectedDashboard.reportId)}
                className="w-full h-full border-0 rounded"
                title={selectedDashboard.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Dashboard Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Dashboard</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new Looker Studio dashboard with sample charts for smart city analytics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <h4 className="font-semibold mb-2">Dashboard will include:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Detection Trends Over Time
              </li>
              <li className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Detection Types Distribution
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Alerts by Severity
              </li>
              <li className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Detections by Location
              </li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createDashboard}>
              Create Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Report Dialog */}
      <AlertDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Automated Report</AlertDialogTitle>
            <AlertDialogDescription>
              Set up automated email delivery of dashboard reports.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={scheduleConfig.email}
                onChange={(e) => setScheduleConfig({...scheduleConfig, email: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select
                value={scheduleConfig.frequency}
                onChange={(e) => setScheduleConfig({...scheduleConfig, frequency: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={scheduleConfig.subject}
                onChange={(e) => setScheduleConfig({...scheduleConfig, subject: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="Report subject"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={scheduleReport}>
              Schedule Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LookerStudio; 