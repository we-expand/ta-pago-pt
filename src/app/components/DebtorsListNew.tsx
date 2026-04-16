import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Upload, 
  Search, 
  Filter, 
  Download,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Euro,
  TrendingUp,
  TrendingDown,
  Building2,
  User,
  AlertCircle,
  FileSpreadsheet,
  X,
  Check,
  ChevronDown,
  MoreVertical,
  Handshake // Import Handshake icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import GlassCard, { GlassStatsCard } from './ui/GlassCard';
import { TableSkeleton, DebtorCardSkeleton } from './ui/SkeletonLoaders';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import NewDebtorModal from './NewDebtorModal';
import ImportModal from './ImportModal';
import SendCollectionModal from './SendCollectionModal';
import PaymentAgreementModal from './PaymentAgreementModal';

interface Debtor {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
  debtAmount: number;
  dueDate: string;
  paymentScore: number;
  status: string;
  segment: string;
  priority: string;
  lastContact: string | null;
  address: {
    city: string;
    state: string;
    zipCode: string;
  };
  companyName?: string;
  category: string;
}

export default function DebtorsList({ session }: { session: any }) {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewDebtorModal, setShowNewDebtorModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false); // New state
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  useEffect(() => {
    loadDebtors();
  }, []);

  async function loadDebtors() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
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
  }

  const filteredDebtors = debtors.filter(debtor => {
    const matchesSearch = debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debtor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debtor.document?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || debtor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: debtors.length,
    totalAmount: debtors.reduce((sum, d) => sum + d.debtAmount, 0),
    active: debtors.filter(d => d.status === 'active').length,
    avgScore: debtors.length > 0 ? debtors.reduce((sum, d) => sum + d.paymentScore, 0) / debtors.length : 0
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 min-h-screen">
      {/* Header */}
      <GlassCard variant="strong" blur="xl" hover={false} className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestão de Devedores</h1>
            <p className="text-slate-600">Gerencie sua carteira de cobrança</p>
          </div>
          
          <div className="flex items-center gap-3">
            <InteractiveButton
              variant="ghost"
              size="md"
              icon={<Upload className="size-5" />}
              onClick={() => setShowImportModal(true)}
            >
              Importar Excel
            </InteractiveButton>

            <InteractiveButton
              variant="primary"
              size="md"
              icon={<UserPlus className="size-5" />}
              onClick={() => {
                setSelectedDebtor(null);
                setShowNewDebtorModal(true);
              }}
            >
              Novo Devedor
            </InteractiveButton>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <GlassStatsCard>
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <User className="size-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Total de Devedores</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </GlassStatsCard>

        <GlassStatsCard>
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Euro className="size-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Valor Total</p>
              <p className="text-3xl font-bold text-slate-900">€{stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </GlassStatsCard>

        <GlassStatsCard>
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Ativos</p>
              <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
            </div>
          </div>
        </GlassStatsCard>

        <GlassStatsCard>
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Score Médio</p>
              <p className="text-3xl font-bold text-slate-900">{stats.avgScore.toFixed(0)}</p>
            </div>
          </div>
        </GlassStatsCard>
      </div>

      {/* Filters */}
      <GlassCard variant="default" hover={false} className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="negotiating">Em Negociação</option>
            <option value="paid">Pago</option>
            <option value="legal">Judicial</option>
          </select>

          <div className="flex bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                viewMode === 'cards' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Tabela
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Debtors List */}
      {filteredDebtors.length === 0 ? (
        <GlassCard variant="default" hover={false} className="p-12 text-center">
          <AlertCircle className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum devedor encontrado</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando seu primeiro devedor'}
          </p>
          <InteractiveButton
            variant="primary"
            size="md"
            icon={<UserPlus className="size-5" />}
            onClick={() => setShowNewDebtorModal(true)}
          >
            Adicionar Primeiro Devedor
          </InteractiveButton>
        </GlassCard>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredDebtors.map((debtor, index) => (
            <DebtorCard
              key={debtor.id}
              debtor={debtor}
              onEdit={() => {
                setSelectedDebtor(debtor);
                setShowNewDebtorModal(true);
              }}
              onSendCollection={() => {
                setSelectedDebtor(debtor);
                setShowSendModal(true);
              }}
              onNegotiate={() => {
                setSelectedDebtor(debtor);
                setShowAgreementModal(true);
              }}
              onDelete={async () => {
                if (confirm('Tem certeza que deseja remover este devedor?')) {
                  try {
                    const response = await fetch(
                      `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/${debtor.id}`,
                      {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${session.access_token}`
                        }
                      }
                    );
                    if (response.ok) {
                      toast.success('Devedor removido com sucesso!');
                      loadDebtors();
                    }
                  } catch (error) {
                    toast.error('Erro ao remover devedor');
                  }
                }
              }}
              delay={index * 0.05}
            />
          ))}
        </div>
      ) : (
        <DebtorsTable
          debtors={filteredDebtors}
          onEdit={(debtor) => {
            setSelectedDebtor(debtor);
            setShowNewDebtorModal(true);
          }}
          onSendCollection={(debtor) => {
            setSelectedDebtor(debtor);
            setShowSendModal(true);
          }}
          onNegotiate={(debtor) => {
            setSelectedDebtor(debtor);
            setShowAgreementModal(true);
          }}
          onDelete={async (debtor) => {
            if (confirm('Tem certeza que deseja remover este devedor?')) {
              try {
                const response = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/${debtor.id}`,
                  {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${session.access_token}`
                    }
                  }
                );
                if (response.ok) {
                  toast.success('Devedor removido com sucesso!');
                  loadDebtors();
                }
              } catch (error) {
                toast.error('Erro ao remover devedor');
              }
            }
          }}
        />
      )}

      {/* Modal de Novo/Editar Devedor */}
      <AnimatePresence>
        {showNewDebtorModal && (
          <NewDebtorModal
            session={session}
            debtor={selectedDebtor}
            onClose={() => {
              setShowNewDebtorModal(false);
              setSelectedDebtor(null);
            }}
            onSuccess={() => {
              setShowNewDebtorModal(false);
              setSelectedDebtor(null);
              loadDebtors();
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal de Importação */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Modal de Envio de Cobrança */}
      <AnimatePresence>
        {showSendModal && selectedDebtor && (
          <SendCollectionModal
            session={session}
            debtor={selectedDebtor}
            onClose={() => {
              setShowSendModal(false);
              setSelectedDebtor(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal de Acordo de Pagamento */}
      <AnimatePresence>
        {showAgreementModal && selectedDebtor && (
          <PaymentAgreementModal
            session={session}
            debtor={selectedDebtor}
            onClose={() => {
              setShowAgreementModal(false);
              setSelectedDebtor(null);
            }}
            onSuccess={() => {
              setShowAgreementModal(false);
              setSelectedDebtor(null);
              loadDebtors();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Debtor Card Component
function DebtorCard({ debtor, onEdit, onDelete, onSendCollection, onNegotiate, delay = 0 }: any) {
  const daysOverdue = Math.floor((Date.now() - new Date(debtor.dueDate).getTime()) / (1000 * 60 * 60 * 24));
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'from-green-500 to-emerald-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      active: { label: 'Ativo', color: 'bg-blue-500/20 text-blue-700 border-blue-300/30' },
      negotiating: { label: 'Negociação', color: 'bg-yellow-500/20 text-yellow-700 border-yellow-300/30' },
      paid: { label: 'Pago', color: 'bg-green-500/20 text-green-700 border-green-300/30' },
      legal: { label: 'Judicial', color: 'bg-red-500/20 text-red-700 border-red-300/30' }
    };
    const badge = badges[status] || badges.active;
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>{badge.label}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <GlassCard variant="default" className="p-6 group cursor-pointer relative overflow-hidden">
        {/* Quick Action Button - Visible on Hover */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNegotiate();
            }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg font-semibold shadow-lg hover:bg-emerald-700 transition-colors"
            title="Negociar Acordo"
          >
            <Handshake className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSendCollection();
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Mail className="size-4" />
            <span>Cobrar</span>
          </button>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`size-14 rounded-xl bg-gradient-to-br ${getScoreColor(debtor.paymentScore)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {debtor.paymentScore}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{debtor.name}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Mail className="size-3.5" />
                  <span className="truncate">{debtor.email || 'Sem email'}</span>
                </div>
                {debtor.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="size-3.5" />
                    <span>{debtor.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(debtor.status)}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="size-8 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
              >
                <Edit2 className="size-4 text-slate-600" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="size-8 rounded-lg bg-white/50 hover:bg-red-50 flex items-center justify-center transition-colors"
              >
                <Trash2 className="size-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/50">
          <div>
            <p className="text-xs text-slate-500 mb-1">Valor da Dívida</p>
            <p className="text-lg font-bold text-slate-900">€{debtor.debtAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Dias em Atraso</p>
            <p className={`text-lg font-bold ${daysOverdue > 90 ? 'text-red-600' : daysOverdue > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
              {daysOverdue} dias
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Segmento</p>
            <div className="flex items-center gap-1">
              {debtor.segment === 'B2B' ? <Building2 className="size-4 text-purple-600" /> : <User className="size-4 text-blue-600" />}
              <p className="text-sm font-semibold text-slate-900">{debtor.segment}</p>
            </div>
          </div>
        </div>

        {debtor.address && (debtor.address.city || debtor.address.state) && (
          <div className="flex items-center gap-2 text-sm text-slate-600 pt-3 border-t border-white/50">
            <MapPin className="size-4" />
            <span>{debtor.address.city}{debtor.address.state && `, ${debtor.address.state}`}</span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// Debtors Table Component
function DebtorsTable({ debtors, onEdit, onDelete, onSendCollection, onNegotiate }: any) {
  return (
    <GlassCard variant="default" hover={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/30 backdrop-blur-sm border-b-2 border-white/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Contato</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Dívida</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Score</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {debtors.map((debtor: Debtor, index: number) => (
              <motion.tr
                key={debtor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-white/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{debtor.name}</p>
                    <p className="text-sm text-slate-600">{debtor.document}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-slate-700">
                      <Mail className="size-3.5" />
                      <span className="truncate max-w-[200px]">{debtor.email || '-'}</span>
                    </div>
                    {debtor.phone && (
                      <div className="flex items-center gap-1 text-sm text-slate-700">
                        <Phone className="size-3.5" />
                        <span>{debtor.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">€{debtor.debtAmount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{debtor.category}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          debtor.paymentScore >= 70 ? 'bg-green-500' : 
                          debtor.paymentScore >= 40 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${debtor.paymentScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-8">{debtor.paymentScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    debtor.status === 'active' ? 'bg-blue-500/20 text-blue-700' :
                    debtor.status === 'negotiating' ? 'bg-yellow-500/20 text-yellow-700' :
                    debtor.status === 'paid' ? 'bg-green-500/20 text-green-700' :
                    'bg-red-500/20 text-red-700'
                  }`}>
                    {debtor.status === 'active' ? 'Ativo' :
                     debtor.status === 'negotiating' ? 'Negociação' :
                     debtor.status === 'paid' ? 'Pago' : 'Judicial'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onNegotiate(debtor)}
                      className="size-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors mr-2 text-emerald-600"
                      title="Negociar Acordo"
                    >
                      <Handshake className="size-4" />
                    </button>
                    <button
                      onClick={() => onSendCollection(debtor)}
                      className="size-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors mr-2 text-indigo-600"
                      title="Enviar Cobrança"
                    >
                      <Mail className="size-4" />
                    </button>
                    <button
                      onClick={() => onEdit(debtor)}
                      className="size-8 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="size-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => onDelete(debtor)}
                      className="size-8 rounded-lg bg-white/50 hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

// Continue no próximo arquivo...