import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../contexts/PWAContext';

interface PWADebugInfo {
  isHTTPS: boolean;
  hasServiceWorker: boolean;
  serviceWorkerState: string;
  manifestLinked: boolean;
  beforeInstallPromptSupported: boolean;
  isStandalone: boolean;
  isInWebAppiOS: boolean;
  userAgent: string;
  hostname: string;
  protocol: string;
}

const PWADebug: React.FC = () => {
  const { deferredPrompt, isInstallable, showInstallModal } = usePWAInstall();
  const [debugInfo, setDebugInfo] = useState<PWADebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info: PWADebugInfo = {
        isHTTPS: window.location.protocol === 'https:',
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerState: 'not_supported',
        manifestLinked: !!document.querySelector('link[rel="manifest"]'),
        beforeInstallPromptSupported: 'onbeforeinstallprompt' in window,
        isStandalone: window.matchMedia && window.matchMedia('(display-mode: standalone)').matches,
        isInWebAppiOS: (window.navigator as any).standalone === true,
        userAgent: navigator.userAgent,
        hostname: window.location.hostname,
        protocol: window.location.protocol
      };

      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            if (registration.active) {
              info.serviceWorkerState = 'active';
            } else if (registration.installing) {
              info.serviceWorkerState = 'installing';
            } else if (registration.waiting) {
              info.serviceWorkerState = 'waiting';
            } else {
              info.serviceWorkerState = 'registered_but_inactive';
            }
          } else {
            info.serviceWorkerState = 'not_registered';
          }
        } catch (error) {
          info.serviceWorkerState = 'error: ' + (error as Error).message;
        }
      }

      setDebugInfo(info);
    };

    gatherDebugInfo();
  }, []);

  if (!debugInfo) {
    return null;
  }

  const getStatusIcon = (condition: boolean) => condition ? '✅' : '❌';
  const getServiceWorkerIcon = (state: string) => {
    if (state === 'active') return '✅';
    if (state.includes('error')) return '❌';
    if (state === 'not_supported' || state === 'not_registered') return '❌';
    return '⚠️';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="PWA Debug Info"
      >
        🔍 PWA
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">PWA Debug Info</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="border-b pb-2">
              <h4 className="font-semibold mb-1">Contexto PWA:</h4>
              <div>🎯 Installable: {getStatusIcon(isInstallable)} {isInstallable ? 'Sí' : 'No'}</div>
              <div>📱 Deferred Prompt: {getStatusIcon(!!deferredPrompt)} {deferredPrompt ? 'Disponible' : 'No disponible'}</div>
              <div>🔔 Modal Visible: {getStatusIcon(showInstallModal)} {showInstallModal ? 'Sí' : 'No'}</div>
            </div>
            
            <div className="border-b pb-2">
              <h4 className="font-semibold mb-1">Requisitos PWA:</h4>
              <div>🔒 HTTPS: {getStatusIcon(debugInfo.isHTTPS)} {debugInfo.protocol}</div>
              <div>⚙️ Service Worker: {getServiceWorkerIcon(debugInfo.serviceWorkerState)} {debugInfo.serviceWorkerState}</div>
              <div>📄 Manifest: {getStatusIcon(debugInfo.manifestLinked)} {debugInfo.manifestLinked ? 'Enlazado' : 'No enlazado'}</div>
              <div>🎪 Install Prompt: {getStatusIcon(debugInfo.beforeInstallPromptSupported)} {debugInfo.beforeInstallPromptSupported ? 'Soportado' : 'No soportado'}</div>
            </div>
            
            <div className="border-b pb-2">
              <h4 className="font-semibold mb-1">Estado de Instalación:</h4>
              <div>📱 Standalone: {getStatusIcon(debugInfo.isStandalone)} {debugInfo.isStandalone ? 'Sí' : 'No'}</div>
              <div>🍎 iOS Web App: {getStatusIcon(debugInfo.isInWebAppiOS)} {debugInfo.isInWebAppiOS ? 'Sí' : 'No'}</div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Información del Sistema:</h4>
              <div className="text-xs break-all">
                <div>🌐 Host: {debugInfo.hostname}</div>
                <div>📱 UA: {debugInfo.userAgent.substring(0, 50)}...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWADebug;