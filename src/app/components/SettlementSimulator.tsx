import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, DollarSign, Calculator, TrendingUp, AlertTriangle, CheckCircle2, Percent, ArrowRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import InteractiveButton from './ui/InteractiveButton';
import { toast } from 'sonner';

interface SettlementSimulatorProps {
  debtAmount: number;
  daysOverdue: number; // Dias de atraso
  riskScore?: 'low' | 'medium' | 'high'; // Score de risco
  onClose: () => void;
  onApply: (amount: number) => void;
}

export default function SettlementSimulator({ 
  debtAmount, 
  daysOverdue, 
  riskScore = 'medium', 
  onClose,
  onApply
}: SettlementSimulatorProps) {
  // Configurações do simulador
  const [haircut, setHaircut] = useState(0); // Porcentagem de desconto
  const [settlementAmount, setSettlementAmount] = useState(debtAmount);
  
  // Limites calculados pela "Política da Empresa" (Simulação)
  const [maxAllowedDiscount, setMaxAllowedDiscount] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [color, setColor] = useState('text-slate-900');

  useEffect(() => {
    // Lógica de Negócio: Cálculo do Haircut Máximo Aceitável
    // Baseado na idade da dívida e risco
    
    let baseDiscount = 0;

    // Regra 1: Idade da Dívida
    if (daysOverdue < 30) baseDiscount = 5;       // Dívida recente: pouco desconto
    else if (daysOverdue < 90) baseDiscount = 10;
    else if (daysOverdue < 180) baseDiscount = 20;
    else if (daysOverdue < 365) baseDiscount = 35;
    else baseDiscount = 50;                       // Dívida antiga: desconto agressivo

    // Regra 2: Risco do Devedor
    // Alto risco = queremos receber logo, aceitamos mais desconto
    // Baixo risco = esperamos receber integral, menos desconto
    let riskFactor = 1;
    if (riskScore === 'high') riskFactor = 1.2;    // +20% de margem no desconto
    if (riskScore === 'low') riskFactor = 0.8;     // -20% de margem no desconto

    const maxDiscount = Math.min(Math.round(baseDiscount * riskFactor), 70); // Teto de 70%
    setMaxAllowedDiscount(maxDiscount);
    
    // Inicializar com um valor conservador (metade do máximo)
    if (haircut === 0) {
      setHaircut(Math.floor(maxDiscount / 2));
    }
  }, [daysOverdue, riskScore]);

  useEffect(() => {
    // Atualizar valor final quando o slider muda
    const discountValue = debtAmount * (haircut / 100);
    setSettlementAmount(debtAmount - discountValue);

    // Analisar a proposta
    if (haircut <= maxAllowedDiscount * 0.5) {
      setRecommendation('Excelente para a empresa. Margem alta.');
      setColor('text-emerald-600');
    } else if (haircut <= maxAllowedDiscount * 0.8) {
      setRecommendation('Bom acordo. Dentro da média esperada.');
      setColor('text-blue-600');
    } else if (haircut <= maxAllowedDiscount) {
      setRecommendation('Limite aceitável. Use apenas para fechar agora.');
      setColor('text-amber-600');
    } else {
      setRecommendation('Acima da alçada. Requer aprovação de supervisor.');
      setColor('text-rose-600');
    }
  }, [haircut, debtAmount, maxAllowedDiscount]);

  const handleApply = () => {
    if (haircut > maxAllowedDiscount) {
      toast.error('Desconto acima do permitido! Solicite aprovação.');
      return;
    }
    onApply(settlementAmount);
    toast.success('Proposta de quitação gerada com sucesso!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <GlassCard
        variant="strong"
        className="w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
        onClick={(e: any) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="size-6" />
              Simulador de Quitação
            </h2>
            <p className="text-emerald-100 text-sm mt-1">Calcule o desconto ideal para pagamento à vista.</p>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white transition-colors">
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 bg-white">
          
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dívida Original</p>
              <p className="text-lg font-bold text-slate-900 line-through decoration-slate-400">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(debtAmount)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dias em Atraso</p>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                {daysOverdue} dias
                {daysOverdue > 90 && <AlertTriangle className="size-4 text-amber-500" />}
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700">Desconto Aplicado (Haircut)</label>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${color}`}>{haircut}%</span>
                {haircut > maxAllowedDiscount && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">Excede Alçada</span>}
              </div>
            </div>
            
            <div className="relative pt-6 pb-2">
              <input 
                type="range" 
                min="0" 
                max="90" 
                step="1"
                value={haircut}
                onChange={(e) => setHaircut(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 z-10 relative"
              />
              {/* Marker for Max Allowed */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-0 flex flex-col items-center"
                style={{ left: `${(maxAllowedDiscount / 90) * 100}%` }}
              >
                <div className="absolute -top-1 text-[10px] font-bold text-slate-500 whitespace-nowrap bg-slate-100 px-1 rounded border border-slate-200">
                  Máx: {maxAllowedDiscount}%
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 transition-colors ${
              haircut > maxAllowedDiscount ? 'bg-rose-50 text-rose-800' : 'bg-slate-50 text-slate-600'
            }`}>
              <TrendingUp className="size-5 shrink-0" />
              <p>{recommendation}</p>
            </div>
          </div>

          {/* Result */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center space-y-2">
             <p className="text-emerald-800 text-sm font-medium uppercase tracking-wide">Valor de Quitação</p>
             <p className="text-4xl font-extrabold text-emerald-700">
               {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(settlementAmount)}
             </p>
             <p className="text-emerald-600/70 text-xs">
               Economia de {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(debtAmount - settlementAmount)} para o devedor
             </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-4">
          <InteractiveButton variant="ghost" className="flex-1 justify-center" onClick={onClose}>
            Cancelar
          </InteractiveButton>
          <InteractiveButton 
            variant="success" 
            className="flex-1 justify-center" 
            onClick={handleApply}
            disabled={haircut > maxAllowedDiscount}
          >
            Gerar Acordo à Vista
            <ArrowRight className="size-4 ml-2" />
          </InteractiveButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}