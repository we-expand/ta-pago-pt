import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useDevLabStore } from '../../hooks/useDevLabStore';
import { Suggestion, Category, Impact, Effort } from '../../types/devlab';
import { 
  Terminal, 
  Code2, 
  Paintbrush, 
  Zap, 
  Bug, 
  Lightbulb, 
  CheckCircle2, 
  Trash2, 
  RotateCcw, 
  X,
  Search,
  Plus,
  Layout,
  Clock,
  Archive,
  TrendingUp,
  Sparkles,
  Target,
  Activity,
  BarChart3,
  AlertCircle,
  Rocket
} from 'lucide-react';
import { 
  calculateProjectMetrics, 
  getAllFeatures 
} from '../utils/projectStatusDetector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

type ViewMode = 'overview' | 'active' | 'completed' | 'trash';

const CategoryIcon = ({ category }: { category: Category }) => {
  switch (category) {
    case 'TECH': return <Code2 className="w-5 h-5 text-blue-500" />;
    case 'DESIGN_UX': return <Paintbrush className="w-5 h-5 text-purple-500" />;
    case 'FEATURE': return <Zap className="w-5 h-5 text-yellow-500" />;
    case 'COMPETITION': return <TrendingUp className="w-5 h-5 text-orange-500" />;
    case 'INNOVATION': return <Sparkles className="w-5 h-5 text-pink-500" />;
    case 'BUG': return <Bug className="w-5 h-5 text-red-500" />;
    case 'OPTIMIZATION': return <Lightbulb className="w-5 h-5 text-green-500" />;
    default: return <Terminal className="w-5 h-5 text-slate-400" />;
  }
};

const ImpactBadge = ({ impact }: { impact: Impact }) => {
  const colors = {
    HIGH: 'bg-red-100 text-red-700 border-red-300',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    LOW: 'bg-blue-100 text-blue-700 border-blue-300',
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full border-2 font-bold uppercase tracking-wider ${colors[impact]}`}>
      {impact}
    </span>
  );
};

const EffortBadge = ({ effort }: { effort: Effort }) => {
  const config = {
    HIGH: { color: 'bg-orange-500', label: 'Alto Esforço', border: 'border-orange-300' },
    MEDIUM: { color: 'bg-yellow-500', label: 'Médio Esforço', border: 'border-yellow-300' },
    LOW: { color: 'bg-green-500', label: 'Baixo Esforço', border: 'border-green-300' },
  };
  const cfg = config[effort];
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${cfg.border} bg-white`}>
      <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
      <span className="text-xs font-semibold text-slate-700">{cfg.label}</span>
    </div>
  );
};

export default function DevLab({ onClose }: { onClose?: () => void }) {
  const { suggestions, addSuggestion, markAsCompleted, markAsTrash, restoreFromTrash, permanentDelete } = useDevLabStore();
  const [view, setView] = useState<ViewMode>('active');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<Suggestion | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Métricas do projeto
  const metrics = useMemo(() => calculateProjectMetrics(), []);
  const allFeatures = useMemo(() => getAllFeatures(), []);

  // Filter logic
  const filteredSuggestions = suggestions.filter(s => {
    if (view === 'overview') return s.status !== 'trash';
    return s.status === view;
  }).filter(s => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  const stats = {
    active: suggestions.filter(s => s.status === 'active').length,
    completed: suggestions.filter(s => s.status === 'completed').length,
    trash: suggestions.filter(s => s.status === 'trash').length,
  };

  // Dados para gráficos
  const categoryData = [
    { name: 'Tech', value: suggestions.filter(s => s.category === 'TECH' && s.status === 'active').length, color: '#3b82f6' },
    { name: 'Design', value: suggestions.filter(s => s.category === 'DESIGN_UX' && s.status === 'active').length, color: '#a855f7' },
    { name: 'Features', value: suggestions.filter(s => s.category === 'FEATURE' && s.status === 'active').length, color: '#eab308' },
    { name: 'Bugs', value: suggestions.filter(s => s.category === 'BUG' && s.status === 'active').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const impactData = [
    { name: 'Alto', value: suggestions.filter(s => s.impact === 'HIGH' && s.status === 'active').length },
    { name: 'Médio', value: suggestions.filter(s => s.impact === 'MEDIUM' && s.status === 'active').length },
    { name: 'Baixo', value: suggestions.filter(s => s.impact === 'LOW' && s.status === 'active').length },
  ];

  return (
    <div className="space-y-6">
        
        {/* Header Moderno */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0yLTJ2Mmgydi0yaC0yem0tMiAwdi0yaDJ2LTJoLTJ2Mmgtdi0yaC0ydjJoLTJ2Mmgydi0yaDF6bTAtNHYyaDJ2LTJoLTJ6bS02IDR2Mmgydi0yaC0yem02IDB2Mmgydi0yaC0yem0tMi0ydjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bTIgMnYyaDJ2LTJoLTJ6bS0yIDBoLTJ2Mmgydi0yem0tNCAydjJoMnYtMmgtMnptNi0ydjJoMnYtMmgtMnptMi0yaDJ2LTJoLTJ2MnptMCAyaC0ydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <Terminal className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">DEV LAB</h1>
                  <p className="text-white/80 mt-1">Centro de Inovação e Sugestões • Sincronizado com o Projeto</p>
                </div>
              </div>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Métricas do Projeto */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Rocket className="w-5 h-5 text-emerald-400" />
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold">{metrics.overallProgress}%</div>
                <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Progresso Global</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-blue-400 font-semibold">{stats.active}</span>
                </div>
                <div className="text-3xl font-bold">{stats.active}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Sugestões Ativas</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">{stats.completed}</span>
                </div>
                <div className="text-3xl font-bold">{stats.completed}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Implementadas</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-purple-400 font-semibold">{allFeatures.length}</span>
                </div>
                <div className="text-3xl font-bold">{metrics.completedFeatures}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider mt-1">Features no Projeto</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navegação de Views */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {[
              { id: 'active', label: 'Ativas', icon: Activity, count: stats.active, color: 'blue' },
              { id: 'completed', label: 'Implementadas', icon: CheckCircle2, count: stats.completed, color: 'green' },
              { id: 'trash', label: 'Arquivo', icon: Archive, count: stats.trash, color: 'slate' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setView(tab.id as ViewMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all shadow-md',
                  view === tab.id
                    ? `bg-${tab.color}-500 text-white shadow-${tab.color}-500/50`
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-bold',
                  view === tab.id ? 'bg-white/20' : 'bg-slate-100'
                )}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setIsNewModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/50"
          >
            <Plus className="w-5 h-5" />
            Nova Sugestão
          </motion.button>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Distribuição por Categoria */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Por Categoria
            </h3>
            
            {categoryData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">
                <p className="text-sm">Nenhuma sugestão ativa</p>
              </div>
            )}
          </motion.div>

          {/* Distribuição por Impacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Por Impacto
            </h3>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Filtro de Categorias */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-orange-600" />
              Filtrar
            </h3>
            
            <div className="space-y-2">
              {['ALL', 'TECH', 'DESIGN_UX', 'FEATURE', 'BUG', 'OPTIMIZATION', 'INNOVATION', 'COMPETITION'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category | 'ALL')}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-medium',
                    selectedCategory === cat
                      ? 'bg-indigo-100 text-indigo-900 border-2 border-indigo-300'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                  )}
                >
                  {cat !== 'ALL' && <CategoryIcon category={cat as Category} />}
                  <span className="text-sm">{cat === 'ALL' ? 'Todas' : cat.replace('_', ' ')}</span>
                  <span className="ml-auto text-xs font-bold">
                    {suggestions.filter(s => cat === 'ALL' || s.category === cat).filter(s => s.status === 'active').length}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Lista de Sugestões */}
        <div className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 border-2 border-slate-200 text-center"
            >
              <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma sugestão encontrada</h3>
              <p className="text-slate-600">Adicione novas ideias para melhorar o projeto</p>
            </motion.div>
          ) : (
            filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CategoryIcon category={suggestion.category} />
                      <h3 className="text-lg font-bold text-slate-900">{suggestion.title}</h3>
                    </div>
                    <p className="text-slate-600 mb-4">{suggestion.description}</p>
                    
                    <div className="flex items-center gap-3">
                      <ImpactBadge impact={suggestion.impact} />
                      <EffortBadge effort={suggestion.effort} />
                      {suggestion.tags && suggestion.tags.length > 0 && (
                        <div className="flex gap-2">
                          {suggestion.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {suggestion.status === 'active' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markAsCompleted(suggestion.id)}
                          className="p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                          title="Marcar como implementada"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markAsTrash(suggestion.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                          title="Arquivar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                    {suggestion.status === 'trash' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => restoreFromTrash(suggestion.id)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                          title="Restaurar"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => permanentDelete(suggestion.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                          title="Deletar permanentemente"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm">
        <p>💡 DEV LAB sincronizado com o detector de status do projeto</p>
        <p className="mt-1">Última atualização: {new Date().toLocaleString('pt-PT')}</p>
      </div>
    </div>
  );
}
