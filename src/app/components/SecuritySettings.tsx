import { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Key, Plus, Trash2, CheckCircle2, AlertCircle, Fingerprint, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { startRegistration } from '@simplewebauthn/browser';
import { motion } from 'motion/react';
import { projectId } from '../../../utils/supabase/info';

export default function SecuritySettings({ session }: { session: any }) {
  const [passkeys, setPasskeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistration] = useState(false);

  useEffect(() => {
    // Simular carregamento de passkeys existentes
    const savedKeys = localStorage.getItem('tapago_passkeys');
    if (savedKeys) {
      setPasskeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleAddPasskey = async () => {
    setRegistration(true);
    
    try {
      console.log('[BIOMETRIC] Starting registration...');
      console.log('[BIOMETRIC] Session token:', session.access_token ? 'Present' : 'Missing');
      
      // 1. Obter opções do backend real
      const resp = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/register/options`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      console.log('[BIOMETRIC] Options response status:', resp.status);
      
      if (!resp.ok) {
        const err = await resp.json();
        console.error('[BIOMETRIC] Options error:', err);
        throw new Error(err.error || 'Falha ao iniciar registro');
      }
      
      const options = await resp.json();
      console.log('[BIOMETRIC] Options received:', options);
      
      // 2. Iniciar registro no navegador
      // Isso pedirá TouchID/FaceID ao usuário
      console.log('[BIOMETRIC] Starting browser registration...');
      const attResp = await startRegistration(options);
      console.log('[BIOMETRIC] Browser registration complete');
        
      // 3. Verificar e salvar no backend
      const verifyResp = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/register/verify`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(attResp)
      });

      console.log('[BIOMETRIC] Verify response status:', verifyResp.status);

      if (!verifyResp.ok) {
        const err = await verifyResp.json();
        console.error('[BIOMETRIC] Verify error:', err);
        throw new Error('Falha na validação da chave.');
      }

      const verification = await verifyResp.json();
      console.log('[BIOMETRIC] Verification result:', verification);

      if (verification.verified) {
        // Sucesso! Atualizar UI
        const newPasskey = {
          id: attResp.id, // Use the credential ID as ID
          name: `Chave de Acesso (${getDeviceName()})`,
          created: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        };
        
        const updatedKeys = [...passkeys, newPasskey];
        setPasskeys(updatedKeys);
        localStorage.setItem('tapago_passkeys', JSON.stringify(updatedKeys));
        
        toast.success('Biometria configurada com sucesso! 🔐');
      }
    } catch (error: any) {
      console.error('[BIOMETRIC] Full error:', error);
      console.error('[BIOMETRIC] Error name:', error.name);
      console.error('[BIOMETRIC] Error message:', error.message);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Registro cancelado pelo usuário.');
      } else if (error.name === 'NotSupportedError') {
        toast.error('Seu dispositivo não suporta biometria. Verifique se você tem TouchID, FaceID ou Windows Hello configurado.');
      } else if (error.name === 'InvalidStateError') {
        toast.error('Esta chave biométrica já está registrada.');
      } else {
        toast.error(error.message || 'Erro ao configurar biometria. Verifique o console para mais detalhes.');
      }
    } finally {
      setRegistration(false);
    }
  };

  const handleDeletePasskey = (id: string) => {
    const updatedKeys = passkeys.filter(k => k.id !== id);
    setPasskeys(updatedKeys);
    localStorage.setItem('tapago_passkeys', JSON.stringify(updatedKeys));
    toast.success('Chave removida.');
  };

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('Macintosh')) return 'MacBook';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('Windows')) return 'Windows PC';
    return 'Dispositivo';
  };

  const handleHardReset = async () => {
    if (!confirm('Tem certeza? Isso apagará todas as chaves biométricas deste dispositivo e do servidor. Você precisará cadastrá-las novamente.')) {
      return;
    }

    try {
      // 1. Reset Local Storage
      localStorage.removeItem('biometrics_decision');
      localStorage.removeItem('tapago_passkeys');
      setPasskeys([]);

      // 2. Call backend to clear registered credentials
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/webauthn/reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (!res.ok) {
        throw new Error('Falha ao limpar dados no servidor');
      }

      toast.success('Sistema biométrico completamente resetado. Você pode configurar novamente agora.');
      
      // Opcional: recarregar a página para garantir estado limpo
      setTimeout(() => window.location.reload(), 1500);

    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao resetar: ' + error.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="size-8 text-indigo-600" />
          Segurança e Login
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Gerencie suas chaves de acesso e métodos de autenticação.
        </p>
      </div>

      {/* Biometria Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Fingerprint className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Biometria (WebAuthn)</h2>
              <p className="text-slate-500 text-sm">Login sem senha usando FaceID, TouchID ou Windows Hello.</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Recomendado
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm">
              A tecnologia <strong>WebAuthn</strong> permite que você use a biometria do seu dispositivo para fazer login com segurança máxima, sem precisar digitar senhas.
            </p>
          </div>

          {passkeys.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Chaves Ativas</h3>
              {passkeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Smartphone className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{key.name}</p>
                      <p className="text-xs text-slate-500">Adicionado em {new Date(key.created).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePasskey(key.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover chave"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Key className="size-12 mx-auto mb-3 text-slate-300" />
              <p>Nenhuma chave de segurança configurada ainda.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              onClick={handleAddPasskey}
              disabled={registering}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-200"
            >
              {registering ? (
                <>
                  <RefreshCw className="size-5 animate-spin" />
                  Aguardando Biometria...
                </>
              ) : (
                <>
                  <Plus className="size-5" />
                  Adicionar Nova Chave
                </>
              )}
            </button>

            <button
              onClick={handleHardReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-red-50 text-red-600 font-bold rounded-xl border border-slate-200 hover:border-red-200 transition-all"
            >
              <Trash2 className="size-5" />
              Resetar Tudo (Forçar Reconfiguração)
            </button>
          </div>
        </div>
      </div>

      {/* Outras Configurações de Segurança */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 opacity-75 grayscale-[0.5] pointer-events-none">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Senha e Autenticação</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Alterar Senha</p>
              <p className="text-sm text-slate-500">Última alteração há 3 meses</p>
            </div>
            <button className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-300 rounded-lg">
              Alterar
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Autenticação em Dois Fatores (2FA)</p>
              <p className="text-sm text-slate-500">Proteção adicional via SMS ou App</p>
            </div>
            <button className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-300 rounded-lg">
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}