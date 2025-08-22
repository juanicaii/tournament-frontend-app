import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  showInstallModal: boolean;
  isInstallable: boolean;
  installPWA: () => Promise<void>;
  closeInstallModal: () => void;
  showInstallPrompt: () => void;
  forceShowInstallModal: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    console.log('PWA Context: Inicializando listeners');
    
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Context: beforeinstallprompt event triggered');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Mostrar el modal después de 3 segundos si no se ha mostrado antes
      const hasShownInstallPrompt = localStorage.getItem('pwa-install-prompt-shown');
      console.log('PWA Context: hasShownInstallPrompt:', hasShownInstallPrompt);
      
      if (!hasShownInstallPrompt) {
        console.log('PWA Context: Programando modal para mostrar en 5 segundos');
        setTimeout(() => {
          console.log('PWA Context: Mostrando modal de instalación automático');
          setShowInstallModal(true);
        }, 5000); // Aumenté el tiempo para dar más oportunidad al usuario
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA Context: App instalada');
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowInstallModal(false);
      localStorage.setItem('pwa-install-prompt-shown', 'true');
    };

    // Verificar si ya está instalada
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;
    
    console.log('PWA Context: Estado de instalación:', {
      isStandalone,
      isInWebAppiOS,
      isInstalled,
      hostname: window.location.hostname
    });
    
    if (isInstalled) {
      console.log('PWA Context: App ya está instalada');
      setIsInstallable(false);
    } else {
      console.log('PWA Context: App no está instalada');
      // En desarrollo, permitir siempre la instalación para testing
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDev) {
        console.log('PWA Context: Modo desarrollo - habilitando instalación para testing');
        setIsInstallable(true);
      }
      // En producción, esperar el evento beforeinstallprompt
      console.log('PWA Context: Esperando evento beforeinstallprompt en producción');
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Para testing en desarrollo, mostrar modal después de 5 segundos
    let testTimeout: number;
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      testTimeout = setTimeout(() => {
        const hasShownInstallPrompt = localStorage.getItem('pwa-install-prompt-shown');
        if (!hasShownInstallPrompt && !isInstalled) {
          console.log('PWA Context: Modo desarrollo - mostrando modal de testing');
          setShowInstallModal(true);
        }
      }, 8000); // Aumenté a 8 segundos para evitar conflictos
    }
    
    // Verificar criterios PWA en producción
    if (!isDev && !isInstalled) {
      // Verificar que el sitio cumpla con los criterios PWA
      console.log('PWA Context: Verificando criterios PWA en producción');
      
      // Verificar HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      console.log('PWA Context: HTTPS:', isHTTPS);
      
      // Verificar service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log('PWA Context: Service Workers registrados:', registrations.length);
          if (registrations.length > 0) {
            console.log('PWA Context: Service Worker activo, PWA puede ser instalable');
          }
        });
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (testTimeout) clearTimeout(testTimeout);
    };
  }, []);

  const installPWA = async () => {
    console.log('PWA Context: Intentando instalar PWA');
    
    if (!deferredPrompt) {
      console.log('PWA Context: No hay deferredPrompt disponible');
      // En desarrollo, simular instalación
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDev) {
        console.log('PWA Context: Simulando instalación en desarrollo');
        localStorage.setItem('pwa-install-prompt-shown', 'true');
        setShowInstallModal(false);
        setIsInstallable(false);
        alert('PWA instalada exitosamente (simulación en desarrollo)');
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA Context: Resultado de instalación:', outcome);
      
      if (outcome === 'accepted') {
        console.log('PWA Context: Usuario aceptó la instalación');
        localStorage.setItem('pwa-install-prompt-shown', 'true');
      } else {
        console.log('PWA Context: Usuario rechazó la instalación');
      }
      
      setDeferredPrompt(null);
      setShowInstallModal(false);
    } catch (error) {
      console.error('PWA Context: Error durante la instalación:', error);
    }
  };

  const closeInstallModal = () => {
    console.log('PWA Context: Cerrando modal de instalación');
    setShowInstallModal(false);
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  const showInstallPrompt = () => {
    console.log('PWA Context: Mostrando prompt de instalación manualmente');
    console.log('PWA Context: Estado actual:', {
      deferredPrompt: !!deferredPrompt,
      isInstallable,
      showInstallModal
    });
    
    if (deferredPrompt) {
      // Si hay un prompt nativo disponible, usarlo directamente
      console.log('PWA Context: Usando prompt nativo');
      installPWA();
    } else {
      // Si no hay prompt nativo, mostrar modal personalizado
      console.log('PWA Context: Mostrando modal personalizado');
      setShowInstallModal(true);
    }
  };

  const forceShowInstallModal = () => {
    console.log('PWA Context: Forzando modal de instalación para testing');
    setIsInstallable(true);
    setShowInstallModal(true);
  };

  return (
    <PWAContext.Provider value={{
      deferredPrompt,
      showInstallModal,
      isInstallable,
      installPWA,
      closeInstallModal,
      showInstallPrompt,
      forceShowInstallModal
    }}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWAInstall = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAInstall must be used within a PWAProvider');
  }
  return context;
};