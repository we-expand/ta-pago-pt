/**
 * Auto-check ElevenLabs configuration on app startup
 * Displays console warnings if API key is not configured
 */

import { projectId, publicAnonKey } from './supabase';

interface StatusResponse {
  configured: boolean;
  source: string;
  keyPreview: string | null;
  recommendation: string;
}

export async function checkElevenLabsConfiguration(): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/elevenlabs/status`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('[ELEVENLABS] Failed to check configuration status');
      return;
    }

    const status: StatusResponse = await response.json();

    if (!status.configured) {
      console.log('\n');
      console.log('╔══════════════════════════════════════════════════════════════╗');
      console.log('║                  ⚠️  AVISO: ELEVENLABS                      ║');
      console.log('╚══════════════════════════════════════════════════════════════╝');
      console.log('');
      console.log('  A chave API da ElevenLabs NÃO está configurada!');
      console.log('');
      console.log('  Funcionalidades afectadas:');
      console.log('  • Geração de áudio TTS em campanhas de voz');
      console.log('  • Demonstrações de vozes portuguesas (Sofia, Miguel, Ana)');
      console.log('');
      console.log('  Como resolver:');
      console.log('  1. Execute: window.openDiagnostics()');
      console.log('  2. Siga as instruções no dashboard de diagnóstico');
      console.log('  3. Configure a chave no Supabase Dashboard');
      console.log('');
      console.log('  Documentação completa: /ELEVENLABS_DIAGNOSTIC.md');
      console.log('');
      console.log('══════════════════════════════════════════════════════════════');
      console.log('\n');
    } else {
      console.log('✅ [ELEVENLABS] Configured and ready');
      console.log(`   Source: ${status.source}`);
      console.log(`   Key: ${status.keyPreview}`);
    }
  } catch (error) {
    console.warn('[ELEVENLABS] Auto-check failed:', error);
  }
}

/**
 * Run diagnostic test and return results
 */
export async function runFullDiagnostic(): Promise<any> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/diagnose/elevenlabs`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('[DIAGNOSTIC] Failed to run:', error.message);
    throw error;
  }
}
