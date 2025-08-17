import { useBrandConfig } from '../hooks/useBrandConfig'
import { Link } from 'react-router-dom'

export default function Header() {
  const { config } = useBrandConfig()

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
              {config?.app.name || 'Sampa League'}
            </span>
            {config?.app.slogan && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                {config.app.slogan}
              </span>
            )}
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2">
        </div>
      </div>
    </header>
  )
}