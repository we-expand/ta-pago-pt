import { motion } from "motion/react";
import { ShieldCheck, TrendingUp, HandCoins, CheckCircle2 } from "lucide-react";

export const RiskFreeGuarantee = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-900 border-y border-white/5">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Garantia Risco Zero
                </motion.div>
                
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                >
                    Só ganhamos quando <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">você recupera.</span>
                </motion.h2>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
                >
                    Adotamos um modelo de <strong className="text-white">Success Fee</strong> puro. Assumimos 100% do custo e do risco operacional da cobrança. Se não houver recuperação, não há custos para sua empresa.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0"
                >
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="text-white font-semibold">Sem Custos Fixos</div>
                            <div className="text-slate-500 text-xs">Zero taxas de adesão</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                         <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                            <HandCoins className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="text-white font-semibold">Performance Pura</div>
                            <div className="text-slate-500 text-xs">Foco total em resultados</div>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
                >
                   {["Sem fidelização", "Sem exclusividade", "Pagamento direto na sua conta"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         {item}
                      </div>
                   ))}
                </motion.div>
            </div>

            {/* Visual Element */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-1 relative w-full flex justify-center lg:justify-end"
            >
                {/* Abstract visualization of money flow/success */}
                <div className="relative w-full max-w-sm lg:max-w-md aspect-square bg-gradient-to-tr from-slate-800 to-slate-900 rounded-full flex items-center justify-center ring-1 ring-white/10 backdrop-blur-3xl shadow-2xl shadow-emerald-900/50">
                     <div className="absolute inset-0 bg-emerald-500/5 blur-[60px] rounded-full"></div>
                     
                     <div className="relative z-10 text-center flex flex-col items-center">
                        <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4 opacity-80" />
                        <div className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-tighter">100%</div>
                        <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          Success Fee
                        </div>
                     </div>

                     {/* Orbiting elements */}
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border border-dashed border-white/5"
                     />
                     
                     {/* Floating Badge */}
                     <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -right-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
                     >
                        <div className="flex items-center gap-3">
                           <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                              <CheckCircle2 className="w-6 h-6" />
                           </div>
                           <div>
                              <div className="text-xs text-slate-500 font-semibold uppercase">Resultado</div>
                              <div className="font-bold text-lg">Recuperado</div>
                           </div>
                        </div>
                     </motion.div>
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  )
}
