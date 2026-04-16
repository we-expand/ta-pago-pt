import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  MessageSquare, 
  Phone,
  Upload,
  Download,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  X,
  FileText,
  Calendar,
  MapPin,
  Building2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { projectId } from '../../../utils/supabase/info';
import InteractiveButton from './ui/InteractiveButton';
import GlassCard from './ui/GlassCard';
import NewDebtorModal from './NewDebtorModal';
import ImportModal from './ImportModal';

interface Debtor {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
  debtAmount: number;
  originalAmount: number;
  dueDate: string;
  daysOverdue: number;
  status: 'active' | 'negotiating' | 'paid' | 'defaulted' | 'legal';
  score: number;
  category: string;
  segment: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  companyName?: string;
  lastContact?: string;
  createdAt: string;
}

type SortField = 'name' | 'debtAmount' | 'daysOverdue' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface DebtorsManagementProps {
  session: any;
}

export default function DebtorsManagement({ session }: DebtorsManagementProps) {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  
  // Filters panel
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDebtors();
  }, []);

  const loadDebtors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors`,
        {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar devedores');
      }

      const data = await response.json();
      setDebtors(data.debtors || []);
    } catch (error) {
      console.error('Error loading debtors:', error);
      toast.error('Erro ao carregar devedores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar devedor');
      }

      toast.success('Devedor removido com sucesso!');
      loadDebtors();
      setShowDeleteConfirm(false);
      setSelectedDebtor(null);
    } catch (error) {
      console.error('Error deleting debtor:', error);
      toast.error('Erro ao deletar devedor');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort debtors
  const filteredAndSortedDebtors = debtors
    .filter(d => {
      const matchesSearch = 
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone?.includes(searchTerm) ||
        d.document?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || d.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'debtAmount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Stats
  const stats = {
    total: debtors.length,
    totalDebt: debtors.reduce((sum, d) => sum + (parseFloat(d.debtAmount as any) || 0), 0),
    overdue: debtors.filter(d => (d.daysOverdue || 0) > 0).length,
    active: debtors.filter(d => d.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="size-8 text-indigo-600" />
              Gestão de Devedores
            </h1>
            <p className="text-slate-600 mt-2">
              Controle completo da sua carteira de cobrança
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <InteractiveButton
              variant="ghost"
              icon={<Upload className="size-5" />}
              onClick={() => setShowImportModal(true)}
            >
              Importar
            </InteractiveButton>
            <InteractiveButton
              variant="primary"
              icon={<Plus className="size-5" />}
              onClick={() => setShowNewModal(true)}
            >
              Novo Devedor
            </InteractiveButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard variant="light" hover className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Devedores</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Users className="size-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="light" hover className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Dívida Total</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  €{stats.totalDebt.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="size-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="light" hover className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Em Atraso</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.overdue}</p>
              </div>
              <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <AlertTriangle className="size-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="light" hover className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ativos</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.active}</p>
              </div>
              <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <CheckCircle2 className="size-6 text-white" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Filters and Search */}
      <GlassCard variant="light" className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
              />
            </div>

            {/* Filter Button */}
            <InteractiveButton
              variant={showFilters ? 'primary' : 'ghost'}
              icon={<Filter className="size-5" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
              {(statusFilter !== 'all' || priorityFilter !== 'all') && (
                <span className="ml-2 size-2 rounded-full bg-purple-500 animate-pulse" />
              )}
            </InteractiveButton>

            {/* Refresh */}
            <InteractiveButton
              variant="ghost"
              icon={<RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />}
              onClick={loadDebtors}
              disabled={loading}
            >
              Atualizar
            </InteractiveButton>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-white/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Ativo</option>
                        <option value="negotiating">Negociando</option>
                        <option value="paid">Pago</option>
                        <option value="defaulted">Inadimplente</option>
                        <option value="legal">Jurídico</option>
                      </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Prioridade
                      </label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                      >
                        <option value="all">Todas</option>
                        <option value="urgent">Urgente</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <InteractiveButton
                        variant="ghost"
                        onClick={() => {
                          setStatusFilter('all');
                          setPriorityFilter('all');
                          setSearchTerm('');
                        }}
                        className="w-full"
                      >
                        Limpar Filtros
                      </InteractiveButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard variant="light" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 backdrop-blur-sm border-b-2 border-white/30">
              <tr>
                <SortableHeader 
                  label="Nome" 
                  field="name" 
                  currentSort={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader 
                  label="Valor" 
                  field="debtAmount" 
                  currentSort={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader 
                  label="Atraso" 
                  field="daysOverdue" 
                  currentSort={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                  Score
                </th>
                <SortableHeader 
                  label="Status" 
                  field="status" 
                  currentSort={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                  Prioridade
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="size-8 text-indigo-600 animate-spin" />
                      <p className="text-slate-600 font-medium">Carregando devedores...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedDebtors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="size-12 text-slate-300" />
                      <p className="text-slate-600 font-medium">
                        {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                          ? 'Nenhum devedor encontrado com os filtros aplicados'
                          : 'Nenhum devedor cadastrado. Comece adicionando o primeiro!'}
                      </p>
                      {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                        <InteractiveButton
                          variant="primary"
                          size="sm"
                          icon={<Plus className="size-4" />}
                          onClick={() => setShowNewModal(true)}
                        >
                          Adicionar Primeiro Devedor
                        </InteractiveButton>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedDebtors.map((debtor) => (
                  <motion.tr
                    key={debtor.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {debtor.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{debtor.name}</p>
                          <p className="text-sm text-slate-500">{debtor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          €{parseFloat(debtor.debtAmount as any).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                        </p>
                        {debtor.originalAmount && debtor.originalAmount !== debtor.debtAmount && (
                          <p className="text-xs text-slate-500 line-through">
                            €{parseFloat(debtor.originalAmount as any).toLocaleString('pt-PT')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {(debtor.daysOverdue || 0) > 0 ? (
                          <>
                            <TrendingUp className="size-4 text-red-500" />
                            <span className="font-semibold text-red-600">
                              {debtor.daysOverdue} dias
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-4 text-green-500" />
                            <span className="font-medium text-green-600">Em dia</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ScoreBadge score={debtor.score || 50} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={debtor.status || 'active'} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={debtor.priority || 'medium'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedDebtor(debtor);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDebtor(debtor);
                            setShowNewModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDebtor(debtor);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results counter */}
        {!loading && filteredAndSortedDebtors.length > 0 && (
          <div className="px-6 py-4 border-t-2 border-white/30 bg-white/30 backdrop-blur-sm">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-bold text-slate-900">{filteredAndSortedDebtors.length}</span> de{' '}
              <span className="font-bold text-slate-900">{debtors.length}</span> devedores
            </p>
          </div>
        )}
      </GlassCard>

      {/* Modals */}
      <AnimatePresence>
        {showNewModal && (
          <NewDebtorModal
            session={session}
            debtor={selectedDebtor}
            onClose={() => {
              setShowNewModal(false);
              setSelectedDebtor(null);
            }}
            onSuccess={() => {
              setShowNewModal(false);
              setSelectedDebtor(null);
              loadDebtors();
            }}
          />
        )}

        {showImportModal && (
          <ImportModal
            session={session}
            onClose={() => setShowImportModal(false)}
            onSuccess={() => {
              setShowImportModal(false);
              loadDebtors();
            }}
          />
        )}

        {showDetailsModal && selectedDebtor && (
          <DebtorDetailsModal
            debtor={selectedDebtor}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedDebtor(null);
            }}
          />
        )}

        {showDeleteConfirm && selectedDebtor && (
          <DeleteConfirmModal
            debtor={selectedDebtor}
            onConfirm={() => handleDelete(selectedDebtor.id)}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setSelectedDebtor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Sortable Header Component
function SortableHeader({ 
  label, 
  field, 
  currentSort, 
  direction, 
  onSort 
}: { 
  label: string; 
  field: SortField; 
  currentSort: SortField; 
  direction: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;
  
  return (
    <th className="px-6 py-4 text-left">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors group"
      >
        {label}
        <div className={`transition-colors ${isActive ? 'text-purple-600' : 'text-slate-400'}`}>
          {isActive ? (
            direction === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
          ) : (
            <ArrowUpDown className="size-4 opacity-0 group-hover:opacity-100" />
          )}
        </div>
      </button>
    </th>
  );
}

// Score Badge
function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 70) return 'from-green-500 to-emerald-600 text-white';
    if (score >= 40) return 'from-yellow-500 to-orange-600 text-white';
    return 'from-red-500 to-rose-600 text-white';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getColor()} font-bold text-sm`}>
      {score}%
    </div>
  );
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    active: { label: 'Ativo', color: 'from-blue-500 to-cyan-600' },
    negotiating: { label: 'Negociando', color: 'from-purple-500 to-pink-600' },
    paid: { label: 'Pago', color: 'from-green-500 to-emerald-600' },
    defaulted: { label: 'Inadimplente', color: 'from-red-500 to-rose-600' },
    legal: { label: 'Jurídico', color: 'from-slate-700 to-slate-900' }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex px-3 py-1.5 rounded-full bg-gradient-to-r ${config.color} text-white font-bold text-sm`}>
      {config.label}
    </span>
  );
}

// Priority Badge
function PriorityBadge({ priority }: { priority: string }) {
  const priorityConfig: any = {
    urgent: { label: 'Urgente', color: 'from-red-500 to-rose-600', icon: '🔥' },
    high: { label: 'Alta', color: 'from-orange-500 to-red-600', icon: '⚠️' },
    medium: { label: 'Média', color: 'from-blue-500 to-cyan-600', icon: '➖' },
    low: { label: 'Baixa', color: 'from-slate-400 to-slate-600', icon: '⬇️' }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.color} text-white font-bold text-sm`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

// Debtor Details Modal
function DebtorDetailsModal({ debtor, onClose }: { debtor: Debtor; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto"
      onClick={onClose}
    >
      <GlassCard
        variant="strong"
        blur="xl"
        hover={false}
        className="w-full max-w-3xl my-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              {debtor.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{debtor.name}</h2>
              <p className="text-slate-600 mt-1">{debtor.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 rounded-xl bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40">
              <p className="text-sm font-semibold text-slate-600 mb-1">Status</p>
              <StatusBadge status={debtor.status} />
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40">
              <p className="text-sm font-semibold text-slate-600 mb-1">Prioridade</p>
              <PriorityBadge priority={debtor.priority} />
            </div>
          </div>

          {/* Financial Info */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <DollarSign className="size-5 text-purple-600" />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40">
                <p className="text-sm font-semibold text-slate-600 mb-1">Valor da Dívida</p>
                <p className="text-2xl font-bold text-slate-900">
                  €{parseFloat(debtor.debtAmount as any).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40">
                <p className="text-sm font-semibold text-slate-600 mb-1">Dias em Atraso</p>
                <p className="text-2xl font-bold text-red-600">{debtor.daysOverdue || 0}</p>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40">
                <p className="text-sm font-semibold text-slate-600 mb-1">Score</p>
                <ScoreBadge score={debtor.score || 50} />
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40">
                <p className="text-sm font-semibold text-slate-600 mb-1">Categoria</p>
                <p className="text-lg font-bold text-slate-900">{debtor.category}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="size-5 text-purple-600" />
              Informações de Contato
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
                <Mail className="size-5 text-slate-500" />
                <span className="text-slate-900">{debtor.email}</span>
              </div>
              {debtor.phone && (
                <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
                  <Phone className="size-5 text-slate-500" />
                  <span className="text-slate-900">{debtor.phone}</span>
                </div>
              )}
              {debtor.document && (
                <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
                  <FileText className="size-5 text-slate-500" />
                  <span className="text-slate-900">{debtor.documentType}: {debtor.document}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {debtor.address && (
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="size-5 text-purple-600" />
                Endereço
              </h3>
              <div className="p-4 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-white/40">
                <p className="text-slate-900">
                  {debtor.address.street}, {debtor.address.city} - {debtor.address.state}
                  <br />
                  CEP: {debtor.address.zipCode}
                </p>
              </div>
            </div>
          )}

          {/* Company Info */}
          {debtor.companyName && (
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="size-5 text-purple-600" />
                Empresa
              </h3>
              <div className="p-4 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-white/40">
                <p className="text-lg font-bold text-slate-900">{debtor.companyName}</p>
                <p className="text-sm text-slate-600">Segmento: {debtor.segment}</p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="size-5 text-purple-600" />
              Datas Importantes
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-white/40">
                <p className="text-sm font-semibold text-slate-600 mb-1">Vencimento</p>
                <p className="text-slate-900">{new Date(debtor.dueDate).toLocaleDateString('pt-PT')}</p>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-white/40">
                <p className="text-sm font-semibold text-slate-600 mb-1">Cadastrado em</p>
                <p className="text-slate-900">{new Date(debtor.createdAt).toLocaleDateString('pt-PT')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-white/30">
          <InteractiveButton variant="ghost" onClick={onClose}>
            Fechar
          </InteractiveButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Delete Confirm Modal
function DeleteConfirmModal({ 
  debtor, 
  onConfirm, 
  onCancel 
}: { 
  debtor: Debtor; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
      onClick={onCancel}
    >
      <GlassCard
        variant="strong"
        blur="xl"
        hover={false}
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Confirmar Exclusão</h3>
              <p className="text-sm text-slate-600 mt-1">Esta ação não pode ser desfeita</p>
            </div>
          </div>

          <div className="bg-red-50/50 backdrop-blur-sm border-2 border-red-200/30 rounded-xl p-4 mb-6">
            <p className="text-slate-700">
              Tem certeza que deseja excluir o devedor <strong>{debtor.name}</strong>?
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Todos os dados e histórico relacionados serão permanentemente removidos.
            </p>
          </div>

          <div className="flex gap-3">
            <InteractiveButton
              variant="ghost"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </InteractiveButton>
            <InteractiveButton
              variant="primary"
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              icon={<Trash2 className="size-5" />}
            >
              Excluir
            </InteractiveButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}