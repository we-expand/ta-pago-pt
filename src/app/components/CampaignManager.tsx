import React, { useState } from 'react';
import { 
  Clock, 
  Mail, 
  MessageSquare, 
  Phone, 
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Send,
  Eye,
  Settings,
  Calendar,
  User,
  Euro,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Download,
  Mic,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import VoiceAgentDemo from './VoiceAgentDemo';
import ConversationalVoiceAgent from './ConversationalVoiceAgent';

// Mock data para Timeline
const mockActions = [
  {
    id: 'action-1',
    debtorName: 'Maria Silva',
    debtorId: 'demo-debtor-1',
    type: 'email',
    status: 'delivered',
    message: 'Olá Maria, entrámos em contacto para informar sobre o saldo pendente de €2.450,00. Estamos disponíveis para negociar condições especiais de pagamento.',
    date: '03/03/2026',
    time: '14:23',
    amount: 2450.00,
    score: 85,
    aiGenerated: true,
    metadata: {
      openRate: true,
      clickRate: false
    }
  },
  {
    id: 'action-2',
    debtorName: 'Pedro Oliveira',
    debtorId: 'demo-debtor-4',
    type: 'email',
    status: 'opened',
    message: 'Enviada proposta de quitação com 20% de desconto a pronto ou parcelamento em 10x de €320. A aguardar resposta.',
    date: '02/03/2026',
    time: '16:45',
    amount: 3200.00,
    score: 88,
    aiGenerated: true,
    metadata: {
      openCount: 3,
      lastOpened: '03/03/2026 09:15'
    }
  },
  {
    id: 'action-3',
    debtorName: 'Miguel Alves',
    debtorId: 'demo-debtor-8',
    type: 'email',
    status: 'sent',
    message: 'E-mail de boas-vindas',
    date: '01/03/2026',
    time: '10:15',
    amount: 750.00,
    score: 70,
    aiGenerated: false,
    metadata: {}
  },
  {
    id: 'action-4',
    debtorName: 'Ana Costa',
    debtorId: 'demo-debtor-12',
    type: 'sms',
    status: 'delivered',
    message: 'Olá Ana! Tá Pago aqui. Pagamento de €890 vence hoje. Ligação para quitação: tapago.pt/p/a12x',
    date: '03/03/2026',
    time: '09:00',
    amount: 890.00,
    score: 92,
    aiGenerated: false,
    metadata: {}
  },
  {
    id: 'action-5',
    debtorName: 'João Santos',
    debtorId: 'demo-debtor-15',
    type: 'whatsapp',
    status: 'read',
    message: 'Bom dia, João! 👋\n\nReparámos que o pagamento de €1.250 ainda está pendente.\n\nQuer negociar? Temos condições especiais! 💰',
    date: '03/03/2026',
    time: '08:30',
    amount: 1250.00,
    score: 78,
    aiGenerated: true,
    metadata: {
      readAt: '03/03/2026 08:35'
    }
  },
  {
    id: 'action-6',
    debtorName: 'Carla Ferreira',
    debtorId: 'demo-debtor-18',
    type: 'voice',
    status: 'completed',
    message: 'Chamada automatizada concluída. Duração: 2min 34s. Cliente aceitou proposta de parcelamento.',
    date: '02/03/2026',
    time: '15:20',
    amount: 4500.00,
    score: 95,
    aiGenerated: true,
    metadata: {
      duration: '2:34',
      outcome: 'accepted',
      recordingUrl: '/demo-voice-call.mp3'
    }
  }
];

const channelConfig = {
  email: { 
    icon: Mail, 
    label: 'Email', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  sms: { 
    icon: MessageSquare, 
    label: 'SMS', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  whatsapp: { 
    icon: MessageSquare, 
    label: 'WhatsApp', 
    color: 'text-green-600', 
    bg: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  voice: { 
    icon: Phone, 
    label: 'Voz', 
    color: 'text-orange-600', 
    bg: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
};

const statusConfig: any = {
  sent: { label: 'Enviado', color: 'bg-slate-100 text-slate-600' },
  delivered: { label: 'Entregue', color: 'bg-blue-100 text-blue-700' },
  opened: { label: 'Aberto', color: 'bg-purple-100 text-purple-700' },
  read: { label: 'Lido', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700' }
};

export default function CampaignManager() {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Debug log
  React.useEffect(() => {
    console.log('[CAMPAIGN MANAGER] Componente carregado com sucesso!');
    console.log('[CAMPAIGN MANAGER] Total de acções mockadas:', mockActions.length);
  }, []);

  const filteredActions = mockActions.filter(action => {
    const matchesChannel = selectedChannel === 'all' || action.type === selectedChannel;
    const matchesSearch = action.debtorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-xl">
              <Clock className="size-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Timeline de Ações
            </h1>
          </div>
          <p className="text-slate-500 text-lg font-light">
            Visualize e crie ações de cobrança multicanal
          </p>
        </div>
        <Button 
          onClick={() => setShowCampaignModal(true)}
          className="h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 px-8 transition-all hover:scale-105"
        >
          <Plus className="mr-2 size-5" />
          Nova Ação
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] bg-white rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <Input 
                placeholder="Buscar por devedor ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-slate-200 bg-slate-50/50"
              />
            </div>

            {/* Channel Filter Tabs */}
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
              <button
                onClick={() => setSelectedChannel('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedChannel === 'all' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              {Object.entries(channelConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedChannel(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedChannel === key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="size-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredActions.map((action, index) => {
            const channel = channelConfig[action.type as keyof typeof channelConfig];
            const ChannelIcon = channel.icon;
            const status = statusConfig[action.status];

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] bg-white rounded-3xl hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Channel Icon */}
                      <div className={`${channel.bg} ${channel.color} p-3 rounded-2xl`}>
                        <ChannelIcon className="size-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-900 text-lg">{action.debtorName}</h3>
                              <span className="text-xs text-slate-400 font-mono">{action.debtorId}</span>
                              {action.aiGenerated && (
                                <Badge className="bg-purple-100 text-purple-700 border-none">
                                  <Sparkles className="size-3 mr-1" />
                                  IA
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-1">
                              {channel.label} de cobrança enviado
                            </p>
                          </div>
                          
                          {/* Status Badge */}
                          <Badge className={`${status.color} border-none font-medium`}>
                            {status.label}
                          </Badge>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            {action.date}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-4" />
                            {action.time}
                          </div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-700">
                            <Euro className="size-4" />
                            {action.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        {/* Message Preview */}
                        <div className={`bg-slate-50 border ${channel.borderColor} rounded-2xl p-4 text-sm text-slate-700 leading-relaxed`}>
                          {action.message}
                        </div>

                        {/* Additional Metadata */}
                        {action.metadata && Object.keys(action.metadata).length > 0 && (
                          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                            {action.metadata.openRate && (
                              <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                Email entregue com sucesso
                              </div>
                            )}
                            {action.metadata.openCount && (
                              <div className="flex items-center gap-1 text-purple-600 font-medium">
                                <Eye className="size-3" />
                                Aberto {action.metadata.openCount} vezes
                              </div>
                            )}
                            {action.metadata.readAt && (
                              <div className="flex items-center gap-1 text-green-600 font-medium">
                                <Eye className="size-3" />
                                Lido em {action.metadata.readAt}
                              </div>
                            )}
                            {action.metadata.outcome === 'accepted' && (
                              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                ✓ Cliente aceitou proposta
                              </div>
                            )}
                          </div>
                        )}

                        {/* Score Badge */}
                        <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 rounded-full border border-emerald-200">
                          <span className="text-xs text-slate-600">Score:</span>
                          <span className="text-sm font-bold text-emerald-600">{action.score}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-9 rounded-xl hover:bg-slate-100">
                          <Eye className="size-4 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-9 rounded-xl hover:bg-slate-100">
                          <Edit className="size-4 text-slate-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Campaign Configuration Modal */}
      <AnimatePresence>
        {showCampaignModal && (
          <CampaignConfigModal onClose={() => setShowCampaignModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Campaign Configuration Modal Component
function CampaignConfigModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('email');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Simulate audio playback
  const totalDuration = 154; // 2:34

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate playback
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Configurar Nova Campanha</h2>
              <p className="text-slate-500 mt-1">Escolha o canal e personalize sua mensagem</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <span className="text-2xl">×</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full bg-slate-100 p-1 rounded-2xl mb-6">
              <TabsTrigger value="email" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail className="size-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <MessageSquare className="size-4 mr-2" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <MessageSquare className="size-4 mr-2" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="voice" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Phone className="size-4 mr-2" />
                Voz IA
              </TabsTrigger>
            </TabsList>

            {/* Email Tab */}
            <TabsContent value="email" className="space-y-6">
              <EmailCampaignConfig />
            </TabsContent>

            {/* SMS Tab */}
            <TabsContent value="sms" className="space-y-6">
              <SMSCampaignConfig />
            </TabsContent>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp" className="space-y-6">
              <WhatsAppCampaignConfig />
            </TabsContent>

            {/* Voice Tab - THE MAIN DEMO! */}
            <TabsContent value="voice" className="space-y-6">
              <ConversationalVoiceAgent />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onClose} className="rounded-full">
              Cancelar
            </Button>
            <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-8">
              <Send className="size-4 mr-2" />
              Agendar Campanha
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Email Campaign Configuration
function EmailCampaignConfig() {
  const [subject, setSubject] = useState('Saldo Pendente - {{company_name}}');
  const [body, setBody] = useState(`Olá {{debtor_name}},

Entramos em contacto para informar sobre o saldo pendente de {{amount}}.

Estamos disponíveis para negociar condições especiais de pagamento. Pode responder directamente a este email ou ligar para {{phone}}.

Obrigado,
Equipa {{company_name}}`);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Editor */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Assunto</label>
          <Input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mensagem</label>
          <Textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-xl min-h-[300px]"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 font-medium mb-2">✨ Variáveis Disponíveis:</p>
          <div className="flex flex-wrap gap-2">
            {['{{debtor_name}}', '{{amount}}', '{{company_name}}', '{{phone}}', '{{due_date}}'].map(v => (
              <code key={v} className="bg-white px-2 py-1 rounded text-xs text-blue-700 font-mono">{v}</code>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Preview</label>
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
          <div className="border-b border-slate-200 pb-4 mb-4">
            <p className="text-xs text-slate-500 mb-1">De: cobranca@tapago.pt</p>
            <p className="text-xs text-slate-500 mb-3">Para: maria.silva@email.pt</p>
            <h3 className="font-bold text-slate-900">{subject.replace('{{company_name}}', 'Empresa Demo')}</h3>
          </div>
          <div className="text-sm text-slate-700 whitespace-pre-line">
            {body
              .replace('{{debtor_name}}', 'Maria Silva')
              .replace('{{amount}}', '€2.450,00')
              .replace(/{{company_name}}/g, 'Empresa Demo')
              .replace('{{phone}}', '+351 21 123 4567')
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// SMS Campaign Configuration
function SMSCampaignConfig() {
  const [message, setMessage] = useState('Olá {{name}}! Pagamento de {{amount}} vence hoje. Link: tapago.pt/p/{{id}}');
  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Mensagem SMS</label>
            <span className="text-xs text-slate-500">{charCount}/160 ({smsCount} SMS)</span>
          </div>
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl min-h-[200px]"
            maxLength={320}
          />
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-900 font-medium mb-2">📱 Dica SMS:</p>
          <p className="text-xs text-purple-700">Mantenha mensagens curtas e inclua sempre um link de ação.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Preview</label>
        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm">
          <div className="bg-slate-800 rounded-2xl p-4">
            <p className="text-white text-sm leading-relaxed">
              {message
                .replace('{{name}}', 'João')
                .replace('{{amount}}', '€890')
                .replace('{{id}}', 'a12x')
              }
            </p>
            <p className="text-slate-500 text-xs mt-2">Agora</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// WhatsApp Campaign Configuration
function WhatsAppCampaignConfig() {
  const [message, setMessage] = useState(`Bom dia, {{name}}! 👋

Vimos que o pagamento de {{amount}} ainda está pendente.

Quer negociar? Temos condições especiais! 💰

Responda SIM para falar connosco.`);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mensagem WhatsApp</label>
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl min-h-[250px]"
          />
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-900 font-medium mb-2">💚 Dica WhatsApp:</p>
          <p className="text-xs text-green-700">Use emojis e linguagem casual para maior engajamento.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Preview</label>
        <div className="bg-[#e5ddd5] rounded-2xl p-4 shadow-xl max-w-sm">
          <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              {message
                .replace('{{name}}', 'Pedro')
                .replace('{{amount}}', '€1.250')
              }
            </p>
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-xs text-slate-500">14:30</span>
              <span className="text-blue-500">✓✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}