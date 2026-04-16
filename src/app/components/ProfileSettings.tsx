import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { toast } from 'sonner';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function ProfileSettings({ session }: { session: any }) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName, name: fullName } // Atualizando ambos para garantir compatibilidade
      });

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso! A página será recarregada.');
      
      // Pequeno delay para o usuário ver o toast antes do reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold border-4 border-white shadow-sm">
          {fullName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meu Perfil</h2>
          <p className="text-slate-500">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              id="email" 
              value={email} 
              disabled 
              className="pl-10 bg-slate-50 text-slate-500 border-slate-200" 
            />
          </div>
          <p className="text-xs text-slate-400">O email é sua chave de acesso e não pode ser alterado aqui.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-slate-700">Nome Completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              id="fullName" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Cleber Couto"
              className="pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" 
            />
          </div>
          <p className="text-xs text-slate-500">Este nome será exibido em todas as suas interações.</p>
        </div>

        <div className="pt-6 flex justify-end border-t border-slate-100 mt-8">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
            >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
            </Button>
        </div>
      </form>
    </div>
  );
}