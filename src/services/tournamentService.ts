import { apiClient } from './api'
import {
  ApiTournament,
  ApiTeam,
  ApiStandingsResponse,
  ApiTopScorersResponse,
  ApiMatch,
  ApiTeamStatsResponse,
  TournamentFilters,
  MatchFilters,
  ApiStanding
} from '../types/api'
import { 
  Tournament, 
  Team, 
  Standing, 
  Match, 
  PlayerStats, 
  TournamentData 
} from '../types/tournament'

class TournamentService {
  async getTournaments(filters?: TournamentFilters): Promise<ApiTournament[]> {
    const params: Record<string, string> = {}
    
    if (filters?.status) {
      params.status = filters.status
    }
    if (filters?.phase) {
      params.phase = filters.phase
    }

    return apiClient.get<ApiTournament[]>('', params)
  }

  async getTournamentById(id: string | number): Promise<ApiTournament> {
    return apiClient.get<ApiTournament>(`/${id}`)
  }

  async getTournamentStandings(id: string | number): Promise<ApiStandingsResponse> {
    return apiClient.get<ApiStandingsResponse>(`/${id}/standings`)
  }

  async getTournamentTeams(id: string | number): Promise<ApiTeam[]> {
    return apiClient.get<ApiTeam[]>(`/${id}/teams`)
  }

  async getTournamentTopScorers(id: string | number): Promise<ApiTopScorersResponse> {
    return apiClient.get<ApiTopScorersResponse>(`/${id}/top-scorers`)
  }

  async getTournamentMatches(id: string | number, filters?: MatchFilters): Promise<ApiMatch[]> {
    const params: Record<string, string> = {}
    
    if (filters?.phase) {
      params.phase = filters.phase
    }
    if (filters?.status) {
      params.status = filters.status
    }

    return apiClient.get<ApiMatch[]>(`/${id}/matches`, params)
  }

  async getTeamStats(
    tournamentId: string | number, 
    teamId: string | number
  ): Promise<ApiTeamStatsResponse> {
    return apiClient.get<ApiTeamStatsResponse>(`/${tournamentId}/teams/${teamId}/stats`)
  }

  mapApiTournamentToTournament(apiTournament: ApiTournament): Tournament {
    return {
      id: apiTournament.id.toString(),
      name: apiTournament.name,
      season: new Date(apiTournament.startDate).getFullYear().toString(),
      country: '',
      region: '',
      status: this.mapTournamentStatus(apiTournament.status),
      startDate: new Date(apiTournament.startDate),
      endDate: new Date(apiTournament.endDate),
      logo: apiTournament.logo,
      format: this.mapTournamentFormat(apiTournament.format),
      teamCount: apiTournament.maxTeams,
      description: apiTournament.description,
      currentMatchday: undefined,
      totalMatchdays: undefined,
      playoffTeamsCount: apiTournament.playoffTeamsCount
    }
  }

  mapApiTeamToTeam(apiTeam: ApiTeam): Team {
    return {
      id: apiTeam.teamId.toString(),
      name: apiTeam.teamName,
      shortName: apiTeam.teamName.split(' ').map(word => word[0]).join('').substring(0, 3),
      logo: apiTeam.teamLogo,
      country: 'Unknown',
      colors: {
        primary: '#1f2937',
        secondary: '#374151'
      }
    }
  }

  mapApiStandingToStanding(apiStanding: ApiStanding): Standing {
    return {
      teamId: apiStanding.teamId.toString(),
      position: apiStanding.position,
      played: apiStanding.played,
      won: apiStanding.won,
      drawn: apiStanding.drawn,
      lost: apiStanding.lost,
      goalsFor: apiStanding.goalsFor,
      goalsAgainst: apiStanding.goalsAgainst,
      goalDifference: apiStanding.goalDifference,
      points: apiStanding.points,
      form: apiStanding.form
    }
  }

  mapApiMatchToMatch(apiMatch: ApiMatch): Match {
    return {
      id: apiMatch.id.toString(),
      tournamentId: apiMatch.tournamentId.toString(),
      homeTeamId: apiMatch.homeTeamId.toString(),
      awayTeamId: apiMatch.awayTeamId.toString(),
      homeScore: apiMatch.result?.homeScore,
      awayScore: apiMatch.result?.awayScore,
      date: new Date(apiMatch.scheduledAt),
      matchday: apiMatch.round,
      status: this.mapMatchStatus(apiMatch.status),
      venue: apiMatch.venue?.name,
      phase: apiMatch.phase
    }
  }

  mapApiTopScorersToPlayerStats(topScorers: ApiTopScorersResponse): PlayerStats[] {
    return topScorers.topScorers.map((scorer, _index) => ({
      playerId: scorer.userId,
      tournamentId: topScorers.tournamentId.toString(),
      goals: parseInt(scorer.goals),
      assists: 0,
      matches: 0,
      minutesPlayed: 0,
      yellowCards: 0,
      redCards: 0,
      averageGoalsPerGame: parseInt(scorer.goals)
    }))
  }

  async getTournamentData(id: string): Promise<TournamentData | null> {
    try {
      const [
        tournament,
        standingsResponse,
        teams,
        topScorersResponse,
        matches
      ] = await Promise.all([
        this.getTournamentById(id),
        this.getTournamentStandings(id),
        this.getTournamentTeams(id),
        this.getTournamentTopScorers(id),
        this.getTournamentMatches(id)
      ])

      const mappedTournament = this.mapApiTournamentToTournament(tournament)
      const mappedTeams = teams.map(team => this.mapApiTeamToTeam(team))
      const mappedStandings = standingsResponse.standings.map(standing => 
        this.mapApiStandingToStanding(standing)
      )
      const mappedMatches = matches.map(match => this.mapApiMatchToMatch(match))
      const mappedPlayerStats = this.mapApiTopScorersToPlayerStats(topScorersResponse)

      const players = topScorersResponse.topScorers.map(scorer => ({
        id: scorer.userId,
        name: scorer.name,
        position: 'FWD' as const,
        teamId: mappedTeams.find(team => team.name === scorer.teamName)?.id || '1',
        nationality: 'Unknown'
      }))

      return {
        tournament: mappedTournament,
        teams: mappedTeams,
        players,
        matches: mappedMatches,
        standings: mappedStandings,
        playerStats: mappedPlayerStats,
        teamStats: []
      }
    } catch (error) {
      console.error('Error fetching tournament data:', error)
      return null
    }
  }

  private mapTournamentStatus(status: string): 'active' | 'completed' | 'upcoming' {
    switch (status) {
      case 'active':
        return 'active'
      case 'completed':
        return 'completed'
      case 'upcoming':
        return 'upcoming'
      default:
        return 'active'
    }
  }

  private mapTournamentFormat(format: string): 'league' | 'knockout' | 'group-knockout' {
    if (format.includes('knockout')) {
      return format.includes('group') ? 'group-knockout' : 'knockout'
    }
    return 'league'
  }

  private mapMatchStatus(status: string): 'scheduled' | 'live' | 'finished' {
    switch (status) {
      case 'scheduled':
      case 'pending':
        return 'scheduled'
      case 'live':
        return 'live'
      case 'completed':
        return 'finished'
      default:
        return 'scheduled'
    }
  }
}

export const tournamentService = new TournamentService()