import * as Avatar from '@radix-ui/react-avatar'
import { cn } from '../lib/utils'
import { Team } from '../types/tournament'

interface TeamAvatarProps {
  team?: Team
  teamName?: string
  teamId?: string | number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showName?: boolean
}

const sizeClasses = {
  xs: 'w-4 h-4 text-xs',
  sm: 'w-5 h-5 text-xs',
  md: 'w-6 h-6 text-xs',
  lg: 'w-8 h-8 text-xs',
  xl: 'w-12 h-12 text-sm'
}

function getTeamInitials(name?: string, teamId?: string | number): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(' ')
    const initials = (parts[0][0] || '') + (parts[1]?.[0] || '')
    return initials.toUpperCase()
  }
  return teamId ? `T${String(teamId).slice(-1)}` : 'T?'
}

export default function TeamAvatar({ 
  team, 
  teamName, 
  teamId, 
  size = 'md', 
  className, 
  showName = false 
}: TeamAvatarProps) {
  const name = team?.name || teamName
  const id = team?.id || teamId
  const logo = team?.logo
  const primaryColor = team?.colors?.primary || '#666'
  
  const initials = getTeamInitials(name, id)
  const sizeClass = sizeClasses[size]

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Avatar.Root className={cn(sizeClass, 'rounded-full overflow-hidden')}>
        {logo && (
          <Avatar.Image
            src={logo}
            alt={`${name} logo`}
            className="w-full h-full object-cover"
          />
        )}
        <Avatar.Fallback
          className="w-full h-full flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {initials}
        </Avatar.Fallback>
      </Avatar.Root>
      
      {showName && name && (
        <span className="font-medium truncate">{name}</span>
      )}
    </div>
  )
}