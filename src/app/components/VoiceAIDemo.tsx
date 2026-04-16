import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  PhoneOff, 
  User, 
  Bot,
  Loader,
  CheckCircle2,
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase';

interface ConversationMessage {
  speaker: string;
  text: string;
  timestamp: string;
}

export default function VoiceAIDemo() {
  const [selectedVoice, setSelectedVoice] = useState<'NkpT2jezTenCDRKHkWiX' | 'RlGHmE2fztwdBDat0jYf'>('NkpT2jezTenCDRKHkWiX');
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const voices = [
    {
      id: 'NkpT2jezTenCDRKHkWiX',
      name: 'Benedita',
      gender: 'Feminino',
      description: 'Voz empática e conversacional',
      avatar: '👩‍💼',
    },
    {
      id: 'RlGHmE2fztwdBDat0jYf',
      name: 'Diogo',
      gender: 'Masculino',
      description: 'Voz profissional e assertiva',
      avatar: '👨‍💼',
    }
  ];

  const createAgent = async () => {
    try {
      setIsLoading(true);
      console.log('[VOICE AI DEMO] Creating agent...');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/voice-ai/create-agent`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voiceId: selectedVoice,
            debtorName: 'João Silva',
            debtAmount: 2500,
            companyName: 'Tá Pago',
            objective: 'negotiate_payment'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create agent');
      }

      const data = await response.json();
      console.log('[VOICE AI DEMO] Agent created:', data);
      setAgentId(data.agentId);
      return data.agentId;

    } catch (error: any) {
      console.error('[VOICE AI DEMO] Error creating agent:', error);
      alert('Erro ao criar agente: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startCall = async () => {
    let currentAgentId = agentId;

    // Cria agente se não existir
    if (!currentAgentId) {
      currentAgentId = await createAgent();
      if (!currentAgentId) return;
    }

    try {
      setIsLoading(true);
      setIsCallActive(true);
      setConversation([]);

      console.log('[VOICE AI DEMO] Starting call...');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/voice-ai/start-call`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentId: currentAgentId,
            phoneNumber: '+351912345678',
            debtorName: 'João Silva'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start call');
      }

      const data = await response.json();
      console.log('[VOICE AI DEMO] Call started:', data);
      setCallId(data.callId);

      // Simula conversação progressiva (modo demo)
      simulateConversation();

    } catch (error: any) {
      console.error('[VOICE AI DEMO] Error starting call:', error);
      alert('Erro ao iniciar chamada: ' + error.message);
      setIsCallActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateConversation = () => {
    const agentName = selectedVoice === 'NkpT2jezTenCDRKHkWiX' ? 'Benedita' : 'Diogo';
    
    const messages: ConversationMessage[] = [
      {
        speaker: agentName,
        text: `Bom dia! Fala ${agentName} da Tá Pago. Está a falar com João Silva?`,
        timestamp: '00:00'
      },
      {
        speaker: 'João Silva',
        text: 'Sim, sou eu. O que deseja?',
        timestamp: '00:05'
      },
      {
        speaker: agentName,
        text: 'Estou a ligar para falar sobre a sua situação financeira connosco. Tem um momento para conversarmos?',
        timestamp: '00:10'
      },
      {
        speaker: 'João Silva',
        text: 'Está bem, mas não tenho muito tempo.',
        timestamp: '00:18'
      },
      {
        speaker: agentName,
        text: 'Compreendo perfeitamente. Vou ser breve. Tenho aqui uma proposta para regularizar o seu caso com condições especiais. Gostaria de conhecer?',
        timestamp: '00:22'
      },
      {
        speaker: 'João Silva',
        text: 'Quanto é que tenho de pagar?',
        timestamp: '00:32'
      },
      {
        speaker: agentName,
        text: 'Posso oferecer um desconto de 20% se liquidar hoje, ou então podemos dividir em 3 parcelas sem juros. O que prefere?',
        timestamp: '00:35'
      },
      {
        speaker: 'João Silva',
        text: 'As 3 parcelas parece-me melhor.',
        timestamp: '00:45'
      },
      {
        speaker: agentName,
        text: 'Excelente escolha! Vou já registar o acordo. A primeira parcela fica para o próximo dia 15. Confirma?',
        timestamp: '00:48'
      },
      {
        speaker: 'João Silva',
        text: 'Sim, está bem.',
        timestamp: '00:58'
      },
      {
        speaker: agentName,
        text: 'Perfeito! Vai receber um SMS com todos os detalhes. Muito obrigado pela colaboração e bom dia!',
        timestamp: '01:00'
      }
    ];

    // Adiciona mensagens progressivamente
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setConversation(prev => [...prev, msg]);
        
        // Termina chamada no final
        if (index === messages.length - 1) {
          setTimeout(() => {
            setIsCallActive(false);
          }, 2000);
        }
      }, index * 3000); // 3 segundos entre cada mensagem
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    setConversation([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-indigo-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Bot className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              🎙️ Agente de Voz IA Conversacional
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Sistema inteligente que DIALOGA em tempo real - não apenas "dá recado"!
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-purple-300 mb-1">
                ✨ Sistema Conversacional Inteligente
              </div>
              <div className="text-xs text-white/70">
                Este agente não apenas toca uma mensagem gravada. Ele <strong>ouve, compreende e responde</strong> em tempo real, 
                negociando valores, respondendo objeções e fechando acordos de forma natural e empática.
              </div>
            </div>
          </div>
        </div>

        {/* Voice Selection */}
        {!isCallActive && (
          <div className="mb-6">
            <div className="text-sm font-semibold text-white/80 mb-3">
              Selecionar Voz do Agente:
            </div>
            <div className="grid grid-cols-2 gap-3">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedVoice === voice.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">{voice.avatar}</div>
                  <div className="text-sm font-semibold text-white">
                    {voice.name}
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {voice.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex gap-3 mb-6">
          {!isCallActive ? (
            <button
              onClick={startCall}
              disabled={isLoading}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-emerald-500/50"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  A iniciar...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Iniciar Chamada Demo
                </>
              )}
            </button>
          ) : (
            <button
              onClick={endCall}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-red-500/50"
            >
              <PhoneOff className="w-5 h-5" />
              Terminar Chamada
            </button>
          )}
        </div>

        {/* Conversation Display */}
        <AnimatePresence>
          {isCallActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-white/10 mb-4"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Chamada em Curso</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Clock className="w-3 h-3" />
                  {conversation.length > 0 ? conversation[conversation.length - 1].timestamp : '00:00'}
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {conversation.length === 0 && (
                  <div className="text-center py-8 text-white/40 text-sm">
                    <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                    A ligar...
                  </div>
                )}

                {conversation.map((msg, index) => {
                  const isAgent = msg.speaker !== 'João Silva';
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isAgent ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isAgent ? 'bg-purple-500/20' : 'bg-blue-500/20'
                      }`}>
                        {isAgent ? (
                          <Bot className="w-4 h-4 text-purple-400" />
                        ) : (
                          <User className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className={`flex-1 ${isAgent ? '' : 'text-right'}`}>
                        <div className="text-xs text-white/40 mb-1">
                          {msg.speaker} · {msg.timestamp}
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-xl ${
                          isAgent
                            ? 'bg-purple-500/20 text-purple-100'
                            : 'bg-blue-500/20 text-blue-100'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Stats */}
        {!isCallActive && conversation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-xs text-white/60">Resultado</div>
              <div className="text-sm font-semibold text-emerald-400">
                Acordo Fechado
              </div>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-xs text-white/60">Sentimento</div>
              <div className="text-sm font-semibold text-purple-400">
                Positivo
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <Clock className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-xs text-white/60">Duração</div>
              <div className="text-sm font-semibold text-blue-400">
                1:10 min
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}