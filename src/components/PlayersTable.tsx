import { useState } from 'react'
import { Trophy, Target} from 'lucide-react'
import { PlayerStats, Player, Team } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'
import TeamAvatar from './TeamAvatar'

interface PlayersTableProps {
  playerStats: PlayerStats[]
  players: Player[]
  teams: Team[]
}

export default function PlayersTable({ playerStats, players, teams }: PlayersTableProps) {
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'matches' | 'averageGoalsPerGame'>('goals')
  const [filterTeam, setFilterTeam] = useState<string>('')

  const getPlayerById = (id: string) => players.find(p => p.id === id)
  const getTeamById = (id: string) => teams.find(t => t.id === id)

  const filteredAndSortedStats = playerStats
    .filter(stat => {
      if (!filterTeam) return true
      const player = getPlayerById(stat.playerId)
      return player?.teamId === filterTeam
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'goals':
          return b.goals - a.goals
        case 'assists':
          return b.assists - a.assists
        case 'matches':
          return b.matches - a.matches
        case 'averageGoalsPerGame':
          return b.averageGoalsPerGame - a.averageGoalsPerGame
        default:
          return b.goals - a.goals
      }
    })

  const topScorer = filteredAndSortedStats[0]
  console.log(topScorer)
  const getPositionName = (position: Player['position']) => {
    switch (position) {
      case 'GK': return 'Portero'
      case 'DEF': return 'Defensor'
      case 'MID': return 'Mediocampista'
      case 'FWD': return 'Delantero'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Scorer Highlight */}
      {topScorer && (
        <Card className="bg-gradient-to-r from-brand-trophy/10 to-brand-primary/10 border-brand-trophy/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-trophy/20 rounded-full">
                <Trophy className="w-8 h-8 text-brand-trophy" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand-trophy">Máximo Goleador</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xl font-bold">
                    {getPlayerById(topScorer.playerId)?.name}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-brand-primary font-medium">
                    {getTeamById(getPlayerById(topScorer.playerId)?.teamId || '')?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{topScorer.goals} goles</span>
                  </span>
                
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Players Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Tabla de Goleadores</CardTitle>
            
            <div className="flex space-x-2">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-input rounded px-3 py-1 bg-background"
              >
                <option value="goals">Más goles</option>
                <option value="assists">Más asistencias</option>
              </select>

              {/* Team Filter */}
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="text-sm border border-input rounded px-3 py-1 bg-background"
              >
                <option value="">Todos los equipos</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="standings-table">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th className="min-w-[200px]">Jugador</th>
                  <th className="w-20">Equipo</th>
                  <th className="w-16">
                    <button 
                      onClick={() => setSortBy('goals')}
                      className={cn('hover:text-foreground', sortBy === 'goals' && 'text-brand-primary font-medium')}
                    >
                      Goles
                    </button>
                  </th>
                  
                 
                 
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStats.map((stat, index) => {
                  const player = getPlayerById(stat.playerId)
                  const team = getTeamById(player?.teamId || '')
                  
                  return (
                    <tr key={stat.playerId} className="standings-row">
                      <td className="font-medium">
                        {index + 1}
                        {index === 0 && (
                          <Trophy className="w-4 h-4 text-brand-trophy inline ml-1" />
                        )}
                      </td>
                      <td>
                        <div className="flex items-center space-x-3">
                          {player?.photo && (
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <p className="font-medium">{player?.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {team?.name} • {getPositionName(player?.position || 'FWD')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <TeamAvatar team={team} size="sm" />
                          <span className="text-sm font-medium">{team?.name}</span>
                        </div>
                      </td>
                      
                      
                      <td className="text-center font-bold text-brand-victory">
                        {stat.goals}
                      </td>
                     
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          
        </CardContent>
      </Card>
    </div>
  )
}