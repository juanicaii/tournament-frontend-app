import { useState } from 'react'
import { Trophy, Target, Shield, Award } from 'lucide-react'
import { PlayerStats, Player, Team, Standing } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'
import TeamAvatar from './TeamAvatar'

type StatisticCategory = 'scorers' | 'fairplay' | 'defense'

interface StatisticsTableProps {
  playerStats: PlayerStats[]
  players: Player[]
  teams: Team[]
  standings: Standing[]
}

interface TeamCardStats {
  teamId: string
  teamName: string
  team: Team
  totalCards: number
  yellowCards: number
  redCards: number
  blueCards: number
}

interface TeamDefenseStats {
  teamId: string
  teamName: string
  team: Team
  goalsAgainst: number
  cleanSheets: number
  played: number
}

export default function StatisticsTable({ playerStats, players, teams, standings }: StatisticsTableProps) {
  const [category, setCategory] = useState<StatisticCategory>('scorers')

  const getPlayerById = (id: string) => players.find(p => p.id === id)
  const getTeamById = (id: string) => teams.find(t => t.id === id)

  // Lógica para estadísticas de goleadores (existente)
  const scorersData = playerStats
    .sort((a, b) => b.goals - a.goals)

  // Lógica para estadísticas de Fairplay (equipos con menos tarjetas)
  const fairplayData: TeamCardStats[] = teams.map(team => {
    const teamMembers = team.members || []
    const yellowCards = teamMembers.reduce((sum, member) => sum + (member.yellowCards || 0), 0)
    const redCards = teamMembers.reduce((sum, member) => sum + (member.redCards || 0), 0)
    const blueCards = teamMembers.reduce((sum, member) => sum + (member.blueCards || 0), 0)
    const totalCards = yellowCards + redCards + blueCards

    return {
      teamId: team.id,
      teamName: team.name,
      team,
      totalCards,
      yellowCards,
      redCards,
      blueCards
    }
  }).sort((a, b) => a.totalCards - b.totalCards)

  // Lógica para estadísticas de Valla menos vencida
  const defenseData: TeamDefenseStats[] = standings.map(standing => {
    const team = getTeamById(standing.teamId)
    return {
      teamId: standing.teamId,
      teamName: team?.name || `Equipo ${standing.teamId}`,
      team: team!,
      goalsAgainst: standing.goalsAgainst,
      cleanSheets: 0, // Calcular si tienes datos disponibles
      played: standing.played
    }
  }).sort((a, b) => a.goalsAgainst - b.goalsAgainst)

  const topEntry = category === 'scorers' ? scorersData[0] : 
                   category === 'fairplay' ? fairplayData[0] :
                   defenseData[0]

  const getPositionName = (position: Player['position']) => {
    switch (position) {
      case 'GK': return 'Portero'
      case 'DEF': return 'Defensor'
      case 'MID': return 'Mediocampista'
      case 'FWD': return 'Delantero'
    }
  }

  const getCategoryIcon = (cat: StatisticCategory) => {
    switch (cat) {
      case 'scorers': return Target
      case 'fairplay': return Award
      case 'defense': return Shield
    }
  }

  const getCategoryTitle = (cat: StatisticCategory) => {
    switch (cat) {
      case 'scorers': return 'Máximo Goleador'
      case 'fairplay': return 'Fair Play'
      case 'defense': return 'Valla Menos Vencida'
    }
  }


  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías de Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCategory('scorers')}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                category === 'scorers' 
                  ? "border-green-500 bg-green-50 text-green-800" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Goleadores</h3>
                  <p className="text-sm opacity-75">Jugadores con más goles</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCategory('fairplay')}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                category === 'fairplay' 
                  ? "border-yellow-500 bg-yellow-50 text-yellow-800" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Fair Play</h3>
                  <p className="text-sm opacity-75">Equipos con menos tarjetas</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCategory('defense')}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                category === 'defense' 
                  ? "border-blue-500 bg-blue-50 text-blue-800" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Valla Menos Vencida</h3>
                  <p className="text-sm opacity-75">Equipos con menos goles recibidos</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Top Entry Highlight */}
      {topEntry && (
        <Card className={cn("border-2", 
          category === 'scorers' && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
          category === 'fairplay' && "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200",
          category === 'defense' && "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={cn("p-3 rounded-full",
                category === 'scorers' && "bg-green-100",
                category === 'fairplay' && "bg-yellow-100", 
                category === 'defense' && "bg-blue-100"
              )}>
{(() => {
                  const IconComponent = getCategoryIcon(category)
                  return <IconComponent className={cn("w-8 h-8",
                    category === 'scorers' && "text-green-600",
                    category === 'fairplay' && "text-yellow-600",
                    category === 'defense' && "text-blue-600"
                  )} />
                })()}
              </div>
              <div className="flex-1">
                <h3 className={cn("text-lg font-bold",
                  category === 'scorers' && "text-green-700",
                  category === 'fairplay' && "text-yellow-700",
                  category === 'defense' && "text-blue-700"
                )}>
                  {getCategoryTitle(category)}
                </h3>
                
                {category === 'scorers' && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold">
                      {getPlayerById((topEntry as PlayerStats).playerId)?.name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-green-600 font-medium">
                      {getTeamById(getPlayerById((topEntry as PlayerStats).playerId)?.teamId || '')?.name}
                    </span>
                  </div>
                )}

                {category === 'fairplay' && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold">
                      {(topEntry as TeamCardStats).teamName}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-yellow-600 font-medium">
                      {(topEntry as TeamCardStats).totalCards} tarjetas totales
                    </span>
                  </div>
                )}

                {category === 'defense' && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold">
                      {(topEntry as TeamDefenseStats).teamName}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-blue-600 font-medium">
                      {(topEntry as TeamDefenseStats).goalsAgainst} goles recibidos
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {category === 'scorers' && 'Tabla de Goleadores'}
            {category === 'fairplay' && 'Tabla Fair Play'}
            {category === 'defense' && 'Tabla Defensiva'}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {category === 'scorers' && (
              <table className="standings-table">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th className="min-w-[200px]">Jugador</th>
                    <th className="w-20">Equipo</th>
                    <th className="w-16">Goles</th>
                  </tr>
                </thead>
                <tbody>
                  {scorersData.map((stat, index) => {
                    const player = getPlayerById(stat.playerId)
                    const team = getTeamById(player?.teamId || '')
                    
                    return (
                      <tr key={stat.playerId} className="standings-row">
                        <td className="font-medium">
                          {index + 1}
                          {index === 0 && (
                            <Trophy className="w-4 h-4 text-green-600 inline ml-1" />
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
                        <td className="text-center font-bold text-green-600">
                          {stat.goals}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            {category === 'fairplay' && (
              <table className="standings-table">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th className="min-w-[200px]">Equipo</th>
                    <th className="w-16">Total</th>
                    <th className="w-16">🟨</th>
                    <th className="w-16">🟥</th>
                    <th className="w-16">🟦</th>
                  </tr>
                </thead>
                <tbody>
                  {fairplayData.map((teamStats, index) => (
                    <tr key={teamStats.teamId} className="standings-row">
                      <td className="font-medium">
                        {index + 1}
                        {index === 0 && (
                          <Award className="w-4 h-4 text-yellow-600 inline ml-1" />
                        )}
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <TeamAvatar team={teamStats.team} size="sm" />
                          <span className="font-medium">{teamStats.teamName}</span>
                        </div>
                      </td>
                      <td className="text-center font-bold text-yellow-600">
                        {teamStats.totalCards}
                      </td>
                      <td className="text-center text-yellow-600">
                        {teamStats.yellowCards}
                      </td>
                      <td className="text-center text-red-600">
                        {teamStats.redCards}
                      </td>
                      <td className="text-center text-blue-600">
                        {teamStats.blueCards}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {category === 'defense' && (
              <table className="standings-table">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th className="min-w-[200px]">Equipo</th>
                    <th className="w-20">Goles Rec.</th>
                    <th className="w-20">Partidos</th>
                    <th className="w-20">Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {defenseData.map((teamStats, index) => (
                    <tr key={teamStats.teamId} className="standings-row">
                      <td className="font-medium">
                        {index + 1}
                        {index === 0 && (
                          <Shield className="w-4 h-4 text-blue-600 inline ml-1" />
                        )}
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <TeamAvatar team={teamStats.team} size="sm" />
                          <span className="font-medium">{teamStats.teamName}</span>
                        </div>
                      </td>
                      <td className="text-center font-bold text-blue-600">
                        {teamStats.goalsAgainst}
                      </td>
                      <td className="text-center">
                        {teamStats.played}
                      </td>
                      <td className="text-center text-sm text-muted-foreground">
                        {(teamStats.goalsAgainst / Math.max(teamStats.played, 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}