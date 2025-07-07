import axios from 'axios'
import { logger } from './logger'
import { errorHandler } from './errorHandler'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Log API requests in development
  if (import.meta.env.DEV) {
    logger.debug('API Request', { 
      method: config.method?.toUpperCase(), 
      url: config.url, 
      baseURL: config.baseURL 
    })
  }
  
  return config
})

// Handle auth errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      logger.debug('API Response', { 
        status: response.status, 
        url: response.config.url,
        method: response.config.method?.toUpperCase()
      })
    }
    return response
  },
  (error) => {
    // Log API errors
    logger.error('API Error', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      response: error.response?.data
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (data: any) =>
    api.post('/auth/register', data),
  validateToken: () =>
    api.get('/auth/validate'),
  getProfile: () =>
    api.get('/auth/profile'),
}

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

// Matters API
export const mattersApi = {
  getAll: () => api.get('/matters'),
  getById: (id: string) => api.get(`/matters/${id}`),
  create: (data: any) => api.post('/matters', data),
  update: (id: string, data: any) => api.patch(`/matters/${id}`, data),
  delete: (id: string) => api.delete(`/matters/${id}`),
  getStatistics: () => api.get('/matters/statistics'),
  getByClient: (clientName: string) => api.get(`/matters/client/${clientName}`),
  getByStatus: (status: string) => api.get(`/matters/status/${status}`),
}

// Contracts API
export const contractsApi = {
  getAll: () => api.get('/contracts'),
  getById: (id: string) => api.get(`/contracts/${id}`),
  create: (data: any) => api.post('/contracts', data),
  update: (id: string, data: any) => api.patch(`/contracts/${id}`, data),
  delete: (id: string) => api.delete(`/contracts/${id}`),
}

// AI API
export const aiApi = {
  chat: (message: string, context?: string) =>
    api.post('/ai/chat', { message, context }),
  legalResearch: (query: string, jurisdiction?: string, keywords?: string[]) =>
    api.post('/ai/research', { query, jurisdiction, keywords }),
  analyzeContract: (contractText: string, contractType?: string) =>
    api.post('/ai/analyze-contract', { contractText, contractType }),
  generateDocument: (documentType: string, parameters: any) =>
    api.post('/ai/generate-document', { documentType, parameters }),
  summarizeText: (text: string) =>
    api.post('/ai/summarize', { text }),
  extractKeyTerms: (text: string) =>
    api.post('/ai/extract-terms', { text }),
  assessRisk: (content: string, type: 'contract' | 'matter' | 'general') =>
    api.post('/ai/assess-risk', { content, type }),
}

export default api