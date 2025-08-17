export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  statusCode?: number
}

export interface ApiTournament {
  id: number
  name: string
  description: string
  organizerId?: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  phase: 'league' | 'playoffs' | 'completed'
  format: string
  playoffTeamsCount?: number
  maxTeams: number
  startDate: string
  endDate: string
  registrationDeadline?: string
  entryFee?: string
  prizePool?: string
  rules?: string
  isPublic: boolean
  inviteCode?: string
  logo?: string
  createdAt: string
  updatedAt?: string
}

export interface ApiTeam {
  id: number
  tournamentId: number
  teamId: number
  teamName: string
  teamLogo?: string
  appliedAt: string
  points?: number
  played?: number
  won?: number
  drawn?: number
  lost?: number
  goalsFor?: number
  goalsAgainst?: number
  goalDifference?: number
  position?: number
}

export interface ApiStanding {
  position: number
  teamId: number
  teamName: string
  teamLogo?: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: ('W' | 'D' | 'L')[]
  status: string
}

export interface ApiStandingsResponse {
  tournamentId: number
  tournamentName: string
  lastUpdated: string
  standings: ApiStanding[]
}

export interface ApiTopScorer {
  rank: number
  userId: string
  name: string
  teamName: string
  teamLogo?: string
  goals: number
}

export interface ApiTopScorersResponse {
  tournamentId: number
  tournamentName: string
  topScorers: ApiTopScorer[]
}

export interface ApiVenue {
  name: string
}

export interface ApiMatchResult {
  id: number
  matchId: number
  homeScore: number
  awayScore: number
  homeScoreHalftime?: number
  awayScoreHalftime?: number
  homeScoreExtraTime?: number
  awayScoreExtraTime?: number
  homeScorePenalties?: number
  awayScorePenalties?: number
  winnerTeamId?: number
  isOfficial: boolean
  recordedBy?: string
  recordedAt: string
  updatedAt: string
}

export interface ApiMatch {
  id: number
  tournamentId: number
  homeTeamId: number
  awayTeamId: number
  homeTeamName: string
  awayTeamName: string
  scheduledAt: string
  kickoffAt?: string
  status: 'pending' | 'scheduled' | 'live' | 'completed' | 'cancelled'
  round: number
  phase: 'league' | 'quarter-final' | 'semi-final' | 'final'
  playoffRound?: string
  venueId?: number
  venue?: ApiVenue
  result?: ApiMatchResult
}

export interface ApiTeamStatsStanding {
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: ('W' | 'D' | 'L')[]
}

export interface ApiTeamStatsScorer {
  userId: string
  name: string
  goals: number
}

export interface ApiTeamStatsRecentMatch {
  id: number
  opponent: string
  result: 'W' | 'D' | 'L'
  score: string
  date: string
}

export interface ApiTeamStatsResponse {
  tournamentId: number
  tournamentName: string
  teamId: number
  teamName: string
  teamLogo?: string
  standings: ApiTeamStatsStanding
  topScorers: ApiTeamStatsScorer[]
  recentMatches: ApiTeamStatsRecentMatch[]
}

export interface ApiError {
  message: string
  error: string
  statusCode: number
}

export interface TournamentFilters {
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
  phase?: 'league' | 'playoffs' | 'completed'
}

export interface MatchFilters {
  phase?: 'league' | 'quarter-final' | 'semi-final' | 'final'
  status?: 'pending' | 'scheduled' | 'live' | 'completed' | 'cancelled'
}