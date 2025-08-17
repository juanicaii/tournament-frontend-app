import { useState } from 'react'
import { MapPin, Calendar, Home, Search } from 'lucide-react'
import { Team } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

interface TeamsGridProps {
  teams: Team[]
}

export default function TeamsGrid({ teams }: TeamsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'founded'>('name')

  const filteredAndSortedTeams = teams
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'city':
          return (a.city || '').localeCompare(b.city || '')
        case 'founded':
          return (b.founded || 0) - (a.founded || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-input rounded px-3 py-1 bg-background"
              >
                <option value="name">Nombre</option>
                <option value="city">Ciudad</option>
                <option value="founded">Año de fundación</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTeams.map((team) => (
          <Card key={team.id} className="tournament-card">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                {team.logo && (
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="w-12 h-12 object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {team.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">
                    {team.shortName}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* City and Stadium */}
                {(team.city || team.stadium) && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="text-sm">
                      {team.city && (
                        <p className="font-medium">{team.city}</p>
                      )}
                      {team.stadium && (
                        <p className="text-muted-foreground">{team.stadium}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Founded */}
                {team.founded && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Fundado en {team.founded}
                    </span>
                  </div>
                )}

                {/* Colors */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground">Colores:</span>
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: team.colors.primary }}
                        title="Color primario"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: team.colors.secondary }}
                        title="Color secundario"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedTeams.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron equipos</h3>
            <p className="text-muted-foreground">
              Intenta ajustar tu búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Teams Count */}
      <div className="text-center text-sm text-muted-foreground">
        Mostrando {filteredAndSortedTeams.length} de {teams.length} equipos
      </div>
    </div>
  )
}