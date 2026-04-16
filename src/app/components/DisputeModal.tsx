import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { projectId } from '../../utils/supabase';

interface DisputeModalProps {
  session: any;
  debtor: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DisputeModal({ session, debtor, onClose, onSuccess }: DisputeModalProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('contestacao_valor');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Por favor, descreva o motivo da contestação.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/${debtor.id}/dispute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: reason,
          reason: reason === 'contestacao_valor' ? 'Valor Incorreto' : reason === 'servico_nao_prestado' ? 'Serviço não prestado' : 'Outro',
          description
        })
      });

      if (res.ok) {
        toast.success('Disputa aberta com sucesso!');
        onSuccess();
      } else {
        toast.error('Erro ao abrir disputa');
      }
    } catch (error) {
      console.error('Error opening dispute:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Contestar Dívida</h2>
              <p className="text-sm text-slate-500">Pausar cobrança e iniciar análise</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="size-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
             <p className="text-sm text-slate-600 font-medium">Devedor: <span className="text-slate-900">{debtor.name}</span></p>
             <p className="text-sm text-slate-600 font-medium">Valor: <span className="text-slate-900">€{debtor.debtAmount.toLocaleString()}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Contestação</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="contestacao_valor">Valor Incorreto</option>
              <option value="pagamento_ja_realizado">Pagamento já realizado</option>
              <option value="servico_nao_prestado">Serviço não prestado</option>
              <option value="fraude">Suspeita de Fraude</option>
              <option value="outro">Outro Motivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              placeholder="Descreva o motivo da contestação e anexe protocolos se houver..."
            />
          </div>

          <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-100 flex items-start gap-2">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <p>
              Ao confirmar, o status do devedor mudará para <strong>Disputa</strong> e todas as ações automáticas de cobrança serão pausadas até a resolução.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <AlertTriangle className="size-4 mr-2" />}
            Confirmar Contestação
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
