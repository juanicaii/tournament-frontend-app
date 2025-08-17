import { ApiError } from '../types/api'

export class ApiClient {
  private baseURL: string
  private defaultTimeout: number = 10000

  constructor(baseURL?: string) {
    this.baseURL = baseURL || this.getBaseURL()
  }

  private getBaseURL(): string {
    return (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/public/tournaments'
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.defaultTimeout),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return response.text() as unknown as T
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new Error('La solicitud ha expirado. Por favor, intenta de nuevo.')
        }
        throw new Error(`Error de conexión: ${error.message}`)
      }
      throw new Error('Error desconocido al realizar la solicitud')
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = 'Error en la solicitud'
    
    try {
      const errorData: ApiError = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    switch (response.status) {
      case 400:
        throw new Error(`Solicitud inválida: ${errorMessage}`)
      case 404:
        throw new Error('Recurso no encontrado')
      case 500:
        throw new Error('Error interno del servidor. Por favor, intenta más tarde.')
      default:
        throw new Error(`Error ${response.status}: ${errorMessage}`)
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint
    
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

    return this.makeRequest<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' })
  }

  setTimeout(timeout: number): void {
    this.defaultTimeout = timeout
  }

  getTimeout(): number {
    return this.defaultTimeout
  }
}

export const apiClient = new ApiClient()