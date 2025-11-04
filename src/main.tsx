import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { seedAll } from './lib/seedAll'
import './lib/demoUtils'

// Seed BEFORE React renders to ensure demo data is available
console.log('🌱 Running seedAll before React render...')
seedAll()
console.log('✅ seedAll complete')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
