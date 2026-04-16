import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, CheckCircle2, XCircle, Loader2, Volume2, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  setGoogleCloudAPIKey, 
  getGoogleCloudAPIKey,
  testGoogleCloudAPIKey 
} from '../utils/googleTTS';

interface GoogleTTSSetupProps {
  onComplete?: () => void;
}

export default function GoogleTTSSetup({ onComplete }: GoogleTTSSetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [voicesAvailable, setVoicesAvailable] = useState(0);
  const [testingAudio, setTestingAudio] = useState(false);

  // Check if already configured on mount
  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const savedKey = getGoogleCloudAPIKey();
      if (savedKey) {
        const result = await testGoogleCloudAPIKey();
        if (result.valid) {
          setStatus('success');
          setVoicesAvailable(result.voicesAvailable || 0);
        }
      }
    } catch (error) {
      console.log('[GOOGLE TTS] Not configured yet');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Por favor insira a API Key do Google Cloud');
      setStatus('error');
      return;
    }

    setStatus('testing');
    setErrorMessage('');

    try {
      console.log('[GOOGLE TTS] 🔑 Salvando API Key localmente...');
      
      // Salva a API Key localmente
      setGoogleCloudAPIKey(apiKey);
      
      // Testa chamando DIRETAMENTE o Google Cloud
      const result = await testGoogleCloudAPIKey();

      if (result.valid) {
        setStatus('success');
        setVoicesAvailable(result.voicesAvailable || 0);
        console.log('✅ [GOOGLE TTS] API Key válida!', result);
        
        if (onComplete) {
          onComplete();
        }
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'API Key inválida');
      }
    } catch (error: any) {
      setStatus('error');
      
      // Melhorar mensagem de erro para problemas de permissão
      let errorMsg = error.message || 'Erro desconhecido';
      
      if (errorMsg.includes('blocked') || errorMsg.includes('ListVoices')) {
        errorMsg = 'A API Key tem restrições ativas que bloqueiam o Text-to-Speech. Siga as instruções abaixo para resolver.';
      }
      
      setErrorMessage(errorMsg);
    }
  };

  const testAudio = async () => {
    setTestingAudio(true);
    try {
      // TODO: Implementar síntese de áudio direta
      alert('Função de teste de áudio será implementada em breve!');
    } catch (error: any) {
      console.error('❌ [GOOGLE TTS] Erro ao testar áudio:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setTestingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6 flex items-center justify-center">
      <Card className="max-w-2xl w-full p-8 border-slate-200/50 shadow-xl bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Volume2 className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Google Cloud TTS</h2>
            <p className="text-sm text-slate-500">Text-to-Speech em Português de Portugal</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900">Como obter a API Key do Google Cloud:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800">
                      <li>Aceda ao <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-600">Google Cloud Console</a></li>
                      <li>Crie um projeto ou selecione um existente</li>
                      <li>Ative a API "Cloud Text-to-Speech API"</li>
                      <li>Vá em "APIs & Services" → "Credentials"</li>
                      <li>Clique em "Create Credentials" → "API Key"</li>
                      <li>Copie a chave gerada e cole abaixo</li>
                    </ol>
                    <a 
                      href="https://console.cloud.google.com/apis/library/texttospeech.googleapis.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      <ExternalLink className="size-4" />
                      Ativar API agora
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  API Key do Google Cloud
                </label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleTest}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium shadow-lg shadow-blue-500/30"
                disabled={!apiKey.trim()}
              >
                <Key className="size-4 mr-2" />
                Validar e Configurar
              </Button>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">✨ Vantagens do Google Cloud TTS:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• <strong>Gratuito:</strong> 1 milhão de caracteres/mês</li>
                  <li>• <strong>Vozes Neural PT-PT:</strong> Muito naturais e realistas</li>
                  <li>• <strong>Estável:</strong> Infraestrutura Google Cloud</li>
                  <li>• <strong>Sem limites:</strong> Ideal para testes e produção</li>
                </ul>
              </div>
            </motion.div>
          )}

          {status === 'testing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center gap-4"
            >
              <Loader2 className="size-12 text-blue-600 animate-spin" />
              <p className="text-slate-600 font-medium">A validar API Key...</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900">✅ Configuração Completa!</h3>
                  <p className="text-slate-500 mt-1">Google Cloud TTS está pronto para usar</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">
                  🎤 {voicesAvailable} vozes PT-PT disponíveis!
                </p>
                <p className="text-xs text-green-800">
                  Pronto para usar vozes Neural em Português de Portugal
                </p>
              </div>

              <Button 
                onClick={testAudio}
                disabled={testingAudio}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
              >
                {testingAudio ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    A gerar áudio...
                  </>
                ) : (
                  <>
                    <Volume2 className="size-4 mr-2" />
                    🔊 Testar Voz Portuguesa
                  </>
                )}
              </Button>

              {onComplete && (
                <Button 
                  onClick={onComplete}
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                >
                  Continuar
                </Button>
              )}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="size-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="size-8 text-red-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900">Erro na Validação</h3>
                  <p className="text-red-600 mt-1">{errorMessage}</p>
                </div>
              </div>

              {/* Instruções detalhadas para resolver o problema de restrições */}
              {(errorMessage.includes('blocked') || errorMessage.includes('restrições')) && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <p className="font-bold text-amber-900 text-base">🔓 Como Resolver:</p>
                      
                      <div className="space-y-2 text-sm text-amber-800">
                        <p className="font-semibold">A API Key tem restrições que bloqueiam o Text-to-Speech API.</p>
                        
                        <p className="font-bold mt-3">Opção 1: Remover Restrições (RECOMENDADO)</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Aceda a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-600">Google Cloud Credentials</a></li>
                          <li>Clique na sua API Key</li>
                          <li>Em "API restrictions", selecione <strong>"Don't restrict key"</strong></li>
                          <li>Clique em <strong>Save</strong></li>
                          <li>Aguarde 1-2 minutos e tente novamente</li>
                        </ol>

                        <p className="font-bold mt-3">Opção 2: Criar Nova API Key</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Aceda a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-600">Google Cloud Credentials</a></li>
                          <li>Clique em <strong>"Create Credentials"</strong> → <strong>"API Key"</strong></li>
                          <li><strong>NÃO adicione restrições</strong></li>
                          <li>Copie a nova chave e use aqui</li>
                        </ol>
                      </div>

                      <a 
                        href="https://console.cloud.google.com/apis/credentials" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors mt-3"
                      >
                        <ExternalLink className="size-4" />
                        Ir para Google Cloud Console
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={() => {
                  setStatus('idle');
                  setErrorMessage('');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-base font-medium"
              >
                Tentar Novamente
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}