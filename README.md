# ⚽ Sampa League - Progressive Web App

Una Progressive Web App moderna para visualizar y gestionar datos de torneos de fútbol, desarrollada con React, TypeScript, y un sistema de branding dinámico.

## 🚀 Características Principales

### 📱 PWA Features
- **Instalable**: Se puede instalar como aplicación nativa
- **Offline**: Funciona sin conexión a internet
- **Responsive**: Diseño adaptable para móviles, tablets y desktop
- **Service Workers**: Cache inteligente para performance optimal

### 🎨 Sistema de Branding Dinámico
- **Múltiples temas**: Soporte para diferentes configuraciones de marca
- **Colores adaptativos**: Sistema de colores con contraste automático
- **Assets dinámicos**: Logos y favicons que cambian según el tema
- **Variables CSS**: Integración nativa con Tailwind CSS

### ⚽ Funcionalidades de Torneos
- **Grid de Torneos**: Vista principal con cards responsivos
- **Tabla de Posiciones**: Rankings completos con estadísticas
- **Goleadores**: Top de jugadores con estadísticas detalladas
- **Información de Equipos**: Detalles completos de cada equipo
- **Búsqueda y Filtros**: Sistema avanzado de filtrado

## 🛠 Stack Tecnológico

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación

### UI/UX
- **Tailwind CSS** - Framework de CSS
- **shadcn/ui** - Componentes reutilizables
- **Lucide React** - Iconografía
- **Radix UI** - Componentes primitivos accesibles

### PWA
- **Vite PWA Plugin** - Configuración PWA
- **Workbox** - Service workers y caching
- **Web App Manifest** - Configuración de instalación

### Estado y Datos
- **Zustand** - Gestión de estado (preparado)
- **Mock Data** - Datos de prueba realistas
- **TypeScript Types** - Tipado completo de datos

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── Layout.tsx      # Layout principal
│   ├── Header.tsx      # Cabecera de la app
│   ├── BottomNav.tsx   # Navegación móvil
│   ├── TournamentCard.tsx    # Card de torneo
│   ├── StandingsTable.tsx    # Tabla de posiciones
│   ├── PlayersTable.tsx      # Tabla de goleadores
│   └── TeamsGrid.tsx         # Grid de equipos
├── pages/              # Páginas principales
│   ├── HomePage.tsx    # Página de inicio
│   └── TournamentPage.tsx    # Página de torneo
├── hooks/              # Custom hooks
│   └── useBrandConfig.tsx    # Hook de configuración de marca
├── services/           # Servicios y APIs
│   └── brandConfig.ts  # Servicio de branding dinámico
├── types/              # Definiciones TypeScript
│   ├── brand.ts        # Tipos de configuración de marca
│   └── tournament.ts   # Tipos de datos de torneos
├── data/               # Mock data
│   └── mockData.ts     # Datos de prueba
├── lib/                # Utilidades
│   └── utils.ts        # Funciones helper
└── styles/
    └── index.css       # Estilos globales

public/
├── brand-configs/      # Configuraciones de marca
│   ├── default/        # Tema por defecto
│   └── dark-mode/      # Tema oscuro
├── icons/              # Iconos PWA
└── manifest.json       # Manifest PWA
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd sampa-league-pwa

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build

# Calidad de código
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🎨 Sistema de Branding Dinámico

### Configuración de Tema

Los temas se configuran mediante archivos JSON en `public/brand-configs/`:

```json
{
  "metadata": {
    "id": "mi-tema",
    "name": "Mi Tema Personalizado",
    "description": "Descripción del tema",
    "category": "sport",
    "version": "1.0.0"
  },
  "app": {
    "name": "Mi Liga",
    "slogan": "El mejor fútbol",
    "description": "Gestión de torneos"
  },
  "colors": {
    "primary": { "hsl": "145 54% 24%", "hex": "#195d2c" },
    "secondary": { "hsl": "147 84% 17%", "hex": "#085426" },
    "accent": { "hsl": "54 100% 50%", "hex": "#ffeb00" },
    "sport": {
      "trophy": { "hsl": "45 93% 47%", "hex": "#eab308" },
      "victory": { "hsl": "142 76% 36%", "hex": "#16a34a" },
      "defeat": { "hsl": "0 84% 60%", "hex": "#ef4444" },
      "draw": { "hsl": "43 74% 66%", "hex": "#a3a3a3" }
    }
  },
  "assets": {
    "logo": "./logo.svg",
    "logoSmall": "./logo-small.svg",
    "favicon": "./favicon.ico"
  }
}
```

### Cambiar Tema

```bash
# Variable de entorno
VITE_BRAND_CONFIG_ID=dark-mode

# O programáticamente
const { reloadConfig } = useBrandConfig()
await reloadConfig()
```

### Usar Colores de Marca en Componentes

```tsx
// CSS Classes
className="bg-brand-primary text-brand-primary-foreground"
className="text-brand-victory bg-brand-extended-greenLighter"

// Hook de configuración
const { config } = useBrandConfig()
return <h1>{config?.app.name}</h1>
```

## 📱 PWA Features

### Instalación
La app se puede instalar como PWA nativa en dispositivos móviles y desktop.

### Offline
- Cache automático de assets estáticos
- Datos de torneos disponibles offline
- Interfaz completamente funcional sin conexión

### Performance
- Service Workers con Workbox
- Code splitting automático
- Lazy loading de componentes
- Bundle optimizado < 500KB

## 🏆 Datos de Torneos

### Torneos Incluidos
- **Liga Profesional Argentina 2024** - 28 equipos, temporada activa
- **Copa Libertadores 2024** - 32 equipos, fase de grupos
- **Copa Mundial FIFA 2022** - Datos históricos completos

### Estadísticas Disponibles
- Tabla de posiciones completa
- Estadísticas de goleadores
- Rendimiento local vs visitante
- Forma reciente de equipos
- Datos de tarjetas y penales

## 🎯 Roadmap Futuro

### Funcionalidades Planeadas
- [ ] **Notificaciones Push** - Resultados en tiempo real
- [ ] **Modo Oscuro** - Toggle de tema automático
- [ ] **Favoritos** - Sistema de equipos y torneos favoritos
- [ ] **Compartir** - Integración con redes sociales
- [ ] **Estadísticas Avanzadas** - Gráficos y heat maps
- [ ] **Multi-idioma** - Soporte para español, inglés, portugués

### Integraciones API
- [ ] **API Real** - Conexión con datos en vivo
- [ ] **WebSockets** - Actualizaciones en tiempo real
- [ ] **Autenticación** - Sistema de usuarios
- [ ] **Sync Offline** - Sincronización de datos

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# .env
VITE_BRAND_CONFIG_ID=default          # Tema por defecto
VITE_API_BASE_URL=https://api.example.com  # URL de API
VITE_APP_NAME=Sampa League            # Nombre de la app
VITE_APP_VERSION=1.0.0                # Versión
```

### Customización de Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "hsl(var(--brand-primary))",
          victory: "hsl(var(--brand-sport-victory))",
          // ... más colores
        }
      }
    }
  }
}
```

### Configuración PWA

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxAgeSeconds: 60 * 60 * 24 }
            }
          }
        ]
      }
    })
  ]
})
```

## 📊 Performance Goals

### Lighthouse Scores Objetivo
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90
- **PWA**: 100

### Métricas Core
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB
- **Offline**: 100% funcional

## 🤝 Contribución

### Desarrollo Local
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **TypeScript**: Tipado estricto obligatorio
- **ESLint**: Seguir reglas configuradas
- **Prettier**: Formateo automático
- **Commits**: Usar Conventional Commits

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **shadcn/ui** - Sistema de componentes
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconografía
- **Radix UI** - Componentes accesibles
- **Workbox** - PWA tooling

---

**Sampa League** - Gestión profesional de torneos de fútbol ⚽