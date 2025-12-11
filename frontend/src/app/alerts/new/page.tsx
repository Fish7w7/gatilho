'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle, Target, Zap, DollarSign, Percent, Volume2, ArrowUp, ArrowDown } from 'lucide-react';
import { alertsAPI, CreateAlertPayload } from '../../../services/api';

interface Stock {
  ticker: string;
  name: string;
  sector: string;
}

export default function ImprovedAlertForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ticker: '',
    alertType: '',
    condition: '',
    targetValue: ''
  });
  const [searchTicker, setSearchTicker] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!storedUserId || !token) {
      router.push('/login');
      return;
    }
    setUserId(parseInt(storedUserId));
  }, [router]);

  const popularStocks: Stock[] = [
    { ticker: 'PETR4', name: 'Petrobras', sector: 'Petróleo' },
    { ticker: 'VALE3', name: 'Vale', sector: 'Mineração' },
    { ticker: 'ITUB4', name: 'Itaú', sector: 'Bancos' },
    { ticker: 'BBDC4', name: 'Bradesco', sector: 'Bancos' },
    { ticker: 'MGLU3', name: 'Magazine Luiza', sector: 'Varejo' },
    { ticker: 'B3SA3', name: 'B3', sector: 'Financeiro' },
    { ticker: 'WEGE3', name: 'WEG', sector: 'Industrial' },
    { ticker: 'RENT3', name: 'Localiza', sector: 'Locação' }
  ];

  const alertTypes = [
    {
      id: 'price',
      name: 'Preço Alvo',
      description: 'Seja notificado quando o preço atingir um valor específico',
      icon: DollarSign,
      color: 'emerald',
      example: 'Ex: PETR4 atingir R$ 42,00'
    },
    {
      id: 'percentage',
      name: 'Variação Diária',
      description: 'Alerta quando a variação do dia ultrapassar um percentual',
      icon: Percent,
      color: 'amber',
      example: 'Ex: VALE3 subir ou cair 5%'
    },
    {
      id: 'volume',
      name: 'Volume Negociado',
      description: 'Alerta quando a quantidade de ações negociadas ultrapassar um valor',
      icon: Volume2,
      color: 'purple',
      example: 'Ex: ITUB4 negociar mais de 1 milhão de ações'
    }
  ];

  const conditions = [
    { 
      value: '>', 
      label: 'Quando subir acima de',
      shortLabel: 'Subir acima',
      icon: ArrowUp,
      description: 'Alerta quando o valor SUBIR e ultrapassar o alvo',
      color: 'emerald',
      example: 'Exemplo: PETR4 subir acima de R$ 40'
    },
    { 
      value: '<', 
      label: 'Quando cair abaixo de',
      shortLabel: 'Cair abaixo',
      icon: ArrowDown,
      description: 'Alerta quando o valor CAIR e ficar abaixo do alvo',
      color: 'red',
      example: 'Exemplo: VALE3 cair abaixo de R$ 60'
    },
    { 
      value: '>=', 
      label: 'Quando chegar em',
      shortLabel: 'Chegar em',
      icon: TrendingUp,
      description: 'Alerta quando chegar no valor (subindo ou já estiver)',
      color: 'indigo',
      example: 'Exemplo: ITUB4 chegar em R$ 30'
    },
    { 
      value: '<=', 
      label: 'Quando cair para',
      shortLabel: 'Cair para',
      icon: TrendingDown,
      description: 'Alerta quando cair para o valor (descendo ou já estiver)',
      color: 'orange',
      example: 'Exemplo: BBDC4 cair para R$ 15'
    }
  ];

  const filteredStocks = popularStocks.filter(stock =>
    stock.ticker.toLowerCase().includes(searchTicker.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTicker.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.ticker || !formData.alertType || !formData.condition || !formData.targetValue || !userId) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const payload: CreateAlertPayload = {
        user_id: userId,
        ticker: formData.ticker,
        alert_type: formData.alertType,
        target_value: parseFloat(formData.targetValue),
        condition: formData.condition,
      };
      await alertsAPI.create(payload);
      setShowSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erro ao criar alerta');
    } finally {
      setLoading(false);
    }
  };

  const selectedCondition = conditions.find(c => c.value === formData.condition);
  const selectedType = alertTypes.find(t => t.id === formData.alertType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button 
            onClick={() => step === 1 ? router.push('/dashboard') : setStep(step - 1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{step === 1 ? 'Voltar ao Dashboard' : 'Voltar'}</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Criar Novo Alerta</h1>
              <p className="text-slate-400">Configure um alerta personalizado em 4 passos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          {[
            { num: 1, label: 'Ação', icon: Target },
            { num: 2, label: 'Tipo', icon: Zap },
            { num: 3, label: 'Quando', icon: TrendingUp },
            { num: 4, label: 'Valor', icon: DollarSign }
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                    step >= s.num
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {step > s.num ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-sm font-bold ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    step > s.num ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          
          {/* Step 1: Selecionar Ação */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Qual ação você quer monitorar?</h2>
                <p className="text-slate-400 mb-6">Selecione ou busque uma ação da B3</p>
                
                <input
                  type="text"
                  placeholder="🔍 Buscar ação... (ex: PETR4, Vale, Itaú)"
                  value={searchTicker}
                  onChange={(e) => setSearchTicker(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all mb-6"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => setFormData({ ...formData, ticker: stock.ticker })}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      formData.ticker === stock.ticker
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <p className="font-black text-white text-xl mb-1">{stock.ticker}</p>
                    <p className="text-sm text-slate-400 truncate">{stock.name}</p>
                    <p className="text-xs text-slate-600 mt-1">{stock.sector}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => formData.ticker && setStep(2)}
                disabled={!formData.ticker}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 2: Tipo de Alerta */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Que tipo de alerta você quer?</h2>
                <p className="text-slate-400 mb-6">Escolha o indicador que deseja monitorar</p>
              </div>

              <div className="space-y-4">
                {alertTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, alertType: type.id })}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                        formData.alertType === type.id
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-white text-xl mb-2">{type.name}</h3>
                        <p className="text-slate-400 text-sm mb-2">{type.description}</p>
                        <p className="text-xs text-slate-600 font-mono">{type.example}</p>
                      </div>
                      {formData.alertType === type.id && (
                        <CheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => formData.alertType && setStep(3)}
                  disabled={!formData.alertType}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Condição */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Quando você quer ser alertado?</h2>
                <p className="text-slate-400 mb-6">Escolha em que momento o alerta deve disparar</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.map((cond) => {
                  const Icon = cond.icon;
                  const isSelected = formData.condition === cond.value;
                  
                  return (
                    <button
                      key={cond.value}
                      onClick={() => setFormData({ ...formData, condition: cond.value })}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cond.color === 'emerald' ? 'bg-emerald-500/20' :
                          cond.color === 'red' ? 'bg-red-500/20' :
                          cond.color === 'indigo' ? 'bg-indigo-500/20' :
                          'bg-orange-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            cond.color === 'emerald' ? 'text-emerald-400' :
                            cond.color === 'red' ? 'text-red-400' :
                            cond.color === 'indigo' ? 'text-indigo-400' :
                            'text-orange-400'
                          }`} />
                        </div>
                        {isSelected && <CheckCircle className="w-6 h-6 text-indigo-400" />}
                      </div>
                      <h3 className="font-black text-white text-xl mb-2">{cond.label}</h3>
                      <p className="text-sm text-slate-400 mb-2">{cond.description}</p>
                      <p className="text-xs text-slate-600 font-mono">{cond.example}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => formData.condition && setStep(4)}
                  disabled={!formData.condition}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Valor Alvo */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Qual o valor alvo?</h2>
                <p className="text-slate-400 mb-6">
                  Digite o valor que dispara o alerta
                </p>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6 mb-6">
                <p className="text-sm text-indigo-400 font-bold mb-3">📋 RESUMO DO ALERTA</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-slate-400">Ação:</span>
                    <span className="text-2xl font-black text-white">{formData.ticker}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-slate-400">Tipo:</span>
                    <span className="text-xl font-bold text-indigo-400">{selectedType?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-slate-400">Quando:</span>
                    <span className="text-xl font-bold text-purple-400">{selectedCondition?.label}</span>
                  </div>
                </div>
              </div>

              {/* Input de Valor */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Valor Alvo 
                  {formData.alertType === 'price' && ' (em Reais)'}
                  {formData.alertType === 'percentage' && ' (em %)'}
                  {formData.alertType === 'volume' && ' (quantidade de ações)'}
                </label>
                <input
                  type="number"
                  step={formData.alertType === 'volume' ? '1' : '0.01'}
                  placeholder={
                    formData.alertType === 'price' ? '0.00' :
                    formData.alertType === 'percentage' ? '0' :
                    formData.alertType === 'volume' ? '1000000' :
                    '0.00'
                  }
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-800/50 border-2 border-slate-700 rounded-xl text-white text-2xl font-bold placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                {formData.alertType === 'volume' && (
                  <p className="mt-2 text-sm text-slate-400">
                    💡 Dica: 1.000.000 = 1M de ações | 500.000 = 500K de ações
                  </p>
                )}
              </div>

              {/* Quick Values */}
              {formData.alertType === 'percentage' && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-400">Valores rápidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {[-10, -5, -3, 3, 5, 10].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData({ ...formData, targetValue: val.toString() })}
                        className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-sm font-bold transition-all"
                      >
                        {val > 0 ? '+' : ''}{val}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.alertType === 'volume' && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-400">Valores comuns:</p>
                  <div className="flex flex-wrap gap-2">
                    {[100000, 500000, 1000000, 5000000, 10000000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData({ ...formData, targetValue: val.toString() })}
                        className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-sm font-bold transition-all"
                      >
                        {val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.targetValue || loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {loading ? 'Criando...' : '🎯 Criar Alerta'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/50">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">Alerta Criado!</h3>
              <p className="text-slate-400 text-lg">
                Você será notificado quando <span className="font-bold text-white">{formData.ticker}</span> {selectedCondition?.label.toLowerCase()} {formData.targetValue}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}