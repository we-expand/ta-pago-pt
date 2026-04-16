/**
 * API utilities for frontend
 * Handles proxy calls to backend
 */

import { projectId, publicAnonKey } from './supabase';

const API_BASE = `https://${projectId}.supabase.co/functions/v1`;

interface TTSGenerateParams {
  text: string;
  voiceId?: string;
}

/**
 * Generates TTS audio from text
 */
export async function generateTTS(params: TTSGenerateParams): Promise<Blob> {
  const response = await fetch(`${API_BASE}/make-server-12af7011/tts/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return await response.blob();
}

/**
 * Lists available TTS voices
 */
export async function listTTSVoices(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/make-server-12af7011/tts/voices`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.voices || [];
}
