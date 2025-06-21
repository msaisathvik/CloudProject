import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const LookerStudioDemo = () => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  console.log('LookerStudioDemo component rendered');

  return (
    <div className="p-6 space-y-6">
      {/* Test div to verify component is rendering */}
      <div className="bg-red-500 text-white p-4 rounded">
        <h2>LookerStudioDemo Component is Rendering!</h2>
        <p>If you can see this, the component is working.</p>
      </div>
      
      {/* Simple Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Looker Studio Analytics</h1>
          <p className="text-gray-600 mt-2">Advanced analytics and visualization for smart city data</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => window.open('https://lookerstudio.google.com/', '_blank')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Open Looker Studio
          </Button>
        </div>
      </div>

      {/* Demo Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Demo Mode</h3>
              <p className="text-blue-700 text-sm">
                This is a demonstration of Looker Studio integration. The embedded dashboards are sample templates. 
                To connect your real data, follow the setup guide in <code className="bg-blue-100 px-1 rounded">LOOKER_STUDIO_SETUP.md</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Detection Analytics Dashboard</CardTitle>
            <p className="text-sm text-gray-500">Comprehensive view of detection patterns and trends</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              View Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Alert Management Dashboard</CardTitle>
            <p className="text-sm text-gray-500">Real-time alert monitoring and response tracking</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              View Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Camera Performance Dashboard</CardTitle>
            <p className="text-sm text-gray-500">Camera uptime, performance metrics, and maintenance tracking</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              View Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h4 className="font-semibold mb-1">Enable APIs</h4>
              <p className="text-sm text-gray-600">
                Enable Data Studio API in Google Cloud Console
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h4 className="font-semibold mb-1">Create Credentials</h4>
              <p className="text-sm text-gray-600">
                Generate API key and OAuth client ID
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h4 className="font-semibold mb-1">Connect Data</h4>
              <p className="text-sm text-gray-600">
                Connect Firestore collections to Looker Studio
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LookerStudioDemo; 