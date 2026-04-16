import { useState } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Euro, Calendar, Building2, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import GlassCard from './ui/GlassCard';
import { projectId } from '../../../utils/supabase/info';

interface NewDebtorModalProps {
  session: any;
  debtor?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewDebtorModal({ session, debtor, onClose, onSuccess }: NewDebtorModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    name: debtor?.name || '',
    email: debtor?.email || '',
    phone: debtor?.phone || '',
    documentType: debtor?.documentType || 'CPF',
    document: debtor?.document || '',
    birthDate: debtor?.birthDate || '',
    
    // Address
    street: debtor?.address?.street || '',
    number: debtor?.address?.number || '',
    complement: debtor?.address?.complement || '',
    neighborhood: debtor?.address?.neighborhood || '',
    city: debtor?.address?.city || '',
    state: debtor?.address?.state || '',
    zipCode: debtor?.address?.zipCode || '',
    country: debtor?.address?.country || 'Portugal',
    
    // Debt Info
    debtAmount: debtor?.debtAmount || '',
    originalAmount: debtor?.originalAmount || '',
    dueDate: debtor?.dueDate?.split('T')[0] || '',
    contractNumber: debtor?.contractNumber || '',
    invoiceNumber: debtor?.invoiceNumber || '',
    description: debtor?.description || '',
    
    // Classification
    segment: debtor?.segment || 'B2C',
    category: debtor?.category || 'Geral',
    priority: debtor?.priority || 'medium',
    
    // Company Info (B2B)
    companyName: debtor?.companyName || '',
    companyRole: debtor?.companyRole || '',
    
    // Financial
    estimatedIncome: debtor?.estimatedIncome || '',
    
    // Notes
    notes: debtor?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name || !formData.debtAmount || !formData.dueDate) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        documentType: formData.documentType,
        document: formData.document,
        birthDate: formData.birthDate || null,
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        debtAmount: parseFloat(formData.debtAmount),
        originalAmount: formData.originalAmount ? parseFloat(formData.originalAmount) : parseFloat(formData.debtAmount),
        dueDate: formData.dueDate,
        contractNumber: formData.contractNumber || null,
        invoiceNumber: formData.invoiceNumber || null,
        description: formData.description,
        segment: formData.segment,
        category: formData.category,
        priority: formData.priority,
        companyName: formData.companyName || null,
        companyRole: formData.companyRole || null,
        estimatedIncome: formData.estimatedIncome ? parseFloat(formData.estimatedIncome) : null,
        notes: formData.notes
      };

      const url = debtor
        ? `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/${debtor.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors`;

      const response = await fetch(url, {
        method: debtor ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar devedor');
      }

      const data = await response.json();
      toast.success(data.message || 'Devedor salvo com sucesso!');
      
      // 🎯 ENVIAR EMAIL AUTOMÁTICO QUANDO CRIAR NOVO DEVEDOR
      if (!debtor && data.debtor) {
        try {
          // Enviar email de notificação ao usuário
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/email/debtor-created`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                debtorId: data.debtor.id 
              })
            }
          );
        } catch (emailError) {
          console.error('Error sending debtor created email:', emailError);
          // Não falhar a criação se o email falhar
        }
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving debtor:', error);
      toast.error('Erro ao salvar devedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto"
      onClick={onClose}
    >
      <GlassCard
        variant="strong"
        blur="xl"
        hover={false}
        className="w-full max-w-5xl my-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/30">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {debtor ? 'Editar Devedor' : 'Novo Devedor'}
              </h2>
              <p className="text-slate-600 mt-1">Preencha os dados do devedor</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-10 rounded-xl bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
            >
              <X className="size-5 text-slate-600" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Dados Pessoais */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="size-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">Dados Pessoais</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="João Silva"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="joao@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="+351 912 345 678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Documento</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="NIF">NIF (Portugal)</option>
                    <option value="NIB">NIB (Portugal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Número do Documento</label>
                  <input
                    type="text"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="123.456.789-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Segmento</label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                  >
                    <option value="B2C">B2C (Pessoa Física)</option>
                    <option value="B2B">B2B (Empresa)</option>
                    <option value="B2G">B2G (Governo)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dados da Empresa (se B2B) */}
            {formData.segment === 'B2B' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="size-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">Dados da Empresa</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome da Empresa</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                      placeholder="Empresa Ltda"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cargo/Função</label>
                    <input
                      type="text"
                      value={formData.companyRole}
                      onChange={(e) => setFormData({ ...formData, companyRole: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                      placeholder="Diretor Financeiro"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Endereço */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="size-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">Endereço</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rua/Avenida</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="Rua das Flores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Número</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Complemento</label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="Apto 45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="Centro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="Lisboa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estado/Distrito</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="Lisboa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CEP/Código Postal</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="1000-001"
                  />
                </div>
              </div>
            </div>

            {/* Informações da Dívida */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Euro className="size-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">Informações da Dívida</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Valor Atual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.debtAmount}
                    onChange={(e) => setFormData({ ...formData, debtAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="1000.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Valor Original</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalAmount}
                    onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="1000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Data de Vencimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Número do Contrato</label>
                  <input
                    type="text"
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="CT-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Número da Fatura</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="INV-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Renda Estimada</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimatedIncome}
                    onChange={(e) => setFormData({ ...formData, estimatedIncome: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                    placeholder="2500.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Empréstimo">Empréstimo</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Telecomunicações">Telecomunicações</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors resize-none"
                    rows={3}
                    placeholder="Descrição da dívida..."
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notas Internas</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl focus:outline-none focus:border-purple-300 transition-colors resize-none"
                    rows={2}
                    placeholder="Notas internas sobre o devedor..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/30">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <AlertCircle className="size-4" />
              <span>Campos marcados com * são obrigatórios</span>
            </div>
            <div className="flex gap-3">
              <InteractiveButton
                type="button"
                variant="ghost"
                size="lg"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </InteractiveButton>
              <InteractiveButton
                type="submit"
                variant="primary"
                size="lg"
                icon={<Save className="size-5" />}
                loading={loading}
              >
                {debtor ? 'Salvar Alterações' : 'Criar Devedor'}
              </InteractiveButton>
            </div>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}