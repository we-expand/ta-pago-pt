import { Settings as SettingsIcon, Bell, Lock, CreditCard, Mail, RotateCcw, User } from 'lucide-react';
import { useState } from 'react';
import EmailSettings from './EmailSettings';
import SecuritySettings from './SecuritySettings';
import ProfileSettings from './ProfileSettings';
import { toast } from 'sonner';

export default function Settings({ session }: { session: any }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleResetOnboarding = () => {
    localStorage.removeItem('tapago_onboarding_complete');
    toast.success('Onboarding resetado! Faça logout e login novamente para ver.');
  };

  if (activeSection === 'profile') {
    return (
      <div>
        <button
          onClick={() => setActiveSection(null)}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          ← Voltar
        </button>
        <ProfileSettings session={session} />
      </div>
    );
  }

  if (activeSection === 'email') {
    return (
      <div>
        <button
          onClick={() => setActiveSection(null)}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          ← Voltar
        </button>
        <EmailSettings session={session} />
      </div>
    );
  }

  if (activeSection === 'security') {
    return (
      <div>
        <button
          onClick={() => setActiveSection(null)}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          ← Voltar
        </button>
        <SecuritySettings session={session} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-600 mt-1">Personalize sua plataforma</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SettingCard
          icon={<User className="size-6" />}
          title="Perfil do Usuário"
          description="Edite seu nome e visualize informações da conta"
          onClick={() => setActiveSection('profile')}
        />
        <SettingCard
          icon={<Mail className="size-6" />}
          title="Sistema de Email"
          description="Configure integração Resend API e templates"
          onClick={() => setActiveSection('email')}
        />
        <SettingCard
          icon={<Bell className="size-6" />}
          title="Notificações"
          description="Configure alertas e notificações"
        />
        <SettingCard
          icon={<Lock className="size-6" />}
          title="Segurança"
          description="Gerencie sua senha e autenticação"
          onClick={() => setActiveSection('security')}
        />
        <SettingCard
          icon={<CreditCard className="size-6" />}
          title="Plano & Pagamento"
          description="Atualize seu plano e método de pagamento"
        />
        <SettingCard
          icon={<SettingsIcon className="size-6" />}
          title="Estratégias de Cobrança"
          description="Configure dias e canais por score"
        />
        <SettingCard
          icon={<RotateCcw className="size-6" />}
          title="Resetar Onboarding"
          description="Ver tutorial de configuração novamente"
          onClick={handleResetOnboarding}
          variant="secondary"
        />
      </div>
    </div>
  );
}

function SettingCard({ icon, title, description, onClick, variant = 'default' }: any) {
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border p-6 transition-all cursor-pointer ${
        variant === 'secondary'
          ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:shadow-md'
          : 'bg-white border-slate-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`size-12 rounded-xl flex items-center justify-center ${
          variant === 'secondary'
            ? 'bg-indigo-600 text-white'
            : 'bg-indigo-50 text-indigo-600'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}