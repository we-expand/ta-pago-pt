/**
 * Setup ElevenLabs API Key
 * Configura automaticamente a chave no backend
 */

import { projectId, publicAnonKey } from './supabase';

const API_BASE = `https://${projectId}.supabase.co/functions/v1`;

export async function setupElevenLabsKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/make-server-12af7011/setup/elevenlabs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[SETUP] Failed to configure ElevenLabs:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('[SETUP] ElevenLabs configured:', data.preview);
    return true;

  } catch (error) {
    console.error('[SETUP] Error configuring ElevenLabs:', error);
    return false;
  }
}

export async function checkElevenLabsConfiguration(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/make-server-12af7011/setup/elevenlabs`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.configured === true;

  } catch (error) {
    console.error('[SETUP] Error checking ElevenLabs:', error);
    return false;
  }
}
