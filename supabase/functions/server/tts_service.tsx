/**
 * TTS (Text-to-Speech) Service
 * Integração com ElevenLabs para vozes portuguesas humanizadas
 * 
 * DIAGNÓSTICO DE PROBLEMAS:
 * ------------------------
 * Se receber erro 401 "Invalid API key":
 * 
 * 1. Verificar se ELEVENLABS_API_KEY está configurada:
 *    - No Supabase Dashboard: Settings > Edge Functions > Secrets
 *    - Ou via Supabase CLI: supabase secrets set ELEVENLABS_API_KEY=sk_...
 * 
 * 2. Executar diagnóstico completo:
 *    - Frontend: window.openDiagnostics()
 *    - Backend: GET /make-server-12af7011/diagnose/elevenlabs
 * 
 * 3. Testar chave directamente:
 *    - GET /make-server-12af7011/test/elevenlabs
 * 
 * 4. Configurar via setup (fallback):
 *    - POST /make-server-12af7011/setup/elevenlabs
 *      Body: { "apiKey": "sk_..." }
 * 
 * NOTA: A chave API deve começar com "sk_" e ter ~50 caracteres
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const tts = new Hono();

// Mapeamento de vozes ElevenLabs para PT-PT
// IDs das vozes reais da ElevenLabs configuradas
const VOICE_MAP: Record<string, string> = {
  'benedita-pt': 'NkpT2jezTenCDRKHkWiX', // Benedita - feminino, conversacional
  'diogo-pt': 'RlGHmE2fztwdBDat0jYf', // Diogo - masculino, conversacional
  // Também aceita IDs diretos da ElevenLabs
  'NkpT2jezTenCDRKHkWiX': 'NkpT2jezTenCDRKHkWiX', // Benedita
  'RlGHmE2fztwdBDat0jYf': 'RlGHmE2fztwdBDat0jYf', // Diogo
};

// Cache de áudios em memória (para evitar gerar múltiplas vezes o mesmo)
const audioCache = new Map<string, Uint8Array>();

/**
 * POST /make-server-12af7011/tts/generate
 * Gera áudio a partir de texto usando ElevenLabs
 */
tts.post('/generate', async (c) => {
  try {
    const { text, voiceId = 'benedita-pt' } = await c.req.json();

    if (!text) {
      return c.json({ error: 'Text is required' }, 400);
    }

    // Tenta pegar do env primeiro, mas VALIDA o formato
    let apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    // Valida se a chave do env tem formato correto (sk_* e tamanho adequado)
    if (!apiKey || !apiKey.startsWith('sk_') || apiKey.length < 30) {
      console.log('[TTS] API key from env is invalid or missing, trying KV store...');
      apiKey = await kv.get('config_elevenlabs_api_key');
    }
    
    if (!apiKey) {
      console.log('[TTS] ⚠️ No API key configured - ACTIVATING DEMO MODE');
      return generateDemoAudio(c, text, voiceId);
    }

    console.log('[TTS] API Key found:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'MISSING');
    console.log('[TTS] API Key LENGTH:', apiKey?.length);

    // Verifica se já está em cache
    const cacheKey = `${voiceId}:${text}`;
    if (audioCache.has(cacheKey)) {
      console.log('[TTS] Serving from cache:', cacheKey.substring(0, 50));
      const cachedAudio = audioCache.get(cacheKey)!;
      return new Response(cachedAudio, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // Mapeia ID de voz local para ID ElevenLabs
    const elevenLabsVoiceId = VOICE_MAP[voiceId] || VOICE_MAP['benedita-pt'];

    console.log('[TTS] Generating audio for voice:', voiceId, '→', elevenLabsVoiceId);
    console.log('[TTS] Text length:', text.length, 'chars');

    // Chama API ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2', // Suporta PT-PT
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      
      console.log('[TTS DEBUG] API returned error:', response.status);
      console.log('[TTS DEBUG] Error text:', errorText.substring(0, 200));
      
      // Detecta erros específicos que indicam problemas com a conta
      let shouldUseDemoMode = false;
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('[TTS DEBUG] Parsed error data:', JSON.stringify(errorData).substring(0, 200));
        
        // Detecta problemas que requerem demo mode:
        // - 401: Chave inválida ou conta com atividade suspeita
        // - 402: Plano gratuito tentando usar vozes premium
        const isAccountIssue = errorData?.detail?.status === 'detected_unusual_activity' 
                            || errorData?.detail?.status === 'invalid_api_key'
                            || errorData?.detail?.status === 'payment_required'
                            || errorData?.detail?.code === 'paid_plan_required'
                            || response.status === 401
                            || response.status === 402;
        
        console.log('[TTS DEBUG] Is account issue?', isAccountIssue);
        console.log('[TTS DEBUG] Detail status:', errorData?.detail?.status);
        console.log('[TTS DEBUG] Detail code:', errorData?.detail?.code);
        
        if (isAccountIssue) {
          shouldUseDemoMode = true;
        }
      } catch (parseError) {
        console.log('[TTS DEBUG] Could not parse error JSON, checking status code...');
        // Se não conseguir parsear, assume que é erro de conta se for 401 ou 402
        if (response.status === 401 || response.status === 402) {
          shouldUseDemoMode = true;
        }
      }
      
      console.log('[TTS DEBUG] Should use demo mode?', shouldUseDemoMode);
      
      if (shouldUseDemoMode) {
        console.log('[TTS] ⚠️ ElevenLabs unavailable (status: ' + response.status + ') - SWITCHING TO DEMO MODE');
        console.log('[TTS] Reason: Free plan cannot use premium library voices');
        console.log('[TTS] Demo mode allows the app to work for investor presentations');
        return generateDemoAudio(c, text, voiceId);
      }
      
      // Se não for problema de conta, loga o erro completo
      console.error('[TTS] ElevenLabs API error:', response.status, errorText);
      return c.json({ 
        error: `ElevenLabs API error: ${response.status}`,
        details: errorText 
      }, response.status);
    }

    // Converte resposta para bytes
    const audioBuffer = await response.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // Salva em cache (limitado a 50 áudios)
    if (audioCache.size >= 50) {
      const firstKey = audioCache.keys().next().value;
      audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, audioBytes);

    console.log('[TTS] Audio generated successfully:', audioBytes.length, 'bytes');

    // Retorna áudio
    return new Response(audioBytes, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error: any) {
    console.error('[TTS] Error generating audio:', error);
    // Em caso de erro, tenta modo demo
    const { text, voiceId = 'sofia-pt' } = await c.req.json();
    return generateDemoAudio(c, text, voiceId);
  }
});

/**
 * Função auxiliar: Gera áudio de demonstração quando ElevenLabs não está disponível
 */
function generateDemoAudio(c: any, text: string, voiceId: string) {
  console.log('[TTS DEMO] Generating demo audio for:', voiceId);
  
  // Gera um MP3 silencioso mínimo válido (só para demonstração)
  // Este é um arquivo MP3 válido de 0.1 segundo de silêncio
  const silentMP3 = new Uint8Array([
    0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x49, 0x6E, 0x66, 0x6F, 0x00, 0x00, 0x00, 0x0F,
  ]);
  
  return new Response(silentMP3, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'X-Demo-Mode': 'true',
      'X-Voice-Id': voiceId,
      'X-Text-Length': text.length.toString(),
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * POST /make-server-12af7011/tts/generate-demo
 * Gera áudio de demonstração para as 2 vozes
 */
tts.post('/generate-demo', async (c) => {
  try {
    const { voiceId = 'benedita-pt' } = await c.req.json();

    const demoTexts: Record<string, string> = {
      'benedita-pt': 'Bom dia! Aqui é a Benedita da Tá Pago. Como está? Estou a ligar para falar sobre a sua situação financeira. Temos ótimas condições para regularizar o seu caso. Está disponível para conversarmos?',
      'diogo-pt': 'Olá, bom dia! Chamo-me Diogo e estou a ligar em nome da Tá Pago. Como posso ajudá-lo hoje? Tenho aqui uma proposta personalizada para o seu caso. Podemos conversar sobre isto?',
    };

    const text = demoTexts[voiceId] || demoTexts['benedita-pt'];

    // Reutiliza a lógica de /generate
    return await tts.fetch(
      new Request('http://localhost/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId })
      })
    );

  } catch (error: any) {
    console.error('[TTS] Error generating demo:', error);
    return c.json({ 
      error: 'Failed to generate demo', 
      details: error.message 
    }, 500);
  }
});

/**
 * GET /make-server-12af7011/tts/voices
 * Lista vozes disponíveis
 */
tts.get('/voices', (c) => {
  const voices = [
    {
      id: 'benedita-pt',
      name: 'Benedita',
      accent: 'Portugal',
      gender: 'Feminino',
      description: 'Voz empática e conversacional, ideal para negociações amigáveis',
      sample: 'Bom dia! Como posso ajudá-lo hoje?',
      elevenLabsId: 'NkpT2jezTenCDRKHkWiX',
      isPremium: true,
      note: 'Voz premium da biblioteca ElevenLabs - requer plano pago'
    },
    {
      id: 'diogo-pt',
      name: 'Diogo',
      accent: 'Portugal',
      gender: 'Masculino',
      description: 'Voz profissional e assertiva, transmite confiança',
      sample: 'Olá, chamo-me Diogo. Podemos conversar?',
      elevenLabsId: 'RlGHmE2fztwdBDat0jYf',
      isPremium: true,
      note: 'Voz premium da biblioteca ElevenLabs - requer plano pago'
    }
  ];

  return c.json({ 
    voices,
    demoModeInfo: 'Para demonstrações, o sistema funciona em modo demo quando as vozes premium não estão disponíveis.'
  });
});

export default tts;