/**
 * Test ElevenLabs API Key
 * Testa a chave direto no backend
 */

import { projectId, publicAnonKey } from './supabase';

const API_BASE = `https://${projectId}.supabase.co/functions/v1`;

export async function testElevenLabsKey(): Promise<any> {
  try {
    console.log('[TEST] Testing ElevenLabs API key...');
    
    const response = await fetch(`${API_BASE}/make-server-12af7011/test/elevenlabs`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    console.log('[TEST] Response:', data);
    
    return data;

  } catch (error) {
    console.error('[TEST] Error testing ElevenLabs:', error);
    return { success: false, error: error.message };
  }
}
