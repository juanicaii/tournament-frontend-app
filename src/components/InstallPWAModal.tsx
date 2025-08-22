import React from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface InstallPWAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

const InstallPWAModal: React.FC<InstallPWAModalProps> = ({ isOpen, onClose, onInstall }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="mb-4">
            <Smartphone className="mx-auto text-green-600" size={48} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ¡Instala Sanpa League!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Instala nuestra aplicación en tu dispositivo para acceder rápidamente
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onInstall}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Instalar Aplicación
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ahora no
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>• Acceso rápido desde tu pantalla de inicio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAModal;

// El hook PWA ahora está en PWAContext.tsx