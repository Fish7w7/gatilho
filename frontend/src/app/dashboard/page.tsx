'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, TrendingUp, TrendingDown, Plus, Trash2, Target, Zap, Clock, CheckCircle2, Activity, Sparkles, DollarSign, Percent, Volume2, Search, Star, User, ChevronDown, X, Settings, LogOut, Shield, Crown } from 'lucide-react';
import { alertsAPI, Alert, AlertStats } from '../../services/api';

// Componente de Notificações
const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, ticker: 'VALE3', message: 'Atingiu R$ 65,50', time: '2 min', read: false },
    { id: 2, ticker: 'PETR4', message: 'Variou +3.2%', time: '1h', read: false },
    { id: 3, ticker: 'ITUB4', message: 'Volume acima da média', time: '3h', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-all">
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-bold">Notificações</h3>
              <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 hover:bg-slate-800/50 ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{n.ticker}</p>
                      <p className="text-sm text-slate-300">{n.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{n.time} atrás</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Componente de Perfil
const ProfilePanel = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-xl transition-all">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
          U
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-white">Usuário</p>
          <p className="text-xs text-slate-400">Plano Free</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-14 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50">
            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-b border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  U
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Usuário</h3>
                  <p className="text-slate-400 text-sm">user@email.com</p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />Upgrade Premium
              </button>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-all">
                <Settings className="w-5 h-5 text-slate-400" />
                <span className="text-white font-semibold text-sm">Configurações</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-all">
                <Shield className="w-5 h-5 text-slate-400" />
                <span className="text-white font-semibold text-sm">Privacidade</span>
              </button>
              <div className="my-2 border-t border-slate-800"></div>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-all group">
                <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                <span className="text-white font-semibold text-sm group-hover:text-red-400">Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Dashboard Principal
export default function EnhancedDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showQuickActions, setShowQuickActions] = useState(true);
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
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (alertId: number) => {
    if (!userId || !confirm('Remover este alerta?')) return;
    try {
      await alertsAPI.delete(alertId, userId);
      setAlerts(alerts.filter(a => a.id !== alertId));
      if (stats) setStats({ ...stats, active_alerts: stats.active_alerts - 1 });
    } catch (err) {
      alert('Erro ao remover');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const formatValue = (alert: Alert): string => {
    if (alert.alert_type === 'price') return `R$ ${alert.target_value.toFixed(2)}`;
    if (alert.alert_type === 'percentage') return `${alert.target_value}%`;
    return alert.target_value.toLocaleString();
  };

  const getConditionText = (c: string) => {
    const m: Record<string, string> = { '>': 'Subir acima de', '<': 'Cair abaixo de', '>=': 'Atingir', '<=': 'Cair para' };
    return m[c] || c;
  };

  const getTypeInfo = (type: string) => {
    const t: Record<string, any> = {
      price: { label: 'Preço', icon: DollarSign },
      percentage: { label: 'Variação', icon: Percent },
      volume: { label: 'Volume', icon: Volume2 }
    };
    return t[type] || t.price;
  };

  const filtered = (activeTab === 'active' ? alerts : history).filter(a => {
    const s = a.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const f = filterType === 'all' || a.alert_type === filterType;
    return s && f;
  });

  const AlertCard = ({ alert, isHistory = false }: { alert: Alert; isHistory?: boolean }) => {
    const isPos = alert.condition === '>' || alert.condition === '>=';
    const info = getTypeInfo(alert.alert_type);
    const Icon = info.icon;

    return (
      <div className="group relative rounded-2xl border border-slate-700 bg-slate-900/90 hover:border-indigo-500/50 p-6 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isPos ? 'bg-emerald-500' : 'bg-red-500'}`}>
              {isPos ? <TrendingUp className="w-7 h-7 text-white" /> : <TrendingDown className="w-7 h-7 text-white" />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{alert.ticker}</h3>
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-xs text-slate-400">{info.label}</p>
              </div>
            </div>
          </div>
          {!isHistory && (
            <button onClick={() => handleDelete(alert.id)} className="p-2 hover:bg-red-500/10 rounded-lg">
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
            </button>
          )}
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">CONDIÇÃO</p>
          <p className="text-sm font-bold text-indigo-400 mb-2">{getConditionText(alert.condition)}</p>
          <p className="text-xl font-black text-white">{formatValue(alert)}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Gatilho</h1>
                <p className="text-xs text-slate-500">Alertas Inteligentes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationPanel />
              <ProfilePanel onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Zap, label: 'Ativos', value: stats.active_alerts, color: 'emerald' },
              { icon: Bell, label: 'Disparados', value: stats.triggered_alerts, color: 'indigo' },
              { icon: TrendingUp, label: 'Ações', value: stats.total_tickers, color: 'purple' },
              { icon: Target, label: 'Total', value: stats.total_alerts, color: 'amber' }
            ].map((s, i) => (
              <div key={i} className={`bg-${s.color}-500/10 border border-${s.color}-500/20 rounded-2xl p-6 hover:scale-105 transition-transform`}>
                <div className="flex justify-between items-center">
                  <s.icon className={`w-6 h-6 text-${s.color}-400`} />
                  <span className={`text-3xl font-black text-${s.color}-400`}>{s.value}</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {showQuickActions && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8 relative">
            <button onClick={() => setShowQuickActions(false)} className="absolute top-4 right-4 text-slate-500">✕</button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />Ações Rápidas
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: DollarSign, title: 'Preço', color: 'emerald' },
                { icon: Percent, title: 'Variação', color: 'amber' },
                { icon: Volume2, title: 'Volume', color: 'purple' }
              ].map((a, i) => (
                <Link key={i} href="/alerts/new" className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl">
                  <div className={`w-10 h-10 bg-${a.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <a.icon className={`w-5 h-5 text-${a.color}-400`} />
                  </div>
                  <p className="font-bold text-white">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black">Meus Alertas</h2>
            <p className="text-slate-400">Monitore em tempo real</p>
          </div>
          <Link href="/alerts/new">
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">
              <Plus className="w-5 h-5" />Novo Alerta
            </button>
          </Link>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
            />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none">
            <option value="all">Todos</option>
            <option value="price">Preço</option>
            <option value="percentage">Variação</option>
            <option value="volume">Volume</option>
          </select>
        </div>

        <div className="flex gap-2 mb-6">
          {['active', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-slate-800/50 text-slate-400'
              }`}
            >
              {tab === 'active' ? 'Ativos' : 'Histórico'} ({filtered.length})
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Nenhum alerta</h3>
              <Link href="/alerts/new">
                <button className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold">
                  Criar Alerta
                </button>
              </Link>
            </div>
          ) : (
            filtered.map(a => <AlertCard key={a.id} alert={a} isHistory={activeTab === 'history'} />)
          )}
        </div>
      </div>
    </div>
  );
}