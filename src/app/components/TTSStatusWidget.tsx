import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, CheckCircle2, XCircle, Loader, ChevronRight, Zap } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import ElevenLabsQuickTest from './ElevenLabsQuickTest';

interface TTSStatusWidgetProps {
  onOpenDiagnostic?: () => void;
}

export default function TTSStatusWidget({ onOpenDiagnostic }: TTSStatusWidgetProps) {
  const [status, setStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [keyPreview, setKeyPreview] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
    // Recheck every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
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
      console.error('[TTS WIDGET] Status check failed:', err);
      setStatus('missing');
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'configured':
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
          textColor: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-400',
          label: 'TTS Pronto',
          description: 'Sistema de voz activo',
        };
      case 'missing':
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'from-red-500/20 to-red-600/20 border-red-500/30',
          textColor: 'text-red-400',
          badge: 'bg-red-500/20 text-red-400',
          label: 'TTS Inactivo',
          description: 'Configuração necessária',
        };
      default:
        return {
          icon: <Loader className="w-5 h-5 animate-spin" />,
          color: 'from-slate-500/20 to-slate-600/20 border-slate-500/30',
          textColor: 'text-slate-400',
          badge: 'bg-slate-500/20 text-slate-400',
          label: 'A verificar...',
          description: 'A carregar estado',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <>
      <motion.button
        onClick={() => setShowQuickTest(true)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full p-4 rounded-2xl bg-gradient-to-br ${config.color} border backdrop-blur-sm transition-all hover:shadow-lg group`}
      >
        {/* Pulse animation for active status */}
        {status === 'configured' && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-emerald-500/10"
            animate={{
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl ${config.badge}`}>
            <Mic className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${config.textColor}`}>
                {config.label}
              </span>
              {config.icon}
            </div>
            <div className="text-xs text-white/60">
              {config.description}
            </div>
            {keyPreview && status === 'configured' && (
              <div className="text-xs text-white/40 font-mono mt-1">
                {keyPreview}
              </div>
            )}
          </div>

          {/* Action indicator */}
          <div className="flex items-center gap-2">
            {status === 'configured' && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Testar
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </div>
        </div>
      </motion.button>

      {/* Quick Test Modal */}
      <Dialog open={showQuickTest} onOpenChange={setShowQuickTest}>
        <DialogContent className="sm:max-w-2xl bg-slate-900/95 backdrop-blur-2xl border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              🎙️ Teste Rápido de Voz
            </DialogTitle>
          </DialogHeader>
          <ElevenLabsQuickTest 
            onOpenFullDiagnostic={() => {
              setShowQuickTest(false);
              onOpenDiagnostic?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
