import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Check, Rocket, LayoutDashboard, HandCoins, Brain, LifeBuoy } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  position?: 'center' | 'bottom-right' | 'left-sidebar';
}

const STEPS: TourStep[] = [
  {
    id: 1,
    title: "Bem-vindo ao TaPago",
    description: "Sua nova plataforma de gestão de cobranças inteligente. Vamos fazer um tour rápido?",
    icon: <Rocket className="size-8 text-indigo-600" />,
    position: 'center'
  },
  {
    id: 2,
    title: "Dashboard em Tempo Real",
    description: "Acompanhe suas métricas, fluxo de caixa e alertas importantes em uma única tela.",
    icon: <LayoutDashboard className="size-8 text-blue-600" />,
    position: 'center'
  },
  {
    id: 3,
    title: "Gestão de Acordos",
    description: "Use o novo menu 'Acordos' para negociar dívidas, simular parcelamentos e quitar pendências.",
    icon: <HandCoins className="size-8 text-emerald-600" />,
    position: 'center'
  },
  {
    id: 4,
    title: "Inteligência Artificial",
    description: "O Motor de IA analisa perfis e sugere a melhor estratégia de cobrança automaticamente.",
    icon: <Brain className="size-8 text-purple-600" />,
    position: 'center'
  },
  {
    id: 5,
    title: "Tudo Pronto!",
    description: "Você está pronto para recuperar crédito de forma eficiente. Boa sorte!",
    icon: <Check className="size-8 text-green-600" />,
    position: 'center'
  }
];

export default function FeatureTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem('tapago_tour_completed');
    if (!completed) {
      // Pequeno delay para não assustar o usuário logo que carrega
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('tapago_tour_completed', 'true');
  };

  if (!isVisible) return null;

  const currentStep = STEPS[currentStepIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          {/* Backdrop Dimmed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
            onClick={handleComplete} // Click outside to close (optional, maybe distinct 'Skip')
          />

          {/* Tour Card */}
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 pointer-events-auto border border-white/20"
          >
            {/* Close / Skip */}
            <button 
              onClick={handleComplete}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              Pular Tour
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center space-y-6 mt-4">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                {currentStep.icon}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">{currentStep.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2 justify-center py-2">
                {STEPS.map((step, idx) => (
                  <div 
                    key={step.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <InteractiveButton 
                onClick={handleNext}
                className="w-full justify-center py-4 text-lg font-bold shadow-xl shadow-indigo-500/20"
              >
                {currentStepIndex === STEPS.length - 1 ? 'Começar a Usar' : 'Próximo'}
                <ChevronRight className="size-5 ml-2" />
              </InteractiveButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}