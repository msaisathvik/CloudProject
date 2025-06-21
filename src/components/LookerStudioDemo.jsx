import React from 'react';

const LookerStudioDemo = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Smart City Detections</h1>
        <p className="text-gray-600 mt-2">Live analytics from the first report.</p>
      </div>
      <iframe 
        width="100%" 
        height="800" 
        src="https://lookerstudio.google.com/embed/reporting/b870dce0-91af-4932-a763-9adae5a623db/page/apsOF" 
        frameBorder="0" 
        style={{ border: 0 }} 
        allowFullScreen 
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
      </iframe>
    </div>
  );
};

export default LookerStudioDemo; 