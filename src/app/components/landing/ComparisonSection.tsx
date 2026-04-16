import { motion } from "motion/react";
import { Check, X, Minus, Zap, Shield, Clock, TrendingUp } from "lucide-react";

export function ComparisonSection() {
  const features = [
    {
      name: "Modelo de Custo",
      tapago: "Taxa apenas no sucesso (1.5% - 1.9%)",
      traditional: "Taxas de abertura + Mensalidades fixas",
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />
    },
    {
      name: "Tempo de Ativação",
      tapago: "Imediato (Self-service)",
      traditional: "Semanas (Contratos complexos)",
      icon: <Clock className="w-5 h-5 text-cyan-500" />
    },
    {
      name: "Abordagem ao Cliente",
      tapago: "IA Empática & Personalizada",
      traditional: "Call Center Agressivo & Genérico",
      icon: <Shield className="w-5 h-5 text-emerald-500" />
    },
    {
      name: "Tecnologia",
      tapago: "IA Generativa & Machine Learning",
      traditional: "Planilhas & Discadores Manuais",
      icon: <Zap className="w-5 h-5 text-amber-500" />
    },
    {
      name: "Visibilidade",
      tapago: "Dashboard em Tempo Real",
      traditional: "Relatórios em PDF (Mensais)",
      icon: <Check className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <section className="py-24 px-6 relative bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs tracking-wide uppercase mb-4">
            Por que mudar?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            O futuro vs O passado
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Veja por que as empresas modernas estão migrando das agências tradicionais para a inteligência artificial do Tá Pago.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Traditional Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-slate-600 mb-2">Cobrança Tradicional</h3>
              <p className="text-sm text-slate-400">Agências & Call Centers</p>
            </div>
            
            <div className="flex-1 space-y-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 p-1 bg-slate-100 rounded-full text-slate-400 shrink-0">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{feature.name}</p>
                    <p className="text-slate-600 font-medium">{feature.traditional}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tá Pago Card (Highlighted) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
             {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Plataforma Tá Pago</h3>
                  <p className="text-indigo-200">A nova era da recuperação de crédito</p>
                </div>
                <div className="hidden sm:block px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  Recomendado
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="mt-1 p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">{feature.name}</p>
                      <p className="text-white font-semibold text-lg">{feature.tapago}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
