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
  ApiStanding,
  ApiMatchEvent
} from '../types/api'
import { 
  Tournament, 
  Team, 
  Standing, 
  Match, 
  PlayerStats, 
  TournamentData,
  Goal,
  MatchEvent 
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
      },
      members: apiTeam.members,
      membersCount: apiTeam.membersCount
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

  mapApiEventsToMatchEvents(events: ApiMatchEvent[]): MatchEvent[] {
    return events
      .filter(event => ['goal', 'yellow_card', 'red_card', 'blue_card', 'substitution'].includes(event.eventType))
      .map(event => {
        // Try flat player fields first, then nested player object
        const playerName = event.playerFirstName && event.playerLastName
          ? `${event.playerFirstName} ${event.playerLastName}`
          : event.player?.firstName && event.player?.lastName
            ? `${event.player.firstName} ${event.player.lastName}`
            : event.player?.displayName || 'Unknown Player'
        
        const relatedPlayerName = event.relatedPlayer?.firstName && event.relatedPlayer?.lastName
          ? `${event.relatedPlayer.firstName} ${event.relatedPlayer.lastName}`
          : event.relatedPlayer?.displayName

        return {
          id: event.id.toString(),
          playerId: event.userId,
          playerName,
          teamId: event.teamId.toString(),
          minute: event.minute,
          type: event.eventType as 'goal' | 'yellow_card' | 'red_card' | 'blue_card' | 'substitution',
          subType: event.eventType === 'goal' ? 'regular' : undefined,
          assistPlayerId: event.eventType === 'goal' ? event.relatedUserId || undefined : undefined,
          assistPlayerName: event.eventType === 'goal' ? relatedPlayerName || undefined : undefined,
          relatedPlayerId: event.eventType === 'substitution' ? event.relatedUserId || undefined : undefined,
          relatedPlayerName: event.eventType === 'substitution' ? relatedPlayerName || undefined : undefined
        }
      })
  }

  mapApiEventsToGoals(events: ApiMatchEvent[]): Goal[] {
    return events
      .filter(event => event.eventType === 'goal')
      .map(event => {
        // Try flat player fields first, then nested player object
        const playerName = event.playerFirstName && event.playerLastName
          ? `${event.playerFirstName} ${event.playerLastName}`
          : event.player?.firstName && event.player?.lastName
            ? `${event.player.firstName} ${event.player.lastName}`
            : event.player?.displayName || 'Unknown Player'
        
        const assistPlayerName = event.relatedPlayer?.firstName && event.relatedPlayer?.lastName
          ? `${event.relatedPlayer.firstName} ${event.relatedPlayer.lastName}`
          : event.relatedPlayer?.displayName

        return {
          id: event.id.toString(),
          playerId: event.userId,
          playerName,
          teamId: event.teamId.toString(),
          minute: event.minute,
          type: 'regular' as const,
          assistPlayerId: event.relatedUserId || undefined,
          assistPlayerName: assistPlayerName || undefined
        }
      })
  }

  mapApiMatchToMatch(apiMatch: ApiMatch): Match {
    const goals = apiMatch.events ? this.mapApiEventsToGoals(apiMatch.events) : []
    const events = apiMatch.events ? this.mapApiEventsToMatchEvents(apiMatch.events) : []
    console.log(apiMatch)
    return {
      id: apiMatch.id.toString(),
      tournamentId: apiMatch.tournamentId.toString(),
      homeTeamId: apiMatch.homeTeamId.toString(),
      awayTeamId: apiMatch.awayTeamId.toString(),
      homeTeamName: apiMatch.homeTeamName,
      awayTeamName: apiMatch.awayTeamName,
      homeScore: apiMatch.result?.homeScore,
      awayScore: apiMatch.result?.awayScore,
      date: apiMatch.scheduledAt ? new Date(apiMatch.scheduledAt) : undefined,
      matchday: apiMatch.round,
      round: apiMatch.round,
      status: this.mapMatchStatus(apiMatch.status),
      venue: apiMatch.venue?.name,
      venueId: apiMatch.venueId,
      phase: apiMatch.phase,
      result: apiMatch.result ? {
        id: apiMatch.result.id,
        matchId: apiMatch.result.matchId,
        homeScore: apiMatch.result.homeScore,
        awayScore: apiMatch.result.awayScore,
        homeScoreHalftime: apiMatch.result.homeScoreHalftime || 0,
        awayScoreHalftime: apiMatch.result.awayScoreHalftime || 0,
        homeScoreExtraTime: apiMatch.result.homeScoreExtraTime,
        awayScoreExtraTime: apiMatch.result.awayScoreExtraTime,
        homeScorePenalties: apiMatch.result.homeScorePenalties,
        awayScorePenalties: apiMatch.result.awayScorePenalties,
        winnerTeamId: apiMatch.result.winnerTeamId,
        isOfficial: apiMatch.result.isOfficial,
        recordedBy: apiMatch.result.recordedBy || '',
        recordedAt: apiMatch.result.recordedAt,
        updatedAt: apiMatch.result.updatedAt
      } : undefined,
      goals: goals.length > 0 ? goals : undefined,
      events: events.length > 0 ? events : undefined
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

  private mapMatchStatus(status: string): 'scheduled' | 'live' | 'finished' | "pending" {
    switch (status) {
      case 'scheduled':
        return 'scheduled'
      case 'pending':
        return 'pending'
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