import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Euro, Zap, Shield, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function StartupCostsComparison() {
  const [selectedPlan, setSelectedPlan] = useState<'minimal' | 'premium'>('minimal');

  // PLANO MÍNIMO (usando FREE tiers)
  const minimalCosts = {
    setup: 315, // Domínio €15 + Legal €300
    monthly: {
      infrastructure: 26.25, // Supabase €25 + Domínio €1.25 + Cloudflare FREE
      apis: 104, // Twilio VoIP €45 + SMS €24 + Google TTS €8 + STT €12 + Easypay €15
      tools: 26, // Sentry €26 (Plausible FREE, EmailOctopus FREE até 2500)
      marketing: 0, // Growth orgânico inicial
      legal: 0, // SSL Let's Encrypt FREE
      buffer: 30 // 10% do total
    }
  };

  // PLANO PREMIUM (tudo pago)
  const premiumCosts = {
    setup: 315, // Domínio €15 + Legal €300
    monthly: {
      infrastructure: 46.25, // Supabase €25 + Domínio €1.25 + Cloudflare Pro €20
      apis: 104, // Mesmo do mínimo
      tools: 55, // Sentry €26 + Plausible €9 + EmailOctopus €20
      marketing: 250, // Google Ads €150 + LinkedIn €100
      legal: 20, // SSL EV €20
      buffer: 50 // Maior buffer para marketing
    }
  };

  const minimalTotal = Object.values(minimalCosts.monthly).reduce((a, b) => a + b, 0);
  const premiumTotal = Object.values(premiumCosts.monthly).reduce((a, b) => a + b, 0);

  const minimal3Months = minimalCosts.setup + (minimalTotal * 3);
  const premium3Months = premiumCosts.setup + (premiumTotal * 3);

  const features = [
    {
      name: 'Cloudflare CDN & SSL',
      minimal: 'FREE (básico)',
      premium: 'Pro €20/mês',
      description: 'Mínimo: CDN + SSL + DDoS básico | Premium: WAF + Image Optimization'
    },
    {
      name: 'Analytics',
      minimal: 'Google Analytics FREE',
      premium: 'Plausible €9/mês',
      description: 'Mínimo: Google Analytics | Premium: GDPR-compliant sem cookies'
    },
    {
      name: 'Email Marketing',
      minimal: 'EmailOctopus FREE',
      premium: 'EmailOctopus Pro €20/mês',
      description: 'Mínimo: até 2500 subs | Premium: automações avançadas'
    },
    {
      name: 'Marketing Pago',
      minimal: 'Growth Orgânico',
      premium: 'Ads €250/mês',
      description: 'Mínimo: SEO + Social | Premium: Google Ads + LinkedIn'
    },
    {
      name: 'SSL Certificate',
      minimal: "Let's Encrypt FREE",
      premium: 'DigiCert EV €20/mês',
      description: 'Mínimo: SSL básico | Premium: Extended Validation (barra verde)'
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-6">
      {/* Header com comparação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Comparação de Custos</h1>
          <p className="text-white/80 text-lg">
            Escolha o plano ideal para começar: Mínimo (FREE tiers) vs Premium (tudo pago)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plano MÍNIMO */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPlan('minimal')}
            className={`bg-white rounded-2xl p-8 cursor-pointer transition-all ${
              selectedPlan === 'minimal' ? 'ring-4 ring-emerald-400 shadow-2xl' : 'opacity-80'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Plano MÍNIMO</h3>
                <p className="text-sm text-slate-600">Usando FREE tiers</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-5xl font-bold text-slate-900 mb-2">
                €{minimalTotal}
                <span className="text-lg font-normal text-slate-600">/mês</span>
              </div>
              <div className="text-sm text-slate-600">
                + €{minimalCosts.setup} setup único
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Cloudflare FREE (CDN + SSL)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Google Analytics FREE</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>EmailOctopus FREE (2500 subs)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Growth Orgânico (SEO + Social)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Let's Encrypt SSL FREE</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-900 mb-1">TOTAL 3 MESES</div>
              <div className="text-2xl font-bold text-emerald-900">€{minimal3Months.toLocaleString('pt-PT')}</div>
            </div>

            <Badge className="mt-4 bg-emerald-600 text-white">
              ✅ Recomendado para começar
            </Badge>
          </motion.div>

          {/* Plano PREMIUM */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPlan('premium')}
            className={`bg-white rounded-2xl p-8 cursor-pointer transition-all ${
              selectedPlan === 'premium' ? 'ring-4 ring-indigo-400 shadow-2xl' : 'opacity-80'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Plano PREMIUM</h3>
                <p className="text-sm text-slate-600">Tudo pago & otimizado</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-5xl font-bold text-slate-900 mb-2">
                €{premiumTotal}
                <span className="text-lg font-normal text-slate-600">/mês</span>
              </div>
              <div className="text-sm text-slate-600">
                + €{premiumCosts.setup} setup único
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Cloudflare Pro €20 (WAF + Otimização)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Plausible €9 (GDPR-compliant)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>EmailOctopus Pro €20 (automações)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Google Ads €150 + LinkedIn €100</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>DigiCert EV SSL €20 (barra verde)</span>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <div className="text-xs font-bold text-indigo-900 mb-1">TOTAL 3 MESES</div>
              <div className="text-2xl font-bold text-indigo-900">€{premium3Months.toLocaleString('pt-PT')}</div>
            </div>

            <Badge className="mt-4 bg-indigo-600 text-white">
              🚀 Para crescimento rápido
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabela de comparação detalhada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Comparação Detalhada de Features</h2>
          <p className="text-slate-600 mt-1">Veja as diferenças entre os dois planos</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-bold text-slate-900">Serviço</th>
                <th className="text-left p-4 font-bold text-emerald-900">Plano MÍNIMO</th>
                <th className="text-left p-4 font-bold text-indigo-900">Plano PREMIUM</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{feature.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{feature.description}</div>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300">
                      {feature.minimal}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-300">
                      {feature.premium}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Breakdown por categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Mínimo Breakdown */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Breakdown Plano MÍNIMO</h3>
          <div className="space-y-4">
            {Object.entries(minimalCosts.monthly).map(([category, value]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-slate-700 capitalize">{category.replace('_', ' ')}</span>
                <span className="font-bold text-slate-900">€{value.toLocaleString('pt-PT')}</span>
              </div>
            ))}
            <div className="pt-4 border-t-2 border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-slate-900">Total Mensal</span>
              <span className="text-2xl font-bold text-emerald-600">€{minimalTotal}</span>
            </div>
          </div>
        </div>

        {/* Premium Breakdown */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Breakdown Plano PREMIUM</h3>
          <div className="space-y-4">
            {Object.entries(premiumCosts.monthly).map(([category, value]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-slate-700 capitalize">{category.replace('_', ' ')}</span>
                <span className="font-bold text-slate-900">€{value.toLocaleString('pt-PT')}</span>
              </div>
            ))}
            <div className="pt-4 border-t-2 border-indigo-200 flex items-center justify-between">
              <span className="font-bold text-slate-900">Total Mensal</span>
              <span className="text-2xl font-bold text-indigo-600">€{premiumTotal}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recomendação final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl p-10 text-white"
      >
        <h2 className="text-3xl font-bold mb-6">💡 Recomendação Profissional</h2>
        
        <div className="space-y-4 text-white/90 text-lg leading-relaxed">
          <p>
            <strong className="text-white">✅ COMEÇA COM O PLANO MÍNIMO (€{minimalTotal}/mês)</strong>
          </p>
          
          <p>
            O Cloudflare FREE oferece CDN global, SSL automático e proteção DDoS básica — mais que suficiente 
            para os primeiros 6-12 meses. O plano Pro (€20/mês) só compensa quando tens:
          </p>
          
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Mais de 100 clientes ativos</li>
            <li>Ataques DDoS frequentes</li>
            <li>Necessidade de WAF (Web Application Firewall) avançado</li>
            <li>Otimização de imagens automática</li>
          </ul>

          <p className="pt-4">
            <strong className="text-white">💰 ECONOMIA:</strong> Plano Mínimo poupa <strong>€{premiumTotal - minimalTotal}/mês</strong> 
            (€{(premiumTotal - minimalTotal) * 12}/ano) comparado ao Premium.
          </p>

          <p>
            <strong className="text-white">🎯 QUANDO FAZER UPGRADE:</strong> Quando tiveres 20-30 clientes pagantes e receita 
            de €1.500-2.000/mês, então investe em marketing (€250/mês) e ferramentas premium.
          </p>
        </div>

        <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-xl font-bold text-white mb-2">🎉 Conclusão Final:</p>
          <p className="text-white text-lg">
            <strong>€{minimal3Months}</strong> em 3 meses é tudo que precisas para ter o Tá Pago.pt 
            100% operacional. Com 8-10 clientes já estás em break-even! 🚀
          </p>
        </div>
      </motion.div>
    </div>
  );
}
