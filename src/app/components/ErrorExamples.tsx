import { useState } from 'react';
import ErrorDisplay from './ErrorDisplay';
import { motion } from 'motion/react';

type ErrorType = 'json' | 'network' | '404' | '500' | 'auth' | null;

export default function ErrorExamples() {
  const [currentError, setCurrentError] = useState<ErrorType>(null);

  const renderError = () => {
    switch (currentError) {
      case 'json':
        return (
          <ErrorDisplay
            title="Erro ao processar resposta do servidor"
            message="Recebemos uma resposta inválida do servidor. Isso pode acontecer quando há um problema na comunicação entre o navegador e nossa API."
            technicalDetails="Unexpected non-whitespace character after JSON at position 4 (line 1 column 5)"
            suggestions={[
              'Verifique sua conexão com a internet e tente novamente',
              'Limpe o cache do navegador e recarregue a página',
              'Se você está em uma rede corporativa, verifique se não há firewall bloqueando a requisição',
              'Tente fazer logout e login novamente',
              'Entre em contato com o suporte se o erro persistir'
            ]}
            onRetry={() => {
              console.log('Tentando novamente...');
              setCurrentError(null);
            }}
            onBack={() => setCurrentError(null)}
          />
        );

      case 'network':
        return (
          <ErrorDisplay
            title="Sem conexão com a internet"
            message="Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
            technicalDetails="NetworkError: Failed to fetch - ERR_INTERNET_DISCONNECTED"
            suggestions={[
              'Verifique se seu Wi-Fi ou cabo de rede está conectado',
              'Teste sua conexão acessando outros sites',
              'Reinicie seu roteador se necessário',
              'Desative VPN temporariamente se estiver usando'
            ]}
            onRetry={() => {
              console.log('Tentando novamente...');
              setCurrentError(null);
            }}
            onBack={() => setCurrentError(null)}
          />
        );

      case '404':
        return (
          <ErrorDisplay
            title="Página não encontrada"
            message="A página que você está procurando não existe ou foi movida para outro endereço."
            technicalDetails="HTTP 404 - /api/v1/usuarios/12345 - Resource not found"
            suggestions={[
              'Verifique se o endereço (URL) está correto',
              'Volte para a página inicial e navegue novamente',
              'O conteúdo pode ter sido removido ou renomeado',
              'Use a busca para encontrar o que procura'
            ]}
            onBack={() => setCurrentError(null)}
          />
        );

      case '500':
        return (
          <ErrorDisplay
            title="Erro interno do servidor"
            message="Algo deu errado do nosso lado. Nossa equipe já foi notificada e está trabalhando para resolver."
            technicalDetails="HTTP 500 - Internal Server Error - Error ID: ERR_2024_12_21_1543"
            suggestions={[
              'Tente novamente em alguns minutos',
              'Limpe os cookies e cache do navegador',
              'Se urgente, entre em contato com o suporte informando o Error ID acima',
              'Acompanhe nosso status em status.tapago.pt'
            ]}
            onRetry={() => {
              console.log('Tentando novamente...');
              setCurrentError(null);
            }}
            onBack={() => setCurrentError(null)}
          />
        );

      case 'auth':
        return (
          <ErrorDisplay
            title="Sessão expirada"
            message="Sua sessão expirou por segurança. Por favor, faça login novamente para continuar."
            technicalDetails="AuthError: JWT token expired at 2024-12-21T15:43:00Z"
            suggestions={[
              'Clique no botão abaixo para fazer login novamente',
              'Certifique-se de marcar "Lembrar-me" se quiser permanecer conectado',
              'Por segurança, sessões expiram após 24 horas de inatividade'
            ]}
            onRetry={() => {
              console.log('Redirecionando para login...');
              setCurrentError(null);
            }}
            onBack={() => setCurrentError(null)}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl font-bold text-slate-900 mb-3">
                  Exemplos de Telas de Erro
                </h1>
                <p className="text-slate-600">
                  Clique em um dos exemplos abaixo para visualizar
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* JSON Error */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setCurrentError('json')}
                  className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 hover:shadow-lg transition-all group"
                >
                  <div className="size-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">💥</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">JSON Parse Error</h3>
                  <p className="text-sm text-slate-600">Erro ao processar resposta</p>
                </motion.button>

                {/* Network Error */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setCurrentError('network')}
                  className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 hover:shadow-lg transition-all group"
                >
                  <div className="size-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📡</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Network Error</h3>
                  <p className="text-sm text-slate-600">Sem conexão com internet</p>
                </motion.button>

                {/* 404 Error */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setCurrentError('404')}
                  className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 hover:shadow-lg transition-all group"
                >
                  <div className="size-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">404 Not Found</h3>
                  <p className="text-sm text-slate-600">Página não encontrada</p>
                </motion.button>

                {/* 500 Error */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setCurrentError('500')}
                  className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 hover:shadow-lg transition-all group"
                >
                  <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">500 Server Error</h3>
                  <p className="text-sm text-slate-600">Erro interno do servidor</p>
                </motion.button>

                {/* Auth Error */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setCurrentError('auth')}
                  className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 hover:shadow-lg transition-all group"
                >
                  <div className="size-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Auth Error</h3>
                  <p className="text-sm text-slate-600">Sessão expirada</p>
                </motion.button>

                {/* Custom Error */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => alert('Você pode criar qualquer tipo de erro personalizado!')}
                  className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl border border-white/60 hover:shadow-lg transition-all group"
                >
                  <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Custom Error</h3>
                  <p className="text-sm text-white/90">Crie seu próprio erro</p>
                </motion.button>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
              >
                <p className="text-sm text-slate-600 mb-4">
                  Design System TaPago.pt • Glassmorphism + Framer Motion
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                  <span>✅ Responsivo</span>
                  <span>✅ Animado</span>
                  <span>✅ Acessível</span>
                  <span>✅ Reutilizável</span>
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return <>{renderError()}</>;
}
