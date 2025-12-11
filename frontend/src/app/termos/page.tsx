import Link from 'next/link';
import { Zap, FileText, AlertCircle, CheckCircle, Shield } from 'lucide-react';

export default function TermsPage() {
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
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-5xl font-black mb-4">Termos de Uso</h1>
            <p className="text-slate-400">Última atualização: 11 de dezembro de 2025</p>
          </div>

          {/* Alert */}
          <div className="mb-12 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold mb-2">Importante</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Ao usar o Gatilho, você concorda com estes termos. Leia com atenção antes de utilizar nossos serviços.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black text-white mb-4">1. Aceitação dos Termos</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Ao acessar e usar o Gatilho ("Serviço"), você aceita e concorda em cumprir estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deverá usar o Serviço.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em 
                vigor imediatamente após a publicação. Seu uso contínuo do Serviço após as alterações constitui 
                aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">2. Descrição do Serviço</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                O Gatilho é uma plataforma que fornece alertas personalizados sobre movimentos de ações negociadas 
                na B3 (Brasil, Bolsa, Balcão). O Serviço permite:
              </p>
              <ul className="space-y-2 text-slate-300">
                {[
                  'Criar alertas de preço, variação percentual e volume',
                  'Receber notificações por email quando alertas são disparados',
                  'Acompanhar histórico de alertas',
                  'Gerenciar múltiplos alertas simultaneamente'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">3. Isenção de Responsabilidade</h2>
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-amber-400 font-bold mb-2">Aviso Importante sobre Investimentos</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      O Gatilho é uma ferramenta de notificação e NÃO fornece recomendações de investimento. 
                      Não somos consultores financeiros e não oferecemos aconselhamento sobre compra ou venda de ativos.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">3.1</span>
                  <span>
                    Os alertas são baseados em dados de mercado de terceiros e podem conter atrasos ou imprecisões
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">3.2</span>
                  <span>
                    Não garantimos que o Serviço estará disponível 24/7 ou livre de erros
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">3.3</span>
                  <span>
                    Você é o único responsável por suas decisões de investimento
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">3.4</span>
                  <span>
                    Investimentos envolvem riscos e você pode perder parte ou todo o seu capital
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">4. Conta de Usuário</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Para usar o Serviço, você deve criar uma conta. Ao criar uma conta, você concorda em:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">4.1</span>
                  <span>Fornecer informações precisas e atualizadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">4.2</span>
                  <span>Manter a segurança de sua senha</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">4.3</span>
                  <span>Ser responsável por todas as atividades em sua conta</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">4.4</span>
                  <span>Notificar-nos imediatamente sobre qualquer uso não autorizado</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">5. Uso Aceitável</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Você concorda em NÃO:
              </p>
              <ul className="space-y-2 text-slate-300">
                {[
                  'Usar o Serviço para qualquer finalidade ilegal',
                  'Tentar obter acesso não autorizado ao sistema',
                  'Criar múltiplas contas para contornar limitações',
                  'Fazer engenharia reversa ou copiar qualquer parte do Serviço',
                  'Usar o Serviço de forma que possa danificar ou sobrecarregar nossos sistemas',
                  'Revender ou redistribuir o Serviço sem autorização'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-bold text-white">5.{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">6. Propriedade Intelectual</h2>
              <p className="text-slate-300 leading-relaxed">
                Todo o conteúdo, recursos e tecnologia do Gatilho são de propriedade exclusiva nossa e protegidos 
                por leis de direitos autorais e propriedade intelectual. Você recebe apenas uma licença limitada e 
                não exclusiva para usar o Serviço conforme descrito nestes termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Na extensão máxima permitida por lei, o Gatilho não será responsável por:
              </p>
              <ul className="space-y-2 text-slate-300">
                {[
                  'Perdas financeiras resultantes de decisões de investimento',
                  'Danos indiretos, incidentais ou consequenciais',
                  'Perda de lucros, dados ou oportunidades',
                  'Interrupções ou erros no Serviço'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-bold text-white">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">8. Rescisão</h2>
              <p className="text-slate-300 leading-relaxed">
                Podemos suspender ou encerrar sua conta a qualquer momento, com ou sem aviso prévio, por violação 
                destes termos. Você pode encerrar sua conta a qualquer momento através das configurações da conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">9. Lei Aplicável</h2>
              <p className="text-slate-300 leading-relaxed">
                Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas nos tribunais 
                competentes do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">10. Contato</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Para dúvidas sobre estes termos, entre em contato:
              </p>
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                <p className="text-white font-bold mb-2">Email</p>
                <a href="mailto:legal@gatilho.app" className="text-indigo-400 hover:text-indigo-300">
                  legal@gatilho.app
                </a>
              </div>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl text-center">
            <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">Tem dúvidas sobre os termos?</h3>
            <p className="text-slate-300 mb-6">
              Nossa equipe está pronta para ajudar você
            </p>
            <Link href="/contato">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all">
                Entre em Contato
              </button>
            </Link>
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