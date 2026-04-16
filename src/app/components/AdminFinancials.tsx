import { 
  Euro, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Landmark, 
  Calendar, 
  AlertTriangle, 
  Download,
  PieChart,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const financialData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, ivaCollected: 10350, ivaDeductible: 4500 },
  { month: 'Fev', revenue: 52000, expenses: 34000, ivaCollected: 11960, ivaDeductible: 4800 },
  { month: 'Mar', revenue: 48000, expenses: 31000, ivaCollected: 11040, ivaDeductible: 4200 },
  { month: 'Abr', revenue: 61000, expenses: 35000, ivaCollected: 14030, ivaDeductible: 5100 },
  { month: 'Mai', revenue: 58000, expenses: 33000, ivaCollected: 13340, ivaDeductible: 4900 },
  { month: 'Jun', revenue: 75000, expenses: 38000, ivaCollected: 17250, ivaDeductible: 5500 },
];

const obligations = [
  { id: 1, title: 'Pagamento IVA (Trimestral)', entity: 'Autoridade Tributária', amount: 18450.00, dueDate: '2024-02-15', status: 'pending', type: 'tax' },
  { id: 2, title: 'TSU (Segurança Social)', entity: 'Seg. Social', amount: 3240.50, dueDate: '2024-01-20', status: 'paid', type: 'social' },
  { id: 3, title: 'IRC (Pagamento por Conta)', entity: 'Autoridade Tributária', amount: 4500.00, dueDate: '2024-03-31', status: 'upcoming', type: 'tax' },
  { id: 4, title: 'Infraestrutura Cloud (AWS)', entity: 'Fornecedor Ext.', amount: 1250.00, dueDate: '2024-01-30', status: 'pending', type: 'expense' },
];

export default function AdminFinancials() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Financeiro */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="size-6 text-indigo-600" />
            Gestão Financeira & Fiscal (PT)
          </h2>
          <p className="text-slate-500">Controlo de tesouraria, impostos e obrigações legais.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            <Download className="size-4" />
            Exportar SAFT-PT
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20">
            <FileText className="size-4" />
            Novo Movimento
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard 
          title="Receita Recorrente (MRR)" 
          value="€ 75,000" 
          change="+12.5%" 
          trend="up"
          icon={<Euro className="size-5 text-emerald-600" />}
          subtext="Baseado em 1,240 assinaturas ativas"
        />
        <KPICard 
          title="Previsão de IVA a Pagar" 
          value="€ 11,750" 
          change="+8.2%" 
          trend="down" // Down is bad for tax liability usually means more tax, but here context is metric movement
          negative // Red color because it's liability
          icon={<Building className="size-5 text-blue-600" />}
          subtext="IVA Liquidado - Dedutível (Trimestre)"
        />
        <KPICard 
          title="Lucro Líquido (EBITDA)" 
          value="€ 37,000" 
          change="+15.3%" 
          trend="up"
          icon={<TrendingUp className="size-5 text-indigo-600" />}
          subtext="Margem atual: 49%"
        />
        <KPICard 
          title="Custos Operacionais" 
          value="€ 38,000" 
          change="+5.1%" 
          trend="down" // Up means costs went up
          negative
          icon={<TrendingDown className="size-5 text-rose-600" />}
          subtext="Servidores, Pessoal e Licenças"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cashflow Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Fluxo de Caixa (Últimos 6 meses)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-600 outline-none focus:border-indigo-500">
              <option>1º Semestre 2024</option>
              <option>2º Semestre 2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `€${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`€ ${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="Receitas" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" name="Despesas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Obligations List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="size-4 text-indigo-600" />
            Obrigações & Impostos
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {obligations.map((obl) => (
              <div key={obl.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{obl.title}</p>
                    <p className="text-xs text-slate-500">{obl.entity}</p>
                  </div>
                  <Badge status={obl.status} />
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-medium text-slate-500">Vence: {new Date(obl.dueDate).toLocaleDateString('pt-PT')}</p>
                  <p className="font-bold text-slate-900">€ {obl.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors border border-dashed border-indigo-200">
            + Adicionar Obrigação Manual
          </button>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Apuramento de IVA (Trimestre Atual)</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">IVA Liquidado (Vendas)</p>
                  <p className="text-xl font-bold text-slate-900">€ 41,620.00</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Taxa média</p>
                <p className="font-medium text-blue-700">23%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <TrendingDown className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">IVA Dedutível (Compras)</p>
                  <p className="text-xl font-bold text-slate-900">€ 14,500.00</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Recuperável</p>
                <p className="font-medium text-emerald-700">100%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="font-bold text-slate-700">Total a Entregar ao Estado</p>
              <p className="text-2xl font-bold text-indigo-900">€ 27,120.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Estado das Contas Bancárias</h3>
          <div className="space-y-4">
            <BankAccount 
              bank="Millennium BCP" 
              account="PT50 0033 ... 1294" 
              balance={142500.50} 
              color="bg-rose-600"
            />
            <BankAccount 
              bank="Novo Banco" 
              account="PT50 0007 ... 9921" 
              balance={28300.20} 
              color="bg-emerald-600"
            />
             <BankAccount 
              bank="Revolut Business" 
              account="LT40 2200 ... 1122" 
              balance={5420.00} 
              color="bg-black"
            />
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
             <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
             <div>
               <p className="text-sm font-bold text-amber-800">Alerta de Conformidade</p>
               <p className="text-xs text-amber-700 mt-1">
                 O ficheiro SAFT-PT do mês passado ainda não foi submetido. O prazo termina dia 20.
               </p>
               <button className="mt-2 text-xs font-bold text-amber-900 underline">Resolver agora</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, trend, icon, subtext, negative }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
          trend === 'up' && !negative ? 'bg-emerald-50 text-emerald-700' : 
          trend === 'up' && negative ? 'bg-rose-50 text-rose-700' :
          trend === 'down' && negative ? 'bg-emerald-50 text-emerald-700' : // Down on negative metric is good
          'bg-rose-50 text-rose-700'
        }`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-xs text-slate-400">{subtext}</p>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const styles: any = {
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    late: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  const labels: any = {
    paid: 'Pago',
    pending: 'Pendente',
    upcoming: 'Agendado',
    late: 'Em Atraso'
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md border ${styles[status] || styles.pending}`}>
      {labels[status]}
    </span>
  );
}

function BankAccount({ bank, account, balance, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-lg ${color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          {bank.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{bank}</p>
          <p className="text-xs text-slate-500 font-mono">{account}</p>
        </div>
      </div>
      <p className="font-bold text-slate-900">€ {balance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
    </div>
  );
}