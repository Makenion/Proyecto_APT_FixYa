import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  
  if (diffInSeconds < 5) {
    return 'Ahora mismo'
  } else if (diffInSeconds < 60) {
    return `Hace ${diffInSeconds} segundos`
  } else if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  } else if (diffInWeeks < 4) {
    return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('es-CL')
  }
}