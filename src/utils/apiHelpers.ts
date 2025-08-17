export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'Ha ocurrido un error inesperado'
}

export function isApiError(error: unknown): error is { message: string; statusCode?: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

export function formatApiDate(dateString: string): Date {
  return new Date(dateString)
}

export function buildApiUrl(baseUrl: string, endpoint: string, params?: Record<string, string>): string {
  let url = `${baseUrl}${endpoint}`
  
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value)
      }
    })
    
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }
  
  return url
}

export function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return requestFn().catch((error) => {
    if (maxRetries > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(retryRequest(requestFn, maxRetries - 1, delay * 2))
        }, delay)
      })
    }
    throw error
  })
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('fetch') ||
     error.message.includes('network') ||
     error.message.includes('conexión') ||
     error.name === 'NetworkError')
  )
}