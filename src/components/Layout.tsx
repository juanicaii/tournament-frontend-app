import { ReactNode } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'
import { useBrandConfig } from '../hooks/useBrandConfig'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { config } = useBrandConfig()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pwa-content md:pb-0">
        {children}
      </main>
      
      <BottomNav />
      
      {/* PWA Install Prompt (placeholder for future implementation) */}
      {config?.app.name && (
        <div className="sr-only">
          {config.app.name} - {config.app.slogan}
        </div>
      )}
    </div>
  )
}