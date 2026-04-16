import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Database,
  Code,
  Brain,
  Globe,
  Shield,
  TrendingUp,
  Target,
  AlertCircle,
  Download,
  DollarSign,
  Package,
  Phone,
  Mail,
  CreditCard,
  MessageSquare,
  Users,
  Zap,
  ChevronRight,
  Award,
  Flag,
  BarChart3,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { exportRoadmapToPDF } from './exportPDF';
import { 
  calculateProjectMetrics, 
  getCriticalPendingFeatures
} from '../../utils/projectStatusDetector';

// Data atual: 8 de março de 2026
const TODAY = new Date('2026-03-08');

interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  bufferDays: number;
  totalDays: number;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  icon: React.ReactNode;
  color: string;
  dependencies: string[];
  deliverables: string[];
  risks: string[];
  team: string[];
}

interface RevenueModel {
  type: 'subscription' | 'commission';
  name: string;
  description: string;
  estimatedValue: string;
  startPhase: string;
}

// Função para formatar data em PT-PT
function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Função para calcular dias úteis entre duas datas
function getBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function LaunchRoadmapFast() {
  const metrics = useMemo(() => calculateProjectMetrics(), []);

  // Cronograma REALISTA: Lançamento 1º de Junho 2026
  const milestones: Milestone[] = useMemo(() => {
    const phases: Milestone[] = [];
    
    // FASE 1: Fundação (JÁ COMPLETA)
    phases.push({
      id: 'foundation',
      name: 'Fundação & Infraestrutura',
      description: 'Autenticação, Database, Servidor',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-01-15'),
      duration: 45,
      bufferDays: 15,
      totalDays: 60,
      status: 'completed',
      progress: 100,
      icon: <Database className="w-5 h-5" />,
      color: 'emerald',
      dependencies: [],
      deliverables: ['Auth completo', 'Biometria WebAuthn', 'Supabase integrado'],
      risks: [],
      team: ['Backend', 'Frontend']
    });

    // FASE 2: Core MVP (JÁ COMPLETA)
    phases.push({
      id: 'core-mvp',
      name: 'Features Core do MVP',
      description: 'CRUD Devedores, Acordos, Simulador',
      startDate: new Date('2025-01-16'),
      endDate: new Date('2025-02-28'),
      duration: 30,
      bufferDays: 12,
      totalDays: 42,
      status: 'completed',
      progress: 100,
      icon: <Code className="w-5 h-5" />,
      color: 'blue',
      dependencies: ['foundation'],
      deliverables: ['Gestão de devedores', 'Sistema de acordos', 'Simulador'],
      risks: [],
      team: ['Frontend', 'Backend']
    });

    // FASE 3: Agente de Voz IA (EM PROGRESSO - 65%)
    phases.push({
      id: 'ai-voice-agent',
      name: 'Agente de Voz com IA',
      description: 'Chamadas telefónicas automatizadas',
      startDate: new Date('2026-03-08'),
      endDate: new Date('2026-03-25'),
      duration: 12,
      bufferDays: 6,
      totalDays: 18,
      status: 'in-progress',
      progress: 65,
      icon: <Brain className="w-5 h-5" />,
      color: 'purple',
      dependencies: ['core-mvp'],
      deliverables: ['Interface agente', 'Google TTS PT-PT', 'IA conversacional'],
      risks: ['Complexidade IA', 'Latência API'],
      team: ['IA/ML', 'Backend']
    });

    // FASE 4: Conectores Essenciais
    phases.push({
      id: 'essential-connectors',
      name: 'Conectores Essenciais',
      description: 'Twilio, Easypay, STT, SMS',
      startDate: new Date('2026-03-26'),
      endDate: new Date('2026-04-18'),
      duration: 16,
      bufferDays: 8,
      totalDays: 24,
      status: 'planned',
      progress: 0,
      icon: <Zap className="w-5 h-5" />,
      color: 'orange',
      dependencies: ['ai-voice-agent'],
      deliverables: ['Twilio VoIP', 'Easypay Multibanco', 'Google STT'],
      risks: ['Aprovação Twilio 3-7 dias', 'Validação Easypay'],
      team: ['Backend', 'DevOps']
    });

    // FASE 5: Preparação & Segurança
    phases.push({
      id: 'mvp-ready',
      name: 'Preparação & Segurança',
      description: 'Validações, testes, monitoramento',
      startDate: new Date('2026-04-19'),
      endDate: new Date('2026-05-08'),
      duration: 14,
      bufferDays: 6,
      totalDays: 20,
      status: 'planned',
      progress: 0,
      icon: <Shield className="w-5 h-5" />,
      color: 'indigo',
      dependencies: ['essential-connectors'],
      deliverables: ['Rate Limiting', 'Validação Zod', 'Testes de carga'],
      risks: ['Bugs críticos', 'Performance'],
      team: ['Backend', 'DevOps', 'QA']
    });

    // FASE 6: Beta Privado
    phases.push({
      id: 'beta-private',
      name: 'Beta Privado',
      description: 'Testes com 5-8 early adopters',
      startDate: new Date('2026-05-09'),
      endDate: new Date('2026-05-22'),
      duration: 10,
      bufferDays: 4,
      totalDays: 14,
      status: 'planned',
      progress: 0,
      icon: <Users className="w-5 h-5" />,
      color: 'teal',
      dependencies: ['mvp-ready'],
      deliverables: ['Onboarding early adopters', 'Coleta feedback', 'Resolução bugs'],
      risks: ['Feedback negativo', 'Bugs em produção'],
      team: ['Produto', 'Customer Success']
    });

    // FASE 7: Iteração Rápida
    phases.push({
      id: 'iteration',
      name: 'Iteração Rápida',
      description: 'Correções baseadas em feedback',
      startDate: new Date('2026-05-23'),
      endDate: new Date('2026-05-31'),
      duration: 6,
      bufferDays: 3,
      totalDays: 9,
      status: 'planned',
      progress: 0,
      icon: <Target className="w-5 h-5" />,
      color: 'cyan',
      dependencies: ['beta-private'],
      deliverables: ['Correção bugs', 'Otimizações UX', 'Melhorias performance'],
      risks: ['Tempo curto', 'Priorização difícil'],
      team: ['Toda equipe']
    });

    // FASE 8: LANÇAMENTO PÚBLICO
    phases.push({
      id: 'public-launch',
      name: 'LANÇAMENTO PÚBLICO',
      description: 'Go-live para mercado português',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-01'),
      duration: 1,
      bufferDays: 0,
      totalDays: 1,
      status: 'planned',
      progress: 0,
      icon: <Rocket className="w-5 h-5" />,
      color: 'green',
      dependencies: ['iteration'],
      deliverables: ['MVP ONLINE', 'Landing page ativa', 'Sistema assinaturas'],
      risks: ['Pico tráfego', 'Bugs não detectados'],
      team: ['TODA EMPRESA']
    });

    return phases;
  }, []);

  // Modelos de Receita
  const revenueModels: RevenueModel[] = [
    {
      type: 'subscription',
      name: 'Assinaturas Mensais',
      description: 'Planos Starter (€24), Pro (€67) e Enterprise (€149)',
      estimatedValue: '€24 - €149/mês',
      startPhase: 'Lançamento Público'
    },
    {
      type: 'commission',
      name: 'Comissão por Recuperação',
      description: 'Percentual sobre crédito recuperado',
      estimatedValue: '5% - 15%',
      startPhase: 'Pós-Lançamento'
    }
  ];

  // Calcular informações
  const launchDate = milestones.find(m => m.id === 'public-launch')?.startDate;
  const daysUntilLaunch = launchDate ? Math.ceil((launchDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalProjectDays = milestones.reduce((sum, m) => sum + m.totalDays, 0);
  const totalBufferDays = milestones.reduce((sum, m) => sum + m.bufferDays, 0);
  const bufferPercentage = Math.round((totalBufferDays / (totalProjectDays - totalBufferDays)) * 100);
  
  const phases2026 = milestones.filter(m => m.startDate >= new Date('2026-03-01'));
  const totalDays2026 = phases2026.reduce((sum, m) => sum + m.totalDays, 0);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-6">
      {/* Header Executivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Roadmap Executivo
                </h1>
              </div>
              <p className="text-white/70 text-lg font-medium">
                Cronograma de Lançamento • 1º de Junho de 2026
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white mb-1">{daysUntilLaunch}</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">dias restantes</div>
            </div>
          </div>

          {/* Métricas em Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Progresso Total</div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.overallProgress}%</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${metrics.overallProgress}%` }}></div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Fase Atual</div>
              <div className="text-xl font-bold text-white mb-1">{metrics.currentPhase}</div>
              <div className="text-white/50 text-xs">65% completo</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Data Lançamento</div>
              <div className="text-xl font-bold text-white mb-1">01 Jun 2026</div>
              <div className="text-white/50 text-xs">Domingo</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">Buffer</div>
              <div className="text-3xl font-bold text-white mb-1">{bufferPercentage}%</div>
              <div className="text-white/50 text-xs">{totalBufferDays} dias margem</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendário Gantt Profissional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200"
      >
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Calendário de Execução</h2>
              <p className="text-slate-500 text-sm">Março — Junho 2026 • {totalDays2026} dias úteis</p>
            </div>
            <Button 
              onClick={() => exportRoadmapToPDF({
                milestones,
                phases2026,
                totalDays2026,
                daysUntilLaunch,
                bufferPercentage,
                totalBufferDays,
                overallProgress: metrics.overallProgress,
                today: TODAY
              })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Download className="size-5" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Legenda */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-500 rounded shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Completo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Em Progresso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-slate-300 rounded shadow-sm"></div>
              <span className="text-sm font-medium text-slate-700">Planejado</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-700">Hoje: {formatDate(TODAY)}</span>
            </div>
          </div>

          {/* Timeline de Meses */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className="w-72 flex-shrink-0"></div>
              <div className="flex-1 grid grid-cols-4 gap-3">
                {['Março 2026', 'Abril 2026', 'Maio 2026', 'Junho 2026'].map((month) => (
                  <div key={month} className="text-center">
                    <div className="text-sm font-bold text-slate-900 bg-slate-50 rounded-lg py-2 px-3 border border-slate-200">
                      {month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fases do Gantt */}
          <div className="space-y-4">
            {phases2026.map((milestone, idx) => {
              const calendarStart = new Date('2026-03-01');
              const calendarEnd = new Date('2026-06-30');
              const totalDays = (calendarEnd.getTime() - calendarStart.getTime()) / (1000 * 60 * 60 * 24);
              
              const startOffset = (milestone.startDate.getTime() - calendarStart.getTime()) / (1000 * 60 * 60 * 24);
              const duration = (milestone.endDate.getTime() - milestone.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
              
              const leftPercent = (startOffset / totalDays) * 100;
              const widthPercent = (duration / totalDays) * 100;

              return (
                <div key={milestone.id} className="group">
                  <div className="flex items-center gap-4">
                    {/* Info da Fase */}
                    <div className="w-72 flex-shrink-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm ${
                          milestone.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {idx + 3}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 leading-tight mb-0.5">
                            {milestone.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight mb-1">
                            {milestone.description}
                          </div>
                          <div className="text-xs font-semibold text-slate-600">
                            {milestone.totalDays} dias
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Barra do Gantt */}
                    <div className="flex-1 relative h-14">
                      <div className="absolute inset-0 grid grid-cols-4 gap-3">
                        {[0, 1, 2, 3].map((col) => (
                          <div key={col} className="border-l border-slate-100 first:border-l-0"></div>
                        ))}
                      </div>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className={`absolute top-1/2 -translate-y-1/2 h-9 rounded-lg shadow-md group-hover:shadow-xl transition-all ${
                          milestone.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                          milestone.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          'bg-gradient-to-r from-slate-300 to-slate-400'
                        }`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          originX: 0
                        }}
                      >
                        <div className="h-full flex items-center justify-center px-3">
                          <span className="text-xs font-bold text-white whitespace-nowrap">
                            {milestone.status === 'in-progress' ? `${milestone.progress}%` : milestone.status === 'completed' ? '✓' : ''}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo Footer */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Sprint Final</div>
                <div className="text-3xl font-bold text-blue-900 mb-1">{totalDays2026}</div>
                <div className="text-sm text-blue-700">dias úteis de trabalho</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Lançamento</div>
                <div className="text-3xl font-bold text-emerald-900 mb-1">1 Jun</div>
                <div className="text-sm text-emerald-700">Domingo, início do mês</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">Margem</div>
                <div className="text-3xl font-bold text-orange-900 mb-1">{bufferPercentage}%</div>
                <div className="text-sm text-orange-700">{totalBufferDays} dias buffer</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabela de Fases Detalhada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Detalhamento das Fases</h2>
          <p className="text-slate-500 text-sm">Cronograma completo do projeto</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">#</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Fase</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Período</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Duração</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Progresso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {milestones.map((m, idx) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      m.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="font-bold text-slate-900 mb-1">{m.name}</div>
                    <div className="text-sm text-slate-500">{m.description}</div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-slate-900">{formatDate(m.startDate)}</div>
                    <div className="text-xs text-slate-400 my-0.5">↓</div>
                    <div className="text-sm font-medium text-slate-900">{formatDate(m.endDate)}</div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <div className="text-lg font-bold text-slate-900">{m.totalDays}</div>
                    <div className="text-xs text-slate-500">dias</div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <Badge className={`font-semibold ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                      m.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                      'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {m.status === 'completed' ? '✓ Completo' :
                       m.status === 'in-progress' ? '⟳ Ativo' :
                       '○ Planejado'}
                    </Badge>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.progress}%` }}
                          transition={{ duration: 1, delay: idx * 0.08 }}
                          className={`h-full ${
                            m.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                            m.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="text-sm font-bold text-slate-700 w-12 text-right">{m.progress}%</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Estatísticas */}
        <div className="p-8 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-1">{milestones.length}</div>
              <div className="text-sm font-medium text-slate-600">Fases Totais</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-1">{milestones.filter(m => m.status === 'completed').length}</div>
              <div className="text-sm font-medium text-slate-600">Completas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">{milestones.filter(m => m.status === 'in-progress').length}</div>
              <div className="text-sm font-medium text-slate-600">Em Progresso</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-600 mb-1">{milestones.filter(m => m.status === 'planned').length}</div>
              <div className="text-sm font-medium text-slate-600">Planejadas</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modelos de Receita */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200"
      >
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Modelos de Receita</h2>
              <p className="text-slate-500 text-sm">Estratégia de monetização da plataforma</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {revenueModels.map((model, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl border-2 shadow-lg ${
                  model.type === 'subscription' 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                    : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {model.type === 'subscription' ? (
                      <Package className="w-8 h-8 text-blue-600" />
                    ) : (
                      <CreditCard className="w-8 h-8 text-emerald-600" />
                    )}
                    <h3 className={`font-bold text-xl ${
                      model.type === 'subscription' ? 'text-blue-900' : 'text-emerald-900'
                    }`}>
                      {model.name}
                    </h3>
                  </div>
                  <Badge className={`font-semibold ${
                    model.type === 'subscription' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {model.type === 'subscription' ? 'Recorrente' : 'Variável'}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-700 mb-5 leading-relaxed">{model.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-white/50">
                    <span className="text-sm font-semibold text-slate-600">Valor Estimado</span>
                    <span className="text-xl font-bold text-slate-900">{model.estimatedValue}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-white/50">
                    <span className="text-sm font-semibold text-slate-600">Início</span>
                    <span className="text-sm font-bold text-slate-700">{model.startPhase}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 text-white">
              <TrendingUp className="w-6 h-6 flex-shrink-0" />
              <div>
                <div className="font-bold text-lg mb-1">Projeção de Receita</div>
                <div className="text-white/90 text-sm leading-relaxed">
                  Com 50 clientes Pro (€67/mês) + 10% comissão sobre €100k recuperados = <strong className="text-white font-bold">~€13.350/mês</strong> de receita potencial
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 text-white"
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="w-10 h-10" />
              <h2 className="text-3xl font-bold">Próximas Ações</h2>
            </div>
            <p className="text-white/90 text-lg leading-relaxed mb-4">
              <strong>Faltam {daysUntilLaunch} dias</strong> para o lançamento público da plataforma. Foco total na finalização do Agente de Voz IA até 25 de Março.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 className="w-5 h-5" />
              <span>Beta privado: 9-22 Maio • Lançamento: 1º Junho</span>
            </div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-6xl font-bold mb-2">{Math.round(daysUntilLaunch / 7)}</div>
            <div className="text-white/80 uppercase tracking-wider text-sm font-semibold">semanas</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}