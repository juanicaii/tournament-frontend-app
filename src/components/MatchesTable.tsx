import { Clock, MapPin, Eye } from 'lucide-react'
import { Match, Team, Goal, MatchEvent } from '../types/tournament'
import { Card, CardContent } from './ui/card'
import { cn, groupBy } from '../lib/utils'
import TeamAvatar from './TeamAvatar'
import MatchDetailsModal from './MatchDetailsModal'
import { useState } from 'react'

interface MatchesTableProps {
  matches: Match[]
  teams: Team[]
}

export default function MatchesTable({ matches, teams }: MatchesTableProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getTeamById = (teamId: string | number) => teams.find(t => t.id === String(teamId))

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMatch(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'finished':
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusAccentColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-200'
      case 'live':
        return 'bg-green-200'
      case 'finished':
      case 'completed':
        return 'bg-purple-200'
      case 'pending':
        return 'bg-yellow-200'
      default:
        return 'bg-gray-200'
    }
  }




  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programado'
      case 'live':
        return 'En Vivo'
      case 'finished':
      case 'completed':
        return 'Completado'
      case 'pending':
        return 'Pendiente'
      default:
        return status
    }
  }

  const formatPhaseName = (phase: string | undefined): string => {
    if (!phase || phase === 'league') return ''
    
    switch (phase) {
      case 'quarter-final':
        return 'Cuartos de Final'
      case 'semi-final':
        return 'Semifinales'
      case 'final':
        return 'Final'
      case 'round-of-16':
        return 'Octavos de Final'
      case 'round-of-32':
        return 'Dieciseisavos de Final'
      case 'round-of-64':
        return 'Treintaidosavos de Final'
      default:
        return phase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const organizeMatches = () => {
    const matchesList = matches || []
    const playoffPhases = ['quarter-final', 'semi-final', 'final', 'round-of-16', 'round-of-32', 'round-of-64']
    
    // IMPORTANTE: Separate league matches from playoff matches
    // Los partidos de playoff NO deben aparecer en las secciones de "Fecha X"
    const playoffMatches = matchesList.filter(m => m.phase && playoffPhases.includes(m.phase))
    const leagueMatches = matchesList.filter(m => !m.phase || m.phase === 'league' || !playoffPhases.includes(m.phase))
 
    
    const sections: Array<{
      key: string;
      title: string;
      matches: Match[];
    }> = []
    
    // Add league matches grouped by round/matchday
    if (leagueMatches.length > 0) {
      const matchesByRound = groupBy(leagueMatches, (m) => m.round || m.matchday || 1)
      const sortedRounds = Object.keys(matchesByRound)
        .map((k) => parseInt(k, 10))
        .sort((a, b) => a - b)
      
      sortedRounds.forEach((roundNumber) => {
        sections.push({
          key: `league-round-${roundNumber}`,
          title: `Fecha ${roundNumber}`,
          matches: matchesByRound[roundNumber as unknown as keyof typeof matchesByRound]
        })
      })
    }
    
    // Add playoff matches grouped by phase
    if (playoffMatches.length > 0) {
      const matchesByPhase = groupBy(playoffMatches, (m) => m.phase || 'unknown')
      
      // Define phase order for proper sorting
      const phaseOrder = ['round-of-64', 'round-of-32', 'round-of-16', 'quarter-final', 'semi-final', 'final']
      const sortedPhases = Object.keys(matchesByPhase)
        .sort((a, b) => {
          const aIndex = phaseOrder.indexOf(a)
          const bIndex = phaseOrder.indexOf(b)
          if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
          if (aIndex === -1) return 1
          if (bIndex === -1) return -1
          return aIndex - bIndex
        })
      
      sortedPhases.forEach((phase) => {
        const phaseName = formatPhaseName(phase)
        if (phaseName) {
          sections.push({
            key: `playoff-${phase}`,
            title: phaseName,
            matches: matchesByPhase[phase as keyof typeof matchesByPhase]
          })
        }
      })
    }
    
    return sections
  }

  const sections = organizeMatches()

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {sections.length > 0 ? (
        sections.map((section) => (
          <div key={section.key}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {section.title}
            </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.matches
              .slice()
              .sort((a: Match, b: Match) => {
                // First sort by round within phase (for playoffs)
                if (a.round && b.round && a.round !== b.round) {
                  return a.round - b.round
                }
                // Then sort by date
                if(!a.date || !b.date) {
                  return -1
                 }

                return a.date.getTime() - b.date.getTime()
              })
              .map((match: Match) => {
                const homeTeam = getTeamById(match.homeTeamId)
                const awayTeam = getTeamById(match.awayTeamId)

                return (
                  <Card 
                    key={match.id}
                    className="relative border hover:shadow-md transition-shadow cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => handleMatchClick(match)}
                  >
                    <div className={`${getStatusAccentColor(match.status)} h-0.5 w-full`} />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>
                            {match.date
                              ? new Date(match.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                              : "No programado"
                            }
                          </span>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(match.status)
                        )}>
                          {getStatusText(match.status)}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="grid grid-cols-3 items-center pb-2">
                          <div className="flex items-center space-x-3">
                            <TeamAvatar 
                              team={homeTeam} 
                              teamName={match.homeTeamName} 
                              teamId={match.homeTeamId} 
                              size="lg" 
                            />
                            <div className="min-w-0">
                              <p className="font-medium truncate text-sm">
                                {homeTeam?.name || match.homeTeamName || `Ind${String(match.homeTeamId).slice(-1)}`}
                              </p>
                              <p className="text-[11px] text-muted-foreground">Local</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground/90">
                              {(() => {
                                // Try to get score from result object first, then fallback to legacy properties
                                const homeScore = match.result?.homeScore ?? match.homeScore
                                const awayScore = match.result?.awayScore ?? match.awayScore
                                
                                if ((match.status === 'finished' || match.status === 'completed') && 
                                    homeScore !== undefined && awayScore !== undefined) {
                                  return `${homeScore} - ${awayScore}`
                                }
                                return 'vs'
                              })()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 justify-end">
                            <div className="min-w-0 text-right">
                              <p className="font-medium truncate text-sm">
                                {awayTeam?.name || match.awayTeamName || `Ind${String(match.awayTeamId).slice(-1)}`}
                              </p>
                              <p className="text-[11px] text-muted-foreground">Visitante</p>
                            </div>
                            <TeamAvatar 
                              team={awayTeam} 
                              teamName={match.awayTeamName} 
                              teamId={match.awayTeamId} 
                              size="lg" 
                            />
                          </div>
                        </div>

                        {/* Click indicator for matches with events */}
                        {((match.status === 'finished' || match.status === 'completed') && 
                          ((match.goals && match.goals.length > 0) || (match.events && match.events.length > 0))) && (
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                              <span>Click para ver detalles</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {match.venue && (
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-2" />
                            <span className="truncate max-w-[70%]">{match.venue}</span>
                          </div>
                          <div />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay partidos disponibles</p>
          </CardContent>
        </Card>
      )}

      <MatchDetailsModal 
        match={selectedMatch}
        teams={teams}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}