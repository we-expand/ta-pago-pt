import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Check, X, Loader2 } from 'lucide-react';

interface BiometricScanScreenProps {
  isOpen: boolean;
  onComplete: (success: boolean) => void;
  status: 'scanning' | 'success' | 'error' | 'idle';
}

export function BiometricScanScreen({ isOpen, onComplete, status }: BiometricScanScreenProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (status === 'scanning') {
      interval = setInterval(() => {
        setPulseIntensity(prev => (prev + 1) % 3);
      }, 800);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999998] bg-black/60 backdrop-blur-sm"
            onClick={() => {
              if (status === 'success' || status === 'error') {
                onComplete(status === 'success');
              }
            }}
          />

          {/* Modal Centralizado */}
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Background Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                    initial={{
                      x: Math.random() * 500,
                      y: Math.random() * 600,
                    }}
                    animate={{
                      y: [null, Math.random() * 600],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {status === 'scanning' && 'Coloque seu dedo no sensor'}
                    {status === 'success' && 'Biometria Cadastrada!'}
                    {status === 'error' && 'Ops! Algo deu errado'}
                    {status === 'idle' && 'Preparando...'}
                  </h2>
                  <p className="text-purple-300">
                    {status === 'scanning' && 'Siga as instruções do navegador'}
                    {status === 'success' && 'Você já pode fazer login com sua digital'}
                    {status === 'error' && 'Tente novamente ou use senha'}
                    {status === 'idle' && 'Configurando biometria...'}
                  </p>
                </motion.div>

                {/* Fingerprint Animation */}
                <div className="relative flex justify-center mb-8">
                  
                  {/* Outer Rings (Pulsing) */}
                  {status === 'scanning' && (
                    <div className="absolute">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full border-2 border-purple-400/30"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{
                            scale: [1, 2],
                            opacity: [0.6, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.6,
                            ease: "easeOut",
                          }}
                          style={{
                            width: '200px',
                            height: '200px',
                            left: '-50px',
                            top: '-50px',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Central Container */}
                  <motion.div
                    animate={
                      status === 'scanning'
                        ? { scale: [1, 1.05, 1] }
                        : status === 'success'
                        ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                        : status === 'error'
                        ? { scale: [1, 0.9, 1], x: [-5, 5, -5, 5, 0] }
                        : {}
                    }
                    transition={{
                      duration: status === 'scanning' ? 2 : 0.5,
                      repeat: status === 'scanning' ? Infinity : 0,
                    }}
                    className={`
                      relative w-[100px] h-[100px] rounded-full flex items-center justify-center
                      ${status === 'scanning' ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20' : ''}
                      ${status === 'success' ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20' : ''}
                      ${status === 'error' ? 'bg-gradient-to-br from-red-600/20 to-rose-600/20' : ''}
                      ${status === 'idle' ? 'bg-gradient-to-br from-slate-600/20 to-slate-600/20' : ''}
                      backdrop-blur-xl border-2
                      ${status === 'scanning' ? 'border-purple-400/50' : ''}
                      ${status === 'success' ? 'border-green-400/50' : ''}
                      ${status === 'error' ? 'border-red-400/50' : ''}
                      ${status === 'idle' ? 'border-slate-400/50' : ''}
                      shadow-2xl
                    `}
                  >
                    
                    {/* Icon */}
                    <motion.div
                      animate={
                        status === 'scanning'
                          ? { 
                              scale: [1, 1.1, 1],
                              filter: [
                                'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
                                'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))',
                                'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
                              ]
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: status === 'scanning' ? Infinity : 0,
                      }}
                    >
                      {status === 'scanning' && (
                        <Fingerprint className="w-14 h-14 text-purple-400" strokeWidth={1.5} />
                      )}
                      {status === 'success' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <Check className="w-14 h-14 text-green-400" strokeWidth={3} />
                        </motion.div>
                      )}
                      {status === 'error' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <X className="w-14 h-14 text-red-400" strokeWidth={3} />
                        </motion.div>
                      )}
                      {status === 'idle' && (
                        <Loader2 className="w-14 h-14 text-slate-400 animate-spin" />
                      )}
                    </motion.div>

                    {/* Scanning Line */}
                    {status === 'scanning' && (
                      <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden"
                      >
                        <motion.div
                          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                          animate={{
                            top: ['0%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Glow Effect */}
                  {status === 'scanning' && (
                    <motion.div
                      className="absolute rounded-full blur-2xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                        width: '200px',
                        height: '200px',
                        left: '-50px',
                        top: '-50px',
                      }}
                    />
                  )}
                </div>

                {/* Status Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  {status === 'scanning' && (
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-2 text-purple-300"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Aguardando biometria...</span>
                      </motion.div>
                      <p className="text-sm text-slate-400">
                        Use o sensor de digital ou Face ID do seu dispositivo
                      </p>
                    </div>
                  )}
                  
                  {status === 'success' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-green-400 font-medium"
                    >
                      ✨ Tudo pronto!
                    </motion.div>
                  )}
                  
                  {status === 'error' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-red-400 font-medium"
                    >
                      Não foi possível cadastrar
                    </motion.div>
                  )}
                </motion.div>

                {/* Close Button (only on error or success) */}
                {(status === 'success' || status === 'error') && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => onComplete(status === 'success')}
                    className="mt-6 w-full px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all backdrop-blur-sm"
                  >
                    Continuar
                  </motion.button>
                )}
              </div>

              {/* Brand Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute bottom-4 left-0 right-0 text-center text-slate-400 text-xs pb-2"
              >
                Tá Pago.pt • Autenticação Segura
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
