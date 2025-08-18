import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, RefreshCw } from 'lucide-react'
import { useTournament } from '../hooks/useTournamentData'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import StandingsTable from '../components/StandingsTable'
import PlayersTable from '../components/PlayersTable'
import TeamsGrid from '../components/TeamsGrid'
import MatchesTable from '../components/MatchesTable'
import { formatDate } from '../lib/utils'

export default function TournamentPage() {
  const { id, tab = 'standings' } = useParams<{ id: string; tab?: string }>()
  const navigate = useNavigate()
  const { tournamentData, loading, error, refresh } = useTournament(id || '')

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!tournamentData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Torneo no encontrado</h1>
          <Button onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  const { tournament, teams, standings, playerStats, players, matches } = tournamentData

  const handleTabChange = (newTab: string) => {
    navigate(`/tournament/${id}/${newTab}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button and Actions */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {/* Tournament Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                {tournament.name}
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Temporada {tournament.season}
              </p>
              
              {tournament.description && (
                <p className="text-muted-foreground mt-2">
                  {tournament.description}
                </p>
              )}
            </div>

            {tournament.logo && (
              <div className="flex-shrink-0">
                <img 
                  src={tournament.logo} 
                  alt={`${tournament.name} logo`}
                  className="w-20 h-20 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            

            {/* Teams */}
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Equipos</p>
                <p className="font-medium">{tournament.teamCount}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fechas</p>
                <p className="font-medium text-sm">
                  {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                </p>
              </div>
            </div>

            {/* Progress */}
            {tournament.currentMatchday && tournament.totalMatchdays && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progreso</p>
                  <p className="font-medium">
                    J{tournament.currentMatchday} de {tournament.totalMatchdays}
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-brand-primary h-1.5 rounded-full" 
                      style={{ 
                        width: `${(tournament.currentMatchday / tournament.totalMatchdays) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tournament Content Tabs */}
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="hidden md:grid w-full grid-cols-4">
          <TabsTrigger value="standings">Posiciones</TabsTrigger>
          <TabsTrigger value="matches">Partidos</TabsTrigger>
          <TabsTrigger value="players">Goleadores</TabsTrigger>
          <TabsTrigger value="teams">Equipos</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="mt-6">
          <StandingsTable standings={standings} teams={teams} playoffTeamsCount={tournament.playoffTeamsCount} />
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <MatchesTable matches={matches} teams={teams} />
        </TabsContent>

        <TabsContent value="players" className="mt-6">
          <PlayersTable 
            playerStats={playerStats} 
            players={players} 
            teams={teams} 
          />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamsGrid teams={teams} />
        </TabsContent>
      </Tabs>
    </div>
  )
}