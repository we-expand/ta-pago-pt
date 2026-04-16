/**
 * SETUP SCRIPT - Run once to configure ElevenLabs
 * 
 * Este script configura a chave ElevenLabs no KV store
 * para funcionar imediatamente sem precisar do Supabase Dashboard
 */

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const setup = new Hono();

/**
 * POST /make-server-12af7011/setup/elevenlabs
 * Configura a chave ElevenLabs
 */
setup.post('/elevenlabs', async (c) => {
  try {
    const { apiKey } = await c.req.json();

    if (!apiKey) {
      return c.json({ error: 'API key required' }, 400);
    }

    // Salva no KV store
    await kv.set('config_elevenlabs_api_key', apiKey);

    console.log('[SETUP] ElevenLabs API key configured successfully');

    return c.json({ 
      success: true, 
      message: 'ElevenLabs API key configured successfully',
      preview: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
    });

  } catch (error: any) {
    console.error('[SETUP] Error configuring ElevenLabs:', error);
    return c.json({ 
      error: 'Failed to configure', 
      details: error.message 
    }, 500);
  }
});

/**
 * GET /make-server-12af7011/setup/elevenlabs
 * Verifica se a chave está configurada
 */
setup.get('/elevenlabs', async (c) => {
  try {
    const apiKey = await kv.get('config_elevenlabs_api_key');

    if (!apiKey) {
      return c.json({ 
        configured: false,
        message: 'ElevenLabs API key not configured'
      });
    }

    return c.json({ 
      configured: true,
      preview: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
    });

  } catch (error: any) {
    console.error('[SETUP] Error checking ElevenLabs:', error);
    return c.json({ 
      error: 'Failed to check configuration', 
      details: error.message 
    }, 500);
  }
});

export default setup;
