import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { FORCE_REBUILD_TIMESTAMP } from '../FORCE_REBUILD.js'

// Force new bundle generation
console.log('🚨 FORCE REBUILD ACTIVE:', FORCE_REBUILD_TIMESTAMP)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
