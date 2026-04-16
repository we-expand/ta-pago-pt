import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, signUp } from '../../utils/supabase';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function ModernAuth({ onSuccess, onBack }: { onSuccess: (session: any) => void; onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    userName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo mode - login automático
    if (mode === 'demo') {
      setLoading(true);
      try {
        // Criar conta demo automática
        const demoEmail = `demo_${Date.now()}@tapago.pt`;
        const demoPassword = 'demo123456';
        
        const result = await signUp(demoEmail, demoPassword, 'Empresa Demo', 'Usuário Demo');
        
        if (result.error) throw new Error(result.error);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword
        });

        if (error) throw error;
        if (data.session) {
          // Removed: toast.success('Bem-vindo ao modo DEMO!');
          onSuccess(data.session);
        }
      } catch (error: any) {
        toast.error('Erro ao criar conta demo');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Validação de senha para signup
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const result = await signUp(
          formData.email,
          formData.password,
          formData.companyName,
          formData.userName
        );

        if (result.error) throw new Error(result.error);

        // Auto login after signup
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        if (data.session) {
          toast.success('Conta criada com sucesso!');
          onSuccess(data.session);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        if (data.session) {
          // Removed: toast.success('Login realizado com sucesso!');
          
          // 🎯 ENVIAR EMAIL DE LOGIN AUTOMATICAMENTE
          try {
            await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/email/login-notification`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${data.session.access_token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          } catch (emailError) {
            console.error('Error sending login email:', emailError);
            // Não falhar o login se o email falhar
          }
          
          onSuccess(data.session);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 size-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 size-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-sm rounded-xl border border-white/60"
      >
        <ArrowLeft className="size-5" />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="relative rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-indigo-500/10 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>

          {/* Mode toggle */}
          <div className="relative mb-8">
            <div className="flex rounded-2xl bg-slate-100/80 p-1.5 gap-1">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Criar Conta
              </button>
              <button
                onClick={() => setMode('demo')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
                  mode === 'demo'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎯 Demo
              </button>
            </div>
          </div>

          {/* Demo mode info */}
          {mode === 'demo' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-indigo-900 text-sm mb-1">Modo Demonstração</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    Experimente todas as funcionalidades da plataforma sem compromisso.
                    Uma conta temporária será criada automaticamente.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          {mode !== 'demo' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <InputField
                      icon={<User className="size-5" />}
                      type="text"
                      placeholder="Nome Completo"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      required
                    />
                    <InputField
                      icon={<Building2 className="size-5" />}
                      type="text"
                      placeholder="Nome da Empresa"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputField
                icon={<Mail className="size-5" />}
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div className="relative">
                <InputField
                  icon={<Lock className="size-5" />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha (mín. 6 caracteres)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="relative">
                  <InputField
                    icon={<Lock className="size-5" />}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  mode === 'login' ? 'Entrar' : 'Criar Conta'
                )}
              </button>
            </form>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Criando conta demo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="size-5" />
                  <span>Iniciar Demonstração Gratuita</span>
                </div>
              )}
            </button>
          )}

          {/* Footer */}
          {mode === 'signup' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-center text-slate-500 mt-6"
            >
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="#" className="text-indigo-600 hover:underline">Termos</a>
              {' '}e{' '}
              <a href="#" className="text-indigo-600 hover:underline">Privacidade</a>
            </motion.p>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 size-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 size-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
}

function InputField({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
      />
    </div>
  );
}