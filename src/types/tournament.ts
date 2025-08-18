export interface Tournament {
  id: string
  name: string
  season: string
  country: string
  region?: string
  status: 'active' | 'completed' | 'upcoming'
  startDate: Date
  endDate: Date
  logo?: string
  format: 'league' | 'knockout' | 'group-knockout'
  teamCount: number
  description?: string
  currentMatchday?: number
  totalMatchdays?: number
  playoffTeamsCount?: number
}

export interface Team {
  id: string
  name: string
  shortName: string
  logo?: string
  founded?: number
  stadium?: string
  city?: string
  country: string
  colors: {
    primary: string
    secondary: string
  }
}

export interface Player {
  id: string
  name: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  teamId: string
  number?: number
  age?: number
  nationality?: string
  photo?: string
}

export interface Goal {
  id: string
  playerId: string
  playerName: string
  teamId: string
  minute: number
  type: 'regular' | 'penalty' | 'own_goal' | 'free_kick'
  assistPlayerId?: string
  assistPlayerName?: string
}

export interface MatchEvent {
  id: string
  playerId: string
  playerName: string
  teamId: string
  minute: number
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution'
  subType?: 'regular' | 'penalty' | 'own_goal' | 'free_kick'
  assistPlayerId?: string
  assistPlayerName?: string
  // For substitutions: playerId/playerName = player coming in, relatedPlayerId/relatedPlayerName = player going out
  relatedPlayerId?: string
  relatedPlayerName?: string
}

export interface MatchResultData {
  id: number
  matchId: number
  homeScore: number
  awayScore: number
  homeScoreHalftime: number
  awayScoreHalftime: number
  homeScoreExtraTime?: number | null
  awayScoreExtraTime?: number | null
  homeScorePenalties?: number | null
  awayScorePenalties?: number | null
  winnerTeamId?: number | null
  isOfficial: boolean
  recordedBy: string
  recordedAt: string
  updatedAt: string
  goals?: Goal[]
}

export interface Match {
  id: string | number
  tournamentId: string | number
  homeTeamId: string | number
  awayTeamId: string | number
  homeScore?: number // Legacy support
  awayScore?: number // Legacy support
  date: Date
  scheduledAt?: string | null
  kickoffAt?: string
  matchday?: number // Legacy support
  round?: number
  phase?: string
  playoffRound?: number
  status: 'scheduled' | 'live' | 'finished' | 'completed' | 'pending'
  venue?: string
  venueId?: number | null
  homeTeamName?: string
  awayTeamName?: string
  result?: MatchResultData
  goals?: Goal[]
  events?: MatchEvent[]
}

export interface Standing {
  teamId: string
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form?: ('W' | 'D' | 'L')[]
}

export interface PlayerStats {
  playerId: string
  tournamentId: string
  goals: number
  assists: number
  matches: number
  minutesPlayed: number
  yellowCards: number
  redCards: number
  averageGoalsPerGame: number
}

export interface TeamStats {
  teamId: string
  tournamentId: string
  homeWins: number
  homeDraws: number
  homeLosses: number
  awayWins: number
  awayDraws: number
  awayLosses: number
  goalsForHome: number
  goalsAgainstHome: number
  goalsForAway: number
  goalsAgainstAway: number
  cleanSheets: number
  yellowCards: number
  redCards: number
  penaltiesFor: number
  penaltiesAgainst: number
}

export interface TournamentData {
  tournament: Tournament
  teams: Team[]
  players: Player[]
  matches: Match[]
  standings: Standing[]
  playerStats: PlayerStats[]
  teamStats: TeamStats[]
}

export type TournamentFormat = 'league' | 'knockout' | 'group-knockout'
export type TournamentStatus = 'active' | 'completed' | 'upcoming'
export type MatchStatus = 'scheduled' | 'live' | 'finished'
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'
export type MatchResult = 'W' | 'D' | 'L'

export interface SearchFilters {
  search?: string
  country?: string
  status?: TournamentStatus
  format?: TournamentFormat
  season?: string
}

export interface SortOptions {
  field: 'name' | 'startDate' | 'teamCount' | 'country'
  direction: 'asc' | 'desc'
}