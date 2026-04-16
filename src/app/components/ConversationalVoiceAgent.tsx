import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Brain, TrendingUp, AlertCircle, CheckCircle2, MessageCircle, Zap, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import GoogleTTSSetup from './GoogleTTSSetup';

interface Message {
  id: string;
  role: 'agent' | 'debtor';
  text: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: string;
}

interface DebtorProfile {
  name: string;
  debt: number;
  dueDate: string;
  phone: string;
}

export default function ConversationalVoiceAgent() {
  const [callActive, setCallActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<string>('greeting');
  const [debtorMood, setDebtorMood] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [negotiationScore, setNegotiationScore] = useState(0);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const conversationContextRef = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const conversationTurnRef = useRef(0);

  const debtor: DebtorProfile = {
    name: 'Pedro Silva',
    debt: 2450,
    dueDate: '15 de Março',
    phone: '+351 912 345 678'
  };

  // Portuguese voice from Google Cloud TTS
  const VOICE_NAME = 'pt-PT-Wavenet-A'; // Neural Portuguese female voice

  // Helper: Convert base64 to Blob
  const base64ToBlob = (base64: string, type: string): Blob => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-PT';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log('[SPEECH] Listening started');
        setListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('[SPEECH] Heard:', transcript);
        handleDebtorResponse(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('[SPEECH] Error:', event.error);
        setListening(false);
        
        // Retry listening after error
        if (callActive && event.error !== 'aborted') {
          setTimeout(() => {
            if (recognitionRef.current && callActive && !speaking) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.log('[SPEECH] Could not restart after error');
              }
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('[SPEECH] Listening ended');
        setListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('[SPEECH] Speech Recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [callActive, speaking]);

  // AI Response Logic - analyzes debtor response and generates intelligent reply
  const generateAIResponse = (debtorText: string, context: string[], turnNumber: number): { text: string; intent: string; strategy: string } => {
    const lowerText = debtorText.toLowerCase();
    
    // Detect intent from debtor's response
    const detectIntent = (): string => {
      if (lowerText.includes('sim') || lowerText.includes('aceito') || lowerText.includes('concordo') || lowerText.includes('está bem') || lowerText.includes('ok')) {
        return 'accept';
      }
      if (lowerText.includes('não') || lowerText.includes('recuso') || lowerText.includes('impossível')) {
        return 'reject';
      }
      if (lowerText.includes('prazo') || lowerText.includes('tempo') || lowerText.includes('mês') || lowerText.includes('semana')) {
        return 'request_time';
      }
      if (lowerText.includes('desconto') || lowerText.includes('redução') || lowerText.includes('menos')) {
        return 'request_discount';
      }
      if (lowerText.includes('dinheiro') || lowerText.includes('dificuldade') || lowerText.includes('problema') || lowerText.includes('crise')) {
        return 'financial_difficulty';
      }
      if (lowerText.includes('humano') || lowerText.includes('pessoa') || lowerText.includes('atendente')) {
        return 'request_human';
      }
      if (lowerText.includes('depois') || lowerText.includes('amanhã') || lowerText.includes('próxima')) {
        return 'postpone';
      }
      if (lowerText.includes('bem') || lowerText.includes('bom') || lowerText.includes('tudo bem') || lowerText.includes('óptimo')) {
        return 'greeting_response';
      }
      return 'unclear';
    };

    const intent = detectIntent();
    let responseText = '';
    let newStrategy = currentStrategy;

    // Generate contextual, persuasive responses based on intent
    switch (intent) {
      case 'greeting_response':
        responseText = `Que bom ouvir isso! ${debtor.name}, estou a ligar em relação ao pagamento pendente de ${debtor.debt.toLocaleString('pt-PT')} euros, com vencimento no dia ${debtor.dueDate}. Gostaria de lhe propor algumas opções vantajosas para regularizar esta situação. Tem alguns minutos para conversarmos?`;
        newStrategy = 'initial_proposal';
        setNegotiationScore(prev => prev + 10);
        break;

      case 'accept':
        if (turnNumber <= 2) {
          // First acceptance - present options
          responseText = `Excelente, ${debtor.name}! Fico muito satisfeita. Tenho duas propostas para si: primeira opção, pagamento à vista com 20% de desconto, reduzindo para ${Math.ceil(debtor.debt * 0.8)} euros. Segunda opção, parcelamento em 4 vezes de ${Math.ceil(debtor.debt / 4)} euros sem juros. Qual prefere?`;
          newStrategy = 'presenting_options';
        } else {
          // Final acceptance
          responseText = `Perfeito, ${debtor.name}! Vou registar o seu acordo agora mesmo. Dentro de 5 minutos receberá um SMS com os dados de pagamento e o código de referência. Mais alguma dúvida que possa esclarecer?`;
          newStrategy = 'closing_success';
        }
        setNegotiationScore(prev => prev + 30);
        setDebtorMood('positive');
        break;

      case 'reject':
        responseText = `${debtor.name}, compreendo a sua hesitação. Mas deixe-me ser sincera consigo: se não regularizarmos isto agora, o valor vai aumentar com juros de 2% ao mês, mais multas. Em 6 meses, a dívida pode duplicar. Além disso, afecta o seu score de crédito, dificultando empréstimos futuros. Não quer evitar esses problemas? Posso fazer um plano super flexível, a partir de 50 euros por mês. O que acha?`;
        newStrategy = 'objection_handling';
        setNegotiationScore(prev => Math.max(0, prev - 5));
        setDebtorMood('negative');
        break;

      case 'request_time':
        responseText = `Percebo perfeitamente, ${debtor.name}. A sua honestidade é apreciada. Que tal isto: dou-lhe 15 dias para se organizar, e depois começa a pagar em 6 prestações mensais de apenas ${Math.ceil(debtor.debt / 6)} euros. Primeira prestação só em Abril. Assim tem tempo para planear. Posso contar consigo?`;
        newStrategy = 'flexible_offer';
        setNegotiationScore(prev => prev + 20);
        setDebtorMood('neutral');
        break;

      case 'request_discount':
        responseText = `Muito bem pensado, ${debtor.name}! Gosto de pessoas que negoceiam. Vou fazer-lhe uma proposta excepcional: se pagar o valor total nos próximos 3 dias, dou-lhe 25% de desconto! A dívida fica em apenas ${Math.ceil(debtor.debt * 0.75)} euros. São ${Math.ceil(debtor.debt * 0.25)} euros que poupa! Mas atenção, esta oferta expira sexta-feira. Consegue aproveitar?`;
        newStrategy = 'incentive';
        setNegotiationScore(prev => prev + 25);
        setDebtorMood('positive');
        break;

      case 'financial_difficulty':
        responseText = `${debtor.name}, agradeço muito a sua transparência. Sei que não é fácil falar sobre isto. Olhe, estou aqui para ajudar, não para complicar. Podemos fazer prestações de 30 euros por mês, durante 12 meses. É menos do que um jantar fora! E congelo os juros. Não é uma solução razoável para começar a limpar isto?`;
        newStrategy = 'empathy';
        setNegotiationScore(prev => prev + 15);
        setDebtorMood('neutral');
        break;

      case 'request_human':
        responseText = `Sem problema, ${debtor.name}! Mas antes de transferir, deixe-me perguntar: prefere resolver isto hoje mesmo com 20% de desconto, ou prefere esperar para falar com um gestor amanhã? Se decidir hoje, ganho tempo e ganho dinheiro com o desconto. O que prefere?`;
        newStrategy = 'last_attempt';
        setNegotiationScore(prev => prev + 10);
        break;

      case 'postpone':
        responseText = `${debtor.name}, entendo. Mas tenho de ser honesta: cada dia que passa, acrescentam-se 4 euros de juros. Numa semana são 28 euros a mais. Que tal fazer isto: paga 500 euros hoje para parar os juros, e o resto dividimos em prestações? Assim protege-se e ainda negoceio condições melhores. Combinado?`;
        newStrategy = 'urgency';
        setNegotiationScore(prev => prev + 8);
        break;

      default:
        responseText = `Desculpe ${debtor.name}, não percebi muito bem. Pode repetir, por favor? Quero garantir que encontramos a melhor solução para si. Estava a falar sobre regularizar os ${debtor.debt.toLocaleString('pt-PT')} euros pendentes. Prefere opções de pagamento à vista com desconto, ou parcelamento?`;
        newStrategy = 'clarification';
        break;
    }

    setCurrentStrategy(newStrategy);
    return { text: responseText, intent, strategy: newStrategy };
  };

  // Speak with Google Cloud TTS natural voice
  const speakWithGoogleTTS = async (text: string, onComplete?: () => void) => {
    try {
      setIsGeneratingAudio(true);
      setSpeaking(true);
      
      console.log('[TTS] Generating audio with Google Cloud TTS:', text.substring(0, 50) + '...');

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/tts/google/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: VOICE_NAME
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[TTS] Server error:', response.status, errorData);
        
        // Check if it's an API key error
        if (errorData.error && errorData.error.includes('não configurada')) {
          alert('❌ API key do Google Cloud não configurada!\n\nPor favor, clique em "Configurar Agora" para adicionar sua API key.');
          setShowSetup(true);
          throw new Error('API key não configurada');
        }
        
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setIsGeneratingAudio(false);

      if (!data.audioContent) {
        throw new Error('No audio content in response');
      }

      // Convert base64 to blob
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);

      console.log('[TTS] Audio generated, size:', audioBlob.size, 'bytes');

      // Play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        console.log('[TTS] Audio playback finished');
        setSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        if (onComplete) onComplete();
      };

      audio.onerror = (error) => {
        console.error('[TTS] Audio playback error:', error);
        setSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        if (onComplete) onComplete();
      };

      await audio.play();
      console.log('[TTS] Playing audio...');

    } catch (error) {
      console.error('[TTS] Error generating or playing audio:', error);
      setIsGeneratingAudio(false);
      setSpeaking(false);
      alert('Erro ao gerar áudio. Verifique a consola para detalhes.');
      if (onComplete) onComplete();
    }
  };

  // Handle debtor's spoken response
  const handleDebtorResponse = (transcript: string) => {
    // Stop listening while processing
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }

    // Add debtor message
    const debtorMessage: Message = {
      id: Date.now().toString(),
      role: 'debtor',
      text: transcript,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, debtorMessage]);
    conversationContextRef.current.push(transcript);
    conversationTurnRef.current += 1;

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(
        transcript, 
        conversationContextRef.current,
        conversationTurnRef.current
      );
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        text: aiResponse.text,
        timestamp: new Date(),
        intent: aiResponse.intent
      };
      
      setMessages(prev => [...prev, agentMessage]);
      conversationContextRef.current.push(aiResponse.text);

      // Speak the response with Google TTS natural voice
      speakWithGoogleTTS(aiResponse.text, () => {
        // After agent speaks, listen for debtor's next response
        if (callActive && recognitionRef.current) {
          console.log('[CONVERSATION] Waiting for next debtor response...');
          setTimeout(() => {
            if (callActive && !speaking) {
              try {
                recognitionRef.current.start();
                console.log('[CONVERSATION] Listening for next input...');
              } catch (e) {
                console.log('[CONVERSATION] Could not start listening:', e);
              }
            }
          }, 1000); // 1 second pause before listening again
        }
      });
    }, 500); // Small delay for natural conversation flow
  };

  // Start call
  const startCall = () => {
    setCallActive(true);
    setMessages([]);
    setNegotiationScore(0);
    setDebtorMood('neutral');
    setCurrentStrategy('greeting');
    conversationContextRef.current = [];
    conversationTurnRef.current = 0;

    // Initial greeting
    const greeting: Message = {
      id: Date.now().toString(),
      role: 'agent',
      text: `Bom dia, ${debtor.name}. O meu nome é Sofia, sou assistente virtual da Tá Pago. Como está hoje?`,
      timestamp: new Date(),
      intent: 'greeting'
    };
    
    setMessages([greeting]);
    
    // Speak greeting with natural voice and start listening
    setTimeout(() => {
      speakWithGoogleTTS(greeting.text, () => {
        if (recognitionRef.current && callActive) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              console.log('[CALL] Started listening after greeting');
            } catch (e) {
              console.log('[CALL] Could not start listening:', e);
            }
          }, 1000);
        }
      });
    }, 1000);
  };

  // End call
  const endCall = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setCallActive(false);
    setListening(false);
    setSpeaking(false);
    setIsGeneratingAudio(false);

    // Closing message
    const closing: Message = {
      id: Date.now().toString(),
      role: 'agent',
      text: `Obrigada pela sua atenção, ${debtor.name}. Tenha um excelente dia!`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, closing]);
  };

  // Manual listen toggle (for debugging)
  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      if (!speaking) {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log('[MANUAL] Could not start listening:', e);
        }
      }
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
            <Brain className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agente de Voz Conversacional com IA</h1>
            <p className="text-slate-600 mt-1">Chamadas inteligentes com voz natural ElevenLabs em Português</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
          <CheckCircle2 className="size-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            ElevenLabs Activo
          </span>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900 mb-1">🎙️ Voz Natural Portuguesa</p>
            <p className="text-xs text-blue-700">
              Este agente usa vozes Neural do Google Cloud TTS, com sotaque português autêntico. 
              Conversa fluida em tempo real com detecção de intenção e respostas inteligentes.
            </p>
          </div>
        </div>
      </Card>

      {/* Setup Alert */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Volume2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-900 mb-1">🎙️ Google Cloud TTS</p>
            <p className="text-xs text-blue-700 mb-3">
              Configure a API do Google Cloud para ativar vozes em Português de Portugal. Gratuito até 1 milhão de caracteres/mês.
            </p>
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showSetup ? 'Fechar Configuração' : 'Configurar Agora'}
            </button>
          </div>
        </div>
      </Card>

      {showSetup && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <GoogleTTSSetup onComplete={() => setShowSetup(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Call Interface */}
        <div className="lg:col-span-2 space-y-4">
          {/* Debtor Info Card */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Perfil do Devedor</h3>
                <p className="text-sm text-slate-600">Informação da conta em atraso</p>
              </div>
              <Badge className="bg-red-500 text-white">Em atraso</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Nome</p>
                <p className="font-bold text-slate-900">{debtor.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Telefone</p>
                <p className="font-mono text-sm text-slate-900">{debtor.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Valor em Dívida</p>
                <p className="font-bold text-xl text-red-600">€{debtor.debt.toLocaleString('pt-PT')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Vencimento</p>
                <p className="font-medium text-slate-900">{debtor.dueDate}</p>
              </div>
            </div>
          </Card>

          {/* Call Control */}
          <Card className="bg-white border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Controlo de Chamada</h3>
                <p className="text-sm text-slate-600">
                  {callActive ? 'Chamada em curso - Fale naturalmente' : 'Pronto para iniciar chamada'}
                </p>
              </div>
              
              {callActive && (
                <div className="flex items-center gap-2">
                  {isGeneratingAudio && (
                    <div className="flex items-center gap-2 text-purple-600">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-xs">Gerando áudio...</span>
                    </div>
                  )}
                  {listening && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    />
                  )}
                  {speaking && !isGeneratingAudio && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4">
              {!callActive ? (
                <button
                  onClick={startCall}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-full hover:scale-110 transition-transform shadow-2xl group"
                >
                  <Phone className="size-12" />
                  <span className="sr-only">Iniciar Chamada</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleListening}
                    disabled={speaking || isGeneratingAudio}
                    className={`p-6 rounded-full transition-all shadow-xl ${
                      listening 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    } disabled:opacity-50`}
                  >
                    {listening ? <Mic className="size-8" /> : <MicOff className="size-8" />}
                  </button>

                  <button
                    onClick={endCall}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-full hover:scale-110 transition-transform shadow-2xl"
                  >
                    <PhoneOff className="size-12" />
                    <span className="sr-only">Terminar Chamada</span>
                  </button>
                </>
              )}
            </div>

            {callActive && (
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-600 mb-1">Status</p>
                  <p className="font-bold text-blue-900 text-sm">
                    {isGeneratingAudio ? '⚙️ Gerando' : speaking ? '🗣️ Falando' : listening ? '👂 Ouvindo' : '⏸️ Aguardando'}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-600 mb-1">Estratégia</p>
                  <p className="font-bold text-purple-900 text-xs">{currentStrategy}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-600 mb-1">Humor</p>
                  <p className="font-bold text-green-900">
                    {debtorMood === 'positive' ? '😊' : debtorMood === 'negative' ? '😠' : '😐'}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Conversation History */}
          <Card className="bg-white border-2 border-slate-200 p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4 sticky top-0 bg-white pb-2">
              Histórico da Conversa ({messages.length} mensagens)
            </h3>
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="size-16 text-slate-300 mb-4" />
                <p className="text-slate-500">Nenhuma mensagem ainda</p>
                <p className="text-xs text-slate-400 mt-2">Inicie a chamada para começar a conversa com IA</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'agent'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs">
                            {message.role === 'agent' ? '🤖 Sofia (IA)' : '👤 ' + debtor.name}
                          </span>
                          <span className="text-xs opacity-60">
                            {message.timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.intent && (
                          <Badge className="mt-2 text-xs bg-purple-200 text-purple-800">
                            {message.intent}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Analytics & Strategy */}
        <div className="space-y-4">
          {/* Negotiation Score */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="size-6 text-indigo-600" />
              <div>
                <h3 className="font-bold text-indigo-900">Score de Negociação</h3>
                <p className="text-xs text-indigo-600">Probabilidade de sucesso</p>
              </div>
            </div>
            <div className="relative h-3 bg-indigo-200 rounded-full overflow-hidden mb-2">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, negotiationScore))}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-right font-bold text-2xl text-indigo-900">
              {Math.min(100, Math.max(0, negotiationScore))}%
            </p>
          </Card>

          {/* AI Capabilities */}
          <Card className="bg-white border-2 border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-5 text-yellow-600" />
              <h3 className="font-bold text-slate-900">Capacidades da IA</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Voz ultra-realista ElevenLabs pt-PT</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Reconhecimento de voz em tempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Análise de intenção e sentimento</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Respostas contextuais adaptativas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Detecção de objeções e persuasão</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Ofertas personalizadas dinâmicas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Continuidade automática do diálogo</span>
              </li>
            </ul>
          </Card>

          {/* Strategies */}
          <Card className="bg-orange-50 border-2 border-orange-200 p-6">
            <h3 className="font-bold text-orange-900 mb-3">Estratégias Activas</h3>
            <div className="space-y-2">
              <Badge className="bg-orange-200 text-orange-900 w-full justify-start text-xs">
                💬 Comunicação empática
              </Badge>
              <Badge className="bg-orange-200 text-orange-900 w-full justify-start text-xs">
                🎯 Ofertas personalizadas em tempo real
              </Badge>
              <Badge className="bg-orange-200 text-orange-900 w-full justify-start text-xs">
                ⚡ Senso de urgência com factos
              </Badge>
              <Badge className="bg-orange-200 text-orange-900 w-full justify-start text-xs">
                🤝 Gestão de objeções persuasiva
              </Badge>
              <Badge className="bg-orange-200 text-orange-900 w-full justify-start text-xs">
                💰 Incentivos financeiros dinâmicos
              </Badge>
              <Badge className="bg-orange-200 text-orange-900 w-full justify-start text-xs">
                🔄 Conversação contínua automática
              </Badge>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border-2 border-blue-200 p-6">
            <h3 className="font-bold text-blue-900 mb-3 text-sm">Como Testar</h3>
            <ol className="space-y-2 text-xs text-blue-700 list-decimal list-inside">
              <li>Clique no botão verde para iniciar</li>
              <li>A IA fará a saudação inicial</li>
              <li>Responda naturalmente em português</li>
              <li>A IA continuará automaticamente</li>
              <li>Teste respostas: "sim", "não posso", "quero desconto"</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}