import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, BarChart3, Volume2, AlertCircle, CheckCircle, DollarSign, Percent, Target } from 'lucide-react';
import { AlertType, Condition, ColorKey } from '../../types';
import { getColorClasses } from '../../utils/colors';

const NewAlertForm = () => {
  const [step, setStep] = useState(1);

  interface FormData {
    ticker: string;
    alertType: AlertType | '';
    condition: Condition | '';
    targetValue: string;
  }

  const [formData, setFormData] = useState<FormData>({
    ticker: '',
    alertType: '',
    condition: '',
    targetValue: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
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

  const alertTypes: { id: AlertType, name: string, description: string, icon: React.ElementType, color: ColorKey, example: string }[] = [
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

  const conditions: { value: Condition, label: string, desc: string }[] = [
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
    const newErrors: Partial<Record<keyof FormData, string>> = {};
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

  const selectedType = alertTypes.find(t => t.id === formData.alertType) as typeof alertTypes[number] | undefined;

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
                      setFormData(prev => ({ ...prev, ticker: stock.ticker }));
                      setErrors(prev => ({ ...prev, ticker: undefined }));
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
                        setFormData(prev => ({ ...prev, alertType: type.id }));
                        setErrors(prev => ({ ...prev, alertType: undefined }));
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

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button
                  onClick={() => formData.alertType && setStep(3)}
                  disabled={!formData.alertType}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Condição */}
          {step === 3 && selectedType && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Defina a Condição</h2>
                <p className="text-gray-600 mb-6">Quando o {selectedType.name.toLowerCase()} deve disparar o alerta?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {conditions.map((condition) => (
                  <button
                    key={condition.value}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, condition: condition.value }));
                      setErrors(prev => ({ ...prev, condition: undefined }));
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.condition === condition.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                    }`}
                  >
                    <p className="font-bold text-gray-900 text-lg">{condition.label}</p>
                    <p className="text-sm text-gray-600">{condition.desc}</p>
                  </button>
                ))}
              </div>

              {errors.condition && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.condition}
                </p>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button
                  onClick={() => formData.condition && setStep(4)}
                  disabled={!formData.condition}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Valor Alvo */}
          {step === 4 && selectedType && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Qual o Valor Alvo?</h2>
                <p className="text-gray-600 mb-6">Digite o valor que o {selectedType.name.toLowerCase()} deve atingir.</p>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step={selectedType.id === 'price' ? "0.01" : "1"}
                  placeholder={selectedType.example.split(' ')[2]}
                  value={formData.targetValue}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, targetValue: e.target.value }));
                    setErrors(prev => ({ ...prev, targetValue: undefined }));
                  }}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {selectedType.id === 'price' && <DollarSign className="w-5 h-5" />}
                  {selectedType.id === 'percentage' && <Percent className="w-5 h-5" />}
                  {selectedType.id === 'volume' && <Volume2 className="w-5 h-5" />}
                </div>
              </div>

              {errors.targetValue && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetValue}
                </p>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.targetValue || Object.keys(errors).some(k => errors[k as keyof FormData])}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Criar Alerta
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alerta Criado com Sucesso!</h2>
              <p className="text-gray-600">Seu alerta para {formData.ticker} foi ativado e está sendo monitorado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewAlertForm;
