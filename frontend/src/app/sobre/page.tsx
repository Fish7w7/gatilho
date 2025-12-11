import Link from 'next/link';
import { Zap, Target, Users, TrendingUp, Shield, Heart, ArrowRight, Mail } from 'lucide-react';

export default function AboutPage() {
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-bold mb-8">
            <Heart className="w-4 h-4" />
            Sobre o Gatilho
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Feito por investidores,
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              para investidores
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed">
            O Gatilho nasceu da frustração de perder oportunidades no mercado por não acompanhar 
            cada movimento das ações. Nossa missão é democratizar o acesso a alertas inteligentes 
            para todos os investidores brasileiros.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">Nossa História</h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Em 2025, percebemos que muitos investidores perdiam oportunidades valiosas no mercado 
                  simplesmente por não conseguirem acompanhar todas as suas ações em tempo real.
                </p>
                <p>
                  Ferramentas profissionais custavam milhares de reais por mês, enquanto as gratuitas 
                  eram limitadas ou cheias de anúncios. Decidimos que precisava existir algo melhor.
                </p>
                <p>
                  Assim nasceu o Gatilho: uma plataforma 100% gratuita, sem anúncios, focada em entregar 
                  exatamente o que o investidor precisa - alertas confiáveis no momento certo.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Missão</h3>
                      <p className="text-slate-400 text-sm">
                        Democratizar o acesso a ferramentas profissionais de investimento
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Valores</h3>
                      <p className="text-slate-400 text-sm">
                        Transparência, segurança e foco no usuário acima de tudo
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Visão</h3>
                      <p className="text-slate-400 text-sm">
                        Ser a plataforma #1 de alertas para o mercado brasileiro
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Números que Inspiram</h2>
            <p className="text-slate-400">Crescendo junto com nossos usuários</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '1.234+', label: 'Investidores Ativos', icon: Users },
              { value: '12.5K+', label: 'Alertas Criados', icon: Target },
              { value: '8.9K+', label: 'Alertas Disparados', icon: TrendingUp },
              { value: '100%', label: 'Gratuito', icon: Heart }
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all">
                <stat.icon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Junte-se a Nós
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Faça parte da comunidade de investidores que nunca mais perde uma oportunidade
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all">
                    Começar Agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/contato">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">
                    <Mail className="w-5 h-5" />
                    Fale Conosco
                  </button>
                </Link>
              </div>
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