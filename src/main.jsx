import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Version indicator for deployment verification
console.log('🚀 LeadEstate COMPLETE CRM v3.0 - SIDEBAR NAVIGATION ACTIVE - Loaded at:', new Date().toISOString())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
