import { useEffect, useState } from 'react';
import { supabase, projectId, publicAnonKey } from '../utils/supabase';
import { initMonitoring } from '../lib/monitoring';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPageNew from './components/LandingPageNew';
import CinematicAuth from './components/CinematicAuth';
import InteractiveOnboarding from './components/InteractiveOnboarding';
import Dashboard from './components/Dashboard';
import InteractiveDashboard from './components/InteractiveDashboard'; 
import EnhancedDashboard from './components/EnhancedDashboard';
import DebtorsListNew from './components/DebtorsListNew';
import DebtorsManagement from './components/DebtorsManagement';
import Timeline from './components/Timeline';
import CampaignManager from './components/CampaignManager';
import Settings from './components/Settings';
import IntegrationHub from './components/IntegrationHub';
import PaymentAgreements from './components/PaymentAgreements';
import AdminPanel from './components/AdminPanel';
import AIManagement from './components/AIManagement';
import DevLab from './components/DevLab';
import ChannelOrchestration from './components/ChannelOrchestration';
import MVPStatusViewer from './components/MVPStatusViewer';
import StrategyDashboard from './components/system/StrategyDashboardNew';
import StartupCostsBreakdown from './components/system/StartupCostsBreakdown';
import StartupCostsMinimal from './components/system/StartupCostsMinimal';
import LogoShowcase from './components/LogoShowcase';
import GoogleCloudSetupWizard from './components/GoogleCloudSetupWizard';
import GoogleTTSSetup from './components/GoogleTTSSetup';
import { Logo } from './components/Logo';
import { EtherealBackground } from './components/ui/EtherealBackground';
import { BiometricScanScreen } from './components/BiometricScanScreen';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Settings as SettingsIcon, 
  Link2, 
  ShieldCheck, 
  LogOut, 
  Brain, 
  Target,
  Fingerprint,
  Terminal,
  Bell,
  Search,
  Menu,
  FileText,
  TrendingUp,
  User,
  Building2,
  LifeBuoy,
  ChevronRight,
  Command,
  Sparkles
} from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import UserProfileModal from './components/UserProfileModal';
import FeatureTour from './components/FeatureTour';

// Initialize Monitoring
initMonitoring();

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'signup' | 'login' | null>(
    typeof window !== 'undefined' && window.location.pathname.startsWith('/connect/') ? 'login' : null
  );
  const [showLogoGallery, setShowLogoGallery] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBiometricsModal, setShowBiometricsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBiometricScan, setShowBiometricScan] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'scanning' | 'success' | 'error' | 'idle'>('idle');
  const [showGoogleTTSSetup, setShowGoogleTTSSetup] = useState(false);

  // Debug: Log state changes
  // Debug: Log state changes
  useEffect(() => {
    console.log('[STATE] showBiometricsModal:', showBiometricsModal);
  }, [showBiometricsModal]);

  useEffect(() => {
    console.log('[STATE] showOnboarding:', showOnboarding);
  }, [showOnboarding]);

  useEffect(() => {
    console.log('[STATE] session:', session ? 'Exists' : 'None');
  }, [session]);

  // Log Google TTS info on mount
  useEffect(() => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║           🎙️ GOOGLE CLOUD TEXT-TO-SPEECH ATIVADO          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('✅ Sistema configurado para usar Google Cloud TTS');
    console.log('🇵🇹 Vozes Neural em Português de Portugal');
    console.log('💰 Gratuito: 1 milhão de caracteres/mês');
    console.log('');
    console.log('📋 Para configurar:');
    console.log('   OPÇÃO 1 (RECOMENDADO): Aceda diretamente ao assistente de configuração');
    console.log('   👉 URL: /setup/google-tts');
    console.log('');
    console.log('   OPÇÃO 2: Via dashboard');
    console.log('   1. Vá em: Campanhas Multicanal → Aba "Voz IA"');
    console.log('   2. Clique em "Configurar Agora"');
    console.log('   3. Siga as instruções para obter a API Key');
    console.log('');
    console.log('📖 Documentação completa: /GOOGLE_TTS_SETUP.md');
    console.log('📖 Guia passo a passo: /CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md');
    console.log('');
    console.log('══════════════════════════════════════════════════════════════');
    console.log('');
  }, []);

  // Atalho de teclado para abrir Google TTS Setup (Ctrl+Shift+G ou Cmd+Shift+G)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        console.log('🎹 [KEYBOARD SHORTCUT] Abrindo Google TTS Setup...');
        setShowGoogleTTSSetup(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Debug pathname
  useEffect(() => {
    console.log('[ROUTE DEBUG] Current pathname:', window.location.pathname);
    if (window.location.pathname === '/setup/google-tts') {
      console.log('[ROUTE DEBUG] ✅ Matched /setup/google-tts route!');
    }
  }, []);

  // Check for external connection return (OAuth callbacks or QR codes)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/connect/')) {
       // Allow the user to see the dashboard/integration hub immediately if they have a session
       // If not, we might want to show a specific login for connection.
       // For now, we'll let the standard auth flow happen, but if we are logged in, we switch view.
       if (session) {
          setActiveView('integrations');
          const integrationId = path.split('/')[2];
          if (integrationId) {
            toast.success(`Conexão externa iniciada para: ${integrationId}`);
            // Here we could trigger the actual connection logic if we had the state passed
          }
       }
    }
  }, [session]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (session) {
      console.log('[BIOMETRIC MODAL] Session detected, checking decision...');
      const userId = session.user?.id;
      const hasDecision = localStorage.getItem(`biometrics_decision_${userId}`);
      console.log('[BIOMETRIC MODAL] Current decision:', hasDecision);
      console.log('[BIOMETRIC MODAL] User ID:', userId);
      
      // TEMPORARIAMENTE DESABILITADO - Investigando erro removeChild
      // Apenas mostrar modal se usuário ainda NÃO decidiu (nem accepted, nem rejected)
      if (false && !hasDecision) { // Adicionado 'false &&' para desabilitar
        console.log('[BIOMETRIC MODAL] No decision found, showing modal in 2s...');
        timer = setTimeout(() => {
          console.log('[BIOMETRIC MODAL] Setting showBiometricsModal to TRUE');
          setShowBiometricsModal(true);
        }, 2000); // Aguarda 2s após login para mostrar modal
      } else {
        console.log('[BIOMETRIC MODAL] Decision already exists, NOT showing modal');
      }
    } else {
      console.log('[BIOMETRIC MODAL] No session, NOT showing modal');
      // Reset modal state when no session
      setShowBiometricsModal(false);
      setShowBiometricScan(false);
    }
    
    return () => {
      if (timer) {
        console.log('[BIOMETRIC MODAL] Cleaning up timer');
        clearTimeout(timer);
      }
    };
  }, [session]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          setSession(data.session);
        }
      } catch (err) {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
      if (currentSession) {
        setAuthMode(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBiometricsDecision = async (accepted: boolean) => {
    if (!accepted) {
      localStorage.setItem(`biometrics_decision_${session.user?.id}`, 'rejected');
      setShowBiometricsModal(false);
      // Removed: toast.info('Você pode ativar a biometria depois nas configurações.');
      return;
    }

    // Fechar modal de pergunta e abrir tela de scan
    setShowBiometricsModal(false);
    setShowBiometricScan(true);
    setBiometricStatus('scanning');
    
    try {
      console.log('[BIOMETRIC REGISTER] Starting registration...');
      console.log('[BIOMETRIC REGISTER] User:', session?.user?.email);
      console.log('[BIOMETRIC REGISTER] User ID:', session?.user?.id);
      console.log('[BIOMETRIC REGISTER] Access Token:', session?.access_token ? 'Present' : 'MISSING');
      console.log('[BIOMETRIC REGISTER] Access Token (first 50 chars):', session?.access_token?.substring(0, 50));
      console.log('[BIOMETRIC REGISTER] Access Token LENGTH:', session?.access_token?.length);
      console.log('[BIOMETRIC REGISTER] Full session object:', session);
      
      if (!session?.access_token) {
        throw new Error('Sessão inválida: token de acesso não encontrado');
      }
      
      // Obter opções do servidor
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      };
      
      console.log('[BIOMETRIC REGISTER] Request headers:', headers);
      console.log('[BIOMETRIC REGISTER] Authorization header length:', headers.Authorization?.length);
      
      const optionsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/register/options`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          email: session?.user?.email,
          userId: session?.user?.id
        })
      });
      
      console.log('[BIOMETRIC REGISTER] Options response status:', optionsRes.status);
      console.log('[BIOMETRIC REGISTER] Options response headers:', optionsRes.headers);
      
      if (!optionsRes.ok) {
        const errorData = await optionsRes.json();
        console.error('[BIOMETRIC REGISTER] Error response:', errorData);
        console.error('[BIOMETRIC REGISTER] Error details:', JSON.stringify(errorData, null, 2));
        throw new Error(errorData.message || errorData.error || 'Falha ao obter opções');
      }
      
      const options = await optionsRes.json();
      console.log('[BIOMETRIC REGISTER] Options received, starting device registration...');
      
      // 🔐 AQUI APARECE O PROMPT NATIVO DE BIOMETRIA!
      const credential = await startRegistration(options);
      console.log('[BIOMETRIC REGISTER] Device registration completed!');

      // Verificar no servidor
      const verifyRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/register/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          userId: session?.user?.id,
          credential
        })
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        console.error('[BIOMETRIC REGISTER] Verify error:', errData);
        throw new Error(errData.error || 'Falha na verificação');
      }

      const verification = await verifyRes.json();
      console.log('[BIOMETRIC REGISTER] Verification response:', verification);

      if (verification.success) {
        localStorage.setItem(`biometrics_decision_${session.user?.id}`, 'accepted');
        setBiometricStatus('success');
        toast.success('Biometria configurada com sucesso!');
        console.log('[BIOMETRIC REGISTER] ✅ Registration successful!');
        // Tela vai fechar automaticamente após 2s
      } else {
        throw new Error('Falha na verificação biométrica');
      }
    } catch (error: any) {
      console.error('[BIOMETRIC REGISTER] Error:', error);
      
      let errorMessage = 'Não foi possível ativar a biometria.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Você cancelou a configuração biométrica.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Seu dispositivo não suporta biometria.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      localStorage.setItem(`biometrics_decision_${session.user?.id}`, 'rejected');
      setBiometricStatus('error');
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAuthMode(null);
    setActiveView('dashboard');
    localStorage.removeItem(`biometrics_decision_${session.user?.id}`);
    // Removed: toast.success('Até logo!');
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (showLogoGallery) return <LogoShowcase onBack={() => setShowLogoGallery(false)} />;

  // Rota especial para configuração do Google Cloud TTS
  if (typeof window !== 'undefined' && window.location.pathname === '/setup/google-tts') {
    return (
      <div className="app-container">
        <GoogleTTSSetup 
          onComplete={() => {
            toast.success('✅ Google Cloud TTS configurado com sucesso!');
            window.location.href = '/';
          }}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (!session && !authMode) {
    return (
      <div className="app-container">
        <LandingPageNew 
          onGetStarted={() => setAuthMode('signup')} 
          onLogin={() => setAuthMode('login')}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (!session && authMode) {
    return (
      <div className="app-container">
        <CinematicAuth 
          mode={authMode}
          onSuccess={async (mockSession?: any) => {
            if (mockSession) {
              setSession(mockSession);
              setAuthMode(null);
            }
            // Removed: toast.success('Bem-vindo ao Tapago.');
            if (!mockSession) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }}
          onBackToLanding={() => setAuthMode(null)}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (session && showOnboarding) {
    return <InteractiveOnboarding session={session} onComplete={() => setShowOnboarding(false)} />;
  }

  // --- REFINED DASHBOARD LAYOUT (BBDO Style) ---
  if (session) {
    return (
      <div className="app-container">
        <DashboardLayout 
          activeView={activeView} 
          setActiveView={setActiveView} 
          session={session} 
          onLogout={handleSignOut}
          onOpenProfile={() => setShowProfileModal(true)}
        >
           {activeView === 'dashboard' && <Dashboard session={session} />}
           {activeView === 'debtors' && <DebtorsManagement session={session} />}
           {activeView === 'ai' && <AIManagement session={session} />}
           {activeView === 'timeline' && <CampaignManager />}
           {activeView === 'agreements' && <PaymentAgreements session={session} />}
           {activeView === 'integrations' && <IntegrationHub session={session} />}
           {activeView === 'settings' && <Settings session={session} />}
           {activeView === 'admin' && <AdminPanel session={session} />}
           {activeView === 'innovation' && <DevLab onClose={() => setActiveView('dashboard')} />}
           {activeView === 'channels' && <ChannelOrchestration session={session} />}
           {activeView === 'strategy' && <StrategyDashboard />}
           {activeView === 'mvp_status' && <MVPStatusViewer />}
           {activeView === 'startup_costs' && <StartupCostsMinimal />}
        </DashboardLayout>

        <Toaster position="top-right" />
        
        <UserProfileModal 
          session={session} 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
        />
        
        <FeatureTour />

        <Dialog open={showBiometricsModal} onOpenChange={setShowBiometricsModal}>
          <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border-white/50 shadow-2xl rounded-3xl p-8">
            <DialogHeader className="items-center text-center">
              <div className="size-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <Fingerprint className="size-8 text-indigo-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">Login com Biometria</DialogTitle>
              <DialogDescription className="text-slate-500">
                Use sua digital ou Face ID para fazer login de forma rápida e segura.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
              <Button variant="outline" onClick={() => handleBiometricsDecision(false)} className="rounded-xl border-slate-200 h-12">
                Talvez depois
              </Button>
              <Button onClick={() => handleBiometricsDecision(true)} className="rounded-xl bg-slate-900 text-white h-12 shadow-lg hover:bg-slate-800">
                🔐 Ativar Biometria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BiometricScanScreen 
          isOpen={showBiometricScan}
          onComplete={(success) => {
            setShowBiometricScan(false);
            setBiometricStatus('idle');
            if (success) {
              toast.success('✅ Biometria cadastrada com sucesso!');
            }
          }}
          status={biometricStatus}
        />

        {/* Google TTS Setup Dialog */}
        <Dialog open={showGoogleTTSSetup} onOpenChange={setShowGoogleTTSSetup}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-slate-200 shadow-2xl rounded-2xl">
            <GoogleTTSSetup 
              onComplete={() => {
                setShowGoogleTTSSetup(false);
                toast.success('✅ Google Cloud TTS configurado com sucesso!');
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Botão flutuante para abrir Google TTS Setup */}
        <button
          onClick={() => setShowGoogleTTSSetup(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300 group"
          title="Configurar Google Cloud TTS (Ctrl/Cmd + Shift + G)"
        >
          <Sparkles className="size-6 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">Configurar Voz IA</span>
            <span className="text-xs opacity-90">Google Cloud TTS</span>
          </div>
        </button>
      </div>
    );
  }

  return null;
}