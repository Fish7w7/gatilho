'use client';
import { useEffect, useState } from 'react';
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
}

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      router.push('/login');
      return;
    }

    fetchAlerts(userId, token);
  }, [router]);

  const fetchAlerts = async (userId: string, token: string) => {
    try {
      // SEM barra no final da URL
      const res = await fetch(`http://localhost:8000/api/alerts?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Erro ao carregar alertas');
      }
      
      const data = await res.json();
      setAlerts(data);
      setError('');
    } catch (error: any) {
      console.error('Erro:', error);
      setError(error.message || 'Erro ao carregar alertas');
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
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Erro ao excluir alerta');
      }
      
      setAlerts(alerts.filter(a => a.id !== alertId));
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

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="flex justify-between items-center mb-8">
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 mt-4">Carregando alertas...</p>
          </div>
        ) : alerts.length === 0 ? (
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
                      <span className="text-2xl font-bold text-gray-900">
                        {alert.ticker}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.triggered 
                          ? 'bg-red-100 text-red-700' 
                          : alert.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {alert.triggered ? '🔔 Disparado' : alert.is_active ? '✅ Ativo' : '⏸️ Pausado'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600">
                      <span className="font-medium">{getAlertTypeLabel(alert.alert_type)}</span>
                      {' '}{alert.condition}{' '}
                      {alert.alert_type === 'price' && 'R$ '}
                      {alert.target_value}
                      {alert.alert_type === 'percentage' && '%'}
                    </p>
                    
                    <p className="text-sm text-gray-400 mt-2">
                      Criado em {new Date(alert.created_at).toLocaleDateString('pt-BR')}
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
      </div>
    </div>
  );
}