import Link from 'next/link';
import { Zap, Shield, Lock, Eye, Database, UserCheck, FileText, Mail, CheckCircle } from 'lucide-react';

export default function PrivacyPage() {
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
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-5xl font-black mb-4">Política de Privacidade</h1>
            <p className="text-slate-400">Última atualização: 11 de dezembro de 2025</p>
          </div>

          {/* LGPD Badge */}
          <div className="mb-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold mb-2">Conformidade LGPD</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Nossa política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                  e respeita todos os seus direitos de privacidade.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-indigo-400" />
                1. Dados que Coletamos
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Coletamos apenas os dados necessários para fornecer nossos serviços:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-white font-bold mb-2">1.1 Dados de Cadastro</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Nome completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Endereço de email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Senha (armazenada com criptografia bcrypt)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-white font-bold mb-2">1.2 Dados de Uso</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Alertas criados (ticker, tipo, valores)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Histórico de alertas disparados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Preferências de notificação</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-white font-bold mb-2">1.3 Dados Técnicos</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Endereço IP (para segurança)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Tipo de navegador e dispositivo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Logs de acesso (para diagnóstico)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-purple-400" />
                2. Como Usamos Seus Dados
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Utilizamos seus dados exclusivamente para:
              </p>
              <ul className="space-y-3 text-slate-300">
                {[
                  'Fornecer o serviço de alertas personalizados',
                  'Enviar notificações por email quando alertas são disparados',
                  'Melhorar e personalizar sua experiência',
                  'Garantir a segurança da plataforma',
                  'Cumprir obrigações legais',
                  'Comunicar atualizações importantes do serviço'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-400" />
                3. Segurança dos Dados
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Implementamos medidas rigorosas de segurança:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Lock, title: 'Criptografia', desc: 'Senhas com bcrypt, dados em trânsito com HTTPS' },
                  { icon: Shield, title: 'Firewall', desc: 'Proteção contra ataques e acessos não autorizados' },
                  { icon: Database, title: 'Backups', desc: 'Backups regulares e armazenamento seguro' },
                  { icon: Eye, title: 'Monitoramento', desc: 'Vigilância 24/7 de atividades suspeitas' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-white font-bold">{item.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-emerald-400" />
                4. Seus Direitos (LGPD)
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                De acordo com a LGPD, você tem direito a:
              </p>
              <div className="space-y-3">
                {[
                  { title: 'Acesso', desc: 'Solicitar cópia de todos os seus dados' },
                  { title: 'Correção', desc: 'Atualizar dados incorretos ou desatualizados' },
                  { title: 'Exclusão', desc: 'Solicitar a exclusão permanente dos seus dados' },
                  { title: 'Portabilidade', desc: 'Exportar seus dados em formato legível' },
                  { title: 'Revogação', desc: 'Retirar consentimento a qualquer momento' },
                  { title: 'Informação', desc: 'Saber com quem compartilhamos seus dados' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-slate-300 text-sm">
                  Para exercer qualquer um desses direitos, entre em contato através de{' '}
                  <a href="mailto:privacidade@gatilho.app" className="text-indigo-400 hover:text-indigo-300 font-bold">
                    privacidade@gatilho.app
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">5. Compartilhamento de Dados</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong className="text-white">NÃO vendemos seus dados.</strong> Compartilhamos apenas quando estritamente necessário:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">•</span>
                  <span>
                    <strong>Provedores de Email:</strong> Para envio de notificações (ex: SendGrid)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">•</span>
                  <span>
                    <strong>Hospedagem:</strong> Servidores seguros para armazenamento de dados
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white">•</span>
                  <span>
                    <strong>Cumprimento Legal:</strong> Quando exigido por lei ou ordem judicial
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">6. Cookies e Tecnologias</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Usamos tecnologias essenciais para o funcionamento do serviço:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-white font-bold mb-2">Cookies Essenciais</h3>
                  <p className="text-slate-400 text-sm">
                    Necessários para manter você logado e garantir funcionalidades básicas
                  </p>
                </div>
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-white font-bold mb-2">Local Storage</h3>
                  <p className="text-slate-400 text-sm">
                    Armazena preferências e configurações localmente no seu navegador
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                <strong className="text-white">Não usamos cookies de rastreamento ou publicidade.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">7. Retenção de Dados</h2>
              <p className="text-slate-300 leading-relaxed">
                Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, seus dados são 
                removidos permanentemente em até 30 dias, exceto quando a retenção for exigida por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">8. Menores de Idade</h2>
              <p className="text-slate-300 leading-relaxed">
                Nosso serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente dados de 
                menores. Se descobrirmos que coletamos dados de um menor, excluiremos imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">9. Alterações na Política</h2>
              <p className="text-slate-300 leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por 
                email. O uso continuado do serviço após as alterações constitui aceitação da nova política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">10. Contato</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <Mail className="w-8 h-8 text-indigo-400 mb-3" />
                  <h3 className="text-white font-bold mb-2">Privacidade</h3>
                  <a href="mailto:privacidade@gatilho.app" className="text-indigo-400 hover:text-indigo-300 text-sm">
                    privacidade@gatilho.app
                  </a>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <FileText className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-white font-bold mb-2">DPO (Encarregado)</h3>
                  <a href="mailto:dpo@gatilho.app" className="text-purple-400 hover:text-purple-300 text-sm">
                    dpo@gatilho.app
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">Sua privacidade é prioridade</h3>
            <p className="text-slate-300 mb-6">
              Estamos comprometidos em proteger seus dados com o máximo rigor
            </p>
            <Link href="/contato">
              <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all">
                Fale Conosco
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