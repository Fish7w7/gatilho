'use client';
import React, { useState, useEffect } from 'react';
import { 
  Bell, X, CheckCircle2, TrendingUp, TrendingDown, Clock, 
  Trash2, Archive, Filter, Check, AlertCircle, Volume2, 
  DollarSign, Percent, Star, Eye, Settings 
} from 'lucide-react';

interface Notification {
  id: number;
  ticker: string;
  message: string;
  timestamp: string;
  type: 'price' | 'percentage' | 'volume' | 'info';
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  starred: boolean;
  alertType: string;
  value: string;
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      ticker: 'VALE3',
      message: 'Atingiu o preço alvo de R$ 65,50',
      timestamp: '2 minutos atrás',
      type: 'price',
      priority: 'high',
      read: false,
      starred: false,
      alertType: 'Preço Alvo',
      value: 'R$ 65,50'
    },
    {
      id: 2,
      ticker: 'PETR4',
      message: 'Variação de +3.2% detectada',
      timestamp: '1 hora atrás',
      type: 'percentage',
      priority: 'medium',
      read: false,
      starred: true,
      alertType: 'Variação',
      value: '+3.2%'
    },
    {
      id: 3,
      ticker: 'ITUB4',
      message: 'Volume acima da média',
      timestamp: '3 horas atrás',
      type: 'volume',
      priority: 'medium',
      read: true,
      starred: false,
      alertType: 'Volume',
      value: '2.5M'
    },
    {
      id: 4,
      ticker: 'BBDC4',
      message: 'Atingiu suporte em R$ 14,20',
      timestamp: '5 horas atrás',
      type: 'price',
      priority: 'high',
      read: true,
      starred: false,
      alertType: 'Preço Alvo',
      value: 'R$ 14,20'
    },
    {
      id: 5,
      ticker: 'MGLU3',
      message: 'Caiu -5.1% no dia',
      timestamp: '1 dia atrás',
      type: 'percentage',
      priority: 'high',
      read: true,
      starred: false,
      alertType: 'Variação',
      value: '-5.1%'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const starredCount = notifications.filter(n => n.starred).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const toggleStar = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    if (confirm('Deseja limpar todas as notificações?')) {
      setNotifications([]);
    }
  };

  const getIcon = (type: string, priority: string) => {
    const iconClass = "w-5 h-5";
    if (type === 'price') return <DollarSign className={`${iconClass} text-emerald-400`} />;
    if (type === 'percentage') return <Percent className={`${iconClass} text-amber-400`} />;
    if (type === 'volume') return <Volume2 className={`${iconClass} text-purple-400`} />;
    return <Bell className={`${iconClass} text-indigo-400`} />;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-red-500/50 bg-red-500/5';
    if (priority === 'medium') return 'border-amber-500/50 bg-amber-500/5';
    return 'border-slate-700 bg-slate-800/30';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'starred') return n.starred;
    return true;
  });

  return (
    <div className="relative">
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-all group"
      >
        <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center px-1.5 text-xs font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-12 w-[420px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-white font-bold">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${showFilters ? 'bg-slate-800' : ''}`}
                  >
                    <Filter className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="flex gap-2 mb-3">
                  {[
                    { value: 'all', label: 'Todas', count: notifications.length },
                    { value: 'unread', label: 'Não lidas', count: unreadCount },
                    { value: 'starred', label: 'Favoritas', count: starredCount }
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value as any)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        filter === f.value
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {f.label} ({f.count})
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              {unreadCount > 0 && (
                <div className="flex gap-2">
                  <button 
                    onClick={markAllAsRead}
                    className="flex-1 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-xs text-indigo-400 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Marcar todas como lidas
                  </button>
                  <button 
                    onClick={clearAll}
                    className="px-3 py-2 bg-slate-800/50 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-xs text-slate-400 font-semibold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm font-semibold mb-1">
                    {filter === 'all' ? 'Nenhuma notificação' : 
                     filter === 'unread' ? 'Todas as notificações foram lidas' :
                     'Nenhuma notificação favorita'}
                  </p>
                  <p className="text-slate-600 text-xs">
                    {filter === 'all' ? 'Você está em dia!' : ''}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 transition-all cursor-pointer group relative border-l-2 ${
                        !notification.read ? getPriorityColor(notification.priority) : 'border-transparent bg-slate-900/50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          {getIcon(notification.type, notification.priority)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-white text-sm">
                                {notification.ticker}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                notification.type === 'price' ? 'bg-emerald-500/20 text-emerald-400' :
                                notification.type === 'percentage' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {notification.value}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(notification.id);
                                }}
                                className="p-1 hover:bg-slate-800 rounded transition-all"
                              >
                                <Star className={`w-3.5 h-3.5 ${
                                  notification.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                                }`} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-300 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.timestamp}
                              </span>
                              <span className="text-xs text-slate-600">
                                {notification.alertType}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Priority Indicator */}
                      {notification.priority === 'high' && !notification.read && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
                <button className="text-xs text-slate-400 hover:text-white font-semibold transition-colors flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  Ver todas ({notifications.length})
                </button>
                <button className="text-xs text-slate-400 hover:text-indigo-400 font-semibold transition-colors flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" />
                  Configurar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}