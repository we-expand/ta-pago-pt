import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Euro, 
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  ZoomIn,
  X,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import GlassCard, { GlassStatsCard, GlassChartCard, GlassHeaderCard } from './ui/GlassCard';
import { DashboardSkeleton, StatsCardSkeleton, ChartSkeleton } from './ui/SkeletonLoaders';

// Dados simulados
const generateDailyData = () => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  return days.map((day, index) => ({
    day,
    recuperado: Math.floor(Math.random() * 15000) + 8000,
    cobrado: Math.floor(Math.random() * 25000) + 15000,
    emails: Math.floor(Math.random() * 100) + 50,
    sms: Math.floor(Math.random() * 80) + 30,
    whatsapp: Math.floor(Math.random() * 120) + 80,
    telefone: Math.floor(Math.random() * 40) + 10,
    date: `2024-12-${14 + index}`
  }));
};

const generateMonthlyData = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months.map(month => ({
    month,
    recuperado: Math.floor(Math.random() * 150000) + 80000,
    cobrado: Math.floor(Math.random() * 250000) + 150000,
    devedores: Math.floor(Math.random() * 100) + 250
  }));
};

const channelData = [
  { channel: 'WhatsApp', value: 45200, cost: 420, roi: 107.6, count: 1243, avgTime: '2.3 dias' },
  { channel: 'Email', value: 28900, cost: 180, roi: 160.5, count: 2156, avgTime: '4.1 dias' },
  { channel: 'SMS', value: 15220, cost: 890, roi: 17.1, count: 892, avgTime: '1.8 dias' },
  { channel: 'Telefone', value: 8450, cost: 1250, roi: 6.8, count: 234, avgTime: '0.5 dias' },
];

const timeRanges = [
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '90d', label: '90 dias' },
  { id: '12m', label: '12 meses' },
];

export default function EnhancedDashboard({ session }: { session: any }) {
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('7d');
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [drilldownData, setDrilldownData] = useState<any>(null);

  // Simular loading inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setDailyData(generateDailyData());
      setMonthlyData(generateMonthlyData());
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { 
      label: 'Em Atraso', 
      value: '€247.850', 
      change: '+12%', 
      trend: 'up', 
      icon: Euro,
      color: 'red',
      details: {
        title: 'Valores em Atraso - Detalhamento',
        breakdown: [
          { label: '0-30 dias', value: '€89.450', percent: 36 },
          { label: '31-60 dias', value: '€72.380', percent: 29 },
          { label: '61-90 dias', value: '€51.220', percent: 21 },
          { label: '+90 dias', value: '€34.800', percent: 14 }
        ]
      }
    },
    { 
      label: 'Recuperado (Mês)', 
      value: '€89.320', 
      change: '+23%', 
      trend: 'up', 
      icon: TrendingUp,
      color: 'green',
      details: {
        title: 'Recuperação Mensal - Por Canal',
        breakdown: [
          { label: 'WhatsApp', value: '€45.200', percent: 51 },
          { label: 'Email', value: '€28.900', percent: 32 },
          { label: 'SMS', value: '€15.220', percent: 17 }
        ]
      }
    },
    { 
      label: 'Devedores Ativos', 
      value: '342', 
      change: '-5%', 
      trend: 'down', 
      icon: Users,
      color: 'blue',
      details: {
        title: 'Devedores Ativos - Por Status',
        breakdown: [
          { label: 'Em negociação', value: '127', percent: 37 },
          { label: 'Primeiro contato', value: '98', percent: 29 },
          { label: 'Follow-up', value: '76', percent: 22 },
          { label: 'Escalado', value: '41', percent: 12 }
        ]
      }
    },
    { 
      label: 'Taxa de Sucesso', 
      value: '68%', 
      change: '+8%', 
      trend: 'up', 
      icon: TrendingUp,
      color: 'purple',
      details: {
        title: 'Taxa de Sucesso - Por Perfil',
        breakdown: [
          { label: 'PME', value: '74%', percent: 74 },
          { label: 'Corporativo', value: '82%', percent: 82 },
          { label: 'Pessoa Física', value: '56%', percent: 56 },
          { label: 'Governo', value: '43%', percent: 43 }
        ]
      }
    },
  ];

  const handleBarClick = (data: any) => {
    setDrilldownData({
      title: `Detalhes de ${data.day || data.month}`,
      metric: data.recuperado,
      data: data,
      breakdown: [
        { label: 'WhatsApp', value: data.whatsapp || Math.floor(data.recuperado * 0.4), color: '#25D366' },
        { label: 'Email', value: data.emails || Math.floor(data.recuperado * 0.3), color: '#4285F4' },
        { label: 'SMS', value: data.sms || Math.floor(data.recuperado * 0.2), color: '#FF6B6B' },
        { label: 'Telefone', value: data.telefone || Math.floor(data.recuperado * 0.1), color: '#9B59B6' }
      ]
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard variant="strong" blur="xl" hover={false} className="p-4">
          <p className="font-bold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm text-slate-600 flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </span>
              <span className="font-bold text-slate-900">
                {entry.name.includes('%') ? `${entry.value}%` : `€${entry.value.toLocaleString()}`}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Variação: <span className="text-green-600 font-bold">+12.5%</span> vs semana anterior
            </div>
          </div>
        </GlassCard>
      );
    }
    return null;
  };

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-8 space-y-6 max-w-[1800px] mx-auto bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 min-h-screen">
      {/* Header Glassmorphic */}
      <GlassHeaderCard color="purple">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-white/30 backdrop-blur-xl flex items-center justify-center border-2 border-white/40">
              <Sparkles className="size-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard Premium</h1>
              <p className="text-slate-700">Com Glassmorphism e Micro-interações</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector com Glass Effect */}
            <GlassCard variant="strong" hover={false} className="p-1">
              <div className="flex gap-1">
                {timeRanges.map(range => (
                  <motion.button
                    key={range.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRange(range.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedRange === range.id
                        ? 'bg-white/90 text-purple-600 shadow-lg'
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            <InteractiveButton
              variant="ghost"
              size="md"
              icon={<Filter className="size-5" />}
            />

            <InteractiveButton
              variant="primary"
              size="md"
              icon={<Download className="size-5" />}
              iconPosition="left"
              onClick={() => toast.success('Relatório exportado com sucesso!')}
            >
              Exportar
            </InteractiveButton>
          </div>
        </div>
      </GlassHeaderCard>

      {/* Stats Cards com Glassmorphism */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
          
          return (
            <GlassStatsCard
              key={index}
              onClick={() => setSelectedMetric(stat)}
              className="cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <motion.div 
                  className={`size-12 rounded-xl bg-gradient-to-br ${
                    stat.color === 'red' ? 'from-red-500 to-rose-600' :
                    stat.color === 'green' ? 'from-green-500 to-emerald-600' :
                    stat.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                    'from-purple-500 to-pink-600'
                  } flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="size-6 text-white" />
                </motion.div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
                  isPositive ? 'bg-green-500/20 text-green-700 border border-green-300/30' : 'bg-red-500/20 text-red-700 border border-red-300/30'
                }`}>
                  <TrendIcon className="size-3" />
                  {stat.change}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/50 text-xs text-slate-500 group-hover:text-purple-600 transition-colors flex items-center gap-1">
                <ZoomIn className="size-3" />
                Clique para detalhes
              </div>
            </GlassStatsCard>
          );
        })}
      </div>

      {/* Main Charts com Glass Effect */}
      <div className="grid grid-cols-2 gap-6">
        {/* Área Chart */}
        <GlassChartCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recuperação ao Longo do Tempo</h3>
              <p className="text-sm text-slate-600">Clique em qualquer ponto para drill-down</p>
            </div>
            <Activity className="size-5 text-purple-600" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData} onClick={(e) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}>
              <defs>
                <linearGradient id="colorRecuperado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCobrado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600' }} iconType="circle" />
              <Area 
                type="monotone" 
                dataKey="recuperado" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorRecuperado)"
                strokeWidth={3}
                name="Recuperado"
                style={{ cursor: 'pointer' }}
              />
              <Area 
                type="monotone" 
                dataKey="cobrado" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorCobrado)"
                strokeWidth={3}
                name="Cobrado"
                style={{ cursor: 'pointer' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassChartCard>

        {/* Bar Chart */}
        <GlassChartCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recuperação por Canal</h3>
              <p className="text-sm text-slate-600">ROI e eficiência de cada canal</p>
            </div>
            <BarChart3 className="size-5 text-purple-600" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="channel" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600' }} iconType="circle" />
              <Bar 
                dataKey="value" 
                fill="#8B5CF6" 
                radius={[8, 8, 0, 0]}
                name="Recuperado (€)"
                style={{ cursor: 'pointer' }}
                onClick={(data) => {
                  setDrilldownData({
                    title: `Detalhes de ${data.channel}`,
                    metric: data.value,
                    data: data,
                    breakdown: [
                      { label: 'Valor Recuperado', value: `€${data.value.toLocaleString()}`, color: '#10B981' },
                      { label: 'Custo Operacional', value: `€${data.cost.toLocaleString()}`, color: '#EF4444' },
                      { label: 'ROI', value: `${data.roi}x`, color: '#8B5CF6' },
                      { label: 'Mensagens Enviadas', value: data.count.toLocaleString(), color: '#3B82F6' },
                      { label: 'Tempo Médio', value: data.avgTime, color: '#F59E0B' }
                    ]
                  });
                }}
              />
              <Bar 
                dataKey="cost" 
                fill="#EF4444" 
                radius={[8, 8, 0, 0]}
                name="Custo (€)"
                style={{ cursor: 'pointer' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassChartCard>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Line Chart */}
        <GlassChartCard className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tendência Mensal</h3>
              <p className="text-sm text-slate-600">Evolução ano completo</p>
            </div>
            <TrendingUp className="size-5 text-green-600" />
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600' }} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="recuperado" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#10B981' }}
                activeDot={{ r: 7 }}
                name="Recuperado"
                style={{ cursor: 'pointer' }}
              />
              <Line 
                type="monotone" 
                dataKey="cobrado" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#3B82F6' }}
                activeDot={{ r: 7 }}
                name="Cobrado"
                style={{ cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassChartCard>

        {/* Pie Chart */}
        <GlassChartCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Distribuição</h3>
              <p className="text-sm text-slate-600">Por canal</p>
            </div>
            <PieChartIcon className="size-5 text-purple-600" />
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                style={{ cursor: 'pointer' }}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </GlassChartCard>
      </div>

      {/* Modal de Drill-down com Glass Effect */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedMetric(null)}
          >
            <GlassCard
              variant="strong"
              blur="xl"
              hover={false}
              className="p-8 max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedMetric.details.title}</h2>
                  <p className="text-3xl font-bold text-purple-600">{selectedMetric.value}</p>
                </div>
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  icon={<X className="size-5" />}
                  onClick={() => setSelectedMetric(null)}
                  ripple={false}
                />
              </div>

              <div className="space-y-3">
                {selectedMetric.details.breakdown.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/70 transition-all border border-white/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="text-lg font-bold text-slate-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/30">
                <InteractiveButton
                  variant="primary"
                  size="lg"
                  onClick={() => toast.success('Relatório detalhado exportado!')}
                  className="w-full"
                >
                  Exportar Detalhes
                </InteractiveButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Drill-down de Gráfico */}
      <AnimatePresence>
        {drilldownData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setDrilldownData(null)}
          >
            <GlassCard
              variant="strong"
              blur="xl"
              hover={false}
              className="p-8 max-w-3xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{drilldownData.title}</h2>
                  <p className="text-slate-600">Análise detalhada dos dados selecionados</p>
                </div>
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  icon={<X className="size-5" />}
                  onClick={() => setDrilldownData(null)}
                  ripple={false}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {drilldownData.breakdown.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="size-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={drilldownData.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="label" stroke="#64748B" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {drilldownData.breakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 flex gap-3">
                <InteractiveButton
                  variant="primary"
                  size="lg"
                  onClick={() => toast.success('Relatório detalhado exportado!')}
                  className="flex-1"
                >
                  Exportar Análise
                </InteractiveButton>
                <InteractiveButton
                  variant="ghost"
                  size="lg"
                  onClick={() => setDrilldownData(null)}
                >
                  Fechar
                </InteractiveButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
