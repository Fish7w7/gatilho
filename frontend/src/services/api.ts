// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuração do axios com interceptor para adicionar token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface Alert {
  id: number;
  ticker: string;
  alert_type: string;
  target_value: number;
  condition: string;
  is_active: boolean;
  triggered: boolean;
  created_at: string;
  triggered_at?: string;
}

export interface AlertStats {
  total_alerts: number;
  active_alerts: number;
  triggered_alerts: number;
  total_tickers: number;
}

export interface CreateAlertPayload {
  user_id: number;
  ticker: string;
  alert_type: string;
  target_value: number;
  condition: string;
}

// Auth
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  signup: (name: string, email: string, password: string) => 
    api.post('/auth/signup', { name, email, password }),
};

// Alerts
export const alertsAPI = {
  // Listar alertas ativos
  getActive: (userId: number) => 
    api.get<Alert[]>('/alerts', { params: { user_id: userId, active_only: true } }),
  
  // Listar todos os alertas
  getAll: (userId: number) => 
    api.get<Alert[]>('/alerts', { params: { user_id: userId, active_only: false } }),
  
  // Histórico de alertas disparados
  getHistory: (userId: number) => 
    api.get<Alert[]>('/alerts/history', { params: { user_id: userId } }),
  
  // Estatísticas
  getStats: (userId: number) => 
    api.get<AlertStats>('/alerts/stats', { params: { user_id: userId } }),
  
  // Criar novo alerta
  create: (payload: CreateAlertPayload) => 
    api.post<Alert>('/alerts', payload),
  
  // Deletar alerta
  delete: (alertId: number, userId: number) => 
    api.delete(`/alerts/${alertId}`, { params: { user_id: userId } }),
};

export default api;