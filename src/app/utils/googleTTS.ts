/**
 * 🔥 GOOGLE CLOUD TEXT-TO-SPEECH - DIRETO DO FRONTEND
 * Bypass total do backend Supabase para evitar problemas de autenticação
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const GOOGLE_TTS_API_KEY_STORAGE = 'google_cloud_api_key';

/**
 * Salva a API Key localmente no localStorage
 */
export function setGoogleCloudAPIKey(apiKey: string): void {
  localStorage.setItem(GOOGLE_TTS_API_KEY_STORAGE, apiKey);
  console.log('[GOOGLE TTS] 🔐 API Key salva localmente');
}

/**
 * Obtém a API Key do localStorage
 */
export function getGoogleCloudAPIKey(): string | null {
  return localStorage.getItem(GOOGLE_TTS_API_KEY_STORAGE);
}

/**
 * Remove a API Key do localStorage
 */
export function removeGoogleCloudAPIKey(): void {
  localStorage.removeItem(GOOGLE_TTS_API_KEY_STORAGE);
  console.log('[GOOGLE TTS] 🗑️ API Key removida');
}

/**
 * 🎯 TESTE DIRETO - CHAMADA DIRETA AO GOOGLE CLOUD (SEM BACKEND)
 */
export async function testGoogleCloudAPIKey(): Promise<{
  valid: boolean;
  error?: string;
  voicesAvailable?: number;
}> {
  const apiKey = getGoogleCloudAPIKey();
  
  if (!apiKey) {
    return {
      valid: false,
      error: 'API Key não configurada'
    };
  }

  try {
    console.log('[GOOGLE TTS] 🔥🔥🔥 CHAMADA DIRETA AO GOOGLE CLOUD - BYPASS TOTAL!');
    
    // Chamada DIRETA à API do Google Cloud Text-to-Speech
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=pt-PT`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GOOGLE TTS] ❌ Erro do Google Cloud:', errorData);
      return {
        valid: false,
        error: errorData.error?.message || 'API Key inválida'
      };
    }

    const data = await response.json();
    const ptPTVoices = data.voices?.filter((voice: any) => 
      voice.languageCodes.includes('pt-PT')
    ) || [];

    console.log(`[GOOGLE TTS] ✅ ${ptPTVoices.length} vozes PT-PT disponíveis!`);

    return {
      valid: true,
      voicesAvailable: ptPTVoices.length
    };

  } catch (error: any) {
    console.error('[GOOGLE TTS] ❌ Erro fatal:', error);
    return {
      valid: false,
      error: `Erro de conexão: ${error.message}`
    };
  }
}

/**
 * Interface para opções de síntese
 */
export interface GoogleTTSOptions {
  voice?: string;
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
}

/**
 * Sintetizar texto em áudio usando backend como proxy
 */
export async function synthesizeTextToSpeech(
  text: string,
  options: GoogleTTSOptions = {}
): Promise<{
  success: boolean;
  audioContent?: string;
  error?: string;
}> {
  const apiKey = getGoogleCloudAPIKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: 'API Key do Google Cloud não configurada'
    };
  }

  const {
    voice = 'pt-PT-Wavenet-D',
  } = options;

  try {
    console.log(`[GOOGLE TTS] Sintetizando ${text.length} caracteres via backend...`);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/tts/google/synthesize-public`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GOOGLE TTS] ❌ Erro na síntese:', errorData);
      
      return {
        success: false,
        error: errorData.error || 'Erro ao sintetizar áudio'
      };
    }

    const data = await response.json();

    if (!data.audioContent) {
      return {
        success: false,
        error: 'Nenhum conteúdo de áudio retornado'
      };
    }

    console.log(`[GOOGLE TTS] ✅ Áudio sintetizado!`);

    return {
      success: true,
      audioContent: data.audioContent
    };

  } catch (error: any) {
    console.error('[GOOGLE TTS] ❌ Erro:', error);
    return {
      success: false,
      error: `Erro de conexão: ${error.message}`
    };
  }
}

/**
 * Helper: Converter base64 para Blob de áudio
 */
export function base64ToAudioBlob(base64: string, mimeType: string = 'audio/mp3'): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: mimeType });
}

/**
 * Helper: Reproduzir áudio a partir de base64
 */
export async function playAudioFromBase64(
  base64Audio: string,
  onEnded?: () => void
): Promise<HTMLAudioElement> {
  const audioBlob = base64ToAudioBlob(base64Audio);
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
    if (onEnded) onEnded();
  };
  
  await audio.play();
  return audio;
}