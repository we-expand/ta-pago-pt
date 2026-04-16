import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, projectId, publicAnonKey } from '../../utils/supabase';
import { startAuthentication } from '@simplewebauthn/browser';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Fingerprint, 
  X,
  ShieldCheck,
  ChevronLeft,
  ScanFace,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { EtherealBackground } from './ui/EtherealBackground';

// --- Types & Interfaces ---
type AuthStep = 'identify' | 'verify' | 'password' | 'biometric' | 'success';

interface CinematicAuthProps {
  mode: 'login' | 'signup';
  onSuccess: (session?: any) => void;
  onBackToLanding: () => void;
}

// --- Visual Component: The "Ethereal" Scanner (Light Mode) ---
const BiometricScannerVisual = ({ onCancel, remainingTime }: { onCancel: () => void; remainingTime: number }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 relative space-y-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Soft Glowing Rings */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-slate-200 w-full h-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-dashed border-indigo-100 w-40 h-40"
        />

        {/* Central Glass Container */}
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-white shadow-[0_8px_32px_rgba(99,102,241,0.15)] border border-white/60 flex items-center justify-center z-10 backdrop-blur-xl">
          
          {/* Fingerprint Icon - Clean Slate Color */}
          <Fingerprint className="w-16 h-16 text-slate-300" strokeWidth={1} />
          
          {/* Scanning Beam (Light/Medical Style) */}
          <motion.div 
            initial={{ top: "-20%", opacity: 0 }}
            animate={{ top: "120%", opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-12 w-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent z-20 backdrop-blur-sm"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-cyan-500" 
          />
        </div>
        <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">
          Coloque sua digital no sensor
        </p>
        
        {/* Contador de tempo */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{remainingTime}s restantes</span>
        </div>
      </motion.div>

      {/* Botão para voltar */}
      <button
        onClick={onCancel}
        className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 mt-4"
      >
        <KeyRound className="size-4" />
        Usar Senha
      </button>
    </div>
  );
};

export default function CinematicAuth({ mode = 'login', onSuccess, onBackToLanding }: CinematicAuthProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(mode);
  const [step, setStep] = useState<AuthStep | 'details'>('identify');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricTimer, setBiometricTimer] = useState(30);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'identify' && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  // Contador regressivo para biometria
  useEffect(() => {
    if (step === 'biometric' && biometricTimer > 0) {
      const interval = setInterval(() => {
        setBiometricTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, biometricTimer]);

  // --- Actions ---

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'login' ? 'signup' : 'login');
    setStep('identify');
    setError('');
    setPassword('');
  };

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setEmail(cleanEmail);
    if (currentMode === 'signup') {
      setStep('details');
    } else {
      setStep('verify');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setStep('password');
  };

  const handleChoosePassword = () => {
    setStep('password');
  };

  const handleChooseBiometric = async () => {
    setStep('biometric');
    setBiometricTimer(30); // Reset timer
    setLoading(true);
    setError('');

    try {
      // Verificar se o navegador suporta Web Authentication API
      if (!window.PublicKeyCredential) {
        setLoading(false);
        setError('Seu navegador não suporta autenticação biométrica. Use "Usar Senha".');
        return;
      }

      console.log('[BIOMETRIC] Iniciando autenticação biométrica...');
      console.log('[BIOMETRIC] Aguardando digital do usuário (30 segundos)...');
      
      // Timeout de 30 segundos para o usuário colocar a digital
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError('⏱️ Tempo esgotado. Toque no botão "Usar Senha" para fazer login tradicional.');
      }, 30000);

      // Tentar autenticação WebAuthn real
      try {
        const cleanEmail = email.trim().toLowerCase();
        
        // 1. Obter opções de autenticação do backend
        console.log('[BIOMETRIC] Solicitando opções de autenticação...');
        const optionsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/login/options`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail })
        });

        if (!optionsRes.ok) {
          const err = await optionsRes.json();
          throw new Error(err.error || 'Usuário não tem biometria cadastrada');
        }

        const { options, userId } = await optionsRes.json();
        console.log('[BIOMETRIC] Opções recebidas, aguardando credencial...');

        // 2. Obter credencial biométrica do usuário usando @simplewebauthn/browser
        const authResponse = await startAuthentication(options);

        clearTimeout(timeoutId);

        if (!authResponse) {
          throw new Error('Nenhuma credencial obtida');
        }

        console.log('[BIOMETRIC] Credencial obtida, validando no servidor...');
        setLoading(true);

        // 3. Verificar autenticação no backend
        const verifyRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/login/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, response: authResponse })
        });

        if (!verifyRes.ok) {
          const err = await verifyRes.json();
          throw new Error(err.error || 'Falha na validação biométrica');
        }

        const { verified, session: backendSession } = await verifyRes.json();

        if (!verified || !backendSession) {
          throw new Error('Verificação biométrica falhou');
        }

        console.log('[BIOMETRIC] Autenticação bem-sucedida!');
        
        // 5. Configurar sessão no Supabase client
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: backendSession.access_token,
          refresh_token: backendSession.refresh_token
        });

        if (sessionError || !session) {
          throw new Error('Falha ao configurar sessão');
        }

        completeLogin(session);

      } catch (credentialError: any) {
        clearTimeout(timeoutId);
        
        // Usuário cancelou ou erro na credencial
        if (credentialError.name === 'NotAllowedError') {
          console.log('[BIOMETRIC] Usuário cancelou a autenticação');
          setLoading(false);
          setError('Autenticação cancelada. Toque em "Usar Senha" para continuar.');
        } else {
          console.error('[BIOMETRIC ERROR]', credentialError);
          setLoading(false);
          setError('Erro na autenticação biométrica. Use "Usar Senha" para continuar.');
        }
      }

    } catch (err: any) {
      console.error('[BIOMETRIC ERROR]', err);
      setLoading(false);
      setError(err.message || 'Falha na autenticação biométrica. Use "Usar Senha".');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (currentMode === 'signup') {
        // Registration Flow
        console.log('[SIGNUP] Enviando requisição de cadastro...');
        console.log('[SIGNUP] Usando publicAnonKey:', publicAnonKey);
        
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/auth/signup`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: cleanEmail,
            password: password,
            userName: name,
            companyName: company
          })
        });

        const data = await res.json();
        console.log('[SIGNUP] Resposta do servidor:', data);
        
        if (!res.ok) {
          console.error('[SIGNUP ERROR] Falha no cadastro:', data);
          throw new Error(data.error || 'Erro ao criar conta');
        }

        // Auto login after signup
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (loginError) throw loginError;
        completeLogin(loginData.session);

      } else {
        // Login Flow
        console.log('[LOGIN] Tentando login com:', cleanEmail);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (error) {
          console.error('[LOGIN ERROR]', error);
          throw error;
        }
        
        console.log('[LOGIN SUCCESS]', data.user?.email);
        completeLogin(data.session);
      }
    } catch (err: any) {
      console.error('[AUTH ERROR]', err);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro desconhecido';
      
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado';
      } else if (err.message.includes('User not found')) {
        errorMessage = 'Usuário não encontrado';
      } else if (err.message.includes('já está cadastrado')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else {
        errorMessage = err.message || 'Credenciais incorretas';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (sessionData?: any) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('last_email', email);
    setStep('success');
    setTimeout(() => {
      onSuccess(sessionData);
    }, 1500);
  };

  // --- Renders ---

  const renderIdentify = () => (
    <form onSubmit={handleIdentify} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 ml-1">Email Profissional</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 size-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
          <input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@empresa.com"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-300"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 hover:bg-slate-800 hover:scale-[1.01] transition-all"
      >
        {currentMode === 'signup' ? 'Continuar Cadastro' : 'Continuar'}
        <ArrowRight className="size-4" />
      </button>
      
      <div className="text-center pt-2">
         <p className="text-sm text-slate-400">
           {currentMode === 'login' ? (
             <>Ainda não é cliente? <span onClick={toggleMode} className="text-indigo-600 font-semibold cursor-pointer hover:underline">Solicitar Acesso</span></>
           ) : (
             <>Já tem conta? <span onClick={toggleMode} className="text-indigo-600 font-semibold cursor-pointer hover:underline">Fazer Login</span></>
           )}
         </p>
      </div>
    </form>
  );

  const renderDetails = () => (
    <form onSubmit={handleDetailsSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 ml-1">Seu Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 ml-1">Nome da Empresa</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ex: Tech Solutions Lda"
            className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
      >
        Definir Senha
        <ArrowRight className="size-4" />
      </button>
    </form>
  );

  const renderVerify = () => (
    <div className="space-y-4">
      <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 mb-6">
        <div className="size-10 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-600 font-bold shrink-0 border border-white">
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 truncate">{email}</p>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <p className="text-xs text-slate-500">Identidade Confirmada</p>
          </div>
        </div>
        <button onClick={() => setStep('identify')} className="ml-auto text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
          Alterar
        </button>
      </div>

      <button
        onClick={handleChooseBiometric}
        className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-indigo-900/10 flex items-center justify-between px-6 group relative overflow-hidden transition-all hover:scale-[1.01]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
            <Fingerprint className="size-6 text-white" />
          </div>
          <div className="text-left">
            <span className="block text-lg">Entre com a sua digital</span>
            <span className="text-xs text-white/60 font-medium">Recomendado</span>
          </div>
        </div>
        <ArrowRight className="size-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all relative z-10" />
      </button>

      <button
        onClick={handleChoosePassword}
        className="w-full py-5 bg-white border border-slate-100 text-slate-600 rounded-2xl font-semibold hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900 transition-all flex items-center justify-between px-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <KeyRound className="size-6 text-slate-400" />
          </div>
          <span className="text-lg">Usar Senha</span>
        </div>
      </button>
    </div>
  );

  const renderPassword = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 ml-1">
          {currentMode === 'signup' ? 'Escolha uma Senha' : 'Senha de Acesso'}
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 size-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900"
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1 rounded-lg hover:bg-slate-100"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {currentMode === 'signup' && (
          <p className="text-xs text-slate-400 ml-1">Mínimo de 6 caracteres</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
      >
        {loading ? <Loader2 className="animate-spin size-5" /> : (currentMode === 'signup' ? 'Finalizar Cadastro' : 'Acessar Conta')}
      </button>

      {currentMode === 'login' && (
        <div className="text-center">
          <button type="button" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">
            Esqueci minha senha
          </button>
        </div>
      )}
    </form>
  );

  const renderSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <div className="size-24 bg-gradient-to-tr from-emerald-100 to-green-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="size-10" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo de volta!</h3>
      <p className="text-slate-500">Preparando seu ambiente...</p>
    </motion.div>
  );

  const getTitle = () => {
    switch(step) {
      case 'identify': return currentMode === 'signup' ? 'Criar Conta' : 'Acesse sua conta';
      case 'details': return 'Sobre você';
      case 'verify': return 'Olá, ' + email.split('@')[0];
      case 'password': return currentMode === 'signup' ? 'Definir Senha' : 'Digite sua senha';
      case 'biometric': return 'Autenticação';
      case 'success': return 'Sucesso';
      default: return 'Login';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Layer inside Auth Modal context for immersion */}
      <EtherealBackground />
      
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden relative"
      >
        {/* Top Gradient Line */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 opacity-80" />

        <button 
          onClick={onBackToLanding}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/50 transition-colors z-50"
        >
          <X className="size-5" />
        </button>

        {(step === 'password' || step === 'verify') && (
          <button 
            onClick={() => setStep(step === 'password' ? 'verify' : 'identify')}
            className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/50 transition-colors z-50"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        <div className="p-10">
          <div className="text-center mb-10">
            <div className="inline-block mb-6 scale-90">
              <Logo size="default" />
            </div>
            <motion.h2 
              key={step + '-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              {getTitle()}
            </motion.h2>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3 bg-red-50/50 border border-red-100 rounded-xl text-center text-red-600 text-sm font-medium flex items-center justify-center gap-2"
              >
                <ShieldCheck className="size-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {step === 'identify' && renderIdentify()}
                {step === 'details' && renderDetails()}
                {step === 'verify' && renderVerify()}
                {step === 'password' && renderPassword()}
                {step === 'biometric' && <BiometricScannerVisual onCancel={handleChoosePassword} remainingTime={biometricTimer} />}
                {step === 'success' && renderSuccess()}
              </motion.div>
            </AnimatePresence>
          </div>

          {(step !== 'success' && step !== 'biometric') && (
            <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-slate-300 mt-10">
              <ShieldCheck className="size-3" />
              <span>Secured by Tapago Shield™</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}