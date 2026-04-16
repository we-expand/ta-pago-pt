import { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Target, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap,
  BarChart3,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Filter,
  Download,
  Eye,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type Channel = 'whatsapp' | 'email' | 'sms' | 'phone';
type AgeGroup = '18-29' | '30-49' | '50-64' | '65+';
type Profession = 'empresario' | 'empregado' | 'autonomo' | 'aposentado' | 'outro';
type DebtUrgency = 'baixa' | 'media' | 'alta' | 'critica';

interface ChannelRule {
  id: string;
  name: string;
  active: boolean;
  priority: number;
  conditions: {
    ageGroups?: AgeGroup[];
    professions?: Profession[];
    urgency?: DebtUrgency[];
    daysOverdue?: { min: number; max: number };
    debtValue?: { min: number; max: number };
    previousResponseRate?: { min: number; max: number };
    bestTimeSlot?: string[];
  };
  channels: {
    primary: Channel;
    fallback?: Channel;
    tertiary?: Channel;
  };
  timing?: {
    waitBeforeFallback: number; // horas
    maxAttempts: number;
  };
  abTesting?: {
    enabled: boolean;
    variant: 'A' | 'B';
    splitPercentage: number;
  };
}

interface ChannelPerformance {
  channel: Channel;
  sent: number;
  delivered: number;
  opened: number;
  responded: number;
  paid: number;
  cost: number;
  revenue: number;
  roi: number;
  avgResponseTime: string;
  byDemographic: {
    ageGroup: AgeGroup;
    responseRate: number;
    avgValue: number;
  }[];
}

export default function ChannelOrchestration({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'performance' | 'abtesting'>('dashboard');
  const [rules, setRules] = useState<ChannelRule[]>([
    {
      id: '1',
      name: 'Millennials - WhatsApp First',
      active: true,
      priority: 1,
      conditions: {
        ageGroups: ['18-29', '30-49'],
        urgency: ['media', 'alta']
      },
      channels: {
        primary: 'whatsapp',
        fallback: 'email',
        tertiary: 'sms'
      },
      timing: {
        waitBeforeFallback: 24,
        maxAttempts: 3
      },
      abTesting: {
        enabled: true,
        variant: 'A',
        splitPercentage: 50
      }
    },
    {
      id: '2',
      name: 'Seniores - Telefone Preferencial',
      active: true,
      priority: 2,
      conditions: {
        ageGroups: ['50-64', '65+'],
        debtValue: { min: 1000, max: 999999 }
      },
      channels: {
        primary: 'phone',
        fallback: 'email'
      },
      timing: {
        waitBeforeFallback: 48,
        maxAttempts: 2
      },
      abTesting: {
        enabled: false,
        variant: 'A',
        splitPercentage: 0
      }
    },
    {
      id: '3',
      name: 'Empresários - WhatsApp Profissional',
      active: true,
      priority: 3,
      conditions: {
        professions: ['empresario', 'autonomo'],
        urgency: ['alta', 'critica']
      },
      channels: {
        primary: 'whatsapp',
        fallback: 'phone',
        tertiary: 'email'
      },
      timing: {
        waitBeforeFallback: 12,
        maxAttempts: 4
      },
      abTesting: {
        enabled: true,
        variant: 'B',
        splitPercentage: 30
      }
    }
  ]);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ChannelRule | null>(null);

  // Performance mock data
  const channelPerformance: ChannelPerformance[] = [
    {
      channel: 'whatsapp',
      sent: 1250,
      delivered: 1198,
      opened: 987,
      responded: 456,
      paid: 289,
      cost: 420,
      revenue: 45200,
      roi: 107.6,
      avgResponseTime: '4.2h',
      byDemographic: [
        { ageGroup: '18-29', responseRate: 68, avgValue: 850 },
        { ageGroup: '30-49', responseRate: 52, avgValue: 1240 },
        { ageGroup: '50-64', responseRate: 34, avgValue: 980 },
        { ageGroup: '65+', responseRate: 18, avgValue: 650 }
      ]
    },
    {
      channel: 'email',
      sent: 2100,
      delivered: 2045,
      opened: 1234,
      responded: 567,
      paid: 178,
      cost: 180,
      revenue: 28900,
      roi: 160.5,
      avgResponseTime: '18.5h',
      byDemographic: [
        { ageGroup: '18-29', responseRate: 42, avgValue: 720 },
        { ageGroup: '30-49', responseRate: 58, avgValue: 1580 },
        { ageGroup: '50-64', responseRate: 61, avgValue: 1890 },
        { ageGroup: '65+', responseRate: 45, avgValue: 1120 }
      ]
    },
    {
      channel: 'sms',
      sent: 890,
      delivered: 876,
      opened: 654,
      responded: 234,
      paid: 89,
      cost: 890,
      revenue: 15220,
      roi: 17.1,
      avgResponseTime: '6.8h',
      byDemographic: [
        { ageGroup: '18-29', responseRate: 38, avgValue: 560 },
        { ageGroup: '30-49', responseRate: 45, avgValue: 890 },
        { ageGroup: '50-64', responseRate: 52, avgValue: 1240 },
        { ageGroup: '65+', responseRate: 48, avgValue: 780 }
      ]
    },
    {
      channel: 'phone',
      sent: 234,
      delivered: 234,
      opened: 187,
      responded: 156,
      paid: 98,
      cost: 1450,
      revenue: 18900,
      roi: 13.0,
      avgResponseTime: '0.5h',
      byDemographic: [
        { ageGroup: '18-29', responseRate: 12, avgValue: 450 },
        { ageGroup: '30-49', responseRate: 35, avgValue: 1890 },
        { ageGroup: '50-64', responseRate: 72, avgValue: 2340 },
        { ageGroup: '65+', responseRate: 81, avgValue: 1980 }
      ]
    }
  ];

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="size-5" />;
      case 'email': return <Mail className="size-5" />;
      case 'sms': return <Send className="size-5" />;
      case 'phone': return <Phone className="size-5" />;
    }
  };

  const getChannelColor = (channel: Channel) => {
    switch (channel) {
      case 'whatsapp': return 'from-green-500 to-emerald-600';
      case 'email': return 'from-blue-500 to-cyan-600';
      case 'sms': return 'from-purple-500 to-pink-600';
      case 'phone': return 'from-orange-500 to-red-600';
    }
  };

  const getChannelName = (channel: Channel) => {
    switch (channel) {
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'phone': return 'Telefone';
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, active: !r.active } : r
    ));
    toast.success('Regra atualizada!');
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
    toast.success('Regra excluída!');
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
      
      {/* Compact Header */}
      <div className="flex-shrink-0 flex items-center justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-4 text-white shadow-md">
         <div className="flex items-center gap-4">
             <div className="size-10 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20">
                <Target className="size-5" />
             </div>
             <div>
                <h1 className="text-xl font-bold leading-tight">Orquestração Inteligente</h1>
                <p className="text-xs text-white/80">Otimização de canais via IA</p>
             </div>
         </div>
         <div className="flex gap-4 hidden md:flex">
             <div className="text-right border-r border-white/20 pr-4">
               <div className="text-xs text-white/70 font-medium">Resposta</div>
               <div className="text-lg font-bold leading-none">+2.5x</div>
             </div>
             <div className="text-right border-r border-white/20 pr-4">
               <div className="text-xs text-white/70 font-medium">Custos</div>
               <div className="text-lg font-bold leading-none">-40%</div>
             </div>
             <div className="text-right">
               <div className="text-xs text-white/70 font-medium">Regras</div>
               <div className="text-lg font-bold leading-none">{rules.filter(r => r.active).length}</div>
             </div>
         </div>
      </div>

      {/* Compact Tabs */}
      <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-1 flex gap-1 shadow-sm">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="size-4" /> },
          { id: 'rules', label: 'Regras de Orquestração', icon: <Settings className="size-4" /> },
          { id: 'performance', label: 'Performance', icon: <TrendingUp className="size-4" /> },
          { id: 'abtesting', label: 'A/B Tests', icon: <Target className="size-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            
            {/* Left Column: Channels */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {channelPerformance.map(perf => {
                    const responseRate = ((perf.responded / perf.sent) * 100).toFixed(1);
                    return (
                      <motion.div
                        key={perf.channel}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div className="flex justify-between items-start mb-2">
                           <div className={`p-2 rounded-lg bg-gradient-to-br ${getChannelColor(perf.channel)} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                              {getChannelIcon(perf.channel)}
                           </div>
                           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{perf.roi}x ROI</span>
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900">{getChannelName(perf.channel)}</h3>
                           <div className="flex items-baseline justify-between mt-1">
                              <span className="text-2xl font-bold text-indigo-600">{responseRate}%</span>
                              <span className="text-xs text-slate-500">taxa resp.</span>
                           </div>
                           <div className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                              <span>{perf.avgResponseTime}</span>
                              <span>€{(perf.revenue / 1000).toFixed(1)}k</span>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* AI Insights Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-5">
                   <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                     <Zap className="size-4 text-purple-600" />
                     Insights da IA
                   </h3>
                   <div className="space-y-2">
                      <div className="bg-white/60 p-3 rounded-lg border border-purple-100 flex gap-3 items-start">
                         <CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
                         <div className="text-sm">
                            <span className="font-semibold text-slate-900 block">WhatsApp domina 18-49 anos</span>
                            <span className="text-slate-600 text-xs">Taxa de resposta 60% superior ao email. Priorize.</span>
                         </div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-purple-100 flex gap-3 items-start">
                         <CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
                         <div className="text-sm">
                            <span className="font-semibold text-slate-900 block">Telefone ideal para 65+</span>
                            <span className="text-slate-600 text-xs">81% de resposta. Use como canal primário.</span>
                         </div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-purple-100 flex gap-3 items-start">
                         <AlertCircle className="size-4 text-orange-500 mt-0.5 shrink-0" />
                         <div className="text-sm">
                            <span className="font-semibold text-slate-900 block">SMS com ROI baixo</span>
                            <span className="text-slate-600 text-xs">Apenas 17.1x. Considere reduzir volume.</span>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            {/* Right Column: Demographics Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="size-5 text-indigo-600" />
                Matriz de Eficiência Demográfica
              </h3>
              
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b-2 border-slate-100 text-left">
                      <th className="pb-3 pl-2 text-slate-500 font-medium">Faixa Etária</th>
                      <th className="pb-3 text-center text-slate-500 font-medium">Melhor Canal</th>
                      <th className="pb-3 text-right text-slate-500 font-medium pr-2">Taxa Resp.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {['18-29', '30-49', '50-64', '65+'].map((age) => {
                      const ageData = channelPerformance.map(perf => ({
                        channel: perf.channel,
                        data: perf.byDemographic.find(d => d.ageGroup === age)
                      }));
                      const bestChannel = ageData.reduce((best, current) => 
                        (current.data?.responseRate || 0) > (best.data?.responseRate || 0) ? current : best
                      );

                      return (
                        <tr key={age} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-4 pl-2 font-semibold text-slate-700">{age} anos</td>
                          <td className="py-4 text-center">
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                               bestChannel.channel === 'whatsapp' ? 'bg-green-50 text-green-700 border-green-200' :
                               bestChannel.channel === 'email' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                               bestChannel.channel === 'phone' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                               'bg-purple-50 text-purple-700 border-purple-200'
                             }`}>
                                {getChannelIcon(bestChannel.channel)}
                                {getChannelName(bestChannel.channel)}
                             </span>
                          </td>
                          <td className="py-4 pr-2 text-right font-bold text-slate-900 text-lg">
                            {bestChannel.data?.responseRate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                     <span>Baseado em 12.4k interações</span>
                     <button className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                        Relatório Completo <ArrowRight className="size-3" />
                     </button>
                  </div>
              </div>
            </div>

          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
             <div className="flex items-center justify-between sticky top-0 bg-[#F8FAFC] py-2 z-10">
               <div>
                 <h2 className="text-lg font-bold text-slate-900">Regras Ativas</h2>
                 <p className="text-xs text-slate-500">Prioridade de execução automática</p>
               </div>
               <button
                 onClick={() => {
                   setEditingRule(null);
                   setShowRuleModal(true);
                 }}
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
               >
                 <Plus className="size-4" />
                 Nova Regra
               </button>
             </div>

             <div className="grid grid-cols-1 gap-3">
               {rules
                 .sort((a, b) => a.priority - b.priority)
                 .map((rule, index) => (
                   <motion.div
                     key={rule.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                     className={`bg-white rounded-xl border p-4 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center ${
                       rule.active 
                         ? 'border-indigo-100 shadow-sm hover:shadow-md' 
                         : 'border-slate-200 opacity-70 bg-slate-50'
                     }`}
                   >
                     <div className="flex items-center gap-3 min-w-[60px]">
                        <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100">
                          #{rule.priority}
                        </div>
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`p-1.5 rounded-full transition-colors ${rule.active ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-200'}`}
                        >
                           {rule.active ? <PlayCircle className="size-5" /> : <PauseCircle className="size-5" />}
                        </button>
                     </div>

                     <div className="flex-1 space-y-2">
                        <div className="flex items-center flex-wrap gap-2">
                           <h3 className="font-bold text-slate-900 text-sm">{rule.name}</h3>
                           {rule.abTesting?.enabled && (
                             <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                               A/B Test ({rule.abTesting.variant})
                             </span>
                           )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                           {rule.conditions.ageGroups && (
                             <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">
                               Idade: {rule.conditions.ageGroups.join(', ')}
                             </span>
                           )}
                           {rule.conditions.urgency && (
                             <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">
                               Urgência: {rule.conditions.urgency.join(', ')}
                             </span>
                           )}
                           <span className="text-slate-300">|</span>
                           <div className="flex items-center gap-1">
                              <span className={`size-2 rounded-full bg-gradient-to-r ${getChannelColor(rule.channels.primary)}`}></span>
                              <span className="font-medium">{getChannelName(rule.channels.primary)}</span>
                           </div>
                           {rule.channels.fallback && (
                              <>
                                <span className="text-slate-400">→</span>
                                <span className="text-slate-500">{getChannelName(rule.channels.fallback)}</span>
                              </>
                           )}
                        </div>
                     </div>

                     <div className="flex items-center gap-1 ml-auto">
                        <button onClick={() => { setEditingRule(rule); setShowRuleModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                           <Edit2 className="size-4" />
                        </button>
                        <button onClick={() => deleteRule(rule.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                           <Trash2 className="size-4" />
                        </button>
                     </div>
                   </motion.div>
                 ))}
             </div>
          </div>
        )}

        {/* Other tabs simplified for full screen optimization */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {channelPerformance.map((perf, i) => (
                <motion.div key={perf.channel} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.1}} className="bg-white rounded-xl border border-slate-200 p-4">
                   <div className="flex items-center gap-3 mb-4">
                      <div className={`size-10 rounded-lg bg-gradient-to-br ${getChannelColor(perf.channel)} flex items-center justify-center text-white`}>
                         {getChannelIcon(perf.channel)}
                      </div>
                      <div className="font-bold text-slate-900">{getChannelName(perf.channel)}</div>
                   </div>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Enviados</span>
                        <span className="font-medium">{perf.sent}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Taxa Resp.</span>
                        <span className="font-bold text-indigo-600">{((perf.responded/perf.sent)*100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">ROI</span>
                        <span className="font-bold text-green-600">{perf.roi}x</span>
                      </div>
                      <div className="pt-2">
                        <div className="text-xs text-slate-400 mb-1">Receita Gerada</div>
                        <div className="text-xl font-bold text-slate-900">€{(perf.revenue/1000).toFixed(1)}k</div>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        )}
        
        {activeTab === 'abtesting' && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
               <Target className="size-12 text-slate-300 mb-4" />
               <h3 className="text-lg font-bold text-slate-700">Módulo A/B Testing</h3>
               <p className="text-slate-500 max-w-sm">Esta visualização está sendo otimizada para o novo layout fullscreen.</p>
            </div>
        )}
      </div>
    </div>
  );
}