import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Database,
  Code,
  Brain,
  Globe,
  Shield,
  TrendingUp,
  Target,
  AlertCircle,
  Download,
  DollarSign,
  Package,
  Phone,
  Mail,
  CreditCard,
  MessageSquare,
  Users,
  Zap,
  ChevronRight,
  Award,
  Flag,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  calculateProjectMetrics, 
  getCriticalPendingFeatures
} from '../../utils/projectStatusDetector';

// Data atual: 8 de março de 2026
const TODAY = new Date('2026-03-08');

interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number; // dias úteis
  bufferDays: number; // gordura para imprevistos
  totalDays: number; // duração + buffer
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  icon: React.ReactNode;
  color: string;
  dependencies: string[];
  deliverables: string[];
  risks: string[];
  team: string[];
}

interface RevenueModel {
  type: 'subscription' | 'commission';
  name: string;
  description: string;
  estimatedValue: string;
  startPhase: string;
}

// Função auxiliar para adicionar dias úteis
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Pular fins de semana (0 = Domingo, 6 = Sábado)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }
  
  return result;
}

// Função para formatar data em PT-PT
function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Função para calcular meses de diferença
function getMonthsDiff(start: Date, end: Date): string {
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (months === 0) {
    return `${days} dias`;
  } else if (months === 1) {
    return '1 mês';
  } else {
    return `${months} meses`;
  }
}

export default function LaunchRoadmap() {
  const metrics = useMemo(() => calculateProjectMetrics(), []);
  const criticalPending = useMemo(() => getCriticalPendingFeatures(), []);

  // Modelos de Receita
  const revenueModels: RevenueModel[] = [
    {
      type: 'subscription',
      name: 'Assinaturas Mensais',
      description: 'Planos Starter (€24), Pro (€67) e Enterprise (€149) conforme landing page',
      estimatedValue: '€24 - €149/mês por cliente',
      startPhase: 'Lançamento Beta'
    },
    {
      type: 'commission',
      name: 'Comissão por Recuperação',
      description: 'Percentual sobre cada crédito recuperado com sucesso na plataforma',
      estimatedValue: '5% - 15% do valor recuperado',
      startPhase: 'Pós-Lançamento'
    }
  ];

  // Construir milestones com datas calculadas corretamente
  const milestones: Milestone[] = useMemo(() => {
    const phases: Milestone[] = [];
    
    // FASE 1: Fundação (JÁ COMPLETA)
    const phase1Start = new Date('2024-11-01');
    const phase1Duration = 45;
    const phase1Buffer = 15;
    const phase1End = addBusinessDays(phase1Start, phase1Duration + phase1Buffer);
    
    phases.push({
      id: 'foundation',
      name: 'Fase 1: Fundação & Infraestrutura',
      description: 'Autenticação, Database, Servidor, Layout Base',
      startDate: phase1Start,
      endDate: phase1End,
      duration: phase1Duration,
      bufferDays: phase1Buffer,
      totalDays: phase1Duration + phase1Buffer,
      status: 'completed',
      progress: 100,
      icon: <Database className="w-6 h-6" />,
      color: 'emerald',
      dependencies: [],
      deliverables: [
        'Sistema de autenticação completo',
        'Biometria WebAuthn funcionando',
        'Supabase integrado (Auth, DB, Storage)',
        'Servidor Hono com Edge Functions',
        'Layout responsivo do dashboard'
      ],
      risks: [],
      team: ['Backend', 'Frontend', 'DevOps']
    });

    // FASE 2: Core MVP (JÁ COMPLETA)
    const phase2Start = addBusinessDays(phase1End, 1);
    const phase2Duration = 25;
    const phase2Buffer = 10;
    const phase2End = addBusinessDays(phase2Start, phase2Duration + phase2Buffer);
    
    phases.push({
      id: 'core-mvp',
      name: 'Fase 2: Features Core do MVP',
      description: 'CRUD Devedores, Acordos, Simulador, Campanhas',
      startDate: phase2Start,
      endDate: phase2End,
      duration: phase2Duration,
      bufferDays: phase2Buffer,
      totalDays: phase2Duration + phase2Buffer,
      status: 'completed',
      progress: 100,
      icon: <Code className="w-6 h-6" />,
      color: 'blue',
      dependencies: ['foundation'],
      deliverables: [
        'Gestão completa de devedores (CRUD)',
        'Sistema de acordos de pagamento',
        'Simulador de quitação interativo',
        'Campanhas multicanal com timeline',
        'Localização PT-PT (200+ termos)',
        'Design System Ethereal'
      ],
      risks: [],
      team: ['Frontend', 'Backend', 'UX/UI']
    });

    // FASE 3: Agente de Voz IA (EM PROGRESSO - 65%)
    const phase3Start = addBusinessDays(phase2End, 1);
    const phase3Duration = 25;
    const phase3Buffer = 10;
    const phase3End = addBusinessDays(phase3Start, phase3Duration + phase3Buffer);
    
    phases.push({
      id: 'ai-voice-agent',
      name: 'Fase 3: Agente de Voz com IA',
      description: 'Sistema de chamadas telefónicas automatizadas',
      startDate: phase3Start,
      endDate: phase3End,
      duration: phase3Duration,
      bufferDays: phase3Buffer,
      totalDays: phase3Duration + phase3Buffer,
      status: 'in-progress',
      progress: 65,
      icon: <Brain className="w-6 h-6" />,
      color: 'purple',
      dependencies: ['core-mvp'],
      deliverables: [
        'Interface do agente de voz funcional',
        'Google TTS integrado (vozes PT-PT)',
        'Lógica conversacional com IA',
        'Detecção de intenção do devedor',
        'Gravação e análise de chamadas'
      ],
      risks: [
        'Complexidade da IA conversacional',
        'Latência na API do Google TTS',
        'Qualidade de voz pode não ser perfeita'
      ],
      team: ['IA/ML', 'Backend', 'Frontend']
    });

    // FASE 4: Conectores Críticos
    const phase4Start = addBusinessDays(phase3End, 1);
    const phase4Duration = 30;
    const phase4Buffer = 12;
    const phase4End = addBusinessDays(phase4Start, phase4Duration + phase4Buffer);
    
    phases.push({
      id: 'critical-connectors',
      name: 'Fase 4: Conectores Críticos',
      description: 'Twilio VoIP, Easypay, Google STT, SMS, Email',
      startDate: phase4Start,
      endDate: phase4End,
      duration: phase4Duration,
      bufferDays: phase4Buffer,
      totalDays: phase4Duration + phase4Buffer,
      status: 'planned',
      progress: 0,
      icon: <Globe className="w-6 h-6" />,
      color: 'orange',
      dependencies: ['ai-voice-agent'],
      deliverables: [
        'Twilio VoIP: chamadas reais saindo',
        'Easypay: referências Multibanco/MB WAY',
        'Google Speech-to-Text: transcrições',
        'Twilio SMS: notificações automáticas',
        'WhatsApp Business API integrado',
        'Resend: emails transacionais profissionais'
      ],
      risks: [
        'APIs de terceiros podem ter downtime',
        'Custos operacionais variáveis',
        'Aprovação do WhatsApp Business pode demorar',
        'Certificação Easypay requer documentos'
      ],
      team: ['Backend', 'DevOps', 'Compliance']
    });

    // FASE 5: Preparação para Produção
    const phase5Start = addBusinessDays(phase4End, 1);
    const phase5Duration = 22;
    const phase5Buffer = 8;
    const phase5End = addBusinessDays(phase5Start, phase5Duration + phase5Buffer);
    
    phases.push({
      id: 'production-ready',
      name: 'Fase 5: Preparação para Produção',
      description: 'Segurança, Monitoramento, Performance, Compliance',
      startDate: phase5Start,
      endDate: phase5End,
      duration: phase5Duration,
      bufferDays: phase5Buffer,
      totalDays: phase5Duration + phase5Buffer,
      status: 'planned',
      progress: 0,
      icon: <Shield className="w-6 h-6" />,
      color: 'indigo',
      dependencies: ['critical-connectors'],
      deliverables: [
        'Rate Limiting implementado',
        'Sentry para monitoramento de erros',
        'Logs de auditoria completos',
        'Validação Zod em todas APIs',
        'Otimização SQL e cache',
        'Backup automático diário',
        'Testes de carga (stress test)',
        'Documentação técnica completa'
      ],
      risks: [
        'Descoberta de bugs críticos tardios',
        'Performance pode não atingir metas',
        'Compliance GDPR pode exigir ajustes'
      ],
      team: ['Backend', 'DevOps', 'QA', 'Legal']
    });

    // FASE 6: Beta Fechado
    const phase6Start = addBusinessDays(phase5End, 1);
    const phase6Duration = 15;
    const phase6Buffer = 6;
    const phase6End = addBusinessDays(phase6Start, phase6Duration + phase6Buffer);
    
    phases.push({
      id: 'beta-launch',
      name: 'Fase 6: Lançamento Beta Fechado',
      description: 'Testes com 10-20 clientes reais',
      startDate: phase6Start,
      endDate: phase6End,
      duration: phase6Duration,
      bufferDays: phase6Buffer,
      totalDays: phase6Duration + phase6Buffer,
      status: 'planned',
      progress: 0,
      icon: <Users className="w-6 h-6" />,
      color: 'teal',
      dependencies: ['production-ready'],
      deliverables: [
        'Onboarding de 10-20 early adopters',
        'Coleta de feedback estruturado',
        'Ajustes de UX baseados em uso real',
        'Validação de precificação',
        'Resolução de bugs críticos reportados',
        'Documentação de usuário finalizada'
      ],
      risks: [
        'Usuários podem achar complexo',
        'Taxa de churn alta no beta',
        'Bugs graves podem aparecer em produção'
      ],
      team: ['Produto', 'Customer Success', 'Engenharia']
    });

    // FASE 7: GO-LIVE
    const phase7Start = addBusinessDays(phase6End, 1);
    const phase7Duration = 15;
    const phase7Buffer = 5;
    const phase7End = addBusinessDays(phase7Start, phase7Duration + phase7Buffer);
    
    phases.push({
      id: 'go-live',
      name: 'Fase 7: GO-LIVE PRODUÇÃO',
      description: 'Comercialização pública e marketing ativo',
      startDate: phase7Start,
      endDate: phase7End,
      duration: phase7Duration,
      bufferDays: phase7Buffer,
      totalDays: phase7Duration + phase7Buffer,
      status: 'planned',
      progress: 0,
      icon: <Rocket className="w-6 h-6" />,
      color: 'green',
      dependencies: ['beta-launch'],
      deliverables: [
        'Landing page otimizada para conversão',
        'Analytics (PostHog) configurado',
        'Termos de Uso e Privacidade publicados',
        'Campanha de marketing digital ativa',
        'SEO otimizado para busca orgânica',
        'Suporte ao cliente estruturado',
        'Sistema de assinaturas funcionando',
        'Comissões automatizadas configuradas'
      ],
      risks: [
        'Aquisição de clientes mais lenta que esperado',
        'Concorrentes podem reagir agressivamente',
        'Problemas de escala se viralizar muito rápido'
      ],
      team: ['Marketing', 'Vendas', 'Produto', 'Engenharia']
    });

    // FASE 8: Crescimento
    const phase8Start = addBusinessDays(phase7End, 1);
    const phase8Duration = 130;
    const phase8Buffer = 50;
    const phase8End = addBusinessDays(phase8Start, phase8Duration + phase8Buffer);
    
    phases.push({
      id: 'growth',
      name: 'Fase 8: Crescimento e Escala',
      description: 'Escala, otimização e novas features',
      startDate: phase8Start,
      endDate: phase8End,
      duration: phase8Duration,
      bufferDays: phase8Buffer,
      totalDays: phase8Duration + phase8Buffer,
      status: 'planned',
      progress: 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'cyan',
      dependencies: ['go-live'],
      deliverables: [
        'Integração com ERPs portugueses (Moloni, InvoiceXpress)',
        'App mobile iOS/Android',
        'Dashboard de BI avançado',
        'Sistema de parceiros/afiliados',
        'Expansão para Espanha/Brasil',
        'Novas features baseadas em feedback'
      ],
      risks: [
        'Custo de aquisição (CAC) muito alto',
        'Churn maior que projeção',
        'Competição intensifica'
      ],
      team: ['Toda empresa']
    });

    return phases;
  }, []);

  // Calcular informações importantes
  const projectStartDate = milestones[0].startDate;
  const launchMilestone = milestones.find(m => m.id === 'go-live');
  const finalMilestone = milestones[milestones.length - 1];
  
  const launchDate = launchMilestone?.endDate;
  const projectEndDate = finalMilestone?.endDate;
  
  const daysUntilLaunch = launchDate ? Math.ceil((launchDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalProjectDays = milestones.reduce((sum, m) => sum + m.totalDays, 0);
  const totalBufferDays = milestones.reduce((sum, m) => sum + m.bufferDays, 0);
  const bufferPercentage = Math.round((totalBufferDays / (totalProjectDays - totalBufferDays)) * 100);

  // Função para exportar PDF completo com VISUAL TIMELINE
  const exportRoadmapToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // ========== CAPA ==========
    doc.setFillColor(67, 56, 202);
    doc.rect(0, 0, pageWidth, 80, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('Tá Pago.pt', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.text('Roadmap de Desenvolvimento', pageWidth / 2, 45, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Cronograma Executivo para Investidores', pageWidth / 2, 58, { align: 'center' });
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${formatDate(TODAY)}`, pageWidth / 2, 70, { align: 'center' });

    yPosition = 95;

    // ========== STATUS DO PROJETO ==========
    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 12, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Status do Projeto', 14, yPosition + 4);
    yPosition += 18;

    // Caixas de status
    const boxWidth = (pageWidth - 40) / 3;
    const boxHeight = 25;
    const boxY = yPosition;

    // Box 1: Progresso
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(14, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246);
    doc.text('Progresso Atual', 14 + boxWidth/2, boxY + 8, { align: 'center' });
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${metrics.overallProgress}%`, 14 + boxWidth/2, boxY + 18, { align: 'center' });

    // Box 2: Fase Atual
    doc.setFillColor(243, 232, 255);
    doc.roundedRect(14 + boxWidth + 3, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(147, 51, 234);
    doc.text('Fase Atual', 14 + boxWidth + 3 + boxWidth/2, boxY + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(metrics.currentPhase, 14 + boxWidth + 3 + boxWidth/2, boxY + 18, { align: 'center', maxWidth: boxWidth - 10 });

    // Box 3: Lançamento
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(14 + (boxWidth + 3) * 2, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 74);
    doc.text('Data de Lançamento', 14 + (boxWidth + 3) * 2 + boxWidth/2, boxY + 8, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDate(launchDate!), 14 + (boxWidth + 3) * 2 + boxWidth/2, boxY + 18, { align: 'center' });

    yPosition = boxY + boxHeight + 15;

    // Informações adicionais
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`• Início do Projeto: ${formatDate(projectStartDate)}`, 14, yPosition);
    yPosition += 6;
    doc.text(`• Features Completadas: ${metrics.completedFeatures} de ${metrics.totalFeatures}`, 14, yPosition);
    yPosition += 6;
    doc.text(`• Tempo até Lançamento: ${daysUntilLaunch} dias (${getMonthsDiff(TODAY, launchDate!)})`, 14, yPosition);
    yPosition += 6;
    doc.text(`• Duração Total: ${totalProjectDays} dias úteis (~${Math.round(totalProjectDays / 22)} meses)`, 14, yPosition);
    yPosition += 6;
    doc.text(`• Buffer Total: ${totalBufferDays} dias (${bufferPercentage}% de gordura para imprevistos)`, 14, yPosition);
    yPosition += 12;

    // ========== TIMELINE VISUAL - RÉGUA DE TEMPO ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 12, 'F');
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('📅 Régua de Tempo - Cronograma Visual', 14, yPosition + 4);
    yPosition += 20;

    // Desenhar timeline visual
    const timelineStartX = 20;
    const timelineWidth = pageWidth - 40;
    const timelineY = yPosition;
    const barHeight = 8;
    const spacing = 16;

    milestones.forEach((milestone, index) => {
      // Status color
      let barColor: [number, number, number];
      if (milestone.status === 'completed') {
        barColor = [16, 185, 129]; // green
      } else if (milestone.status === 'in-progress') {
        barColor = [59, 130, 246]; // blue
      } else {
        barColor = [203, 213, 225]; // gray
      }

      // Nome da fase
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(`${index + 1}. ${milestone.name}`, timelineStartX, timelineY);
      
      // Datas
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`${formatDate(milestone.startDate)} → ${formatDate(milestone.endDate)}`, timelineStartX, timelineY + 5);
      
      // Barra de progresso
      const barY = timelineY + 8;
      
      // Fundo da barra
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(timelineStartX, barY, timelineWidth, barHeight, 2, 2, 'F');
      
      // Barra de progresso preenchida
      doc.setFillColor(...barColor);
      const progressWidth = (timelineWidth * milestone.progress) / 100;
      if (progressWidth > 0) {
        doc.roundedRect(timelineStartX, barY, progressWidth, barHeight, 2, 2, 'F');
      }
      
      // Texto de duração e status
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`${milestone.totalDays}d (${milestone.duration}d + ${milestone.bufferDays}d buffer) • ${milestone.progress}%`, 
        timelineStartX + timelineWidth + 2, barY + 5);

      yPosition = barY + barHeight + spacing;
      
      // Nova página se necessário
      if (yPosition > pageHeight - 40 && index < milestones.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Resumo do tempo
    yPosition += 10;
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, yPosition, pageWidth - 28, 35, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text('⏱️ Resumo de Tempo Total', 20, yPosition + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 15);
    doc.text(`• Início: ${formatDate(projectStartDate)} → Lançamento: ${formatDate(launchDate!)} → Conclusão: ${formatDate(projectEndDate!)}`, 20, yPosition + 16);
    doc.text(`• Tempo até Lançamento: ${getMonthsDiff(projectStartDate, launchDate!)}`, 20, yPosition + 23);
    doc.text(`• Tempo Total do Projeto: ${getMonthsDiff(projectStartDate, projectEndDate!)}`, 20, yPosition + 30);

    yPosition += 45;

    // ========== MODELOS DE RECEITA ==========
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('💰 Modelos de Receita', 14, yPosition);
    yPosition += 12;

    revenueModels.forEach((model, idx) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(67, 56, 202);
      doc.text(`${idx + 1}. ${model.name}`, 14, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`   ${model.description}`, 14, yPosition, { maxWidth: pageWidth - 28 });
      yPosition += 5;
      doc.text(`   Valor Estimado: ${model.estimatedValue}`, 14, yPosition);
      yPosition += 5;
      doc.text(`   Início: ${model.startPhase}`, 14, yPosition);
      yPosition += 10;
    });

    // ========== CALENDÁRIO DE EXECUÇÃO (GANTT) ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('📅 Calendário de Execução (Gantt)', 14, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Visualização mensal das fases do projeto ao longo do tempo', 14, yPosition);
    yPosition += 10;

    // Legenda
    doc.setFontSize(9);
    doc.setFillColor(16, 185, 129);
    doc.rect(14, yPosition, 4, 4, 'F');
    doc.text('Completo', 20, yPosition + 3);
    
    doc.setFillColor(59, 130, 246);
    doc.rect(45, yPosition, 4, 4, 'F');
    doc.text('Em Progresso', 51, yPosition + 3);
    
    doc.setFillColor(203, 213, 225);
    doc.rect(90, yPosition, 4, 4, 'F');
    doc.text('Planejado', 96, yPosition + 3);
    
    yPosition += 12;

    // Cabeçalho de meses
    const ganttStartX = 50;
    const ganttWidth = pageWidth - 60;
    const monthWidth = ganttWidth / 12;
    const months = ['Nov 24', 'Dez 24', 'Jan 25', 'Fev 25', 'Mar 25', 'Abr 25', 'Mai 25', 'Jun 25', 'Jul 25', 'Ago 25', 'Set 25', 'Out 25'];
    
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    for (let i = 0; i < 12; i++) {
      doc.text(months[i], ganttStartX + (i * monthWidth) + 2, yPosition);
    }
    yPosition += 5;

    // Linha separadora
    doc.setDrawColor(226, 232, 240);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 5;

    // Barras do Gantt
    const ganttBarHeight = 6;
    const projectStart = milestones[0].startDate;
    
    milestones.forEach((milestone, idx) => {
      // Nome da fase
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      const phaseName = `${idx + 1}. ${milestone.name.replace('Fase ' + (idx + 1) + ': ', '').substring(0, 20)}`;
      doc.text(phaseName, 14, yPosition + 4);
      
      // Calcular posição da barra
      const monthsFromStart = Math.floor((milestone.startDate.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24 * 30));
      const durationInMonths = Math.ceil((milestone.endDate.getTime() - milestone.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
      const startX = ganttStartX + (monthsFromStart * monthWidth);
      const barWidth = Math.max(monthWidth * 0.8, durationInMonths * monthWidth);
      
      // Cor da barra
      if (milestone.status === 'completed') {
        doc.setFillColor(16, 185, 129);
      } else if (milestone.status === 'in-progress') {
        doc.setFillColor(59, 130, 246);
      } else {
        doc.setFillColor(203, 213, 225);
      }
      
      // Desenhar barra
      doc.roundedRect(startX, yPosition, Math.min(barWidth, ganttWidth - (startX - ganttStartX)), ganttBarHeight, 1, 1, 'F');
      
      // Duração na barra
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      if (barWidth > 15) {
        doc.text(`${milestone.totalDays}d`, startX + 2, yPosition + 4);
      }
      
      yPosition += ganttBarHeight + 4;
      
      // Nova página se necessário
      if (yPosition > pageHeight - 30 && idx < milestones.length - 1) {
        doc.addPage();
        yPosition = 20;
        
        // Repetir cabeçalho
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        for (let i = 0; i < 12; i++) {
          doc.text(months[i], ganttStartX + (i * monthWidth) + 2, yPosition);
        }
        yPosition += 5;
        doc.setDrawColor(226, 232, 240);
        doc.line(14, yPosition, pageWidth - 14, yPosition);
        yPosition += 5;
      }
    });

    yPosition += 8;

    // Informações adicionais
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Início do Projeto: ${formatDate(projectStartDate)}`, 14, yPosition);
    yPosition += 5;
    doc.text(`Lançamento Previsto: ${formatDate(launchDate!)}`, 14, yPosition);
    yPosition += 5;
    doc.text(`Conclusão do Projeto: ${formatDate(projectEndDate!)}`, 14, yPosition);

    // ========== CRONOGRAMA DETALHADO POR FASE ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('🎯 Detalhamento de Cada Fase', 14, yPosition);
    yPosition += 15;

    // Tabela resumo
    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Fase', 'Status', 'Início', 'Fim', 'Duração', 'Buffer', 'Total']],
      body: milestones.map((m, idx) => [
        `${idx + 1}`,
        m.name,
        m.status === 'completed' ? '✅ Completo' : m.status === 'in-progress' ? '🔄 Progresso' : '⏳ Planejado',
        formatDate(m.startDate),
        formatDate(m.endDate),
        `${m.duration}d`,
        `+${m.bufferDays}d`,
        `${m.totalDays}d`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [51, 65, 85] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 50 },
        2: { cellWidth: 24 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 }
      },
      margin: { left: 14, right: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Detalhes de cada fase
    for (const milestone of milestones) {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFillColor(241, 245, 249);
      doc.rect(0, yPosition - 5, pageWidth, 8, 'F');
      
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(67, 56, 202);
      doc.text(milestone.name, 14, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text(milestone.description, 14, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Período: ${formatDate(milestone.startDate)} até ${formatDate(milestone.endDate)} (${getMonthsDiff(milestone.startDate, milestone.endDate)})`, 14, yPosition);
      yPosition += 6;

      // Deliverables
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('✅ Entregas:', 14, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      milestone.deliverables.forEach(d => {
        doc.text(`   • ${d}`, 14, yPosition, { maxWidth: pageWidth - 28 });
        yPosition += 4;
      });
      yPosition += 2;

      // Riscos
      if (milestone.risks.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68);
        doc.text('⚠️ Riscos:', 14, yPosition);
        yPosition += 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 38, 38);
        milestone.risks.forEach(r => {
          doc.text(`   • ${r}`, 14, yPosition, { maxWidth: pageWidth - 28 });
          yPosition += 4;
        });
        yPosition += 2;
      }

      // Equipe
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text(`Equipe: ${milestone.team.join(', ')}`, 14, yPosition);
      yPosition += 8;

      doc.setDrawColor(226, 232, 240);
      doc.line(14, yPosition, pageWidth - 14, yPosition);
      yPosition += 8;
    }

    // ========== ANÁLISE DE RISCOS ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(254, 242, 242);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('⚠️ Análise de Riscos Consolidada', 14, yPosition);
    yPosition += 12;

    const allRisks = milestones.flatMap(m => 
      m.risks.map(r => ({ phase: m.name, risk: r }))
    ).filter(r => r.risk);

    if (allRisks.length > 0) {
      autoTable(doc, {
        startY: yPosition,
        head: [['Fase', 'Risco Identificado']],
        body: allRisks.map(r => [r.phase, r.risk]),
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 125 }
        },
        margin: { left: 14, right: 14 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Estratégias de Mitigação
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('✅ Estratégias de Mitigação:', 14, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const mitigations = [
      `Buffer de ${bufferPercentage}% adicionado em cada fase para absorver imprevistos`,
      'Testes contínuos e revisão de código obrigatória',
      'Plano B para cada conector crítico (fallback)',
      'Orçamento de contingência de 20% reservado',
      'Comunicação semanal com investidores sobre progresso',
      'MVP Lean: priorizar features essenciais primeiro',
      'Desenvolvimento iterativo com entregas incrementais'
    ];

    mitigations.forEach(m => {
      doc.text(`• ${m}`, 14, yPosition, { maxWidth: pageWidth - 28 });
      yPosition += 5;
    });

    // ========== CONCLUSÃO ==========
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(241, 245, 249);
    doc.rect(0, yPosition - 5, pageWidth, 10, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('🎯 Conclusão e Próximos Passos', 14, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    
    const conclusion = [
      `O projeto Tá Pago.pt está atualmente com ${metrics.overallProgress}% de progresso concluído, na fase "${metrics.currentPhase}".`,
      '',
      `Com base no cronograma realista apresentado, a data prevista de lançamento é ${formatDate(launchDate!)} (em ${daysUntilLaunch} dias).`,
      '',
      'O cronograma foi construído com:',
      `• ${bufferPercentage}% de buffer (gordura) para absorver imprevistos`,
      '• Fases sequenciais com dependências claras',
      '• Entregas incrementais e testáveis',
      '• Riscos identificados e estratégias de mitigação',
      '',
      'Modelos de receita diversificados garantem múltiplas fontes de monetização:',
      '1. Assinaturas mensais recorrentes (€24 - €149/mês)',
      '2. Comissões por recuperação de crédito (5% - 15% do valor)',
      '',
      'Próximos marcos críticos:',
      `• ${milestones[2].name}: ${formatDate(milestones[2].endDate)}`,
      `• ${milestones[3].name}: ${formatDate(milestones[3].endDate)}`,
      `• ${milestones[6].name}: ${formatDate(milestones[6].endDate)}`
    ];

    conclusion.forEach(line => {
      if (line === '') {
        yPosition += 3;
      } else {
        const lines = doc.splitTextToSize(line, pageWidth - 28);
        lines.forEach((l: string) => {
          doc.text(l, 14, yPosition);
          yPosition += 5;
        });
      }
    });

    // Rodapé em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Tá Pago.pt - Roadmap Executivo | Confidencial | Página ${i} de ${totalPages}`, 
        pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Salvar
    doc.save(`TaPago-Roadmap-Executivo-${formatDate(TODAY).replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Status do Projeto & Roadmap</h1>
              <p className="text-white/90 mt-2 text-lg">
                Cronograma realista com {bufferPercentage}% de buffer • Lançamento em {daysUntilLaunch} dias
              </p>
            </div>
          </div>
          
          <Button 
            onClick={exportRoadmapToPDF}
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Download className="size-5" />
            Baixar Roadmap PDF
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-white/80 text-sm font-medium mb-1">Progresso Total</div>
            <div className="text-4xl font-bold">{metrics.overallProgress}%</div>
            <div className="text-white/60 text-xs mt-1">{metrics.completedFeatures}/{metrics.totalFeatures} features</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-white/80 text-sm font-medium mb-1">Fase Atual</div>
            <div className="text-xl font-bold">{metrics.currentPhase}</div>
            <div className="text-white/60 text-xs mt-1">Em desenvolvimento</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-white/80 text-sm font-medium mb-1">Data de Lançamento</div>
            <div className="text-xl font-bold">{formatDate(launchDate!)}</div>
            <div className="text-white/60 text-xs mt-1">Em {daysUntilLaunch} dias</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-white/80 text-sm font-medium mb-1">Buffer Total</div>
            <div className="text-4xl font-bold">{bufferPercentage}%</div>
            <div className="text-white/60 text-xs mt-1">{totalBufferDays} dias</div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Visual - Régua de Tempo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Régua de Tempo Visual</h2>
            <p className="text-slate-600 text-sm">Timeline do projeto do início ao lançamento</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    milestone.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{milestone.name}</div>
                    <div className="text-xs text-slate-500">
                      {formatDate(milestone.startDate)} → {formatDate(milestone.endDate)} 
                      <span className="ml-2">({getMonthsDiff(milestone.startDate, milestone.endDate)})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-700">{milestone.totalDays} dias</div>
                  <div className="text-xs text-slate-500">{milestone.duration}d + {milestone.bufferDays}d buffer</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${milestone.progress}%` }}
                    transition={{ duration: 1, delay: 0.1 * index }}
                    className={`h-full rounded-full ${
                      milestone.status === 'completed' ? 'bg-emerald-500' :
                      milestone.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-slate-300'
                    }`}
                  />
                </div>
                <div className="absolute right-0 -top-1 text-xs font-bold text-slate-600">
                  {milestone.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-600 mb-1">Tempo Total</div>
              <div className="text-2xl font-bold text-blue-900">{totalProjectDays} dias</div>
              <div className="text-xs text-blue-600">~{Math.round(totalProjectDays / 22)} meses</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-sm text-emerald-600 mb-1">Até Lançamento</div>
              <div className="text-2xl font-bold text-emerald-900">{getMonthsDiff(projectStartDate, launchDate!)}</div>
              <div className="text-xs text-emerald-600">Desde {formatDate(projectStartDate)}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-sm text-orange-600 mb-1">Buffer (Gordura)</div>
              <div className="text-2xl font-bold text-orange-900">{bufferPercentage}%</div>
              <div className="text-xs text-orange-600">{totalBufferDays} dias de margem</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendário de Execução - Gantt Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Calendário de Execução (Gantt)</h2>
            <p className="text-slate-600 text-sm">Visualização mensal das fases do projeto</p>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-xs text-slate-600">Completo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-xs text-slate-600">Em Progresso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-300 rounded"></div>
            <span className="text-xs text-slate-600">Planejado</span>
          </div>
        </div>

        {/* Cabeçalho de Meses */}
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Grid de meses */}
            <div className="flex items-center mb-4">
              <div className="w-48 flex-shrink-0 font-semibold text-sm text-slate-700">Fase</div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {['Nov 24', 'Dez 24', 'Jan 25', 'Fev 25', 'Mar 25', 'Abr 25', 'Mai 25', 'Jun 25', 'Jul 25', 'Ago 25', 'Set 25', 'Out 25'].map((month, idx) => (
                  <div key={idx} className="text-center text-xs font-medium text-slate-600 px-1">
                    {month}
                  </div>
                ))}
              </div>
            </div>

            {/* Barras do Gantt */}
            <div className="space-y-3">
              {milestones.map((milestone, idx) => {
                // Calcular posição da barra no calendário
                const projectStart = milestones[0].startDate;
                const totalMonths = 12;
                
                // Calcular em qual mês começa e termina cada fase
                const monthsFromStart = Math.floor((milestone.startDate.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24 * 30));
                const durationInMonths = Math.ceil((milestone.endDate.getTime() - milestone.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                
                const startCol = Math.max(0, Math.min(monthsFromStart, totalMonths - 1));
                const spanCols = Math.max(1, Math.min(durationInMonths, totalMonths - startCol));

                return (
                  <div key={milestone.id} className="flex items-center group hover:bg-slate-50 rounded-lg transition-colors p-2">
                    <div className="w-48 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          milestone.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-900 truncate">{milestone.name.replace('Fase ' + (idx + 1) + ': ', '')}</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {Array.from({ length: totalMonths }).map((_, colIdx) => {
                        const isInRange = colIdx >= startCol && colIdx < startCol + spanCols;
                        const isFirst = colIdx === startCol;
                        const isLast = colIdx === startCol + spanCols - 1;
                        
                        return (
                          <div key={colIdx} className="relative h-8">
                            {isInRange && (
                              <div className={`absolute inset-0 ${
                                milestone.status === 'completed' ? 'bg-emerald-500' :
                                milestone.status === 'in-progress' ? 'bg-blue-500' :
                                'bg-slate-300'
                              } ${
                                isFirst ? 'rounded-l-lg' : ''
                              } ${
                                isLast ? 'rounded-r-lg' : ''
                              } flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
                                {isFirst && spanCols === 1 && (
                                  <span className="text-[10px] font-bold text-white truncate px-1">
                                    {milestone.totalDays}d
                                  </span>
                                )}
                                {isFirst && spanCols > 1 && colIdx === Math.floor(startCol + spanCols / 2) && (
                                  <span className="text-[10px] font-bold text-white truncate px-1">
                                    {milestone.totalDays}d
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Indicador de Hoje */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <span className="text-slate-600">Hoje: {formatDate(TODAY)}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Projeto iniciado em {formatDate(projectStartDate)}</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-indigo-600">Lançamento previsto: {formatDate(launchDate!)}</span>
          </div>
        </div>
      </motion.div>

      {/* Modelos de Receita */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-8 h-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-900">Modelos de Receita</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {revenueModels.map((model, index) => (
            <div 
              key={index}
              className={`p-5 rounded-xl border-2 ${
                model.type === 'subscription' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {model.type === 'subscription' ? (
                    <Package className="w-6 h-6 text-blue-600" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-green-600" />
                  )}
                  <h3 className={`font-bold text-lg ${
                    model.type === 'subscription' ? 'text-blue-900' : 'text-green-900'
                  }`}>
                    {model.name}
                  </h3>
                </div>
                <Badge className={
                  model.type === 'subscription' 
                    ? 'bg-blue-600' 
                    : 'bg-green-600'
                }>
                  {model.type === 'subscription' ? 'Recorrente' : 'Variável'}
                </Badge>
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{model.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Valor Estimado</div>
                  <div className={`text-lg font-bold ${
                    model.type === 'subscription' ? 'text-blue-900' : 'text-green-900'
                  }`}>
                    {model.estimatedValue}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Início</div>
                  <div className="text-sm font-semibold text-slate-700">{model.startPhase}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detalhamento das Fases */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-indigo-600" />
          Detalhamento de Cada Fase
        </h2>

        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
              milestone.status === 'completed' 
                ? 'border-emerald-200' 
                : milestone.status === 'in-progress'
                ? 'border-blue-200'
                : 'border-slate-200'
            }`}
          >
            {/* Header da Fase */}
            <div className={`p-6 ${
              milestone.status === 'completed' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                : milestone.status === 'in-progress'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-slate-500 to-slate-600'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    {milestone.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{milestone.name}</h3>
                    <p className="text-white/90 mt-1">{milestone.description}</p>
                    <p className="text-white/80 text-sm mt-1">
                      {formatDate(milestone.startDate)} → {formatDate(milestone.endDate)} ({getMonthsDiff(milestone.startDate, milestone.endDate)})
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-4xl font-bold">{milestone.progress}%</div>
                  <div className="text-xs text-white/80 uppercase tracking-wider">
                    {milestone.status === 'completed' ? 'Completo' : milestone.status === 'in-progress' ? 'Em Progresso' : 'Planejado'}
                  </div>
                </div>
              </div>

              <div className="mt-4 w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                  className="h-full bg-white/90 rounded-full"
                />
              </div>
            </div>

            {/* Corpo da Fase */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Início</div>
                  <div className="font-semibold text-slate-900">{formatDate(milestone.startDate)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Fim</div>
                  <div className="font-semibold text-slate-900">{formatDate(milestone.endDate)}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Duração Base</div>
                  <div className="font-bold text-blue-900">{milestone.duration} dias</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="text-xs text-orange-600 mb-1">Buffer (+Gordura)</div>
                  <div className="font-bold text-orange-900">+{milestone.bufferDays} dias</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-900">Duração Total com Buffer:</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-900">{milestone.totalDays} dias úteis</div>
                </div>
                <p className="text-xs text-indigo-600 mt-2">
                  Buffer de {Math.round((milestone.bufferDays / milestone.duration) * 100)}% adicionado para imprevistos
                </p>
              </div>

              <div>
                <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Entregas (Deliverables)
                </h4>
                <div className="grid gap-2">
                  {milestone.deliverables.map((deliverable, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              {milestone.risks.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Riscos Identificados
                  </h4>
                  <div className="grid gap-2">
                    {milestone.risks.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm bg-red-50 p-2 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-red-700">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Equipe:</span>
                  <span className="text-sm font-medium text-slate-900">{milestone.team.join(', ')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Resumo Final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-indigo-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Flag className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold text-indigo-900">Resumo Executivo</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="text-sm text-slate-600 mb-2">Duração Total do Projeto</div>
            <div className="text-3xl font-bold text-indigo-900">
              {getMonthsDiff(projectStartDate, projectEndDate!)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {totalProjectDays} dias úteis
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="text-sm text-slate-600 mb-2">Buffer Total Adicionado</div>
            <div className="text-3xl font-bold text-orange-900">
              {totalBufferDays} dias
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {bufferPercentage}% de gordura
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="text-sm text-slate-600 mb-2">Data de Lançamento</div>
            <div className="text-xl font-bold text-emerald-900">
              {formatDate(launchDate!)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Em {daysUntilLaunch} dias
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <h3 className="font-bold text-lg text-slate-900 mb-3">Estratégias de Mitigação de Riscos</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">Buffer de {bufferPercentage}% em cada fase para absorver imprevistos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">Testes contínuos e revisão de código obrigatória</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">Plano B para cada conector crítico (fallback)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">Comunicação semanal de status com investidores</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">MVP Lean priorizando features essenciais</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">Orçamento de contingência de 20% reservado</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm py-4">
        <p className="font-semibold">🤖 Este roadmap é atualizado automaticamente com base no código real do projeto</p>
        <p className="mt-1">Última atualização: {TODAY.toLocaleString('pt-PT')}</p>
        <p className="mt-2 text-indigo-600 font-medium">
          Todas as datas incluem buffer realista ({bufferPercentage}%) para garantir entregas dentro do prazo
        </p>
      </div>
    </div>
  );
}