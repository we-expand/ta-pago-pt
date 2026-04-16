import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Check, 
  Eye, 
  EyeOff,
  Loader2,
  Rocket
} from 'lucide-react';
import { signUp, signIn } from '../../utils/auth';  // Fixed: removed one '../'

interface InteractiveAuthProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
  mode?: 'signup' | 'login';
}

type Step = 1 | 2 | 3 | 4;

export default function InteractiveAuth({ onSuccess, onBackToLanding, mode: initialMode = 'signup' }: InteractiveAuthProps) {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userName, setUserName] = useState('');
  
  // Validation states
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [companyValid, setCompanyValid] = useState(false);
  const [userValid, setUserValid] = useState(false);

  // Validate email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  // Validate password
  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  // Validate company
  useEffect(() => {
    setCompanyValid(companyName.length >= 2);
  }, [companyName]);

  // Validate user
  useEffect(() => {
    setUserValid(userName.length >= 2);
  }, [userName]);

  const handleNext = () => {
    if (mode === 'login') {
      // Login tem apenas 1 step
      handleSubmitWrapper();
      return;
    }

    if (currentStep === 1 && emailValid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && passwordValid) {
      setCurrentStep(3);
    } else if (currentStep === 3 && companyValid) {
      setCurrentStep(4);
    } else if (currentStep === 4 && userValid) {
      handleSubmitWrapper();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const handleSubmitWrapper = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'signup') {
        console.log('=== SIGNUP FLOW ===');
        console.log('Email:', email);
        console.log('Company:', companyName);
        console.log('Name:', userName);
        const result = await signUp(email, password, companyName, userName);
        console.log('Signup result:', result);
        if (result.success) {
          console.log('Signup successful, calling onSuccess');
          onSuccess();
        } else {
          console.error('Signup failed:', result.error);
          setError(result.error || 'Erro ao criar conta');
        }
      } else {
        console.log('=== LOGIN FLOW ===');
        console.log('Attempting login with:', email);
        const result = await signIn(email, password);
        console.log('Login result:', result);
        if (result.success) {
          console.log('Login successful, calling onSuccess');
          // Force a small delay to ensure Supabase session is set
          await new Promise(resolve => setTimeout(resolve, 500));
          onSuccess();
        } else {
          console.error('Login failed:', result.error);
          setError(result.error || 'Credenciais inválidas');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signup' ? 'login' : 'signup');
    setCurrentStep(1);
    setError('');
  };

  const getStepTitle = () => {
    if (mode === 'login') return 'Bem-vindo de volta';
    
    switch (currentStep) {
      case 1: return 'Qual é o seu email?';
      case 2: return 'Crie uma senha segura';
      case 3: return 'Nome da sua empresa';
      case 4: return 'Como devemos te chamar?';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    if (mode === 'login') return 'Faça login para continuar';
    
    switch (currentStep) {
      case 1: return 'Vamos começar com o seu melhor email profissional';
      case 2: return 'Proteja sua conta com uma senha forte (mín. 6 caracteres)';
      case 3: return 'Nos conte sobre a sua empresa';
      case 4: return 'Precisamos saber como te chamar';
      default: return '';
    }
  };

  const canProceed = () => {
    if (mode === 'login') return emailValid && passwordValid;
    
    switch (currentStep) {
      case 1: return emailValid;
      case 2: return passwordValid;
      case 3: return companyValid;
      case 4: return userValid;
      default: return false;
    }
  };

  const progressPercentage = mode === 'login' ? 100 : (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-6 relative overflow-hidden">
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

      {/* Back to Landing */}
      <motion.button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="size-4" />
        <span className="text-sm font-medium">Voltar</span>
      </motion.button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-slate-100">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Header */}
          <div className="p-8 pb-0">
            <div className="flex items-center justify-center mb-6">
              <Logo />
            </div>

            {/* Step Indicator */}
            {mode === 'signup' && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <motion.div
                    key={step}
                    className={`h-1.5 rounded-full ${
                      step <= currentStep
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                        : 'bg-slate-200'
                    }`}
                    style={{ width: step <= currentStep ? '32px' : '12px' }}
                    initial={false}
                    animate={{ 
                      width: step <= currentStep ? '32px' : '12px',
                      opacity: step <= currentStep ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            )}

            {/* Title Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {getStepTitle()}
                </h2>
                <p className="text-sm text-slate-600 font-light">
                  {getStepSubtitle()}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`form-${mode}-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* LOGIN MODE */}
                {mode === 'login' && (
                  <div className="space-y-4">
                    <InputField
                      icon={<Mail className="size-5 text-slate-400" />}
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={setEmail}
                      onKeyPress={handleKeyPress}
                      isValid={emailValid || email === ''}
                      autoFocus
                    />
                    <InputField
                      icon={<Lock className="size-5 text-slate-400" />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={password}
                      onChange={setPassword}
                      onKeyPress={handleKeyPress}
                      isValid={passwordValid || password === ''}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      }
                    />
                  </div>
                )}

                {/* SIGNUP MODE - STEP 1: EMAIL */}
                {mode === 'signup' && currentStep === 1 && (
                  <InputField
                    icon={<Mail className="size-5 text-slate-400" />}
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={setEmail}
                    onKeyPress={handleKeyPress}
                    isValid={emailValid || email === ''}
                    autoFocus
                    showValidation={email !== ''}
                  />
                )}

                {/* SIGNUP MODE - STEP 2: PASSWORD */}
                {mode === 'signup' && currentStep === 2 && (
                  <div className="space-y-3">
                    <InputField
                      icon={<Lock className="size-5 text-slate-400" />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={setPassword}
                      onKeyPress={handleKeyPress}
                      isValid={passwordValid || password === ''}
                      autoFocus
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      }
                      showValidation={password !== ''}
                    />
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <PasswordStrength strength={getPasswordStrength(password)} />
                      </motion.div>
                    )}
                  </div>
                )}

                {/* SIGNUP MODE - STEP 3: COMPANY */}
                {mode === 'signup' && currentStep === 3 && (
                  <InputField
                    icon={<Building2 className="size-5 text-slate-400" />}
                    type="text"
                    placeholder="Ex: TaPago Lda"
                    value={companyName}
                    onChange={setCompanyName}
                    onKeyPress={handleKeyPress}
                    isValid={companyValid || companyName === ''}
                    autoFocus
                    showValidation={companyName !== ''}
                  />
                )}

                {/* SIGNUP MODE - STEP 4: NAME */}
                {mode === 'signup' && currentStep === 4 && (
                  <InputField
                    icon={<User className="size-5 text-slate-400" />}
                    type="text"
                    placeholder="Seu nome completo"
                    value={userName}
                    onChange={setUserName}
                    onKeyPress={handleKeyPress}
                    isValid={userValid || userName === ''}
                    autoFocus
                    showValidation={userName !== ''}
                  />
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  {/* Back Button - Only show in signup after step 1 */}
                  {mode === 'signup' && currentStep > 1 && (
                    <motion.button
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="size-4" />
                    </motion.button>
                  )}

                  {/* Next/Submit Button */}
                  <motion.button
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      canProceed() && !loading
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    whileHover={canProceed() && !loading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canProceed() && !loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : mode === 'signup' && currentStep === 4 ? (
                      <>
                        <Rocket className="size-5" />
                        Criar Conta
                      </>
                    ) : mode === 'login' ? (
                      <>
                        Entrar
                        <ArrowRight className="size-5" />
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="size-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {mode === 'signup' ? (
                <>
                  Já tem uma conta? <span className="font-semibold text-indigo-600">Fazer login</span>
                </>
              ) : (
                <>
                  Não tem conta? <span className="font-semibold text-indigo-600">Criar agora</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          {[
            { icon: <Sparkles className="size-4" />, text: 'Setup em 5min' },
            { icon: <Check className="size-4" />, text: 'Sem cartão' },
            { icon: <Lock className="size-4" />, text: 'GDPR Compliant' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-xs text-slate-600"
            >
              {feature.icon}
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Input Field Component
interface InputFieldProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isValid: boolean;
  autoFocus?: boolean;
  rightIcon?: React.ReactNode;
  showValidation?: boolean;
}

function InputField({ 
  icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  onKeyPress, 
  isValid, 
  autoFocus,
  rightIcon,
  showValidation = false
}: InputFieldProps) {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`relative flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all ${
        showValidation && value
          ? isValid
            ? 'border-green-300 bg-green-50/50'
            : 'border-red-300 bg-red-50/50'
          : 'border-slate-200 bg-white hover:border-indigo-300 focus-within:border-indigo-500'
      }`}
    >
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        autoFocus={autoFocus}
        className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
      />
      {showValidation && value && isValid && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Check className="size-5 text-green-600" />
        </motion.div>
      )}
      {rightIcon && <div>{rightIcon}</div>}
    </motion.div>
  );
}

// Password Strength Component
function PasswordStrength({ strength }: { strength: number }) {
  const getColor = () => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = () => {
    if (strength < 40) return 'Fraca';
    if (strength < 70) return 'Média';
    return 'Forte';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">Força da senha:</span>
        <span className={`font-semibold ${
          strength < 40 ? 'text-red-600' : strength < 70 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getLabel()}
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// Helper function
function getPasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 6) strength += 25;
  if (password.length >= 10) strength += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
  
  return Math.min(strength, 100);
}