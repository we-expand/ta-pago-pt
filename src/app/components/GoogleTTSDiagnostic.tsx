import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

export default function GoogleTTSDiagnostic() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testApiKeyDirectly = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        error: 'Por favor, insira a API Key',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Testar diretamente a API do Google (sem passar pelo backend)
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=pt-PT`
      );

      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          voicesCount: data.voices?.length || 0,
          voices: data.voices?.slice(0, 5).map((v: any) => ({
            name: v.name,
            gender: v.ssmlGender,
          })),
        });
      } else {
        setTestResult({
          success: false,
          error: data.error?.message || 'Erro desconhecido',
          errorCode: data.error?.code,
          googleError: data.error,
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        error: `Erro de rede: ${error.message}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const getErrorDiagnostic = () => {
    if (!testResult || testResult.success) return null;

    const { error, errorCode } = testResult;

    if (error?.includes('has not been used in project') || error?.includes('not been enabled')) {
      return {
        title: '🚨 API Text-to-Speech NÃO está ativada!',
        description: 'Esta é a causa mais comum do erro.',
        solution: 'Ative em: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com',
        color: 'red',
        actionUrl: 'https://console.cloud.google.com/apis/library/texttospeech.googleapis.com',
        actionText: 'Ativar API Agora',
      };
    }

    if (error?.includes('API key not valid') || error?.includes('invalid')) {
      return {
        title: '🔑 Formato da API Key Inválido',
        description: 'A chave deve começar com "AIzaSy" e ter ~39 caracteres.',
        solution: 'Verifique se copiou a chave completa sem espaços ou quebras de linha.',
        color: 'orange',
      };
    }

    if (error?.includes('referer') || errorCode === 403) {
      return {
        title: '🛡️ Restrições Bloqueando Acesso',
        description: 'As restrições da chave estão muito rígidas.',
        solution: 'Adicione "*.supabase.co/*" nas restrições HTTP da chave.',
        color: 'amber',
        actionUrl: 'https://console.cloud.google.com/apis/credentials',
        actionText: 'Editar Restrições',
      };
    }

    return {
      title: '❌ Erro Desconhecido',
      description: error,
      solution: 'Consulte a documentação ou logs para mais detalhes.',
      color: 'slate',
    };
  };

  const diagnostic = getErrorDiagnostic();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          🔍 Diagnóstico Google Cloud TTS
        </h2>
        <p className="text-slate-600">
          Teste a sua API Key diretamente com a API do Google (sem passar pelo backend)
        </p>
      </div>

      {/* Input API Key */}
      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            API Key do Google Cloud
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm pr-10"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={testApiKeyDirectly} disabled={testing || !apiKey.trim()}>
              {testing ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  A Testar...
                </>
              ) : (
                'Testar Chave'
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cole a chave que copiou do Google Cloud Console
          </p>
        </div>

        {/* Validação do Formato */}
        {apiKey && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700">Validação do Formato:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                {apiKey.startsWith('AIzaSy') ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={apiKey.startsWith('AIzaSy') ? 'text-green-700' : 'text-red-700'}>
                  Começa com "AIzaSy"
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {apiKey.length >= 35 && apiKey.length <= 45 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={
                    apiKey.length >= 35 && apiKey.length <= 45 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  Tamanho: {apiKey.length} caracteres (esperado: 35-45)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {!/\s/.test(apiKey) ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={!/\s/.test(apiKey) ? 'text-green-700' : 'text-red-700'}>
                  Sem espaços ou quebras de linha
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Resultado do Teste */}
      {testResult && (
        <Card className={`p-6 ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          {testResult.success ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 text-lg mb-2">
                    ✅ API Key Válida!
                  </h3>
                  <p className="text-green-700 mb-4">
                    A chave está funcionando perfeitamente. Encontradas {testResult.voicesCount}{' '}
                    vozes PT-PT disponíveis.
                  </p>

                  {testResult.voices && testResult.voices.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Primeiras vozes disponíveis:
                      </p>
                      <div className="space-y-1">
                        {testResult.voices.map((voice: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">{voice.gender}</Badge>
                            <span className="text-slate-700">{voice.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-green-100 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-green-900 mb-2">
                      ✅ Próximos Passos:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                      <li>Configure esta chave no sistema Tá Pago.pt</li>
                      <li>Teste a voz portuguesa no assistente</li>
                      <li>Configure restrições de segurança (HTTP + API)</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 text-lg mb-2">❌ Erro na Validação</h3>
                  <p className="text-sm text-red-700 mb-3">
                    <strong>Erro:</strong> {testResult.error}
                  </p>
                  {testResult.errorCode && (
                    <p className="text-sm text-red-700 mb-3">
                      <strong>Código:</strong> {testResult.errorCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Diagnóstico e Solução */}
              {diagnostic && (
                <div
                  className={`bg-${diagnostic.color}-100 border-2 border-${diagnostic.color}-300 rounded-lg p-4`}
                >
                  <div className="space-y-3">
                    <h4 className={`font-bold text-${diagnostic.color}-900 text-lg`}>
                      {diagnostic.title}
                    </h4>
                    <p className={`text-sm text-${diagnostic.color}-800`}>
                      {diagnostic.description}
                    </p>
                    <div className={`bg-${diagnostic.color}-50 rounded-lg p-3`}>
                      <p className={`text-xs font-medium text-${diagnostic.color}-900 mb-2`}>
                        💡 Solução:
                      </p>
                      <p className={`text-sm text-${diagnostic.color}-800 mb-3`}>
                        {diagnostic.solution}
                      </p>
                      {diagnostic.actionUrl && (
                        <Button
                          onClick={() => window.open(diagnostic.actionUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className={`border-${diagnostic.color}-400 text-${diagnostic.color}-700`}
                        >
                          <ExternalLink className="mr-2 w-4 h-4" />
                          {diagnostic.actionText}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes Técnicos (Expandível) */}
              {testResult.googleError && (
                <details className="bg-white rounded-lg p-4 border border-red-200">
                  <summary className="cursor-pointer text-sm font-medium text-red-900">
                    🔍 Ver Detalhes Técnicos
                  </summary>
                  <pre className="mt-3 text-xs text-slate-700 overflow-auto p-3 bg-slate-50 rounded">
                    {JSON.stringify(testResult.googleError, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Checklist de Verificação */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-4">📋 Checklist de Verificação</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">API Text-to-Speech Ativada?</p>
              <p className="text-xs text-blue-700">
                Verifique em:{' '}
                <a
                  href="https://console.cloud.google.com/apis/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  APIs Dashboard
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Projeto Correto Selecionado?</p>
              <p className="text-xs text-blue-700">Deve ser "Tá Pago!" ou "ta-pago-1"</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Chave Copiada Corretamente?</p>
              <p className="text-xs text-blue-700">
                Sem espaços, quebras de linha, ou caracteres extras
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Aguardou 2-3 Minutos?</p>
              <p className="text-xs text-blue-700">
                Após criar/editar a chave, o Google leva alguns minutos para propagar
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Links Úteis */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-4">🔗 Links Úteis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                'https://console.cloud.google.com/apis/library/texttospeech.googleapis.com',
                '_blank'
              )
            }
            className="justify-start"
          >
            <ExternalLink className="mr-2 w-4 h-4" />
            Ativar API Text-to-Speech
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open('https://console.cloud.google.com/apis/credentials', '_blank')
            }
            className="justify-start"
          >
            <ExternalLink className="mr-2 w-4 h-4" />
            Gerenciar Credenciais
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open('https://console.cloud.google.com/apis/dashboard', '_blank')
            }
            className="justify-start"
          >
            <ExternalLink className="mr-2 w-4 h-4" />
            Dashboard de APIs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open('https://console.cloud.google.com/billing/reports', '_blank')
            }
            className="justify-start"
          >
            <ExternalLink className="mr-2 w-4 h-4" />
            Monitorar Uso/Custos
          </Button>
        </div>
      </Card>
    </div>
  );
}
