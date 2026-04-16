import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import FeatureExplanationModal from './FeatureExplanationModal';
import { 
  Brain,
  MessageSquare,
  Mail,
  Phone,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Target,
  Users,
  Zap,
  ArrowUpRight,
  Bell,
  CreditCard,
  BarChart3,
  Calendar,
  Smartphone,
  Globe,
  Shield,
  Percent
} from 'lucide-react';

// Funções para gerar dados randomizados
const generateRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomPrice = (min: number, max: number) => {
  const value = (Math.random() * (max - min) + min).toFixed(1);
  return `€${value}K`;
};

const generateRandomPercent = () => {
  return `${generateRandomValue(60, 98)}%`;
};

const names = [
  'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Ferreira', 'Carlos Mendes',
  'Luís Alves', 'Rita Sousa', 'Miguel Rocha', 'Sofia Lima', 'Bruno Dias',
  'Paula Castro', 'Tiago Martins', 'Catarina Lopes', 'Ricardo Nunes', 'Inês Rodrigues',
  'Fernando Gomes', 'Beatriz Pinto', 'André Carvalho', 'Mariana Ramos', 'Vasco Oliveira'
];

const actionTypes = [
  { icon: MessageSquare, bg: 'green', name: 'WhatsApp enviado', category: 'Comunicação Multi-Canal' },
  { icon: Mail, bg: 'blue', name: 'Email agendado', category: 'Automação Inteligente' },
  { icon: Phone, bg: 'purple', name: 'Chamada sugerida', category: 'Score Preditivo' },
  { icon: Brain, bg: 'purple', name: 'Alto potencial', category: 'IA Preditiva' },
  { icon: Target, bg: 'indigo', name: 'Prioridade máxima', category: 'Priorização Automática' },
  { icon: Zap, bg: 'amber', name: 'Ação imediata', category: 'Automação em Tempo Real' },
  { icon: CheckCircle, bg: 'green', name: 'Pago via MB Way', category: 'Gateway de Pagamento' },
  { icon: CreditCard, bg: 'emerald', name: 'Cartão confirmado', category: 'Gateway de Pagamento' },
  { icon: DollarSign, bg: 'teal', name: 'Transferência OK', category: 'Gateway de Pagamento' },
  { icon: Clock, bg: 'blue', name: 'Agendado', category: 'Timeline de Cobrança' },
  { icon: Bell, bg: 'amber', name: 'Lembrete enviado', category: 'Automação Inteligente' },
  { icon: Users, bg: 'cyan', name: 'Segmento criado', category: 'Segmentação IA' },
  { icon: BarChart3, bg: 'pink', name: 'Análise completa', category: 'Analytics Avançado' },
  { icon: Calendar, bg: 'violet', name: 'Follow-up programado', category: 'Timeline de Cobrança' },
  { icon: Smartphone, bg: 'lime', name: 'SMS enviado', category: 'Comunicação Multi-Canal' }
];

// Feature explanations
const featureExplanations: any = {
  'WhatsApp enviado': {
    title: 'WhatsApp Automatizado',
    description: 'Envio inteligente de mensagens via WhatsApp com personalização baseada em IA',
    details: [
      'A IA analisa o perfil do devedor e cria mensagens personalizadas automaticamente',
      'Sistema detecta o melhor horário para envio baseado em padrões históricos de resposta',
      'Template dinâmico ajusta tom e urgência baseado no score de probabilidade de pagamento',
      'Rastreamento de leitura e resposta em tempo real com escalação automática'
    ],
    benefits: [
      'Taxa de resposta 3x maior que email',
      'Custo 70% menor que ligação telefônica',
      'Personalização em escala',
      'Compliance total com LGPD'
    ],
    audioText: 'O WhatsApp automatizado da TaPago utiliza inteligência artificial para enviar mensagens personalizadas no momento ideal. A IA analisa o perfil de cada devedor, histórico de interações e padrões de comportamento para criar mensagens com o tom perfeito. O sistema detecta automaticamente o melhor horário para contato, aumentando em 3 vezes a taxa de resposta comparado ao email tradicional, e mantém compliance total com a LGPD.',
    icon: MessageSquare,
    color: 'green',
    category: 'Comunicação Multi-Canal'
  },
  'Email agendado': {
    title: 'Email Inteligente Agendado',
    description: 'Sistema de email automatizado com agendamento preditivo baseado em IA',
    details: [
      'IA prevê o melhor dia e horário para envio baseado em dados históricos do devedor',
      'Conteúdo personalizado com base em motivo de inadimplência detectado pela IA',
      'A/B testing automático de subject lines para maximizar taxa de abertura',
      'Sequência de follow-up ajustada dinamicamente baseada em engajamento'
    ],
    benefits: [
      'Taxa de abertura 45% acima da média',
      'Timing perfeito aumenta conversão',
      'Reduz spam score',
      'ROI mensurável em tempo real'
    ],
    audioText: 'O sistema de email inteligente da TaPago vai além do agendamento simples. Nossa IA prevê o melhor momento para cada contato baseado em padrões históricos de comportamento, personaliza o conteúdo detectando o motivo da inadimplência, e ajusta automaticamente a sequência de follow-up. Com taxa de abertura 45% acima da média do mercado, o sistema garante que cada mensagem chegue no momento perfeito para maximizar a probabilidade de pagamento.',
    icon: Mail,
    color: 'blue',
    category: 'Automação Inteligente'
  },
  'Alto potencial': {
    title: 'Score Preditivo de Alto Potencial',
    description: 'IA identifica devedores com maior probabilidade de pagamento imediato',
    details: [
      'Machine learning analisa mais de 50 variáveis para calcular score de probabilidade',
      'Histórico de pagamentos, sazonalidade, setor econômico e comportamento digital',
      'Score é atualizado em tempo real a cada nova interação ou dado externo',
      'Priorização automática da fila de cobrança baseada em potencial de recuperação'
    ],
    benefits: [
      'Foque nos 20% que geram 80% do resultado',
      'Aumente taxa de recuperação em 67%',
      'Otimize recursos do time',
      'Decisões baseadas em dados, não intuição'
    ],
    audioText: 'O score preditivo de alto potencial é o cérebro da TaPago. Nossa IA analisa mais de 50 variáveis incluindo histórico de pagamentos, sazonalidade, setor econômico e comportamento digital para identificar quais devedores têm maior probabilidade de pagar imediatamente. O score é atualizado em tempo real, permitindo que sua equipe foque nos 20% dos casos que geram 80% dos resultados, aumentando a taxa de recuperação em até 67%.',
    icon: Brain,
    color: 'purple',
    category: 'IA Preditiva'
  },
  'Pago via MB Way': {
    title: 'Gateway MB Way Integrado',
    description: 'Pagamento instantâneo via MB Way com confirmação em tempo real',
    details: [
      'Link de pagamento MB Way gerado automaticamente e enviado via SMS/WhatsApp',
      'Confirmação instantânea com webhook e atualização do status em tempo real',
      'Parcelamento automático disponível com aprovação via IA',
      'Reconciliação bancária automática e baixa de título'
    ],
    benefits: [
      'Pagamento em menos de 2 minutos',
      'Zero atrito para o devedor',
      'Confirmação instantânea',
      'Sem necessidade de dados bancários'
    ],
    audioText: 'O gateway MB Way integrado da TaPago permite que devedores paguem em menos de 2 minutos via smartphone. O sistema gera automaticamente um link de pagamento personalizado, envia via SMS ou WhatsApp, e processa a confirmação em tempo real. Com zero atrito para o devedor e reconciliação bancária automática, é o método de pagamento preferido em Portugal, com taxa de conversão 3 vezes maior que boleto tradicional.',
    icon: CreditCard,
    color: 'emerald',
    category: 'Gateway de Pagamento'
  },
  'Segmento criado': {
    title: 'Segmentação Automática por IA',
    description: 'IA cria segmentos dinâmicos de devedores para estratégias personalizadas',
    details: [
      'Clustering automático baseado em comportamento, valor, setor e probabilidade',
      'Segmentos são atualizados dinamicamente conforme novos dados surgem',
      'Estratégias de cobrança específicas para cada segmento (tom, canal, timing)',
      'Análise de performance por segmento para otimização contínua'
    ],
    benefits: [
      'Mensagens hiperpersonalizadas',
      'Estratégias diferentes para perfis diferentes',
      'Melhora contínua via aprendizado',
      'Maximiza recuperação por segmento'
    ],
    audioText: 'A segmentação automática por IA da TaPago revoluciona a cobrança. O sistema cria dinamicamente grupos de devedores com características similares usando clustering avançado. Cada segmento recebe estratégias personalizadas de canal, timing e tom de mensagem. Os segmentos evoluem automaticamente conforme novos dados surgem, garantindo que cada devedor receba a abordagem ideal para seu perfil, maximizando a taxa de recuperação.',
    icon: Users,
    color: 'cyan',
    category: 'Segmentação IA'
  }
};

// Generate random pages
const generateRandomPage = (id: number) => {
  const pageTypes = [
    'Dashboard', 'Score Preditivo', 'Pagamentos', 'Automação', 
    'Campanhas', 'Analytics', 'Timeline', 'Comunicação'
  ];
  
  const type = pageTypes[id % pageTypes.length];
  
  return {
    id,
    title: `${type} - ${['Visão Geral', 'IA', 'Tempo Real', 'Ativo'][generateRandomValue(0, 3)]}`,
    stats: [
      { 
        label: ['Recuperado', 'Enviado', 'Convertido', 'Processado'][generateRandomValue(0, 3)], 
        value: generateRandomPrice(5, 150), 
        change: `+${generateRandomValue(5, 35)}%`, 
        color: ['green', 'indigo', 'purple', 'blue'][generateRandomValue(0, 3)]
      },
      { 
        label: ['Devedores', 'Ações', 'Campanhas', 'Mensagens'][generateRandomValue(0, 3)], 
        value: `${generateRandomValue(50, 500)}`, 
        change: ['Ativos', 'Hoje', 'Este mês', 'Agora'][generateRandomValue(0, 3)], 
        color: ['slate', 'cyan', 'teal', 'pink'][generateRandomValue(0, 3)]
      },
      { 
        label: ['Score Médio', 'Taxa Conv.', 'ROI', 'Precisão'][generateRandomValue(0, 3)], 
        value: generateRandomPercent(), 
        change: `+${generateRandomValue(2, 15)}%`, 
        color: ['indigo', 'purple', 'pink', 'orange'][generateRandomValue(0, 3)]
      }
    ],
    actions: Array.from({ length: 3 }, () => {
      const action = actionTypes[generateRandomValue(0, actionTypes.length - 1)];
      return {
        ...action,
        user: names[generateRandomValue(0, names.length - 1)],
        value: generateRandomPrice(0.5, 15),
        score: generateRandomPercent()
      };
    })
  };
};

const PAGES = Array.from({ length: 8 }, (_, i) => generateRandomPage(i + 1));

export default function DashboardPreview() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Garantir que o componente seja inicializado
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isHovered) return; // Pause auto-rotation when hovering

    // Intervalo de 12-15 segundos (tempo para o usuário interagir)
    const randomInterval = 12000 + Math.random() * 3000;
    
    const timer = setInterval(() => {
      setDirection(Math.random() > 0.5 ? 1 : -1);
      setCurrentPageIndex((prev) => (prev + 1) % PAGES.length);
    }, randomInterval);

    return () => clearInterval(timer);
  }, [isHovered]);

  const currentPage = PAGES[currentPageIndex];

  // Se não inicializado, não renderizar nada
  if (!isInitialized || !currentPage) {
    return (
      <div className="relative w-full h-full min-h-[320px] flex items-center justify-center">
        <div className="text-indigo-600">Carregando...</div>
      </div>
    );
  }

  // Variants para animações de "folhagem" com efeito mola
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.85
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      rotateY: direction > 0 ? -45 : 45,
      scale: 0.85
    })
  };

  const handleActionClick = (action: any) => {
    const explanation = featureExplanations[action.name];
    if (explanation) {
      setSelectedFeature(explanation);
    }
  };

  return (
    <>
      <motion.div
        className="relative w-full h-full"
        animate={{ 
          y: [0, -15, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          {/* Mini Dashboard UI */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-[320px]">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="size-2.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="size-2.5 rounded-full bg-yellow-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div 
                  className="size-2.5 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
              </div>

              {/* Page indicator */}
              <div className="flex gap-1.5">
                {PAGES.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentPageIndex 
                        ? 'bg-indigo-600 w-8' 
                        : 'bg-slate-300 w-1.5'
                    }`}
                    animate={i === currentPageIndex ? {
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: i === currentPageIndex ? Infinity : 0
                    }}
                    onClick={() => setCurrentPageIndex(i)}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Animated content area */}
            <div className="relative perspective-1000" style={{ perspective: '1000px' }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentPage.id}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { 
                      type: "spring", 
                      stiffness: 150,
                      damping: 20,
                      mass: 1.2,
                      bounce: 0.25
                    },
                    opacity: { duration: 0.4 },
                    rotateY: { 
                      type: "spring",
                      stiffness: 120,
                      damping: 18
                    },
                    scale: { 
                      type: "spring",
                      stiffness: 180,
                      damping: 22
                    }
                  }}
                  className="w-full"
                >
                  {/* Page Title */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="size-5 text-indigo-600" />
                      </motion.div>
                      <h3 className="text-sm font-bold text-slate-700">{currentPage.title}</h3>
                    </div>
                    <motion.div 
                      className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    />
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {currentPage.stats.map((stat, i) => (
                      <motion.div 
                        key={i}
                        className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.4 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <div className="text-xs text-slate-600 mb-1">{stat.label}</div>
                        <motion.div 
                          className={`text-2xl font-black text-${stat.color}-600 mb-1`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            delay: 0.5 + (i * 0.1), 
                            type: "spring",
                            stiffness: 200 
                          }}
                        >
                          {stat.value}
                        </motion.div>
                        <motion.div 
                          className={`text-xs text-${stat.color}-600 flex items-center gap-1 font-semibold`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + (i * 0.1) }}
                        >
                          <ArrowUpRight className="size-3" />
                          {stat.change}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions List */}
                  <motion.div 
                    id="acoes-da-ia"
                    className="bg-white rounded-xl p-4 shadow-lg scroll-mt-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <a 
                        href="#acoes-da-ia" 
                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2 group"
                      >
                        <span>Ações da IA</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -5 }}
                          whileHover={{ x: 0 }}
                        >
                          🔗
                        </motion.div>
                      </a>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Zap className="size-3.5 text-indigo-600" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      {currentPage.actions.map((action, i) => (
                        <motion.div 
                          key={i}
                          className={`flex items-center gap-2.5 p-2.5 bg-${action.bg}-50 rounded-lg border border-${action.bg}-100 cursor-pointer group hover:shadow-md`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + (i * 0.15), duration: 0.4 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(action);
                          }}
                        >
                          <motion.div
                            className={`size-9 rounded-lg bg-${action.bg}-100 flex items-center justify-center flex-shrink-0`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <action.icon className={`size-4 text-${action.bg}-600`} />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition-colors">
                              {action.name}
                            </div>
                            <div className="text-[10px] text-slate-600 truncate">{action.user} • {action.value}</div>
                          </div>
                          <motion.div 
                            className={`text-xs font-bold text-${action.bg}-600 px-2.5 py-1 bg-white rounded-lg shadow-sm flex-shrink-0`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              delay: 1 + (i * 0.15), 
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {action.score}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Floating elements around dashboard */}
        <motion.div 
          className="absolute -top-8 -right-8 size-40 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-60"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-8 -left-8 size-40 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-60"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </motion.div>

      {/* Feature Explanation Modal */}
      <FeatureExplanationModal
        isOpen={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
      />
    </>
  );
}