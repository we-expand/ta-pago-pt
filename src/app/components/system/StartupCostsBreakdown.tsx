import React from 'react';
import { motion } from 'motion/react';
import {
  Euro,
  Phone,
  CreditCard,
  Bot,
  Globe,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Lock,
  FileText
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface CostItem {
  name: string;
  description: string;
  monthly: number;
  setup?: number;
  category: 'infrastructure' | 'apis' | 'tools' | 'marketing' | 'legal' | 'buffer';
  icon: React.ReactNode;
  provider: string;
  essential: boolean;
  notes?: string;
}

export default function StartupCostsBreakdown() {
  const costs: CostItem[] = [
    // INFRAESTRUTURA
    {
      name: 'Supabase Pro',
      description: 'Database PostgreSQL, Auth, Storage, Edge Functions',
      monthly: 25,
      setup: 0,
      category: 'infrastructure',
      icon: <Database className="w-5 h-5" />,
      provider: 'Supabase',
      essential: true,
      notes: '8GB database, 250GB bandwidth, 50GB storage'
    },
    {
      name: 'Domínio .pt',
      description: 'tapago.pt (registo anual)',
      monthly: 1.25,
      setup: 15,
      category: 'infrastructure',
      icon: <Globe className="w-5 h-5" />,
      provider: 'DNS.pt',
      essential: true,
      notes: '€15/ano = €1.25/mês'
    },
    {
      name: 'Cloudflare FREE',
      description: 'CDN, SSL, DDoS protection básica (GRATUITO)',
      monthly: 0,
      setup: 0,
      category: 'infrastructure',
      icon: <Shield className="w-5 h-5" />,
      provider: 'Cloudflare',
      essential: true,
      notes: 'CDN global + SSL automático + proteção DDoS'
    },

    // APIs E SERVIÇOS
    {
      name: 'Twilio VoIP',
      description: 'Chamadas telefónicas (estimativa 500 min/mês)',
      monthly: 45,
      setup: 0,
      category: 'apis',
      icon: <Phone className="w-5 h-5" />,
      provider: 'Twilio',
      essential: true,
      notes: '€0.09/min PT • 500 min = €45 (crescerá)'
    },
    {
      name: 'Twilio SMS',
      description: 'SMS para confirmações e notificações (300 SMS)',
      monthly: 24,
      setup: 0,
      category: 'apis',
      icon: <MessageSquare className="w-5 h-5" />,
      provider: 'Twilio',
      essential: true,
      notes: '€0.08/SMS • 300 SMS = €24'
    },
    {
      name: 'Google Cloud TTS',
      description: 'Text-to-Speech para agente de voz (50k chars/mês)',
      monthly: 8,
      setup: 0,
      category: 'apis',
      icon: <Bot className="w-5 h-5" />,
      provider: 'Google Cloud',
      essential: true,
      notes: 'Voz Neural PT-PT • $300 grátis primeiros 90 dias'
    },
    {
      name: 'Google Cloud STT',
      description: 'Speech-to-Text para reconhecimento de voz',
      monthly: 12,
      setup: 0,
      category: 'apis',
      icon: <Bot className="w-5 h-5" />,
      provider: 'Google Cloud',
      essential: true,
      notes: '200 min/mês transcrição • €3.60/hora'
    },
    {
      name: 'Easypay Gateway',
      description: 'Pagamentos Multibanco, MB WAY, Cartões',
      monthly: 15,
      setup: 0,
      category: 'apis',
      icon: <CreditCard className="w-5 h-5" />,
      provider: 'Easypay',
      essential: true,
      notes: 'Taxa mensal + 1.5% por transação'
    },

    // FERRAMENTAS
    {
      name: 'Sentry Pro',
      description: 'Error tracking e monitoramento',
      monthly: 26,
      setup: 0,
      category: 'tools',
      icon: <AlertTriangle className="w-5 h-5" />,
      provider: 'Sentry',
      essential: true,
      notes: '50k events/mês'
    },
    {
      name: 'Google Analytics',
      description: 'Analytics FREE (GRATUITO)',
      monthly: 0,
      setup: 0,
      category: 'tools',
      icon: <TrendingUp className="w-5 h-5" />,
      provider: 'Google',
      essential: false,
      notes: 'Alternativa gratuita ao Plausible'
    },
    {
      name: 'EmailOctopus FREE',
      description: 'Email marketing (até 2500 subscribers - GRATUITO)',
      monthly: 0,
      setup: 0,
      category: 'tools',
      icon: <Mail className="w-5 h-5" />,
      provider: 'EmailOctopus',
      essential: false,
      notes: 'Grátis até 2500 subs'
    },

    // MARKETING INICIAL (OPCIONAL)
    {
      name: 'Growth Orgânico',
      description: 'SEO + Social Media (GRATUITO)',
      monthly: 0,
      setup: 0,
      category: 'marketing',
      icon: <Zap className="w-5 h-5" />,
      provider: 'Manual',
      essential: false,
      notes: 'Começa orgânico, adiciona ads depois'
    },

    // LEGAL E ADMINISTRATIVO
    {
      name: 'Termos & Privacidade',
      description: 'Redação legal GDPR-compliant',
      monthly: 0,
      setup: 300,
      category: 'legal',
      icon: <FileText className="w-5 h-5" />,
      provider: 'Advogado PT',
      essential: true,
      notes: 'Setup único (one-time)'
    },
    {
      name: "Let's Encrypt SSL",
      description: 'SSL gratuito via Cloudflare (GRATUITO)',
      monthly: 0,
      setup: 0,
      category: 'legal',
      icon: <Lock className="w-5 h-5" />,
      provider: 'Cloudflare/LE',
      essential: true,
      notes: 'SSL automático e renovação grátis'
    },

    // BUFFER DE EMERGÊNCIA
    {
      name: 'Overages & Surpresas',
      description: 'Custos inesperados (10% do total)',
      monthly: 30,
      setup: 0,
      category: 'buffer',
      icon: <AlertTriangle className="w-5 h-5" />,
      provider: 'Vários',
      essential: true,
      notes: 'Picos de uso, taxas extras, etc.'
    }
  ];

  // Calcular totais
  const month1Setup = costs.reduce((sum, c) => sum + (c.setup || 0), 0);
  const monthlyRecurring = costs.reduce((sum, c) => sum + c.monthly, 0);
  
  const month1Total = month1Setup + monthlyRecurring;
  const month2Total = monthlyRecurring;
  const month3Total = monthlyRecurring;
  const totalFirst3Months = month1Total + month2Total + month3Total;

  // Totais por categoria
  const categoryTotals = {
    infrastructure: costs.filter(c => c.category === 'infrastructure').reduce((sum, c) => sum + c.monthly, 0),
    apis: costs.filter(c => c.category === 'apis').reduce((sum, c) => sum + c.monthly, 0),
    tools: costs.filter(c => c.category === 'tools').reduce((sum, c) => sum + c.monthly, 0),
    marketing: costs.filter(c => c.category === 'marketing').reduce((sum, c) => sum + c.monthly, 0),
    legal: costs.filter(c => c.category === 'legal').reduce((sum, c) => sum + c.monthly, 0),
    buffer: costs.filter(c => c.category === 'buffer').reduce((sum, c) => sum + c.monthly, 0)
  };

  const categoryLabels = {
    infrastructure: 'Infraestrutura',
    apis: 'APIs & Serviços',
    tools: 'Ferramentas',
    marketing: 'Marketing',
    legal: 'Legal & Admin',
    buffer: 'Buffer'
  };

  const categoryColors = {
    infrastructure: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' },
    apis: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-600' },
    tools: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', icon: 'text-teal-600' },
    marketing: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600' },
    legal: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', icon: 'text-slate-600' },
    buffer: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: 'text-red-600' }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Euro className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Custos Reais - Plano MÍNIMO
                </h1>
              </div>
              <p className="text-white/80 text-lg font-medium">
                Investimento necessário usando FREE tiers (Cloudflare, Analytics, Email)
              </p>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-5xl font-bold text-white mb-1">
                €{totalFirst3Months.toLocaleString('pt-PT')}
              </div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Total 3 meses</div>
            </div>
          </div>

          {/* Breakdown mensal */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Mês 1 (Setup)</div>
              <div className="text-3xl font-bold text-white mb-1">€{month1Total.toLocaleString('pt-PT')}</div>
              <div className="text-white/50 text-xs">€{month1Setup} setup + €{monthlyRecurring} recorrente</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Mês 2</div>
              <div className="text-3xl font-bold text-white mb-1">€{month2Total.toLocaleString('pt-PT')}</div>
              <div className="text-white/50 text-xs">Apenas custos recorrentes</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Mês 3</div>
              <div className="text-3xl font-bold text-white mb-1">€{month3Total.toLocaleString('pt-PT')}</div>
              <div className="text-white/50 text-xs">Custos estabilizados</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Totais por categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Distribuição por Categoria</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(categoryTotals).map(([cat, total]) => {
            const category = cat as keyof typeof categoryColors;
            const percentage = monthlyRecurring > 0 ? Math.round((total / monthlyRecurring) * 100) : 0;
            const colors = categoryColors[category];
            
            return (
              <div key={cat} className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-5`}>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {categoryLabels[category]}
                </div>
                <div className={`text-3xl font-bold ${colors.text} mb-1`}>
                  €{total.toLocaleString('pt-PT')}
                </div>
                <div className="text-sm text-slate-600">{percentage}% do total mensal</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Breakdown detalhado */}
      {Object.entries(categoryLabels).map(([cat, label]) => {
        const category = cat as keyof typeof categoryColors;
        const items = costs.filter(c => c.category === category);
        const colors = categoryColors[category];
        
        if (items.length === 0) return null;
        
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className={`${colors.bg} ${colors.border} border-b-2 p-6`}>
              <h3 className={`text-xl font-bold ${colors.text}`}>{label}</h3>
              <p className="text-slate-600 text-sm mt-1">
                Total mensal: €{categoryTotals[category].toLocaleString('pt-PT')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                      <div className={colors.icon}>
                        {item.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                            {item.essential && (
                              <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs">
                                Essencial
                              </Badge>
                            )}
                            {item.monthly === 0 && (
                              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs">
                                GRÁTIS
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="font-semibold">Provider:</span> {item.provider}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-slate-500 mt-1 italic">
                              💡 {item.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          {item.monthly > 0 ? (
                            <>
                              <div className="text-2xl font-bold text-slate-900">
                                €{item.monthly.toLocaleString('pt-PT')}
                              </div>
                              <div className="text-xs text-slate-500">por mês</div>
                            </>
                          ) : (
                            <div className="text-2xl font-bold text-emerald-600">
                              GRÁTIS
                            </div>
                          )}
                          {item.setup && item.setup > 0 && (
                            <div className="mt-1 text-xs font-semibold text-orange-600">
                              + €{item.setup} setup
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Resumo final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 text-white"
      >
        <div className="flex items-start gap-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm flex-shrink-0">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">💰 Plano MÍNIMO - Análise</h2>
            
            <div className="space-y-3 text-white/90 text-base leading-relaxed">
              <p>
                <strong className="text-white">✅ Total para 3 meses:</strong> €{totalFirst3Months.toLocaleString('pt-PT')} 
                (€{month1Setup} setup + €{(monthlyRecurring * 3).toLocaleString('pt-PT')} recorrentes)
              </p>
              
              <p>
                <strong className="text-white">💰 Custo mensal:</strong> €{monthlyRecurring.toLocaleString('pt-PT')}/mês 
                após setup inicial
              </p>
              
              <p>
                <strong className="text-white">🎯 Break-even:</strong> Com plano Pro a €67/mês, precisas de apenas 
                <strong className="text-white"> 3 clientes</strong> para cobrir custos! (€{monthlyRecurring} ÷ €67 = {(monthlyRecurring / 67).toFixed(1)})
              </p>
              
              <p>
                <strong className="text-white">📦 O que está incluído:</strong> Cloudflare FREE (CDN + SSL), 
                Google Analytics FREE, EmailOctopus FREE (2500 subs), Let's Encrypt SSL
              </p>
              
              <p>
                <strong className="text-white">🚀 Google Cloud oferece $300 grátis</strong> nos primeiros 90 dias, 
                cobrindo completamente TTS e STT (economia de ~€60)
              </p>
            </div>

            <div className="mt-6 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-lg font-bold text-white mb-2">🎉 Conclusão:</p>
              <p className="text-white/90 text-base">
                Com <strong className="text-white">€{totalFirst3Months.toLocaleString('pt-PT')}</strong> tens a plataforma 
                100% funcional por 3 meses. Com apenas 3-5 clientes já estás lucrativo! 🚀
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline de pagamentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Timeline de Desembolsos</h2>
          </div>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-24 flex-shrink-0">
                <div className="text-sm font-bold text-indigo-600">Mês 1</div>
                <div className="text-xs text-slate-500">Junho 2026</div>
              </div>
              <div className="flex-1">
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-indigo-900">€{month1Total.toLocaleString('pt-PT')}</div>
                    <Badge className="bg-indigo-600 text-white">Setup + Recorrente</Badge>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Domínio .pt (€15 setup)</li>
                    <li>• Termos legais (€300 setup)</li>
                    <li>• Todas as subscrições mensais (€{monthlyRecurring})</li>
                    <li>• Créditos Twilio iniciais (~€75 pré-pago)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-24 flex-shrink-0">
                <div className="text-sm font-bold text-teal-600">Mês 2</div>
                <div className="text-xs text-slate-500">Julho 2026</div>
              </div>
              <div className="flex-1">
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-teal-900">€{month2Total.toLocaleString('pt-PT')}</div>
                    <Badge className="bg-teal-600 text-white">Apenas Recorrente</Badge>
                  </div>
                  <p className="text-sm text-slate-700">
                    Renovação automática de todas as subscrições. Sem custos de setup.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-24 flex-shrink-0">
                <div className="text-sm font-bold text-emerald-600">Mês 3</div>
                <div className="text-xs text-slate-500">Agosto 2026</div>
              </div>
              <div className="flex-1">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-emerald-900">€{month3Total.toLocaleString('pt-PT')}</div>
                    <Badge className="bg-emerald-600 text-white">Estabilizado</Badge>
                  </div>
                  <p className="text-sm text-slate-700">
                    Custos previsíveis. Neste ponto já deves ter primeiros clientes pagantes cobrindo os custos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
