import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId } from '../../../utils/supabase';  // Fixed: 3 levels up, not 2
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

interface Debtor {
  id: string;
  name: string;
  email: string;
  phone: string;
  debtAmount: number;
  status: string;
  dueDate: string;
  dispute?: {
    isOpen: boolean;
    reason: string;
    type: string;
    description: string;
    openedAt: string;
    openedBy: string;
  };
}

export default function AdminDisputes({ session }: { session: any }) {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Debtor | null>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolutionType, setResolutionType] = useState<'accept' | 'reject'>('accept');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, [session]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter only disputes
        const disputed = (data.debtors || []).filter((d: Debtor) => d.status === 'dispute');
        setDebtors(disputed);
      }
    } catch (error) {
      console.error("Failed to fetch disputes", error);
      toast.error("Erro ao carregar disputas");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveClick = (debtor: Debtor, type: 'accept' | 'reject') => {
    setSelectedDispute(debtor);
    setResolutionType(type);
    setResolveDialogOpen(true);
    setResolutionNotes('');
  };

  const submitResolution = async () => {
    if (!selectedDispute) return;

    try {
      setProcessing(true);
      const newStatus = resolutionType === 'accept' ? 'cancelled' : 'active';
      const outcome = resolutionType === 'accept' ? 'accepted' : 'rejected';

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/${selectedDispute.id}/dispute/resolve`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            outcome,
            newStatus,
            notes: resolutionNotes
        })
      });

      if (res.ok) {
        toast.success(`Disputa ${resolutionType === 'accept' ? 'aceita' : 'rejeitada'} com sucesso!`);
        setResolveDialogOpen(false);
        fetchDisputes(); // Refresh list
      } else {
        toast.error("Erro ao resolver disputa");
      }
    } catch (error) {
      console.error("Error resolving dispute", error);
      toast.error("Erro de conexão");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="size-6 text-amber-500" />
            Centro de Disputas
          </h2>
          <p className="text-slate-500 mt-1">
            Gerencie contestações e pausas automáticas de cobrança.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 text-amber-800 text-sm font-medium">
             <Clock className="size-4" />
             Cobrança automática pausada para {debtors.length} casos
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Carregando disputas...</div>
      ) : debtors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
            <CheckCircle2 className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Tudo limpo!</h3>
            <p className="text-slate-500">Nenhuma disputa aberta no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
            {debtors.map((debtor) => (
                <div key={debtor.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        {/* Debtor Info */}
                        <div className="space-y-1 min-w-[200px]">
                            <h3 className="font-bold text-slate-900 text-lg">{debtor.name}</h3>
                            <p className="text-sm text-slate-500">{debtor.document}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                <FileText className="size-4" />
                                <span>Fatura: {debtor.invoiceNumber || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Dispute Info */}
                        <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">
                                    {debtor.dispute?.type || 'Contestação'}
                                </span>
                                <span className="text-xs text-slate-400">
                                    Aberto em {new Date(debtor.dispute?.openedAt || '').toLocaleDateString()}
                                </span>
                             </div>
                             <p className="text-slate-700 text-sm italic">
                                "{debtor.dispute?.description}"
                             </p>
                             <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                <MessageSquare className="size-3" />
                                Motivo: {debtor.dispute?.reason}
                             </div>
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex flex-col justify-between items-end min-w-[180px]">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase font-bold">Valor em Disputa</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    € {debtor.debtAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4">
                                <Button 
                                    variant="outline" 
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={() => handleResolveClick(debtor, 'reject')}
                                >
                                    <XCircle className="size-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button 
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => handleResolveClick(debtor, 'accept')}
                                >
                                    <CheckCircle2 className="size-4 mr-2" />
                                    Aceitar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Resolution Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {resolutionType === 'accept' ? 'Aceitar Contestação' : 'Rejeitar Contestação'}
                </DialogTitle>
                <DialogDescription>
                    {resolutionType === 'accept' 
                        ? 'Ao aceitar, a dívida será cancelada e o cliente notificado. A cobrança será encerrada permanentemente.'
                        : 'Ao rejeitar, a dívida voltará para o status "Ativo" e o fluxo de cobrança automática será retomado imediatamente.'
                    }
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Notas da Resolução (Interno)
                </label>
                <Textarea 
                    placeholder="Descreva o motivo da decisão..." 
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                />
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>Cancelar</Button>
                <Button 
                    onClick={submitResolution} 
                    disabled={processing}
                    className={resolutionType === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
                >
                    {processing ? 'Processando...' : 'Confirmar Resolução'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}