import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Wallet,
  Zap
} from 'lucide-react';

export function ProductInteractiveDemo() {
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(124500);

  useEffect(() => {
    let isMounted = true;
    let timer: any;
    // Ciclo de animação automática
    const sequence = async () => {
      // Step 0: Idle / Start
      if (!isMounted) return;
      setStep(1); // Detect Debt
      await wait(2000);
      if (!isMounted) return;
      setStep(2); // AI Analysis
      await wait(2000);
      if (!isMounted) return;
      setStep(3); // Communication
      await wait(3000);
      if (!isMounted) return;
      setStep(4); // Payment
      await wait(1000);
      if (!isMounted) return;
      // Increment Balance animation
      const interval = setInterval(() => {
        if (!isMounted) {
            clearInterval(interval);
            return;
        }
        setBalance(prev => {
            const next = prev + 150;
            if (next >= 125250) {
                clearInterval(interval);
                return 125250;
            }
            return next;
        });
      }, 50);
      
      await wait(2000);
      if (!isMounted) return;
      setStep(5); // Success State
      await wait(3000);
      if (!isMounted) return;
      setStep(0); // Reset
      setBalance(124500);
      
      if (isMounted) {
        timer = setTimeout(sequence, 1000);
      }
    };

    timer = setTimeout(sequence, 1000);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/5] sm:aspect-square">
        {/* Glass Container */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header / Status Bar */}
            <div className="h-16 border-b border-white/30 flex items-center justify-between px-6 bg-white/20">
                <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${step === 0 ? 'bg-slate-400' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {step === 0 && "Sistema Pronto"}
                        {step === 1 && "Monitorando..."}
                        {step === 2 && "IA Analisando"}
                        {step === 3 && "Negociando"}
                        {step === 4 && "Processando"}
                        {step === 5 && "Recuperado"}
                    </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/40 rounded-full border border-white/50">
                    <Wallet className="size-3 text-slate-500" />
                    <span className="text-sm font-bold text-slate-800 font-mono">
                        € {balance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative p-6 flex flex-col items-center justify-center">
                <AnimatePresence>
                    
                    {/* STEP 1: DEBT DETECTED */}
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="text-center"
                        >
                            <div className="size-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg relative">
                                <AlertCircle className="size-10 text-red-500" />
                                <motion.div 
                                    className="absolute inset-0 rounded-full border-red-400"
                                    animate={{ boxShadow: ['0 0 0 0px rgba(239, 68, 68, 0.2)', '0 0 0 20px rgba(239, 68, 68, 0)'] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Fatura #9023 Vencida</h3>
                            <p className="text-slate-500 text-sm">Cliente: Tech Solutions Lda</p>
                            <p className="text-red-500 font-bold mt-1">€ 750,00</p>
                        </motion.div>
                    )}

                    {/* STEP 2: AI PROCESSING */}
                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-center relative"
                        >
                            <div className="size-24 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                                <Bot className="size-12 text-white" />
                            </div>
                            
                            {/* Scanning Effect */}
                            <motion.div 
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-400 blur-sm"
                                animate={{ top: [0, 96, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/50 px-3 py-1.5 rounded-lg w-fit mx-auto">
                                    <Zap className="size-3 text-amber-500" />
                                    Perfil Comportamental: <span className="font-bold text-slate-700">Pagador Ocasional</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/50 px-3 py-1.5 rounded-lg w-fit mx-auto">
                                    <MessageCircle className="size-3 text-blue-500" />
                                    Melhor Canal: <span className="font-bold text-slate-700">WhatsApp (Tarde)</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: COMMUNICATION */}
                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-[280px] space-y-3"
                        >
                            {/* System Message */}
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-xs text-slate-600 relative"
                            >
                                <div className="absolute -top-4 left-0 text-[10px] text-slate-400 font-bold">IA (WhatsApp)</div>
                                Olá João! Notamos a fatura #9023 pendente. Posso gerar uma referência MB para facilitar? 🤖
                            </motion.div>

                            {/* User Reply */}
                            <motion.div 
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md text-xs ml-auto w-fit max-w-[90%]"
                            >
                                Olá! Sim, por favor. Esqueci-me completamente. 🙏
                            </motion.div>

                             {/* System Reply */}
                             <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-xs text-slate-600"
                            >
                                Aqui está: <span className="font-mono bg-slate-100 px-1 rounded">123 456 789</span>. Obrigado!
                            </motion.div>
                        </motion.div>
                    )}

                    {/* STEP 4/5: SUCCESS */}
                    {(step === 4 || step === 5) && (
                        <motion.div 
                            key="step4"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <motion.div 
                                className="size-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 text-white"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <CheckCircle2 className="size-12" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-slate-800">Recuperado!</h3>
                            <p className="text-green-600 font-bold text-lg">+ € 750,00</p>
                            <p className="text-slate-400 text-sm mt-2">Transferido para sua conta.</p>
                        </motion.div>
                    )}

                     {/* STEP 0: IDLE START */}
                     {step === 0 && (
                        <motion.div 
                            key="step0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="size-8 text-slate-400" />
                            </div>
                            <p className="text-slate-400 text-sm">Aguardando novos eventos...</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Decorative Background Elements inside glass */}
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <div className="flex gap-1">
                    <div className="size-2 rounded-full bg-slate-900" />
                    <div className="size-2 rounded-full bg-slate-900" />
                    <div className="size-2 rounded-full bg-slate-900" />
                </div>
            </div>
        </div>

        {/* External Glows */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -z-10" />
    </div>
  );
}