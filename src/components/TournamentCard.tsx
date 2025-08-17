import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { Tournament } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { getTournamentStatusColor, formatShortDate } from '../lib/utils'
import { cn } from '../lib/utils'

interface TournamentCardProps {
  tournament: Tournament
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const statusColor = getTournamentStatusColor(tournament.status)
  
  const getStatusText = (status: Tournament['status']) => {
    switch (status) {
      case 'active':
        return 'En curso'
      case 'completed':
        return 'Finalizado'
      case 'upcoming':
        return 'Próximamente'
    }
  }

  return (
    <Link to={`/tournament/${tournament.id}`}>
      <Card className="tournament-card h-full transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                {tournament.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Temporada {tournament.season}
              </p>
            </div>
            
            {tournament.logo && (
              <img 
                src={tournament.logo} 
                alt={`${tournament.name} logo`}
                className="w-12 h-12 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              statusColor
            )}>
              {getStatusText(tournament.status)}
            </span>
            
            {tournament.currentMatchday && tournament.totalMatchdays && (
              <span className="text-xs text-muted-foreground">
                J{tournament.currentMatchday}/{tournament.totalMatchdays}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Team Count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{tournament.teamCount} equipos</span>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {formatShortDate(tournament.startDate)} - {formatShortDate(tournament.endDate)}
              </span>
            </div>

            {/* Format */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="capitalize">
                {tournament.format === 'league' ? 'Liga' : 
                 tournament.format === 'knockout' ? 'Eliminación' : 
                 'Grupos + Eliminación'}
              </span>
            </div>

            {/* Description */}
            {tournament.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                {tournament.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}