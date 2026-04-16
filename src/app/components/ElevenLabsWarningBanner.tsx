import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase';

interface Props {
  onOpenDiagnostic?: () => void;
}

export default function ElevenLabsWarningBanner({ onOpenDiagnostic }: Props) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has already dismissed this session
    const wasDismissed = sessionStorage.getItem('elevenlabs_warning_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      setLoading(false);
      return;
    }

    // Check configuration status
    checkStatus();
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
        if (!data.configured) {
          setShow(true);
        }
      }
    } catch (error) {
      console.warn('[WARNING BANNER] Failed to check status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('elevenlabs_warning_dismissed', 'true');
  };

  if (loading || dismissed || !show) {
    return null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              
              <div className="flex-1">
                <p className="text-sm font-medium">
                  <strong>Configuração pendente:</strong> A chave API da ElevenLabs não está configurada. 
                  As funcionalidades de voz não estarão disponíveis.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDismiss();
                    onOpenDiagnostic?.();
                  }}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Resolver Agora
                </button>

                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
