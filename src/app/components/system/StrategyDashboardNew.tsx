import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  Search, 
  BarChart3,
  Users, 
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronDown,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  calculateProjectMetrics, 
  getAllFeatures,
  getRecentlyCompletedFeatures,
  getCriticalPendingFeatures 
} from '../../utils/projectStatusDetector';

// --- CENÁRIOS DE PROJEÇÃO ---
type ScenarioType = 'pessimista' | 'realista' | 'otimista' | 'super_otimista';

interface ScenarioData {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  assumptions: {
    userGrowth: number;
    churn: number;
    arpu: number;
    cac: number;
    conversionRate: number;
  };
}

const scenarios: Record<ScenarioType, ScenarioData> = {
  pessimista: {
    name: 'Pessimista',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <ArrowDownRight className="size-5" />,
    description: 'Crescimento lento, alta competição',
    assumptions: {
      userGrowth: 8,
      churn: 4,
      arpu: 28,
      cac: 95,
      conversionRate: 2,
    }
  },
  realista: {
    name: 'Realista',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <Minus className="size-5" />,
    description: 'Crescimento moderado, equilibrado',
    assumptions: {
      userGrowth: 15,
      churn: 4,
      arpu: 42,
      cac: 65,
      conversionRate: 4,
    }
  },
  otimista: {
    name: 'Otimista',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: <ArrowUpRight className="size-5" />,
    description: 'Crescimento forte, boa tração',
    assumptions: {
      userGrowth: 25,
      churn: 3,
      arpu: 58,
      cac: 45,
      conversionRate: 6,
    }
  },
  super_otimista: {
    name: 'Super Otimista',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: <Zap className="size-5" />,
    description: 'Crescimento viral, PMF perfeito',
    assumptions: {
      userGrowth: 40,
      churn: 2,
      arpu: 72,
      cac: 30,
      conversionRate: 9,
    }
  }
};

// Gerar dados
const generateScenarioData = (scenario: ScenarioType) => {
  const assumptions = scenarios[scenario].assumptions;
  const data = [];
  let users = 0; // Começar do ZERO (pré-lançamento)
  
  // INICIANDO EM MAIO DE 2026
  const monthNames = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'];
  
  for (let month = 1; month <= 12; month++) {
    // Primeiros 3 meses: fase de aquisição inicial (early adopters)
    // Depois: crescimento baseado nos assumptions
    let newUsers = 0;
    
    if (month === 1) {
      // Maio 2026: Lançamento beta - primeiros early adopters
      newUsers = scenario === 'pessimista' ? 2 : scenario === 'realista' ? 5 : scenario === 'otimista' ? 10 : 15;
    } else if (month === 2) {
      // Junho 2026: Primeiras semanas ativas
      newUsers = scenario === 'pessimista' ? 3 : scenario === 'realista' ? 8 : scenario === 'otimista' ? 15 : 25;
    } else if (month === 3) {
      // Julho 2026: Ajustes de PMF
      newUsers = scenario === 'pessimista' ? 5 : scenario === 'realista' ? 12 : scenario === 'otimista' ? 20 : 35;
    } else {
      // A partir de Agosto 2026: crescimento baseado na base existente
      newUsers = users * (assumptions.userGrowth / 100);
    }
    
    const lostUsers = users * (assumptions.churn / 100);
    users = Math.floor(users + newUsers - lostUsers);
    
    if (users < 0) users = 0;
    
    const revenue = users * assumptions.arpu;
    
    // CUSTOS FIXOS REAIS (Bootstrap - Modo Sobrevivência)
    // Fase 1 (M1-M6): Supabase Free, custos mínimos
    // Fase 2 (M7-M12): Upgrade para Supabase Pro quando necessário
    let supabaseCost = 0;
    let toolsCost = 0;
    
    if (month <= 6) {
      // Primeiros 6 meses: Supabase Free (500MB, 50k requests = suficiente)
      supabaseCost = 0;
      toolsCost = 0; // Usar tiers gratuitos (Resend Free, etc)
    } else if (month <= 9) {
      // Meses 7-9: Ainda no Free se der, senão Pro
      supabaseCost = users > 30 ? 25 : 0; // Só upgrade se crescer
      toolsCost = 0;
    } else {
      // Meses 10-12: Pro obrigatório (escala)
      supabaseCost = 25;
      toolsCost = 5; // Ferramentas adicionais
    }
    
    const domainHosting = 10; // Domínio obrigatório
    const fixedCosts = supabaseCost + domainHosting + toolsCost;
    
    // CUSTOS VARIÁVEIS POR CLIENTE (Usar Tiers Gratuitos)
    // Fase 1 (M1-M6): Só APIs gratuitas
    // Fase 2 (M7-M12): APIs pagas conforme escala
    let variableCostPerUser = 0;
    
    if (month <= 6) {
      // Primeiros 6 meses: Modo econômico
      // - Email: Resend Free (3k/mês) = €0
      // - WhatsApp: Meta Free tier ou SMS mínimo = €0.30/cliente
      // - IA: Groq Free (30 req/min) ou GPT-3.5-turbo = €0.50/cliente
      variableCostPerUser = 0.80; // €0.80/cliente (mínimo absoluto)
    } else if (month <= 9) {
      // Meses 7-9: Adicionar algumas APIs pagas
      variableCostPerUser = 1.50; // €1.50/cliente
    } else {
      // Meses 10-12: Full stack pago
      variableCostPerUser = 2.50; // €2.50/cliente
    }
    
    const variableCosts = users * variableCostPerUser;
    
    // CUSTO DE AQUISIÇÃO (CAC) - 100% ORGÂNICO até M6
    // Bootstrap = ZERO budget de marketing inicialmente
    let cacMultiplier = 0;
    
    if (month <= 6) {
      // Primeiros 6 meses: 100% ORGÂNICO (LinkedIn, network, indicações)
      cacMultiplier = 0; // CAC = €0
    } else if (month <= 9) {
      // Meses 7-9: Micro budget (€50-100/mês) = ~10% do CAC teórico
      cacMultiplier = 0.15;
    } else {
      // Meses 10-12: Budget real mas ainda controlado
      cacMultiplier = 0.40; // 40% do CAC teórico
    }
    
    const acquisitionCost = newUsers * (assumptions.cac * cacMultiplier);
    const totalCosts = fixedCosts + variableCosts + acquisitionCost;
    
    const profit = revenue - totalCosts;
    const margin = revenue > 0 ? ((profit / revenue) * 100) : -100;
    
    data.push({
      month: `M${month}`,
      monthName: monthNames[month - 1],
      monthYear: month <= 8 ? `${monthNames[month - 1]} 26` : `${monthNames[month - 1]} 27`,
      users,
      newUsers: Math.floor(newUsers),
      churnedUsers: Math.floor(lostUsers),
      revenue: Math.floor(revenue),
      costs: Math.floor(totalCosts),
      fixedCosts,
      variableCosts: Math.floor(variableCosts),
      acquisitionCost: Math.floor(acquisitionCost),
      profit: Math.floor(profit),
      margin: Math.round(margin),
      arpu: assumptions.arpu,
      ltv: Math.floor((assumptions.arpu / (assumptions.churn / 100))),
      cac: assumptions.cac
    });
  }
  
  return data;
};

const calculateYearTotals = (data: any[]) => {
  const totalRevenue = data.reduce((acc, m) => acc + m.revenue, 0);
  const totalCosts = data.reduce((acc, m) => acc + m.costs, 0);
  const totalProfit = totalRevenue - totalCosts;
  const finalUsers = data[data.length - 1].users;
  const finalMRR = data[data.length - 1].revenue;
  const avgMargin = Math.round((totalProfit / totalRevenue) * 100);
  
  return {
    totalRevenue,
    totalCosts,
    totalProfit,
    finalUsers,
    finalMRR,
    avgMargin
  };
};

export default function StrategyDashboard() {
  const [activeTab, setActiveTab] = useState<'financial' | 'swot' | 'benchmark'>('financial');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planeamento Estratégico</h1>
          <p className="text-slate-500">Projeções Mai 2026 - Abr 2027 • Análise de Mercado Portugal</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'financial' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Financeiro
          </button>
          <button
            onClick={() => setActiveTab('swot')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'swot' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Análise SWOT
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'benchmark' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Benchmarking
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'financial' && <FinancialView />}
        {activeTab === 'swot' && <SwotView />}
        {activeTab === 'benchmark' && <BenchmarkView />}
      </motion.div>
    </div>
  );
}

// --- FINANCIAL VIEW ---
function FinancialView() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('realista');
  const [scenarioData, setScenarioData] = useState(generateScenarioData('realista'));
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    setScenarioData(generateScenarioData(selectedScenario));
  }, [selectedScenario]);

  const totals = calculateYearTotals(scenarioData);
  const currentScenario = scenarios[selectedScenario];
  const lastMonth = scenarioData[scenarioData.length - 1];
  const firstMonth = scenarioData[0];

  // Função para gerar PDF completo
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // ========== CAPA ==========
    doc.setFillColor(67, 56, 202); // indigo-600
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Tá Pago.pt', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Planeamento Estratégico Completo', pageWidth / 2, 40, { align: 'center' });
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(11);
    doc.text('Projeções Mai 2026 - Abr 2027 | Mercado Portugal', pageWidth / 2, 50, { align: 'center' });

    yPosition = 70;

    // ========== STATUS DO PROJETO ==========
    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Status do Projeto', 14, yPosition);
    yPosition += 10;

    const projectMetrics = calculateProjectMetrics();
    const allFeatures = getAllFeatures();
    const recentFeatures = getRecentlyCompletedFeatures(5);
    const criticalFeatures = getCriticalPendingFeatures();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    
    // Métricas principais
    doc.text(`Progresso Geral: ${projectMetrics.overallProgress}% (${projectMetrics.completedFeatures} de ${projectMetrics.totalFeatures} features)`, 14, yPosition);
    yPosition += 6;
    doc.text(`Frontend: ${projectMetrics.frontendProgress}% | Backend: ${projectMetrics.backendProgress}% | Fase: ${projectMetrics.currentPhase}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Features Críticas Pendentes: ${projectMetrics.criticalFeatures} | Dias Estimados: ${projectMetrics.estimatedDaysRemaining}`, 14, yPosition);
    yPosition += 10;

    // Tabela de Features Recentes
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('✅ Funcionalidades Completadas Recentemente:', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Feature', 'Categoria', 'Prioridade', 'Data']],
      body: recentFeatures.map(f => [
        f.name,
        f.category === 'frontend' ? 'Frontend' : f.category === 'backend' ? 'Backend' : 'Integração',
        f.priority === 'critical' ? 'CRÍTICA' : f.priority === 'high' ? 'Alta' : 'Média',
        f.completedDate || '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Features Críticas Pendentes
    if (criticalFeatures.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('⚠️ Features Críticas Pendentes:', 14, yPosition);
      yPosition += 6;

      autoTable(doc, {
        startY: yPosition,
        head: [['Feature', 'Descrição', 'Categoria']],
        body: criticalFeatures.map(f => [
          f.name,
          f.description,
          f.category === 'integration' ? 'Integração' : f.category === 'backend' ? 'Backend' : 'Frontend'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        margin: { left: 14, right: 14 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Nova página para dados financeiros
    doc.addPage();
    yPosition = 20;

    // ========== PROJEÇÕES FINANCEIRAS ==========
    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('💰 Projeções Financeiras - Todos os Cenários', 14, yPosition);
    yPosition += 12;

    // Gerar dados para todos os cenários
    const allScenarios = Object.keys(scenarios) as ScenarioType[];
    
    for (const scenarioKey of allScenarios) {
      const scenario = scenarios[scenarioKey];
      const data = generateScenarioData(scenarioKey);
      const scenarioTotals = calculateYearTotals(data);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(67, 56, 202);
      doc.text(`Cenário ${scenario.name}: ${scenario.description}`, 14, yPosition);
      yPosition += 8;

      // Métricas resumidas
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Receita Total: €${scenarioTotals.totalRevenue.toLocaleString()} | Custos: €${scenarioTotals.totalCosts.toLocaleString()} | Lucro: €${scenarioTotals.totalProfit.toLocaleString()}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Clientes Finais: ${scenarioTotals.finalUsers} | MRR Final: €${scenarioTotals.finalMRR.toLocaleString()} | Margem: ${scenarioTotals.avgMargin}%`, 14, yPosition);
      yPosition += 8;

      // Tabela mensal detalhada
      autoTable(doc, {
        startY: yPosition,
        head: [['Mês', 'Clientes', 'Novos', 'Churn', 'Receita (€)', 'Custos (€)', 'Lucro (€)', 'Margem']],
        body: data.map(m => [
          `${m.monthName} ${m.monthYear}`,
          m.users.toString(),
          `+${m.newUsers}`,
          `-${m.churnedUsers}`,
          `€${m.revenue.toLocaleString()}`,
          `€${m.costs.toLocaleString()}`,
          `€${m.profit.toLocaleString()}`,
          `${m.margin}%`
        ]),
        theme: 'striped',
        headStyles: { 
          fillColor: scenarioKey === 'pessimista' ? [239, 68, 68] : 
                     scenarioKey === 'realista' ? [59, 130, 246] :
                     scenarioKey === 'otimista' ? [16, 185, 129] : [147, 51, 234],
          textColor: [255, 255, 255],
          fontSize: 8
        },
        bodyStyles: { fontSize: 7, textColor: [51, 65, 85] },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { halign: 'right', cellWidth: 16 },
          2: { halign: 'right', cellWidth: 12 },
          3: { halign: 'right', cellWidth: 12 },
          4: { halign: 'right', cellWidth: 22 },
          5: { halign: 'right', cellWidth: 22 },
          6: { halign: 'right', cellWidth: 22 },
          7: { halign: 'right', cellWidth: 15 }
        },
        margin: { left: 14, right: 14 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;

      // Nova página se necessário
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
    }

    // ========== ANÁLISE SWOT ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('🎯 Análise SWOT Completa', 14, yPosition);
    yPosition += 12;

    // Forças
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text('💪 Forças (Strengths)', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Força', 'Descrição']],
      body: swotData.strengths.map(item => [item.title, item.desc]),
      theme: 'plain',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      margin: { left: 14, right: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Fraquezas
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('⚠️ Fraquezas (Weaknesses)', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Fraqueza', 'Descrição']],
      body: swotData.weaknesses.map(item => [item.title, item.desc]),
      theme: 'plain',
      headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      margin: { left: 14, right: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Oportunidades
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('🚀 Oportunidades (Opportunities)', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Oportunidade', 'Descrição']],
      body: swotData.opportunities.map(item => [item.title, item.desc]),
      theme: 'plain',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      margin: { left: 14, right: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Ameaças
    doc.setFontSize(12);
    doc.setTextColor(239, 68, 68);
    doc.text('🛡️ Ameaças (Threats)', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Ameaça', 'Descrição']],
      body: swotData.threats.map(item => [item.title, item.desc]),
      theme: 'plain',
      headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 130 } },
      margin: { left: 14, right: 14 }
    });

    // ========== BENCHMARKING ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Análise Competitiva - Benchmarking', 14, yPosition);
    yPosition += 12;

    autoTable(doc, {
      startY: yPosition,
      head: [['Player', 'Custo Médio', 'Foco Principal', 'Automação/IA', 'Experiência UX']],
      body: competitors.map(comp => [
        comp.name + (comp.highlight ? ' ⭐' : ''),
        comp.price,
        comp.focus,
        comp.automation,
        comp.ux
      ]),
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 }
      },
      margin: { left: 14, right: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Rodapé em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Tá Pago.pt - Planeamento Estratégico | Página ${i} de ${totalPages} | Gerado em ${new Date().toLocaleDateString('pt-PT')}`, 
        pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Salvar PDF
    doc.save(`TaPago-Planeamento-Estrategico-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Busca e Download */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar no planeamento estratégico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <Button 
          onClick={generatePDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Download className="size-4" />
          Exportar PDF Completo
        </Button>
      </div>

      {/* Seletor de Cenários - Compacto */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(scenarios) as ScenarioType[]).map((key) => {
          const scenario = scenarios[key];
          const isActive = selectedScenario === key;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                isActive 
                  ? `${scenario.borderColor} ${scenario.bgColor} shadow-lg`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`${scenario.color} text-lg`}>{scenario.icon}</div>
                <h3 className={`font-bold text-sm ${isActive ? scenario.color : 'text-slate-900'}`}>
                  {scenario.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500">{scenario.description}</p>
            </button>
          );
        })}
      </div>

      {/* Card Principal */}
      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Crescimento de Receita vs Custos</CardTitle>
          <CardDescription className="text-base">
            Projeção Mai 2026 - Abr 2027 • Cenário <span className={currentScenario.color + " font-semibold"}>{currentScenario.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 4 Cards Principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Receita Total */}
            <div className="relative bg-white rounded-2xl p-5 shadow-md border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
              <div className="text-sm font-medium text-slate-600 mb-1">
                Receita Total (12m)
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                €{totals.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                MRR Final: €{totals.finalMRR.toLocaleString()}
              </div>
            </div>

            {/* Custos Totais */}
            <div className="relative bg-white rounded-2xl p-5 shadow-md border-l-4 border-l-slate-400 hover:shadow-lg transition-shadow">
              <div className="text-sm font-medium text-slate-600 mb-1">
                Custos Totais (12m)
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                €{totals.totalCosts.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                Média mensal: €{Math.round(totals.totalCosts / 12).toLocaleString()}
              </div>
            </div>

            {/* Lucro Acumulado */}
            <div className="relative bg-white rounded-2xl p-5 shadow-md border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <div className="text-sm font-medium text-slate-600 mb-1">
                Lucro Acumulado
              </div>
              <div className={`text-3xl font-bold mb-1 ${totals.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {totals.totalProfit >= 0 ? '€' : '-€'}{Math.abs(totals.totalProfit).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                Margem: {totals.avgMargin}%
              </div>
            </div>

            {/* Eficiência LTV/CAC */}
            <div className="relative bg-white rounded-2xl p-5 shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <div className="text-sm font-medium text-slate-600 mb-1">
                Eficiência (LTV/CAC)
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {(lastMonth.ltv / lastMonth.cac).toFixed(1)}x
              </div>
              <div className="text-xs text-slate-500">
                Payback: {Math.ceil(currentScenario.assumptions.cac / currentScenario.assumptions.arpu)} meses
              </div>
            </div>
          </div>

          {/* Métricas Compactas */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Clientes</div>
              <div className="text-xl font-bold text-slate-900">{firstMonth.users}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">LTV</div>
              <div className="text-xl font-bold text-slate-900">€{lastMonth.ltv}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">ARPU</div>
              <div className="text-xl font-bold text-slate-900">€{currentScenario.assumptions.arpu}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">CAC</div>
              <div className="text-xl font-bold text-slate-900">€{currentScenario.assumptions.cac}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Churn</div>
              <div className="text-xl font-bold text-red-600">{currentScenario.assumptions.churn}%</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Conversão</div>
              <div className="text-xl font-bold text-slate-900">{currentScenario.assumptions.conversionRate}%</div>
            </div>
          </div>

          {/* 2 Gráficos Lado a Lado */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Projeção Financeira Mensal */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Projeção Financeira Mensal</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
                    <XAxis 
                      dataKey="monthName" 
                      axisLine={false}
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 11}} 
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 11}} 
                      tickFormatter={(val) => `€${(val/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => `€${value.toLocaleString()}`}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="plainline"
                      iconSize={16}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Receita (€)" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="costs" 
                      name="Custos (€)" 
                      stroke="#ef4444" 
                      strokeWidth={3} 
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Evolução da Base de Clientes */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Evolução da Base de Clientes</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
                    <XAxis 
                      dataKey="monthName" 
                      axisLine={false}
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 11}} 
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 11}}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [value, 'Clientes']}
                      cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    />
                    <Bar 
                      dataKey="users" 
                      fill="#3b82f6" 
                      radius={[6, 6, 0, 0]}
                      label={{ 
                        position: 'top', 
                        fill: '#1e293b', 
                        fontSize: 11, 
                        fontWeight: 600 
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Detalhada (Colapsável) */}
      <details className="group">
        <summary className="cursor-pointer bg-white rounded-xl p-4 shadow-md border border-slate-200 hover:shadow-lg transition-all list-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="size-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Ver Detalhamento Mês a Mês</h3>
              <Badge variant="secondary" className="text-xs">12 meses</Badge>
            </div>
            <ChevronDown className="size-5 text-slate-400 group-open:rotate-180 transition-transform" />
          </div>
        </summary>
        
        <Card className="mt-4 border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Mês</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Clientes</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Novos</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Churn</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Receita</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Custo Total</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Lucro</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {scenarioData.map((month) => (
                    <tr key={month.month} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900">{month.monthName}</span>
                        <span className="text-xs text-slate-500 ml-2">{month.monthYear}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{month.users}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-medium">+{month.newUsers}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">-{month.churnedUsers}</td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-600">€{month.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-rose-600">€{month.costs.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-bold ${month.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        €{month.profit.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          month.margin >= 30 ? 'bg-emerald-100 text-emerald-800' :
                          month.margin >= 0 ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {month.margin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </details>
    </div>
  );
}

// --- SWOT VIEW ---
const swotData = {
  strengths: [
    { title: "UX/UI 'Ethereal Premium'", desc: "Diferenciação visual forte vs. software tradicional." },
    { title: "IA Nativa", desc: "Recuperação preditiva inexistente nos concorrentes." },
    { title: "Preço de Entrada", desc: "Plano gratuito remove barreira de entrada." },
    { title: "Stack Moderna", desc: "Iteração 5x mais rápida que legados." }
  ],
  weaknesses: [
    { title: "Reconhecimento de Marca", desc: "Trust factor financeiro demora a construir." },
    { title: "Funcionalidades ERP", desc: "Foco apenas em dívida, sem gestão completa." },
    { title: "Dependência de APIs", desc: "Custo variável alto reduz margem." }
  ],
  opportunities: [
    { title: "Crise Económica", desc: "Aumento da inadimplência gera procura urgente." },
    { title: "Integração ERP", desc: "Ser plugin para Moloni/InvoiceXpress." },
    { title: "Mercado B2B", desc: "Empresas aceitam pagar €149+ facilmente." },
    { title: "Internacionalização", desc: "Modelo replicável para ES/BR." }
  ],
  threats: [
    { title: "Clones de IA", desc: "Concorrentes grandes lançarem IA própria." },
    { title: "Regulação (IA Act)", desc: "Restrições UE sobre uso de IA." },
    { title: "Bloqueio WhatsApp", desc: "Meta alterar políticas de cobrança." }
  ]
};

function SwotView() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-l-4 border-l-emerald-500 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-600">
            <Zap className="w-5 h-5" />
            <CardTitle>Forças (Strengths)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {swotData.strengths.map((item, idx) => (
            <div key={idx} className="bg-emerald-50/50 p-3 rounded-lg">
              <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-orange-600">
            <Search className="w-5 h-5" />
            <CardTitle>Fraquezas (Weaknesses)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {swotData.weaknesses.map((item, idx) => (
            <div key={idx} className="bg-orange-50/50 p-3 rounded-lg">
              <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-blue-600">
            <Globe className="w-5 h-5" />
            <CardTitle>Oportunidades (Opportunities)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {swotData.opportunities.map((item, idx) => (
            <div key={idx} className="bg-blue-50/50 p-3 rounded-lg">
              <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="w-5 h-5" />
            <CardTitle>Ameaças (Threats)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {swotData.threats.map((item, idx) => (
            <div key={idx} className="bg-red-50/50 p-3 rounded-lg">
              <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// --- BENCHMARK VIEW ---
const competitors = [
  { name: "Tá Pago.pt", price: "€24 - €149", focus: "Recuperação Ativa & IA", ux: "Premium/Modern", automation: "Alta (IA + Réguas)", highlight: true },
  { name: "InvoiceXpress", price: "€15 - €50", focus: "Faturação Certificada", ux: "Bom/Funcional", automation: "Baixa (Lembretes)", highlight: false },
  { name: "Intrum/Advogados", price: "10% - 20% dívida", focus: "Cobrança Jurídica", ux: "Nenhum (Serviço)", automation: "Manual/Humana", highlight: false },
  { name: "Moloni", price: "€10 - €40", focus: "POS & Gestão Comercial", ux: "Tradicional", automation: "Média (Plugins)", highlight: false }
];

function BenchmarkView() {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle>Análise Competitiva - Portugal</CardTitle>
        <CardDescription>Posicionamento vs Principais Players</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Player</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Custo Médio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Foco Principal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Automação/IA</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Experiência (UX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competitors.map((comp, idx) => (
                <tr key={idx} className={comp.highlight ? "bg-indigo-50/30" : "hover:bg-slate-50/50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {comp.highlight && <Zap className="w-4 h-4 text-indigo-600"/>}
                      <span className={`font-medium ${comp.highlight ? 'text-indigo-900' : 'text-slate-900'}`}>{comp.name}</span>
                      {comp.highlight && <Badge className="bg-indigo-600 text-[10px]">Você</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{comp.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{comp.focus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={comp.automation.includes("Alta") ? "default" : "secondary"} className={comp.automation.includes("Alta") ? "bg-emerald-100 text-emerald-700" : ""}>
                      {comp.automation}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{comp.ux}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}