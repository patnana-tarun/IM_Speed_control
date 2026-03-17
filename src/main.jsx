import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MotorProvider } from './context/MotorContext';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MotorProvider>
        <App />
      </MotorProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
