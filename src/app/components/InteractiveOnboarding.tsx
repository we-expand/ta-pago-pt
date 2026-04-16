import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Users, 
  Upload, 
  Settings as SettingsIcon,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Zap,
  Download,
  FileUp,
  Plus,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';
import { Logo } from './Logo';

interface InteractiveOnboardingProps {
  onComplete: () => void;
  session: any;
}

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export default function InteractiveOnboarding({ onComplete, session }: InteractiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // User preferences
  const [preferredChannels, setPreferredChannels] = useState<string[]>([]);
  const [importMethod, setImportMethod] = useState<'manual' | 'csv' | 'api' | null>(null);
  const [automationLevel, setAutomationLevel] = useState<'basic' | 'advanced' | 'full' | null>(null);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    } else {
      // Mark onboarding as complete in localStorage
      localStorage.setItem('tapago_onboarding_complete', 'true');
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tapago_onboarding_complete', 'true');
    onComplete();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Welcome screen
      case 2: return preferredChannels.length > 0;
      case 3: return importMethod !== null;
      case 4: return automationLevel !== null;
      case 5: return true; // Final step
      default: return false;
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  const toggleChannel = (channel: string) => {
    setPreferredChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Skip Button */}
      <motion.button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
        whileHover={{ scale: 1.05 }}
      >
        Pular configuração →
      </motion.button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-slate-100">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Header */}
          <div className="p-8 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <motion.div
                    key={step}
                    className={`size-2 rounded-full transition-all ${
                      step === currentStep
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 w-8'
                        : completedSteps.includes(step)
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                    }`}
                    initial={false}
                    animate={{ 
                      width: step === currentStep ? 32 : 8,
                      opacity: step === currentStep ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Passo {currentStep} de 5
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* STEP 1: WELCOME */}
                {currentStep === 1 && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                      className="inline-block mb-6"
                    >
                      <div className="size-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Rocket className="size-12 text-white" />
                      </div>
                    </motion.div>
                    
                    <h2 className="text-4xl font-bold text-slate-900 mb-3">
                      Bem-vindo ao TaPago! 🎉
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
                      Vamos configurar sua plataforma em <span className="font-semibold text-indigo-600">apenas 5 passos</span>. 
                      Levará menos de 3 minutos!
                    </p>

                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {[
                        { icon: <Zap className="size-6" />, label: 'Rápido' },
                        { icon: <Sparkles className="size-6" />, label: 'Fácil' },
                        { icon: <Target className="size-6" />, label: 'Eficaz' }
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200"
                        >
                          <div className="text-indigo-600 mb-2 flex justify-center">{feature.icon}</div>
                          <div className="text-sm font-semibold text-slate-700">{feature.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: CHANNELS */}
                {currentStep === 2 && (
                  <div className="py-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                        <MessageSquare className="size-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Escolha seus canais de cobrança
                      </h2>
                      <p className="text-slate-600">
                        Selecione os canais que deseja usar para contatar seus devedores
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {[
                        { 
                          id: 'email', 
                          icon: <Mail className="size-8" />, 
                          label: 'Email',
                          description: 'Comunicação profissional',
                          popular: true
                        },
                        { 
                          id: 'whatsapp', 
                          icon: <MessageSquare className="size-8" />, 
                          label: 'WhatsApp',
                          description: 'Resposta rápida',
                          popular: true
                        },
                        { 
                          id: 'sms', 
                          icon: <Phone className="size-8" />, 
                          label: 'SMS',
                          description: 'Alcance garantido',
                          popular: false
                        }
                      ].map((channel) => (
                        <motion.button
                          key={channel.id}
                          onClick={() => toggleChannel(channel.id)}
                          className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                            preferredChannels.includes(channel.id)
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                          }`}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {channel.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                                Popular
                              </span>
                            </div>
                          )}
                          
                          <div className={`mb-3 ${preferredChannels.includes(channel.id) ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {channel.icon}
                          </div>
                          <h3 className="font-bold text-slate-900 mb-1">{channel.label}</h3>
                          <p className="text-sm text-slate-600">{channel.description}</p>
                          
                          {preferredChannels.includes(channel.id) && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="absolute top-4 right-4"
                            >
                              <div className="size-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                <Check className="size-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: IMPORT METHOD */}
                {currentStep === 3 && (
                  <div className="py-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                        <Users className="size-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Como deseja adicionar devedores?
                      </h2>
                      <p className="text-slate-600">
                        Escolha o método que melhor se adapta ao seu fluxo
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {[
                        { 
                          id: 'manual', 
                          icon: <Plus className="size-8" />, 
                          label: 'Manual',
                          description: 'Adicione um por um',
                          recommended: false
                        },
                        { 
                          id: 'csv', 
                          icon: <FileUp className="size-8" />, 
                          label: 'Importar CSV',
                          description: 'Upload em massa',
                          recommended: true
                        },
                        { 
                          id: 'api', 
                          icon: <Zap className="size-8" />, 
                          label: 'Integração',
                          description: 'Conectar ERP/CRM',
                          recommended: false
                        }
                      ].map((method) => (
                        <motion.button
                          key={method.id}
                          onClick={() => setImportMethod(method.id as any)}
                          className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                            importMethod === method.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                          }`}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {method.recommended && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full">
                                Recomendado
                              </span>
                            </div>
                          )}
                          
                          <div className={`mb-3 ${importMethod === method.id ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {method.icon}
                          </div>
                          <h3 className="font-bold text-slate-900 mb-1">{method.label}</h3>
                          <p className="text-sm text-slate-600">{method.description}</p>
                          
                          {importMethod === method.id && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="absolute top-4 right-4"
                            >
                              <div className="size-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                <Check className="size-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: AUTOMATION LEVEL */}
                {currentStep === 4 && (
                  <div className="py-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                        <SettingsIcon className="size-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Nível de automação desejado
                      </h2>
                      <p className="text-slate-600">
                        Quanto controle você quer sobre as cobranças?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                      {[
                        { 
                          id: 'basic', 
                          label: 'Básico',
                          description: 'Eu aprovo cada ação antes de enviar',
                          features: ['Controle total', 'Sem surpresas', 'Aprendizado gradual']
                        },
                        { 
                          id: 'advanced', 
                          label: 'Avançado',
                          description: 'IA sugere, eu aprovo rapidamente',
                          features: ['Sugestões inteligentes', 'Aprovação rápida', 'Economia de tempo'],
                          recommended: true
                        },
                        { 
                          id: 'full', 
                          label: 'Automático',
                          description: 'IA cuida de tudo automaticamente',
                          features: ['100% automático', 'IA aprende sozinha', 'Máxima eficiência']
                        }
                      ].map((level) => (
                        <motion.button
                          key={level.id}
                          onClick={() => setAutomationLevel(level.id as any)}
                          className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                            automationLevel === level.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {level.recommended && (
                            <div className="absolute -top-3 right-6">
                              <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                                Recomendado
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 size-12 rounded-xl flex items-center justify-center ${
                              automationLevel === level.id 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              <SettingsIcon className="size-6" />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-900 mb-1 text-lg">{level.label}</h3>
                              <p className="text-slate-600 mb-3">{level.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {level.features.map((feature, i) => (
                                  <span 
                                    key={i}
                                    className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-600"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {automationLevel === level.id && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="flex-shrink-0"
                              >
                                <div className="size-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                  <Check className="size-4 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: READY TO GO */}
                {currentStep === 5 && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                      className="inline-block mb-6"
                    >
                      <div className="size-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Check className="size-12 text-white" />
                      </div>
                    </motion.div>
                    
                    <h2 className="text-4xl font-bold text-slate-900 mb-3">
                      Tudo pronto! 🚀
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
                      Sua plataforma está configurada e pronta para usar. 
                      Vamos começar a recuperar seus pagamentos!
                    </p>

                    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-4">Resumo da Configuração:</h3>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="size-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">Canais selecionados</div>
                            <div className="text-xs text-slate-600">
                              {preferredChannels.length > 0 ? preferredChannels.join(', ') : 'Nenhum'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                            <Upload className="size-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">Método de importação</div>
                            <div className="text-xs text-slate-600 capitalize">
                              {importMethod || 'Não definido'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-pink-600 flex items-center justify-center flex-shrink-0">
                            <Zap className="size-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">Nível de automação</div>
                            <div className="text-xs text-slate-600 capitalize">
                              {automationLevel || 'Não definido'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between gap-4">
              {/* Back Button */}
              {currentStep > 1 && (
                <motion.button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all border border-slate-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="size-4" />
                  Voltar
                </motion.button>
              )}

              {/* Spacer */}
              {currentStep === 1 && <div />}

              {/* Next Button */}
              <motion.button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                whileHover={canProceed() ? { scale: 1.05, y: -2 } : {}}
                whileTap={canProceed() ? { scale: 0.95 } : {}}
              >
                {currentStep === 5 ? (
                  <>
                    <Rocket className="size-5" />
                    Começar Agora!
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="size-5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
