import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Building2, 
  Bell, 
  Globe, 
  Loader2,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { Button } from '../ui/button';
import { projectId } from '../../../utils/supabase';  // Fixed: 3 levels up, not 2
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

export default function AdminSettings({ session }: { session: any }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    nif: '',
    address: '',
    settings: {
      channels: {
        whatsapp: { enabled: true },
        sms: { enabled: true },
        email: { enabled: true }
      },
      strategies: {
        autoNegotiation: true,
        aggressiveFollowup: false
      }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, [session]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/admin/settings`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Merge with defaults
        setFormData({
           companyName: data.company?.name || '',
           nif: data.company?.nif || '',
           address: data.company?.address || '',
           settings: {
             channels: {
               whatsapp: { enabled: true, ...data.settings?.channels?.whatsapp },
               sms: { enabled: true, ...data.settings?.channels?.sms },
               email: { enabled: true, ...data.settings?.channels?.email }
             },
             strategies: {
               autoNegotiation: true, ...data.settings?.strategies
             }
           }
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/admin/settings`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  const toggleChannel = (channel: 'whatsapp' | 'sms' | 'email') => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        channels: {
          ...prev.settings.channels,
          [channel]: {
            ...prev.settings.channels[channel],
            enabled: !prev.settings.channels[channel].enabled
          }
        }
      }
    }));
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="size-6 text-indigo-600" />
            Configurações Globais
          </h2>
          <p className="text-slate-500 mt-1">Preferências da empresa e do sistema.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
           {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
           Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Dados da Empresa */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="size-5 text-slate-400" />
              Dados da Empresa
           </h3>
           
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
                 <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">NIF / CNPJ</label>
                 <input 
                    type="text" 
                    value={formData.nif}
                    onChange={e => setFormData({...formData, nif: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                 <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                 />
              </div>
           </div>
        </div>

        {/* Canais e Notificações */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="size-5 text-slate-400" />
              Canais de Comunicação Ativos
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                       <MessageSquare className="size-5" />
                    </div>
                    <div>
                       <div className="font-semibold text-slate-900">WhatsApp Business</div>
                       <div className="text-xs text-slate-500">Envio de mensagens automáticas</div>
                    </div>
                 </div>
                 <Switch 
                    checked={formData.settings.channels.whatsapp.enabled}
                    onCheckedChange={() => toggleChannel('whatsapp')}
                 />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                       <Mail className="size-5" />
                    </div>
                    <div>
                       <div className="font-semibold text-slate-900">Email Transacional</div>
                       <div className="text-xs text-slate-500">Notificações e cobranças</div>
                    </div>
                 </div>
                 <Switch 
                    checked={formData.settings.channels.email.enabled}
                    onCheckedChange={() => toggleChannel('email')}
                 />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                       <Smartphone className="size-5" />
                    </div>
                    <div>
                       <div className="font-semibold text-slate-900">SMS Gateway</div>
                       <div className="text-xs text-slate-500">Alertas rápidos</div>
                    </div>
                 </div>
                 <Switch 
                    checked={formData.settings.channels.sms.enabled}
                    onCheckedChange={() => toggleChannel('sms')}
                 />
              </div>
           </div>
           
           <div className="mt-6 pt-6 border-t border-slate-100">
               <h3 className="text-sm font-bold text-slate-900 mb-3">Preferências de IA</h3>
               <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="autoNeg"
                    checked={formData.settings.strategies.autoNegotiation}
                    onChange={(e) => setFormData({
                        ...formData,
                        settings: {
                            ...formData.settings,
                            strategies: {
                                ...formData.settings.strategies,
                                autoNegotiation: e.target.checked
                            }
                        }
                    })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="autoNeg" className="text-sm text-slate-600">Permitir negociação autônoma (até 20% desconto)</label>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}