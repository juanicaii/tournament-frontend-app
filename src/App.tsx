import { Routes, Route } from 'react-router-dom'
import { useBrandConfig } from './hooks/useBrandConfig'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TournamentPage from './pages/TournamentPage'
import InstallPWAModal from './components/InstallPWAModal'
import { PWAProvider, usePWAInstall } from './contexts/PWAContext'
import { Loader2 } from 'lucide-react'

function AppContent() {
  const { loading, error } = useBrandConfig()
  const { showInstallModal, installPWA, closeInstallModal, forceShowInstallModal, isInstallable } = usePWAInstall()
  
  // Verificar si estamos en desarrollo

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Error de Configuración</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournament/:id" element={<TournamentPage />} />
          <Route path="/tournament/:id/:tab" element={<TournamentPage />} />
        </Routes>
      </Layout>
      
     
      
      <InstallPWAModal 
        isOpen={showInstallModal} 
        onClose={closeInstallModal} 
        onInstall={installPWA} 
      />
    </>
  )
}

function App() {
  return (
    <PWAProvider>
      <AppContent />
    </PWAProvider>
  )
}

export default App