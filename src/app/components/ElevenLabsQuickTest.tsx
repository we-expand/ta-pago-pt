import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Loader, 
  Play, 
  Pause,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Mic
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase';

interface QuickTestProps {
  onOpenFullDiagnostic?: () => void;
}

export default function ElevenLabsQuickTest({ onOpenFullDiagnostic }: QuickTestProps) {
  const [status, setStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
  const [testing, setTesting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyPreview, setKeyPreview] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Check status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setStatus('checking');
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
        setStatus(data.configured ? 'configured' : 'missing');
        setKeyPreview(data.keyPreview);
      } else {
        setStatus('missing');
      }
    } catch (err) {
      console.error('[QUICK TEST] Status check failed:', err);
      setStatus('missing');
    }
  };

  const runQuickTest = async () => {
    setTesting(true);
    setError(null);
    setAudioUrl(null);
    setIsDemoMode(false);

    try {
      console.log('🧪 [QUICK TEST] Starting TTS test...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/tts/generate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Olá! Isto é um teste rápido da integração ElevenLabs com voz portuguesa autêntica.',
            voiceId: 'benedita-pt',
          }),
        }
      );

      console.log('[QUICK TEST] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Verifica se é modo demo
      const demoMode = response.headers.get('X-Demo-Mode') === 'true';
      setIsDemoMode(demoMode);

      if (demoMode) {
        console.log('⚠️ [QUICK TEST] Demo mode active - ElevenLabs unavailable');
      }

      // Converte resposta para blob e cria URL local
      const audioBlob = await response.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      
      console.log('✅ [QUICK TEST] Audio generated successfully!' + (demoMode ? ' (DEMO MODE)' : ''));
      setAudioUrl(blobUrl);
      
    } catch (err: any) {
      console.error('❌ [QUICK TEST] Error:', err);
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'configured': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      case 'missing': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'configured': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'missing': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Loader className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'configured': return 'API Configurada ✓';
      case 'missing': return 'API Não Configurada ✗';
      default: return 'A verificar...';
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Mic className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              Teste Rápido ElevenLabs TTS
            </h3>
            <p className="text-sm text-white/60">
              Voz portuguesa autêntica para demos
            </p>
          </div>
          <button
            onClick={checkStatus}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Actualizar status"
          >
            <RefreshCw className="w-4 h-4 text-white/60 hover:text-white/90" />
          </button>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border-2 mb-4 ${getStatusColor()}`}>
          {getStatusIcon()}
          <div className="flex-1">
            <div className="font-semibold">{getStatusText()}</div>
            {keyPreview && (
              <div className="text-xs opacity-70 font-mono mt-1">
                Chave: {keyPreview}
              </div>
            )}
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={runQuickTest}
          disabled={testing || status === 'missing'}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all mb-4 ${
            testing || status === 'missing'
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/50'
          }`}
        >
          {testing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              A gerar áudio...
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              Testar TTS Agora
            </>
          )}
        </button>

        {/* Demo Mode Warning */}
        <AnimatePresence>
          {isDemoMode && audioUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-yellow-400 mb-1">
                    ⚠️ Modo Demonstração Activo
                  </div>
                  <div className="text-xs text-yellow-300">
                    A conta ElevenLabs está temporariamente indisponível. Sistema funcionando em modo demo para demonstrações.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-red-400 mb-1">
                    Erro no Teste
                  </div>
                  <div className="text-xs text-red-300 font-mono">
                    {error}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Player */}
        <AnimatePresence>
          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Play className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-emerald-400 mb-1">
                    ✅ Áudio gerado com sucesso!
                  </div>
                  <div className="text-xs text-emerald-300">
                    Clique para ouvir o resultado
                  </div>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onOpenFullDiagnostic}
            className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Diagnóstico Completo
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/50 space-y-1">
            <p>💡 <strong>Dica para demos:</strong> Execute este teste antes de apresentar ao investidor</p>
            <p>🎯 <strong>Vozes:</strong> Benedita e Diogo (ElevenLabs Premium) - optimizadas para Português PT</p>
            <p>⚠️ <strong>Modo Demo:</strong> Sistema funciona em demonstração quando vozes premium não estão disponíveis</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}