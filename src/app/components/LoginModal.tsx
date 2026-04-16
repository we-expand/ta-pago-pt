import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Fingerprint, Shield, Loader2, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../../utils/supabase';  // Fixed: removed one '../'
import { signIn } from '../../utils/auth';  // Fixed: removed one '../'
import Logo from './Logo';

interface LoginModalProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ onSuccess, onBackToLanding, onSwitchToSignup }: LoginModalProps) {
  const [authMethod, setAuthMethod] = useState<'password' | 'biometric' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  // Check if biometric is available
  useEffect(() => {
    const checkBiometric = async () => {
      if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricAvailable(available);
      }
    };
    checkBiometric();
  }, []);

  // Validate email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handlePasswordLogin = async () => {
    if (!emailValid || password.length < 6) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await signIn(email, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!emailValid) {
      setError('Informe o email primeiro');
      return;
    }

    setBiometricLoading(true);
    setError('');

    try {
      console.log('[BIOMETRIC LOGIN] Starting for email:', email);
      
      // 1. Obter opções do servidor
      const optionsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/login/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!optionsRes.ok) {
        const errData = await optionsRes.json();
        console.error('[BIOMETRIC LOGIN] Options error:', errData);
        throw new Error(errData.error || 'Nenhuma credencial biométrica encontrada para este email');
      }

      const optionsData = await optionsRes.json();
      console.log('[BIOMETRIC LOGIN] Options received:', optionsData);

      // 2. Chamar autenticador do navegador (FaceID/TouchID)
      console.log('[BIOMETRIC LOGIN] Calling browser authenticator...');
      const credential = await startAuthentication(optionsData);
      console.log('[BIOMETRIC LOGIN] Browser authentication successful!');

      // 3. Verificar resposta no servidor
      const verifyRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credential })
      });

      if (!verifyRes.ok) {
        const errVerify = await verifyRes.json();
        console.error('[BIOMETRIC LOGIN] Verify error:', errVerify);
        throw new Error(errVerify.error || 'Falha na verificação biométrica');
      }

      const verifyData = await verifyRes.json();
      console.log('[BIOMETRIC LOGIN] Verify response:', verifyData);

      if (verifyData.success && verifyData.session) {
        // 4. Configurar sessão no Supabase client
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: verifyData.session.access_token,
          refresh_token: verifyData.session.refresh_token
        });

        if (sessionError || !session) {
          console.error('[BIOMETRIC LOGIN] Session error:', sessionError);
          throw new Error('Falha ao configurar sessão');
        }

        console.log('[BIOMETRIC LOGIN] ✅ Login successful!');
        onSuccess();
      } else {
        throw new Error('Falha na verificação.');
      }

    } catch (err: any) {
      console.error('[BIOMETRIC LOGIN] Error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Autenticação cancelada.');
      } else {
        setError(err.message || 'Erro na autenticação biométrica.');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && authMethod === 'password') {
      handlePasswordLogin();
    }
  };

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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative"
      >
        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-10 relative overflow-hidden">
          
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Logo size="large" />
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-slate-600">
                Entre na sua conta TaPago
              </p>
            </motion.div>

            {/* Email Input (sempre visível) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 pl-11 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                {emailValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Check className="size-5 text-green-600" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Auth Method Selection or Login Forms */}
            <AnimatePresence mode="wait">
              {!authMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-medium text-slate-700 text-center mb-4">
                    Como deseja entrar?
                  </p>

                  {/* Password Option */}
                  <motion.button
                    onClick={() => setAuthMethod('password')}
                    disabled={!emailValid}
                    className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: emailValid ? 1.02 : 1 }}
                    whileTap={{ scale: emailValid ? 0.98 : 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Lock className="size-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Entrar com Senha</div>
                        <div className="text-xs text-indigo-100">Tradicional e seguro</div>
                      </div>
                    </div>
                    <ArrowRight className="size-5" />
                  </motion.button>

                  {/* Biometric Option */}
                  {biometricAvailable && (
                    <motion.button
                      onClick={() => setAuthMethod('biometric')}
                      disabled={!emailValid}
                      className="w-full p-4 bg-white border-2 border-indigo-200 text-slate-900 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: emailValid ? 1.02 : 1 }}
                      whileTap={{ scale: emailValid ? 0.98 : 1 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Fingerprint className="size-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">Autenticação Digital</div>
                          <div className="text-xs text-slate-600">Biometria ou Face ID</div>
                        </div>
                      </div>
                      <ArrowRight className="size-5" />
                    </motion.button>
                  )}

                  {!emailValid && (
                    <p className="text-xs text-center text-slate-500 mt-2">
                      Informe um email válido para continuar
                    </p>
                  )}
                </motion.div>
              )}

              {/* Password Login Form */}
              {authMethod === 'password' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Sua senha"
                        className="w-full px-4 py-3 pl-11 pr-11 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                        autoFocus
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2">
                      Esqueceu a senha?
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Login Button */}
                  <motion.button
                    onClick={handlePasswordLogin}
                    disabled={loading || !emailValid || password.length < 6}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: (!loading && emailValid && password.length >= 6) ? 1.02 : 1 }}
                    whileTap={{ scale: (!loading && emailValid && password.length >= 6) ? 0.98 : 1 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="size-5" />
                      </>
                    )}
                  </motion.button>

                  {/* Back to Method Selection */}
                  <button
                    onClick={() => setAuthMethod(null)}
                    className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
                  >
                    ← Escolher outro método
                  </button>
                </motion.div>
              )}

              {/* Biometric Login */}
              {authMethod === 'biometric' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Biometric Animation */}
                  <div className="py-8 flex flex-col items-center">
                    <motion.div
                      className="size-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6"
                      animate={{
                        scale: biometricLoading ? [1, 1.1, 1] : 1,
                        boxShadow: biometricLoading 
                          ? [
                              '0 0 0 0 rgba(99, 102, 241, 0.4)',
                              '0 0 0 20px rgba(99, 102, 241, 0)',
                              '0 0 0 0 rgba(99, 102, 241, 0)'
                            ]
                          : '0 0 0 0 rgba(99, 102, 241, 0)'
                      }}
                      transition={{ duration: 1.5, repeat: biometricLoading ? Infinity : 0 }}
                    >
                      <Fingerprint className="size-12 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Autenticação Digital
                    </h3>
                    <p className="text-sm text-slate-600 text-center max-w-sm">
                      Use sua impressão digital ou Face ID para entrar de forma rápida e segura
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Authenticate Button */}
                  <motion.button
                    onClick={handleBiometricLogin}
                    disabled={biometricLoading || !emailValid}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: (!biometricLoading && emailValid) ? 1.02 : 1 }}
                    whileTap={{ scale: (!biometricLoading && emailValid) ? 0.98 : 1 }}
                  >
                    {biometricLoading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Autenticando...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="size-5" />
                        Autenticar
                      </>
                    )}
                  </motion.button>

                  {/* Back to Method Selection */}
                  <button
                    onClick={() => setAuthMethod(null)}
                    className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
                  >
                    ← Escolher outro método
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-slate-500">ou</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-sm text-slate-600">
                Ainda não tem conta?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Criar conta grátis
                </button>
              </p>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"
            >
              <Shield className="size-4 text-green-600" />
              <span>Conexão segura e criptografada</span>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 size-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 size-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Sparkles Decoration */}
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="size-8 text-indigo-400" />
        </motion.div>
        <motion.div
          className="absolute -bottom-4 -left-4"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="size-6 text-purple-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}