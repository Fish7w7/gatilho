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
      // SEM barra no final
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
              <option value="price">💰 Preço Alvo</option>
              <option value="percentage">📊 Variação Percentual</option>
              <option value="volume">📈 Volume</option>
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
              <strong>📋 Resumo:</strong> Alerta será disparado quando <strong>{ticker || 'ATIVO'}</strong>
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
              {loading ? '⏳ Criando...' : '✅ Criar Alerta'}
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