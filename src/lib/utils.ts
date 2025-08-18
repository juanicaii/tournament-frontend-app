import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

export function calculateGoalDifference(goalsFor: number, goalsAgainst: number): number {
  return goalsFor - goalsAgainst
}

export function calculatePoints(wins: number, draws: number): number {
  return wins * 3 + draws
}

export function getTeamFormColor(result: 'W' | 'D' | 'L'): string {
  switch (result) {
    case 'W':
      return 'bg-brand-victory text-white'
    case 'D':
      return 'bg-brand-draw text-white'
    case 'L':
      return 'bg-brand-defeat text-white'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getTournamentStatusColor(status: 'active' | 'completed' | 'upcoming'): string {
  switch (status) {
    case 'active':
      return 'bg-brand-success text-white'
    case 'completed':
      return 'bg-muted text-muted-foreground'
    case 'upcoming':
      return 'bg-brand-warning text-black'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}