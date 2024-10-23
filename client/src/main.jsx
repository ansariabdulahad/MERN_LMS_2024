import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth-context/index.jsx'
import { Toaster } from './components/ui/toaster.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <StrictMode>
        <App />
        <Toaster />
      </StrictMode>
    </AuthProvider>
  </BrowserRouter>
)
