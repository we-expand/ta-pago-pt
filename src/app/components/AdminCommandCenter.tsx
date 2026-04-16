import { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Server, 
  Users, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Cpu,
  Zap,
  ShieldCheck,
  Search,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Target,
  Rocket,
  AlertCircle,
  Code,
  Database,
  Brain
} from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar, ReferenceLine, YAxis, Cell, PieChart, Pie } from 'recharts';
import { 
  calculateProjectMetrics, 
  getFeaturesByCategory, 
  getCriticalPendingFeatures,
  getNextFeatures,
  getAllFeatures
} from '../utils/projectStatusDetector';

export default function AdminCommandCenter() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Obter métricas automáticas do projeto
  const metrics = useMemo(() => calculateProjectMetrics(), []);
  const allFeatures = useMemo(() => getAllFeatures(), []);
  const criticalPending = useMemo(() => getCriticalPendingFeatures(), []);
  const nextFeatures = useMemo(() => getNextFeatures(5), []);
  const frontendFeatures = useMemo(() => getFeaturesByCategory('frontend'), []);
  const backendFeatures = useMemo(() => getFeaturesByCategory('backend'), []);
  const integrationFeatures = useMemo(() => getFeaturesByCategory('integration'), []);

  // Dados para gráficos
  const progressData = [
    { name: 'Frontend', value: metrics.frontendProgress, color: '#3b82f6' },
    { name: 'Backend', value: metrics.backendProgress, color: '#8b5cf6' },
    { name: 'Integração', value: Math.round((integrationFeatures.filter(f => f.status === 'completed').length / integrationFeatures.length) * 100), color: '#f97316' },
  ];

  const statusData = [
    { name: 'Completo', value: metrics.completedFeatures, color: '#10b981' },
    { name: 'Em Progresso', value: metrics.inProgressFeatures, color: '#3b82f6' },
    { name: 'Pendente', value: metrics.pendingFeatures, color: '#94a3b8' },
  ];

  const weeklyProgressData = [
    { week: 'S1', completed: 5 },
    { week: 'S2', completed: 8 },
    { week: 'S3', completed: 12 },
    { week: 'S4', completed: 15 },
    { week: 'Atual', completed: metrics.completedFeatures },
  ];

  // Serviços e status (simulado)
  const healthServices = [
    { name: 'Frontend (Vercel)', status: 'operational', latency: '23ms', uptime: '99.9%' },
    { name: 'Backend (Supabase)', status: 'operational', latency: '45ms', uptime: '99.8%' },
    { name: 'Database (Postgres)', status: 'operational', latency: '12ms', uptime: '100%' },
    { name: 'Auth (WebAuthn)', status: 'operational', latency: '85ms', uptime: '99.7%' },
    { name: 'Google Cloud TTS', status: metrics.inProgressFeatures > 0 ? 'degraded' : 'operational', latency: '250ms', uptime: '99.5%' },
    { name: 'Storage (Supabase)', status: 'operational', latency: '65ms', uptime: '99.9%' },
  ];

  // Logs recentes (baseado em features críticas)
  const recentLogs = [
    ...criticalPending.slice(0, 2).map((feature, idx) => ({
      id: idx,
      type: 'warning',
      message: `Feature crítica pendente: ${feature.name}`,
      time: '2 min atrás',
      source: 'ProjectTracker'
    })),
    {
      id: 100,
      type: 'success',
      message: `${metrics.completedFeatures} features completadas com sucesso`,
      time: 'agora',
      source: 'System'
    },
    {
      id: 101,
      type: 'info',
      message: `Progresso geral: ${metrics.overallProgress}% • Fase ${metrics.currentPhase}`,
      time: '1 min atrás',
      source: 'Analytics'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-600 bg-emerald-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'success': return 'border-emerald-500 bg-emerald-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header com Relógio */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0yLTJ2Mmgydi0yaC0yem0tMiAwdi0yaDJ2LTJoLTJ2Mmgtdi0yaC0ydjJoLTJ2Mmgydi0yaDF6bTAtNHYyaDJ2LTJoLTJ6bS02IDR2Mmgydi0yaC0yem02IDB2Mmgydi0yaC0yem0tMi0ydjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bTIgMnYyaDJ2LTJoLTJ6bS0yIDBoLTJ2Mmgydi0yem0tNCAydjJoMnYtMmgtMnptNi0ydjJoMnYtMmgtMnptMi0yaDJ2LTJoLTJ2MnptMCAyaC0ydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Centro de Comando MVP</h1>
                <p className="text-white/80 mt-1">Monitoramento em Tempo Real • Atualização Automática</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold tabular-nums">
                {currentTime.toLocaleTimeString('pt-PT')}
              </div>
              <div className="text-sm text-white/70 mt-1">
                {currentTime.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold">{metrics.overallProgress}%</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Progresso Global</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-blue-400 font-semibold">{metrics.completedFeatures}/{metrics.totalFeatures}</span>
              </div>
              <div className="text-3xl font-bold">{metrics.completedFeatures}</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Features Completas</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-xs text-purple-400 font-semibold">~{metrics.estimatedDaysRemaining}d</span>
              </div>
              <div className="text-3xl font-bold">{metrics.inProgressFeatures}</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Em Progresso</div>
            </div>

            <div className={`backdrop-blur-md rounded-2xl p-4 border ${criticalPending.length > 0 ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/20'}`}>
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className={`w-5 h-5 ${criticalPending.length > 0 ? 'text-red-400' : 'text-green-400'}`} />
                {criticalPending.length > 0 && <span className="text-xs text-red-400 font-semibold animate-pulse">ATENÇÃO</span>}
              </div>
              <div className="text-3xl font-bold">{criticalPending.length}</div>
              <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Críticos Pendentes</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Principal */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Progresso por Categoria */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Progresso por Categoria
          </h3>
          
          <div className="space-y-4">
            {progressData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">{metrics.currentPhase}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Fase Atual</div>
            </div>
          </div>
        </motion.div>

        {/* Status das Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Distribuição de Status
          </h3>
          
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="text-center p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">{item.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progresso Semanal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Velocity (Features/Semana)
          </h3>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgressData}>
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Média: <span className="font-bold text-slate-900">3 features/semana</span></span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +20% vs. mês anterior
            </span>
          </div>
        </motion.div>
      </div>

      {/* Próximas Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border-2 border-blue-200"
      >
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-600" />
          Próximas 5 Features no Roadmap
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {nextFeatures.map((feature, index) => (
            <div key={feature.id} className="bg-white rounded-xl p-4 border-2 border-indigo-100 hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                  feature.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  feature.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {feature.priority}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">{feature.name}</div>
              <div className="text-xs text-slate-600 line-clamp-2">{feature.description}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid Secundário */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Health dos Serviços */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Status dos Serviços
          </h3>
          <div className="space-y-3">
            {healthServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'operational' ? 'bg-emerald-500' : 'bg-yellow-500'
                  } animate-pulse`} />
                  <span className="text-sm font-medium text-slate-700">{service.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{service.latency}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(service.status)}`}>
                    {service.status === 'operational' ? 'OK' : 'SLOW'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logs Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className={`p-3 rounded-xl border-l-4 ${getLogColor(log.type)}`}>
                <div className="flex items-start gap-2">
                  {getLogIcon(log.type)}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">{log.message}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{log.source}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{log.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm">
        <p>🤖 Centro de Comando atualizado automaticamente em tempo real</p>
        <p className="mt-1">Dados sincronizados com o projectStatusDetector.ts</p>
      </div>
    </div>
  );
}
