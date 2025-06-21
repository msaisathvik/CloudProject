import React, { useState, useEffect } from 'react';
import { DataMigrationService } from '../services/dataMigrationService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    checkCurrentData();
  }, []);

  const checkCurrentData = async () => {
    try {
      const status = await DataMigrationService.getMigrationStatus();
      if (status.success) {
        setCurrentData(status.status);
      }
    } catch (error) {
      console.error('Error checking current data:', error);
    }
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await DataMigrationService.migrateSampleData();
      setMigrationStatus(result);
      if (result.success) {
        await checkCurrentData(); // Refresh data count
      }
    } catch (error) {
      setMigrationStatus({ success: false, error: error.message });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setIsMigrating(true);
      try {
        const result = await DataMigrationService.clearAllData();
        setMigrationStatus(result);
        if (result.success) {
          await checkCurrentData(); // Refresh data count
        }
      } catch (error) {
        setMigrationStatus({ success: false, error: error.message });
      } finally {
        setIsMigrating(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Migration Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentData.detections || 0}</div>
              <div className="text-sm text-gray-600">Detections</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentData.alerts || 0}</div>
              <div className="text-sm text-gray-600">Alerts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentData.cameras || 0}</div>
              <div className="text-sm text-gray-600">Cameras</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{currentData.detection_history || 0}</div>
              <div className="text-sm text-gray-600">History</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{currentData.profiles || 0}</div>
              <div className="text-sm text-gray-600">Profiles</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleMigration} 
              disabled={isMigrating}
              className="flex-1"
            >
              {isMigrating ? 'Migrating...' : 'Run Migration (Add Sample Data)'}
            </Button>
            <Button 
              onClick={handleClearData} 
              disabled={isMigrating}
              variant="destructive"
            >
              Clear All Data
            </Button>
          </div>

          {migrationStatus && (
            <div className={`p-4 rounded-lg ${
              migrationStatus.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                migrationStatus.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {migrationStatus.success ? 'Migration Successful!' : 'Migration Failed'}
              </h3>
              {migrationStatus.success && migrationStatus.summary && (
                <div className="mt-2 text-sm text-green-700">
                  <p>Migrated:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>{migrationStatus.summary.detections} detections</li>
                    <li>{migrationStatus.summary.alerts} alerts</li>
                    <li>{migrationStatus.summary.cameras} cameras</li>
                    <li>{migrationStatus.summary.detection_history} detection history records</li>
                    <li>{migrationStatus.summary.profiles} user profiles</li>
                  </ul>
                </div>
              )}
              {migrationStatus.error && (
                <p className="mt-2 text-sm text-red-700">{migrationStatus.error}</p>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Click "Run Migration" to populate your Firestore database with sample data</li>
              <li>The data includes 15 detections, 10 alerts, 10 cameras, 20 detection history records, and 8 user profiles</li>
              <li>After migration, navigate to different pages to see the data displayed</li>
              <li>Use "Clear All Data" to remove all data if needed</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMigration; 