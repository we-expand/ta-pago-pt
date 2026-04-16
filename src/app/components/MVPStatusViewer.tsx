import { motion } from "motion/react";
import { CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, TrendingUp, Zap, Package, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  calculateProjectMetrics,
  getFeaturesByCategory,
  getCriticalPendingFeatures,
  getNextFeatures,
  getRecentlyCompletedFeatures,
  type FeatureStatus
} from '../utils/projectStatusDetector';

export default function MVPStatusViewer() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(calculateProjectMetrics());
  const [recentFeatures, setRecentFeatures] = useState<FeatureStatus[]>([]);

  // Atualiza métricas em tempo real
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(calculateProjectMetrics());
      setRecentFeatures(getRecentlyCompletedFeatures(5));
    };

    updateMetrics();
    
    // Atualiza a cada 5 segundos
    const interval = setInterval(updateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getCategoryDetails = (category: string) => {
    const categoryMap: Record<string, { title: string; description: string; category: any }> = {
      general: {
        title: "Detalhes: Progresso Geral",
        description: "Status geral do projeto e funcionalidades transversais.",
        category: 'general'
      },
      frontend: {
        title: "Detalhes: Frontend",
        description: "Interface, componentes e experiência do usuário.",
        category: 'frontend'
      },
      backend: {
        title: "Detalhes: Backend & Dados",
        description: "Infraestrutura, APIs e integrações de dados.",
        category: 'backend'
      }
    };

    const info = categoryMap[category];
    if (!info) return null;

    const features = getFeaturesByCategory(info.category);

    return {
      title: info.title,
      description: info.description,
      items: features.map(f => ({
        label: f.name,
        description: f.description,
        status: f.status === 'completed' ? 'Concluído' : 
                f.status === 'in-progress' ? 'Em Progresso' :
                f.status === 'critical' ? 'CRÍTICO' : 'Pendente',
        priority: f.priority === 'critical' ? 'Crítica' :
                 f.priority === 'high' ? 'Alta' :
                 f.priority === 'medium' ? 'Média' : 'Baixa',
        completedDate: f.completedDate
      }))
    };
  };

  const currentDetail = selectedCard ? getCategoryDetails(selectedCard) : null;

  const getStatusColor = (status: string) => {
    if (status === 'Concluído') return 'bg-emerald-500';
    if (status === 'CRÍTICO') return 'bg-red-500 animate-pulse';
    if (status === 'Em Progresso') return 'bg-blue-500 animate-pulse';
    return 'bg-slate-300';
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Status do Projeto & Roadmap</h2>
          <p className="text-slate-500 mt-1">🤖 Atualização automática em tempo real</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium text-sm border border-indigo-100 shrink-0">
          <Clock className="size-4" />
          <span>Estimativa Restante: ~{metrics.estimatedDaysRemaining} Dias Úteis</span>
        </div>
      </div>

      {/* Content Grid - Responsive layout that takes full width */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: KPI Cards */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <StatusCard 
            id="general"
            title="Progresso Geral" 
            value={`${metrics.overallProgress}%`}
            subtitle={`Fase ${metrics.currentPhase}`}
            color="indigo"
            icon={<CheckCircle2 className="size-6 text-white" />}
            onClick={() => setSelectedCard('general')}
          />
          <StatusCard 
            id="frontend"
            title="Frontend" 
            value={`${metrics.frontendProgress}%`}
            subtitle="Interface & UX" 
            color="emerald"
            icon={<FileText className="size-6 text-white" />}
            onClick={() => setSelectedCard('frontend')}
          />
          <StatusCard 
            id="backend"
            title="Backend & Dados" 
            value={`${metrics.backendProgress}%`}
            subtitle={`${metrics.criticalFeatures} críticas pendentes`}
            color={metrics.criticalFeatures > 0 ? "amber" : "emerald"}
            icon={<AlertCircle className="size-6 text-white" />}
            onClick={() => setSelectedCard('backend')}
          />
        </div>

        {/* Right Column: Detailed Report */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-9 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm overflow-y-auto custom-scrollbar flex flex-col"
        >
          <div className="prose prose-slate max-w-none flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="size-2 rounded-full bg-indigo-500"></span>
              Relatório de Status Automático - v1.0.0
            </h3>
            
            <p className="text-slate-600 mb-8">
              A plataforma <strong>Tá Pago.pt</strong> encontra-se em <strong>Fase {metrics.currentPhase}</strong> com{' '}
              <strong>{metrics.completedFeatures} de {metrics.totalFeatures}</strong> funcionalidades implementadas.
              Este relatório é gerado automaticamente através da análise do código e componentes do projeto.
            </p>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">{metrics.completedFeatures}</div>
                <div className="text-xs text-emerald-700 mt-1">✅ Completas</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{metrics.inProgressFeatures}</div>
                <div className="text-xs text-blue-700 mt-1">🔄 Em Progresso</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{metrics.pendingFeatures}</div>
                <div className="text-xs text-amber-700 mt-1">⏳ Pendentes</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{metrics.criticalFeatures}</div>
                <div className="text-xs text-red-700 mt-1">🚨 Críticas</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 xl:gap-8 mb-8">
              <div className="flex flex-col h-full">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Implementado Recentemente
                </h4>
                <ul className="space-y-3 text-sm bg-white/50 p-5 rounded-2xl border border-white/50 flex-1">
                  {recentFeatures.map((feature, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{feature.name}</div>
                        <div className="text-xs text-slate-500">{feature.description}</div>
                        {feature.completedDate && (
                          <div className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(feature.completedDate).toLocaleDateString('pt-PT')}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col h-full">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Zap className="size-4 text-amber-500" />
                  Próximas Prioridades
                </h4>
                <ul className="space-y-3 text-sm bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50 flex-1">
                  {getNextFeatures(5).map((feature, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{feature.name}</div>
                        <div className="text-xs text-slate-500">{feature.description}</div>
                        <div className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${
                          feature.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          feature.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          Prioridade: {feature.priority === 'critical' ? 'Crítica' : 
                                      feature.priority === 'high' ? 'Alta' : 
                                      feature.priority === 'medium' ? 'Média' : 'Baixa'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 mb-4">Features Críticas Pendentes</h4>
            {getCriticalPendingFeatures().length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-red-200 mb-8 bg-red-50/50">
                <table className="min-w-full divide-y divide-red-200">
                  <thead className="bg-red-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider w-full">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider whitespace-nowrap">Categoria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200">
                    {getCriticalPendingFeatures().map((feature, idx) => (
                      <tr key={idx} className="hover:bg-red-100/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{feature.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{feature.description}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap capitalize">{feature.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-center">
                <CheckCircle2 className="size-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-emerald-900">🎉 Todas as features críticas foram implementadas!</p>
                <p className="text-sm text-emerald-700 mt-1">O projeto está pronto para avançar para a próxima fase.</p>
              </div>
            )}

            <div className="bg-indigo-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Progresso em Tempo Real
                </h5>
                <p className="text-indigo-200 text-sm">
                  {metrics.overallProgress}% concluído • {metrics.estimatedDaysRemaining} dias restantes estimados
                </p>
                <p className="text-indigo-300 text-xs mt-1">
                  Última atualização: {new Date().toLocaleString('pt-PT')}
                </p>
              </div>
              <div className="px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-xs text-indigo-200 mb-1">Fase Atual</div>
                <div className="text-2xl font-bold">{metrics.currentPhase}</div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Package className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">🤖 Sistema de Detecção Automática</p>
                  <p className="text-blue-800">
                    Este dashboard detecta automaticamente as funcionalidades implementadas no projeto,
                    analisando a presença de componentes, integrações e configurações. 
                    As métricas são atualizadas em tempo real a cada 5 segundos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="sm:max-w-3xl bg-white/95 backdrop-blur-3xl border-white/60 shadow-2xl rounded-3xl p-0 overflow-hidden max-h-[85vh]">
          {currentDetail && (
            <>
              <DialogHeader className="p-8 pb-4 border-b border-slate-100 bg-slate-50/50">
                <DialogTitle className="text-2xl font-bold text-slate-900">{currentDetail.title}</DialogTitle>
                <DialogDescription className="text-slate-500 text-base">{currentDetail.description}</DialogDescription>
              </DialogHeader>
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {currentDetail.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-100 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`size-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(item.status)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-700 mb-1">{item.label}</div>
                          <div className="text-xs text-slate-500">{item.description}</div>
                          {item.completedDate && (
                            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                              <Calendar className="size-3" />
                              Concluído em {new Date(item.completedDate).toLocaleDateString('pt-PT')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                           item.priority === 'Crítica' ? 'bg-red-100 text-red-700' :
                           item.priority === 'Alta' ? 'bg-amber-100 text-amber-700' :
                           item.priority === 'Média' ? 'bg-indigo-50 text-indigo-700' :
                           'bg-slate-100 text-slate-600'
                         }`}>
                           {item.priority}
                         </span>
                         <span className="text-sm text-slate-400 min-w-[100px] text-right">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-end">
                   <button 
                     onClick={() => setSelectedCard(null)}
                     className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
                   >
                     Fechar Detalhes
                   </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StatusCardProps {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  color: 'indigo' | 'emerald' | 'amber' | 'red';
  icon: React.ReactNode;
  onClick: () => void;
}

function StatusCard({ id, title, value, subtitle, color, icon, onClick }: StatusCardProps) {
  const colorMap = {
    indigo: {
      bg: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-500/30",
      hover: "hover:shadow-indigo-500/40"
    },
    emerald: {
      bg: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/30",
      hover: "hover:shadow-emerald-500/40"
    },
    amber: {
      bg: "from-amber-500 to-amber-600",
      shadow: "shadow-amber-500/30",
      hover: "hover:shadow-amber-500/40"
    },
    red: {
      bg: "from-red-500 to-red-600",
      shadow: "shadow-red-500/30",
      hover: "hover:shadow-red-500/40"
    }
  };

  const colors = colorMap[color];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colors.bg} text-white rounded-3xl p-6 shadow-lg ${colors.shadow} ${colors.hover} hover:shadow-xl transition-all duration-300 text-left w-full group cursor-pointer`}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-1 font-medium">{title}</p>
          <h3 className="text-4xl font-bold mb-2">{value}</h3>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
        <div className="size-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -bottom-8 -right-8 size-32 bg-white/5 rounded-full blur-2xl" />
    </motion.button>
  );
}
