import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { BrandConfig } from '../types/brand'
import { brandConfigService } from '../services/brandConfig'

interface BrandContextValue {
  config: BrandConfig | null
  loading: boolean
  error: string | null
  configId: string
  reloadConfig: () => Promise<void>
}

const BrandContext = createContext<BrandContextValue | null>(null)

interface BrandProviderProps {
  children: ReactNode
}

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const [config, setConfig] = useState<BrandConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const brandConfig = await brandConfigService.loadBrandConfig()
        setConfig(brandConfig)
        
        // Update document title
        if (brandConfig.app.name) {
          document.title = brandConfig.app.name
        }
        
      } catch (err) {
        console.error('Brand config error:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar la configuración de marca')
      } finally {
        setLoading(false)
      }
    }
    
    loadConfig()
  }, [])
  
  const reloadConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const brandConfig = await brandConfigService.reloadConfig()
      setConfig(brandConfig)
      
      // Update document title
      if (brandConfig.app.name) {
        document.title = brandConfig.app.name
      }
      
    } catch (err) {
      console.error('Error reloading brand config:', err)
      setError(err instanceof Error ? err.message : 'Error al recargar la configuración')
    } finally {
      setLoading(false)
    }
  }
  
  const contextValue: BrandContextValue = {
    config,
    loading,
    error,
    configId: brandConfigService.getConfigId(),
    reloadConfig
  }
  
  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  )
}

export const useBrandConfig = (): BrandContextValue => {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrandConfig must be used within BrandProvider')
  }
  return context
}