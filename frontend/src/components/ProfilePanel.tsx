// frontend/src/components/ProfilePanel.tsx
'use client';
import React, { useState } from 'react';
import { User, Settings, LogOut, Mail, Calendar, Crown, ChevronDown, X, Bell, Shield, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  plan: 'free' | 'premium';
}

export default function ProfilePanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [profile] = useState<UserProfile>({
    name: 'João Silva',
    email: 'gatilhosup@gmail.com',
    memberSince: 'Dezembro 2025',
    plan: 'free'
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-xl transition-all"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
          {profile.name.charAt(0)}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-white">{profile.name}</p>
          <p className="text-xs text-slate-400">
            {profile.plan === 'premium' ? '👑 Premium' : 'Plano Free'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-14 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Profile Header */}
            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-b border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{profile.name}</h3>
                  <p className="text-slate-400 text-sm">{profile.email}</p>
                </div>
              </div>
              
              {profile.plan === 'free' && (
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/50 transition-all">
                  <Crown className="w-4 h-4" />
                  Upgrade para Premium
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="p-4 bg-slate-800/30 border-b border-slate-800">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-black text-white">12</p>
                  <p className="text-xs text-slate-400">Alertas</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">8</p>
                  <p className="text-xs text-slate-400">Disparados</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-indigo-400">4</p>
                  <p className="text-xs text-slate-400">Ativos</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button 
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                  <Settings className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Configurações</p>
                  <p className="text-xs text-slate-400">Personalize sua conta</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-all group">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                  <Bell className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Notificações</p>
                  <p className="text-xs text-slate-400">Gerencie alertas</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-all group">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                  <Shield className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Privacidade</p>
                  <p className="text-xs text-slate-400">Dados e segurança</p>
                </div>
              </button>

              <div className="my-2 border-t border-slate-800"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                  <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm group-hover:text-red-400">Sair</p>
                  <p className="text-xs text-slate-400">Desconectar da conta</p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-800/30 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Membro desde {profile.memberSince}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-white">Configurações</h2>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
              {/* Profile Section */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Perfil</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Nome</label>
                    <input 
                      type="text" 
                      defaultValue={profile.name}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={profile.email}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Notificações</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Email quando alerta disparar', checked: true },
                    { label: 'Email resumo diário', checked: false },
                    { label: 'Novidades e atualizações', checked: true }
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all">
                      <span className="text-white font-semibold text-sm">{item.label}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={item.checked}
                        className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Aparência</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['Escuro', 'Claro', 'Auto'].map((theme) => (
                    <button key={theme} className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'Escuro' 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <Palette className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-white">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 flex gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}