import { ProductInteractiveDemoLarge } from "./landing/ProductInteractiveDemoLarge";
import { ComparisonSection } from "./landing/ComparisonSection";
import { RiskFreeGuarantee } from "./landing/RiskFreeGuarantee";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Globe, 
  BarChart3, 
  Blocks, 
  CreditCard,
  Bot,
  Scale,
  MessageCircle,
  Sparkles,
  Fingerprint,
  Info,
  Mic
} from "lucide-react";
import { EtherealBackground } from "./ui/EtherealBackground";
import { Logo } from "./Logo";
import CallRecordingWidget from "./CallRecordingWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function LandingPageNew({ onLogin, onGetStarted }: { onLogin: () => void, onGetStarted: () => void }) {
  
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features = [
    {
      id: "ai",
      title: "Agentes de IA Humanizados",
      desc: "Negociação empática e eficiente disponível 24/7 em todos os canais digitais.",
      icon: <Bot className="w-6 h-6" />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      illustration: (
        <div className="flex flex-col gap-4 max-w-[300px] w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="self-start bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl rounded-tl-none text-white text-sm"
          >
            Olá! Notei que a fatura #4092 vence amanhã.
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="self-end bg-indigo-500 text-white p-4 rounded-2xl rounded-tr-none text-sm shadow-lg"
          >
            Pode gerar uma referência MB?
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="self-start bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl rounded-tl-none text-white text-xs flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Gerando referência...
          </motion.div>
        </div>
      )
    },
    {
      id: "payments",
      title: "Pagamentos Nacionais",
      desc: "Referências Multibanco e MB WAY geradas nativamente durante o chat.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      illustration: (
        <div className="relative">
          <motion.div 
             animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
             className="w-64 h-40 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl flex flex-col p-6 text-white justify-between z-10 relative"
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg opacity-80">MB WAY</span>
              <CreditCard className="w-8 h-8 opacity-50" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-32 bg-white/20 rounded-full"></div>
              <div className="h-2 w-20 bg-white/20 rounded-full"></div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 20, opacity: 1 }} transition={{ delay: 0.2 }}
            className="absolute -bottom-8 -right-4 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-slate-500">Pagamento Confirmado</div>
              <div className="font-bold">€ 1.250,00</div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: "integration",
      title: "Integração Universal",
      desc: "Conectores prontos para PHC, Primavera, Sage e qualquer ERP via API.",
      icon: <Blocks className="w-6 h-6" />,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      illustration: (
        <div className="grid grid-cols-2 gap-4">
          {["PHC", "SAGE", "SAP", "API"].map((erp, i) => (
            <motion.div
              key={erp}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
            >
              {erp}
            </motion.div>
          ))}
          <motion.div 
             animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-cyan-400/30 rounded-full pointer-events-none"
          />
        </div>
      )
    },
    {
      id: "omni",
      title: "Omnicanalidade Real",
      desc: "Orquestração inteligente entre WhatsApp, SMS, Email e Voz.",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      illustration: (
        <div className="relative w-full max-w-xs flex justify-center">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl z-10 relative">
             <Bot className="w-8 h-8 text-indigo-600" />
           </div>
           {[0, 72, 144, 216, 288].map((deg, i) => (
             <motion.div
               key={i}
               className="absolute top-0 left-1/2 w-10 h-10 -ml-5 origin-[50%_400%]" // origin sets the rotation point far below
               animate={{ rotate: [deg, deg + 360] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             >
               <div 
                 className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
                 style={{ transform: `rotate(-${deg}deg)` }} // counter-rotate icon
               >
                 <MessageCircle className="w-5 h-5" />
               </div>
             </motion.div>
           ))}
        </div>
      )
    },
    {
      id: "risk",
      title: "Scoring de Risco",
      desc: "Análise preditiva que identifica potenciais inadimplentes antes da venda.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      illustration: (
        <div className="w-full max-w-xs">
          <div className="flex items-end gap-2 h-40 mb-4 justify-center">
             <motion.div initial={{ height: 0 }} animate={{ height: "40%" }} className="w-12 bg-emerald-500/30 rounded-t-lg" />
             <motion.div initial={{ height: 0 }} animate={{ height: "60%" }} className="w-12 bg-emerald-500/60 rounded-t-lg" />
             <motion.div initial={{ height: 0 }} animate={{ height: "80%" }} className="w-12 bg-emerald-500 rounded-t-lg" />
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
            <span className="text-white text-sm">Score de Crédito</span>
            <span className="text-emerald-400 font-bold text-xl">94/100</span>
          </div>
        </div>
      )
    },
    {
      id: "behavior",
      title: "Perfil Comportamental",
      desc: "Enriquecimento automático de dados com histórico financeiro pregresso.",
      icon: <Fingerprint className="w-6 h-6" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      hasDetails: true,
      illustration: (
        <div className="relative flex items-center justify-center">
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
             className="w-32 h-32 border-2 border-rose-500/50 rounded-full flex items-center justify-center"
           >
              <Fingerprint className="w-16 h-16 text-rose-500" />
           </motion.div>
           <motion.div 
             animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 right-0 h-1 bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.8)] opacity-80"
           />
           <div className="absolute -bottom-12 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-rose-500/30 text-rose-300 text-xs font-mono">
             MATCH FOUND: 98%
           </div>
        </div>
      ),
      details: {
        title: "Como funciona o Perfil Comportamental?",
        content: "Ao digitar o NIF, nosso sistema consulta automaticamente bases de dados públicas (bancos, tribunais) e privadas em tempo real. Identificamos padrões de comportamento dos últimos 5 anos, como atrasos recorrentes ou preferências de pagamento, criando um perfil único que permite à IA prever a melhor abordagem de cobrança com 94% de precisão."
      }
    },
    {
      id: "voip",
      title: "Gravação VoIP Auditável",
      desc: "Integração nativa com Twilio e Aircall. Grava, transcreve e anexa chamadas à ficha do devedor automaticamente.",
      icon: <Mic className="w-6 h-6" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      illustration: (
        <div className="w-full flex justify-center scale-90 sm:scale-100">
          <CallRecordingWidget />
        </div>
      ),
      hasDetails: true,
      details: {
        title: "Compliance e Auditoria Automática",
        content: "Conecte sua central telefônica (Twilio, Aircall, Ringover) e transforme cada interação em dados. O sistema grava a chamada, gera uma transcrição via IA para análise de sentimentos e anexa o arquivo legalmente válido ao histórico do devedor, garantindo compliance e material para treinamento."
      }
    }
  ];

  const pricing = [
    {
      name: "Indie",
      price: "0",
      period: "/mês",
      desc: "Ideal para freelancers e validação de MVP.",
      features: ["Até 10 devedores ativos", "Cobrança via Email (Manual)", "Dashboard Básico", "Taxa de 1.9% por sucesso"],
      cta: "Começar Grátis",
      highlight: false
    },
    {
      name: "Essential",
      price: "24",
      period: "/mês",
      desc: "Automação essencial para pequenas empresas.",
      features: ["Até 100 devedores", "Emails Automáticos (Régua)", "Integração WhatsApp (Link)", "Relatórios PDF", "Taxa de 1.5% por sucesso"],
      cta: "Escolher Essential",
      highlight: false
    },
    {
      name: "Growth",
      price: "59",
      period: "/mês",
      desc: "IA e multicanal para escalar recuperação.",
      features: ["Devedores ilimitados", "WhatsApp Automático (API)", "IA de Negociação (Chat)", "SMS Gateway Incluído", "API de Integração"],
      cta: "Escolher Growth",
      highlight: true
    },
    {
      name: "Corporate",
      price: "149",
      period: "/mês",
      desc: "Alta performance e gestão de equipas.",
      features: ["Tudo do Growth", "Múltiplos Usuários", "Whitelabel (Sua Marca)", "Gestor de Conta Dedicado", "SLA Premium"],
      cta: "Falar com Vendas",
      highlight: false
    }
  ];

  // container variants for sequential animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden selection:bg-indigo-100">
      {/* Intro White Fade Effect */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="fixed inset-0 z-[100] bg-white pointer-events-none"
      />

      <EtherealBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="scale-110 origin-left">
            <Logo size="default" />
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onLogin} 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 z-10 flex flex-col items-start text-left lg:pl-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              IA Preditiva & Machine Learning
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              O fim da <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                inadimplência.
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg leading-relaxed">
              Algoritmos de Machine Learning que organizam e recuperam capital através de interações humanizadas.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={onGetStarted}
                className="group px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-medium text-lg hover:bg-slate-50 transition-all">
                Ver Demonstração
              </button>
            </div>
          </motion.div>

          {/* Right Visual - Interactive Demo */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="lg:w-1/2 relative w-full flex justify-center items-center"
          >
            <ProductInteractiveDemoLarge />
          </motion.div>
        </div>
      </section>

      {/* Features Header & Intro */}
      <section className="pt-32 pb-12 relative overflow-hidden bg-white/30 backdrop-blur-sm">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Powerhouse Financeira
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              Tudo o que precisa para <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">escalar sem fricção.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-2xl mx-auto text-lg"
            >
              Substitua processos manuais e equipas de cobrança dispendiosas por uma infraestrutura digital autônoma e inteligente.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Integrations Marquee - Moved */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50 overflow-hidden relative mb-20">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Conectado ao seu ecossistema</p>
        </div>
        
        <div className="relative flex overflow-hidden mask-linear-gradient">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <motion.div 
            className="flex gap-24 items-center whitespace-nowrap pl-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 120 
            }}
          >
            {[
              { name: "PHC", url: "https://asset.brandfetch.io/idQw-BiX3D/id8C2s3c-n.svg" },
              { name: "Cegid", url: "https://asset.brandfetch.io/idL-DSNeF_/idJdc_3X3-.svg" },
              { name: "Sage", url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Sage_Group_logo.svg" },
              { name: "SAP", url: "https://asset.brandfetch.io/idE8C0qQjW/idXJ_3tTq_.svg" },
              { name: "Moloni", url: "https://raw.githubusercontent.com/moloni/moloni-api-docs/master/assets/logo_moloni_blue.svg" },
              { name: "InvoiceXpress", url: "https://asset.brandfetch.io/idw-G8Xk_1/idV-o72t-3.svg" },
              { name: "WhatsApp", url: "https://asset.brandfetch.io/idhz_ipQce/idJj8-D-t-.svg" },
              { name: "OpenAI", url: "https://asset.brandfetch.io/id8HGzF_px/idg4P69XwR.svg" },
              { name: "Stripe", url: "https://asset.brandfetch.io/idfxAWK1C0/id3v9s-7-L.svg" },
              { name: "MB WAY", url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/MB_WAY_logo.svg" },
              { name: "Multibanco", url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Multibanco.svg" },
              { name: "Salesforce", url: "https://asset.brandfetch.io/idKj8_3_3J/id61jXJ1_H.svg" },
              { name: "HubSpot", url: "https://asset.brandfetch.io/idmO76-2_S/id-v6Ff403.svg" },
              // Repetindo para loop infinito suave
              { name: "PHC", url: "https://asset.brandfetch.io/idQw-BiX3D/id8C2s3c-n.svg" },
              { name: "Cegid", url: "https://asset.brandfetch.io/idL-DSNeF_/idJdc_3X3-.svg" },
              { name: "Sage", url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Sage_Group_logo.svg" },
              { name: "SAP", url: "https://asset.brandfetch.io/idE8C0qQjW/idXJ_3tTq_.svg" },
              { name: "Moloni", url: "https://raw.githubusercontent.com/moloni/moloni-api-docs/master/assets/logo_moloni_blue.svg" },
              { name: "InvoiceXpress", url: "https://asset.brandfetch.io/idw-G8Xk_1/idV-o72t-3.svg" },
              { name: "WhatsApp", url: "https://asset.brandfetch.io/idhz_ipQce/idJj8-D-t-.svg" },
              { name: "OpenAI", url: "https://asset.brandfetch.io/id8HGzF_px/idg4P69XwR.svg" },
              { name: "Stripe", url: "https://asset.brandfetch.io/idfxAWK1C0/id3v9s-7-L.svg" },
              { name: "MB WAY", url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/MB_WAY_logo.svg" },
              { name: "Multibanco", url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Multibanco.svg" },
              { name: "Salesforce", url: "https://asset.brandfetch.io/idKj8_3_3J/id61jXJ1_H.svg" },
              { name: "HubSpot", url: "https://asset.brandfetch.io/idmO76-2_S/id-v6Ff403.svg" }
            ].map((tech, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-12 group"
              >
                <img 
                  src={tech.url} 
                  alt={tech.name} 
                  className={`w-auto object-contain max-w-[200px] transition-transform duration-300 hover:scale-110 ${tech.name === 'Cegid' ? 'h-24' : 'h-16'}`}
                />
                <span className="text-slate-300 font-light h-8 w-[1px] bg-slate-200"></span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Bottom Fade Gradient matching the instruction "sumindo gradativamente a partir do início do ícone" */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-6 relative overflow-hidden bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start"
          >
            {/* Left Column: Feature Navigation */}
            <div className="flex flex-col gap-2">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveFeatureIndex(idx)}
                  className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    activeFeatureIndex === idx 
                      ? 'bg-white shadow-xl shadow-indigo-500/5 border-indigo-100 scale-[1.01]' 
                      : 'bg-transparent border-transparent hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                      activeFeatureIndex === idx ? `${feature.bg} ${feature.color}` : 'bg-slate-100 text-slate-400'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base transition-colors ${
                        activeFeatureIndex === idx ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-snug transition-colors ${
                        activeFeatureIndex === idx ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {feature.desc}
                      </p>
                      {feature.hasDetails && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedFeature(feature); }}
                          className={`mt-2 text-xs font-bold flex items-center gap-1 hover:underline ${feature.color}`}
                        >
                          Ver como funciona <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Dynamic Visual Stage */}
            <div className="relative h-[400px] lg:h-[500px] lg:sticky lg:top-24 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-6 shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeFeatureIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 w-full flex flex-col items-center justify-center text-center"
                >
                  <div className="mb-6 scale-90 lg:scale-100">
                    {features[activeFeatureIndex].illustration}
                  </div>
                  
                  <div className="max-w-xs mx-auto">
                    <h4 className="text-white text-lg font-bold mb-1">{features[activeFeatureIndex].title}</h4>
                    <p className="text-slate-400 text-xs">
                      {features[activeFeatureIndex].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Risk Free Guarantee */}
      <RiskFreeGuarantee />

      {/* Pricing Section (MVP Launch) */ }
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs tracking-wide uppercase mb-4">
               Oferta de Lançamento
             </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Investimento Transparente</h2>
            <p className="text-slate-500">Comece pequeno, cresça rápido. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {pricing.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative p-6 rounded-3xl transition-all h-full flex flex-col ${
                  plan.highlight 
                    ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10 border border-slate-800' 
                    : 'bg-white/70 border border-white/50 text-slate-900 hover:bg-white hover:shadow-xl'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price === 'Sob Consulta' ? '' : '€'}{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-8 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`w-4 h-4 ${plan.highlight ? 'text-cyan-400' : 'text-indigo-600'}`} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-xl font-semibold transition-all mt-auto ${
                    plan.highlight 
                      ? 'bg-white text-slate-900 hover:bg-slate-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <Logo size="small" />
            <p className="mt-4 text-sm text-slate-500">
              Transformando o ecossistema financeiro europeu com inteligência e design.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Funcionalidades</li>
              <li>Segurança</li>
              <li>Integrações</li>
              <li>Preços</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Privacidade</li>
              <li>Termos de Uso</li>
              <li>Cookies</li>
              <li>Livro de Reclamações</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contactos</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex flex-col gap-1">
                <span className="font-semibold text-slate-700">Sede</span>
                <span>Praça Infante Dom Pedro nº 12</span>
                <span>5º Andar Esquerdo</span>
                <span>Algés, Oeiras, Lisboa</span>
                <span>1495-149</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-semibold text-slate-700">Telefone</span>
                <a href="tel:+351965456895" className="hover:text-indigo-600 transition-colors">965 456 895</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Feature Details Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedFeature?.icon}
              {selectedFeature?.details?.title || selectedFeature?.title}
            </DialogTitle>
            <DialogDescription className="pt-4 text-base leading-relaxed text-slate-600">
              {selectedFeature?.details?.content || selectedFeature?.desc}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setSelectedFeature(null)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Entendi
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
