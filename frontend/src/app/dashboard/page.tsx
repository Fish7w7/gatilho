'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, TrendingUp, TrendingDown, Volume2, Plus, Trash2, LogOut, Target, Zap, Clock, CheckCircle2, Activity } from 'lucide-react';
import { alertsAPI, Alert, AlertStats } from '../../services/api';

const ModernDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!storedUserId || !token) {
      router.push('/login');
      return;
    }
    const id = parseInt(storedUserId);
    setUserId(id);
    loadData(id);
  }, [router]);

  const loadData = async (id: number) => {
    try {
      setLoading(true);
      const [alertsRes, historyRes, statsRes] = await Promise.all([
        alertsAPI.getActive(id),
        alertsAPI.getHistory(id),
        alertsAPI.getStats(id),
      ]);
      setAlerts(alertsRes.data);
      setHistory(historyRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (alertId: number) => {
    if (!userId || !confirm('Deseja realmente remover este alerta?')) return;
    try {
      await alertsAPI.delete(alertId, userId);
      setAlerts(alerts.filter(a => a.id !== alertId));
      if (stats) {
        setStats({ ...stats, active_alerts: stats.active_alerts - 1 });
      }
    } catch (err) {
      alert('Erro ao remover alerta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const formatValue = (alert: Alert): string => {
    if (alert.alert_type === 'price') {
      return `R$ ${alert.target_value.toFixed(2)}`;
    }
    if (alert.alert_type === 'percentage') {
      return `${alert.target_value > 0 ? '+' : ''}${alert.target_value}%`;
    }
    if (alert.alert_type === 'volume') {
      // Formata volume com separadores de milhar
      const volume = alert.target_value;
      if (volume >= 1000000) {
        return `${(volume / 1000000).toFixed(1)}M de ações`;
      }
      if (volume >= 1000) {
        return `${(volume / 1000).toFixed(0)}K de ações`;
      }
      return `${volume.toLocaleString('pt-BR')} ações`;
    }
    return alert.target_value.toLocaleString('pt-BR');
  };

  const getConditionText = (condition: string): string => {
    const conditionMap: Record<string, string> = {
      '>': 'Subir acima de',
      '<': 'Cair abaixo de',
      '>=': 'Atingir ou superar',
      '<=': 'Atingir ou cair para'
    };
    return conditionMap[condition] || condition;
  };

  const getAlertTypeText = (type: string): string => {
    const typeMap: Record<string, string> = {
      'price': 'Preço Alvo',
      'percentage': 'Variação Diária',
      'volume': 'Volume'
    };
    return typeMap[type] || type;
  };

  const StockCard = ({ alert, isHistory = false }: { alert: Alert; isHistory?: boolean }) => {
    const isPositive = alert.condition === '>' || alert.condition === '>=';
    
    return (
      <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
        isHistory 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' 
          : 'bg-gradient-to-br from-slate-900 to-black border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20'
      }`}>
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                isPositive 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                  : 'bg-gradient-to-br from-red-500 to-rose-600'
              } shadow-lg`}>
                {isPositive ? (
                  <TrendingUp className="w-7 h-7 text-white" />
                ) : (
                  <TrendingDown className="w-7 h-7 text-white" />
                )}
              </div>
              
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">{alert.ticker}</h3>
                <p className="text-slate-400 text-sm mt-0.5">
                  {getAlertTypeText(alert.alert_type)}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            {isHistory ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disparado
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Ativo
                </span>
                <button 
                  onClick={() => handleDelete(alert.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Valor Alvo */}
          <div className="mb-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 mb-2">CONDIÇÃO CONFIGURADA</p>
            <div className="space-y-1">
              <p className="text-lg font-bold text-indigo-400">{getConditionText(alert.condition)}</p>
              <p className="text-2xl font-black text-white">{formatValue(alert)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(alert.created_at).toLocaleDateString('pt-BR')}
            </span>
            {alert.triggered_at && (
              <span className="text-indigo-400 font-semibold">
                ⚡ {new Date(alert.triggered_at).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-semibold">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Header fixo */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Gatilho
                </h1>
                <p className="text-xs text-slate-500">Alertas Inteligentes</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800/50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-semibold text-sm">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-emerald-400 text-3xl font-black">{stats.active_alerts}</span>
              </div>
              <p className="text-slate-400 text-sm font-semibold">Alertas Ativos</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-indigo-400 text-3xl font-black">{stats.triggered_alerts}</span>
              </div>
              <p className="text-slate-400 text-sm font-semibold">Disparados</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-purple-400 text-3xl font-black">{stats.total_tickers}</span>
              </div>
              <p className="text-slate-400 text-sm font-semibold">Ações Únicas</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-amber-400 text-3xl font-black">{stats.total_alerts}</span>
              </div>
              <p className="text-slate-400 text-sm font-semibold">Total Criados</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-black text-white mb-2">Meus Alertas</h2>
            <p className="text-slate-400">Monitore suas ações favoritas em tempo real</p>
          </div>
          
          <Link href="/alerts/new">
            <button className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Novo Alerta
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-900/50 border border-slate-800 rounded-xl p-1.5 w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            Ativos
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">{alerts.length}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Histórico
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">{history.length}</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum alerta ativo</h3>
                <p className="text-slate-400 mb-6">Crie seu primeiro alerta para começar</p>
                <Link href="/alerts/new">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
                    <Plus className="w-5 h-5" />
                    Criar Alerta
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {alerts.map(alert => <StockCard key={alert.id} alert={alert} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum histórico</h3>
                <p className="text-slate-400">Alertas disparados aparecerão aqui</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {history.map(alert => <StockCard key={alert.id} alert={alert} isHistory />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard;