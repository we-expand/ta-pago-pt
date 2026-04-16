/**
 * 🎙️ VOICE AI SERVICE - Agente Conversacional Inteligente
 * =========================================================
 * 
 * Sistema de IA conversacional que DIALOGA com devedores em tempo real,
 * negoceia, responde perguntas e convence a pagar - não apenas "dá recado"!
 * 
 * Integra com:
 * - Vapi.ai: Para conversação em tempo real
 * - ElevenLabs: Para vozes PT-PT (Benedita e Diogo)
 * - OpenAI: Para inteligência conversacional
 * 
 * FLUXO:
 * 1. Sistema liga para o devedor
 * 2. IA ouve e compreende o que o devedor diz
 * 3. IA responde inteligentemente
 * 4. Negocia valores e prazos
 * 5. Fecha acordo ou agenda nova ligação
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const voiceAI = new Hono();

/**
 * POST /make-server-12af7011/voice-ai/create-agent
 * Cria um agente conversacional personalizado
 */
voiceAI.post('/create-agent', async (c) => {
  try {
    const {
      voiceId = 'benedita-pt',
      debtorName,
      debtAmount,
      companyName = 'Tá Pago',
      objective = 'negotiate_payment'
    } = await c.req.json();

    // Mapeamento de vozes locais para IDs da ElevenLabs
    const voiceMap: Record<string, string> = {
      'benedita-pt': 'NkpT2jezTenCDRKHkWiX',
      'diogo-pt': 'RlGHmE2fztwdBDat0jYf'
    };

    const elevenLabsVoiceId = voiceMap[voiceId] || voiceMap['benedita-pt'];
    const agentName = voiceId === 'benedita-pt' ? 'Benedita' : 'Diogo';

    // Cria configuração do agente conversacional
    const agentConfig = {
      name: `Agente ${agentName} - ${debtorName}`,
      voice: {
        provider: 'elevenlabs',
        voiceId: elevenLabsVoiceId,
        stability: 0.6,
        similarityBoost: 0.8,
        speed: 1.0
      },
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 500
      },
      systemPrompt: generateConversationalPrompt({
        agentName,
        debtorName,
        debtAmount,
        companyName,
        objective
      }),
      firstMessage: generateFirstMessage(agentName, debtorName),
      conversationTools: [
        'active_listening',
        'empathy_responses',
        'objection_handling',
        'negotiation',
        'agreement_closing'
      ]
    };

    // Salva configuração no KV store
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await kv.set(`voice_agent:${agentId}`, JSON.stringify(agentConfig));

    console.log(`[VOICE AI] Agent created: ${agentId}`);

    return c.json({
      success: true,
      agentId,
      config: agentConfig,
      message: 'Agente conversacional criado com sucesso'
    });

  } catch (error: any) {
    console.error('[VOICE AI] Error creating agent:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /make-server-12af7011/voice-ai/start-call
 * Inicia uma chamada telefónica conversacional
 */
voiceAI.post('/start-call', async (c) => {
  try {
    const {
      agentId,
      phoneNumber,
      debtorName
    } = await c.req.json();

    if (!phoneNumber) {
      return c.json({ error: 'Phone number is required' }, 400);
    }

    // Recupera configuração do agente
    const agentConfigStr = await kv.get(`voice_agent:${agentId}`);
    if (!agentConfigStr) {
      return c.json({ error: 'Agent not found' }, 404);
    }

    const agentConfig = JSON.parse(agentConfigStr);

    console.log(`[VOICE AI] Starting call to ${phoneNumber} with agent ${agentId}`);

    // MODO DEMO: Simula chamada para demonstração
    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const callRecord = {
      callId,
      agentId,
      phoneNumber,
      debtorName,
      status: 'initiated',
      startTime: new Date().toISOString(),
      agentName: agentConfig.name,
      voiceId: agentConfig.voice.voiceId
    };

    // Salva registro da chamada
    await kv.set(`voice_call:${callId}`, JSON.stringify(callRecord));

    // Em produção, aqui chamaria a API Vapi.ai ou Bland.ai:
    // const vapiResponse = await fetch('https://api.vapi.ai/call', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${VAPI_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     phoneNumberId: 'your-vapi-phone-id',
    //     customer: { number: phoneNumber },
    //     assistant: agentConfig
    //   })
    // });

    return c.json({
      success: true,
      callId,
      status: 'demo_mode',
      message: 'Chamada iniciada (modo demonstração)',
      details: {
        phoneNumber,
        agentName: agentConfig.name,
        estimatedDuration: '2-5 minutos',
        conversational: true
      }
    });

  } catch (error: any) {
    console.error('[VOICE AI] Error starting call:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /make-server-12af7011/voice-ai/call-status/:callId
 * Consulta status de uma chamada
 */
voiceAI.get('/call-status/:callId', async (c) => {
  try {
    const callId = c.req.param('callId');
    const callRecordStr = await kv.get(`voice_call:${callId}`);

    if (!callRecordStr) {
      return c.json({ error: 'Call not found' }, 404);
    }

    const callRecord = JSON.parse(callRecordStr);

    // MODO DEMO: Simula conversação
    const transcript = generateDemoTranscript(callRecord);

    return c.json({
      success: true,
      call: callRecord,
      transcript,
      analytics: {
        duration: 180, // 3 minutos
        sentiment: 'positive',
        outcome: 'agreement_reached',
        paymentPromised: true
      }
    });

  } catch (error: any) {
    console.error('[VOICE AI] Error getting call status:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /make-server-12af7011/voice-ai/agents
 * Lista todos os agentes criados
 */
voiceAI.get('/agents', async (c) => {
  try {
    // Busca todos os agentes salvos
    const agentKeys = await kv.getByPrefix('voice_agent:');
    
    const agents = agentKeys.map((agentStr: string) => {
      try {
        return JSON.parse(agentStr);
      } catch {
        return null;
      }
    }).filter(Boolean);

    return c.json({
      success: true,
      agents,
      count: agents.length
    });

  } catch (error: any) {
    console.error('[VOICE AI] Error listing agents:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * FUNÇÕES AUXILIARES
 */

function generateConversationalPrompt(params: {
  agentName: string;
  debtorName: string;
  debtAmount: number;
  companyName: string;
  objective: string;
}): string {
  const { agentName, debtorName, debtAmount, companyName, objective } = params;

  return `Você é ${agentName}, um agente de cobrança profissional e empático da empresa ${companyName}.

IDENTIDADE E PERSONALIDADE:
- Nome: ${agentName}
- Sotaque: Português de Portugal
- Estilo: Conversacional, empático mas assertivo
- Objetivo: ${objective === 'negotiate_payment' ? 'Negociar pagamento' : 'Lembrar pagamento'}

INFORMAÇÕES DO CLIENTE:
- Nome: ${debtorName}
- Dívida: €${debtAmount.toLocaleString('pt-PT')}

REGRAS DA CONVERSA:
1. SEMPRE escute atentamente o que o devedor diz
2. Responda com empatia às objeções
3. Faça perguntas abertas para entender a situação
4. Ofereça soluções personalizadas
5. Negocie valores e prazos quando necessário
6. NUNCA seja agressivo ou ameaçador
7. Use linguagem de Portugal (tu/você, está/estás)

TÉCNICAS DE NEGOCIAÇÃO:
- Se recusar: "Entendo perfeitamente. E se fizéssemos em X parcelas?"
- Se não tiver dinheiro: "Compreendo a situação. Que valor consegue pagar agora?"
- Se prometer depois: "Ótimo! Então fico de ligar no dia X. Confirma?"
- Se aceitar: "Excelente! Vou já registar o acordo. Obrigado!"

EXEMPLOS DE DIÁLOGO:

Devedor: "Não tenho dinheiro agora."
Você: "Compreendo perfeitamente, ${debtorName}. Muitas pessoas estão a passar pelo mesmo. Por acaso, consegue pagar uma parte agora? Mesmo que seja €50, já ajuda a regularizar."

Devedor: "Posso pagar mês que vem."
Você: "Ótimo! Então deixa-me confirmar: no próximo mês consegue pagar os €${debtAmount.toLocaleString('pt-PT')} na totalidade? Ou prefere fazer em duas vezes?"

Devedor: "Esta dívida não é minha!"
Você: "Entendo a sua preocupação. Vamos já esclarecer isso. Tem aqui um contrato com a referência ${Math.random().toString(36).substring(7).toUpperCase()}. Quer que lhe envie os detalhes por email ou SMS?"

SEJA NATURAL E CONVERSACIONAL - isto é uma conversa real, não um script!`;
}

function generateFirstMessage(agentName: string, debtorName: string): string {
  const greetings = [
    `Bom dia! Fala ${agentName} da Tá Pago. Está a falar com ${debtorName}?`,
    `Olá! Aqui é ${agentName} da Tá Pago. Gostaria de falar com ${debtorName}, está disponível?`,
    `Boa tarde! Chamo-me ${agentName} e estou a ligar da Tá Pago. É ${debtorName}?`
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

function generateDemoTranscript(callRecord: any): Array<{
  speaker: string;
  text: string;
  timestamp: string;
}> {
  const agentName = callRecord.agentName.split(' - ')[0].replace('Agente ', '');
  const debtorName = callRecord.debtorName || 'Cliente';

  return [
    {
      speaker: agentName,
      text: `Bom dia! Fala ${agentName} da Tá Pago. Está a falar com ${debtorName}?`,
      timestamp: '00:00'
    },
    {
      speaker: debtorName,
      text: 'Sim, sou eu. O que deseja?',
      timestamp: '00:05'
    },
    {
      speaker: agentName,
      text: 'Estou a ligar para falar sobre a sua situação financeira connosco. Tem um momento para conversarmos?',
      timestamp: '00:10'
    },
    {
      speaker: debtorName,
      text: 'Está bem, mas não tenho muito tempo.',
      timestamp: '00:18'
    },
    {
      speaker: agentName,
      text: 'Compreendo perfeitamente. Vou ser breve. Tenho aqui uma proposta para regularizar o seu caso com condições especiais. Gostaria de conhecer?',
      timestamp: '00:22'
    },
    {
      speaker: debtorName,
      text: 'Quanto é que tenho de pagar?',
      timestamp: '00:32'
    },
    {
      speaker: agentName,
      text: 'Posso oferecer um desconto de 20% se liquidar hoje, ou então podemos dividir em 3 parcelas sem juros. O que prefere?',
      timestamp: '00:35'
    },
    {
      speaker: debtorName,
      text: 'As 3 parcelas parece-me melhor.',
      timestamp: '00:45'
    },
    {
      speaker: agentName,
      text: 'Excelente escolha! Vou já registar o acordo. A primeira parcela fica para o próximo dia 15. Confirma?',
      timestamp: '00:48'
    },
    {
      speaker: debtorName,
      text: 'Sim, está bem.',
      timestamp: '00:58'
    },
    {
      speaker: agentName,
      text: 'Perfeito! Vai receber um SMS com todos os detalhes. Muito obrigado pela colaboração e bom dia!',
      timestamp: '01:00'
    }
  ];
}

export default voiceAI;
