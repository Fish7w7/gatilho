import React, { useState } from 'react';
import { Bell, TrendingUp, Volume2, Plus, Trash2, History, LogOut, AlertCircle, CheckCircle, Clock, BarChart3, Target, DollarSign, Percent } from 'lucide-react';
import { Alert, AlertType, AlertTypeConfig, AlertHistory, AlertStats } from '../../types';
import { getColorClasses } from '../../utils/colors';

// Mock data para demonstração
const mockStats: AlertStats = {
  total_alerts: 12,
  active_alerts: 8,
  triggered_alerts: 4,
  total_tickers: 6
};

const mockAlerts: Alert[] = [
  {
    id: 1,
    ticker: "PETR4",
    alertType: "price",
    targetValue: 42.50,
    condition: ">",
    isActive: true,
    triggered: false,
    createdAt: new Date().toISOString(),
    currentPrice: 41.80
  },
  {
    id: 2,
    ticker: "VALE3",
    alertType: "percentage",
    targetValue: -5,
    condition: "<",
    isActive: true,
    triggered: false,
    createdAt: new Date().toISOString(),
    currentChange: -2.3
  },
  {
    id: 3,
    ticker: "BBDC4",
    alertType: "volume",
    targetValue: 1000000,
    condition: ">",
    isActive: true,
    triggered: false,
    createdAt: new Date().toISOString(),
    currentVolume: 850000
  }
];

const mockHistory: AlertHistory[] = [
  {
    id: 4,
    ticker: "ITUB4",
    alertType: "price",
    targetValue: 28.50,
    condition: ">",
    isActive: false,
    triggered: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    triggeredAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 5,
    ticker: "MGLU3",
    alertType: "percentage",
    targetValue: 8,
    condition: ">",
    isActive: false,
    triggered: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    triggeredAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const GatilhoDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [alerts, setAlerts] = useState(mockAlerts);
  const [history, setHistory] = useState(mockHistory);
  const [stats, setStats] = useState(mockStats);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);

  const getAlertTypeConfig = (type: AlertType): AlertTypeConfig => {
    const configs: Record<AlertType, AlertTypeConfig> = {
      price: {
        icon: DollarSign, // Alterado para DollarSign para ser mais específico
        label: 'Preço',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        emoji: '💰'
      },
      percentage: {
        icon: Percent, // Alterado para Percent para ser mais específico
        label: 'Variação',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        emoji: '📊'
      },
      volume: {
        icon: Volume2,
        label: 'Volume',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        emoji: '📈'
      }
    };
    return configs[type];
  };

  const formatValue = (alert: Alert | AlertHistory): string => {
    if (alert.alertType === 'price') {
      return `R$ ${alert.targetValue.toFixed(2)}`;
    } else if (alert.alertType === 'percentage') {
      return `${alert.targetValue > 0 ? '+' : ''}${alert.targetValue}%`;
    } else {
      return alert.targetValue.toLocaleString('pt-BR');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const AlertCard = ({ alert, isHistory = false }: { alert: Alert | AlertHistory, isHistory?: boolean }) => {
    const config = getAlertTypeConfig(alert.alertType);
    const Icon = config.icon;

    return (
      <div className={`group bg-white rounded-2xl p-6 border-2 ${
        isHistory ? 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30' : 'border-gray-100 hover:border-indigo-200'
      } transition-all duration-300 hover:shadow-xl`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`${config.bgColor} ${config.color} p-3 rounded-xl`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-900">{alert.ticker}</h3>
                {isHistory ? (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    <CheckCircle className="w-3 h-3" />
                    Disparado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    <Bell className="w-3 h-3" />
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{config.label}</p>
            </div>
          </div>
          
          {!isHistory && (
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-600">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-gray-600">Alvo:</span>
            <span className="text-lg font-bold text-gray-900">
              {alert.condition} {formatValue(alert)}
            </span>
          </div>

          {'currentPrice' in alert && alert.currentPrice !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-600">Atual:</span>
              <span className="text-lg font-semibold text-gray-700">
                R$ {alert.currentPrice.toFixed(2)}
              </span>
            </div>
          )}

          {'currentChange' in alert && alert.currentChange !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-600">Variação:</span>
              <span className={`text-lg font-semibold ${alert.currentChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {alert.currentChange > 0 ? '+' : ''}{alert.currentChange}%
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(alert.createdAt)}
            </span>
            {'triggeredAt' in alert && alert.triggeredAt && (
              <span className="text-indigo-600 font-medium">
                Disparado: {formatDate(alert.triggeredAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gatilho
              </h1>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-emerald-100 text-sm font-medium">Ativos</p>
              <CheckCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <p className="text-4xl font-bold">{stats.active_alerts}</p>
            <p className="text-emerald-100 text-xs mt-1">alertas monitorando</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-indigo-100 text-sm font-medium">Disparados</p>
              <Bell className="w-5 h-5 text-indigo-200" />
            </div>
            <p className="text-4xl font-bold">{stats.triggered_alerts}</p>
            <p className="text-indigo-100 text-xs mt-1">alertas acionados</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">Ações</p>
              <TrendingUp className="w-5 h-5 text-purple-200" />
            </div>
            <p className="text-4xl font-bold">{stats.total_tickers}</p>
            <p className="text-purple-100 text-xs mt-1">ativos diferentes</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-amber-100 text-sm font-medium">Total</p>
              <BarChart3 className="w-5 h-5 text-amber-200" />
            </div>
            <p className="text-4xl font-bold">{stats.total_alerts}</p>
            <p className="text-amber-100 text-xs mt-1">alertas criados</p>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Meus Alertas</h2>
            <p className="text-gray-600 mt-1">Configure e gerencie alertas para suas ações favoritas</p>
          </div>
          
          <button 
            onClick={() => setShowNewAlertModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Novo Alerta
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-all ${
              activeTab === 'active'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            Ativos
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {alerts.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-all ${
              activeTab === 'history'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History className="w-4 h-4" />
            Histórico
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {history.length}
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum alerta ativo
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando seu primeiro alerta para monitorar ações
                </p>
                <button 
                  onClick={() => setShowNewAlertModal(true)}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeiro Alerta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {alerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum histórico ainda
                </h3>
                <p className="text-gray-500">
                  Quando seus alertas forem disparados, eles aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {history.map(alert => (
                  <AlertCard key={alert.id} alert={alert} isHistory />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal "Novo Alerta" - apenas placeholder visual */}
      {showNewAlertModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Novo Alerta</h3>
            <p className="text-gray-600 mb-6">
              Use a página /alerts/new no projeto real para criar alertas
            </p>
            <button
              onClick={() => setShowNewAlertModal(false)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatilhoDashboard;