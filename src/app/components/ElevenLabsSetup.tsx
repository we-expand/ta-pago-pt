import React, { useState } from 'react';
import { Key, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export default function ElevenLabsSetup() {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setResult({ success: false, message: 'Por favor, insira uma API key' });
      return;
    }

    // Validate format
    const cleanKey = apiKey.trim();
    if (!cleanKey.startsWith('sk_')) {
      setResult({ 
        success: false, 
        message: '❌ Formato inválido! A API key deve começar com "sk_"' 
      });
      return;
    }

    if (cleanKey.length < 20) {
      setResult({ 
        success: false, 
        message: '❌ API key muito curta! Verifique se copiou completamente.' 
      });
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      console.log('[SETUP] Testing API key:', cleanKey.substring(0, 15) + '...');

      // Test directly with ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': cleanKey
        }
      });

      console.log('[SETUP] ElevenLabs API response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('[SETUP] User data:', userData);

        // Save to backend
        const saveResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/setup/elevenlabs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ apiKey: cleanKey })
        });

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          console.log('[SETUP] Saved successfully:', saveData);
          
          const characterCount = userData.subscription?.character_count || 0;
          const characterLimit = userData.subscription?.character_limit || 0;
          
          setResult({ 
            success: true, 
            message: `✅ API key válida e guardada!\n\n` +
                     `📊 Créditos disponíveis: ${characterCount.toLocaleString()} / ${characterLimit.toLocaleString()} caracteres\n` +
                     `✨ A página irá recarregar em 2 segundos...`
          });
          
          // Reload page after 2 seconds to apply new key
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          const errorText = await saveResponse.text();
          console.error('[SETUP] Error saving:', errorText);
          setResult({ 
            success: false, 
            message: `⚠️ API key válida mas erro ao guardar no servidor:\n${errorText}`
          });
        }
      } else {
        const errorData = await response.json();
        console.error('[SETUP] Invalid API key response:', errorData);
        
        let errorMsg = '❌ API key inválida ou expirada!\n\n';
        
        if (errorData.detail?.message) {
          errorMsg += `Erro: ${errorData.detail.message}\n\n`;
        }
        
        errorMsg += '💡 Possíveis causas:\n' +
                    '• A chave foi revogada ou expirou\n' +
                    '• A chave não foi copiada completamente\n' +
                    '• A conta ElevenLabs está suspensa\n\n' +
                    '🔧 Solução:\n' +
                    '1. Aceda a elevenlabs.io/app/settings/api-keys\n' +
                    '2. Crie uma NOVA chave (não reutilize antigas)\n' +
                    '3. Copie TODA a chave (inclui "sk_" no início)\n' +
                    '4. Cole aqui e teste novamente';
        
        setResult({ 
          success: false, 
          message: errorMsg
        });
      }
    } catch (error: any) {
      console.error('[SETUP] Exception:', error);
      setResult({ 
        success: false, 
        message: `❌ Erro de conexão:\n${error.message}\n\nVerifique sua conexão com a internet.`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-white border-2 border-slate-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-3 rounded-xl">
          <Key className="size-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurar ElevenLabs</h2>
          <p className="text-sm text-slate-600">Configure a sua API key para voz natural</p>
        </div>
      </div>

      {/* GUIA VISUAL PASSO A PASSO */}
      <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl">
        <h3 className="text-base font-bold text-purple-900 mb-4 flex items-center gap-2">
          📋 Guia Passo a Passo (5 minutos)
        </h3>
        
        <div className="space-y-4">
          {/* Passo 1 */}
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-xs rounded-full size-6 flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Aceda ao site ElevenLabs</p>
              <a 
                href="https://elevenlabs.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-purple-700 underline hover:text-purple-900"
              >
                👉 Clique aqui: elevenlabs.io
              </a>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-xs rounded-full size-6 flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Crie uma conta GRATUITA</p>
              <p className="text-xs text-purple-700">Clique em "Sign Up" no canto superior direito. Pode usar Google, email, etc.</p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-xs rounded-full size-6 flex items-center justify-center flex-shrink-0">3</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Vá para Settings → API Keys</p>
              <a 
                href="https://elevenlabs.io/app/settings/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-purple-700 underline hover:text-purple-900"
              >
                👉 Clique aqui: elevenlabs.io/app/settings/api-keys
              </a>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-xs rounded-full size-6 flex items-center justify-center flex-shrink-0">4</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Crie uma NOVA chave</p>
              <p className="text-xs text-purple-700">Clique no botão verde "+ Create" ou "Generate". Dê um nome qualquer (ex: "TaPago")</p>
            </div>
          </div>

          {/* Passo 5 */}
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-xs rounded-full size-6 flex items-center justify-center flex-shrink-0">5</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Copie a chave COMPLETA</p>
              <p className="text-xs text-purple-700">A chave começa com <code className="bg-purple-100 px-1 rounded">sk_</code> e tem ~50 caracteres. Copie TUDO!</p>
            </div>
          </div>

          {/* Passo 6 */}
          <div className="flex gap-3">
            <div className="bg-purple-600 text-white font-bold text-xs rounded-full size-6 flex items-center justify-center flex-shrink-0">6</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Cole aqui embaixo e clique "Testar e Guardar"</p>
              <p className="text-xs text-purple-700">Se estiver correta, a página recarregará automaticamente!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            API Key do ElevenLabs
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Obtenha a sua chave gratuita em{' '}
            <a 
              href="https://elevenlabs.io/app/settings/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              elevenlabs.io/app/settings/api-keys
            </a>
          </p>
        </div>

        <Button
          onClick={testApiKey}
          disabled={testing || !apiKey.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {testing ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              A testar...
            </>
          ) : (
            <>
              <RefreshCw className="size-5" />
              Testar e Guardar
            </>
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-xl flex items-start gap-3 ${
            result.success 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            {result.success ? (
              <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium whitespace-pre-line ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {showGuide && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-sm font-bold text-blue-900 mb-2">💡 Como obter a API key gratuita:</h3>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Aceda a <strong>elevenlabs.io</strong></li>
            <li>Crie uma conta gratuita (10,000 caracteres/mês)</li>
            <li>Vá a <strong>Settings → API Keys</strong></li>
            <li>Copie a sua chave e cole aqui</li>
          </ol>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h3 className="text-sm font-bold text-yellow-900 mb-2">⚠️ Dicas importantes:</h3>
        <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
          <li>A chave DEVE começar com <code className="bg-yellow-100 px-1 rounded">sk_</code></li>
          <li>Copie a chave COMPLETA (geralmente ~50 caracteres)</li>
          <li>NÃO compartilhe sua chave com ninguém</li>
          <li>Se der erro, CRIE UMA NOVA CHAVE no site</li>
          <li>Plano gratuito: 10.000 caracteres = ~20 min de áudio/mês</li>
        </ul>
      </div>
    </Card>
  );
}