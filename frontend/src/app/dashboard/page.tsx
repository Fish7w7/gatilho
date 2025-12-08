'use client';
'use client';

import React, { useState } from 'react';ct';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Alert {
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

interface Stats {
  total_alerts: number;
  active_alerts: number;
  triggered_alerts: number;
  total_tickers: number;
}

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<Alert[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      router.push('/login');
      return;
    }

    fetchData(userId, token);
  }, [router]);

  const fetchData = async (userId: string, token: string) => {
    try {
      // Busca alertas ativos
      const alertsRes = await fetch(`http://localhost:8000/api/alerts?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!alertsRes.ok) throw new Error('Erro ao carregar alertas');
      const alertsData = await alertsRes.json();
      setAlerts(alertsData);

      // Busca histórico
      const historyRes = await fetch(`http://localhost:8000/api/alerts/history?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }

      // Busca estatísticas
      const statsRes = await fetch(`http://localhost:8000/api/alerts/stats?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      setError('');
    } catch (error: any) {
      console.error('Erro:', error);
      setError(error.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (alertId: number) => {
    if (!confirm('Deseja realmente excluir este alerta?')) return;
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    try {
      const res = await fetch(`http://localhost:8000/api/alerts/${alertId}?user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Erro ao excluir alerta');
      
      setAlerts(alerts.filter(a => a.id !== alertId));
      
      // Atualiza stats
      if (stats) {
        setStats({
          ...stats,
          active_alerts: stats.active_alerts - 1,
          total_alerts: stats.total_alerts - 1
        });
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir alerta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'price': 'Preço',
      'percentage': 'Variação %',
      'volume': 'Volume'
    };
    return labels[type] || type;
  };

  const getAlertTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'price': '💰',
      'percentage': '📊',
      'volume': '📈'
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600">🔔 Gatilho</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alertas Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active_alerts}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disparados</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.triggered_alerts}</p>
                </div>
                <div className="text-4xl">🔔</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ações</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.total_tickers}</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total_alerts}</p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
            </div>
          </div>
        )}

        {/* Header com Botão */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Meus Alertas</h2>
            <p className="text-gray-600 mt-1">Gerencie seus alertas de ações</p>
          </div>
          
          <Link href="/alerts/new" className="btn-primary">
            + Novo Alerta
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'active'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ativos ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Histórico ({history.length})
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 mt-4">Carregando alertas...</p>
          </div>
        ) : (
          <>
            {/* Tab Content: Alertas Ativos */}
            {activeTab === 'active' && (
              <>
                {alerts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg mb-4">
                      Você ainda não tem alertas configurados
                    </p>
                    <Link href="/alerts/new" className="btn-secondary inline-block">
                      Criar Primeiro Alerta
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">{getAlertTypeIcon(alert.alert_type)}</span>
                              <span className="text-2xl font-bold text-gray-900">
                                {alert.ticker}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                ✅ Ativo
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">{getAlertTypeLabel(alert.alert_type)}</span>
                              {' '}{alert.condition}{' '}
                              {alert.alert_type === 'price' && 'R$ '}
                              {alert.target_value}
                              {alert.alert_type === 'percentage' && '%'}
                            </p>
                            
                            <p className="text-sm text-gray-400">
                              Criado em {formatDate(alert.created_at)}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(alert.id)}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Tab Content: Histórico */}
            {activeTab === 'history' && (
              <>
                {history.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="text-6xl mb-4">📜</div>
                    <p className="text-gray-500 text-lg mb-2">
                      Nenhum alerta disparado ainda
                    </p>
                    <p className="text-sm text-gray-400">
                      Quando seus alertas forem disparados, eles aparecerão aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-600"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">{getAlertTypeIcon(alert.alert_type)}</span>
                              <span className="text-2xl font-bold text-gray-900">
                                {alert.ticker}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                🔔 Disparado
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">{getAlertTypeLabel(alert.alert_type)}</span>
                              {' '}{alert.condition}{' '}
                              {alert.alert_type === 'price' && 'R$ '}
                              {alert.target_value}
                              {alert.alert_type === 'percentage' && '%'}
                            </p>
                            
                            <div className="flex gap-4 text-sm text-gray-400">
                              <p>Criado: {formatDate(alert.created_at)}</p>
                              {alert.triggered_at && (
                                <p className="text-indigo-600 font-medium">
                                  Disparado: {formatDate(alert.triggered_at)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}