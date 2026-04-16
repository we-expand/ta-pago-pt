import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Euro, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  DollarSign, 
  TrendingUp,
  Info,
  ArrowRight,
  Calculator,
  Target,
  Sparkles,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Clock,
  TrendingDown,
  Award
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export default function StartupCostsMinimal() {
  const [activePhase, setActivePhase] = useState<'beta' | 'launch'>('beta');
  const [showServiceDetails, setShowServiceDetails] = useState<string | null>(null);

  // ==========================================
  // FASE BETA/TESTES (30-60 dias)
  // ==========================================
  const betaPhase = {
    duration: '30-60 dias',
    clients: 5,
    description: 'Testes internos com clientes beta (grátis para feedback)',
    
    costs: {
      setup: {
        twilioSMS: 15, // €15 = 187 SMS
        twilioVoIP: 20, // €20 = 222 minutos
        total: 35
      },
      monthly: 0, // ZERO recorrente
      total60days: 35
    },
    
    communication: {
      email: {
        logins: 5 * 10, // 10 logins/cliente em testes
        avisos: 5 * 15, // 15 avisos durante beta
        totalMes: 5 * 25,
        custo: 0,
        provider: 'Resend FREE (3k/mês)'
      },
      whatsapp: {
        conversas: 5 * 30, // 30 conversas/cliente testando features
        totalMes: 5 * 30,
        custo: 0,
        provider: 'Meta Cloud API FREE (1k/mês)'
      },
      sms: {
        testes: 5 * 8, // 8 SMS/cliente testando notificações
        totalMes: 5 * 8,
        custoUnitario: 0.08,
        custoMes: 5 * 8 * 0.08,
        creditoDura: Math.floor(15 / (5 * 8 * 0.08))
      },
      voip: {
        chamadas: 5 * 4, // 4 chamadas/cliente testando agente IA
        duracaoMedia: 8, // 8 min (mais longas em testes)
        totalMinutos: 5 * 4 * 8,
        custoUnitario: 0.09,
        custoMes: 5 * 4 * 8 * 0.09,
        creditoDura: Math.floor(20 / (5 * 4 * 8 * 0.09))
      }
    },
    
    ai: {
      gemini: {
        requests: 5 * 4 * 15, // 5 clientes × 4 chamadas × 15 interações
        totalMes: 5 * 4 * 15,
        limite: 1500,
        custo: 0
      },
      tts: {
        chars: 5 * 4 * 500, // 5 clientes × 4 chamadas × 500 chars
        totalMes: 5 * 4 * 500,
        custo: 0,
        credito300: true
      },
      stt: {
        minutos: 5 * 4 * 8,
        totalMes: 5 * 4 * 8,
        custo: 0,
        credito300: true
      }
    }
  };

  // ==========================================
  // FASE LANÇAMENTO REAL (90-180 dias)
  // ==========================================
  const launchPhase = {
    duration: '90-180 dias',
    clientsStart: 10,
    clientsEnd: 50,
    description: 'Operação real com clientes pagantes (crescimento 10→50)',
    
    costs: {
      setup: 0, // Já foi feito na beta
      
      // Mês 1-2 (10-20 clientes)
      earlyMonths: {
        supabase: 0, // Ainda FREE
        googleCloud: 0, // $300 ainda ativo
        twilioRecharge: 30, // Recarga SMS+VoIP
        resend: 0, // Ainda FREE
        whatsapp: 0, // Ainda FREE
        sentry: 0, // FREE
        total: 30
      },
      
      // Mês 3-4 (30-40 clientes)
      midMonths: {
        supabase: 25, // Upgrade para Pro
        googleCloud: 20, // $300 acabou
        twilioRecharge: 50, // Mais uso
        resend: 0, // Ainda FREE
        whatsapp: 0, // Ainda FREE
        sentry: 0, // FREE
        total: 95
      },
      
      // Mês 5-6 (40-50 clientes)
      lateMonths: {
        supabase: 25,
        googleCloud: 25,
        twilioRecharge: 60,
        resend: 20, // Upgrade Pro
        whatsapp: 0, // Ainda FREE (~2k conversas)
        sentry: 0, // FREE
        gemini: 10, // Começou a pagar
        total: 160
      }
    },
    
    communication: {
      // COM 25 CLIENTES (média)
      email: {
        logins: 25 * 4,
        avisos: 25 * 12,
        newsletters: 25 * 2,
        totalMes: 25 * 18,
        custo: 0, // FREE até mês 5
        custoMes5: 20
      },
      whatsapp: {
        conversas: 25 * 20,
        totalMes: 25 * 20,
        custo: 0 // FREE até 1k, depois €0.05/conversa
      },
      sms: {
        notificacoes: 25 * 6,
        totalMes: 25 * 6,
        custoUnitario: 0.08,
        custoMes: 25 * 6 * 0.08
      },
      voip: {
        chamadas: 25 * 3,
        duracaoMedia: 5,
        totalMinutos: 25 * 3 * 5,
        custoUnitario: 0.09,
        custoMes: 25 * 3 * 5 * 0.09
      }
    },
    
    revenue: {
      month1: 10 * 67, // 10 clientes Pro
      month3: 30 * 67, // 30 clientes
      month6: 50 * 67  // 50 clientes
    }
  };

  const services = [
    {
      id: 'cloudflare',
      name: 'Cloudflare FREE',
      icon: <Shield className="w-6 h-6" />,
      tier: 'free',
      cost: 0,
      category: 'Infraestrutura',
      simpleExplanation: 'Torna o teu site RÁPIDO e SEGURO',
      whatItDoes: [
        '🔒 SSL grátis (cadeado verde https://)',
        '⚡ CDN global (site abre rápido em todo mundo)',
        '🛡️ Proteção DDoS (bloqueia ataques)',
        '💾 Cache automático (imagens/CSS instantâneos)'
      ],
      limit: 'Ilimitado FREE',
      upgrade: 'Pro €20/mês só se precisar WAF avançado'
    },
    {
      id: 'cloudflare-pages',
      name: 'Cloudflare Pages FREE',
      icon: <Zap className="w-6 h-6" />,
      tier: 'free',
      cost: 0,
      category: 'Infraestrutura',
      simpleExplanation: 'HOSPEDAGEM do site React (onde o código fica online)',
      whatItDoes: [
        '🌐 Hosting ilimitado do frontend React',
        '🚀 Deploy automático via Git',
        '⚡ 500 builds/mês FREE',
        '📦 Bandwidth ilimitado',
        '🔄 Preview automático de branches'
      ],
      limit: '✅ FREE SEMPRE (ilimitado para produção)',
      upgrade: 'Sempre FREE! Sem limites comerciais',
      honest: 'Este SIM é FREE para sempre — usado por milhões!'
    },
    {
      id: 'supabase',
      name: 'Supabase Backend FREE',
      icon: <Zap className="w-6 h-6" />,
      tier: 'free',
      cost: 0,
      category: 'Infraestrutura',
      simpleExplanation: 'BACKEND completo (database + Edge Functions + storage)',
      whatItDoes: [
        '🗄️ PostgreSQL database (500MB)',
        '⚡ Edge Functions serverless',
        '📦 1GB file storage',
        '🔐 Auth completo (login, 2FA)',
        '📡 Realtime subscriptions'
      ],
      limit: '✅ FREE: 500MB DB, 2GB bandwidth/mês',
      upgrade: '❌ Pro €25/mês com 50+ clientes (8GB DB)',
      honest: 'FREE suficiente até 50 clientes'
    },
    {
      id: 'gemini',
      name: 'Google Gemini Pro',
      icon: <Sparkles className="w-6 h-6" />,
      tier: 'free-limited',
      cost: 0,
      category: 'IA Conversacional',
      simpleExplanation: 'CÉREBRO do agente de voz — gera respostas inteligentes',
      whatItDoes: [
        '🧠 Entende contexto da conversa',
        '💬 Gera respostas persuasivas',
        '🎯 Adapta estratégia por devedor',
        '📊 Aprende com interações'
      ],
      limit: '✅ FREE: 1.500 requests/dia (suficiente até ~200 clientes)',
      upgrade: '❌ Após 200 clientes: €10-20/mês (€0.00025/1k tokens)',
      honest: 'NÃO é FREE para sempre! Mas até 200 clientes SIM'
    },
    {
      id: 'tts-stt',
      name: 'Google Cloud TTS + STT',
      icon: <Phone className="w-6 h-6" />,
      tier: 'free-trial',
      cost: 0,
      category: 'Voz IA',
      simpleExplanation: 'Faz o agente FALAR (TTS) e OUVIR (STT)',
      whatItDoes: [
        '🗣️ TTS: Texto → Voz portuguesa realista',
        '👂 STT: Voz devedor → Texto para IA',
        '🎙️ Voz neural PT-PT profissional',
        '⚡ Latência baixa (tempo real)'
      ],
      limit: '✅ $300 grátis primeiros 90 dias',
      upgrade: '❌ Após 90 dias: €20-30/mês com 50 clientes',
      honest: 'Grátis só 3 meses! Depois ~€25/mês'
    },
    {
      id: 'sentry',
      name: 'Sentry Error Tracking',
      icon: <AlertCircle className="w-6 h-6" />,
      tier: 'free-limited',
      cost: 0,
      category: 'Monitoring',
      simpleExplanation: 'Avisa quando algo QUEBRA em produção',
      whatItDoes: [
        '🔔 Alertas em tempo real de erros',
        '🐛 Stack traces completos',
        '📧 Email quando site quebra',
        '📊 Dashboard de erros'
      ],
      limit: '✅ FREE: 5k events/mês (suficiente até 50-100 users)',
      upgrade: '❌ Team €26/mês com muitos users',
      honest: 'FREE no início, depois €26/mês'
    },
    {
      id: 'analytics',
      name: 'Google Analytics 4',
      icon: <TrendingUp className="w-6 h-6" />,
      tier: 'free',
      cost: 0,
      category: 'Analytics',
      simpleExplanation: 'Vê quantos users entram, de onde vêm, o que clicam',
      whatItDoes: [
        '📊 Dashboards de tráfego',
        '🎯 Funis de conversão',
        '🌍 Geografia dos users',
        '📱 Desktop vs Mobile'
      ],
      limit: '✅ FREE SEMPRE (até 10M events/mês)',
      upgrade: 'Sempre FREE!',
      honest: 'Este SIM é FREE para sempre!'
    }
  ];

  const totalBeta = betaPhase.costs.total60days;
  const totalLaunchFirst6Months = 
    (launchPhase.costs.earlyMonths.total * 2) +
    (launchPhase.costs.midMonths.total * 2) +
    (launchPhase.costs.lateMonths.total * 2);

  return (
    <div className="w-full space-y-8 p-6">
      {/* Header com seletor de fase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative p-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Análise REALISTA — Testes + Lançamento
            </h1>
            <p className="text-white/80 text-lg">
              Custos separados por fase • Todas as APIs incluídas • Limites FREE honestos
            </p>
          </div>

          {/* Seletor de fase */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActivePhase('beta')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                activePhase === 'beta'
                  ? 'bg-white text-indigo-900 border-white shadow-2xl scale-105'
                  : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-bold">Fase BETA/Testes</h3>
              </div>
              <p className={`text-sm mb-3 ${activePhase === 'beta' ? 'text-slate-600' : 'text-white/70'}`}>
                {betaPhase.duration} • {betaPhase.clients} clientes beta
              </p>
              <div className={`text-3xl font-bold ${activePhase === 'beta' ? 'text-indigo-600' : 'text-white'}`}>
                €{totalBeta}
              </div>
              <div className={`text-xs mt-1 ${activePhase === 'beta' ? 'text-slate-500' : 'text-white/60'}`}>
                total período
              </div>
            </button>

            <button
              onClick={() => setActivePhase('launch')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                activePhase === 'launch'
                  ? 'bg-white text-indigo-900 border-white shadow-2xl scale-105'
                  : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-6 h-6" />
                <h3 className="text-xl font-bold">Fase LANÇAMENTO Real</h3>
              </div>
              <p className={`text-sm mb-3 ${activePhase === 'launch' ? 'text-slate-600' : 'text-white/70'}`}>
                {launchPhase.duration} • {launchPhase.clientsStart}-{launchPhase.clientsEnd} clientes
              </p>
              <div className={`text-3xl font-bold ${activePhase === 'launch' ? 'text-emerald-600' : 'text-white'}`}>
                €{totalLaunchFirst6Months}
              </div>
              <div className={`text-xs mt-1 ${activePhase === 'launch' ? 'text-slate-500' : 'text-white/60'}`}>
                primeiros 6 meses
              </div>
            </button>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-white/90 text-sm">
              <strong className="text-white">TOTAL GERAL:</strong> €{totalBeta} (beta) + €{totalLaunchFirst6Months} (6 meses) = 
              <strong className="text-white text-xl ml-2">€{totalBeta + totalLaunchFirst6Months}</strong> para validar completamente a plataforma
            </p>
          </div>
        </div>
      </motion.div>

      {/* Explicação detalhada dos serviços */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            🎓 Entende os Serviços — Explicação Simples
          </h2>
          <p className="text-slate-600">Clica em cada serviço para entender O QUE FAZ e LIMITES REAIS</p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id}>
                <motion.button
                  onClick={() => setShowServiceDetails(showServiceDetails === service.id ? null : service.id)}
                  className="w-full text-left bg-gradient-to-r from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-purple-50 border-2 border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                          {service.tier === 'free' && (
                            <Badge className="bg-emerald-600 text-white">FREE SEMPRE</Badge>
                          )}
                          {service.tier === 'free-limited' && (
                            <Badge className="bg-amber-600 text-white">FREE com Limites</Badge>
                          )}
                          {service.tier === 'free-trial' && (
                            <Badge className="bg-blue-600 text-white">FREE 90 dias</Badge>
                          )}
                        </div>
                        <p className="text-lg text-slate-700 font-medium">{service.simpleExplanation}</p>
                        {service.honest && (
                          <p className="text-sm text-orange-600 font-semibold mt-2">
                            ⚠️ {service.honest}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 ml-6">
                      {service.cost === 0 ? 'FREE' : `€${service.cost}`}
                    </div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showServiceDetails === service.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
                        <h4 className="font-bold text-indigo-900 mb-4">O que este serviço faz:</h4>
                        <div className="space-y-2 mb-6">
                          {service.whatItDoes.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-700">{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-indigo-200">
                            <div className="text-xs font-bold text-indigo-600 mb-2">LIMITE FREE:</div>
                            <div className="text-sm text-slate-900 font-semibold">{service.limit}</div>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-orange-200">
                            <div className="text-xs font-bold text-orange-600 mb-2">QUANDO PAGAR:</div>
                            <div className="text-sm text-slate-900 font-semibold">{service.upgrade}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Breakdown BETA */}
      <AnimatePresence mode="wait">
        {activePhase === 'beta' && (
          <motion.div
            key="beta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-7 h-7 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Fase BETA — Testes Internos</h2>
                </div>
                <p className="text-slate-600">{betaPhase.duration} • {betaPhase.clients} clientes beta testando grátis</p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
                    <div className="text-sm font-bold text-emerald-900 mb-2">Setup Inicial</div>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">€{betaPhase.costs.setup.total}</div>
                    <div className="text-sm text-slate-600">
                      €{betaPhase.costs.setup.twilioSMS} SMS + €{betaPhase.costs.setup.twilioVoIP} VoIP
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="text-sm font-bold text-blue-900 mb-2">Recorrente/Mês</div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">€{betaPhase.costs.monthly}</div>
                    <div className="text-sm text-slate-600">Tudo em FREE tier!</div>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                    <div className="text-sm font-bold text-purple-900 mb-2">Total Beta (60 dias)</div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">€{betaPhase.costs.total60days}</div>
                    <div className="text-sm text-slate-600">Apenas créditos pré-pagos</div>
                  </div>
                </div>

                {/* Volume de comunicação BETA */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">📊 Volume Omnichannel — BETA ({betaPhase.clients} clientes)</h3>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className="text-sm font-bold text-slate-900">Email</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{betaPhase.communication.email.totalMes}</div>
                      <div className="text-xs text-slate-500">emails/mês</div>
                      <Badge className="mt-2 bg-emerald-600 text-white">FREE</Badge>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <div className="text-sm font-bold text-slate-900">WhatsApp</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{betaPhase.communication.whatsapp.totalMes}</div>
                      <div className="text-xs text-slate-500">conversas/mês</div>
                      <Badge className="mt-2 bg-emerald-600 text-white">FREE</Badge>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Send className="w-5 h-5 text-amber-600" />
                        <div className="text-sm font-bold text-slate-900">SMS</div>
                      </div>
                      <div className="text-2xl font-bold text-amber-600">{betaPhase.communication.sms.totalMes}</div>
                      <div className="text-xs text-slate-500">SMS/mês • €{betaPhase.communication.sms.custoMes.toFixed(2)}/mês</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-2">
                        €15 duram {betaPhase.communication.sms.creditoDura}+ meses
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-purple-600" />
                        <div className="text-sm font-bold text-slate-900">VoIP</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{betaPhase.communication.voip.totalMinutos}</div>
                      <div className="text-xs text-slate-500">min/mês • €{betaPhase.communication.voip.custoMes.toFixed(2)}/mês</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-2">
                        €20 duram {betaPhase.communication.voip.creditoDura}+ meses
                      </div>
                    </div>
                  </div>
                </div>

                {/* IA Usage BETA */}
                <div className="mt-6 p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
                  <h3 className="font-bold text-indigo-900 mb-4">🤖 Uso de IA — BETA</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-indigo-200">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Gemini Pro Requests</div>
                      <div className="text-2xl font-bold text-indigo-600">{betaPhase.ai.gemini.totalMes}/mês</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-2">
                        ✅ Dentro do limite FREE ({betaPhase.ai.gemini.limite}/dia)
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Google TTS Chars</div>
                      <div className="text-2xl font-bold text-blue-600">{betaPhase.ai.tts.totalMes.toLocaleString()}/mês</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-2">
                        ✅ $300 grátis cobrindo tudo
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-cyan-200">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Google STT Minutos</div>
                      <div className="text-2xl font-bold text-cyan-600">{betaPhase.ai.stt.totalMes}/mês</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-2">
                        ✅ $300 grátis cobrindo tudo
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                  <h3 className="font-bold text-emerald-900 text-lg mb-2">✅ Conclusão BETA:</h3>
                  <p className="text-slate-700">
                    Com <strong>€{betaPhase.costs.total60days}</strong> tens 60 dias completos de testes com {betaPhase.clients} clientes beta. 
                    ZERO custos recorrentes. Todos os serviços em FREE tier. Créditos SMS/VoIP duram todo o período beta.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Breakdown LANÇAMENTO */}
        {activePhase === 'launch' && (
          <motion.div
            key="launch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="w-7 h-7 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Fase LANÇAMENTO Real</h2>
                </div>
                <p className="text-slate-600">{launchPhase.duration} • Crescimento de {launchPhase.clientsStart} para {launchPhase.clientsEnd} clientes pagantes</p>
              </div>

              <div className="p-8">
                {/* Timeline de custos */}
                <div className="space-y-6">
                  {/* Mês 1-2 */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Mês 1-2: Early Launch</h3>
                        <p className="text-sm text-slate-600">10-20 clientes • Ainda em FREE tiers</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">€{launchPhase.costs.earlyMonths.total}</div>
                        <div className="text-xs text-slate-500">por mês</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-slate-600">Supabase:</div>
                        <div className="font-bold text-emerald-600">FREE</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-slate-600">Google Cloud:</div>
                        <div className="font-bold text-emerald-600">FREE ($300)</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-slate-600">Twilio recarga:</div>
                        <div className="font-bold text-orange-600">€30</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Receita esperada:</span>
                      <span className="font-bold text-emerald-600">€{launchPhase.revenue.month1} - €{launchPhase.revenue.month1 * 2}</span>
                    </div>
                  </div>

                  {/* Mês 3-4 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Mês 3-4: Growth</h3>
                        <p className="text-sm text-slate-600">30-40 clientes • Primeiros upgrades</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600">€{launchPhase.costs.midMonths.total}</div>
                        <div className="text-xs text-slate-500">por mês</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Supabase Pro:</div>
                        <div className="font-bold text-orange-600">€25</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Google Cloud:</div>
                        <div className="font-bold text-orange-600">€20</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Twilio recarga:</div>
                        <div className="font-bold text-orange-600">€50</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-slate-600">Email/WhatsApp:</div>
                        <div className="font-bold text-emerald-600">FREE</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Receita esperada:</span>
                      <span className="font-bold text-emerald-600">€{launchPhase.revenue.month3}</span>
                    </div>
                  </div>

                  {/* Mês 5-6 */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Mês 5-6: Scale</h3>
                        <p className="text-sm text-slate-600">40-50 clientes • Operação madura</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-amber-600">€{launchPhase.costs.lateMonths.total}</div>
                        <div className="text-xs text-slate-500">por mês</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Supabase:</div>
                        <div className="font-bold text-orange-600">€25</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Google Cloud:</div>
                        <div className="font-bold text-orange-600">€25</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Twilio:</div>
                        <div className="font-bold text-orange-600">€60</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Resend Pro:</div>
                        <div className="font-bold text-orange-600">€20</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <div className="text-slate-600">Gemini:</div>
                        <div className="font-bold text-orange-600">€10</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Receita esperada:</span>
                      <span className="font-bold text-emerald-600">€{launchPhase.revenue.month6}</span>
                    </div>
                  </div>
                </div>

                {/* Volume omnichannel médio (25 clientes) */}
                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                  <h3 className="font-bold text-indigo-900 mb-4">📊 Volume Omnichannel Médio (25 clientes)</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <Mail className="w-6 h-6 text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{launchPhase.communication.email.totalMes}</div>
                      <div className="text-xs text-slate-500 mb-2">emails/mês</div>
                      <Badge className="bg-emerald-600 text-white text-xs">FREE até mês 5</Badge>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
                      <div className="text-2xl font-bold text-green-600">{launchPhase.communication.whatsapp.totalMes}</div>
                      <div className="text-xs text-slate-500 mb-2">conversas/mês</div>
                      <Badge className="bg-emerald-600 text-white text-xs">FREE</Badge>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-amber-200">
                      <Send className="w-6 h-6 text-amber-600 mb-2" />
                      <div className="text-2xl font-bold text-amber-600">{launchPhase.communication.sms.totalMes}</div>
                      <div className="text-xs text-slate-500 mb-2">SMS/mês</div>
                      <div className="text-xs font-bold text-orange-600">€{launchPhase.communication.sms.custoMes.toFixed(2)}/mês</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-purple-200">
                      <Phone className="w-6 h-6 text-purple-600 mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{launchPhase.communication.voip.totalMinutos}</div>
                      <div className="text-xs text-slate-500 mb-2">min/mês</div>
                      <div className="text-xs font-bold text-orange-600">€{launchPhase.communication.voip.custoMes.toFixed(2)}/mês</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white">
                  <h3 className="font-bold text-2xl mb-4">💰 Análise Financeira — Lançamento</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-white/70 text-sm mb-1">Total 6 meses:</div>
                      <div className="text-3xl font-bold">€{totalLaunchFirst6Months}</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm mb-1">Receita mês 6 (50 clientes):</div>
                      <div className="text-3xl font-bold">€{launchPhase.revenue.month6}</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm mb-1">Lucro mês 6:</div>
                      <div className="text-3xl font-bold">€{launchPhase.revenue.month6 - launchPhase.costs.lateMonths.total}</div>
                      <div className="text-xs text-white/80">({Math.round(((launchPhase.revenue.month6 - launchPhase.costs.lateMonths.total) / launchPhase.revenue.month6) * 100)}% margem)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conclusão final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 text-white"
      >
        <div className="flex items-start gap-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm flex-shrink-0">
            <Award className="w-10 h-10" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">🎯 Conclusão FINAL — Honesta e Realista</h2>
            
            <div className="space-y-4 text-white/90 text-lg leading-relaxed">
              <div className="p-6 bg-white/15 backdrop-blur-md rounded-2xl border-2 border-white/30">
                <p className="text-2xl font-bold text-white mb-3">
                  INVESTIMENTO TOTAL: €{totalBeta + totalLaunchFirst6Months}
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-base">
                  <div>
                    <div className="text-white/70 mb-1">Fase BETA (60 dias):</div>
                    <div className="text-xl font-bold">€{totalBeta}</div>
                  </div>
                  <div>
                    <div className="text-white/70 mb-1">Fase LANÇAMENTO (6 meses):</div>
                    <div className="text-xl font-bold">€{totalLaunchFirst6Months}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-500/20 backdrop-blur-sm rounded-2xl border-2 border-blue-300/30">
                <h3 className="font-bold text-white text-xl mb-3">✅ O que REALMENTE está incluído:</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• <strong>Domínio:</strong> Já possui (€0)</li>
                  <li>• <strong>4 Canais Omnichannel:</strong> Email FREE, WhatsApp FREE, SMS pré-pago, VoIP pré-pago</li>
                  <li>• <strong>IA Conversacional:</strong> Gemini Pro FREE até 200 clientes, depois ~€10/mês</li>
                  <li>• <strong>Voz IA:</strong> Google TTS/STT FREE 90 dias ($300), depois €25/mês</li>
                  <li>• <strong>Backend completo:</strong> Supabase FREE até 50 clientes, depois €25/mês</li>
                  <li>• <strong>CDN + SSL:</strong> Cloudflare FREE para sempre</li>
                  <li>• <strong>Pagamentos:</strong> Easypay sem taxa mensal (só comissão)</li>
                </ul>
              </div>

              <div className="p-6 bg-emerald-500/20 backdrop-blur-sm rounded-2xl border-2 border-emerald-300/30">
                <h3 className="font-bold text-white text-xl mb-3">💰 ROI Realista:</h3>
                <div className="space-y-2 text-white/90">
                  <p><strong>Mês 1-2:</strong> 10-20 clientes = €670-€1.340 receita | €30 custo = <strong>€640-€1.310 lucro</strong></p>
                  <p><strong>Mês 3-4:</strong> 30 clientes = €2.010 receita | €95 custo = <strong>€1.915 lucro</strong></p>
                  <p><strong>Mês 5-6:</strong> 50 clientes = €3.350 receita | €160 custo = <strong>€3.190 lucro</strong></p>
                  <p className="pt-3 text-xl font-bold text-white">
                    Aos 6 meses: investiste €{totalBeta + totalLaunchFirst6Months} e tens €3.190/mês de lucro recorrente! 🚀
                  </p>
                </div>
              </div>

              <div className="p-6 bg-amber-500/20 backdrop-blur-sm rounded-2xl border-2 border-amber-300/30">
                <h3 className="font-bold text-white text-xl mb-3">⚠️ Limites HONESTOS dos FREE tiers:</h3>
                <ul className="space-y-1 text-sm text-white/90">
                  <li>• <strong>Gemini Pro:</strong> FREE até ~200 clientes, depois €10-20/mês</li>
                  <li>• <strong>Google TTS/STT:</strong> FREE só 90 dias, depois €20-30/mês</li>
                  <li>• <strong>Resend Email:</strong> FREE até 3k emails/mês, depois €20/mês</li>
                  <li>• <strong>WhatsApp:</strong> FREE até 1k conversas/mês, depois €0.05/conversa</li>
                  <li>• <strong>Supabase:</strong> FREE até 500MB DB, depois €25/mês</li>
                  <li>• <strong>Sentry:</strong> FREE até 5k events, depois €26/mês</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-8 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40">
              <div className="flex items-start gap-4">
                <Rocket className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                <div>
                  <p className="text-2xl font-bold text-white mb-3">
                    🎉 VEREDICTO: PLATAFORMA 100% VIÁVEL!
                  </p>
                  <p className="text-white text-lg leading-relaxed">
                    Com <strong>€{totalBeta + totalLaunchFirst6Months}</strong> (€{totalBeta} beta + €{totalLaunchFirst6Months} lançamento) 
                    tens 8 meses completos de operação, crescendo de 0 para 50 clientes pagantes. 
                    Plataforma omnichannel completa (Email, WhatsApp, SMS, VoIP), IA conversacional, 
                    agente de voz, processamento de pagamentos. Aos 6 meses já tens <strong>€3.000+/mês de lucro líquido</strong>. 
                    Este é o caminho mais realista e honesto para lançar uma fintech portuguesa! 🇵🇹💎
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Final */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl border-4 border-white"
      >
        <h3 className="text-3xl font-bold text-white mb-3">
          Pronto para Lançar com €{totalBeta + totalLaunchFirst6Months}?
        </h3>
        <p className="text-white/90 text-xl mb-6 max-w-3xl mx-auto">
          <strong>€{totalBeta}</strong> para validar em BETA (60 dias) + 
          <strong> €{totalLaunchFirst6Months}</strong> para escalar até 50 clientes (6 meses).
          Tudo contemplado, nada escondido!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge className="bg-white/20 backdrop-blur-md px-6 py-3 text-white text-base border border-white/40">
            ✅ 4 canais omnichannel
          </Badge>
          <Badge className="bg-white/20 backdrop-blur-md px-6 py-3 text-white text-base border border-white/40">
            🤖 IA conversacional
          </Badge>
          <Badge className="bg-white/20 backdrop-blur-md px-6 py-3 text-white text-base border border-white/40">
            📞 Agente de voz
          </Badge>
          <Badge className="bg-white/20 backdrop-blur-md px-6 py-3 text-white text-base border border-white/40">
            💰 €3.190 lucro/mês ao 6º mês
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}