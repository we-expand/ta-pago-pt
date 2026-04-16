import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  Star,
  Shield,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { projectId } from '../../../utils/supabase';  // Fixed: 3 levels up, not 2
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    features: ['Até 500 devedores', '1 usuário', 'Email automatizado', 'Dashboard Básico'],
    color: 'bg-slate-100 border-slate-200'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 149,
    features: ['Até 2.500 devedores', '5 usuários', 'Email + SMS + WhatsApp', 'IA de Negociação', 'API Completa'],
    popular: true,
    color: 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    features: ['Devedores ilimitados', 'Usuários ilimitados', 'Gerente de Conta', 'SLA Garantido', 'Customização White-label'],
    color: 'bg-slate-900 text-white border-slate-800'
  }
];

export default function AdminPlans({ session }: { session: any }) {
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [session]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/admin/subscription`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentSub(data.subscription);
      }
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (planId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/admin/subscription`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ planId, interval: 'monthly' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentSub(data.subscription);
        toast.success(`Plano atualizado para ${PLANS.find(p => p.id === planId)?.name}!`);
      } else {
        toast.error('Erro ao atualizar plano');
      }
    } catch (error) {
      toast.error('Erro de conexão');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="size-6 text-indigo-600" />
          Planos e Assinaturas
        </h2>
        <p className="text-slate-500 mt-1">Gerencie seu plano atual e informações de faturamento.</p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-500/20 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
                Plano Atual
              </span>
              <span className="text-slate-400 text-sm">Renova em {new Date(currentSub?.nextBilling).toLocaleDateString()}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {PLANS.find(p => p.id === currentSub?.planId)?.name || 'Custom'}
            </h3>
            <p className="text-indigo-200 flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Sua assinatura está ativa e operando normalmente.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
             <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Método de Pagamento</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="bg-white/10 p-1 rounded">
                      <CreditCard className="size-4 text-white" />
                   </div>
                   <span className="font-mono text-sm">•••• 4242</span>
                </div>
             </div>
             <Button variant="outline" className="h-10 border-white/20 hover:bg-white/10 text-white hover:text-white">
                Alterar
             </Button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {PLANS.map(plan => {
           const isCurrent = currentSub?.planId === plan.id;
           return (
             <div 
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${plan.color} ${
                  isCurrent ? 'ring-2 ring-indigo-600 scale-[1.02] shadow-lg' : 'hover:scale-[1.01] hover:shadow-md'
                } ${plan.id === 'enterprise' ? 'text-white' : 'text-slate-900'}`}
             >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg">
                    MAIS POPULAR
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">€{plan.price}</span>
                  <span className={`text-sm ${plan.id === 'enterprise' ? 'text-slate-400' : 'text-slate-500'}`}>/mês</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                       <CheckCircle2 className={`size-5 shrink-0 ${
                          plan.id === 'enterprise' ? 'text-indigo-400' : 'text-indigo-600'
                       }`} />
                       <span className={plan.id === 'enterprise' ? 'text-slate-300' : 'text-slate-600'}>
                         {feature}
                       </span>
                    </li>
                  ))}
                </ul>

                <Button 
                   onClick={() => !isCurrent && handleUpdatePlan(plan.id)}
                   disabled={isCurrent || updating}
                   className={`w-full h-12 rounded-xl font-bold shadow-none ${
                     isCurrent 
                       ? 'bg-green-500/10 text-green-600 cursor-default hover:bg-green-500/10' 
                       : plan.id === 'enterprise' 
                         ? 'bg-white text-slate-900 hover:bg-slate-100'
                         : 'bg-indigo-600 text-white hover:bg-indigo-700'
                   }`}
                >
                   {updating && !isCurrent ? (
                     <Loader2 className="size-5 animate-spin" />
                   ) : isCurrent ? (
                     <>
                       <CheckCircle2 className="size-4 mr-2" />
                       Plano Atual
                     </>
                   ) : (
                     'Atualizar Plano'
                   )}
                </Button>
             </div>
           );
        })}
      </div>
    </div>
  );
}