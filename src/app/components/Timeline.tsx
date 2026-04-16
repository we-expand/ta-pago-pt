import { useState, useEffect } from 'react';
import { Clock, Mail, MessageSquare, Phone, Calendar, User, TrendingUp, CheckCircle2, XCircle, Eye, Send, AlertCircle, Filter, Search, ChevronDown, Zap, DollarSign, FileText, Plus, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTimelineActions, createTimelineAction, updateTimelineAction, deleteTimelineAction, generateMessagePreview, getDebtors } from '../../utils/supabase';  // Fixed: removed one '../'
import { toast } from 'sonner';
import { PageLayout, StatsGrid, PageSection } from './ui/PageLayout';
import GlassCard, { GlassStatsCard } from './ui/GlassCard';
import InteractiveButton from './ui/InteractiveButton';

type TimelineAction = {
  id: string;
  debtorName: string;
  debtorId: string;
  amount: string;
  date: string;
  time: string;
  type: 'email' | 'sms' | 'whatsapp' | 'phone' | 'payment' | 'system';
  action: string;
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'completed' | 'failed' | 'pending';
  message?: string;
  aiGenerated?: boolean;
  result?: string;
  score?: number;
  createdAt?: string;
};

export default function Timeline({ session }: { session: any }) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'email' | 'sms' | 'whatsapp' | 'phone' | 'payment'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<TimelineAction | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [actions, setActions] = useState<TimelineAction[]>([]);
  const [debtors, setDebtors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');

  // Create form state
  const [formData, setFormData] = useState({
    debtorId: '',
    type: 'email' as 'email' | 'sms' | 'whatsapp' | 'phone',
    action: '',
    message: '',
    tone: 'friendly' as 'friendly' | 'formal' | 'urgent',
    useAI: true,
    scheduledFor: ''
  });

  useEffect(() => {
    loadData();
  }, [session]);

  const loadData = async () => {
    if (!session?.access_token) return;
    
    setLoading(true);
    try {
      // Load timeline actions
      const actionsResult = await getTimelineActions(session.access_token);
      if (actionsResult.actions) {
        // Transform actions to match component format
        const transformedActions = actionsResult.actions.map((action: any) => ({
          ...action,
          date: action.createdAt ? new Date(action.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          time: action.createdAt ? new Date(action.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '',
          amount: `€${action.amount || 0}`
        }));
        setActions(transformedActions);
      }

      // Load debtors for dropdown
      const debtorsResult = await getDebtors(session.access_token);
      if (debtorsResult.debtors) {
        setDebtors(debtorsResult.debtors);
      }
      
      // 🎬 DEMO DATA: Add example timeline actions if no data exists
      if (!actionsResult.actions || actionsResult.actions.length === 0) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const yesterday = new Date(now.getTime() - 24*60*60*1000).toISOString().split('T')[0];
        const twoDaysAgo = new Date(now.getTime() - 2*24*60*60*1000).toISOString().split('T')[0];
        
        const demoActions: TimelineAction[] = [
          {
            id: 'demo-1',
            debtorName: 'Maria Silva',
            debtorId: 'demo-debtor-1',
            amount: '€2.450,00',
            date: today,
            time: '14:23',
            type: 'email',
            action: 'Email de cobrança enviado',
            status: 'delivered',
            message: 'Olá Maria, entramos em contato para informar sobre o saldo pendente de €2.450,00. Estamos disponíveis para negociar condições especiais de pagamento.',
            aiGenerated: true,
            result: 'Email entregue com sucesso',
            score: 85
          },
          {
            id: 'demo-2',
            debtorName: 'João Santos',
            debtorId: 'demo-debtor-2',
            amount: '€1.200,00',
            date: today,
            time: '10:15',
            type: 'whatsapp',
            action: 'Mensagem WhatsApp enviada',
            status: 'read',
            message: '📱 Olá João! Identificamos um saldo em aberto de €1.200. Podemos oferecer parcelamento em até 6x sem juros. Interessado?',
            aiGenerated: true,
            result: 'Mensagem lida às 10:47',
            score: 92
          },
          {
            id: 'demo-3',
            debtorName: 'Ana Costa',
            debtorId: 'demo-debtor-3',
            amount: '€5.800,00',
            date: today,
            time: '09:30',
            type: 'phone',
            action: 'Ligação telefónica realizada',
            status: 'completed',
            message: 'Cliente atendeu e demonstrou interesse em negociar. Proposta de acordo enviada por email.',
            result: 'Ligação bem sucedida - 8 minutos',
            score: 95
          },
          {
            id: 'demo-4',
            debtorName: 'Pedro Oliveira',
            debtorId: 'demo-debtor-4',
            amount: '€3.200,00',
            date: yesterday,
            time: '16:45',
            type: 'email',
            action: 'Proposta de acordo enviada',
            status: 'read',
            message: 'Enviada proposta de quitação com 20% de desconto à vista ou parcelamento em 10x de €320. Aguardando resposta.',
            aiGenerated: true,
            result: 'Email aberto 3 vezes',
            score: 88
          },
          {
            id: 'demo-5',
            debtorName: 'Carla Mendes',
            debtorId: 'demo-debtor-5',
            amount: '€890,50',
            date: yesterday,
            time: '11:20',
            type: 'sms',
            action: 'SMS de lembrete enviado',
            status: 'delivered',
            message: 'TAPAGO: Lembrete de pagamento pendente de €890,50. Evite juros - Acesse tapago.pt/pagar',
            result: 'SMS entregue',
            score: 75
          },
          {
            id: 'demo-6',
            debtorName: 'Ricardo Ferreira',
            debtorId: 'demo-debtor-6',
            amount: '€1.500,00',
            date: yesterday,
            time: '09:00',
            type: 'payment',
            action: 'Pagamento recebido',
            status: 'completed',
            message: 'Pagamento de €1.500 confirmado via transferência bancária. Devedor quitado.',
            result: '✅ Dívida liquidada',
            score: 100
          },
          {
            id: 'demo-7',
            debtorName: 'Sofia Rodrigues',
            debtorId: 'demo-debtor-7',
            amount: '€4.100,00',
            date: twoDaysAgo,
            time: '15:30',
            type: 'whatsapp',
            action: 'Follow-up automatizado',
            status: 'replied',
            message: '🔔 Olá Sofia, notamos que ainda não recebemos retorno sobre nossa proposta. Podemos ajudar com alguma dúvida?',
            aiGenerated: true,
            result: 'Cliente respondeu solicitando mais informações',
            score: 90
          },
          {
            id: 'demo-8',
            debtorName: 'Miguel Alves',
            debtorId: 'demo-debtor-8',
            amount: '€750,00',
            date: twoDaysAgo,
            time: '10:15',
            type: 'email',
            action: 'Email de boas-vindas',
            status: 'sent',
            message: 'Bem-vindo ao nosso sistema de gestão de pagamentos. Estamos aqui para ajudar a regularizar sua situação.',
            aiGenerated: false,
            result: 'Aguardando entrega',
            score: 70
          }
        ];
        
        setActions(demoActions);
        
        // Add demo debtors if none exist
        if (!debtorsResult.debtors || debtorsResult.debtors.length === 0) {
          setDebtors([
            { id: 'demo-debtor-1', name: 'Maria Silva', amount: 2450 },
            { id: 'demo-debtor-2', name: 'João Santos', amount: 1200 },
            { id: 'demo-debtor-3', name: 'Ana Costa', amount: 5800 },
            { id: 'demo-debtor-4', name: 'Pedro Oliveira', amount: 3200 },
            { id: 'demo-debtor-5', name: 'Carla Mendes', amount: 890.50 },
            { id: 'demo-debtor-6', name: 'Ricardo Ferreira', amount: 0 },
            { id: 'demo-debtor-7', name: 'Sofia Rodrigues', amount: 4100 },
            { id: 'demo-debtor-8', name: 'Miguel Alves', amount: 750 }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!formData.debtorId || !formData.type) {
      toast.error('Selecione um devedor e tipo de ação');
      return;
    }

    try {
      const result = await generateMessagePreview(session.access_token, {
        debtorId: formData.debtorId,
        type: formData.type,
        tone: formData.tone,
        template: formData.message
      });

      if (result.message) {
        setPreviewMessage(result.message);
        setShowPreview(true);
      } else {
        toast.error('Erro ao gerar preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Erro ao gerar preview');
    }
  };

  const handleCreateAction = async () => {
    if (!formData.debtorId || !formData.type || !formData.action) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const actionData = {
        debtorId: formData.debtorId,
        type: formData.type,
        action: formData.action,
        message: formData.useAI ? previewMessage : formData.message,
        aiGenerated: formData.useAI,
        status: formData.scheduledFor ? 'pending' : 'sent',
        scheduledFor: formData.scheduledFor || null
      };

      const result = await createTimelineAction(session.access_token, actionData);

      if (result.success) {
        toast.success('Ação criada com sucesso!');
        setShowCreateModal(false);
        setShowPreview(false);
        resetForm();
        loadData(); // Reload data
      } else {
        toast.error(result.error || 'Erro ao criar ação');
      }
    } catch (error) {
      console.error('Error creating action:', error);
      toast.error('Erro ao criar ação');
    }
  };

  const resetForm = () => {
    setFormData({
      debtorId: '',
      type: 'email',
      action: '',
      message: '',
      tone: 'friendly',
      useAI: true,
      scheduledFor: ''
    });
    setPreviewMessage('');
    setShowPreview(false);
  };

  const filteredActions = actions.filter(action => {
    const matchesFilter = selectedFilter === 'all' || action.type === selectedFilter;
    const matchesSearch = action.debtorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.debtorId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange !== 'all' && action.date) {
      const actionDate = new Date(action.date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - actionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateRange === 'today') matchesDate = diffDays === 0;
      if (dateRange === 'week') matchesDate = diffDays <= 7;
      if (dateRange === 'month') matchesDate = diffDays <= 30;
    }
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="size-5" />;
      case 'sms': return <MessageSquare className="size-5" />;
      case 'whatsapp': return <MessageSquare className="size-5" />;
      case 'phone': return <Phone className="size-5" />;
      case 'payment': return <DollarSign className="size-5" />;
      case 'system': return <Zap className="size-5" />;
      default: return <FileText className="size-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'from-blue-500 to-cyan-500';
      case 'sms': return 'from-purple-500 to-pink-500';
      case 'whatsapp': return 'from-green-500 to-emerald-500';
      case 'phone': return 'from-orange-500 to-red-500';
      case 'payment': return 'from-green-600 to-emerald-600';
      case 'system': return 'from-indigo-500 to-purple-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      sent: { color: 'bg-blue-100 text-blue-700', icon: <Send className="size-3" />, label: 'Enviado' },
      delivered: { color: 'bg-indigo-100 text-indigo-700', icon: <CheckCircle2 className="size-3" />, label: 'Entregue' },
      read: { color: 'bg-purple-100 text-purple-700', icon: <Eye className="size-3" />, label: 'Lido' },
      replied: { color: 'bg-green-100 text-green-700', icon: <MessageSquare className="size-3" />, label: 'Respondido' },
      completed: { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="size-3" />, label: 'Concluído' },
      failed: { color: 'bg-red-100 text-red-700', icon: <XCircle className="size-3" />, label: 'Falhou' },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="size-3" />, label: 'Pendente' }
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.icon}
        {badge.label}
      </div>
    );
  };

  const stats = {
    total: actions.length,
    today: actions.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.date === today;
    }).length,
    completed: actions.filter(a => a.status === 'completed').length,
    failed: actions.filter(a => a.status === 'failed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="size-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Timeline de Ações"
      description="Visualize e crie ações de cobrança"
      icon={Clock}
      headerActions={
        <InteractiveButton
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold"
        >
          <Plus className="size-5" />
          Nova Ação
        </InteractiveButton>
      }
    >
      {/* Stats Cards */}
      <StatsGrid>
        <GlassStatsCard
          icon={<FileText className="size-5 text-indigo-600" />}
          title="Total de Ações"
          value={stats.total}
        />

        <GlassStatsCard
          icon={<Calendar className="size-5 text-blue-600" />}
          title="Hoje"
          value={stats.today}
        />

        <GlassStatsCard
          icon={<CheckCircle2 className="size-5 text-green-600" />}
          title="Concluídas"
          value={stats.completed}
        />

        <GlassStatsCard
          icon={<AlertCircle className="size-5 text-red-600" />}
          title="Falhadas"
          value={stats.failed}
        />
      </StatsGrid>

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por devedor ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedFilter('email')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'email'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="size-4 inline mr-1" />
              Email
            </button>
            <button
              onClick={() => setSelectedFilter('whatsapp')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'whatsapp'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="size-4 inline mr-1" />
              WhatsApp
            </button>
            <button
              onClick={() => setSelectedFilter('sms')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'sms'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="size-4 inline mr-1" />
              SMS
            </button>
            <button
              onClick={() => setSelectedFilter('phone')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'phone'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="size-4 inline mr-1" />
              Telefone
            </button>
            <button
              onClick={() => setSelectedFilter('payment')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'payment'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="size-4 inline mr-1" />
              Pagamentos
            </button>
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium"
          >
            <option value="all">Todo o período</option>
            <option value="today">Hoje</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Últimos 30 dias</option>
          </select>
        </div>
      </GlassCard>

      {/* Timeline */}
      <PageSection>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="space-y-4">
            {filteredActions.length > 0 ? (
              filteredActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  {/* Timeline line */}
                  {index !== filteredActions.length - 1 && (
                    <div className="absolute left-[27px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 to-transparent" />
                  )}

                  <div className="flex gap-4 hover:bg-slate-50 rounded-xl p-4 -mx-4 transition-all cursor-pointer"
                       onClick={() => setSelectedAction(action)}>
                    {/* Icon */}
                    <div className={`flex-shrink-0 size-14 rounded-xl bg-gradient-to-br ${getTypeColor(action.type)} flex items-center justify-center text-white shadow-lg relative z-10`}>
                      {getTypeIcon(action.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-900 text-lg">{action.debtorName}</h3>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {action.debtorId}
                            </span>
                            {action.aiGenerated && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                <Zap className="size-3" />
                                IA
                              </div>
                            )}
                          </div>
                          <p className="text-slate-600 font-medium">{action.action}</p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {action.score && (
                            <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              action.score >= 70 ? 'bg-green-100 text-green-700' :
                              action.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Score: {action.score}
                            </div>
                          )}
                          {getStatusBadge(action.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          <span>{action.date ? new Date(action.date).toLocaleDateString('pt-PT') : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4" />
                          <span>{action.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-4" />
                          <span className="font-semibold text-slate-900">{action.amount}</span>
                        </div>
                      </div>

                      {action.message && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2">
                          <p className="text-sm text-slate-700 italic line-clamp-2">{action.message}</p>
                        </div>
                      )}

                      {action.result && (
                        <div className={`border-l-4 rounded-r-xl p-3 ${
                          action.status === 'completed' 
                            ? 'border-green-500 bg-green-50' 
                            : action.status === 'failed'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                        }`}>
                          <p className="text-sm font-medium text-slate-700">{action.result}</p>
                        </div>
                      )}
                    </div>

                    {/* Expand indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronDown className="size-5 text-slate-400" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Clock className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma ação encontrada</h3>
                <p className="text-slate-600 mb-4">Crie sua primeira ação de cobrança</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Criar Nova Ação
                </button>
              </div>
            )}
          </div>
        </div>
      </PageSection>

      {/* Create Action Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => {
              setShowCreateModal(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Nova Ação de Cobrança</h2>
                  <p className="text-slate-600">Configure e visualize como sua mensagem será enviada</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Debtor Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Selecionar Devedor *
                  </label>
                  <select
                    value={formData.debtorId}
                    onChange={(e) => setFormData({ ...formData, debtorId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Escolha um devedor</option>
                    {debtors.map(debtor => (
                      <option key={debtor.id} value={debtor.id}>
                        {debtor.name} - €{debtor.debtAmount} ({debtor.daysOverdue || 0} dias de atraso)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de Ação *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['email', 'whatsapp', 'sms', 'phone'].map(type => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type: type as any })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.type === type
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {getTypeIcon(type)}
                        <div className="text-xs font-medium mt-2 capitalize">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descrição da Ação *
                  </label>
                  <input
                    type="text"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    placeholder="Ex: Primeiro contato, Lembrete de pagamento, Negociação..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tom da Mensagem
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'friendly', label: 'Amigável', icon: '😊' },
                      { value: 'formal', label: 'Formal', icon: '📋' },
                      { value: 'urgent', label: 'Urgente', icon: '⚠️' }
                    ].map(tone => (
                      <button
                        key={tone.value}
                        onClick={() => setFormData({ ...formData, tone: tone.value as any })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.tone === tone.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{tone.icon}</div>
                        <div className="text-xs font-medium">{tone.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Toggle */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Gerar com IA</div>
                      <div className="text-sm text-slate-600">Mensagem personalizada automaticamente</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, useAI: !formData.useAI })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      formData.useAI ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 size-4 bg-white rounded-full transition-transform ${
                        formData.useAI ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Manual Message (if AI disabled) */}
                {!formData.useAI && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mensagem Manual
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      placeholder="Digite sua mensagem personalizada..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                )}

                {/* Preview Button */}
                {formData.useAI && formData.debtorId && (
                  <button
                    onClick={handleGeneratePreview}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="size-5" />
                    Gerar Preview da Mensagem
                  </button>
                )}

                {/* Preview Display */}
                {showPreview && previewMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="size-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-900">Preview da Mensagem IA</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-slate-700 leading-relaxed">
                      {previewMessage}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateAction}
                    disabled={!formData.debtorId || !formData.type || !formData.action || (formData.useAI && !previewMessage)}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="size-5" />
                    Criar Ação
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`size-16 rounded-2xl bg-gradient-to-br ${getTypeColor(selectedAction.type)} flex items-center justify-center text-white shadow-lg`}>
                    {getTypeIcon(selectedAction.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedAction.debtorName}</h2>
                    <p className="text-slate-600">{selectedAction.action}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-600 mb-1">ID do Devedor</div>
                  <div className="font-bold text-slate-900">{selectedAction.debtorId}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-600 mb-1">Valor</div>
                  <div className="font-bold text-slate-900 text-xl">{selectedAction.amount}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-600 mb-1">Data e Hora</div>
                  <div className="font-bold text-slate-900">
                    {selectedAction.date ? new Date(selectedAction.date).toLocaleDateString('pt-PT') : ''} às {selectedAction.time}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-600 mb-1">Status</div>
                  <div className="font-bold">{getStatusBadge(selectedAction.status)}</div>
                </div>
                {selectedAction.score && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-600 mb-1">Score de Pagamento</div>
                    <div className={`font-bold text-2xl ${
                      selectedAction.score >= 70 ? 'text-green-600' :
                      selectedAction.score >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {selectedAction.score}
                    </div>
                  </div>
                )}
                {selectedAction.aiGenerated && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-xs text-purple-600 mb-1">Gerado por IA</div>
                    <div className="flex items-center gap-2">
                      <Zap className="size-5 text-purple-600" />
                      <span className="font-bold text-purple-900">Sim</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedAction.message && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Mensagem Enviada</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedAction.message}</p>
                  </div>
                </div>
              )}

              {selectedAction.result && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Resultado</h3>
                  <div className={`border-l-4 rounded-r-xl p-4 ${
                    selectedAction.status === 'completed' 
                      ? 'border-green-500 bg-green-50' 
                      : selectedAction.status === 'failed'
                      ? 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                  }`}>
                    <p className="font-medium text-slate-700">{selectedAction.result}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}