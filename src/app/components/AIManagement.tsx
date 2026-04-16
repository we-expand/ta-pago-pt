import { useState, useEffect } from 'react';
import { Brain, Sparkles, MessageSquare, Clock, Target, Info, Power, Zap, Mail, Phone, CheckCircle2, Edit3, Send, Eye } from 'lucide-react';
import { getSettings, updateSettings } from '../../utils/supabase';  // Fixed: removed one '../'
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from './ui/switch'; // Assuming shadcn switch exists or use standard input
import { Button } from './ui/button';

export default function AIManagement({ session }: { session: any }) {
  const [aiActive, setAiActive] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [settings, setSettings] = useState<any>({
    aiEnabled: false,
    messageGeneration: { enabled: true, tone: 'friendly', personalization: 'high' },
    timing: { enabled: true, analysisPeriod: 30, confidence: 75 },
    scoring: { enabled: true, updateFrequency: 'daily', factors: { age: 20, debtAmount: 30, daysOverdue: 25, paymentHistory: 25 } },
    automation: { enabled: true, autoSend: false, approvalRequired: true, maxActionsPerDay: 3 },
    channels: {
      email: { enabled: true, priority: 1, templates: { initial: 'Olá {nome}, notamos que há um valor pendente de {valor}...', reminder: 'Este é um lembrete sobre o valor pendente de {valor}...', urgent: 'Atenção: o prazo para pagamento está próximo...' } },
      whatsapp: { enabled: true, priority: 2, templates: { initial: 'Olá {nome}! 👋 Temos um valor pendente de {valor}...', reminder: 'Oi {nome}, só para lembrar do valor pendente...', urgent: '⚠️ Último aviso sobre o valor de {valor}' } },
      sms: { enabled: true, priority: 3, templates: { initial: '{nome}, valor pendente: {valor}. Pague em: {link}', reminder: 'Lembrete: {valor} pendente. Link: {link}', urgent: 'URGENTE: {valor} vencido. Evite juros: {link}' } },
      phone: { enabled: false, priority: 4, script: 'Bom dia/tarde, {nome}. Estou ligando sobre o valor pendente...' }
    }
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    generateSuggestions();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings(session.access_token);
      if (data.settings) {
        const loadedSettings = { ...settings, ...data.settings };
        setSettings(loadedSettings);
        setAiActive(loadedSettings.aiEnabled);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  function generateSuggestions() {
    const mockSuggestions = [
      { id: 1, debtor: 'João Silva', amount: '€1.250', daysOverdue: 15, score: 85, channel: 'whatsapp', message: 'Olá João! 👋 Percebi que o valor de €1.250 ainda está pendente...', timing: 'Amanhã às 10:30', reason: 'Alta probabilidade (85%)', type: 'high-priority' },
      { id: 2, debtor: 'Maria Santos', amount: '€3.400', daysOverdue: 45, score: 62, channel: 'email', message: 'Prezada Maria, notamos que o pagamento de €3.400 está pendente...', timing: 'Hoje às 14:00', reason: 'Score médio (62%)', type: 'medium-priority' },
      { id: 3, debtor: 'Pedro Costa', amount: '€8.900', daysOverdue: 8, score: 91, channel: 'phone', message: 'Ligação sugerida para discutir o valor de €8.900...', timing: 'Hoje às 16:00', reason: 'Score muito alto (91%)', type: 'high-priority' },
      { id: 4, debtor: 'Ana Ferreira', amount: '€560', daysOverdue: 22, score: 48, channel: 'sms', message: 'Ana, o valor de €560 está vencido...', timing: 'Amanhã às 9:00', reason: 'Score baixo (48%)', type: 'low-priority' }
    ];
    setSuggestions(mockSuggestions);
  }

  async function handleActivateAI() {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, aiEnabled: true };
      await updateSettings(session.access_token, updatedSettings);
      setSettings(updatedSettings);
      setAiActive(true);
      setShowActivationModal(false);
      toast.success('🚀 IA Ativada!');
      setTimeout(() => { toast.success('✅ Análise concluída! 4 novas sugestões.'); generateSuggestions(); }, 2000);
    } catch (error) { toast.error('Erro ao ativar IA'); } finally { setLoading(false); }
  }

  async function handleDeactivateAI() {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, aiEnabled: false };
      await updateSettings(session.access_token, updatedSettings);
      setSettings(updatedSettings);
      setAiActive(false);
      toast.success('IA desativada');
    } catch (error) { toast.error('Erro ao desativar IA'); } finally { setLoading(false); }
  }

  function handleApproveSuggestion(suggestion: any) {
    toast.success(`Ação enviada para ${suggestion.debtor}`);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header & Activation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Brain className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Inteligência Artificial</h1>
            <p className="text-slate-500 text-sm">Orquestração preditiva e automação de cobrança</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!aiActive ? (
            <button
              onClick={() => setShowActivationModal(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-full font-medium text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              <Sparkles className="size-4" />
              <span>Ativar Inteligência Artificial</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  IA ATIVA
               </div>
               <button onClick={handleDeactivateAI} className="text-slate-400 hover:text-rose-500 transition-colors">
                 <Power className="size-5" />
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Score Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-4 rounded-xl bg-emerald-50/50 border-l-4 border-emerald-500 flex flex-col justify-center">
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Score Alto (70-100)</span>
                <span className="size-2 rounded-full bg-emerald-500"></span>
             </div>
             <p className="text-sm font-medium text-emerald-900">Alta probabilidade de pagamento. Prioridade máxima.</p>
         </div>
         <div className="p-4 rounded-xl bg-amber-50/50 border-l-4 border-amber-500 flex flex-col justify-center">
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Score Médio (40-69)</span>
                <span className="size-2 rounded-full bg-amber-500"></span>
             </div>
             <p className="text-sm font-medium text-amber-900">Chance moderada. Requer estratégia personalizada.</p>
         </div>
         <div className="p-4 rounded-xl bg-rose-50/50 border-l-4 border-rose-500 flex flex-col justify-center">
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Score Baixo (0-39)</span>
                <span className="size-2 rounded-full bg-rose-500"></span>
             </div>
             <p className="text-sm font-medium text-rose-900">Baixa probabilidade. Considerar ações legais.</p>
         </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Suggestions (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {aiActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Zap className="size-4 text-amber-500" />
                    Ações Sugeridas
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-white border rounded-md text-slate-500">{suggestions.length} pendentes</span>
               </div>
               <div className="divide-y divide-slate-100">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-5 hover:bg-slate-50 transition-colors group">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                             <div className={`size-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                suggestion.score >= 70 ? 'bg-emerald-100 text-emerald-700' : 
                                suggestion.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                             }`}>
                                {suggestion.score}
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-900">{suggestion.debtor}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                   <span>{suggestion.amount}</span>
                                   <span>•</span>
                                   <span>{suggestion.daysOverdue} dias</span>
                                </div>
                             </div>
                          </div>
                          <span className={`self-start sm:self-center text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                             suggestion.type === 'high-priority' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                             {suggestion.type === 'high-priority' ? 'Alta Prioridade' : 'Normal'}
                          </span>
                       </div>
                       
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                          <p className="text-sm text-slate-600 italic">"{suggestion.message}"</p>
                       </div>

                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                             <Clock className="size-3" />
                             {suggestion.timing}
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={() => setSuggestions(suggestions.filter(s => s.id !== suggestion.id))}>Ignorar</Button>
                             <Button size="sm" onClick={() => handleApproveSuggestion(suggestion)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                               <Send className="size-3 mr-2" />
                               Aprovar
                             </Button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {suggestions.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                       <Brain className="size-12 mx-auto mb-3 opacity-20" />
                       <p>Nenhuma sugestão pendente no momento.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {!aiActive && (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Power className="size-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">IA Desativada</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">Ative a inteligência artificial para começar a receber análises preditivas e sugestões automáticas de cobrança.</p>
                <Button onClick={() => setShowActivationModal(true)} variant="outline">Ativar Sistema</Button>
             </div>
          )}
        </div>

        {/* Right Column: Configurations (Span 1) */}
        <div className="space-y-6">
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                 <Target className="size-4 text-indigo-500" />
                 Canais Ativos
              </h3>
              <div className="space-y-3">
                 <ChannelToggle 
                    icon={<Mail className="size-4" />} 
                    label="Email Automático" 
                    active={settings.channels.email.enabled} 
                    onToggle={(v) => setSettings({...settings, channels: {...settings.channels, email: {...settings.channels.email, enabled: v}}})} 
                 />
                 <ChannelToggle 
                    icon={<MessageSquare className="size-4" />} 
                    label="WhatsApp API" 
                    active={settings.channels.whatsapp.enabled} 
                    onToggle={(v) => setSettings({...settings, channels: {...settings.channels, whatsapp: {...settings.channels.whatsapp, enabled: v}}})} 
                 />
                 <ChannelToggle 
                    icon={<MessageSquare className="size-4" />} 
                    label="SMS Gateway" 
                    active={settings.channels.sms.enabled} 
                    onToggle={(v) => setSettings({...settings, channels: {...settings.channels, sms: {...settings.channels.sms, enabled: v}}})} 
                 />
              </div>
           </div>

           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                 <Target className="size-4 text-purple-500" />
                 Parâmetros de Score
              </h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-600">Idade da Dívida</span>
                       <span className="font-bold">{settings.scoring.factors.daysOverdue}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${settings.scoring.factors.daysOverdue}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-600">Histórico de Pagamento</span>
                       <span className="font-bold">{settings.scoring.factors.paymentHistory}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500 rounded-full" style={{ width: `${settings.scoring.factors.paymentHistory}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-600">Valor Total</span>
                       <span className="font-bold">{settings.scoring.factors.debtAmount}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${settings.scoring.factors.debtAmount}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Activation Modal */}
      <AnimatePresence>
        {showActivationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowActivationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="size-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Sparkles className="size-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Ativar Inteligência Artificial</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  O sistema analisará automaticamente os perfis de devedores e sugerirá as melhores estratégias.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowActivationModal(false)}>Cancelar</Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleActivateAI} disabled={loading}>
                  {loading ? 'Ativando...' : 'Confirmar Ativação'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChannelToggle({ icon, label, active, onToggle }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`size-8 rounded-lg flex items-center justify-center ${active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {icon}
                </div>
                <span className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
            </div>
            <Switch checked={active} onCheckedChange={onToggle} />
        </div>
    )
}