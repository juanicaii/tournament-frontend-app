import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Heart, Settings, Trophy, Calendar, BarChart3, Users } from 'lucide-react'
import { cn } from '../lib/utils'

const globalNavItems = [
  {
    to: '/',
    icon: Home,
    label: 'Inicio'
  },
  {
    to: '/search',
    icon: Search,
    label: 'Buscar'
  },
  {
    to: '/favorites',
    icon: Heart,
    label: 'Favoritos'
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Configuración'
  }
]

const tournamentNavItems = [
  {
    tab: 'standings',
    icon: Trophy,
    label: 'Posiciones'
  },
  {
    tab: 'matches',
    icon: Calendar,
    label: 'Partidos'
  },
  {
    tab: 'players',
    icon: BarChart3,
    label: 'Estadísticas'
  },
  {
    tab: 'teams',
    icon: Users,
    label: 'Equipos'
  }
]

function GlobalBottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden pwa-bottom-nav">
      <div className="grid grid-cols-4 h-16">
        {globalNavItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || 
            (to !== '/' && location.pathname.startsWith(to))
          
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                isActive 
                  ? "text-brand-primary bg-brand-extended-greenLighter/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-brand-primary")} />
              <span className={cn(isActive && "text-brand-primary font-medium")}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function TournamentBottomNav({ tournamentId, currentTab }: { tournamentId: string; currentTab: string }) {
  const navigate = useNavigate()

  const handleTabChange = (tab: string) => {
    navigate(`/tournament/${tournamentId}/${tab}`)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden pwa-bottom-nav h-24 pt-2">
      <div className="grid grid-cols-4 h-16">
        {tournamentNavItems.map(({ tab, icon: Icon, label }) => {
          const isActive = currentTab === tab
          
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                isActive 
                  ? "text-brand-primary bg-brand-extended-greenLighter/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-brand-primary")} />
              <span className={cn(isActive && "text-brand-primary font-medium")}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function BottomNav() {
  const location = useLocation()
  
  // No mostrar BottomNav en la página de inicio
  if (location.pathname === '/') {
    return null
  }
  
  // Detectar si estamos en página de torneo
  const tournamentMatch = location.pathname.match(/^\/tournament\/([^\/]+)(?:\/([^\/]+))?/)
  const isInTournament = !!tournamentMatch
  const tournamentId = tournamentMatch?.[1]
  const currentTab = tournamentMatch?.[2] || 'standings'

  if (isInTournament && tournamentId) {
    return <TournamentBottomNav tournamentId={tournamentId} currentTab={currentTab} />
  }

  return <GlobalBottomNav />
}