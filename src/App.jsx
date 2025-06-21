// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Detection_History from './pages/Detection_History';
import Alerts from './pages/Alerts';
import Live_Camera from './pages/Live_Camera';
import Settings from './pages/Settings';
import Login from './auth/Login';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Signup from './auth/Signup';
import DataMigration from './components/DataMigration';
import LookerStudio from './pages/LookerStudio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/migration" element={<DataMigration />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/*" element={
          <PrivateRoute>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 bg-[#f9f9f9] overflow-y-auto md:ml-[250px]">
                <Routes>
                  <Route path="/" element={<Dashboard title="Dashboard" />} />
                  <Route path="/detections" element={<Detection_History title="Detection History" />} />
                  <Route path="/alerts" element={<Alerts title="Alerts" />} />
                  <Route path="/live" element={<Live_Camera title="Live Camera Feed" />} />
                  <Route path="/analytics" element={<LookerStudio title="Looker Studio Analytics" />} />
                  <Route path="/settings" element={<Settings title="Settings" />} />
                </Routes>
              </main>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
