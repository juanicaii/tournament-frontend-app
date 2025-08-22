import { useBrandConfig } from '../hooks/useBrandConfig'
import { usePWAInstall } from '../contexts/PWAContext'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'

export default function Header() {
  const { config } = useBrandConfig()
  const { isInstallable, showInstallPrompt } = usePWAInstall()
  
  console.log('Header: isInstallable =', isInstallable)
  console.log('Header: showInstallPrompt =', typeof showInstallPrompt)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          {config?.assets.logoSmall && (
            <img 
              src={config.assets.logoSmall} 
              alt="Logo" 
              className="h-12 w-12"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary">
              {config?.app.name || 'Cargando...'}
            </span>
            {config?.app.slogan && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                {config.app.slogan || 'Cargando...'}
              </span>
            )}
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {isInstallable && (
            <button
              onClick={() => {
                console.log('Header: Botón de instalación clickeado')
                showInstallPrompt()
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Instalar aplicación"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}
          
         
         <span className='text-sm text-muted-foreground font-thin italic hidden md:flex'>
          Develop by
         </span>
         <img 
         onClick={() => {
          window.open('https://jssoftware.com.ar', '_blank')
         }}
          src="/logo.png" 
          alt="Logo" 
          className="h-20 w-20 cursor-pointer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
         />

        </div>
      </div>
    </header>
  )
}