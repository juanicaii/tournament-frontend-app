import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Standing, Team } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { getTeamFormColor, cn } from '../lib/utils'

interface StandingsTableProps {
  standings: Standing[]
  teams: Team[]
  playoffTeamsCount?: number | null
}

export default function StandingsTable({ standings, teams, playoffTeamsCount }: StandingsTableProps) {
  const [sortBy, setSortBy] = useState<keyof Standing>('position')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const getTeamById = (id: string) => teams.find(t => t.id === id)

  const handleSort = (field: keyof Standing) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  const sortedStandings = [...standings].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    const direction = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction
    }
    return 0
  })

  const getPositionStyle = (position: number) => {
    
    // Playoffs solo si está configurado
    if (playoffTeamsCount && playoffTeamsCount > 0 && position <= playoffTeamsCount) {
      return 'qualification-champions'
    }
    
    return ''
  }

  const SortButton = ({ field, children }: { field: keyof Standing; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:text-foreground transition-colors"
    >
      <span>{children}</span>
      {sortBy === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-3 h-3" /> : 
          <ChevronDown className="w-3 h-3" />
      )}
    </button>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Posiciones</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="standings-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th className="min-w-[200px]">Equipo</th>
                <th className="w-12 mobile-hide">
                  <SortButton field="played">PJ</SortButton>
                </th>
                <th className="w-12 mobile-hide">
                  <SortButton field="won">G</SortButton>
                </th>
                <th className="w-12 mobile-hide">
                  <SortButton field="drawn">E</SortButton>
                </th>
                <th className="w-12 mobile-hide">
                  <SortButton field="lost">P</SortButton>
                </th>
                <th className="w-16">
                  <SortButton field="goalsFor">GF</SortButton>
                </th>
                <th className="w-16">
                  <SortButton field="goalsAgainst">GC</SortButton>
                </th>
                <th className="w-16">
                  <SortButton field="goalDifference">DG</SortButton>
                </th>
                <th className="w-16">
                  <SortButton field="points">Pts</SortButton>
                </th>
                <th className="w-24 mobile-hide">Forma</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.map((standing) => {
                const team = getTeamById(standing.teamId)
                return (
                  <tr 
                    key={standing.teamId} 
                    className={cn('standings-row', getPositionStyle(standing.position))}
                  >
                    <td className="font-medium">{standing.position}</td>
                    <td>
                      <div className="flex items-center space-x-3">
                        {team?.logo && (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium">{team?.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {standing.played}PJ • {standing.points}pts
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center mobile-hide">{standing.played}</td>
                    <td className="text-center mobile-hide">{standing.won}</td>
                    <td className="text-center mobile-hide">{standing.drawn}</td>
                    <td className="text-center mobile-hide">{standing.lost}</td>
                    <td className="text-center">{standing.goalsFor}</td>
                    <td className="text-center">{standing.goalsAgainst}</td>
                    <td className="text-center font-medium">
                      <span className={standing.goalDifference > 0 ? 'text-brand-victory' : standing.goalDifference < 0 ? 'text-brand-defeat' : 'text-muted-foreground'}>
                        {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                      </span>
                    </td>
                    <td className="text-center font-bold text-brand-primary">{standing.points}</td>
                    <td className="mobile-hide">
                      {standing.form && (
                        <div className="flex space-x-1">
                          {standing.form.slice(-5).map((result, index) => (
                            <span
                              key={index}
                              className={cn(
                                'w-5 h-5 text-xs font-medium rounded-full flex items-center justify-center',
                                getTeamFormColor(result)
                              )}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {playoffTeamsCount && playoffTeamsCount > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Clasifican a Playoffs ({playoffTeamsCount} equipos)</span>
              </div>
            )}
            
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            PJ: Partidos Jugados, G: Ganados, E: Empatados, P: Perdidos, GF: Goles a Favor, GC: Goles en Contra, DG: Diferencia de Goles, Pts: Puntos
          </p>
        </div>
      </CardContent>
    </Card>
  )
}