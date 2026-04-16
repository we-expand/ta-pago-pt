import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Video } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FeatureExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    title: string;
    description: string;
    details: string[];
    benefits: string[];
    icon: any;
    color: string;
    audioText: string;
    category: string;
  } | null;
}

export default function FeatureExplanationModal({ isOpen, onClose, feature }: FeatureExplanationModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop audio when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!feature) return null;

  const playAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(feature.audioText);
    utterance.lang = 'pt-PT';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    audioRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 p-8 text-white`}>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="size-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <feature.icon className="size-8" />
                      </motion.div>
                      <div>
                        <div className="text-sm font-medium opacity-90 mb-1">{feature.category}</div>
                        <h2 className="text-3xl font-black">{feature.title}</h2>
                      </div>
                    </div>

                    <motion.button
                      onClick={onClose}
                      className="size-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="size-6" />
                    </motion.button>
                  </div>

                  <p className="text-lg text-white/90">{feature.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                {/* Audio & Video Controls */}
                <div className="flex gap-3 mb-8">
                  <motion.button
                    onClick={playAudio}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                      isPlayingAudio
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="size-5" />
                        Pausar Áudio
                      </>
                    ) : (
                      <>
                        <Play className="size-5" />
                        Ouvir Explicação
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={toggleMute}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                  </motion.button>

                  <motion.button
                    onClick={() => setShowVideo(!showVideo)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold transition-all shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Video className="size-5" />
                    {showVideo ? 'Ocultar' : 'Ver'} Vídeo Demo
                  </motion.button>
                </div>

                {/* Video Section */}
                <AnimatePresence>
                  {showVideo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 rounded-2xl overflow-hidden bg-slate-900"
                    >
                      <video
                        className="w-full"
                        controls
                        autoPlay
                        loop
                        muted={isMuted}
                      >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-data-processing-106339-large.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeo.
                      </video>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className={`size-2 rounded-full bg-${feature.color}-500`} />
                    Como Funciona
                  </h3>
                  <div className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={`size-6 rounded-full bg-${feature.color}-100 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`text-xs font-bold text-${feature.color}-600`}>{i + 1}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{detail}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className={`size-2 rounded-full bg-${feature.color}-500`} />
                    Benefícios
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {feature.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        className={`p-4 bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-xl border border-${feature.color}-200`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        whileHover={{ scale: 1.05, y: -3 }}
                      >
                        <p className="text-slate-800 font-medium">{benefit}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Waveform Animation (when audio is playing) */}
                {isPlayingAudio && (
                  <motion.div
                    className="mt-6 flex items-center justify-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 bg-gradient-to-t from-${feature.color}-500 to-${feature.color}-600 rounded-full`}
                        animate={{
                          height: [8, 24, 8]
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.05
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}