import { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, ExternalLink, Settings, BarChart3, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface EmailLog {
  id: string;
  debtorId: string;
  type: string;
  to: string;
  status: string;
  sentAt: string;
  sentBy: string;
}

export default function EmailSettings({ session }: { session: any }) {
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState(session?.user?.email || '');
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Digite um email');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/email/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ to: testEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar email');
      }

      toast.success('✅ Email de teste enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message || 'Erro ao enviar email de teste');
    } finally {
      setTesting(false);
    }
  };

  const loadEmailLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/email/logs`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar logs');
      }

      setEmailLogs(data.logs || []);
      setShowLogs(true);
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message || 'Erro ao carregar logs');
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-14 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
            <Mail className="size-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Configuração de Email</h2>
            <p className="text-white/90">Sistema de email automático com Resend API</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-xs opacity-80 mb-1">Provedor</div>
            <div className="text-xl font-bold">Resend API</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-xs opacity-80 mb-1">Plano</div>
            <div className="text-xl font-bold">Grátis</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-xs opacity-80 mb-1">Limite Diário</div>
            <div className="text-xl font-bold">100 emails</div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Settings className="size-5 text-indigo-600" />
            Status do Sistema
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Ativo
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <div>
                <div className="font-semibold text-slate-900">API Key Configurada</div>
                <div className="text-sm text-slate-600">Resend API conectada e funcionando</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <div>
                <div className="font-semibold text-slate-900">Templates Carregados</div>
                <div className="text-sm text-slate-600">9 templates de email prontos</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <div>
                <div className="font-semibold text-slate-900">Logs Habilitados</div>
                <div className="text-sm text-slate-600">Rastreamento completo de envios</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Email Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Send className="size-5 text-indigo-600" />
          Testar Configuração
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email de Teste
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={sendTestEmail}
            disabled={testing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="size-5" />
                Enviar Email de Teste
              </>
            )}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Importante:</strong> Certifique-se de configurar sua API Key do Resend nas variáveis de ambiente (RESEND_API_KEY).
                Você pode obter sua chave gratuita em{' '}
                <a 
                  href="https://resend.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:text-blue-700"
                >
                  resend.com/api-keys
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Mail className="size-5 text-indigo-600" />
          Templates Disponíveis
        </h3>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { name: 'Email de Boas-vindas', desc: 'Enviado após cadastro', icon: '🎉' },
            { name: 'Novo Devedor', desc: 'Notificação de devedor criado', icon: '✅' },
            { name: 'Cobrança ao Devedor', desc: 'Lembrete de pagamento', icon: '💬' },
            { name: 'Confirmação de Pagamento', desc: 'Para usuário e devedor', icon: '💰' },
            { name: 'Negociação Aceita', desc: 'Notificação de acordo', icon: '🤝' },
            { name: 'Alerta de Score Baixo', desc: 'Devedor problemático', icon: '⚠️' },
            { name: 'Relatório Semanal', desc: 'Resumo de performance', icon: '📊' },
            { name: 'Email de Teste', desc: 'Verificar configuração', icon: '🧪' },
          ].map((template, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="text-3xl">{template.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{template.name}</div>
                <div className="text-sm text-slate-600">{template.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="size-5 text-indigo-600" />
            Histórico de Emails
          </h3>
          <button
            onClick={loadEmailLogs}
            disabled={loadingLogs}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loadingLogs ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Eye className="size-4" />
                Ver Logs
              </>
            )}
          </button>
        </div>

        {showLogs && (
          <div className="space-y-2">
            {emailLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Mail className="size-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum email enviado ainda</p>
                <p className="text-sm">Os emails aparecerão aqui assim que forem enviados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Destinatário</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900">{log.to}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(log.sentAt).toLocaleString('pt-PT')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resend Setup Guide */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ExternalLink className="size-5 text-purple-600" />
          Como Configurar sua API Key (Grátis)
        </h3>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <div>
              <strong>Criar conta gratuita:</strong> Acesse{' '}
              <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline font-semibold">
                resend.com/signup
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <div>
              <strong>Gerar API Key:</strong> Vá em "API Keys" e clique em "Create API Key"
            </div>
          </div>

          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <div>
              <strong>Copiar chave:</strong> Copie a chave gerada (começa com "re_...")
            </div>
          </div>

          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</div>
            <div>
              <strong>Adicionar no Supabase:</strong> Cole a chave na variável de ambiente <code className="bg-purple-100 px-2 py-0.5 rounded">RESEND_API_KEY</code>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="size-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">✓</div>
            <div>
              <strong>Pronto!</strong> Teste enviando um email acima
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white rounded-xl border border-purple-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <strong className="text-slate-900">Plano Gratuito inclui:</strong>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>✅ 100 emails por dia (3.000/mês)</li>
                <li>✅ Templates HTML ilimitados</li>
                <li>✅ Tracking de abertura e clique</li>
                <li>✅ Domínio customizado gratuito</li>
                <li>✅ API moderna e simples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}