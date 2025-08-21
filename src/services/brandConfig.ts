import { BrandConfig, ColorValue } from '../types/brand'

class BrandConfigService {
  private currentConfig: BrandConfig | null = null
  private configId: string
  
  constructor() {
    this.configId = (import.meta as any).env?.VITE_BRAND_CONFIG_ID || 'default'
  }
  
  async loadBrandConfig(): Promise<BrandConfig> {
    try {
      const response = await fetch(`/brand-configs/${this.configId}/brand.json`)
      if (!response.ok) {
        return this.loadDefaultConfig()
      }
      
      const config = await response.json()
      config.assets = this.resolveAssetPaths(config.assets, this.configId)
      
      this.currentConfig = config
      this.applyBrandConfig(config)
      
      return config
    } catch (error) {
      return this.loadDefaultConfig()
    }
  }
  
  private async loadDefaultConfig(): Promise<BrandConfig> {
    const defaultConfig: BrandConfig = {
      metadata: {
        id: 'default',
        name: 'Sanpa League - Default',
        description: 'Tema por defecto para gestión de torneos',
        category: 'sport',
        version: '1.0.0',
        author: 'Sistema',
        created: '2024-01-15'
      },
      app: {
        name: 'Sanpa League',
        slogan: 'Gestión profesional de torneos',
        description: 'Progressive Web App para gestión y visualización de torneos de fútbol'
      },
      colors: {
        primary: { hsl: '145 54% 24%', hex: '#195d2c' },
        secondary: { hsl: '147 84% 17%', hex: '#085426' },
        accent: { hsl: '54 100% 50%', hex: '#ffeb00' },
        success: { hsl: '145 54% 24%', hex: '#195d2c' },
        warning: { hsl: '54 100% 50%', hex: '#ffeb00' },
        error: { hsl: '0 84% 60%', hex: '#ef4444' },
        background: { hsl: '0 0% 100%', hex: '#ffffff' },
        foreground: { hsl: '222.2 84% 4.9%', hex: '#0f172a' },
        card: { hsl: '0 0% 100%', hex: '#ffffff' },
        cardForeground: { hsl: '222.2 84% 4.9%', hex: '#0f172a' },
        muted: { hsl: '210 40% 96%', hex: '#f1f5f9' },
        mutedForeground: { hsl: '215.4 16.3% 46.9%', hex: '#64748b' },
        border: { hsl: '214.3 31.8% 91.4%', hex: '#e2e8f0' },
        sport: {
          trophy: { hsl: '45 93% 47%', hex: '#eab308' },
          victory: { hsl: '142 76% 36%', hex: '#16a34a' },
          defeat: { hsl: '0 84% 60%', hex: '#ef4444' },
          draw: { hsl: '43 74% 66%', hex: '#a3a3a3' }
        },
        extended: {
          greenLight: { hsl: '145 40% 60%', hex: '#66b68a' },
          greenLighter: { hsl: '145 40% 80%', hex: '#b8e0c9' },
          yellowLight: { hsl: '54 100% 70%', hex: '#fff266' },
          yellowLighter: { hsl: '54 100% 85%', hex: '#fff9b3' }
        }
      },
      assets: {
        logo: '/logo.svg',
        logoSmall: '/logo-small.svg',
        favicon: '/favicon.ico',
        preview: '/preview.png'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingFont: 'Inter, system-ui, sans-serif'
      },
      tournament: {
        defaultFormat: 'league',
        showBranding: true,
        allowCustomization: true
      }
    }
    
    this.currentConfig = defaultConfig
    this.applyBrandConfig(defaultConfig)
    return defaultConfig
  }
  
  private resolveAssetPaths(assets: BrandConfig['assets'], configId: string): BrandConfig['assets'] {
    const basePath = `/brand-configs/${configId}`
    return {
      logo: assets.logo.startsWith('./') ? `${basePath}/${assets.logo.slice(2)}` : assets.logo,
      logoSmall: assets.logoSmall.startsWith('./') ? `${basePath}/${assets.logoSmall.slice(2)}` : assets.logoSmall,
      favicon: assets.favicon.startsWith('./') ? `${basePath}/${assets.favicon.slice(2)}` : assets.favicon,
      preview: assets.preview.startsWith('./') ? `${basePath}/${assets.preview.slice(2)}` : assets.preview
    }
  }
  
  private applyBrandConfig(config: BrandConfig) {
    const root = document.documentElement
    
    // Apply color variables
    this.applyColorVariables(root, config.colors)
    
    // Apply favicon
    this.updateFavicon(config.assets.favicon)
    
    // Apply fonts
    this.applyTypography(config.typography)
  }
  
  private applyColorVariables(root: HTMLElement, colors: BrandConfig['colors']) {
    // Primary variables with automatic contrast
    root.style.setProperty('--primary', colors.primary.hsl)
    root.style.setProperty('--primary-foreground', this.getContrastColor(colors.primary.hsl))
    root.style.setProperty('--secondary', colors.secondary.hsl)
    root.style.setProperty('--secondary-foreground', this.getContrastColor(colors.secondary.hsl))
    root.style.setProperty('--accent', colors.accent.hsl)
    root.style.setProperty('--accent-foreground', this.getContrastColor(colors.accent.hsl))
    
    // State variables with automatic contrast
    root.style.setProperty('--destructive', colors.error.hsl)
    root.style.setProperty('--destructive-foreground', this.getContrastColor(colors.error.hsl))
    
    // Sport specific variables
    root.style.setProperty('--brand-sport-victory', colors.sport.victory.hsl)
    root.style.setProperty('--brand-sport-defeat', colors.sport.defeat.hsl)
    root.style.setProperty('--brand-sport-trophy', colors.sport.trophy.hsl)
    root.style.setProperty('--brand-sport-draw', colors.sport.draw.hsl)
    
    // Extended brand colors
    if (colors.extended) {
      Object.entries(colors.extended).forEach(([key, color]) => {
        if (this.isColorValue(color)) {
          root.style.setProperty(`--brand-extended-${key}`, color.hsl)
          root.style.setProperty(`--brand-extended-${key}-hex`, color.hex)
        }
      })
    }
    
    // Base Tailwind/shadcn variables
    root.style.setProperty('--background', colors.background.hsl)
    root.style.setProperty('--foreground', colors.foreground.hsl)
    root.style.setProperty('--card', colors.card.hsl)
    root.style.setProperty('--card-foreground', colors.cardForeground.hsl)
    root.style.setProperty('--muted', colors.muted.hsl)
    root.style.setProperty('--muted-foreground', colors.mutedForeground.hsl)
    root.style.setProperty('--border', colors.border.hsl)
    root.style.setProperty('--input', colors.border.hsl)
    root.style.setProperty('--ring', colors.primary.hsl)
    
    // Brand-specific variables for easy access
    root.style.setProperty('--brand-primary', colors.primary.hsl)
    root.style.setProperty('--brand-secondary', colors.secondary.hsl)
    root.style.setProperty('--brand-accent', colors.accent.hsl)
    root.style.setProperty('--brand-success', colors.success.hsl)
    root.style.setProperty('--brand-warning', colors.warning.hsl)
    root.style.setProperty('--brand-error', colors.error.hsl)
  }
  
  private getContrastColor(hslColor: string): string {
    const rgb = this.hslToRgb(hslColor)
    const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b)
    return luminance > 0.5 ? '0 0% 0%' : '0 0% 100%'
  }
  
  private hslToRgb(hsl: string): { r: number, g: number, b: number } {
    const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
    if (!match) {
      return { r: 0, g: 0, b: 0 }
    }
    
    const h = parseFloat(match[1]) / 360
    const s = parseFloat(match[2]) / 100
    const l = parseFloat(match[3]) / 100
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }
  
  private calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  private isColorValue(obj: any): obj is ColorValue {
    return obj && typeof obj === 'object' && 'hsl' in obj && 'hex' in obj
  }
  
  private updateFavicon(faviconUrl: string) {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
    if (link) {
      link.href = faviconUrl
    } else {
      link = document.createElement('link')
      link.rel = 'icon'
      link.href = faviconUrl
      document.head.appendChild(link)
    }
  }
  
  private applyTypography(typography: BrandConfig['typography']) {
    const root = document.documentElement
    root.style.setProperty('--font-family', typography.fontFamily)
    if (typography.headingFont) {
      root.style.setProperty('--font-heading', typography.headingFont)
    }
  }
  
  getCurrentConfig(): BrandConfig | null {
    return this.currentConfig
  }
  
  getConfigId(): string {
    return this.configId
  }
  
  async reloadConfig(): Promise<BrandConfig> {
    this.currentConfig = null
    return this.loadBrandConfig()
  }
}

export const brandConfigService = new BrandConfigService()