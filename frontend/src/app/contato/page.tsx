'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, MessageSquare, Send, CheckCircle, AlertCircle, HelpCircle, Bug, Lightbulb, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'support',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { value: 'support', label: 'Suporte Técnico', icon: HelpCircle, color: 'indigo' },
    { value: 'bug', label: 'Reportar Bug', icon: Bug, color: 'red' },
    { value: 'feature', label: 'Sugerir Funcionalidade', icon: Lightbulb, color: 'amber' },
    { value: 'other', label: 'Outros Assuntos', icon: MessageSquare, color: 'purple' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Simula envio (você deve conectar com sua API real aqui)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', category: 'support', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Gatilho
              </h1>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="px-6 py-2.5 text-slate-300 hover:text-white font-semibold transition-colors">
                  Entrar
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
                  Começar Grátis
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-5xl font-black mb-4">Fale Conosco</h1>
            <p className="text-xl text-slate-400">
              Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Quick Contact Cards */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Mail className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Email</h3>
                <a href="mailto:suporte@gatilho.app" className="text-indigo-400 hover:text-indigo-300 text-sm">
                  suporte@gatilho.app
                </a>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Clock className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Horário de Atendimento</h3>
                <p className="text-slate-400 text-sm">
                  Segunda a Sexta<br />
                  9h às 18h (Brasília)
                </p>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <MapPin className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Localização</h3>
                <p className="text-slate-400 text-sm">
                  São Paulo, Brasil
                </p>
              </div>

              {/* FAQ Link */}
              <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Perguntas Frequentes</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Veja se sua dúvida já foi respondida
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">
                  Ver FAQ →
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                {status === 'success' && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400 font-semibold">
                      Mensagem enviada com sucesso! Responderemos em breve.
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 font-semibold">{errorMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-3">
                      Categoria
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              formData.category === cat.value
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${
                              formData.category === cat.value ? 'text-indigo-400' : 'text-slate-400'
                            }`} />
                            <p className="text-sm font-bold text-white">{cat.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="João Silva"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Assunto
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="Como posso ajudar?"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                      placeholder="Descreva sua dúvida ou sugestão com o máximo de detalhes..."
                      required
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Mínimo 10 caracteres
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Response Time Info */}
              <div className="mt-6 p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm text-center">
                  ⚡ <strong className="text-white">Tempo médio de resposta:</strong> 24 horas úteis
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Contact Methods */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-black text-white mb-8">Outras Formas de Contato</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-white font-bold mb-2">Suporte Geral</h3>
                <a href="mailto:suporte@gatilho.app" className="text-indigo-400 hover:text-indigo-300 text-sm">
                  suporte@gatilho.app
                </a>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bug className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-bold mb-2">Reportar Bug</h3>
                <a href="mailto:bugs@gatilho.app" className="text-purple-400 hover:text-purple-300 text-sm">
                  bugs@gatilho.app
                </a>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold mb-2">Sugestões</h3>
                <a href="mailto:sugestoes@gatilho.app" className="text-emerald-400 hover:text-emerald-300 text-sm">
                  sugestoes@gatilho.app
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">Gatilho</p>
                <p className="text-xs text-slate-500">Alertas Inteligentes</p>
              </div>
            </div>
            
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
              <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
              <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
            </div>
            
            <p className="text-sm text-slate-500">
              © 2025 Gatilho. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}