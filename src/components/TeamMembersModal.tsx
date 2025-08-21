import { X, User, Calendar, Trophy, Target, Square } from 'lucide-react'
import { Team } from '../types/tournament'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface TeamMembersModalProps {
  team: Team | null
  isOpen: boolean
  onClose: () => void
}

export default function TeamMembersModal({ team, isOpen, onClose }: TeamMembersModalProps) {
  if (!isOpen || !team) return null

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatJoinDate = (joinedAt: string) => {
    return new Date(joinedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: team.colors.primary }}
            >
              {team.shortName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{team.name}</h2>
              <p className="text-muted-foreground">
                {team.membersCount || team.members?.length || 0} miembros registrados
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {team.members && team.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members.map((member) => {
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: team.colors.primary }}
                          >
                            {member.tshirtNumber || '?'}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{member.fullName}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {member.firstName} {member.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Personal Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {member.dateOfBirth ? `${calculateAge(member.dateOfBirth)} años` : 'Edad no disponible'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs">
                              Desde {formatJoinDate(member.joinedAt)}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="border-t pt-3">
                          <h4 className="font-semibold text-sm mb-2 flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            Estadísticas de la temporada
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center">
                                <Target className="w-3 h-3 mr-1 text-green-600" />
                                Goles
                              </span>
                              <span className="font-semibold">{member.goals}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center">
                                <Square className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-400" />
                                Amarillas
                              </span>
                              <span className="font-semibold">{member.yellowCards}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center">
                                <Square className="w-3 h-3 mr-1 text-red-600 fill-red-500" />
                                Rojas
                              </span>
                              <span className="font-semibold">{member.redCards}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay miembros registrados</h3>
              <p className="text-muted-foreground">
                Este equipo aún no tiene jugadores registrados en el sistema.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}