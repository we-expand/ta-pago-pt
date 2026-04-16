import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const textToSpeechRouter = new Hono();

// ElevenLabs Text-to-Speech endpoint
textToSpeechRouter.post('/', async (c) => {
  try {
    const { text, voiceId = 'pFZP5JQG7iQjIQuC4Bku' } = await c.req.json();

    if (!text) {
      return c.json({ error: 'Text is required' }, 400);
    }

    // 🔧 FIX: Try to get API key from multiple sources
    let apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    // If not in env, try KV store (check both possible keys)
    if (!apiKey) {
      console.log('[TTS] API key not in env, checking KV store...');
      apiKey = await kv.get('config_elevenlabs_api_key') || await kv.get('elevenlabs_api_key') || null;
      console.log('[TTS] KV store key found:', !!apiKey);
    }
    
    if (!apiKey) {
      console.error('[TTS] ElevenLabs API key not configured');
      return c.json({ 
        error: 'ElevenLabs API key not configured. Please configure it in Settings.',
        needsSetup: true 
      }, 500);
    }

    console.log('[TTS] Generating audio for text:', text.substring(0, 50) + '...');
    console.log('[TTS] Using voice ID:', voiceId);
    console.log('[TTS] API key preview:', apiKey.substring(0, 10) + '...');

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] ElevenLabs API error:', response.status, errorText);
      return c.json(
        { error: `ElevenLabs API error: ${response.statusText}`, details: errorText },
        response.status
      );
    }

    // Get audio blob
    const audioBuffer = await response.arrayBuffer();
    console.log('[TTS] Audio generated successfully, size:', audioBuffer.byteLength, 'bytes');

    // Return audio
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('[TTS] Error generating speech:', error);
    return c.json(
      { error: 'Failed to generate speech', details: error.message },
      500
    );
  }
});

export default textToSpeechRouter;