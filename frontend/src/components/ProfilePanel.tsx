'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { 
  User, Settings, LogOut, Mail, Calendar, Crown, ChevronDown, X, 
  Bell, Shield, Palette, Key, CreditCard, HelpCircle, FileText,
  Save, Camera, Trash2, Eye, EyeOff, Check, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  plan: 'free' | 'premium';
  avatar?: string;
}

type SettingsTab = 'profile' | 'account' | 'notifications' | 'appearance' | 'security';
type ThemeColor = 'indigo' | 'purple' | 'blue' | 'emerald' | 'amber' | 'rose';

export default function ProfilePanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuário',
    email: 'user@email.com',
    memberSince: 'Dezembro 2025',
    plan: 'free'
  });

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailOnTrigger: true,
    dailySummary: false,
    weeklyReport: true,
    productUpdates: true,
    priceAlerts: true
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState<ThemeColor>('indigo');

  // Carrega dados do perfil do localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    const storedColor = localStorage.getItem('accentColor') as ThemeColor;

    if (storedName) setProfile(prev => ({ ...prev, name: storedName }));
    if (storedEmail) setProfile(prev => ({ ...prev, email: storedEmail }));
    if (storedTheme) setTheme(storedTheme);
    if (storedColor) setAccentColor(storedColor);

    setFormData(prev => ({
      ...prev,
      name: storedName || prev.name,
      email: storedEmail || prev.email
    }));
  }, []);

  // Aplica o tema
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Aplica a cor de destaque
  useEffect(() => {
    document.documentElement.setAttribute('data-accent-color', accentColor);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleSaveProfile = async () => {
    try {
      setSaveError('');
      
      // Validação
      if (!formData.name.trim() || formData.name.length < 2) {
        setSaveError('Nome deve ter pelo menos 2 caracteres');
        return;
      }

      if (!formData.email.includes('@')) {
        setSaveError('Email inválido');
        return;
      }

      // Salva no localStorage (em produção, seria uma chamada à API)
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      
      setProfile({ ...profile, name: formData.name, email: formData.email });
      setSaveSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError('Erro ao salvar perfil');
    }
  };

  const handlePasswordChange = async () => {
    try {
      setSaveError('');

      // Validações
      if (!formData.currentPassword) {
        setSaveError('Digite a senha atual');
        return;
      }

      if (formData.newPassword.length < 6) {
        setSaveError('Nova senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setSaveError('As senhas não coincidem');
        return;
      }

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setSaveError('Usuário não autenticado');
        return;
      }

      // Chama API para alterar senha
      const response = await fetch(`http://localhost:8000/api/user/change-password?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao alterar senha');
      }

      // Limpa os campos
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error.message || 'Erro ao alterar senha');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt(
      'Esta ação é irreversível. Digite "DELETAR" para confirmar:'
    );

    if (confirmText !== 'DELETAR') {
      alert('Exclusão cancelada');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        alert('Usuário não autenticado');
        return;
      }

      // Chama API para deletar conta
      const response = await fetch(`http://localhost:8000/api/user/me?user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir conta');
      }

      localStorage.clear();
      alert('Conta excluída com sucesso');
      router.push('/');
    } catch (error) {
      alert('Erro ao excluir conta. Tente novamente.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'account', label: 'Conta', icon: Mail },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'security', label: 'Segurança', icon: Shield }
  ];

  const colorOptions: { value: ThemeColor; name: string; class: string }[] = [
    { value: 'indigo', name: 'Índigo', class: 'bg-indigo-500' },
    { value: 'purple', name: 'Roxo', class: 'bg-purple-500' },
    { value: 'blue', name: 'Azul', class: 'bg-blue-500' },
    { value: 'emerald', name: 'Verde', class: 'bg-emerald-500' },
    { value: 'amber', name: 'Âmbar', class: 'bg-amber-500' },
    { value: 'rose', name: 'Rosa', class: 'bg-rose-500' }
  ];

  const SettingsModal = () => (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => setShowSettings(false)}
    >
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
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

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block w-56 border-r border-slate-800 p-4 flex-shrink-0 overflow-y-auto">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Informações do Perfil</h3>
                  <p className="text-slate-400 text-sm">Atualize suas informações pessoais</p>
                </div>

                {saveSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400 font-semibold">Alterações salvas com sucesso!</p>
                  </div>
                )}

                {saveError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 font-semibold">{saveError}</p>
                  </div>
                )}

                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
                    >
                      Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleSaveProfile}
                        className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
                      >
                        Salvar Alterações
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setSaveError('');
                          setFormData({ ...formData, name: profile.name, email: profile.email });
                        }}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Plano e Assinatura</h3>
                  <p className="text-slate-400 text-sm">Gerencie seu plano atual</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Plano Atual</p>
                      <h4 className="text-2xl font-black text-white">Free</h4>
                    </div>
                    <div className="px-3 py-1 bg-slate-800 rounded-full">
                      <p className="text-xs font-bold text-emerald-400">Ativo</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {[
                      'Alertas ilimitados',
                      'Notificações por email',
                      'Histórico de 30 dias'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade para Premium
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Preferências de Notificação</h3>
                  <p className="text-slate-400 text-sm">Escolha como deseja ser notificado</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'emailOnTrigger', label: 'Email quando alerta disparar', desc: 'Receba um email imediatamente' },
                    { key: 'dailySummary', label: 'Resumo diário', desc: 'Um email por dia com todos os alertas' },
                    { key: 'weeklyReport', label: 'Relatório semanal', desc: 'Análise semanal da sua carteira' },
                    { key: 'productUpdates', label: 'Novidades do produto', desc: 'Fique por dentro das atualizações' },
                    { key: 'priceAlerts', label: 'Alertas de preço', desc: 'Notificações de mudanças de preço' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all group">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-400 transition-colors">{item.label}</p>
                        <p className="text-slate-400 text-xs">{item.desc}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </label>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
                >
                  Salvar Preferências
                </button>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Tema e Aparência</h3>
                  <p className="text-slate-400 text-sm">Personalize a aparência do aplicativo</p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Tema</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'dark', label: 'Escuro', icon: '🌙', desc: 'Interface escura (atual)' },
                      { value: 'light', label: 'Claro', icon: '☀️', desc: 'Interface clara (em breve)' }
                    ].map((t) => (
                      <button 
                        key={t.value}
                        onClick={() => setTheme(t.value as 'dark' | 'light')}
                        disabled={t.value === 'light'}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          theme === t.value 
                            ? 'border-indigo-500 bg-indigo-500/10' 
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                        } ${t.value === 'light' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-4xl mb-3">{t.icon}</div>
                        <p className="text-sm font-bold text-white">{t.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Cor de Destaque</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {colorOptions.map((color) => (
                      <button 
                        key={color.value}
                        onClick={() => setAccentColor(color.value)}
                        className={`relative w-full aspect-square rounded-xl ${color.class} hover:scale-110 transition-all ${
                          accentColor === color.value ? 'ring-4 ring-white ring-offset-4 ring-offset-slate-900' : ''
                        }`}
                        title={color.name}
                      >
                        {accentColor === color.value && (
                          <Check className="absolute inset-0 m-auto w-6 h-6 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 mt-3">
                    Cor selecionada: <span className="font-bold text-white">{colorOptions.find(c => c.value === accentColor)?.name}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Segurança da Conta</h3>
                  <p className="text-slate-400 text-sm">Mantenha sua conta protegida</p>
                </div>

                {saveSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400 font-semibold">Senha alterada com sucesso!</p>
                  </div>
                )}

                {saveError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 font-semibold">{saveError}</p>
                  </div>
                )}

                <div className="p-6 bg-slate-800/30 rounded-2xl space-y-4">
                  <h4 className="text-lg font-bold text-white">Alterar Senha</h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Senha Atual</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-12"
                        placeholder="Digite sua senha atual"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Nova Senha</label>
                    <input 
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Confirmar Nova Senha</label>
                    <input 
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="Digite novamente a nova senha"
                    />
                  </div>

                  <button 
                    onClick={handlePasswordChange}
                    disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                  >
                    Alterar Senha
                  </button>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <h4 className="text-lg font-bold text-red-400 mb-2">Zona de Perigo</h4>
                  <p className="text-slate-400 text-sm mb-4">Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.</p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                  >
                    Excluir Conta Permanentemente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-50">
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

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-[calc(100%+0.5rem)] w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50">
            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-b border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{profile.name}</h3>
                  <p className="text-slate-400 text-sm truncate">{profile.email}</p>
                </div>
              </div>
              
              {profile.plan === 'free' && (
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/50 transition-all">
                  <Crown className="w-4 h-4" />
                  Upgrade para Premium
                </button>
              )}
            </div>

            <div className="p-2">
              <button 
                onClick={() => { setShowSettings(true); setIsOpen(false); }}
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

            <div className="p-4 bg-slate-800/30 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Membro desde {profile.memberSince}
              </p>
            </div>
          </div>
        </>
      )}

      {showSettings && mounted && createPortal(
        <SettingsModal />,
        document.body
      )}
    </div>
  );
}