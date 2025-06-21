import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DetectionDataProvider } from './context/DetectionDataContext'
import './lib/firebase-test.js' // Test Firebase connectivity

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DetectionDataProvider>
      <App />
    </DetectionDataProvider>
  </StrictMode>,
)
