import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, DollarSign, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import GlassCard from './ui/GlassCard';
import { projectId } from '../../../utils/supabase/info';

interface PaymentAgreementModalProps {
  session: any;
  debtor: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentAgreementModal({ session, debtor, onClose, onSuccess }: PaymentAgreementModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Config, 2: Review
  
  // Form State
  const [totalAmount, setTotalAmount] = useState(debtor.debtAmount);
  const [downPayment, setDownPayment] = useState(0);
  const [installmentsCount, setInstallmentsCount] = useState(3);
  const [frequency, setFrequency] = useState('monthly'); // monthly, weekly, biweekly
  const [firstInstallmentDate, setFirstInstallmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [simulatedInstallments, setSimulatedInstallments] = useState<any[]>([]);

  useEffect(() => {
    simulatePlan();
  }, [totalAmount, downPayment, installmentsCount, frequency, firstInstallmentDate]);

  const simulatePlan = () => {
    const principal = totalAmount - downPayment;
    if (principal <= 0) {
      setSimulatedInstallments([]);
      return;
    }

    const installmentAmount = principal / installmentsCount;
    const installments = [];
    const startDate = new Date(firstInstallmentDate);

    for (let i = 0; i < installmentsCount; i++) {
      const date = new Date(startDate);
      if (frequency === 'monthly') {
        date.setMonth(startDate.getMonth() + i);
      } else if (frequency === 'weekly') {
        date.setDate(startDate.getDate() + (i * 7));
      } else if (frequency === 'biweekly') {
        date.setDate(startDate.getDate() + (i * 14));
      }

      installments.push({
        number: i + 1,
        amount: installmentAmount,
        dueDate: date.toISOString().split('T')[0]
      });
    }
    setSimulatedInstallments(installments);
  };

  const handleCreateAgreement = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/agreements`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            debtorId: debtor.id,
            totalAmount,
            downPayment,
            installmentsCount,
            frequency,
            firstInstallmentDate
          })
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao criar acordo');
      }

      toast.success('Acordo de pagamento criado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar acordo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <GlassCard
        variant="strong"
        blur="xl"
        hover={false}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calculator className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Negociar Pagamento</h2>
              <p className="text-sm text-slate-500">Defina as condições para {debtor.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center transition-colors text-slate-500"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Configuration */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Valor Total da Dívida</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/50 border-2 border-white/50 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Entrada (Opcional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/50 border-2 border-white/50 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Parcelas</label>
                  <select
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/50 border-2 border-white/50 rounded-xl focus:border-indigo-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 9, 12, 18, 24].map(n => (
                      <option key={n} value={n}>{n}x</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Frequência</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/50 border-2 border-white/50 rounded-xl focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="biweekly">Quinzenal</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Data da 1ª Parcela</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="date"
                    value={firstInstallmentDate}
                    onChange={(e) => setFirstInstallmentDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/50 border-2 border-white/50 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div className="bg-white/40 border border-white/60 rounded-2xl p-5 shadow-sm flex flex-col h-full">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-600" />
                Resumo do Plano
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Valor Negociado:</span>
                  <span className="font-bold text-slate-900">€{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Entrada:</span>
                  <span className="font-bold text-emerald-600">- €{downPayment.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">A Parcelar:</span>
                  <span className="font-bold text-indigo-600">€{(totalAmount - downPayment).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-white/30 rounded-xl p-2 border border-white/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-200">
                      <th className="px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">Data</th>
                      <th className="px-2 py-2 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simulatedInstallments.map((inst) => (
                      <tr key={inst.number}>
                        <td className="px-2 py-2 font-medium text-slate-700">{inst.number}</td>
                        <td className="px-2 py-2 text-slate-600">
                          {new Date(inst.dueDate).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-2 py-2 text-right font-bold text-slate-900">
                          €{inst.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/30 bg-white/20 backdrop-blur-md flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="size-4" />
            <span>O status do devedor mudará para "Em Negociação"</span>
          </div>
          <div className="flex gap-3">
            <InteractiveButton variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </InteractiveButton>
            <InteractiveButton 
              variant="primary" 
              onClick={handleCreateAgreement} 
              loading={loading}
              icon={<CheckCircle className="size-4" />}
            >
              Confirmar Acordo
            </InteractiveButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}