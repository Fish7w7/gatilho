import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, BarChart3, Volume2, AlertCircle, CheckCircle, DollarSign, Percent, Target } from 'lucide-react';

const NewAlertForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ticker: '',
    alertType: '',
    condition: '',
    targetValue: ''
  });

  const [errors, setErrors] = useState({});
  const [searchTicker, setSearchTicker] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const popularStocks = [
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
      name: 'Preço',
      description: 'Alerta quando o preço atingir um valor específico',
      icon: DollarSign,
      color: 'emerald',
      example: 'Ex: PETR4 > R$ 42,00'
    },
    {
      id: 'percentage',
      name: 'Variação %',
      description: 'Alerta quando a variação percentual do dia atingir um limite',
      icon: Percent,
      color: 'amber',
      example: 'Ex: VALE3 < -5%'
    },
    {
      id: 'volume',
      name: 'Volume',
      description: 'Alerta quando o volume negociado ultrapassar um valor',
      icon: Volume2,
      color: 'purple',
      example: 'Ex: ITUB4 > 1.000.000'
    }
  ];

  const conditions = [
    { value: '>', label: 'Maior que (>)', desc: 'Ativa quando subir acima do alvo' },
    { value: '<', label: 'Menor que (<)', desc: 'Ativa quando cair abaixo do alvo' },
    { value: '>=', label: 'Maior ou igual (≥)', desc: 'Ativa quando atingir ou superar' },
    { value: '<=', label: 'Menor ou igual (≤)', desc: 'Ativa quando atingir ou cair' }
  ];

  const filteredStocks = popularStocks.filter(stock =>
    stock.ticker.toLowerCase().includes(searchTicker.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTicker.toLowerCase())
  );

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.ticker) newErrors.ticker = 'Selecione uma ação';
    if (!formData.alertType) newErrors.alertType = 'Selecione o tipo de alerta';
    if (!formData.condition) newErrors.condition = 'Selecione uma condição';
    if (!formData.targetValue) newErrors.targetValue = 'Digite o valor alvo';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({ ticker: '', alertType: '', condition: '', targetValue: '' });
      setStep(1);
    }, 2000);
  };

  const getColorClasses = (color) => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-600',
        hover: 'hover:bg-emerald-100',
        selected: 'border-emerald-500 bg-emerald-50'
      },
      amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-600',
        hover: 'hover:bg-amber-100',
        selected: 'border-amber-500 bg-amber-50'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-100',
        selected: 'border-purple-500 bg-purple-50'
      }
    };
    return colors[color] || colors.emerald;
  };

  const selectedType = alertTypes.find(t => t.id === formData.alertType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Criar Novo Alerta</h1>
              <p className="text-gray-600">Configure um alerta personalizado para suas ações</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {[1, 2, 3, 4].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-semibold ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s === 1 && 'Ação'}
                    {s === 2 && 'Tipo'}
                    {s === 3 && 'Condição'}
                    {s === 4 && 'Valor'}
                  </p>
                </div>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                  step > s ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          
          {/* Step 1: Selecionar Ação */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Qual ação você quer monitorar?</h2>
                <p className="text-gray-600 mb-6">Selecione ou busque uma ação da B3</p>
                
                <input
                  type="text"
                  placeholder="🔍 Buscar ação... (ex: PETR4, Vale, Itaú)"
                  value={searchTicker}
                  onChange={(e) => setSearchTicker(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all mb-6"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => {
                      setFormData({ ...formData, ticker: stock.ticker });
                      setErrors({ ...errors, ticker: null });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.ticker === stock.ticker
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                    }`}
                  >
                    <p className="font-bold text-gray-900 text-lg">{stock.ticker}</p>
                    <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{stock.sector}</p>
                  </button>
                ))}
              </div>

              {errors.ticker && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ticker}
                </p>
              )}

              <button
                onClick={() => formData.ticker && setStep(2)}
                disabled={!formData.ticker}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 2: Tipo de Alerta */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Que tipo de alerta você quer?</h2>
                <p className="text-gray-600 mb-6">Escolha o indicador que deseja monitorar</p>
              </div>

              <div className="space-y-4">
                {alertTypes.map((type) => {
                  const Icon = type.icon;
                  const colors = getColorClasses(type.color);
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setFormData({ ...formData, alertType: type.id });
                        setErrors({ ...errors, alertType: null });
                      }}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                        formData.alertType === type.id
                          ? colors.selected
                          : `border-gray-200 ${colors.hover}`
                      }`}
                    >
                      <div className={`${colors.bg} ${colors.text} p-3 rounded-xl`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{type.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{type.description}</p>
                        <p className="text-xs text-gray-400 font-mono">{type.example}</p>
                      </div>
                      {formData.alertType === type.id && (
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {errors.alertType && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.alertType}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => formData.alertType && setStep(3)}
                  disabled={!formData.alertType}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Qual condição para disparar?</h2>
                <p className="text-gray-600 mb-6">Defina quando o alerta deve ser acionado</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.map((cond) => (
                  <button
                    key={cond.value}
                    onClick={() => {
                      setFormData({ ...formData, condition: cond.value });
                      setErrors({ ...errors, condition: null });
                    }}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.condition === cond.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold text-indigo-600">{cond.value}</span>
                      {formData.condition === cond.value && (
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{cond.label}</h3>
                    <p className="text-sm text-gray-600">{cond.desc}</p>
                  </button>
                ))}
              </div>

              {errors.condition && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.condition}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => formData.condition && setStep(4)}
                  disabled={!formData.condition}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Qual o valor alvo?</h2>
                <p className="text-gray-600 mb-6">
                  Digite o valor que {formData.condition === '>' || formData.condition === '>=' ? 'aciona' : 'dispara'} o alerta
                </p>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <p className="text-sm text-indigo-600 font-semibold mb-2">Resumo do Alerta</p>
                <div className="flex items-baseline gap-2 text-2xl font-bold text-gray-900">
                  <span>{formData.ticker}</span>
                  <span className="text-indigo-600">{formData.condition}</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.targetValue}
                    onChange={(e) => {
                      setFormData({ ...formData, targetValue: e.target.value });
                      setErrors({ ...errors, targetValue: null });
                    }}
                    className="flex-1 px-4 py-2 border-2 border-indigo-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                  <span className="text-gray-600 text-lg">
                    {formData.alertType === 'price' && 'R$'}
                    {formData.alertType === 'percentage' && '%'}
                  </span>
                </div>
                {selectedType && (
                  <p className="text-sm text-gray-600 mt-3">
                    Tipo: {selectedType.name}
                  </p>
                )}
              </div>

              {errors.targetValue && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetValue}
                </p>
              )}

              {/* Quick Values */}
              {formData.alertType === 'percentage' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Sugestões rápidas:</p>
                  <div className="flex flex-wrap gap-2">
                    {[-10, -5, -3, 3, 5, 10].map(val => (
                      <button
                        key={val}
                        onClick={() => setFormData({ ...formData, targetValue: val.toString() })}
                        className="px-4 py-2 bg-gray-100 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        {val > 0 ? '+' : ''}{val}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.targetValue}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  Criar Alerta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Alerta Criado!</h3>
              <p className="text-gray-600">
                Você será notificado quando {formData.ticker} {formData.condition} {formData.targetValue}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAlertForm;