import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Loader, Key } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase';

interface DiagnosticTest {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
  stack?: string;
}

interface DiagnosticResults {
  timestamp: string;
  tests: DiagnosticTest[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
  };
  status: 'healthy' | 'unhealthy';
  recommendation: string;
}

interface StatusCheck {
  configured: boolean;
  source: string;
  keyPreview: string | null;
  recommendation: string;
}

export default function ElevenLabsDiagnostic() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quickStatus, setQuickStatus] = useState<StatusCheck | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Load quick status on mount
  const loadQuickStatus = async () => {
    setLoadingStatus(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/elevenlabs/status`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuickStatus(data);
      }
    } catch (err) {
      console.error('[STATUS] Failed to load quick status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Load status on mount
  React.useEffect(() => {
    loadQuickStatus();
  }, []);

  const runDiagnostics = async () => {
    setRunning(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/diagnose/elevenlabs`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error('[DIAGNOSTIC] Error:', err);
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔍 Diagnóstico ElevenLabs
          </h1>
          <p className="text-slate-300">
            Sistema completo de testes da integração com a API ElevenLabs
          </p>
        </div>

        {/* Quick Status Card */}
        {!loadingStatus && quickStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-5 rounded-2xl border-2 ${
              quickStatus.configured
                ? 'bg-green-500/10 border-green-500/50'
                : 'bg-red-500/10 border-red-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Key className={`w-6 h-6 ${quickStatus.configured ? 'text-green-400' : 'text-red-400'}`} />
              <div className="flex-1">
                <h3 className={`font-semibold ${quickStatus.configured ? 'text-green-400' : 'text-red-400'}`}>
                  {quickStatus.configured ? 'API Key Configurada ✓' : 'API Key Não Configurada ✗'}
                </h3>
                <p className="text-white/70 text-sm mt-1">{quickStatus.recommendation}</p>
                {quickStatus.keyPreview && (
                  <p className="text-white/50 text-xs font-mono mt-2">
                    Chave: {quickStatus.keyPreview} (fonte: {quickStatus.source})
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Run Button */}
        <motion.button
          onClick={runDiagnostics}
          disabled={running}
          className={`w-full mb-8 px-8 py-4 rounded-2xl font-semibold text-white text-lg flex items-center justify-center gap-3 transition-all ${
            running
              ? 'bg-purple-500/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/50'
          }`}
          whileHover={!running ? { scale: 1.02 } : {}}
          whileTap={!running ? { scale: 0.98 } : {}}
        >
          {running ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              A executar testes...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Executar Diagnóstico Completo
            </>
          )}
        </motion.button>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-red-500/20 border-2 border-red-500 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-red-400 font-semibold text-lg mb-2">
                  Erro ao executar diagnóstico
                </h3>
                <p className="text-red-300 font-mono text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div
              className={`p-6 rounded-2xl border-2 ${
                results.status === 'healthy'
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-red-500/10 border-red-500'
              }`}
            >
              <div className="flex items-start gap-4">
                {results.status === 'healthy' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      results.status === 'healthy' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {results.status === 'healthy'
                      ? '✅ Sistema Saudável'
                      : '❌ Problemas Detectados'}
                  </h2>
                  <p className="text-white/80 mb-4">{results.recommendation}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-500/20 rounded-xl p-3">
                      <div className="text-green-400 text-2xl font-bold">
                        {results.summary.passed}
                      </div>
                      <div className="text-green-300 text-sm">Testes Passados</div>
                    </div>
                    <div className="bg-red-500/20 rounded-xl p-3">
                      <div className="text-red-400 text-2xl font-bold">
                        {results.summary.failed}
                      </div>
                      <div className="text-red-300 text-sm">Testes Falhados</div>
                    </div>
                    <div className="bg-yellow-500/20 rounded-xl p-3">
                      <div className="text-yellow-400 text-2xl font-bold">
                        {results.summary.warnings}
                      </div>
                      <div className="text-yellow-300 text-sm">Avisos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Tests */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Testes Individuais</h3>
              {results.tests.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-xl border-2 ${
                    test.passed
                      ? 'bg-green-500/5 border-green-500/30'
                      : test.error?.includes('Skipped')
                      ? 'bg-yellow-500/5 border-yellow-500/30'
                      : 'bg-red-500/5 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {test.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : test.error?.includes('Skipped') ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4
                        className={`font-semibold text-lg mb-2 ${
                          test.passed
                            ? 'text-green-400'
                            : test.error?.includes('Skipped')
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}
                      >
                        {test.name}
                      </h4>

                      {test.error && (
                        <div className="mb-3 p-3 bg-black/20 rounded-lg">
                          <p className="text-red-300 font-mono text-sm">{test.error}</p>
                        </div>
                      )}

                      {test.details && (
                        <div className="bg-black/20 rounded-lg p-4 mt-3">
                          <h5 className="text-white/60 text-xs font-semibold uppercase mb-2">
                            Detalhes
                          </h5>
                          <pre className="text-white/80 text-xs overflow-x-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </div>
                      )}

                      {test.stack && (
                        <details className="mt-3">
                          <summary className="text-white/60 text-sm cursor-pointer hover:text-white/80">
                            Ver stack trace
                          </summary>
                          <pre className="mt-2 p-3 bg-black/20 rounded-lg text-red-300 text-xs overflow-x-auto">
                            {test.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timestamp */}
            <div className="text-center text-white/40 text-sm">
              Executado em: {new Date(results.timestamp).toLocaleString('pt-PT')}
            </div>

            {/* Retry Button */}
            <button
              onClick={runDiagnostics}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Executar Novamente
            </button>
          </motion.div>
        )}

        {/* Instructions */}
        {!results && !running && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border-2 border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-white text-lg font-semibold mb-4">
              ℹ️ O que este diagnóstico testa:
            </h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">1.</span>
                <span>
                  <strong className="text-white">Variável de Ambiente:</strong> Verifica se
                  ELEVENLABS_API_KEY está configurada corretamente
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                <span>
                  <strong className="text-white">KV Store Fallback:</strong> Verifica se a chave
                  está armazenada como fallback
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">3.</span>
                <span>
                  <strong className="text-white">Validação da API:</strong> Testa a chave
                  directamente com a API ElevenLabs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">4.</span>
                <span>
                  <strong className="text-white">Geração TTS Completa:</strong> Testa a geração
                  de áudio do início ao fim
                </span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
