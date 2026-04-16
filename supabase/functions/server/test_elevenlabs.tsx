/**
 * TEST SCRIPT - Testa a chave ElevenLabs diretamente
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const test = new Hono();

/**
 * GET /make-server-12af7011/test/elevenlabs
 * Testa a chave ElevenLabs diretamente
 */
test.get('/elevenlabs', async (c) => {
  try {
    // Tenta pegar do env primeiro, mas VALIDA o formato
    let apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    // Valida se a chave do env tem formato correto (sk_* e tamanho adequado)
    if (!apiKey || !apiKey.startsWith('sk_') || apiKey.length < 30) {
      console.log('[TEST] API key from env is invalid or missing, trying KV store...');
      apiKey = await kv.get('config_elevenlabs_api_key');
    }
    
    // Fallback para chave hardcoded se necessário
    if (!apiKey) {
      console.log('[TEST] No API key found in env or KV, using hardcoded fallback...');
      apiKey = 'sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d';
    }
    
    console.log('[TEST] Testing ElevenLabs API key...');
    console.log('[TEST] Key preview:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log('[TEST] Key length:', apiKey.length);

    // Testa chamada simples para verificar chave
    const testResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    console.log('[TEST] Response status:', testResponse.status);
    console.log('[TEST] Response headers:', testResponse.headers);

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('[TEST] Error response:', errorText);
      return c.json({
        success: false,
        status: testResponse.status,
        error: errorText,
      });
    }

    const data = await testResponse.json();
    console.log('[TEST] Success! Available voices:', data.voices?.length);

    return c.json({
      success: true,
      message: 'ElevenLabs API key is valid!',
      voicesCount: data.voices?.length,
      firstVoice: data.voices?.[0]?.name,
    });

  } catch (error: any) {
    console.error('[TEST] Error:', error);
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

export default test;