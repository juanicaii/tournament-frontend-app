import { Calendar, Clock, MapPin } from 'lucide-react'
import { Match, Team } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatDate } from '../lib/utils'

interface MatchesTableProps {
  matches: Match[]
  teams: Team[]
}

export default function MatchesTable({ matches, teams }: MatchesTableProps) {
  const getTeamById = (teamId: string) => teams.find(t => t.id === teamId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50'
      case 'live':
        return 'text-green-600 bg-green-50'
      case 'finished':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programado'
      case 'live':
        return 'En Vivo'
      case 'finished':
        return 'Finalizado'
      default:
        return status
    }
  }

  const sortedMatches = [...matches].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const groupedByMatchday = sortedMatches.reduce((acc, match) => {
    if (!acc[match.matchday]) {
      acc[match.matchday] = []
    }
    acc[match.matchday].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedByMatchday)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([matchday, dayMatches]) => (
          <Card key={matchday}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Fecha {matchday}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayMatches.map((match) => {
                  const homeTeam = getTeamById(match.homeTeamId)
                  const awayTeam = getTeamById(match.awayTeamId)

                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {/* Teams and Score */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          {/* Home Team */}
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                 style={{ backgroundColor: homeTeam?.colors.primary || '#666' }}>
                              {homeTeam?.shortName?.substring(0, 3).toUpperCase() || 'IND'}
                            </div>
                            <span className="font-medium truncate">
                              {homeTeam?.name || `Ind${match.homeTeamId.slice(-1)}`}
                            </span>
                          </div>

                          {/* Score or VS */}
                          <div className="flex-shrink-0 text-center min-w-[60px]">
                            {match.status === 'finished' && match.homeScore !== undefined && match.awayScore !== undefined ? (
                              <span className="font-bold text-lg">
                                {match.homeScore} - {match.awayScore}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">vs</span>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
                            <span className="font-medium truncate">
                              {awayTeam?.name || `Ind${match.awayTeamId.slice(-1)}`}
                            </span>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                 style={{ backgroundColor: awayTeam?.colors.primary || '#666' }}>
                              {awayTeam?.shortName?.substring(0, 3).toUpperCase() || 'IND'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Match Info */}
                      <div className="flex items-center space-x-4 ml-6">
                        {/* Date and Time */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(match.date)}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{new Date(match.date).toLocaleTimeString('es-AR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>

                        {/* Venue */}
                        {match.venue && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="hidden sm:inline">{match.venue}</span>
                          </div>
                        )}

                        {/* Status */}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                          {getStatusText(match.status)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}

      {matches.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay partidos disponibles</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}