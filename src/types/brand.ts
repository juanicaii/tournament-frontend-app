export interface ColorValue {
  hsl: string
  hex: string
}

export interface BrandConfig {
  metadata: {
    id: string
    name: string
    description: string
    category: 'corporate' | 'sport' | 'creative'
    version: string
    author: string
    created: string
  }
  app: {
    name: string
    slogan?: string
    description?: string
  }
  colors: {
    primary: ColorValue
    secondary: ColorValue
    accent: ColorValue
    success: ColorValue
    warning: ColorValue
    error: ColorValue
    background: ColorValue
    foreground: ColorValue
    card: ColorValue
    cardForeground: ColorValue
    muted: ColorValue
    mutedForeground: ColorValue
    border: ColorValue
    sport: {
      trophy: ColorValue
      victory: ColorValue
      defeat: ColorValue
      draw: ColorValue
    }
    extended?: {
      greenLight?: ColorValue
      greenLighter?: ColorValue
      yellowLight?: ColorValue
      yellowLighter?: ColorValue
      [key: string]: ColorValue | undefined
    }
  }
  assets: {
    logo: string
    logoSmall: string
    favicon: string
    preview: string
  }
  typography: {
    fontFamily: string
    headingFont?: string
  }
  tournament: {
    defaultFormat: string
    showBranding: boolean
    allowCustomization: boolean
  }
}