import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getDashboardMetrics } from '../../utils/supabase';
import { projectId } from '../../utils/supabase';
import { 
  Calendar, 
  Filter, 
  Zap, 
  Euro, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  MoreHorizontal,
  Clock,
  ArrowRight,
  Database,
  Plus,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

// ShadCN UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import TTSStatusWidget from './TTSStatusWidget';

export default function Dashboard({ session }: { session: any }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se temos access_token antes de carregar
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    // Simular delay para mostrar o Skeleton Loader e a transição suave
    const timer = setTimeout(() => {
      loadMetrics();
    }, 800);
    return () => clearTimeout(timer);
  }, [session?.access_token]); // Adicionar dependência

  async function loadMetrics() {
    try {
      if (!session?.access_token) {
        console.error('[DASHBOARD] Sem access_token disponível');
        return;
      }
      
      console.log('[DASHBOARD] Carregando métricas...');
      console.log('[DASHBOARD] Token:', session.access_token.substring(0, 20) + '...');
      
      const data = await getDashboardMetrics(session.access_token);
      console.log('[DASHBOARD] Dados recebidos:', data);
      setMetrics(data);
    } catch (error) {
      console.error('[DASHBOARD] Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  }

  // Animation variants
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  // Metrics Data Transformation
  const stats = metrics ? [
    { 
      label: 'Valor em Atraso', 
      value: `€ ${(metrics.totalDebt || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 
      change: '+12%',
      trend: 'up', 
      icon: Euro,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      desc: 'vs. mês anterior'
    },
    { 
      label: 'Recuperado (Este Mês)', 
      value: `€ ${(metrics.recoveredMonth || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 
      change: '+23%',
      trend: 'up', 
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      desc: 'vs. mês anterior'
    },
    { 
      label: 'Devedores Ativos', 
      value: (metrics.activeDebtors || 0).toString(), 
      change: '-5%',
      trend: 'down', 
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      desc: 'Base ativa total'
    },
    { 
      label: 'Taxa de Sucesso', 
      value: `${metrics.successRate || 0}%`, 
      change: '+8%', 
      trend: 'up', 
      icon: Sparkles,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      desc: 'Acordos efetivados'
    },
  ] : [];

  const recoveryTrend = metrics?.recoveryTrend || [];
  const scoreDistribution = metrics?.scoreDistribution || [];
  const recoveryByChannel = metrics?.recoveryByChannel || [];
  const delayedPayments = metrics?.delayedPayments || [];
  const criticalClients = delayedPayments.find((d: any) => d.days === '90+')?.count || 0;

  // 🎨 DEBUG: Log metrics to console
  console.log('[DASHBOARD] Metrics received:', metrics);
  console.log('[DASHBOARD] Recovery Trend:', recoveryTrend);
  console.log('[DASHBOARD] Score Distribution:', scoreDistribution);
  console.log('[DASHBOARD] Recovery By Channel:', recoveryByChannel);

  // 🎨 FALLBACK: Se não houver dados mockados do backend, usar fallback local
  const finalRecoveryTrend = recoveryTrend.length > 0 ? recoveryTrend : [
    { month: 'Jan', ai: 12500, spontaneous: 8200 },
    { month: 'Fev', ai: 15800, spontaneous: 9100 },
    { month: 'Mar', ai: 18200, spontaneous: 10500 },
    { month: 'Abr', ai: 22100, spontaneous: 11800 },
    { month: 'Mai', ai: 26400, spontaneous: 13200 },
    { month: 'Jun', ai: 31200, spontaneous: 14500 },
  ];

  const finalScoreDistribution = scoreDistribution.length > 0 ? scoreDistribution : [
    { score: 'Alto (80-100)', count: 47, value: 124500, color: '#10b981' },
    { score: 'Médio (50-79)', count: 83, value: 187200, color: '#f59e0b' },
    { score: 'Baixo (0-49)', count: 29, value: 89800, color: '#ef4444' },
  ];

  const finalRecoveryByChannel = recoveryByChannel.length > 0 ? recoveryByChannel : [
    { channel: 'WhatsApp', value: 42500, roi: 3.2, fill: '#10b981' },
    { channel: 'SMS', value: 28300, roi: 1.8, fill: '#3b82f6' },
    { channel: 'Email', value: 19800, roi: 2.1, fill: '#8b5cf6' },
    { channel: 'Ligação', value: 15200, roi: 1.4, fill: '#f59e0b' },
  ];

  console.log('[DASHBOARD] Using final data:');
  console.log('- Recovery Trend length:', finalRecoveryTrend.length);
  console.log('- Score Distribution length:', finalScoreDistribution.length);
  console.log('- Recovery By Channel length:', finalRecoveryByChannel.length);

  // Custom Chart Components
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}: €{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* 1. Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Painel Principal
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-light">
            Resumo em tempo real do desempenho de recuperação.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-4">
            <Calendar className="mr-2 size-4" />
            Este Mês
          </Button>
          <Button variant="outline" className="h-10 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-10 p-0">
            <Filter className="size-4" />
          </Button>
          <Button className="h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 px-6 transition-all hover:scale-105">
            <Zap className="mr-2 size-4" />
            Nova Cobrança
          </Button>
        </div>
      </motion.div>

      {/* 2. KPI Cards - Clean & Minimal */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="group bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-16 opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110 duration-500 ${stat.color.replace('text-', 'bg-')}`} />
            
            <div className="flex items-center justify-between mb-4 relative">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon className="size-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="size-3" /> : <TrendingDown className="size-3" />}
              </div>
            </div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="pb-0 pt-8 px-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Evolução da Recuperação</CardTitle>
                  <CardDescription className="text-slate-500 mt-1">Comparativo: IA Automática vs. Pagamentos Espontâneos</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                  <MoreHorizontal className="size-5 text-slate-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={finalRecoveryTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSpontaneous" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickFormatter={(value) => `€${value/1000}k`} 
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ top: -40, right: 0 }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ai" 
                      name="IA Automática"
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAi)" 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="spontaneous" 
                      name="Espontâneo"
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSpontaneous)" 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Donut Chart - Risk Distribution */}
        <motion.div variants={item} className="flex flex-col gap-6">
           <Card className="flex-1 border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] bg-white rounded-[32px]">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-lg font-bold text-slate-900">Risco da Carteira</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex flex-col items-center justify-center">
               <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={finalScoreDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        cornerRadius={4}
                      >
                        {finalScoreDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-slate-900">
                      {finalScoreDistribution.reduce((acc: number, curr: any) => acc + curr.count, 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Clientes</span>
                  </div>
               </div>

               {/* Custom Legend */}
               <div className="w-full space-y-3 mt-4">
                 {finalScoreDistribution.map((item: any, idx: number) => (
                   <div key={idx} className="flex items-center justify-between text-sm group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{item.score}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs">{item.count} clientes</span>
                        <span className="font-bold text-slate-700">€{(item.value/1000).toFixed(1)}k</span>
                      </div>
                   </div>
                 ))}
               </div>
            </CardContent>
           </Card>

           {/* Critical Alert Mini-Card */}
           {criticalClients > 0 && (
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-amber-50 rounded-[24px] p-5 border border-amber-100 flex items-center justify-between"
             >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-900 text-sm">Atenção Necessária</p>
                    <p className="text-xs text-amber-700/80">{criticalClients} clientes com atraso {'>'} 90 dias</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg h-8 px-3 text-xs font-bold">
                  Ver <ArrowRight className="ml-1 size-3" />
                </Button>
             </motion.div>
           )}
        </motion.div>
      </div>

      {/* 4. Bottom Row: Channels & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Channels Chart */}
         <motion.div variants={item}>
           <Card className="h-full border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] bg-white rounded-[32px] overflow-hidden">
             <CardHeader className="px-8 pt-8 pb-2">
               <CardTitle className="text-lg font-bold text-slate-900">Canais de Maior Retorno</CardTitle>
               <CardDescription>Análise de ROI por meio de comunicação</CardDescription>
             </CardHeader>
             <CardContent className="p-8">
               <div className="h-[220px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={finalRecoveryByChannel} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} hide />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc', radius: 4 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 text-white text-xs py-1 px-3 rounded-lg shadow-xl">
                                €{Number(payload[0].value).toLocaleString()}
                              </div>
                            )
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                        {finalRecoveryByChannel.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
               
               {/* Channel Metrics Footer */}
               <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-50">
                  {finalRecoveryByChannel.slice(0,3).map((c: any, i: number) => (
                    <div key={i} className="text-center">
                       <p className="text-xs text-slate-400 mb-1">{c.channel}</p>
                       <p className="text-sm font-bold text-slate-700">{c.roi}x <span className="text-[10px] text-slate-400 font-normal">ROI</span></p>
                    </div>
                  ))}
               </div>
             </CardContent>
           </Card>
         </motion.div>

         {/* AI Insight Highlight */}
         <motion.div variants={item}>
            <div className="h-full relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white p-8 shadow-2xl shadow-indigo-500/20">
               {/* Decorative Background Elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
               
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/10">
                        <Sparkles className="size-5 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-white/90">Insights da IA</h3>
                        <p className="text-white/50 text-xs font-light">Análise em tempo real</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xl font-normal leading-relaxed text-white/95">
                        O <span className="font-semibold text-white">WhatsApp</span> está performando <span className="font-semibold text-emerald-300">3x melhor</span> que SMS nesta semana.
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed max-w-md font-light">
                        Sugerimos migrar 25% do orçamento de SMS para campanhas automáticas de WhatsApp para maximizar o ROI.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                     <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4">
                        <span className="text-white/70 text-sm font-light">Impacto estimado:</span>
                        <span className="text-xl font-semibold text-emerald-300">+€12.500</span>
                     </div>
                     <Button className="w-full h-11 bg-white text-indigo-700 hover:bg-indigo-50 font-medium rounded-xl border-none shadow-lg">
                        Aplicar Recomendação
                     </Button>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>

      {/* 5. TTS System Status Widget - For Demo Preparation */}
      <motion.div variants={item}>
        <TTSStatusWidget onOpenDiagnostic={() => {
          // This will be handled by parent component to switch views
          console.log('[DASHBOARD] Opening ElevenLabs diagnostic...');
          window.dispatchEvent(new CustomEvent('openElevenLabsDiagnostic'));
        }} />
      </motion.div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 rounded-[24px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-[400px] lg:col-span-2 rounded-[32px]" />
        <div className="flex flex-col gap-6">
           <Skeleton className="flex-1 rounded-[32px]" />
           <Skeleton className="h-24 rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}

function DashboardEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[600px] p-12"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 p-6 rounded-full">
              <Database className="size-16 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Comece a Usar o Tá Pago
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Seu dashboard está pronto! Adicione seus primeiros devedores para começar a visualizar métricas e insights em tempo real.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <a
            href="#devedores"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <Plus className="size-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Adicionar Devedor</h3>
                <p className="text-sm text-slate-600">Cadastre manualmente um novo devedor</p>
              </div>
            </div>
          </a>

          <a
            href="#devedores"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors">
                <FileText className="size-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Importar CSV</h3>
                <p className="text-sm text-slate-600">Importe múltiplos devedores de uma só vez</p>
              </div>
            </div>
          </a>
        </div>

        {/* Features List */}
        <div className="pt-8 border-t border-slate-100 mt-12">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">O que você verá aqui</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Valor Total em Atraso',
              'Recuperação Mensal',
              'Análise de Risco',
              'ROI por Canal',
              'Insights de IA',
              'Timeline de Pagamentos'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                <div className="size-1.5 rounded-full bg-indigo-500" />
                <span className="text-xs text-slate-600 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}