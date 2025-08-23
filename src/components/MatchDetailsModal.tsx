import { Clock, MapPin, Users } from 'lucide-react'
import { Match, Team, Goal, MatchEvent } from '../types/tournament'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { cn } from '../lib/utils'
import TeamAvatar from './TeamAvatar'

interface MatchDetailsModalProps {
  match: Match | null
  teams: Team[]
  isOpen: boolean
  onClose: () => void
}

interface TimelineEvent {
  id: string
  minute: number
  type: 'goal' | 'yellow_card' | 'red_card' | 'blue_card' | 'substitution'
  teamId: string | number
  teamName: string
  playerName: string
  relatedPlayerName?: string
  subType?: string
}

export default function MatchDetailsModal({ match, teams, isOpen, onClose }: MatchDetailsModalProps) {
  if (!match) return null

  const getTeamById = (teamId: string | number) => teams.find(t => t.id === String(teamId))
  const homeTeam = getTeamById(match.homeTeamId)
  const awayTeam = getTeamById(match.awayTeamId)

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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return '⚽'
      case 'yellow_card':
        return '🟨'
      case 'red_card':
        return '🟥'
      case 'blue_card':
        return '🟦'
      case 'substitution':
        return '🔄'
      default:
        return '•'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'goal':
        return 'text-green-600'
      case 'yellow_card':
        return 'text-yellow-600'
      case 'red_card':
        return 'text-red-600'
      case 'blue_card':
        return 'text-blue-600'
      case 'substitution':
        return 'text-blue-700'
      default:
        return 'text-gray-600'
    }
  }

  // Create timeline events from goals and events
  const createTimelineEvents = (): TimelineEvent[] => {
    const timelineEvents: TimelineEvent[] = []

    // Add goals
    if (match.goals) {
      match.goals.forEach((goal: Goal) => {
        timelineEvents.push({
          id: goal.id,
          minute: goal.minute,
          type: 'goal',
          teamId: goal.teamId,
          teamName: goal.teamId === String(match.homeTeamId) 
            ? (homeTeam?.name || match.homeTeamName || 'Local')
            : (awayTeam?.name || match.awayTeamName || 'Visitante'),
          playerName: goal.playerName,
          subType: goal.type
        })
      })
    }

    // Add other events
    if (match.events) {
      match.events.forEach((event: MatchEvent) => {
        if (event.type !== 'goal') { // Goals are already added above
          timelineEvents.push({
            id: event.id,
            minute: event.minute,
            type: event.type,
            teamId: event.teamId,
            teamName: event.teamId === String(match.homeTeamId) 
              ? (homeTeam?.name || match.homeTeamName || 'Local')
              : (awayTeam?.name || match.awayTeamName || 'Visitante'),
            playerName: event.playerName,
            relatedPlayerName: event.relatedPlayerName,
            subType: event.subType
          })
        }
      })
    }

    // Sort by minute
    return timelineEvents.sort((a, b) => a.minute - b.minute)
  }

  const timelineEvents = createTimelineEvents()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Detalles del Partido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Header */}
          <div className="text-center space-y-4">
            {/* Teams and Score */}
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-center">
                <TeamAvatar 
                  team={homeTeam} 
                  teamName={match.homeTeamName} 
                  teamId={match.homeTeamId} 
                  size="xl" 
                  className="mx-auto mb-2"
                />
                <h3 className="font-semibold text-lg">
                  {homeTeam?.name || match.homeTeamName || `Equipo ${match.homeTeamId}`}
                </h3>
                <p className="text-sm text-muted-foreground">Local</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {(() => {
                    const homeScore = match.result?.homeScore ?? match.homeScore
                    const awayScore = match.result?.awayScore ?? match.awayScore
                    
                    if ((match.status === 'finished' || match.status === 'completed') && 
                        homeScore !== undefined && awayScore !== undefined) {
                      return `${homeScore} - ${awayScore}`
                    }
                    return 'vs'
                  })()}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium border inline-block",
                  getStatusColor(match.status)
                )}>
                  {getStatusText(match.status)}
                </div>
              </div>

              <div className="text-center">
                <TeamAvatar 
                  team={awayTeam} 
                  teamName={match.awayTeamName} 
                  teamId={match.awayTeamId} 
                  size="xl" 
                  className="mx-auto mb-2"
                />
                <h3 className="font-semibold text-lg">
                  {awayTeam?.name || match.awayTeamName || `Equipo ${match.awayTeamId}`}
                </h3>
                <p className="text-sm text-muted-foreground">Visitante</p>
              </div>
            </div>

            {/* Match Info */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              {match.date && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(match.date).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {match.venue && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{match.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Events Timeline */}
          {timelineEvents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Eventos del Partido</h3>
              </div>
              
              <div className="space-y-3">
                {timelineEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-xs font-medium text-muted-foreground">
                        {event.minute}'
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-xl">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">
                          {event.playerName}
                        </span>
                        <span className={cn("text-xs px-2 py-1 rounded-full bg-white font-medium", getEventColor(event.type))}>
                          {event.teamName}
                        </span>
                      </div>
                      
                      {event.type === 'goal' && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.subType === 'penalty' && '(Penal)'}
                          {event.subType === 'own_goal' && '(Autogol)'}
                          {event.subType === 'free_kick' && '(Tiro libre)'}
                        </div>
                      )}
                      
                      {event.type === 'substitution' && event.relatedPlayerName && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-600">↗ {event.playerName}</span>
                          {' → '}
                          <span className="text-red-500">↙ {event.relatedPlayerName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No events message */}
          {timelineEvents.length === 0 && (match.status === 'finished' || match.status === 'completed') && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay eventos registrados para este partido</p>
            </div>
          )}

          {(match.status === 'pending' || match.status === 'scheduled') && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>El partido aún no ha comenzado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}