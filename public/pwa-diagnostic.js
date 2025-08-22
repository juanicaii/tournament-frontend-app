// PWA Diagnostic Script
// Ejecutar en la consola del navegador en producción para diagnosticar problemas de PWA

(function() {
  console.log('🔍 Iniciando diagnóstico PWA...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    
    // Verificaciones básicas
    isHTTPS: window.location.protocol === 'https:',
    hasServiceWorker: 'serviceWorker' in navigator,
    hasManifest: !!document.querySelector('link[rel="manifest"]'),
    beforeInstallPromptSupported: 'onbeforeinstallprompt' in window,
    
    // Estado de instalación
    isStandalone: window.matchMedia && window.matchMedia('(display-mode: standalone)').matches,
    isInWebAppiOS: navigator.standalone === true,
    
    // Información del navegador
    isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
    isFirefox: /Firefox/.test(navigator.userAgent),
    isEdge: /Edg/.test(navigator.userAgent),
    
    // Estado del service worker
    serviceWorkerState: null,
    manifestData: null,
    installPromptFired: false
  };
  
  // Función para verificar service worker
  async function checkServiceWorker() {
    if (!diagnostics.hasServiceWorker) {
      diagnostics.serviceWorkerState = 'not_supported';
      return;
    }
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        if (registration.active) {
          diagnostics.serviceWorkerState = 'active';
        } else if (registration.installing) {
          diagnostics.serviceWorkerState = 'installing';
        } else if (registration.waiting) {
          diagnostics.serviceWorkerState = 'waiting';
        } else {
          diagnostics.serviceWorkerState = 'registered_but_inactive';
        }
        
        // Información adicional del service worker
        diagnostics.serviceWorkerScope = registration.scope;
        diagnostics.serviceWorkerScriptURL = registration.active?.scriptURL;
      } else {
        diagnostics.serviceWorkerState = 'not_registered';
      }
    } catch (error) {
      diagnostics.serviceWorkerState = 'error: ' + error.message;
    }
  }
  
  // Función para verificar manifest
  async function checkManifest() {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      diagnostics.manifestData = 'no_link_found';
      return;
    }
    
    try {
      const response = await fetch(manifestLink.href);
      if (response.ok) {
        const manifest = await response.json();
        diagnostics.manifestData = {
          name: manifest.name,
          short_name: manifest.short_name,
          start_url: manifest.start_url,
          display: manifest.display,
          icons_count: manifest.icons?.length || 0,
          has_512_icon: manifest.icons?.some(icon => icon.sizes?.includes('512x512')) || false,
          has_192_icon: manifest.icons?.some(icon => icon.sizes?.includes('192x192')) || false
        };
      } else {
        diagnostics.manifestData = 'fetch_error: ' + response.status;
      }
    } catch (error) {
      diagnostics.manifestData = 'parse_error: ' + error.message;
    }
  }
  
  // Listener para beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🎉 beforeinstallprompt event fired!');
    diagnostics.installPromptFired = true;
    diagnostics.installPromptPlatforms = e.platforms;
  });
  
  // Función principal de diagnóstico
  async function runDiagnostics() {
    await checkServiceWorker();
    await checkManifest();
    
    // Esperar un poco para ver si se dispara beforeinstallprompt
    setTimeout(() => {
      console.log('📊 Resultados del diagnóstico PWA:');
      console.table(diagnostics);
      
      // Análisis de problemas
      const issues = [];
      const recommendations = [];
      
      if (!diagnostics.isHTTPS) {
        issues.push('❌ No está usando HTTPS');
        recommendations.push('Asegurar que el sitio use HTTPS');
      }
      
      if (!diagnostics.hasServiceWorker) {
        issues.push('❌ Service Worker no soportado');
      } else if (diagnostics.serviceWorkerState !== 'active') {
        issues.push(`❌ Service Worker no está activo: ${diagnostics.serviceWorkerState}`);
        recommendations.push('Verificar la configuración del service worker');
      }
      
      if (!diagnostics.hasManifest) {
        issues.push('❌ Manifest no enlazado');
        recommendations.push('Agregar <link rel="manifest" href="/manifest.json"> al HTML');
      } else if (typeof diagnostics.manifestData === 'string') {
        issues.push(`❌ Problema con manifest: ${diagnostics.manifestData}`);
        recommendations.push('Verificar que el manifest.json sea válido y accesible');
      }
      
      if (!diagnostics.beforeInstallPromptSupported) {
        issues.push('❌ beforeinstallprompt no soportado en este navegador');
        if (diagnostics.isSafari) {
          recommendations.push('Safari requiere configuración manual para PWA');
        }
      }
      
      if (!diagnostics.installPromptFired && diagnostics.beforeInstallPromptSupported) {
        issues.push('⚠️ beforeinstallprompt no se ha disparado aún');
        recommendations.push('Verificar que se cumplan todos los criterios PWA');
      }
      
      if (diagnostics.isStandalone || diagnostics.isInWebAppiOS) {
        console.log('✅ La PWA ya está instalada');
      }
      
      if (issues.length > 0) {
        console.log('🚨 Problemas encontrados:');
        issues.forEach(issue => console.log(issue));
        
        console.log('💡 Recomendaciones:');
        recommendations.forEach(rec => console.log('  • ' + rec));
      } else {
        console.log('✅ Todos los criterios PWA se cumplen');
      }
      
      // Información adicional para debugging
      console.log('\n🔧 Para debugging adicional:');
      console.log('• Verificar Network tab para errores de service worker');
      console.log('• Verificar Application tab > Manifest');
      console.log('• Verificar Application tab > Service Workers');
      console.log('• Usar Lighthouse para auditoría PWA completa');
      
      return diagnostics;
    }, 3000);
  }
  
  // Ejecutar diagnósticos
  runDiagnostics();
  
  // Hacer disponible globalmente para uso manual
  window.PWADiagnostic = {
    run: runDiagnostics,
    data: diagnostics
  };
  
  console.log('💡 Tip: Ejecuta PWADiagnostic.run() para volver a ejecutar el diagnóstico');
})();