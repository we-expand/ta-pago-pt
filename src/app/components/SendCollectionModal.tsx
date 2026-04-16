import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Wand2, Send, Mail, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import { projectId } from '../../../utils/supabase/info';

interface SendCollectionModalProps {
  debtor: any;
  onClose: () => void;
  session: any;
}

export default function SendCollectionModal({ debtor, onClose, session }: SendCollectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [tone, setTone] = useState<'friendly' | 'firm' | 'urgent'>('friendly');
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'config' | 'preview'>('config');
  const [lastMessage, setLastMessage] = useState('');

  const handleGeneratePreview = async () => {
    try {
      setGenerating(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/ai/preview`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            debtorName: debtor.name,
            amount: debtor.debtAmount,
            daysOverdue: Math.floor((Date.now() - new Date(debtor.dueDate).getTime()) / (1000 * 60 * 60 * 24)),
            dueDate: debtor.dueDate,
            tone,
            lastDebtorMessage: lastMessage
          })
        }
      );

      if (!response.ok) throw new Error('Falha ao gerar preview');
      
      const data = await response.json();
      setPreviewMessage(data.message);
      setStep('preview');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao gerar mensagem com IA');
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/email/collection`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            debtorId: debtor.id,
            useAI,
            tone
          })
        }
      );

      if (!response.ok) throw new Error('Falha ao enviar cobrança');
      
      const data = await response.json();
      toast.success(data.message || 'Cobrança enviada com sucesso!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar cobrança');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Mail className="size-5 text-indigo-600" />
              Enviar Cobrança
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Para: <span className="font-semibold text-slate-700">{debtor.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === 'config' ? (
            <>
              {/* AI Toggle */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  useAI ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setUseAI(!useAI)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${useAI ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Wand2 className="size-5" />
                    </div>
                    <span className="font-bold text-slate-900">IA Generativa (Google Gemini)</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${useAI ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${useAI ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
                <p className="text-sm text-slate-600 pl-11">
                  Criar mensagem personalizada baseada no perfil e comportamento do devedor.
                </p>
              </div>

              {/* Tone Selection */}
              {useAI && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Tom de Voz</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTone('friendly')}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          tone === 'friendly' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        🤝 Amigável
                      </button>
                      <button
                        onClick={() => setTone('firm')}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          tone === 'firm' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        ⚖️ Firme
                      </button>
                      <button
                        onClick={() => setTone('urgent')}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          tone === 'urgent' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        🚨 Urgente
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Contexto (Opcional)</label>
                    <textarea
                      value={lastMessage}
                      onChange={(e) => setLastMessage(e.target.value)}
                      placeholder="Cole aqui a última mensagem do devedor ou adicione um contexto específico (ex: 'Cliente disse que paga dia 15'). A IA usará isso para adaptar a resposta."
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-slate-400 mt-0.5" />
                  <div className="text-sm text-slate-600">
                    <p className="mb-1"><strong>Canal:</strong> Email (Resend API)</p>
                    <p>O email incluirá automaticamente um link seguro de pagamento e detalhes da dívida.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
               <div className="flex items-center justify-between mb-2">
                 <h3 className="font-bold text-slate-900">Pré-visualização da Mensagem</h3>
                 <button 
                   onClick={() => setStep('config')}
                   className="text-sm text-indigo-600 font-semibold hover:underline"
                 >
                   Editar Configurações
                 </button>
               </div>
               
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-sm max-h-[300px] overflow-y-auto"
                 dangerouslySetInnerHTML={{ __html: previewMessage || '' }}
               />
               
               <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                 <CheckCircle2 className="size-3 text-green-500" />
                 <span>Link de pagamento será anexado automaticamente ao final do email.</span>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          
          {useAI && step === 'config' ? (
            <InteractiveButton
              onClick={handleGeneratePreview}
              disabled={generating}
              loading={generating}
              variant="secondary"
              icon={<Wand2 className="size-4" />}
            >
              Gerar Preview com IA
            </InteractiveButton>
          ) : (
            <InteractiveButton
              onClick={handleSend}
              disabled={loading}
              loading={loading}
              variant="primary"
              icon={<Send className="size-4" />}
            >
              {step === 'preview' ? 'Confirmar e Enviar' : 'Enviar Agora'}
            </InteractiveButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}