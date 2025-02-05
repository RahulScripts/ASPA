import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom' // Import BrowserRouter
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        {' '}
        {/* Wrap your App with BrowserRouter */}
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
)
