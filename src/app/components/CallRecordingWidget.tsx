import { Play, Pause, Download, Phone, ShieldCheck, FileText, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function CallRecordingWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 rounded-lg text-green-700">
            <Phone className="w-3 h-3" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700">Chamada Recebida</div>
            <div className="text-[10px] text-slate-400">Hoje, 14:30 • Twilio VoIP</div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
          <ShieldCheck className="w-3 h-3 text-indigo-600" />
          <span className="text-[10px] font-bold text-indigo-700">Auditada</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Agent/Client Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Ana Silva (Agente)</div>
              <div className="text-[10px] text-slate-500">Duração: 04:12</div>
            </div>
          </div>
        </div>

        {/* Player */}
        <div className="bg-slate-900 rounded-lg p-3 flex items-center gap-3 shadow-inner">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-slate-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
          </button>
          
          <div className="flex-1 flex flex-col justify-center gap-1">
            {/* Fake Waveform */}
            <div className="h-6 flex items-center gap-[2px] opacity-80">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full"
                  animate={{ 
                    height: isPlaying ? [8, 16, 8] : 8,
                    opacity: i / 24 < progress / 100 ? 1 : 0.3 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                  style={{ height: [8, 12, 16, 6, 14, 8][i % 6] }}
                />
              ))}
            </div>
          </div>
          
          <div className="text-[10px] text-white font-mono opacity-80">
            01:24
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
            <FileText className="w-3 h-3" />
            Ler Transcrição
          </button>
          <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50">
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}