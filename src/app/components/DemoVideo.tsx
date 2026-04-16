import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize2,
  Brain,
  Zap,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  DollarSign,
  Users,
  Target,
  Sparkles,
  Check,
  ArrowRight
} from 'lucide-react';

interface DemoVideoProps {
  onClose: () => void;
}

// 40 SEGUNDOS DE VÍDEO DIVIDIDO EM CENAS
const TOTAL_DURATION = 40; // segundos
const FPS = 30;
const TOTAL_FRAMES = TOTAL_DURATION * FPS;

export default function DemoVideo({ onClose }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSceneRef = useRef<number>(-1);
  
  const currentTime = (currentFrame / FPS);
  const progress = (currentFrame / TOTAL_FRAMES) * 100;

  // Determinar cena atual baseado no tempo
  const getCurrentScene = () => {
    if (currentTime < 3) return 0;  // Intro (0-3s)
    if (currentTime < 8) return 1;  // Problema (3-8s)
    if (currentTime < 13) return 2; // Solução (8-13s)
    if (currentTime < 23) return 3; // Features (13-23s)
    if (currentTime < 33) return 4; // Resultados (23-33s)
    return 5; // CTA (33-40s)
  };

  const currentScene = getCurrentScene();

  // Narração por cena (Web Speech API)
  const sceneNarrations: { [key: number]: string } = {
    0: 'TaPago. Cobrança com inteligência artificial. Recupere pagamentos enquanto dorme.',
    1: 'Cansado de perseguir clientes? Emails ignorados, ligações sem resposta, dinheiro parado e tempo desperdiçado.',
    2: 'Nossa inteligência artificial trabalha por você! Automatização inteligente que aprende e evolui a cada interação.',
    3: 'Multi-canal: WhatsApp, Email, SMS e Voz. IA Preditiva com score 87 por cento preciso. Timing perfeito para cada cliente. ROI médio de 107 vezes.',
    4: 'Resultados que impressionam: 68 por cento de taxa de recuperação, 2 ponto 4 milhões de euros recuperados por mês, ROI de 107 vezes, e sempre ativo 24 horas por dia.',
    5: 'Comece agora! Junte-se a centenas de empresas que já recuperaram milhões. Criar conta grátis. Sem cartão, setup em 5 minutos, cancele quando quiser.'
  };

  // Áudio narrado sincronizado
  useEffect(() => {
    if (currentScene !== lastSceneRef.current) {
      lastSceneRef.current = currentScene;
      
      if (!isMuted && isPlaying && sceneNarrations[currentScene]) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(sceneNarrations[currentScene]);
        utterance.lang = 'pt-PT';
        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        // Speak
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
      }
    }
    
    // Cleanup when muted or paused
    if (isMuted || !isPlaying) {
      window.speechSynthesis.cancel();
    }
  }, [currentScene, isMuted, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Animação do vídeo
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      setCurrentFrame((prev) => {
        if (prev >= TOTAL_FRAMES - 1) {
          setIsPlaying(false);
          return TOTAL_FRAMES - 1;
        }
        return prev + 1;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Áudio sincronizado (simulação - você pode adicionar áudio real aqui)
  useEffect(() => {
    if (!isMuted && isPlaying) {
      // Aqui você pode adicionar reprodução de áudio real
      // const audio = new Audio('/path-to-audio.mp3');
      // audio.currentTime = currentTime;
      // audio.play();
    }
  }, [currentTime, isMuted, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newFrame = Math.floor(percentage * TOTAL_FRAMES);
    setCurrentFrame(newFrame);
  };

  const restart = () => {
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-6xl aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 size-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <X className="size-5" />
        </button>

        {/* Video Content - Animated Scenes */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {/* SCENE 0: INTRO (0-3s) */}
            {currentScene === 0 && (
              <SceneIntro key="intro" progress={(currentTime / 3) * 100} />
            )}

            {/* SCENE 1: PROBLEMA (3-8s) */}
            {currentScene === 1 && (
              <SceneProblema key="problema" progress={((currentTime - 3) / 5) * 100} />
            )}

            {/* SCENE 2: SOLUÇÃO (8-13s) */}
            {currentScene === 2 && (
              <SceneSolucao key="solucao" progress={((currentTime - 8) / 5) * 100} />
            )}

            {/* SCENE 3: FEATURES (13-23s) */}
            {currentScene === 3 && (
              <SceneFeatures key="features" progress={((currentTime - 13) / 10) * 100} />
            )}

            {/* SCENE 4: RESULTADOS (23-33s) */}
            {currentScene === 4 && (
              <SceneResultados key="resultados" progress={((currentTime - 23) / 10) * 100} />
            )}

            {/* SCENE 5: CTA (33-40s) */}
            {currentScene === 5 && (
              <SceneCTA key="cta" progress={((currentTime - 33) / 7) * 100} onRestart={restart} />
            )}
          </AnimatePresence>
        </div>

        {/* Audio Waveform Visualization (decorativo) */}
        {isPlaying && !isMuted && (
          <div className="absolute bottom-20 left-0 right-0 flex items-end justify-center gap-1 px-4 opacity-30">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: [10, Math.random() * 40 + 10, 10]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          {/* Progress Bar */}
          <div
            className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="size-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
              </button>

              {/* Time */}
              <span className="text-white text-sm font-medium">
                {Math.floor(currentTime)}s / {TOTAL_DURATION}s
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Mute */}
              <button
                onClick={toggleMute}
                className="size-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="size-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <Maximize2 className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ========================================
// CENAS ANIMADAS
// ========================================

// INTRO (0-3s) - Logo + Título impactante
function SceneIntro({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      className="flex flex-col items-center justify-center text-white px-8 text-center"
    >
      {/* Logo animado */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 1, repeat: Infinity }}
        className="mb-8"
      >
        <div className="text-8xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          TaPago
        </div>
      </motion.div>

      {/* Título */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl font-black mb-4"
      >
        Cobrança com{' '}
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          IA
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-indigo-200 font-light"
      >
        Recupere pagamentos enquanto dorme 💤
      </motion.p>

      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute size-2 bg-white rounded-full"
          animate={{
            x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1
          }}
          style={{
            left: `${50 + Math.random() * 30 - 15}%`,
            top: `${50 + Math.random() * 30 - 15}%`
          }}
        />
      ))}
    </motion.div>
  );
}

// PROBLEMA (3-8s) - Mostra o caos sem automação
function SceneProblema({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="flex flex-col items-center justify-center text-white px-12 max-w-5xl"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="mb-8"
      >
        <div className="text-8xl">😰</div>
      </motion.div>

      <h2 className="text-5xl font-black mb-6 text-center">
        Cansado de perseguir clientes?
      </h2>

      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {[
          { icon: '📧', text: 'Emails ignorados', color: 'from-red-500 to-orange-500' },
          { icon: '📞', text: 'Ligações sem resposta', color: 'from-orange-500 to-yellow-500' },
          { icon: '💸', text: 'Dinheiro parado', color: 'from-yellow-500 to-red-500' },
          { icon: '⏰', text: 'Tempo desperdiçado', color: 'from-red-500 to-pink-500' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className={`p-6 bg-gradient-to-br ${item.color} rounded-2xl text-center`}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="font-bold text-xl">{item.text}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// SOLUÇÃO (8-13s) - Apresenta a IA como solução
function SceneSolucao({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      className="flex flex-col items-center justify-center text-white px-12"
    >
      {/* Brain Animado */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-8"
      >
        <div className="relative">
          <Brain className="size-32 text-purple-400" />
          <motion.div
            className="absolute inset-0 bg-purple-400 rounded-full blur-3xl opacity-50"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <h2 className="text-6xl font-black mb-4 text-center">
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          IA que Trabalha
        </span>
        <br />
        por Você!
      </h2>

      <p className="text-3xl text-indigo-200 font-light text-center max-w-2xl">
        Automatização inteligente que aprende e evolui a cada interação
      </p>

      {/* Zap Effects */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            repeat: Infinity
          }}
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 2) * 40}%`
          }}
        >
          <Zap className="size-8 text-yellow-400" />
        </motion.div>
      ))}
    </motion.div>
  );
}

// FEATURES (13-23s) - Mostra 4 features principais
function SceneFeatures({ progress }: { progress: number }) {
  const features = [
    {
      icon: MessageSquare,
      title: 'Multi-Canal',
      desc: 'WhatsApp • Email • SMS • Voz',
      color: 'from-green-400 to-emerald-400',
      emoji: '📱'
    },
    {
      icon: Brain,
      title: 'IA Preditiva',
      desc: 'Score de pagamento 87% preciso',
      color: 'from-purple-400 to-pink-400',
      emoji: '🧠'
    },
    {
      icon: Target,
      title: 'Timing Perfeito',
      desc: 'Hora certa para cada cliente',
      color: 'from-blue-400 to-cyan-400',
      emoji: '🎯'
    },
    {
      icon: TrendingUp,
      title: 'ROI 107x',
      desc: 'Retorno médio comprovado',
      color: 'from-yellow-400 to-orange-400',
      emoji: '📈'
    }
  ];

  const currentFeature = Math.floor((progress / 100) * features.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-12"
    >
      <div className="grid grid-cols-2 gap-8 max-w-5xl">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: i <= currentFeature ? 1 : 0.3,
              scale: i === currentFeature ? 1.1 : 1
            }}
            transition={{ delay: i * 0.3 }}
            className={`relative p-8 bg-gradient-to-br ${feature.color} rounded-3xl text-white overflow-hidden`}
          >
            {/* Background Effect */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                scale: i === currentFeature ? [1, 1.5, 1] : 1,
                opacity: i === currentFeature ? [0.2, 0.4, 0.2] : 0.2
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="text-6xl mb-4">{feature.emoji}</div>
              <h3 className="text-3xl font-black mb-2">{feature.title}</h3>
              <p className="text-lg font-light opacity-90">{feature.desc}</p>

              {i === currentFeature && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 size-16 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="size-10 text-green-600" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// RESULTADOS (23-33s) - Números impressionantes
function SceneResultados({ progress }: { progress: number }) {
  const stats = [
    { value: '68%', label: 'Taxa de Recuperação', icon: '🎯' },
    { value: '€2.4M', label: 'Recuperado/Mês', icon: '💰' },
    { value: '107x', label: 'ROI Médio', icon: '📊' },
    { value: '24/7', label: 'Sempre Ativo', icon: '⚡' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col items-center justify-center text-white px-12"
    >
      <motion.h2
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl font-black mb-12 text-center"
      >
        Resultados que{' '}
        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Impressionam
        </span>
      </motion.h2>

      <div className="grid grid-cols-4 gap-6 max-w-5xl">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, repeatDelay: 2 }}
              className="text-7xl mb-4"
            >
              {stat.icon}
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
              className="text-6xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2"
            >
              {stat.value}
            </motion.div>

            <div className="text-lg text-indigo-200 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute size-3 rounded-full"
          style={{
            background: ['#60A5FA', '#A78BFA', '#F472B6', '#FBBF24'][i % 4],
            left: `${Math.random() * 100}%`,
            top: -20
          }}
          animate={{
            y: [0, 800],
            rotate: [0, 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: 3,
            delay: i * 0.1,
            repeat: Infinity
          }}
        />
      ))}
    </motion.div>
  );
}

// CTA (33-40s) - Call to action final
function SceneCTA({ progress, onRestart }: { progress: number; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center text-white px-12 text-center"
    >
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-8"
      >
        <Sparkles className="size-24 text-yellow-400" />
      </motion.div>

      <motion.h2
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-7xl font-black mb-6"
      >
        Comece{' '}
        <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          AGORA
        </span>
      </motion.h2>

      <p className="text-3xl text-indigo-200 font-light mb-8 max-w-2xl">
        Junte-se a centenas de empresas que já recuperaram milhões
      </p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="px-12 py-6 bg-gradient-to-r from-green-400 to-emerald-400 text-slate-900 rounded-2xl font-black text-2xl shadow-2xl flex items-center gap-3"
      >
        Criar Conta Grátis
        <ArrowRight className="size-8" />
      </motion.button>

      <p className="text-sm text-indigo-300 mt-6">
        ✨ Sem cartão • Setup em 5min • Cancele quando quiser
      </p>

      {/* Restart button */}
      <motion.button
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl text-white font-semibold flex items-center gap-2 transition-all"
      >
        <Play className="size-5" />
        Assistir Novamente
      </motion.button>

      {/* Fireworks */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          <motion.div
            className="size-4 bg-yellow-400 rounded-full"
            animate={{
              scale: [0, 2, 0],
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}