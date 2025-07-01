import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Build timestamp for debugging
console.log('🚨 BUILD ACTIVE:', new Date().toISOString())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
