import Link from 'next/link';
import { Zap, TrendingUp, Bell, Shield, Sparkles, ArrowRight, CheckCircle2, Target, BarChart3, Clock } from 'lucide-react';

export default function HomePage() {
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
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Gatilho
                </h1>
              </div>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-bold mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Alertas Inteligentes para Investidores
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              Monitore suas ações em
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                tempo real
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed">
              Receba notificações instantâneas quando suas ações da B3 atingirem os valores que você definiu. 
              <span className="text-white font-semibold"> 100% gratuito.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/sobre">
                <button className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">
                  Saiba Mais
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Alertas ilimitados
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Setup em 2 minutos
              </div>
            </div>
          </div>

          {/* Preview Dashboard Card */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Target, label: '12 Alertas Ativos', color: 'emerald' },
                  { icon: Bell, label: '8 Disparados Hoje', color: 'indigo' },
                  { icon: TrendingUp, label: '4 Ações Monitoradas', color: 'purple' }
                ].map((stat, i) => (
                  <div key={i} className={`p-4 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 border border-${stat.color}-500/20 rounded-xl`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-2`} />
                    <p className="text-white font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">VALE3</p>
                      <p className="text-slate-400 text-sm">Preço Alvo</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                    Ativo
                  </span>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-xs mb-1">CONDIÇÃO</p>
                  <p className="text-indigo-400 font-bold mb-2">Quando atingir</p>
                  <p className="text-white text-2xl font-black">R$ 65,50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tudo que você precisa para
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                investir com confiança
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Ferramentas profissionais, totalmente gratuitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Alertas de Preço',
                description: 'Defina o preço alvo e seja notificado quando sua ação atingir o valor',
                color: 'emerald'
              },
              {
                icon: BarChart3,
                title: 'Alertas de Variação',
                description: 'Monitore mudanças percentuais diárias e semanais automaticamente',
                color: 'amber'
              },
              {
                icon: Bell,
                title: 'Notificações Instantâneas',
                description: 'Receba alertas por email assim que suas condições forem atingidas',
                color: 'indigo'
              },
              {
                icon: TrendingUp,
                title: 'Histórico Completo',
                description: 'Acompanhe todos os alertas disparados e analise suas decisões',
                color: 'purple'
              },
              {
                icon: Clock,
                title: 'Monitoramento 24/7',
                description: 'Sistema verifica suas ações a cada 5 minutos durante o pregão',
                color: 'pink'
              },
              {
                icon: Shield,
                title: '100% Seguro',
                description: 'Seus dados protegidos com criptografia de ponta a ponta',
                color: 'cyan'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
                <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Pronto para começar?
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Crie sua conta gratuitamente e comece a monitorar suas ações em segundos
              </p>
              <Link href="/signup">
                <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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