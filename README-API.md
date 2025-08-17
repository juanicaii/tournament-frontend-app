# API Integration - Documentación

## 🎯 Resumen

Este proyecto ahora incluye integración completa con la API pública de torneos. Los servicios implementados permiten consumir datos reales de torneos mientras mantienen compatibilidad con datos mock como fallback.

## 📁 Archivos Implementados

### Tipos y Servicios
- `src/types/api.ts` - Tipos TypeScript para API responses
- `src/services/api.ts` - Cliente HTTP base con manejo de errores
- `src/services/tournamentService.ts` - Servicio específico para torneos
- `src/hooks/useTournamentData.ts` - Hook React para gestión de estado
- `src/utils/apiHelpers.ts` - Utilidades para manejo de API

### Configuración
- `.env` - Variables de entorno actualizadas
- `.env.example` - Ejemplo de configuración

## 🔧 Configuración

### Variables de Entorno

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/public/tournaments

# Brand Configuration
VITE_BRAND_CONFIG_ID=default

# App Configuration
VITE_APP_NAME=Sampa League
VITE_APP_VERSION=1.0.0
```

## 🚀 Uso

### Hook para Lista de Torneos

```typescript
import { useTournamentList } from '../hooks/useTournamentData'

function TournamentsList() {
  const { tournaments, loading, error, refresh } = useTournamentList()
  
  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {tournaments.map(tournament => (
        <div key={tournament.id}>{tournament.name}</div>
      ))}
    </div>
  )
}
```

### Hook para Torneo Específico

```typescript
import { useTournament } from '../hooks/useTournamentData'

function TournamentDetails({ id }: { id: string }) {
  const { tournamentData, loading, error, refresh } = useTournament(id)
  
  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  if (!tournamentData) return <div>Torneo no encontrado</div>
  
  return (
    <div>
      <h1>{tournamentData.tournament.name}</h1>
      {/* Render tournament data */}
    </div>
  )
}
```

### Servicio Directo

```typescript
import { tournamentService } from '../services/tournamentService'

// Obtener todos los torneos
const tournaments = await tournamentService.getTournaments()

// Obtener torneo específico
const tournament = await tournamentService.getTournamentById(1)

// Obtener tabla de posiciones
const standings = await tournamentService.getTournamentStandings(1)

// Obtener partidos con filtros
const matches = await tournamentService.getTournamentMatches(1, {
  phase: 'league',
  status: 'completed'
})
```

## 🔄 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Lista de torneos públicos |
| GET | `/:id` | Detalles de torneo específico |
| GET | `/:id/standings` | Tabla de posiciones |
| GET | `/:id/teams` | Equipos del torneo |
| GET | `/:id/top-scorers` | Tabla de goleadores |
| GET | `/:id/matches` | Partidos del torneo |
| GET | `/:id/teams/:teamId/stats` | Estadísticas de equipo |

## 🛡️ Manejo de Errores

### Estrategia de Fallback
1. **API Disponible**: Usa datos de la API
2. **API No Disponible**: Fallback automático a datos mock
3. **Error de Red**: Muestra mensaje de error y datos mock
4. **Timeout**: Reintenta automáticamente con backoff

### Tipos de Errores
- **400 Bad Request**: Parámetros inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Server Error**: Error interno del servidor
- **Network Error**: Problemas de conectividad
- **Timeout**: Tiempo de espera agotado

## 🔧 Mapeo de Datos

Los datos de la API se mapean automáticamente a los tipos internos de la aplicación:

### API → Tipos Internos
- `ApiTournament` → `Tournament`
- `ApiTeam` → `Team`
- `ApiStanding` → `Standing`
- `ApiMatch` → `Match`
- `ApiTopScorer` → `PlayerStats`

### Transformaciones Automáticas
- Fechas: String ISO → Date objects
- IDs: Numbers → Strings
- Estados: API status → Internal status
- Formatos: API format → Internal format

## 🚦 Estados de Carga

### Loading States
```typescript
{
  loading: boolean,    // Indica si hay una petición en curso
  error: string | null, // Mensaje de error si lo hay
  data: T | null       // Datos obtenidos (null si no hay)
}
```

### Refresh Functionality
Todos los hooks incluyen función `refresh()` para recargar datos:

```typescript
const { refresh } = useTournamentList()
await refresh() // Recarga la lista de torneos
```

## 🎨 UI/UX Integrado

### Loading Skeletons
- Cards animados durante carga
- Shimmer effects
- Progressive loading

### Error Handling
- Mensajes informativos
- Fallback a datos mock
- Botones de reintento

### Real-time Updates
- Botón de actualización manual
- Estados visuales de carga
- Indicadores de error

## 🔍 Debug y Desarrollo

### Console Logs
Los errores se registran en consola para debugging:

```javascript
console.error('Error fetching tournament data:', error)
```

### Environment Detection
El cliente detecta automáticamente el entorno:

```typescript
// Desarrollo: http://localhost:3000/api/public/tournaments
// Producción: Variable VITE_API_BASE_URL
```

## 🧪 Testing

### Simular Errores de API
1. Cambiar `VITE_API_BASE_URL` a URL inexistente
2. Verificar fallback a datos mock
3. Confirmar mensajes de error apropiados

### Test de Conectividad
```bash
# Verificar que la API esté funcionando
curl http://localhost:3000/api/public/tournaments
```

## 📈 Performance

### Optimizaciones Implementadas
- **Cache automático** en hooks de React
- **Retry logic** con exponential backoff
- **Timeout configurables** (default: 10s)
- **Request deduplication** en hooks

### Best Practices
- Evitar múltiples llamadas simultáneas
- Usar loading states apropiados
- Implementar error boundaries
- Cache de datos cuando sea posible

## 🔄 Actualización y Migración

### Migrar de Mock a API
1. Configurar `VITE_API_BASE_URL`
2. Los componentes funcionarán automáticamente
3. Fallback a mock si API falla

### Rollback a Mock Data
1. Comentar/eliminar `VITE_API_BASE_URL`
2. La aplicación usará datos mock por defecto
3. No requiere cambios de código

## 🎯 Próximos Pasos

### Características Futuras
- [ ] Cache persistente con localStorage
- [ ] WebSocket para updates en tiempo real
- [ ] Pagination para grandes datasets
- [ ] Offline support con service workers
- [ ] React Query integration
- [ ] Optimistic updates

### Monitoreo
- [ ] Analytics de uso de API
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User behavior analytics