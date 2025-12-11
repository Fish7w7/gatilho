'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Zap, TrendingUp, Shield, Bell, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Erro ao fazer login');
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user_id.toString());
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-indigo-500/50 hover:scale-110 transition-transform">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Bem-vindo!</h1>
            <p className="text-slate-400">Entre para acessar seus alertas</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Não tem conta?{' '}
                <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Cadastre-se grátis
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 font-semibold">100% Seguro</p>
            </div>
            <div className="p-3 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-xs text-slate-400 font-semibold">Gratuito</p>
            </div>
            <div className="p-3 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400 font-semibold">Alertas 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
        <div className="max-w-lg">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              Alertas Inteligentes
            </span>
            <h2 className="text-6xl font-black text-white mb-6 leading-tight">
              Monitore suas ações em
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                tempo real
              </span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Receba notificações instantâneas quando suas ações atingirem os valores que você definiu.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Alertas de Preço</h3>
                <p className="text-sm text-slate-400">Seja notificado quando suas ações atingirem o preço desejado</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Notificações Instantâneas</h3>
                <p className="text-sm text-slate-400">Receba alertas por email assim que suas condições forem atingidas</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">100% Seguro e Gratuito</h3>
                <p className="text-sm text-slate-400">Seus dados protegidos com criptografia de ponta</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">+1.234 investidores ativos</p>
                <p className="text-xs text-slate-400">Monitorando suas carteiras agora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}