import { motion } from 'motion/react';
import { AlertCircle, Code, RefreshCw, ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  technicalDetails?: string;
  suggestions?: string[];
  onRetry?: () => void;
  onBack?: () => void;
  showCopyButton?: boolean;
}

export default function ErrorDisplay({
  title = 'Ops! Algo deu errado',
  message,
  technicalDetails,
  suggestions = [],
  onRetry,
  onBack,
  showCopyButton = true
}: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const errorText = `${title}\n${message}\n${technicalDetails ? `\nDetalhes técnicos: ${technicalDetails}` : ''}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden flex items-center justify-center p-6">
      {/* Background animado */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 size-72 bg-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 size-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Botão Voltar */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-sm rounded-xl border border-white/60 group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      )}

      {/* Card principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl"
      >
        {/* Glass card */}
        <div className="relative rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-red-500/10 p-8">
          
          {/* Ícone de erro animado */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.4,
                  times: [0, 0.2, 0.4, 0.6, 1]
                }}
                className="size-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <AlertCircle className="size-10 text-white" strokeWidth={2.5} />
              </motion.div>
              
              {/* Pulse ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-red-500 rounded-3xl"
              />
            </motion.div>
          </div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-2xl font-bold text-slate-900 mb-3"
          >
            {title}
          </motion.h1>

          {/* Mensagem principal */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-slate-600 mb-6 leading-relaxed"
          >
            {message}
          </motion.p>

          {/* Detalhes técnicos */}
          {technicalDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="size-4 text-red-400" />
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Detalhes Técnicos</span>
                  </div>
                  
                  {showCopyButton && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-xs text-slate-300 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Código do erro */}
                <div className="relative">
                  <pre className="text-xs text-red-300 font-mono leading-relaxed overflow-x-auto">
                    <code>{technicalDetails}</code>
                  </pre>
                  
                  {/* Gradiente de fade nas bordas */}
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 size-32 bg-red-500/10 rounded-full blur-2xl"></div>
              </div>
            </motion.div>
          )}

          {/* Sugestões */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  💡
                </motion.div>
                Possíveis soluções:
              </h3>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100"
                  >
                    <div className="size-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed">{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3"
          >
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="size-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Tentar Novamente</span>
              </button>
            )}
            
            {onBack && !onRetry && (
              <button
                onClick={onBack}
                className="flex-1 py-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl font-semibold text-white hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-500/30 flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
                <span>Voltar</span>
              </button>
            )}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs text-center text-slate-500 mt-6"
          >
            Se o problema persistir, entre em contato com nosso{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
              suporte técnico
            </a>
          </motion.p>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute -top-20 -right-20 size-40 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 size-40 bg-orange-500/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
}
