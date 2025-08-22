import { Tournament, Team, Player, Match, Standing, PlayerStats, TeamStats, TournamentData } from '../types/tournament'

// Mock Tournaments
export const tournaments: Tournament[] = [
  {
    id: 'liga-argentina-2024',
    name: 'Liga Profesional Argentina',
    season: '2024',
    country: 'Argentina',
    region: 'América del Sur',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-15'),
    format: 'league',
    teamCount: 28,
    description: 'Torneo de primera división de Argentina',
    currentMatchday: 15,
    totalMatchdays: 27
  },
  {
    id: 'copa-libertadores-2024',
    name: 'Copa Libertadores',
    season: '2024',
    country: 'Sudamérica',
    region: 'América del Sur',
    status: 'active',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
    format: 'group-knockout',
    teamCount: 32,
    description: 'Copa más prestigiosa de Sudamérica',
    currentMatchday: 6,
    totalMatchdays: 14
  },
  {
    id: 'mundial-2022',
    name: 'Copa Mundial FIFA',
    season: '2022',
    country: 'Qatar',
    region: 'Mundial',
    status: 'completed',
    startDate: new Date('2022-11-20'),
    endDate: new Date('2022-12-18'),
    format: 'group-knockout',
    teamCount: 32,
    description: 'Copa del Mundo FIFA 2022 en Qatar'
  }
]

// Mock Teams for Liga Argentina
export const argentineTeams: Team[] = [
  {
    id: 'boca-juniors',
    name: 'Club Atlético Boca Juniors',
    shortName: 'Boca',
    founded: 1905,
    stadium: 'La Bombonera',
    city: 'Buenos Aires',
    country: 'Argentina',
    colors: { primary: '#003f7f', secondary: '#ffd700' },
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/boca-juniors-vector-logo.png',
    members: [
      {
        id: 1,
        firstName: 'Lionel',
        lastName: 'Messi',
        fullName: 'Lionel Sebastián Messi',
        dni: '20123456789',
        tshirtNumber: 10,
        dateOfBirth: '1987-06-24',
        joinedAt: '2024-01-15T10:00:00.000Z',
        goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:1
      },
      {
        id: 2,
        firstName: 'Sergio',
        lastName: 'Romero',
        fullName: 'Sergio Germán Romero',
        dni: '20987654321',
        tshirtNumber: 1,
        dateOfBirth: '1987-02-22',
        joinedAt: '2024-01-15T10:00:00.000Z', goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      }
    ],
    membersCount: 2
  },
  {
    id: 'river-plate',
    name: 'Club Atlético River Plate',
    shortName: 'River',
    founded: 1901,
    stadium: 'Estadio Monumental',
    city: 'Buenos Aires',
    country: 'Argentina',
    colors: { primary: '#ff0000', secondary: '#ffffff' },
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/river-plate-vector-logo.png',
    members: [
      {
        id: 3,
        firstName: 'Julián',
        lastName: 'Álvarez',
        fullName: 'Julián Álvarez',
        dni: '20111222333',
        tshirtNumber: 9,
        dateOfBirth: '2000-01-31',
        joinedAt: '2024-01-15T10:00:00.000Z',
         goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      },
      {
        id: 4,
        firstName: 'Franco',
        lastName: 'Armani',
        fullName: 'Franco Armani',
        dni: '20444555666',
        tshirtNumber: 1,
        dateOfBirth: '1986-10-16',
        joinedAt: '2024-01-15T10:00:00.000Z',
         goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      }
    ],
    membersCount: 2
  },
  {
    id: 'racing-club',
    name: 'Racing Club',
    shortName: 'Racing',
    founded: 1903,
    stadium: 'Estadio Presidente Perón',
    city: 'Avellaneda',
    country: 'Argentina',
    colors: { primary: '#5cb3cc', secondary: '#ffffff' },
    members: [
      {
        id: 5,
        firstName: 'Cristian',
        lastName: 'Romero',
        fullName: 'Cristian Gabriel Romero',
        dni: '20777888999',
        tshirtNumber: 4,
        dateOfBirth: '1998-04-27',
        joinedAt: '2024-01-15T10:00:00.000Z',
         goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      }
    ],
    membersCount: 1
  },
  {
    id: 'independiente',
    name: 'Club Atlético Independiente',
    shortName: 'Independiente',
    founded: 1905,
    stadium: 'Estadio Libertadores de América',
    city: 'Avellaneda',
    country: 'Argentina',
    colors: { primary: '#dc143c', secondary: '#ffffff' },
    members: [
      {
        id: 6,
        firstName: 'Lautaro',
        lastName: 'Martínez',
        fullName: 'Lautaro Javier Martínez',
        dni: '20123789456',
        tshirtNumber: 22,
        dateOfBirth: '1997-08-22',
        joinedAt: '2024-01-15T10:00:00.000Z',
         goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      }
    ],
    membersCount: 1
  },
  {
    id: 'san-lorenzo',
    name: 'Club Atlético San Lorenzo',
    shortName: 'San Lorenzo',
    founded: 1908,
    stadium: 'Estadio Pedro Bidegain',
    city: 'Buenos Aires',
    country: 'Argentina',
    colors: { primary: '#003f7f', secondary: '#dc143c' },
    members: [
      {
        id: 7,
        firstName: 'Enzo',
        lastName: 'Fernández',
        fullName: 'Enzo Jeremías Fernández',
        dni: '20456123789',
        tshirtNumber: 8,
        dateOfBirth: '2001-01-17',
        joinedAt: '2024-01-15T10:00:00.000Z',
         goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      }
    ],
    membersCount: 1
  },
  {
    id: 'estudiantes',
    name: 'Estudiantes de La Plata',
    shortName: 'Estudiantes',
    founded: 1905,
    stadium: 'Estadio Jorge Luis Hirschi',
    city: 'La Plata',
    country: 'Argentina',
    colors: { primary: '#dc143c', secondary: '#ffffff' },
    members: [
      {
        id: 8,
        firstName: 'Alexis',
        lastName: 'Mac Allister',
        fullName: 'Alexis Mac Allister',
        dni: '20789456123',
        tshirtNumber: 20,
        dateOfBirth: '1998-12-24',
        joinedAt: '2024-01-15T10:00:00.000Z',
         goals:0,
        yellowCards:0,
        redCards:0,
        blueCards:0
      }
    ],
    membersCount: 1
  }
]

// Mock Players
export const argentinePlayers: Player[] = [
  {
    id: 'messi-boca',
    name: 'Lionel Sebastián Messi',
    position: 'FWD',
    teamId: 'boca-juniors',
    number: 10,
    age: 37,
    nationality: 'Argentina'
  },
  {
    id: 'alvarez-river',
    name: 'Julián Álvarez',
    position: 'FWD',
    teamId: 'river-plate',
    number: 9,
    age: 24,
    nationality: 'Argentina'
  },
  {
    id: 'romero-racing',
    name: 'Cristian Romero',
    position: 'DEF',
    teamId: 'racing-club',
    number: 4,
    age: 26,
    nationality: 'Argentina'
  },
  {
    id: 'martinez-independiente',
    name: 'Lautaro Martínez',
    position: 'FWD',
    teamId: 'independiente',
    number: 22,
    age: 27,
    nationality: 'Argentina'
  },
  {
    id: 'enzo-san-lorenzo',
    name: 'Enzo Fernández',
    position: 'MID',
    teamId: 'san-lorenzo',
    number: 8,
    age: 23,
    nationality: 'Argentina'
  },
  {
    id: 'mac-allister-estudiantes',
    name: 'Alexis Mac Allister',
    position: 'MID',
    teamId: 'estudiantes',
    number: 20,
    age: 25,
    nationality: 'Argentina'
  }
]

// Mock Standings for Liga Argentina
export const argentineStandings: Standing[] = [
  {
    teamId: 'boca-juniors',
    position: 1,
    played: 15,
    won: 11,
    drawn: 3,
    lost: 1,
    goalsFor: 28,
    goalsAgainst: 8,
    goalDifference: 20,
    points: 36,
    form: ['W', 'W', 'D', 'W', 'W']
  },
  {
    teamId: 'river-plate',
    position: 2,
    played: 15,
    won: 10,
    drawn: 4,
    lost: 1,
    goalsFor: 32,
    goalsAgainst: 12,
    goalDifference: 20,
    points: 34,
    form: ['W', 'D', 'W', 'W', 'W']
  },
  {
    teamId: 'racing-club',
    position: 3,
    played: 15,
    won: 9,
    drawn: 5,
    lost: 1,
    goalsFor: 25,
    goalsAgainst: 10,
    goalDifference: 15,
    points: 32,
    form: ['D', 'W', 'W', 'D', 'W']
  },
  {
    teamId: 'independiente',
    position: 4,
    played: 15,
    won: 8,
    drawn: 4,
    lost: 3,
    goalsFor: 24,
    goalsAgainst: 15,
    goalDifference: 9,
    points: 28,
    form: ['L', 'W', 'D', 'W', 'W']
  },
  {
    teamId: 'san-lorenzo',
    position: 5,
    played: 15,
    won: 7,
    drawn: 6,
    lost: 2,
    goalsFor: 21,
    goalsAgainst: 14,
    goalDifference: 7,
    points: 27,
    form: ['D', 'D', 'W', 'W', 'D']
  },
  {
    teamId: 'estudiantes',
    position: 6,
    played: 15,
    won: 6,
    drawn: 7,
    lost: 2,
    goalsFor: 19,
    goalsAgainst: 13,
    goalDifference: 6,
    points: 25,
    form: ['D', 'L', 'D', 'W', 'D']
  }
]

// Mock Player Stats
export const argentinePlayerStats: PlayerStats[] = [
  {
    playerId: 'messi-boca',
    tournamentId: 'liga-argentina-2024',
    goals: 15,
    assists: 8,
    matches: 14,
    minutesPlayed: 1260,
    yellowCards: 2,
    redCards: 0,
    blueCards: 1,
    averageGoalsPerGame: 1.07
  },
  {
    playerId: 'alvarez-river',
    tournamentId: 'liga-argentina-2024',
    goals: 12,
    assists: 5,
    matches: 15,
    minutesPlayed: 1350,
    yellowCards: 3,
    redCards: 0,
    averageGoalsPerGame: 0.8
  },
  {
    playerId: 'martinez-independiente',
    tournamentId: 'liga-argentina-2024',
    goals: 10,
    assists: 4,
    matches: 13,
    minutesPlayed: 1170,
    yellowCards: 1,
    redCards: 0,
    averageGoalsPerGame: 0.77
  },
  {
    playerId: 'enzo-san-lorenzo',
    tournamentId: 'liga-argentina-2024',
    goals: 5,
    assists: 11,
    matches: 15,
    minutesPlayed: 1400,
    yellowCards: 4,
    redCards: 0,
    blueCards: 2,
    averageGoalsPerGame: 0.33
  },
  {
    playerId: 'mac-allister-estudiantes',
    tournamentId: 'liga-argentina-2024',
    goals: 4,
    assists: 9,
    matches: 14,
    minutesPlayed: 1260,
    yellowCards: 2,
    redCards: 1,
    averageGoalsPerGame: 0.29
  },
  {
    playerId: 'romero-racing',
    tournamentId: 'liga-argentina-2024',
    goals: 3,
    assists: 2,
    matches: 15,
    minutesPlayed: 1350,
    yellowCards: 5,
    redCards: 0,
    averageGoalsPerGame: 0.2
  }
]

// Mock Team Stats
export const argentineTeamStats: TeamStats[] = [
  {
    teamId: 'boca-juniors',
    tournamentId: 'liga-argentina-2024',
    homeWins: 6,
    homeDraws: 1,
    homeLosses: 0,
    awayWins: 5,
    awayDraws: 2,
    awayLosses: 1,
    goalsForHome: 16,
    goalsAgainstHome: 3,
    goalsForAway: 12,
    goalsAgainstAway: 5,
    cleanSheets: 8,
    yellowCards: 25,
    redCards: 1,
    blueCards: 3,
    penaltiesFor: 3,
    penaltiesAgainst: 1
  },
  {
    teamId: 'river-plate',
    tournamentId: 'liga-argentina-2024',
    homeWins: 6,
    homeDraws: 2,
    homeLosses: 0,
    awayWins: 4,
    awayDraws: 2,
    awayLosses: 1,
    goalsForHome: 18,
    goalsAgainstHome: 5,
    goalsForAway: 14,
    goalsAgainstAway: 7,
    cleanSheets: 6,
    yellowCards: 28,
    redCards: 2,
    blueCards: 1,
    penaltiesFor: 4,
    penaltiesAgainst: 2
  }
]

// Mock Matches
export const argentineMatches: Match[] = [
  {
    id: 'match-1',
    tournamentId: 'liga-argentina-2024',
    homeTeamId: 'boca-juniors',
    awayTeamId: 'river-plate',
    homeScore: 2,
    awayScore: 1,
    date: new Date('2024-03-15'),
    matchday: 8,
    status: 'finished',
    venue: 'La Bombonera'
  },
  {
    id: 'match-2',
    tournamentId: 'liga-argentina-2024',
    homeTeamId: 'racing-club',
    awayTeamId: 'independiente',
    homeScore: 1,
    awayScore: 1,
    date: new Date('2024-03-16'),
    matchday: 8,
    status: 'finished',
    venue: 'Estadio Presidente Perón'
  },
  {
    id: 'match-3',
    tournamentId: 'liga-argentina-2024',
    homeTeamId: 'san-lorenzo',
    awayTeamId: 'estudiantes',
    date: new Date('2024-08-20'),
    matchday: 16,
    status: 'scheduled',
    venue: 'Estadio Pedro Bidegain'
  }
]

// Complete tournament data
export const ligaArgentina2024: TournamentData = {
  tournament: tournaments[0],
  teams: argentineTeams,
  players: argentinePlayers,
  matches: argentineMatches,
  standings: argentineStandings,
  playerStats: argentinePlayerStats,
  teamStats: argentineTeamStats
}

// Export all mock data
export const mockTournaments = tournaments
export const mockData = {
  'liga-argentina-2024': ligaArgentina2024
}

// Helper functions for mock data
export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find(t => t.id === id)
}

export function getTournamentData(id: string): TournamentData | undefined {
  return mockData[id as keyof typeof mockData]
}

export function getTeamById(teamId: string): Team | undefined {
  return argentineTeams.find(t => t.id === teamId)
}

export function getPlayerById(playerId: string): Player | undefined {
  return argentinePlayers.find(p => p.id === playerId)
}

export function getTopScorers(tournamentId: string, limit = 10): (PlayerStats & { player: Player; team: Team })[] {
  const stats = argentinePlayerStats
    .filter(s => s.tournamentId === tournamentId)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit)
  
  return stats.map(stat => {
    const player = getPlayerById(stat.playerId)!
    const team = getTeamById(player.teamId)!
    return { ...stat, player, team }
  })
}