import { useState } from 'react'
import {  Home, Search, Users } from 'lucide-react'
import { Team } from '../types/tournament'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import TeamAvatar from './TeamAvatar'
import TeamMembersModal from './TeamMembersModal'

interface TeamsGridProps {
  teams: Team[]
}

export default function TeamsGrid({ teams }: TeamsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy] = useState<'name' | 'city' | 'founded'>('name')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openTeamModal = (team: Team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const closeTeamModal = () => {
    setSelectedTeam(null)
    setIsModalOpen(false)
  }

  const filteredAndSortedTeams = teams
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'city':
          return (a.city || '').localeCompare(b.city || '')
        case 'founded':
          return (b.founded || 0) - (a.founded || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

          
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTeams.map((team) => (
          <Card key={team.id} className="tournament-card">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <TeamAvatar team={team} size="xl" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {team.name}
                  </CardTitle>
                 
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                
                

              

                
         

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openTeamModal(team)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Miembros {team.membersCount}
                  </Button>
                </div>


              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedTeams.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron equipos</h3>
            <p className="text-muted-foreground">
              Intenta ajustar tu búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Teams Count */}
      <div className="text-center text-sm text-muted-foreground">
        Mostrando {filteredAndSortedTeams.length} de {teams.length} equipos
      </div>

      {/* Team Members Modal */}
      <TeamMembersModal 
        team={selectedTeam}
        isOpen={isModalOpen}
        onClose={closeTeamModal}
      />
    </div>
  )
}