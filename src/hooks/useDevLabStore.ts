import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Suggestion, Category, Impact, Effort } from '../types/devlab';

interface DevLabState {
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'status'>) => void;
  markAsCompleted: (id: string) => void;
  markAsTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  permanentDelete: (id: string) => void;
  updateSuggestion: (id: string, updates: Partial<Suggestion>) => void;
}

const initialSuggestions: Suggestion[] = [
  // --- TECH ---
  {
    id: 'tech-1',
    title: 'Arquitetura Multi-tenant Isolada',
    description: 'Garantir separação lógica/física dos dados por cliente.',
    category: 'TECH',
    tags: ['security', 'architecture'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Crucial para clientes Enterprise e Banca. Requer reestruturação do schema do banco de dados para incluir tenant_id em todas as tabelas e Row Level Security.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-2',
    title: 'Audit Logs Imutáveis',
    description: 'Sistema de registo à prova de adulteração de todas as ações.',
    category: 'TECH',
    tags: ['security', 'compliance'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Implementar tabela de logs append-only. Necessário para auditorias financeiras e resolução de disputas internas dos clientes.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-3',
    title: 'Webhooks Bidirecionais',
    description: 'Notificações em tempo real para ERPs dos clientes.',
    category: 'TECH',
    tags: ['integration', 'backend'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Permitir que clientes registem endpoints para receber eventos como "payment.received" ou "debt.negotiated".',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-4',
    title: 'Rate Limiting por Tenant',
    description: 'Proteção da API contra saturação por clientes grandes.',
    category: 'TECH',
    tags: ['performance', 'security'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Implementar middleware de rate limiting (Redis) para garantir QoS igualitário entre todos os clientes.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-5',
    title: 'Criptografia de Dados em Repouso',
    description: 'Proteção extra (AES-256) para NIFs e valores.',
    category: 'TECH',
    tags: ['security'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Encriptar colunas sensíveis na base de dados. Chaves devem ser geridas via KMS externo.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-6',
    title: 'Integração SIBS/Easypay via Socket',
    description: 'Atualização instantânea do status de pagamento.',
    category: 'TECH',
    tags: ['payments', 'realtime'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Substituir processamento batch noturno por websockets ou polling de alta frequência para feedback imediato ao devedor.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-7',
    title: 'Serverless para Picos de Cobrança',
    description: 'Edge Functions para processar disparos massivos.',
    category: 'TECH',
    tags: ['scaling', 'infrastructure'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Utilizar funções serverless para envio de SMS/Email em dias críticos (1 e 30 do mês) para escalar horizontalmente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-8',
    title: 'Offline-first Sync',
    description: 'Permitir visualização de dados sem internet.',
    category: 'TECH',
    tags: ['pwa', 'ux'],
    impact: 'MEDIUM',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Implementar Service Workers e IndexedDB para cache local de dados essenciais.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-9',
    title: 'GDPR Right to be Forgotten',
    description: 'Anonimização automática a pedido.',
    category: 'TECH',
    tags: ['privacy', 'legal'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Botão de "Esquecer Devedor" que apaga dados pessoais mas mantém registos financeiros anónimos para o Fisco.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-10',
    title: 'Testes de Carga (Stress Testing)',
    description: 'Simular 100k devedores simultâneos.',
    category: 'TECH',
    tags: ['qa', 'performance'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Usar k6 ou JMeter para validar estabilidade antes de onbarding de grandes carteiras.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-11',
    title: 'Feature Flags',
    description: 'Ligar/desligar features para clientes específicos.',
    category: 'TECH',
    tags: ['devops'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Implementar sistema para rollout gradual de novas funcionalidades (Beta testing).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-12',
    title: 'Monitorização de Erros',
    description: 'Rastreio de bugs no frontend (Sentry).',
    category: 'TECH',
    tags: ['observability'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'completed',
    fullAnalysis: 'Integração com Sentry para capturar stack traces e replay de sessão em erros de produção.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-13',
    title: 'Cache Distribuído (Redis)',
    description: 'Acelerar dashboards financeiros.',
    category: 'TECH',
    tags: ['performance', 'backend'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Cachear agregações pesadas (ex: Total Recuperado Mês) para carregamento instantâneo.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-14',
    title: 'API Pública Documentada',
    description: 'Swagger para equipas de TI dos clientes.',
    category: 'TECH',
    tags: ['dx', 'integration'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Gerar documentação OpenAPI automática e manter atualizada para facilitar integrações self-service.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-15',
    title: '2FA Obrigatório',
    description: 'Segurança extra para admins financeiros.',
    category: 'TECH',
    tags: ['security', 'auth'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Exigir TOTP ou SMS para logins de utilizadores com permissões de exportação de dados.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-16',
    title: 'Validação NIF/IBAN Real-time',
    description: 'Evitar erros na entrada de dados.',
    category: 'TECH',
    tags: ['ux', 'quality'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Algoritmos de validação de checksum no frontend para NIFs e IBANs.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-17',
    title: 'Compressão de Payloads',
    description: 'Otimizar transferência de listas grandes.',
    category: 'TECH',
    tags: ['performance'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Ativar Brotli/Gzip no servidor para endpoints que retornam grandes JSONs.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-18',
    title: 'CI/CD Pipelines com Security Scan',
    description: 'Análise automática de vulnerabilidades.',
    category: 'TECH',
    tags: ['devops', 'security'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Integrar SonarQube ou similar no pipeline de build para detetar falhas de segurança antes do merge.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-19',
    title: 'Backup Georreferenciado',
    description: 'Disaster Recovery em data centers distintos.',
    category: 'TECH',
    tags: ['ops', 'reliability'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Configurar replicação de banco de dados para região secundária (ex: Frankfurt + Paris).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tech-20',
    title: 'Suporte a IPv6',
    description: 'Preparar infraestrutura para novo padrão.',
    category: 'TECH',
    tags: ['network'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Garantir que load balancers e firewalls aceitem tráfego IPv6.',
    createdAt: new Date().toISOString()
  },

  // --- DESIGN_UX ---
  {
    id: 'ux-1',
    title: 'Portal do Devedor Login-less',
    description: 'Acesso via Magic Link seguro.',
    category: 'DESIGN_UX',
    tags: ['conversion', 'b2c'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Remover barreira de entrada. Token temporário enviado por SMS permite acesso direto à página de pagamento.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-2',
    title: 'Modo Escuro (Dark Mode)',
    description: 'Essencial para uso prolongado.',
    category: 'DESIGN_UX',
    tags: ['ui', 'accessibility'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Implementar toggle de tema e suporte a preferência do sistema. Reduz fadiga ocular dos agentes.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-3',
    title: 'Command Palette (Cmd+K)',
    description: 'Navegação rápida para Power Users.',
    category: 'DESIGN_UX',
    tags: ['productivity'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Menu de comandos global para aceder rapidamente a faturas, clientes ou ações (ex: "Nova Cobrança").',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-4',
    title: 'Onboarding Guiado',
    description: 'Product Tour interativo.',
    category: 'DESIGN_UX',
    tags: ['onboarding', 'activation'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Walkthrough passo-a-passo na primeira utilização para explicar conceitos chave.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-5',
    title: 'Visualização Kanban',
    description: 'Colunas por status da dívida.',
    category: 'DESIGN_UX',
    tags: ['ui', 'workflow'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Drag & drop para mover dívidas entre estados (A vencer -> Em negociação -> Promessa).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-6',
    title: 'Micro-interações de Sucesso',
    description: 'Feedback visual positivo.',
    category: 'DESIGN_UX',
    tags: ['delight'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Animação de confetis quando uma dívida é recuperada.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-7',
    title: 'Dashboards Personalizáveis',
    description: 'Widgets Drag & Drop.',
    category: 'DESIGN_UX',
    tags: ['analytics', 'customization'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Permitir que gestores componham sua própria visão inicial com os KPIs mais relevantes.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-8',
    title: 'Mobile-First para Pagamentos',
    description: 'Checkout otimizado para telemóvel.',
    category: 'DESIGN_UX',
    tags: ['mobile', 'conversion'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'A maioria dos devedores paga via smartphone. Interface deve ser perfeita em telas pequenas.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-9',
    title: 'Copywriting Empático',
    description: 'Tom de voz adaptativo.',
    category: 'DESIGN_UX',
    tags: ['content'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Mensagens amigáveis no início ("Esqueceu-se?") e formais no fim ("Aviso Legal").',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-10',
    title: 'Skeleton Loading',
    description: 'Reduzir percepção de espera.',
    category: 'DESIGN_UX',
    tags: ['ui'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Placeholders animados enquanto dados carregam.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-11',
    title: 'Filtros Avançados Salvos',
    description: 'Vistas personalizadas.',
    category: 'DESIGN_UX',
    tags: ['productivity'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Permitir salvar combinações de filtros complexos.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-12',
    title: 'Upload de Excel com Preview',
    description: 'Interface visual para importação.',
    category: 'DESIGN_UX',
    tags: ['onboarding', 'data'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Permitir mapear colunas do CSV visualmente e corrigir erros antes do upload final.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-13',
    title: 'Timeline de Atividade',
    description: 'Histórico visual de interações.',
    category: 'DESIGN_UX',
    tags: ['ui'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Feed cronológico de todas as chamadas, emails e SMS trocados com o devedor.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-14',
    title: 'Atalhos de Teclado',
    description: 'Ações rápidas.',
    category: 'DESIGN_UX',
    tags: ['accessibility'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Hotkeys para aprovar, rejeitar ou anotar processos.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-15',
    title: 'Indicadores de Status por Cor',
    description: 'Semáforo visual.',
    category: 'DESIGN_UX',
    tags: ['ui'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Sistema de cores consistente (Verde/Amarelo/Vermelho) em toda a plataforma.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-16',
    title: 'Acessibilidade WCAG 2.1',
    description: 'Suporte a leitores de ecrã.',
    category: 'DESIGN_UX',
    tags: ['a11y', 'compliance'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Garantir contraste e navegação por teclado para conformidade legal (Setor Público).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-17',
    title: 'Breadcrumbs Dinâmicos',
    description: 'Navegação hierárquica.',
    category: 'DESIGN_UX',
    tags: ['navigation'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Facilitar localização dentro de estruturas profundas de clientes/processos.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-18',
    title: 'Toast Notifications Inteligentes',
    description: 'Feedback não intrusivo com Undo.',
    category: 'DESIGN_UX',
    tags: ['ui'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Notificações que permitem desfazer ações acidentais.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-19',
    title: 'Comparação Antes/Depois',
    description: 'Gráficos de evolução.',
    category: 'DESIGN_UX',
    tags: ['dataviz'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Visualização clara do impacto da plataforma na recuperação de crédito.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ux-20',
    title: 'Editor de Email WYSIWYG',
    description: 'Criação visual de templates.',
    category: 'DESIGN_UX',
    tags: ['content', 'tool'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Editor visual para criar emails de cobrança profissionais com variáveis dinâmicas.',
    createdAt: new Date().toISOString()
  },

  // --- FEATURE ---
  {
    id: 'feat-1',
    title: 'Gestor de Acordos de Pagamento',
    description: 'Parcelamento automático de dívidas.',
    category: 'FEATURE',
    tags: ['core', 'automation'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Sistema para negociar planos de pagamento (ex: 3x) e monitorizar cumprimento.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-2',
    title: 'White-label Completo',
    description: 'Customização de marca para clientes.',
    category: 'FEATURE',
    tags: ['enterprise'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Permitir upload de logo e cores para que o portal pareça nativo do cliente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-3',
    title: 'Calculadora de Juros de Mora',
    description: 'Cálculo legal automático.',
    category: 'FEATURE',
    tags: ['legal', 'fintech'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Aplicação automática das taxas legais em vigor sobre o valor em dívida.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-4',
    title: 'Multicanalidade One-Click',
    description: 'Disparo simultâneo (SMS/Email/WhatsApp).',
    category: 'FEATURE',
    tags: ['automation'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Botão único que orquestra envio em todos os canais configurados.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-5',
    title: 'Gravação de Chamadas VoIP',
    description: 'Integração com Twilio/Aircall.',
    category: 'FEATURE',
    tags: ['integration', 'compliance'],
    impact: 'MEDIUM',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Anexar áudio das negociações à ficha do devedor para auditoria e treino.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-6',
    title: 'Centro de Disputas',
    description: 'Gestão de reclamações.',
    category: 'FEATURE',
    tags: ['workflow'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Fluxo para tratar dívidas contestadas, pausando cobrança automática.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-7',
    title: 'Agenda de Promessas',
    description: 'Calendário de pagamentos prometidos.',
    category: 'FEATURE',
    tags: ['productivity'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Vista de calendário focada em promessas de pagamento para follow-up.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-8',
    title: 'Geração de Cartas Registadas',
    description: 'PDFs para correio registado.',
    category: 'FEATURE',
    tags: ['legal'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Gerar cartas formais prontas para impressão e envio via CTT.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-9',
    title: 'Hierarquia de Permissões',
    description: 'RBAC (Role Based Access Control).',
    category: 'FEATURE',
    tags: ['security', 'admin'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Definir papéis granulares: Admin, Supervisor, Agente, Visualizador.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-10',
    title: 'Simulador de Quitação',
    description: 'Cálculo de descontos para pronto pagamento.',
    category: 'FEATURE',
    tags: ['negotiation'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Ferramenta para agente calcular haircut aceitável para fechar acordo imediato.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-11',
    title: 'Blacklist Interna',
    description: 'Bloqueio de vendas futuras.',
    category: 'FEATURE',
    tags: ['risk'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Marcar NIFs como "Incobrável" para alertar equipa de vendas.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-12',
    title: 'Integração com Tribunais (Citius)',
    description: 'Consulta de processos judiciais.',
    category: 'FEATURE',
    tags: ['legal', 'advanced'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Verificação automatizada de insolvências ou processos em curso.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-13',
    title: 'Exportação SAF-T',
    description: 'Compatibilidade contabilística.',
    category: 'FEATURE',
    tags: ['compliance'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Gerar ficheiros de exportação compatíveis com software de contabilidade.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-14',
    title: 'Gestão de Comissões',
    description: 'Cálculo de earnings.',
    category: 'FEATURE',
    tags: ['admin'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Calcular automaticamente a comissão do agente ou da plataforma sobre o recuperado.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-15',
    title: 'Link de Pagamento Rápido',
    description: 'Gerador de URL para chat.',
    category: 'FEATURE',
    tags: ['payments'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Criar links curtos ad-hoc para enviar em conversas manuais.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-16',
    title: 'Regras de Cool-down',
    description: 'Prevenção de assédio.',
    category: 'FEATURE',
    tags: ['compliance', 'config'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Impedir envio excessivo de mensagens (ex: max 1 SMS a cada 3 dias).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-17',
    title: 'Agrupamento de Dívidas',
    description: 'Consolidação por NIF.',
    category: 'FEATURE',
    tags: ['core'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Tratar múltiplas faturas do mesmo devedor como um único "caso" de cobrança.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-18',
    title: 'Multimoeda',
    description: 'Cobrança internacional.',
    category: 'FEATURE',
    tags: ['expansion'],
    impact: 'LOW',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Suporte a USD, GBP e outras moedas para expansão internacional.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-19',
    title: 'Portal de Parceiros',
    description: 'Acesso para advogados externos.',
    category: 'FEATURE',
    tags: ['collaboration'],
    impact: 'LOW',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Área restrita para parceiros jurídicos atualizarem status de execuções.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'feat-20',
    title: 'Gestão de Feriados',
    description: 'Pausa em dias não úteis.',
    category: 'FEATURE',
    tags: ['config'],
    impact: 'LOW',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Não enviar cobranças automáticas em feriados nacionais ou fins de semana.',
    createdAt: new Date().toISOString()
  },

  // --- COMPETITION ---
  {
    id: 'comp-1',
    title: 'Calculadora de ROI no Site',
    description: 'Ferramenta de vendas.',
    category: 'COMPETITION',
    tags: ['marketing', 'sales'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Widget público para prospect calcular quanto perde por não usar a plataforma.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-2',
    title: 'Página Comparativa',
    description: 'Vs Tradicional.',
    category: 'COMPETITION',
    tags: ['marketing'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Tabela comparando Tá Pago vs Empresas de Cobrança Clássicas (custo, velocidade).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-3',
    title: 'Certificação ISO 27001',
    description: 'Selo de segurança enterprise.',
    category: 'COMPETITION',
    tags: ['compliance', 'trust'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Essencial para competir por contratos com grandes empresas e bancos.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-4',
    title: 'Cases de Sucesso por Setor',
    description: 'Prova social segmentada.',
    category: 'COMPETITION',
    tags: ['marketing'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Landing pages específicas para Clínicas, Telcos, Ginásios, etc.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-5',
    title: 'Plugin Chrome/Gmail',
    description: 'Integração no workflow existente.',
    category: 'COMPETITION',
    tags: ['extension'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Ver status da dívida diretamente no email do Outlook/Gmail.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-6',
    title: 'Trustpilot Widget',
    description: 'Prova social.',
    category: 'COMPETITION',
    tags: ['marketing'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Mostrar reviews reais no fluxo de decisão.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-7',
    title: 'Marketplace de Serviços',
    description: 'Upsell de parceiros.',
    category: 'COMPETITION',
    tags: ['business'],
    impact: 'MEDIUM',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Oferecer serviços jurídicos de parceiros dentro da plataforma.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-8',
    title: 'Garantia Risco Zero',
    description: 'Success Fee model.',
    category: 'COMPETITION',
    tags: ['business'],
    impact: 'HIGH',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Modelo de pricing onde cliente só paga se recuperar (diferencial competitivo).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-9',
    title: 'Integração Open Banking',
    description: 'Leitura automática de extratos.',
    category: 'COMPETITION',
    tags: ['fintech', 'integration'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Superar concorrentes que dependem de upload manual de ficheiros.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-10',
    title: 'Academy/Blog Educativo',
    description: 'Autoridade em Literacia de Crédito.',
    category: 'COMPETITION',
    tags: ['content'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'SEO e posicionamento como especialistas no mercado.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-11',
    title: 'Selo Empresa Ética',
    description: 'Marketing para o cliente.',
    category: 'COMPETITION',
    tags: ['branding'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Certificado para credores que usam cobrança humanizada.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-12',
    title: 'App Mobile para Gestores',
    description: 'Monitorização on-the-go.',
    category: 'COMPETITION',
    tags: ['mobile'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'App nativa para gestores acompanharem recuperação (concorrentes só têm web).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-13',
    title: 'KPI Tempo Médio Recuperação',
    description: 'Benchmark público.',
    category: 'COMPETITION',
    tags: ['data'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Mostrar em tempo real estatísticas de performance da plataforma.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-14',
    title: 'Suporte via WhatsApp',
    description: 'Canal direto B2B.',
    category: 'COMPETITION',
    tags: ['support'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Atendimento premium via chat para clientes empresariais.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-15',
    title: 'Demo Interativa',
    description: 'Teste sem cadastro.',
    category: 'COMPETITION',
    tags: ['plg'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Permitir experimentar a ferramenta no site sem dar email (Product Led Growth).',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-16',
    title: 'Integração Zapier',
    description: 'Conectividade universal.',
    category: 'COMPETITION',
    tags: ['integration'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Conectar com qualquer CRM que os concorrentes não tenham integração nativa.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-17',
    title: 'Alertas de Insolvência',
    description: 'Monitorização Diário da República.',
    category: 'COMPETITION',
    tags: ['data', 'legal'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Notificar cliente imediatamente se um devedor abrir insolvência.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-18',
    title: 'Planos Flexíveis',
    description: 'SaaS puro vs Híbrido.',
    category: 'COMPETITION',
    tags: ['pricing'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Opções para quem quer fazer sozinho vs quem quer gestão total.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-19',
    title: 'Programa de Referral',
    description: 'Crescimento viral.',
    category: 'COMPETITION',
    tags: ['growth'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Descontos para contabilistas que indicarem clientes.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'comp-20',
    title: 'Relatórios Whitepaper',
    description: 'Insights de mercado.',
    category: 'COMPETITION',
    tags: ['content'],
    impact: 'MEDIUM',
    effort: 'LOW',
    status: 'active',
    fullAnalysis: 'Publicar anualmente o "Estado da Inadimplência em Portugal".',
    createdAt: new Date().toISOString()
  },

  // --- INNOVATION ---
  {
    id: 'inno-1',
    title: 'Agente de Voz AI (Phonebot)',
    description: 'Robô negociador PT-PT.',
    category: 'INNOVATION',
    tags: ['ai', 'voice'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'IA que liga, negocia e entende linguagem natural portuguesa.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-2',
    title: 'Análise de Sentimento',
    description: 'Deteção de irritação.',
    category: 'INNOVATION',
    tags: ['ai', 'nlp'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Alertar humano se o devedor estiver agressivo no chat.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-3',
    title: 'Best Time to Contact (BTTC)',
    description: 'Otimização de horário.',
    category: 'INNOVATION',
    tags: ['ai', 'data'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'IA analisa histórico para decidir o melhor momento para contactar cada NIF.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-4',
    title: 'Score Propensão Pagamento',
    description: 'Ranking de probabilidade.',
    category: 'INNOVATION',
    tags: ['ai', 'data'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Classificar devedores de 0 a 100 na probabilidade de pagar espontaneamente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-5',
    title: 'Gerador Scripts Negociação',
    description: 'Sugestões LLM.',
    category: 'INNOVATION',
    tags: ['ai', 'genai'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'IA sugere respostas empáticas baseadas na objeção do devedor.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-6',
    title: 'Resumo Automático de Casos',
    description: 'Sumarização de threads.',
    category: 'INNOVATION',
    tags: ['ai', 'productivity'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'IA lê emails trocados e resume o estado da negociação para o agente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-7',
    title: 'Categorização de Respostas',
    description: 'Triagem de emails.',
    category: 'INNOVATION',
    tags: ['ai', 'nlp'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Classificar emails recebidos em: Promessa, Recusa, Dúvida, Comprovativo.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-8',
    title: 'Next Best Action',
    description: 'Recomendação de estratégia.',
    category: 'INNOVATION',
    tags: ['ai', 'strategy'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'IA sugere o próximo passo ideal (ex: enviar WhatsApp agora) para maximizar sucesso.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-9',
    title: 'Deteção de Fraude',
    description: 'Padrões anómalos.',
    category: 'INNOVATION',
    tags: ['ai', 'security'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Alertar se um padrão de dívida parecer esquema organizado.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-10',
    title: 'Chatbot Híbrido',
    description: 'Human Handover suave.',
    category: 'INNOVATION',
    tags: ['ai', 'chat'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Bot negocia até onde sabe, depois passa para humano com contexto total.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-11',
    title: 'Análise Preditiva Cashflow',
    description: 'Forecasting financeiro.',
    category: 'INNOVATION',
    tags: ['ai', 'finance'],
    impact: 'MEDIUM',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Prever montante a receber na próxima semana com base no comportamento da carteira.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-12',
    title: 'OCR de Comprovativos',
    description: 'Validação automática.',
    category: 'INNOVATION',
    tags: ['ai', 'vision'],
    impact: 'HIGH',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Ler automaticamente PDFs/Fotos de transferências e reconciliar.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-13',
    title: 'Personalização Dinâmica',
    description: 'Descontos inteligentes.',
    category: 'INNOVATION',
    tags: ['ai', 'pricing'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'IA decide oferta ótima de desconto para cada devedor.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-14',
    title: 'Voice-to-Text em Chamadas',
    description: 'Transcrição pesquisável.',
    category: 'INNOVATION',
    tags: ['ai', 'transcription'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Transcrição automática de chamadas de cobrança para texto.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-15',
    title: 'Enriquecimento via OSINT',
    description: 'Dados públicos.',
    category: 'INNOVATION',
    tags: ['data', 'intelligence'],
    impact: 'MEDIUM',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Buscar dados em fontes abertas para atualizar contactos.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-16',
    title: 'Geração de Vídeo Personalizado',
    description: 'Avatares AI (Synthesia).',
    category: 'INNOVATION',
    tags: ['ai', 'video'],
    impact: 'HIGH',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Enviar vídeo onde avatar diz o nome do devedor e explica a dívida.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-17',
    title: 'Self-Healing Workflows',
    description: 'Resiliência automática.',
    category: 'INNOVATION',
    tags: ['ai', 'automation'],
    impact: 'MEDIUM',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'Se SMS falhar, IA tenta automaticamente Email, depois WhatsApp.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-18',
    title: 'Simulação Digital Twin',
    description: 'Testar estratégias.',
    category: 'INNOVATION',
    tags: ['ai', 'simulation'],
    impact: 'LOW',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Simular impacto de mudança de estratégia na carteira virtualmente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-19',
    title: 'Assistente Jurídico AI',
    description: 'RAG para leis.',
    category: 'INNOVATION',
    tags: ['ai', 'legal'],
    impact: 'MEDIUM',
    effort: 'HIGH',
    status: 'active',
    fullAnalysis: 'Chatbot interno para agentes tirarem dúvidas sobre legislação de cobrança.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inno-20',
    title: 'Gamification da Cobrança',
    description: 'Metas dinâmicas.',
    category: 'INNOVATION',
    tags: ['ai', 'hr'],
    impact: 'LOW',
    effort: 'MEDIUM',
    status: 'active',
    fullAnalysis: 'IA define metas personalizadas por agente baseada na dificuldade da carteira.',
    createdAt: new Date().toISOString()
  }
];

export const useDevLabStore = create<DevLabState>()(
  persist(
    (set) => ({
      suggestions: initialSuggestions,

      addSuggestion: (data) => set((state) => ({
        suggestions: [
          {
            ...data,
            id: Math.random().toString(36).substring(2, 9),
            status: 'active',
            createdAt: new Date().toISOString(),
          },
          ...state.suggestions,
        ],
      })),

      markAsCompleted: (id) => set((state) => ({
        suggestions: state.suggestions.map((s) =>
          s.id === id ? { ...s, status: 'completed' } : s
        ),
      })),

      markAsTrash: (id) => set((state) => ({
        suggestions: state.suggestions.map((s) =>
          s.id === id ? { ...s, status: 'trash' } : s
        ),
      })),

      restoreFromTrash: (id) => set((state) => ({
        suggestions: state.suggestions.map((s) =>
          s.id === id ? { ...s, status: 'active' } : s
        ),
      })),

      permanentDelete: (id) => set((state) => ({
        suggestions: state.suggestions.filter((s) => s.id !== id),
      })),

      updateSuggestion: (id, updates) => set((state) => ({
        suggestions: state.suggestions.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      })),
    }),
    {
      name: 'devlab-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
