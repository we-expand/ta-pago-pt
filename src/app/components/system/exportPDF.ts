import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
}

interface ExportPDFParams {
  milestones: Milestone[];
  phases2026: Milestone[];
  totalDays2026: number;
  daysUntilLaunch: number;
  bufferPercentage: number;
  totalBufferDays: number;
  overallProgress: number;
  today: Date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function exportRoadmapToPDF(params: ExportPDFParams) {
  const {
    milestones,
    phases2026,
    totalDays2026,
    daysUntilLaunch,
    bufferPercentage,
    totalBufferDays,
    overallProgress,
    today
  } = params;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // ============================================
  // PÁGINA 1: HEADER EXECUTIVO + GANTT VISUAL
  // ============================================
  
  // Background gradient
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 65, 'F');
  
  doc.setFillColor(67, 56, 202);
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }));
  doc.rect(0, 0, pageWidth, 65, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
  
  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('Roadmap Executivo', 15, 18);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Cronograma de Lançamento • 1º de Junho de 2026', 15, 25);
  
  // Box "Dias Restantes"
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }));
  doc.roundedRect(pageWidth - 50, 8, 40, 28, 3, 3, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(String(daysUntilLaunch), pageWidth - 30, 24, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('DIAS RESTANTES', pageWidth - 30, 31, { align: 'center' });
  
  // Métricas em cards
  const metricsY = 40;
  const cardHeight = 20;
  const metrics_data = [
    { label: 'PROGRESSO TOTAL', value: `${overallProgress}%` },
    { label: 'FASE ATUAL', value: 'Agente IA' },
    { label: 'LANÇAMENTO', value: '01 Jun 2026' },
    { label: 'BUFFER', value: `${bufferPercentage}%` }
  ];
  
  metrics_data.forEach((metric, idx) => {
    const x = 15 + (idx * 68);
    doc.setFillColor(255, 255, 255);
    doc.setGState(new (doc as any).GState({ opacity: 0.12 }));
    doc.roundedRect(x, metricsY, 60, cardHeight, 2, 2, 'F');
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.label, x + 3, metricsY + 5);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.value, x + 3, metricsY + 15);
  });
  
  // Título da seção Gantt
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Calendário de Execução', 15, 75);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Março — Junho 2026 • ${totalDays2026} dias úteis`, 15, 81);
  
  doc.setFontSize(8);
  doc.text(`Gerado em: ${formatDate(today)}`, pageWidth - 15, 81, { align: 'right' });
  
  // Legenda
  const legendY = 87;
  const legendItems = [
    { label: 'Completo', color: [16, 185, 129] },
    { label: 'Em Progresso', color: [59, 130, 246] },
    { label: 'Planejado', color: [203, 213, 225] }
  ];
  
  legendItems.forEach((item, idx) => {
    const x = 15 + (idx * 38);
    doc.setFillColor(...item.color);
    doc.roundedRect(x, legendY, 5, 5, 0.5, 0.5, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, x + 7, legendY + 3.5);
  });
  
  // Cabeçalho dos meses
  const ganttStartX = 85;
  const ganttWidth = pageWidth - ganttStartX - 15;
  const monthWidth = ganttWidth / 4;
  const monthsY = 96;
  
  doc.setFillColor(248, 250, 252);
  doc.rect(ganttStartX, monthsY, ganttWidth, 8, 'F');
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.rect(ganttStartX, monthsY, ganttWidth, 8, 'S');
  
  const months = ['Março 2026', 'Abril 2026', 'Maio 2026', 'Junho 2026'];
  months.forEach((month, idx) => {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(month, ganttStartX + (idx * monthWidth) + (monthWidth / 2), monthsY + 5.5, { align: 'center' });
    
    if (idx > 0) {
      doc.setDrawColor(226, 232, 240);
      doc.line(ganttStartX + (idx * monthWidth), monthsY, ganttStartX + (idx * monthWidth), monthsY + 8);
    }
  });
  
  // GANTT CHART - Barras visuais
  let currentY = monthsY + 14;
  const rowHeight = 14;
  
  const calendarStart = new Date('2026-03-01');
  const calendarEnd = new Date('2026-06-30');
  const totalCalendarDays = (calendarEnd.getTime() - calendarStart.getTime()) / (1000 * 60 * 60 * 24);
  
  phases2026.forEach((milestone, idx) => {
    // Coluna da fase (esquerda)
    doc.setFillColor(249, 250, 251);
    doc.rect(15, currentY, ganttStartX - 20, rowHeight - 1, 'F');
    
    // Número da fase
    const phaseNum = idx + 3;
    const boxColor = milestone.status === 'completed' ? [209, 250, 229] :
                    milestone.status === 'in-progress' ? [219, 234, 254] :
                    [241, 245, 249];
    const textColor = milestone.status === 'completed' ? [5, 150, 105] :
                     milestone.status === 'in-progress' ? [29, 78, 216] :
                     [71, 85, 105];
    
    doc.setFillColor(...boxColor);
    doc.roundedRect(17, currentY + 1, 7, 7, 1, 1, 'F');
    doc.setTextColor(...textColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(String(phaseNum), 20.5, currentY + 5.5, { align: 'center' });
    
    // Nome e descrição
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(milestone.name, 27, currentY + 3.5);
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(milestone.description, 27, currentY + 7.5);
    
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${milestone.totalDays} dias`, 27, currentY + 11);
    
    // Barra do Gantt
    const startOffset = (milestone.startDate.getTime() - calendarStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (milestone.endDate.getTime() - milestone.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    
    const barX = ganttStartX + (startOffset / totalCalendarDays) * ganttWidth;
    const barWidth = (duration / totalCalendarDays) * ganttWidth;
    
    // Grid vertical dos meses
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    for (let i = 1; i < 4; i++) {
      doc.line(ganttStartX + (i * monthWidth), currentY, ganttStartX + (i * monthWidth), currentY + rowHeight - 1);
    }
    
    // Barra colorida
    const barColors = milestone.status === 'completed' ? [16, 185, 129] :
                     milestone.status === 'in-progress' ? [59, 130, 246] :
                     [203, 213, 225];
    
    doc.setFillColor(...barColors);
    doc.roundedRect(barX, currentY + 3, barWidth, 7, 1.5, 1.5, 'F');
    
    // Sombra
    doc.setDrawColor(0, 0, 0);
    doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
    doc.setLineWidth(0.5);
    doc.roundedRect(barX, currentY + 3, barWidth, 7, 1.5, 1.5, 'S');
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
    
    // Texto na barra
    if (barWidth > 10) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      const barText = milestone.status === 'in-progress' ? `${milestone.progress}%` :
                     milestone.status === 'completed' ? '✓' : '';
      if (barText) {
        doc.text(barText, barX + barWidth / 2, currentY + 7.5, { align: 'center' });
      }
    }
    
    currentY += rowHeight;
  });
  
  // Footer cards
  const footerY = currentY + 8;
  const footerCardWidth = 85;
  const footerCards = [
    { label: 'SPRINT FINAL', value: String(totalDays2026), unit: 'dias úteis', color: [219, 234, 254], textColor: [30, 64, 175] },
    { label: 'LANÇAMENTO', value: '1 Jun', unit: 'Domingo', color: [209, 250, 229], textColor: [6, 95, 70] },
    { label: 'MARGEM', value: `${bufferPercentage}%`, unit: `${totalBufferDays} dias buffer`, color: [254, 243, 199], textColor: [146, 64, 14] }
  ];
  
  footerCards.forEach((card, idx) => {
    const x = 15 + (idx * (footerCardWidth + 5));
    doc.setFillColor(...card.color);
    doc.roundedRect(x, footerY, footerCardWidth, 20, 2, 2, 'F');
    
    doc.setTextColor(...card.textColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(card.label, x + 3, footerY + 5);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(card.value, x + 3, footerY + 13);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(card.unit, x + 3, footerY + 17.5);
  });
  
  // Footer página 1
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Tá Pago.pt - Plataforma Fintech de Recuperação de Crédito', 15, pageHeight - 6);
  doc.text('www.tapago.pt', pageWidth - 15, pageHeight - 6, { align: 'right' });
  
  // ============================================
  // PÁGINA 2: TABELA DETALHADA
  // ============================================
  doc.addPage();
  
  // Header da página 2
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(19);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhamento das Fases', 15, 14);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Cronograma completo do projeto • Todas as 8 fases', 15, 21);
  
  // Tabela detalhada
  const tableData = milestones.map((m, idx) => [
    String(idx + 1),
    m.name,
    m.description,
    `${formatDate(m.startDate)}\n${formatDate(m.endDate)}`,
    `${m.totalDays} dias`,
    m.status === 'completed' ? 'Completo' :
    m.status === 'in-progress' ? 'Ativo' : 'Planejado',
    `${m.progress}%`
  ]);
  
  autoTable(doc, {
    startY: 33,
    head: [['#', 'Fase', 'Descrição', 'Período', 'Duração', 'Status', '%']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.3
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 52, fontStyle: 'bold' },
      2: { cellWidth: 60, fontSize: 7 },
      3: { cellWidth: 33, fontSize: 7, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' },
      6: { cellWidth: 13, halign: 'center', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 15, right: 15 }
  });
  
  // Box de resumo
  const statsY = (doc as any).lastAutoTable.finalY + 12;
  
  if (statsY + 35 > pageHeight - 10) {
    doc.addPage();
    const newStatsY = 20;
    
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(15, newStatsY, pageWidth - 30, 28, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo do Projeto', 20, newStatsY + 9);
    
    const stats = [
      `• ${milestones.length} fases totais`,
      `• ${milestones.filter(m => m.status === 'completed').length} completas`,
      `• ${milestones.filter(m => m.status === 'in-progress').length} em progresso`,
      `• ${milestones.filter(m => m.status === 'planned').length} planejadas`
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    stats.forEach((stat, idx) => {
      doc.text(stat, 20, newStatsY + 16 + (idx * 4.5));
    });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`🚀 Lançamento em ${daysUntilLaunch} dias - 1º de Junho de 2026`, pageWidth - 20, newStatsY + 18, { align: 'right' });
    
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Tá Pago.pt - Plataforma Fintech de Recuperação de Crédito', 15, pageHeight - 6);
    doc.text(`Página 3 de 3`, pageWidth - 15, pageHeight - 6, { align: 'right' });
  } else {
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(15, statsY, pageWidth - 30, 28, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo do Projeto', 20, statsY + 9);
    
    const stats = [
      `• ${milestones.length} fases totais`,
      `• ${milestones.filter(m => m.status === 'completed').length} completas`,
      `• ${milestones.filter(m => m.status === 'in-progress').length} em progresso`,
      `• ${milestones.filter(m => m.status === 'planned').length} planejadas`
    ];
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    stats.forEach((stat, idx) => {
      doc.text(stat, 20, statsY + 16 + (idx * 4.5));
    });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`🚀 Lançamento em ${daysUntilLaunch} dias - 1º de Junho de 2026`, pageWidth - 20, statsY + 18, { align: 'right' });
    
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Tá Pago.pt - Plataforma Fintech de Recuperação de Crédito', 15, pageHeight - 6);
    doc.text(`Página 2 de 2`, pageWidth - 15, pageHeight - 6, { align: 'right' });
  }
  
  // Salvar
  doc.save(`TaPago_Roadmap_Executivo_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.pdf`);
}
