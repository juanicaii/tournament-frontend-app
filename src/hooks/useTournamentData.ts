import { useState, useEffect, useCallback } from 'react'
import { TournamentData, Tournament } from '../types/tournament'
import { tournamentService } from '../services/tournamentService'
import { getTournamentData as getMockTournamentData, mockTournaments } from '../data/mockData'

interface UseTournamentDataReturn {
  tournaments: Tournament[]
  tournamentData: TournamentData | null
  loading: boolean
  error: string | null
  refreshTournaments: () => Promise<void>
  refreshTournamentData: (id: string) => Promise<void>
}

export function useTournamentData(tournamentId?: string): UseTournamentDataReturn {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshTournaments = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const apiTournaments = await tournamentService.getTournaments()
      const mappedTournaments = apiTournaments.map(tournament => 
        tournamentService.mapApiTournamentToTournament(tournament)
      )
      setTournaments(mappedTournaments)
    } catch (err) {
      console.error('Error fetching tournaments from API, falling back to mock data:', err)
      setError('No se pudieron cargar los torneos desde el servidor. Mostrando datos de ejemplo.')
      setTournaments(mockTournaments)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshTournamentData = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await tournamentService.getTournamentData(id)
      setTournamentData(data)
    } catch (err) {
      console.error('Error fetching tournament data from API, falling back to mock data:', err)
      setError('No se pudieron cargar los datos del torneo desde el servidor. Mostrando datos de ejemplo.')
      const mockData = getMockTournamentData(id)
      setTournamentData(mockData || null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tournamentId) {
      refreshTournamentData(tournamentId)
    } else {
      refreshTournaments()
    }
  }, [tournamentId, refreshTournaments, refreshTournamentData])

  return {
    tournaments,
    tournamentData,
    loading,
    error,
    refreshTournaments,
    refreshTournamentData
  }
}

export function useTournamentList() {
  const { tournaments, loading, error, refreshTournaments } = useTournamentData()
  
  return {
    tournaments,
    loading,
    error,
    refresh: refreshTournaments
  }
}

export function useTournament(id: string) {
  const { tournamentData, loading, error, refreshTournamentData } = useTournamentData(id)
  console.log(tournamentData)
  
  return {
    tournamentData,
    loading,
    error,
    refresh: () => refreshTournamentData(id)
  }
}