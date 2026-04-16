import React, { useState, useEffect } from 'react';
import { Phone, Play, Pause, Volume2, VolumeX, Sparkles, Mic, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';

export default function VoiceAgentDemo() {
  const [script, setScript] = useState(`Bom dia, Pedro. Aqui é a Sofia, assistente virtual da Tá Pago.

Estou a ligar relativamente ao pagamento pendente de 2450 euros, com vencimento no dia 15 de março.

Gostaríamos de oferecer condições especiais para regularizar esta situação. Podemos fazer um acordo com desconto à vista ou parcelamento facilitado.

Está interessado em negociar? Se sim, prima 1. Se preferir falar com um atendente humano, prima 2. Para reagendar este contacto, prima 3.`);

  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Filter STRICTLY for Portuguese from Portugal (pt-PT) ONLY
      const ptPTVoices = voices.filter(v => 
        v.lang === 'pt-PT' || v.lang.startsWith('pt-PT')
      );

      console.log('[WEB SPEECH] Total voices available:', voices.length);
      console.log('[WEB SPEECH] pt-PT voices found:', ptPTVoices.length);
      console.log('[WEB SPEECH] pt-PT voices:', ptPTVoices.map(v => `${v.name} (${v.lang})`));
      
      if (ptPTVoices.length > 0) {
        setAvailableVoices(ptPTVoices);
        setSelectedVoice(ptPTVoices[0].name);
      } else {
        // No pt-PT voices found - show empty state
        setAvailableVoices([]);
        setSelectedVoice('');
      }
    };

    loadVoices();
    
    // Chrome needs this event listener
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = () => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
    
    // Find selected voice
    const voice = availableVoices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.volume = isMuted ? 0 : volume / 100;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'pt-PT';

    utterance.onstart = () => {
      console.log('[WEB SPEECH] Started speaking');
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      console.log('[WEB SPEECH] Finished speaking');
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (error) => {
      console.error('[WEB SPEECH] Error:', error);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      speak();
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
          <Phone className="size-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agente de Voz IA - DEMO GRATUITA</h1>
          <p className="text-slate-600 mt-1">Teste de voz 100% gratuito usando Web Speech API do navegador</p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-900 mb-1">✅ Demo 100% Gratuita!</p>
            <p className="text-xs text-green-700">
              Esta demo usa Web Speech API nativa do navegador - completamente GRÁTIS, sem necessidade de API keys ou planos pagos. 
              Funciona offline e tem vozes portuguesas incluídas no sistema operativo.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Editor */}
        <div className="space-y-4">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Selecionar Voz</label>
            {availableVoices.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">⚠️ A carregar vozes disponíveis...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableVoices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => setSelectedVoice(voice.name)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      selectedVoice === voice.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{voice.name}</p>
                        <p className="text-xs text-slate-500">
                          {voice.lang} {voice.localService ? '(Local)' : '(Online)'}
                        </p>
                      </div>
                      <Mic className="size-4 text-purple-600" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Script Editor */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Script de Voz</label>
            <Textarea 
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="rounded-xl min-h-[200px] font-mono text-sm"
              placeholder="Digite o script aqui..."
            />
          </div>

          {/* Voice Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Velocidade: {rate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Tom: {pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          {/* Tips */}
          <Card className="bg-orange-50 border border-orange-200 p-4">
            <p className="text-sm text-orange-900 font-bold mb-2">🎙️ Dicas:</p>
            <ul className="text-xs text-orange-700 space-y-1 list-disc list-inside">
              <li>Use pontuação para pausas naturais</li>
              <li>Velocidade 0.9x recomendada para português</li>
              <li>Teste diferentes vozes para achar a melhor</li>
              <li>Chrome e Edge têm as melhores vozes PT</li>
            </ul>
          </Card>
        </div>

        {/* Right Column - Player */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Player de Voz</label>
          
          {/* Audio Player UI */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
            {/* Waveform Animation */}
            <div className="flex items-center justify-center gap-1 mb-8 h-32">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-white/30 rounded-full"
                  animate={{
                    height: isPlaying && !isPaused
                      ? [20, Math.random() * 100 + 20, 20]
                      : 20
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: (isPlaying && !isPaused) ? Infinity : 0,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>

            {/* Main Play Button */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={handlePlayPause}
                disabled={!selectedVoice || script.trim().length === 0}
                className="bg-white text-purple-600 p-6 rounded-full hover:scale-110 transition-transform shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying && !isPaused ? (
                  <Pause className="size-10" fill="currentColor" />
                ) : (
                  <Play className="size-10 ml-1" fill="currentColor" />
                )}
              </button>

              {isPlaying && (
                <button
                  onClick={handleStop}
                  className="bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all font-medium"
                >
                  Parar
                </button>
              )}
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 max-w-xs mx-auto">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-5 text-white" />
                ) : (
                  <Volume2 className="size-5 text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
              />
              <span className="text-xs text-white font-mono w-10 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>

            {/* Status */}
            <div className="mt-6 text-center">
              {isPlaying ? (
                <p className="text-white text-sm">
                  {isPaused ? '⏸️ Pausado' : '🎙️ A falar...'}
                </p>
              ) : (
                <p className="text-white/70 text-xs">
                  Clique em Play para ouvir o script com a voz selecionada
                </p>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <Card className="bg-indigo-50 border border-indigo-200 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-900 font-bold mb-1">Web Speech API</p>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Tecnologia de síntese de voz nativa do navegador. Funciona offline, sem custos, 
                  e inclui vozes portuguesas de qualidade. Perfeito para protótipos e demos!
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-50 border border-purple-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-purple-900 font-bold mb-1">Para Produção</p>
                <p className="text-xs text-purple-700 leading-relaxed">
                  Para chamadas reais em produção, recomendamos APIs premium como ElevenLabs, 
                  Google Cloud Text-to-Speech ou Azure Speech Service com vozes neural portuguesas de alta qualidade.
                </p>
              </div>
            </div>
          </Card>

          {/* Call Flow */}
          <Card className="bg-white border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-900 mb-3">Fluxo da Chamada:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <kbd className="bg-purple-100 px-2 py-1 rounded font-mono text-purple-700 font-bold">1</kbd>
                <span className="text-slate-600">Aceitar negociação → Acordo</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <kbd className="bg-purple-100 px-2 py-1 rounded font-mono text-purple-700 font-bold">2</kbd>
                <span className="text-slate-600">Falar com humano → Atendente</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <kbd className="bg-purple-100 px-2 py-1 rounded font-mono text-purple-700 font-bold">3</kbd>
                <span className="text-slate-600">Reagendar → Nova data</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}