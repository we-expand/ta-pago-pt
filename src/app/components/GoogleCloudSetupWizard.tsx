import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Copy, 
  Check,
  ArrowRight,
  ArrowLeft,
  Key,
  Cloud,
  Settings,
  Volume2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import googleCloudImg from 'figma:asset/17f775630023b057409a8d91cbbb5275dc341a4e.png';
import { projectId } from '/utils/supabase/info';

// Importar funções diretas da API do Google Cloud TTS
import { 
  setGoogleCloudAPIKey, 
  testGoogleCloudAPIKey, 
  synthesizeTextToSpeech,
  playAudioFromBase64
} from '../utils/googleTTS';

interface GoogleCloudSetupWizardProps {
  onComplete?: () => void;
}

export default function GoogleCloudSetupWizard({ onComplete }: GoogleCloudSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [testingAudio, setTestingAudio] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const totalSteps = 5;

  const steps = [
    {
      number: 1,
      title: 'Verificar Projeto Google Cloud',
      subtitle: 'Confirme que está no projeto correto',
      completed: currentStep > 1,
    },
    {
      number: 2,
      title: 'Ativar API Text-to-Speech',
      subtitle: 'Ative a API no Google Cloud Console',
      completed: currentStep > 2,
    },
    {
      number: 3,
      title: 'Criar Chave de API',
      subtitle: 'Gere credenciais de acesso',
      completed: currentStep > 3,
    },
    {
      number: 4,
      title: 'Configurar no Sistema',
      subtitle: 'Insira a chave no Tá Pago.pt',
      completed: currentStep > 4,
    },
    {
      number: 5,
      title: 'Testar Voz Portuguesa',
      subtitle: 'Valide a integração',
      completed: currentStep > 5,
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems({ ...copiedItems, [id]: true });
    setTimeout(() => {
      setCopiedItems({ ...copiedItems, [id]: false });
    }, 2000);
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Por favor, insira a API Key do Google Cloud');
      setValidationStatus('error');
      return;
    }

    if (!apiKey.startsWith('AIzaSy')) {
      setErrorMessage('Formato inválido. A chave deve começar com "AIzaSy..."');
      setValidationStatus('error');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');
    setErrorMessage('');

    try {
      console.log('[GOOGLE TTS SETUP] 🔥 USANDO API DIRETA - BYPASS SUPABASE!');
      
      // Salvar a API Key localmente
      setGoogleCloudAPIKey(apiKey);
      console.log('[GOOGLE TTS SETUP] ✅ API Key salva localmente');
      
      // Testar a API Key fazendo chamada DIRETA ao Google Cloud
      console.log('[GOOGLE TTS SETUP] Testando API Key...');
      const testResult = await testGoogleCloudAPIKey();

      if (testResult.valid && testResult.voicesAvailable) {
        console.log(`[GOOGLE TTS SETUP] ✅ ${testResult.voicesAvailable} vozes PT-PT disponíveis!`);
        setValidationStatus('success');
        setTimeout(() => {
          setCurrentStep(5);
        }, 1500);
      } else {
        console.error('[GOOGLE TTS SETUP] ❌ Validação falhou:', testResult.error);
        setValidationStatus('error');
        setErrorMessage(testResult.error || 'API Key inválida. Verifique se a API está ativada.');
      }
    } catch (error: any) {
      console.error('[GOOGLE TTS SETUP] ❌ Erro fatal:', error);
      setValidationStatus('error');
      setErrorMessage(`Erro: ${error.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  const testVoice = async () => {
    setTestingAudio(true);
    setErrorMessage('');
    
    try {
      console.log('[GOOGLE TTS SETUP] 🎵 Testando síntese de voz...');
      
      const text = 'Olá! Sou a assistente virtual do Tá Pago ponto PT. Este é um teste da integração com Google Cloud Text-to-Speech em Português de Portugal autêntico. A configuração está completa e o sistema está pronto para fazer chamadas telefónicas reais aos devedores.';
      
      // Sintetizar usando API DIRETA
      const result = await synthesizeTextToSpeech(text, {
        voice: 'pt-PT-Wavenet-D',
      });

      if (result.success && result.audioContent) {
        console.log('[GOOGLE TTS SETUP] ✅ Áudio sintetizado! Reproduzindo...');
        
        // Reproduzir o áudio
        await playAudioFromBase64(result.audioContent, () => {
          console.log('[GOOGLE TTS SETUP] ✅ Reprodução concluída!');
          
          // Marcar como completo após 2 segundos
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2000);
        });
      } else {
        console.error('[GOOGLE TTS SETUP] ❌ Erro ao gerar áudio:', result.error);
        setErrorMessage(result.error || 'Erro ao gerar áudio de teste');
      }
    } catch (error: any) {
      console.error('[GOOGLE TTS SETUP] ❌ Erro fatal no teste de voz:', error);
      setErrorMessage(`Erro ao testar voz: ${error.message}`);
    } finally {
      setTestingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Cloud className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Configuração Google Cloud TTS
            </h1>
          </motion.div>
          <p className="text-slate-600">
            Configure o serviço de voz em Português de Portugal para o Tá Pago.pt
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm border-slate-200">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 transition-all ${
                      step.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </motion.div>
                  <div className="text-center hidden md:block">
                    <p className={`text-xs font-medium mb-1 ${
                      currentStep === step.number ? 'text-blue-600' : 'text-slate-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400">{step.subtitle}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200">
              {/* Step 1: Verificar Projeto */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Passo 1: Verificar Projeto Google Cloud
                    </h2>
                    <p className="text-slate-600">
                      Confirme que está no projeto correto no Google Cloud Console
                    </p>
                  </div>

                  {/* Aviso sobre OAuth */}
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-amber-900 mb-2">
                          ⚠️ Se Vir Aviso sobre "OAuth" - IGNORE!
                        </p>
                        <p className="text-sm text-amber-800 mb-2">
                          O Google pode mostrar: <em>"Lembre-se de configurar a tela de permissão OAuth..."</em>
                        </p>
                        <p className="text-sm text-amber-800 font-semibold">
                          ✅ Pode ignorar completamente! OAuth NÃO é necessário para Text-to-Speech.
                        </p>
                        <p className="text-xs text-amber-700 mt-2">
                          OAuth só é usado para aceder a dados privados (Gmail, Drive). Para TTS, basta uma API Key.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 mb-2">
                          Vejo que já está autenticado!
                        </p>
                        <p className="text-sm text-blue-700">
                          Nome do projeto visível: <strong>"Tá Pago"</strong>
                        </p>
                        <p className="text-sm text-blue-700">
                          Número do projeto: <strong>128109583762</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Capturas de Ecrã:</h3>
                    <img 
                      src={googleCloudImg} 
                      alt="Google Cloud Console" 
                      className="rounded-lg border-2 border-slate-200 shadow-lg w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-700">Ações a Tomar:</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">
                          Verifique se está no projeto <strong>"Tá Pago"</strong> (vê o nome no topo da página?)
                        </p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <Circle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">
                          Se não estiver no projeto correto, clique no nome do projeto (topo) e selecione "Tá Pago"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Projeto Confirmado - Avançar
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Ativar API */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Passo 2: Ativar API Text-to-Speech
                    </h2>
                    <p className="text-slate-600">
                      Ative o serviço Cloud Text-to-Speech no seu projeto
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-900 mb-2">
                          Método Mais Rápido - Link Direto
                        </p>
                        <p className="text-sm text-amber-700 mb-3">
                          Clique no botão abaixo para abrir a página da API diretamente:
                        </p>
                        <Button
                          onClick={() => window.open('https://console.cloud.google.com/apis/library/texttospeech.googleapis.com', '_blank')}
                          variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-100"
                        >
                          <ExternalLink className="mr-2 w-4 h-4" />
                          Abrir Google Cloud Console
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-700">Instruções Passo a Passo:</h3>
                    <div className="space-y-2">
                      {[
                        'Abra o link acima numa nova aba do navegador',
                        'Certifique-se de que o projeto "Tá Pago" está selecionado (topo da página)',
                        'Clique no botão azul "ATIVAR" (ou "ENABLE")',
                        'Aguarde 30-60 segundos (uma barra de progresso aparecerá)',
                        'Quando vir "API ativada", volte a esta página',
                      ].map((instruction, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-slate-700">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      API Ativada - Avançar
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Criar Chave */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Passo 3: Criar Chave de API
                    </h2>
                    <p className="text-slate-600">
                      Gere as credenciais de acesso ao serviço
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 mb-2">
                          ⚠️ IMPORTANTE: Copie a Chave Imediatamente!
                        </p>
                        <p className="text-sm text-red-700">
                          A chave só será mostrada uma vez. Guarde-a num local seguro.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">3.1 - Aceder às Credenciais</h3>
                    <Button
                      onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                      variant="outline"
                      className="mb-4"
                    >
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Abrir Página de Credenciais
                    </Button>
                    <p className="text-sm text-slate-600 mb-2">
                      Ou vá manualmente: Menu ☰ → APIs e serviços → Credenciais
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-700">3.2 - Criar a Chave</h3>
                    <div className="space-y-2">
                      {[
                        'No topo da página, clique em "+ CRIAR CREDENCIAIS"',
                        'Selecione "Chave de API" (API key)',
                        'Uma janela popup aparecerá com a sua chave (formato: AIzaSy...)',
                        '⚠️ COPIE A CHAVE IMEDIATAMENTE - Clique em "COPIAR"',
                        'Guarde num local seguro (bloco de notas, gestor de senhas)',
                      ].map((instruction, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-slate-700">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-700">3.3 - Restringir a Chave (SEGURANÇA)</h3>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-slate-700">
                        <strong>Restrições de aplicação:</strong>
                      </p>
                      <div className="pl-4 space-y-2">
                        <p className="text-sm text-slate-600">
                          • Selecione "Referenciadores HTTP (websites)"
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                            *.supabase.co/*
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard('*.supabase.co/*', 'supabase')}
                          >
                            {copiedItems.supabase ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                            localhost:*/*
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard('localhost:*/*', 'localhost')}
                          >
                            {copiedItems.localhost ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 pt-3">
                        <strong>Restrições de API:</strong>
                      </p>
                      <div className="pl-4">
                        <p className="text-sm text-slate-600">
                          • Selecione "Restringir chave"
                        </p>
                        <p className="text-sm text-slate-600">
                          • Marque apenas: ☑️ <strong>Cloud Text-to-Speech API</strong>
                        </p>
                      </div>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white mt-3"
                        disabled
                      >
                        Clique em "GUARDAR" no Google Cloud Console
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Chave Criada - Avançar
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Configurar */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Passo 4: Configurar no Sistema
                    </h2>
                    <p className="text-slate-600">
                      Insira a chave de API do Google Cloud no Tá Pago.pt
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Key className="inline w-4 h-4 mr-2" />
                        API Key do Google Cloud
                      </label>
                      <Input
                        type="text"
                        placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setValidationStatus('idle');
                          setErrorMessage('');
                        }}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Cole a chave que copiou do Google Cloud Console (começa com "AIzaSy...")
                      </p>
                    </div>

                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-red-900">Erro na Validação</p>
                            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {validationStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-green-900">✓ Chave Validada com Sucesso!</p>
                            <p className="text-sm text-green-700 mt-1">
                              A integração com Google Cloud TTS está configurada. A avançar para o teste...
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-between gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      variant="outline"
                      disabled={isValidating}
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={validateApiKey}
                      disabled={isValidating || !apiKey.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          A Validar...
                        </>
                      ) : (
                        <>
                          Validar e Configurar
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Testar */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Passo 5: Testar Voz Portuguesa
                    </h2>
                    <p className="text-slate-600">
                      Valide a integração ouvindo uma voz em Português de Portugal
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-900 mb-2">
                          Configuração Completa!
                        </h3>
                        <p className="text-green-700">
                          A chave de API foi validada com sucesso. Agora vamos testar a voz.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-6 border-2 border-dashed border-slate-300">
                      <div className="flex items-center gap-4 mb-4">
                        <Volume2 className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-slate-800">Teste de Voz PT-PT</h3>
                          <p className="text-sm text-slate-600">
                            Voz: <Badge variant="outline">pt-PT-Wavenet-D (Feminina Neural)</Badge>
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
                        <p className="text-sm text-slate-700 italic">
                          "Olá! Sou a assistente virtual do Tá Pago ponto PT. Este é um teste da integração com Google Cloud Text-to-Speech em Português de Portugal autêntico. A configuração está completa e o sistema está pronto para fazer chamadas telefónicas reais aos devedores."
                        </p>
                      </div>

                      <Button
                        onClick={testVoice}
                        disabled={testingAudio}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        {testingAudio ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            A Sintetizar Voz...
                          </>
                        ) : (
                          <>
                            <Volume2 className="mr-2 w-5 h-5" />
                            Testar Voz Portuguesa
                          </>
                        )}
                      </Button>
                    </div>

                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-red-900">Erro no Teste de Voz</p>
                            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Próximos Passos:</h3>
                    <div className="space-y-2">
                      {[
                        'Teste o agente conversacional em Campanhas Multicanal → Voz IA',
                        'Configure diferentes scripts de conversa para os devedores',
                        'Monitore o uso no Google Cloud Console (Billing → Reports)',
                        'Prepare demonstrações para apresentar ao investidor',
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setCurrentStep(4)}
                      variant="outline"
                      disabled={testingAudio}
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={() => {
                        if (onComplete) {
                          onComplete();
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="mr-2 w-4 h-4" />
                      Concluir Configuração
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Precisa de ajuda? Consulte a{' '}
            <button
              onClick={() => window.open('/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md', '_blank')}
              className="text-blue-600 hover:underline"
            >
              documentação completa
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}