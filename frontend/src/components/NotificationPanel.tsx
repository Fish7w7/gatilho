// frontend/src/components/NotificationPanel.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, TrendingUp, TrendingDown, Clock, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  ticker: string;
  message: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      ticker: 'VALE3',
      message: 'Atingiu R$ 65,50 - Alerta de preço disparado',
      timestamp: '2 minutos atrás',
      type: 'success',
      read: false
    },
    {
      id: 2,
      ticker: 'PETR4',
      message: 'Variou +3.2% nas últimas horas',
      timestamp: '1 hora atrás',
      type: 'info',
      read: false
    },
    {
      id: 3,
      ticker: 'ITUB4',
      message: 'Volume acima da média detectado',
      timestamp: '3 horas atrás',
      type: 'warning',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    if (type === 'success') return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    if (type === 'warning') return <TrendingDown className="w-5 h-5 text-amber-400" />;
    return <Bell className="w-5 h-5 text-indigo-400" />;
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
            {unreadCount}
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
          <div className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-bold">Notificações</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                    {unreadCount} novas
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="p-3 border-b border-slate-800">
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Marcar todas como lidas
                </button>
              </div>
            )}

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-slate-800/50 transition-all cursor-pointer group ${
                        !notification.read ? 'bg-indigo-500/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white text-sm">
                              {notification.ticker}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-slate-300 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.timestamp}
                            </span>
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-800 text-center">
                <button className="text-xs text-slate-400 hover:text-white font-semibold transition-colors">
                  Ver todas as notificações
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}