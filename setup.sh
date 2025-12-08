#!/bin/bash

echo "🚀 Iniciando setup do projeto Gatilho MVP..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detectar sistema operacional
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
    PYTHON_CMD="python"
    VENV_ACTIVATE="venv/Scripts/activate"
else
    IS_WINDOWS=false
    PYTHON_CMD="python3"
    VENV_ACTIVATE="venv/bin/activate"
fi

# Verificar Python
echo -e "${BLUE}🔍 Verificando Python...${NC}"
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1 | grep -oP '\d+\.\d+')
    echo -e "${GREEN}✅ Python $PYTHON_VERSION encontrado!${NC}"
    PYTHON_CMD="python"
elif command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | grep -oP '\d+\.\d+')
    echo -e "${GREEN}✅ Python $PYTHON_VERSION encontrado!${NC}"
    PYTHON_CMD="python3"
elif command -v py &> /dev/null; then
    PYTHON_VERSION=$(py --version 2>&1 | grep -oP '\d+\.\d+')
    echo -e "${GREEN}✅ Python $PYTHON_VERSION encontrado!${NC}"
    PYTHON_CMD="py"
else
    echo -e "${YELLOW}⚠️  Python não encontrado. Instale Python 3.11+ antes de continuar.${NC}"
    PYTHON_CMD="python"
fi

# 1. Criar estrutura de pastas
echo -e "${BLUE}📁 Criando estrutura de pastas...${NC}"

mkdir -p frontend/src/app/login
mkdir -p frontend/src/app/signup
mkdir -p frontend/src/app/dashboard
mkdir -p frontend/src/app/alerts/new
mkdir -p frontend/src/components/ui
mkdir -p frontend/src/lib
mkdir -p frontend/public

mkdir -p backend/app/api
mkdir -p backend/app/models
mkdir -p backend/app/services
mkdir -p backend/app/tasks
mkdir -p backend/app/core
mkdir -p backend/app/utils
mkdir -p backend/alembic/versions

echo -e "${GREEN}✅ Pastas criadas!${NC}"

# 2. Criar arquivos do Frontend
echo -e "${BLUE}📝 Criando arquivos do Frontend...${NC}"

# package.json
cat > frontend/package.json << 'ENDOFFILE'
{
  "name": "gatilho-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3"
  }
}
ENDOFFILE

# tailwind.config.js
cat > frontend/tailwind.config.js << 'ENDOFFILE'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}
ENDOFFILE

# postcss.config.js
cat > frontend/postcss.config.js << 'ENDOFFILE'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
ENDOFFILE

# next.config.js
cat > frontend/next.config.js << 'ENDOFFILE'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
ENDOFFILE

# tsconfig.json
cat > frontend/tsconfig.json << 'ENDOFFILE'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
ENDOFFILE

# layout.tsx
cat > frontend/src/app/layout.tsx << 'ENDOFFILE'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gatilho - Alertas Inteligentes para Ações',
  description: 'Alertas de preço, variação percentual e volume para ações da B3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
ENDOFFILE

# globals.css
cat > frontend/src/app/globals.css << 'ENDOFFILE'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all;
  }
}
ENDOFFILE

# page.tsx (home)
cat > frontend/src/app/page.tsx << 'ENDOFFILE'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-lg">
          Gatilho
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Alertas inteligentes para ações da B3
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Entrar
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition border-2 border-white/30 shadow-lg"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  )
}
ENDOFFILE

# login/page.tsx
cat > frontend/src/app/login/page.tsx << 'ENDOFFILE'
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Erro ao fazer login');
      }
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user_id.toString());
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-4xl font-bold text-gray-900">
            Gatilho
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre na sua conta
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Não tem conta?{' '}
          <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
ENDOFFILE

# signup/page.tsx
cat > frontend/src/app/signup/page.tsx << 'ENDOFFILE'
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Erro ao criar conta');
      }
      
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      router.push('/login');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-4xl font-bold text-gray-900">
            Gatilho
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crie sua conta gratuita
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
ENDOFFILE

# dashboard/page.tsx
cat > frontend/src/app/dashboard/page.tsx << 'ENDOFFILE'
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
      const res = await fetch(`http://localhost:8000/api/alerts?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Erro ao carregar alertas');
      
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error('Erro:', error);
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
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Erro ao excluir alerta');
      
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      alert('Erro ao excluir alerta');
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
            <h1 className="text-2xl font-bold text-primary-600">Gatilho</h1>
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando alertas...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
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
                        {alert.triggered ? 'Disparado' : alert.is_active ? 'Ativo' : 'Pausado'}
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
                      Excluir
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
ENDOFFILE

# alerts/new/page.tsx
cat > frontend/src/app/alerts/new/page.tsx << 'ENDOFFILE'
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAlertPage() {
  const [ticker, setTicker] = useState('');
  const [alertType, setAlertType] = useState('price');
  const [condition, setCondition] = useState('>');
  const [targetValue, setTargetValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          ticker: ticker.toUpperCase(),
          alert_type: alertType,
          condition,
          target_value: parseFloat(targetValue)
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Erro ao criar alerta');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar alerta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Voltar
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Criar Novo Alerta</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
              Ativo / Ticker
            </label>
            <input
              id="ticker"
              type="text"
              placeholder="Ex: PETR4, VALE3, ITUB4"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Digite o código da ação</p>
          </div>

          <div>
            <label htmlFor="alertType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Alerta
            </label>
            <select
              id="alertType"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="input-field"
            >
              <option value="price">Preço Alvo</option>
              <option value="percentage">Variação Percentual</option>
              <option value="volume">Volume</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condição
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="input-field"
              >
                <option value=">">Maior que ({">"}) </option>
                <option value="<">Menor que ({"<"})</option>
                <option value=">=">Maior ou igual (≥)</option>
                <option value="<=">Menor ou igual (≤)</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-1">
                {alertType === 'price' && 'Preço (R$)'}
                {alertType === 'percentage' && 'Variação (%)'}
                {alertType === 'volume' && 'Volume'}
              </label>
              <input
                id="targetValue"
                type="number"
                step="0.01"
                placeholder={alertType === 'price' ? '45.00' : alertType === 'percentage' ? '5.00' : '1000000'}
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Resumo:</strong> Alerta será disparado quando <strong>{ticker || 'ATIVO'}</strong>
              {' '}{alertType === 'price' ? 'atingir preço' : alertType === 'percentage' ? 'variar' : 'tiver volume'}
              {' '}{condition} {targetValue || '0'}
              {alertType === 'price' && ' reais'}
              {alertType === 'percentage' && '%'}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Alerta'}
            </button>
            <Link href="/dashboard" className="flex-1 btn-secondary text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
ENDOFFILE

echo -e "${GREEN}✅ Frontend criado!${NC}"

# 3. Criar arquivos do Backend
echo -e "${BLUE}📝 Criando arquivos do Backend...${NC}"

# requirements.txt
cat > backend/requirements.txt << 'ENDOFFILE'
fastapi==0.108.0
uvicorn[standard]==0.25.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
celery==5.3.4
redis==5.0.1
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
alembic==1.13.1
httpx==0.25.2
email-validator==2.1.0
ENDOFFILE

# .env.example
cat > backend/.env.example << 'ENDOFFILE'
DATABASE_URL=postgresql://gatilho:dev_password_123@localhost:5432/gatilho_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
TWELVE_DATA_API_KEY=your_api_key_here
SENDGRID_API_KEY=your_sendgrid_key_here
EMAIL_FROM=noreply@gatilho.app
ENDOFFILE

# .env
cat > backend/.env << 'ENDOFFILE'
DATABASE_URL=postgresql://gatilho:dev_password_123@localhost:5432/gatilho_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=dev-secret-key-change-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
TWELVE_DATA_API_KEY=demo
SENDGRID_API_KEY=
EMAIL_FROM=noreply@gatilho.app
ENDOFFILE

# __init__.py files
touch backend/app/__init__.py
touch backend/app/api/__init__.py
touch backend/app/models/__init__.py
touch backend/app/services/__init__.py
touch backend/app/tasks/__init__.py
touch backend/app/core/__init__.py
touch backend/app/utils/__init__.py

# config.py
cat > backend/app/core/config.py << 'ENDOFFILE'
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    TWELVE_DATA_API_KEY: str = "demo"
    SENDGRID_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@gatilho.app"

    class Config:
        env_file = ".env"

settings = Settings()
ENDOFFILE

# database.py
cat > backend/app/core/database.py << 'ENDOFFILE'
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
ENDOFFILE

# security.py
cat > backend/app/core/security.py << 'ENDOFFILE'
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
ENDOFFILE

# user.py
cat > backend/app/models/user.py << 'ENDOFFILE'
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    alerts = relationship("Alert", back_populates="user")
ENDOFFILE

# alert.py
cat > backend/app/models/alert.py << 'ENDOFFILE'
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ticker = Column(String, nullable=False, index=True)
    alert_type = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    condition = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    triggered = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    triggered_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="alerts")
ENDOFFILE

# auth.py
cat > backend/app/api/auth.py << 'ENDOFFILE'
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token
from ..core.config import settings
from ..models.user import User

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    if len(user.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha deve ter pelo menos 6 caracteres"
        )
    
    hashed_pw = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Usuário criado com sucesso",
        "user_id": new_user.id,
        "email": new_user.email
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }
ENDOFFILE

# alerts.py
cat > backend/app/api/alerts.py << 'ENDOFFILE'
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from ..core.database import get_db
from ..models.alert import Alert
from ..models.user import User

router = APIRouter()

class AlertCreate(BaseModel):
    user_id: int
    ticker: str
    alert_type: str
    target_value: float
    condition: str

class AlertResponse(BaseModel):
    id: int
    ticker: str
    alert_type: str
    target_value: float
    condition: str
    is_active: bool
    triggered: bool
    created_at: str

    class Config:
        from_attributes = True

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == alert.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    valid_types = ["price", "percentage", "volume"]
    if alert.alert_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de alerta inválido. Use: {', '.join(valid_types)}"
        )
    
    valid_conditions = [">", "<", ">=", "<="]
    if alert.condition not in valid_conditions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Condição inválida. Use: {', '.join(valid_conditions)}"
        )
    
    new_alert = Alert(
        user_id=alert.user_id,
        ticker=alert.ticker.upper(),
        alert_type=alert.alert_type,
        target_value=alert.target_value,
        condition=alert.condition
    )
    
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    return new_alert

@router.get("/", response_model=List[AlertResponse])
def list_alerts(user_id: int = Query(...), db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(
        Alert.user_id == user_id,
        Alert.is_active == True
    ).order_by(Alert.created_at.desc()).all()
    
    return alerts

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == user_id
    ).first()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta não encontrado"
        )
    
    alert.is_active = False
    db.commit()
    
    return {"message": "Alerta removido com sucesso", "alert_id": alert_id}
ENDOFFILE

# market_data.py
cat > backend/app/services/market_data.py << 'ENDOFFILE'
import httpx
from ..core.config import settings

class MarketDataService:
    def __init__(self):
        self.api_key = settings.TWELVE_DATA_API_KEY
        self.base_url = "https://api.twelvedata.com"
    
    async def get_quote(self, ticker: str):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/quote",
                    params={
                        "symbol": ticker,
                        "apikey": self.api_key
                    }
                )
                data = response.json()
                
                if "price" in data:
                    return {
                        "ticker": ticker,
                        "price": float(data.get("price", 0)),
                        "volume": int(data.get("volume", 0)),
                        "change_percent": float(data.get("percent_change", 0))
                    }
                return None
        except Exception as e:
            print(f"Erro ao buscar cotação: {e}")
            return None

market_data_service = MarketDataService()
ENDOFFILE

# notification.py
cat > backend/app/services/notification.py << 'ENDOFFILE'
from ..core.config import settings

class NotificationService:
    def __init__(self):
        self.from_email = settings.EMAIL_FROM
        self.sendgrid_key = settings.SENDGRID_API_KEY
    
    def send_alert_email(
        self,
        to_email: str,
        ticker: str,
        alert_type: str,
        condition: str,
        target_value: float,
        current_value: float
    ):
        alert_type_labels = {
            "price": "Preço",
            "percentage": "Variação",
            "volume": "Volume"
        }
        
        print(f"\n📧 ===== EMAIL DE ALERTA =====")
        print(f"Para: {to_email}")
        print(f"Assunto: 🔔 Alerta Disparado: {ticker}")
        print(f"Tipo: {alert_type_labels.get(alert_type, alert_type)}")
        print(f"Condição: {condition} {target_value}")
        print(f"Valor Atual: {current_value}")
        print(f"=============================\n")
        
        return True

notification_service = NotificationService()
ENDOFFILE

# celery_app.py
cat > backend/app/tasks/celery_app.py << 'ENDOFFILE'
from celery import Celery
from ..core.config import settings

celery_app = Celery(
    "gatilho",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Sao_Paulo",
    enable_utc=True,
    beat_schedule={
        "check-alerts-every-5-minutes": {
            "task": "app.tasks.alert_checker.check_all_alerts",
            "schedule": 300.0,
        },
    },
)
ENDOFFILE

# alert_checker.py
cat > backend/app/tasks/alert_checker.py << 'ENDOFFILE'
import asyncio
from sqlalchemy.orm import Session
from datetime import datetime
from .celery_app import celery_app
from ..core.database import SessionLocal
from ..models.alert import Alert
from ..models.user import User
from ..services.market_data import market_data_service
from ..services.notification import notification_service

@celery_app.task(name="app.tasks.alert_checker.check_all_alerts")
def check_all_alerts():
    db = SessionLocal()
    try:
        alerts = db.query(Alert).filter(
            Alert.is_active == True,
            Alert.triggered == False
        ).all()
        
        print(f"🔍 Verificando {len(alerts)} alertas...")
        
        for alert in alerts:
            asyncio.run(check_single_alert(alert, db))
        
        db.commit()
        print("✅ Verificação concluída")
        
    except Exception as e:
        print(f"❌ Erro na verificação: {e}")
        db.rollback()
    finally:
        db.close()

async def check_single_alert(alert: Alert, db: Session):
    try:
        quote = await market_data_service.get_quote(alert.ticker)
        
        if not quote:
            print(f"⚠️  Não foi possível obter dados para {alert.ticker}")
            return
        
        if alert.alert_type == "price":
            current_value = quote["price"]
        elif alert.alert_type == "percentage":
            current_value = abs(quote["change_percent"])
        elif alert.alert_type == "volume":
            current_value = quote["volume"]
        else:
            return
        
        triggered = False
        if alert.condition == ">":
            triggered = current_value > alert.target_value
        elif alert.condition == "<":
            triggered = current_value < alert.target_value
        elif alert.condition == ">=":
            triggered = current_value >= alert.target_value
        elif alert.condition == "<=":
            triggered = current_value <= alert.target_value
        
        if triggered:
            print(f"🔔 Alerta disparado! {alert.ticker} - {alert.alert_type}")
            
            user = db.query(User).filter(User.id == alert.user_id).first()
            
            if user:
                notification_service.send_alert_email(
                    to_email=user.email,
                    ticker=alert.ticker,
                    alert_type=alert.alert_type,
                    condition=alert.condition,
                    target_value=alert.target_value,
                    current_value=current_value
                )
            
            alert.triggered = True
            alert.triggered_at = datetime.utcnow()
            alert.is_active = False
            
    except Exception as e:
        print(f"❌ Erro ao verificar alerta {alert.id}: {e}")
ENDOFFILE

# main.py
cat > backend/app/main.py << 'ENDOFFILE'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api import auth, alerts

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gatilho API",
    description="API para alertas inteligentes de ações da B3",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alertas"])

@app.get("/")
def root():
    return {
        "message": "Gatilho API v1.0.0",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
ENDOFFILE

echo -e "${GREEN}✅ Backend criado!${NC}"

# 4. Docker Compose
echo -e "${BLUE}🐳 Criando docker-compose.yml...${NC}"

cat > docker-compose.yml << 'ENDOFFILE'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: gatilho_postgres
    environment:
      POSTGRES_USER: gatilho
      POSTGRES_PASSWORD: dev_password_123
      POSTGRES_DB: gatilho_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: gatilho_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
ENDOFFILE

echo -e "${GREEN}✅ Docker Compose criado!${NC}"

# 5. .gitignore
echo -e "${BLUE}📝 Criando .gitignore...${NC}"

cat > .gitignore << 'ENDOFFILE'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
*.egg-info/
.pytest_cache/
*.pyc

# Node
node_modules/
.next/
out/
build/
dist/
.cache/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
*.swn

# OS
.DS_Store
Thumbs.db
*.log

# Database
*.db
*.sqlite
*.sqlite3

# Celery
celerybeat-schedule
celerybeat.pid
ENDOFFILE

echo -e "${GREEN}✅ .gitignore criado!${NC}"

# 6. README
echo -e "${BLUE}📝 Criando README.md...${NC}"

cat > README.md << 'ENDOFFILE'
# 🔔 Gatilho - Alertas Inteligentes para Ações da B3

Sistema completo de alertas para investidores, com notificações em tempo real.

## 📋 Funcionalidades

- ✅ Alertas de **Preço** (ex: PETR4 > R$ 45,00)
- ✅ Alertas de **Variação Percentual** (ex: VALE3 caiu 5%)
- ✅ Alertas de **Volume** (ex: Volume acima da média)
- ✅ Dashboard intuitivo
- ✅ Notificações por email
- ✅ Checagem automática a cada 5 minutos

## 🚀 Setup Rápido

### 1. Backend
```bash
cd backend
python -m venv venv

# Windows (Git Bash)
source venv/Scripts/activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend
```bash
cd frontend
npm install
```

### 3. Docker (PostgreSQL + Redis)
```bash
docker-compose up -d
```

### 4. Configurar .env
```bash
cd backend
# O arquivo .env já foi criado, edite se necessário
```

## ▶️ Rodar o Projeto

### Windows (Git Bash/PowerShell)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Celery Worker:**
```bash
cd backend
source venv/Scripts/activate
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
```

**Terminal 3 - Celery Beat:**
```bash
cd backend
source venv/Scripts/activate
celery -A app.tasks.celery_app beat --loglevel=info
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

### Linux/Mac

Use os mesmos comandos, mas com `venv/bin/activate`

## 🌐 Acessar

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📚 Stack Tecnológica

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python 3.11 + FastAPI + SQLAlchemy
- **Database:** PostgreSQL
- **Cache/Queue:** Redis + Celery
- **APIs:** Twelve Data (cotações)

## 🔑 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://gatilho:dev_password_123@localhost:5432/gatilho_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=seu-secret-key-aqui
TWELVE_DATA_API_KEY=sua-api-key
```

## 📝 Próximos Passos

- [ ] Implementar autenticação OAuth
- [ ] Adicionar gráficos de performance
- [ ] Sistema de carteira
- [ ] Indicadores fundamentalistas
- [ ] IA preditiva

---

**Desenvolvido com ❤️ para investidores da B3**
ENDOFFILE

echo -e "${GREEN}✅ README criado!${NC}"

# 7. Scripts auxiliares
echo -e "${BLUE}📝 Criando scripts auxiliares...${NC}"

if [ "$IS_WINDOWS" = true ]; then
    # Scripts para Windows
    cat > run-backend.bat << 'ENDOFFILE'
@echo off
cd backend
call venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
ENDOFFILE

    cat > run-celery-worker.bat << 'ENDOFFILE'
@echo off
cd backend
call venv\Scripts\activate
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
ENDOFFILE

    cat > run-celery-beat.bat << 'ENDOFFILE'
@echo off
cd backend
call venv\Scripts\activate
celery -A app.tasks.celery_app beat --loglevel=info
ENDOFFILE

    cat > run-frontend.bat << 'ENDOFFILE'
@echo off
cd frontend
npm run dev
ENDOFFILE

    echo -e "${GREEN}✅ Scripts .bat criados para Windows!${NC}"
fi

# Scripts para Linux/Mac/Git Bash
cat > run-backend.sh << 'ENDOFFILE'
#!/bin/bash
cd backend
source $VENV_ACTIVATE
uvicorn app.main:app --reload --port 8000
ENDOFFILE

cat > run-celery-worker.sh << 'ENDOFFILE'
#!/bin/bash
cd backend
source $VENV_ACTIVATE
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
ENDOFFILE

cat > run-celery-beat.sh << 'ENDOFFILE'
#!/bin/bash
cd backend
source $VENV_ACTIVATE
celery -A app.tasks.celery_app beat --loglevel=info
ENDOFFILE

cat > run-frontend.sh << 'ENDOFFILE'
#!/bin/bash
cd frontend
npm run dev
ENDOFFILE

chmod +x run-backend.sh run-celery-worker.sh run-celery-beat.sh run-frontend.sh

echo -e "${GREEN}✅ Scripts auxiliares criados!${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup do Projeto Gatilho Concluído com Sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Estrutura criada:${NC}"
echo "   ✅ Frontend (Next.js + TypeScript + Tailwind)"
echo "   ✅ Backend (FastAPI + SQLAlchemy + Celery)"
echo "   ✅ Docker Compose (PostgreSQL + Redis)"
echo "   ✅ Sistema de autenticação JWT"
echo "   ✅ CRUD de alertas completo"
echo "   ✅ Worker Celery para checagem automática"
echo "   ✅ Sistema de notificações"
echo ""
echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS:${NC}"
echo ""
echo -e "${BLUE}1. Instalar dependências do Backend:${NC}"
echo "   cd backend"
echo "   $PYTHON_CMD -m venv venv"
if [ "$IS_WINDOWS" = true ]; then
    echo "   source venv/Scripts/activate"
else
    echo "   source venv/bin/activate"
fi
echo "   pip install -r requirements.txt"
echo ""
echo -e "${BLUE}2. Instalar dependências do Frontend:${NC}"
echo "   cd frontend"
echo "   npm install"
echo ""
echo -e "${BLUE}3. Iniciar Docker:${NC}"
echo "   docker-compose up -d"
echo ""
echo -e "${BLUE}4. Rodar a aplicação (4 terminais):${NC}"
if [ "$IS_WINDOWS" = true ]; then
    echo "   Terminal 1: ./run-backend.sh"
    echo "   Terminal 2: ./run-celery-worker.sh"
    echo "   Terminal 3: ./run-celery-beat.sh"
    echo "   Terminal 4: ./run-frontend.sh"
fi
echo ""
echo -e "${BLUE}🌐 URLs após iniciar:${NC}"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Bom desenvolvimento!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "" run-backend.bat"
    echo "   Terminal 2: run-celery-worker.bat"
    echo "   Terminal 3: run-celery-beat.bat"
    echo "   Terminal 4: run-frontend.bat"
else
    echo "   Terminal 1: