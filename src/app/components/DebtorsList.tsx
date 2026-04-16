import { useState, useEffect } from 'react';
import { Search, Plus, Filter, TrendingUp, TrendingDown, Mail, MessageSquare, Phone } from 'lucide-react';
import { getDebtors } from '../../utils/supabase';

export default function DebtorsList({ session }: { session: any }) {
  const [debtors, setDebtors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDebtors();
  }, []);

  async function loadDebtors() {
    try {
      const data = await getDebtors(session.access_token);
      setDebtors(data.debtors || []);
    } catch (error) {
      console.error('Error loading debtors:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDebtors = debtors.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Devedores</h1>
          <p className="text-slate-600 mt-1">Gerencie sua carteira de cobrança</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
          <Plus className="size-5" />
          Adicionar Devedor
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <Filter className="size-5" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Valor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Atraso</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Carregando devedores...
                </td>
              </tr>
            ) : filteredDebtors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Nenhum devedor encontrado. Adicione o primeiro!
                </td>
              </tr>
            ) : (
              filteredDebtors.map((debtor, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{debtor.name}</p>
                      <p className="text-sm text-slate-500">{debtor.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    €{debtor.debtAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {debtor.daysOverdue || 0} dias
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={debtor.score || 50} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={debtor.status || 'active'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MessageSquare className="size-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Mail className="size-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Phone className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 70) return 'bg-green-100 text-green-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getColor()}`}>
        {score}%
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    active: { label: 'Ativo', color: 'bg-blue-100 text-blue-700' },
    negotiating: { label: 'Negociando', color: 'bg-purple-100 text-purple-700' },
    paid: { label: 'Pago', color: 'bg-green-100 text-green-700' },
    defaulted: { label: 'Inadimplente', color: 'bg-red-100 text-red-700' }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}