import { useState } from 'react'
import { Search, Filter, Grid, List, RefreshCw } from 'lucide-react'
import { Tournament, SearchFilters, SortOptions } from '../types/tournament'
import { useTournamentList } from '../hooks/useTournamentData'
import TournamentCard from '../components/TournamentCard'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useBrandConfig } from '../hooks/useBrandConfig'

export default function HomePage() {
  const { config } = useBrandConfig()
  const { tournaments, loading, error, refresh } = useTournamentList()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [sortBy, setSortBy] = useState<SortOptions>({
    field: 'name',
    direction: 'asc'
  })
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort tournaments
  const filteredTournaments = tournaments
    .filter(tournament => {
      if (searchQuery && !tournament.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (filters.status && tournament.status !== filters.status) {
        return false
      }
      if (filters.country && tournament.country !== filters.country) {
        return false
      }
      if (filters.format && tournament.format !== filters.format) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const direction = sortBy.direction === 'asc' ? 1 : -1
      switch (sortBy.field) {
        case 'name':
          return a.name.localeCompare(b.name) * direction
        case 'startDate':
          return (a.startDate.getTime() - b.startDate.getTime()) * direction
        case 'teamCount':
          return (a.teamCount - b.teamCount) * direction
        case 'country':
          return a.country.localeCompare(b.country) * direction
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenido a {config?.app.name || 'Sampa League'}
            </h1>
            
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="ml-4"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar torneos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filter Buttons */}
            
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={filters.status === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, status: undefined })}
            >
              Todos
            </Button>
            <Button
              variant={filters.status === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, status: 'active' })}
            >
              En curso
            </Button>
            <Button
              variant={filters.status === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, status: 'upcoming' })}
            >
              Próximos
            </Button>
            <Button
              variant={filters.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, status: 'completed' })}
            >
              Finalizados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredTournaments.length} torneos encontrados
        </p>
        
        {/* Sort Options */}
        <select
          value={`${sortBy.field}-${sortBy.direction}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-')
            setSortBy({ 
              field: field as SortOptions['field'], 
              direction: direction as SortOptions['direction'] 
            })
          }}
          className="text-sm border border-input rounded px-3 py-1 bg-background"
        >
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="startDate-desc">Más recientes</option>
          <option value="startDate-asc">Más antiguos</option>
          <option value="teamCount-desc">Más equipos</option>
          <option value="teamCount-asc">Menos equipos</option>
        </select>
      </div>

      {/* Tournament Grid */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-24 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTournaments.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron torneos</h3>
            <p className="text-muted-foreground">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}