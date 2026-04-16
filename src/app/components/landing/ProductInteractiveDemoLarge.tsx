import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  ArrowUpRight, 
  CreditCard,
  Shield,
  Smartphone
} from 'lucide-react';

export function ProductInteractiveDemoLarge() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [balance, setBalance] = useState(124500);
  const [activities, setActivities] = useState([
    { id: 1, type: 'whatsapp', user: 'Ricardo M.', status: 'waiting', time: 'Agora' },
    { id: 2, type: 'email', user: 'Ana Sousa', status: 'sent', time: '2m' },
    { id: 3, type: 'sms', user: 'Carlos B.', status: 'delivered', time: '5m' },
  ]);

  // Simulation Cycle
  useEffect(() => {
    let isMounted = true;
    const cycle = async () => {
      // 1. Highlight a new case (Ricardo)
      await wait(1000);
      if (!isMounted) return;
      setActiveChat(1); // Open Chat visualization
      
      // 2. Simulate User Typing
      await wait(2000);
      if (!isMounted) return;
      // Update activity status
      setActivities(prev => prev.map(a => a.id === 1 ? { ...a, status: 'typing' } : a));

      // 3. User Replies
      await wait(1500);
      if (!isMounted) return;
      setActivities(prev => prev.map(a => a.id === 1 ? { ...a, status: 'replied' } : a));

      // 4. AI Analysis & Response (Payment Link)
      await wait(1000);
      if (!isMounted) return;
      
      // 5. Success
      await wait(2500);
      if (!isMounted) return;
      setActivities(prev => prev.map(a => a.id === 1 ? { ...a, status: 'paid' } : a));
      
      // Animate Balance
      const interval = setInterval(() => {
        if (!isMounted) {
            clearInterval(interval);
            return;
        }
        setBalance(prev => {
            const next = prev + 150;
            if (next >= 124950) {
                clearInterval(interval);
                return 124950;
            }
            return next;
        });
      }, 50);

      // 6. Reset / Switch to next
      await wait(4000);
      if (!isMounted) return;
      setActiveChat(null);
      await wait(1000);
      if (!isMounted) return;
      
      // Reset Balance for loop
      setBalance(124500); 
      setActivities([
        { id: 1, type: 'whatsapp', user: 'Ricardo M.', status: 'waiting', time: 'Agora' },
        { id: 2, type: 'email', user: 'Ana Sousa', status: 'sent', time: '2m' },
        { id: 3, type: 'sms', user: 'Carlos B.', status: 'delivered', time: '5m' },
      ]);
    };

    // Run the cycle in a loop
    const runLoop = async () => {
        while(isMounted) {
            await cycle();
        }
    }
    runLoop();

    return () => { isMounted = false; }; 
  }, []);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center p-4">
        {/* Main Glass Dashboard */}
        <div className="relative w-full max-w-4xl bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white/50 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
            
            {/* LEFT SIDEBAR - Activity Feed */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/30 flex flex-col bg-white/10">
                <div className="p-6 border-b border-white/20">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">Monitoramento em Tempo Real</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                        € {balance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <ArrowUpRight className="size-3 text-green-600" />
                        <span className="text-green-600 font-bold">+2.4%</span> hoje
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-4 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Atividade Recente</div>
                    {activities.map((activity) => (
                        <motion.div 
                            key={activity.id}
                            layout
                            className={`p-3 rounded-2xl border transition-all cursor-default ${
                                activeChat === activity.id 
                                ? 'bg-white shadow-lg border-indigo-100 scale-105 z-10' 
                                : 'bg-white/40 border-white/40 hover:bg-white/60'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${
                                        activity.type === 'whatsapp' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                                        'bg-purple-100 text-purple-600'
                                    }`}>
                                        {activity.type === 'whatsapp' && <Smartphone className="size-3" />}
                                        {activity.type === 'email' && <Mail className="size-3" />}
                                        {activity.type === 'sms' && <MessageCircle className="size-3" />}
                                    </div>
                                    <span className="font-semibold text-slate-700 text-sm">{activity.user}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{activity.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    {activity.status === 'waiting' && 'Aguardando leitura...'}
                                    {activity.status === 'sent' && 'Enviado'}
                                    {activity.status === 'delivered' && 'Entregue'}
                                    {activity.status === 'typing' && 'Digitando...'}
                                    {activity.status === 'replied' && 'Respondeu'}
                                    {activity.status === 'paid' && 'Pago com sucesso'}
                                </span>
                                {activity.status === 'paid' && <CheckCircle2 className="size-4 text-green-500" />}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE - Active Context / Chat */}
            <div className="flex-1 relative bg-slate-50/30 p-8 flex flex-col">
                <AnimatePresence>
                    {activeChat ? (
                        <motion.div 
                            key="chat-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col h-full max-w-lg mx-auto w-full"
                        >
                            {/* Header of Chat */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                        <Bot className="size-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 tracking-tight">IA de Negociação</div>
                                        <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                                            <span className="size-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                            Ativo agora
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white/50 border border-white/60 text-xs font-semibold text-slate-500">
                                    Fatura #9023
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 space-y-4">
                                {/* Message 1: AI */}
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%]">
                                        <p className="text-sm text-slate-600">
                                            Olá Ricardo, tudo bem? 🌟 Notei que a fatura de <span className="font-bold text-slate-800">€450,00</span> ficou pendente ontem. Imagino que tenha sido na correria! Quer que eu reenvie o MB WAY ou prefere agendar para sexta?
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Message 2: User Reply */}
                                {activities[0].status !== 'waiting' && activities[0].status !== 'sent' && (
                                    <motion.div 
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="flex gap-3 justify-end"
                                    >
                                        <div className="bg-slate-800 text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[85%]">
                                            <p className="text-sm">
                                                Oi! A semana foi caótica mesmo. Pode agendar para sexta-feira? Me ajudaria muito.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Message 3: AI Link */}
                                {(activities[0].status === 'replied' || activities[0].status === 'paid') && (
                                    <motion.div 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="flex gap-3"
                                    >
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%] w-full">
                                            <p className="text-sm text-slate-600 mb-3">
                                                Combinado! 🤝 Agendei para sexta-feira sem taxas extras. Enviarei um lembrete no dia. Segue o link seguro se preferir adiantar:
                                            </p>
                                            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 group cursor-pointer hover:bg-indigo-100 transition-colors">
                                                <div className="p-2 bg-white rounded-lg text-indigo-600">
                                                    <CreditCard className="size-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs text-indigo-400 font-bold uppercase">Pagamento Seguro</div>
                                                    <div className="text-sm font-bold text-indigo-900">Pagar €450,00</div>
                                                </div>
                                                <CheckCircle2 className={`size-5 ${activities[0].status === 'paid' ? 'text-green-500' : 'text-indigo-300'}`} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Success Overlay */}
                            {activities[0].status === 'paid' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-white/10 backdrop-blur-[2px]"
                                >
                                    <motion.div 
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="bg-white p-6 rounded-3xl shadow-2xl text-center border border-white/60"
                                    >
                                        <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Shield className="size-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-1">Recuperado!</h3>
                                        <p className="text-slate-500">Valor creditado na sua conta.</p>
                                    </motion.div>
                                </motion.div>
                            )}

                        </motion.div>
                    ) : (
                        // IDLE STATE (Scanning)
                        <motion.div 
                            key="idle-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center opacity-50"
                        >
                            <div className="relative">
                                <div className="size-24 rounded-full border-4 border-indigo-200 animate-[spin_4s_linear_infinite]" />
                                <div className="size-16 rounded-full border-4 border-cyan-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite_reverse]" />
                                <Bot className="size-8 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="mt-6 text-slate-400 font-medium tracking-wide">ANALISANDO CARTEIRA...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Decorative Elements around the dashboard to integrate with page */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    </div>
  );
}
