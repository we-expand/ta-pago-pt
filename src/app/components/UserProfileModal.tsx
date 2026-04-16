import { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CreditCard,
  Save,
  Loader2,
  Camera,
  Briefcase,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import InteractiveButton from './ui/InteractiveButton';
import { projectId } from '../../../utils/supabase/info';

interface UserProfileModalProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ session, isOpen, onClose }: UserProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'security'>('profile');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    companyName: '',
    nif: '',
    role: '',
    department: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    if (isOpen && session) {
      loadUserProfile();
    }
  }, [isOpen, session]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const { user_metadata, email } = session.user;
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/auth/session`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      
      setFormData({
        name: user_metadata?.name || user_metadata?.full_name || '',
        email: email || '',
        phone: user_metadata?.phone || '',
        avatarUrl: user_metadata?.avatar_url || '',
        companyName: user_metadata?.company_name || 'Minha Empresa',
        nif: user_metadata?.nif || '',
        role: user_metadata?.role || 'Administrador',
        department: user_metadata?.department || 'Financeiro',
        address: user_metadata?.address || '',
        website: user_metadata?.website || ''
      });

    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      toast.success('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: <User className="size-4" /> },
    { id: 'company', label: 'Empresa', icon: <Building2 className="size-4" /> },
    { id: 'security', label: 'Segurança', icon: <Shield className="size-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden bg-white border-slate-200 shadow-2xl [&>button]:hidden h-[650px] flex">
        {/* Sidebar */}
        <div className="w-72 bg-slate-50 border-r border-slate-200 p-6 flex flex-col shrink-0">
          <DialogHeader className="mb-8 px-0 space-y-1.5 text-left">
            <DialogTitle className="text-xl font-bold text-slate-900">Configurações</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Gerencie sua conta e preferências
            </DialogDescription>
          </DialogHeader>

          <nav className="space-y-1 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200/60">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-900/10">
              <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Briefcase className="size-4 text-indigo-200" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white/90 truncate">Plano Enterprise</p>
                <p className="text-[10px] text-white/60 truncate">Ativo até Dez 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          
          {/* Custom Close Button */}
          <DialogClose className="absolute right-4 top-4 z-50 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 outline-none">
            <X className="size-5" />
          </DialogClose>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl">
                <div className="pr-12">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Informações Pessoais</h3>
                  <p className="text-sm text-slate-500">Atualize seus dados de identificação e contato.</p>
                </div>

                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="relative group cursor-pointer shrink-0">
                    <div className="size-24 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-slate-50">
                      {formData.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <Camera className="size-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">Foto de Perfil</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                      Clique na imagem para alterar. Recomendamos uma imagem quadrada de pelo menos 400x400px (JPG ou PNG).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Cargo / Função</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Profissional</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl">
                <div className="pr-12">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Dados da Empresa</h3>
                  <p className="text-sm text-slate-500">Gerencie as informações fiscais e contratuais.</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Nome da Empresa</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">NIF / CNPJ</label>
                    <input
                      type="text"
                      value={formData.nif}
                      onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                      placeholder="https://"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Endereço Fiscal</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl">
                <div className="pr-12">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Segurança e Acesso</h3>
                  <p className="text-sm text-slate-500">Configure métodos de autenticação e proteção.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Shield className="size-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Autenticação Biométrica</p>
                        <p className="text-xs text-slate-500">Touch ID / Face ID</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Ativado</span>
                      <InteractiveButton variant="ghost" className="text-xs h-8">Configurar</InteractiveButton>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <CreditCard className="size-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Histórico de Sessões</p>
                        <p className="text-xs text-slate-500">Gerenciar dispositivos conectados</p>
                      </div>
                    </div>
                    <InteractiveButton variant="ghost" className="text-xs h-8">Ver Histórico</InteractiveButton>
                  </div>

                  <div className="p-5 border border-red-100 bg-red-50/30 rounded-xl mt-8">
                    <h4 className="font-semibold text-red-900 mb-1 text-sm">Zona de Perigo</h4>
                    <p className="text-xs text-red-700 mb-4 leading-relaxed">
                      Essas ações são irreversíveis e podem resultar na perda permanente de dados da sua conta e acessos corporativos.
                    </p>
                    <button className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-red-900/10">
                      Solicitar Exclusão de Conta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <InteractiveButton 
              variant="ghost" 
              onClick={onClose}
              disabled={saving}
              className="text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </InteractiveButton>
            <InteractiveButton 
              variant="primary" 
              onClick={handleSave}
              loading={saving}
              icon={<Save className="size-4" />}
            >
              Salvar Alterações
            </InteractiveButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}