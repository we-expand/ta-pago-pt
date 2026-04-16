import { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  HandCoins, 
  PieChart, 
  AlertCircle,
  ArrowRight,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import PaymentAgreementModal from './PaymentAgreementModal';
import SettlementSimulator from './SettlementSimulator';

// --- Tipos ---

interface Debt {
  id: string;
  entity: string;
  originalAmount: number;
  dueDate: string;
  status: 'overdue' | 'pending';
  category: string;
  logo: string;
  // Mapeando campos para o modal
  name: string; // Para compatibilidade com PaymentAgreementModal
  debtAmount: number; // Para compatibilidade com PaymentAgreementModal
}

interface Installment {
  number: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface Agreement {
  id: string;
  debtId: string;
  entity: string;
  totalAgreementAmount: number;
  installments: number;
  installmentsPaid: number;
  nextDueDate: string;
  status: 'active' | 'completed' | 'defaulted';
  plan: Installment[];
  createdAt: string;
}

// --- Dados Mockados ---

const MOCK_DEBTS: Debt[] = [
  {
    id: 'd1',
    entity: 'Cegid Primavera',
    name: 'Cegid Primavera',
    originalAmount: 1250.00,
    debtAmount: 1250.00,
    dueDate: '2024-12-15',
    status: 'overdue',
    category: 'Software',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cegid_Logo.svg/1200px-Cegid_Logo.svg.png'
  },
  {
    id: 'd2',
    entity: 'Vodafone Empresas',
    name: 'Vodafone Empresas',
    originalAmount: 450.50,
    debtAmount: 450.50,
    dueDate: '2024-12-20',
    status: 'pending',
    category: 'Comunicação',
    logo: 'https://asset.brandfetch.io/idUn_3sX2r/idx1-wL5s1.svg'
  },
  {
    id: 'd3',
    entity: 'Autoridade Tributária',
    name: 'Autoridade Tributária',
    originalAmount: 2800.00,
    debtAmount: 2800.00,
    dueDate: '2024-11-30',
    status: 'overdue',
    category: 'Impostos',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Coat_of_arms_of_Portugal.svg/1200px-Coat_of_arms_of_Portugal.svg.png'
  }
];

const MOCK_AGREEMENTS: Agreement[] = [
  {
    id: 'a1',
    debtId: 'd_old_1',
    entity: 'Segurança Social',
    totalAgreementAmount: 3000.00,
    installments: 6,
    installmentsPaid: 2,
    nextDueDate: '2025-01-10',
    status: 'active',
    createdAt: '2024-10-10',
    plan: [
      { number: 1, amount: 500, dueDate: '2024-11-10', status: 'paid' },
      { number: 2, amount: 500, dueDate: '2024-12-10', status: 'paid' },
      { number: 3, amount: 500, dueDate: '2025-01-10', status: 'pending' },
      { number: 4, amount: 500, dueDate: '2025-02-10', status: 'pending' },
      { number: 5, amount: 500, dueDate: '2025-03-10', status: 'pending' },
      { number: 6, amount: 500, dueDate: '2025-04-10', status: 'pending' },
    ]
  },
  {
    id: 'a2',
    debtId: 'd_old_2',
    entity: 'NOS Empresas',
    totalAgreementAmount: 1200.00,
    installments: 12,
    installmentsPaid: 12,
    nextDueDate: '2024-12-01',
    status: 'completed',
    createdAt: '2023-12-01',
    plan: []
  }
];

export default function PaymentAgreements({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState<'debts' | 'agreements'>('debts');
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [settlementDebt, setSettlementDebt] = useState<Debt | null>(null);
  
  // Dados
  const [debts, setDebts] = useState<Debt[]>(MOCK_DEBTS);
  const [agreements, setAgreements] = useState<Agreement[]>(MOCK_AGREEMENTS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAgreementSuccess = () => {
    // Na prática, recarregaríamos os dados do backend.
    // Aqui vamos simular a movimentação
    if (selectedDebt) {
      // Remover da lista de dívidas
      setDebts(debts.filter(d => d.id !== selectedDebt.id));
      
      // Adicionar aos acordos (Mock)
      const newAgreement: Agreement = {
        id: `agr_${Date.now()}`,
        debtId: selectedDebt.id,
        entity: selectedDebt.entity,
        totalAgreementAmount: selectedDebt.originalAmount, // Simplificado
        installments: 3, // Padrão
        installmentsPaid: 0,
        nextDueDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
        status: 'active',
        plan: [],
        createdAt: new Date().toISOString()
      };
      
      setAgreements([newAgreement, ...agreements]);
      setSelectedDebt(null);
      setActiveTab('agreements');
    }
  };

  const filteredDebts = debts.filter(d => 
    d.entity.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgreements = agreements.filter(a => 
    a.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <HandCoins className="size-8 text-indigo-600" />
            Gestor de Acordos
          </h1>
          <p className="text-slate-600 mt-2 text-lg max-w-2xl">
            Centralize suas negociações, automatize parcelamentos e recupere o controle do fluxo de caixa.
          </p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full xl:w-auto">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <FileText className="size-5" />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Em Acordos</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(
                agreements.filter(a => a.status === 'active').reduce((acc, curr) => acc + curr.totalAgreementAmount, 0)
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp className="size-5" />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recuperado</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(
                agreements.reduce((acc, curr) => acc + (curr.installmentsPaid / curr.installments * curr.totalAgreementAmount), 0)
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertCircle className="size-5" />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {debts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'debts' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <AlertCircle className="size-4" />
            Dívidas Elegíveis
            <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs ml-1">
              {debts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('agreements')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'agreements' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <ShieldCheck className="size-4" />
            Acordos Ativos
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-xs ml-1">
              {agreements.filter(a => a.status === 'active').length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por entidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'debts' ? (
            <motion.div
              key="debts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDebts.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/50 rounded-3xl border border-dashed border-slate-300">
                  <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="size-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Tudo limpo!</h3>
                  <p className="text-slate-500 mt-2 max-w-md">
                    Não encontramos dívidas elegíveis para negociação com os filtros atuais.
                  </p>
                </div>
              ) : (
                filteredDebts.map(debt => (
                  <motion.div 
                    layout
                    key={debt.id} 
                    className="group bg-white rounded-3xl border border-slate-200 p-1 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="p-5 flex flex-col h-full">
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="size-14 bg-slate-50 rounded-2xl p-2 border border-slate-100 flex items-center justify-center">
                          <img src={debt.logo} alt={debt.entity} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        {debt.status === 'overdue' && (
                          <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-100 uppercase tracking-wide">
                            Vencida
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{debt.entity}</h3>
                          <p className="text-slate-500 text-sm">{debt.category}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Valor Atual</span>
                             <span className="font-bold text-slate-900 text-base">
                               {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(debt.originalAmount)}
                             </span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Vencimento</span>
                             <span className="font-medium text-rose-500">
                               {format(new Date(debt.dueDate), 'dd MMM yyyy', { locale: pt })}
                             </span>
                           </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="mt-6 pt-4 flex gap-2">
                        <InteractiveButton 
                          onClick={() => setSettlementDebt(debt)}
                          className="flex-1 justify-center text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                          variant="outline"
                        >
                          Quitação
                        </InteractiveButton>
                        <InteractiveButton 
                          onClick={() => setSelectedDebt(debt)}
                          className="flex-[2] justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors"
                          variant="ghost"
                        >
                          Negociar
                          <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </InteractiveButton>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="agreements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {filteredAgreements.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/50 rounded-3xl border border-dashed border-slate-300">
                   <Ban className="size-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">Nenhum acordo ativo</h3>
                   <p className="text-slate-500">Comece negociando uma dívida na aba anterior.</p>
                </div>
              ) : (
                filteredAgreements.map(agreement => (
                  <div key={agreement.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Agreement Header */}
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className={`size-12 rounded-2xl flex items-center justify-center border ${
                          agreement.status === 'completed' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                            : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                        }`}>
                           {agreement.status === 'completed' ? <CheckCircle2 className="size-6" /> : <HandCoins className="size-6" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{agreement.entity}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                             <Calendar className="size-3.5" />
                             <span>Iniciado em {format(new Date(agreement.createdAt), 'dd de MMMM, yyyy', { locale: pt })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-1 w-full md:max-w-md">
                        <div className="flex justify-between text-sm mb-2">
                           <span className="font-semibold text-slate-700">Progresso do Pagamento</span>
                           <span className="font-bold text-indigo-600">
                             {Math.round((agreement.installmentsPaid / agreement.installments) * 100)}%
                           </span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(agreement.installmentsPaid / agreement.installments) * 100}%` }}
                             transition={{ duration: 1, ease: "easeOut" }}
                             className={`h-full rounded-full ${
                               agreement.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                             }`}
                           />
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                           <span>{agreement.installmentsPaid} pagas</span>
                           <span>{agreement.installments} parcelas total</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                         agreement.status === 'active' 
                           ? 'bg-blue-50 text-blue-700 border-blue-100'
                           : agreement.status === 'completed'
                           ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                           : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                         {agreement.status === 'active' && 'Em Andamento'}
                         {agreement.status === 'completed' && 'Concluído'}
                         {agreement.status === 'defaulted' && 'Em Atraso'}
                      </div>
                    </div>

                    {/* Agreement Details */}
                    {agreement.status === 'active' && (
                       <div className="p-6 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 bg-white rounded-2xl border border-slate-200">
                             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Valor Total</p>
                             <p className="text-lg font-bold text-slate-900">
                               {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(agreement.totalAgreementAmount)}
                             </p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-slate-200">
                             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Próximo Vencimento</p>
                             <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-indigo-500" />
                                <p className="text-lg font-bold text-indigo-600">
                                  {format(new Date(agreement.nextDueDate), 'dd MMM yyyy', { locale: pt })}
                                </p>
                             </div>
                          </div>
                          <div className="flex items-center">
                             <InteractiveButton variant="outline" className="w-full justify-center">
                                Ver Detalhes
                             </InteractiveButton>
                          </div>
                       </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Integration */}
      <AnimatePresence>
        {selectedDebt && (
          <PaymentAgreementModal 
            session={session}
            debtor={selectedDebt}
            onClose={() => setSelectedDebt(null)}
            onSuccess={handleAgreementSuccess}
          />
        )}
        {settlementDebt && (
          <SettlementSimulator 
            debtAmount={settlementDebt.originalAmount}
            daysOverdue={Math.floor((new Date().getTime() - new Date(settlementDebt.dueDate).getTime()) / (1000 * 3600 * 24))}
            onClose={() => setSettlementDebt(null)}
            onApply={(amount) => {
              // Simular quitação
              setDebts(debts.filter(d => d.id !== settlementDebt.id));
              setSettlementDebt(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}