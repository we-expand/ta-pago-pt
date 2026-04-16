import { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import InteractiveButton from './ui/InteractiveButton';
import GlassCard from './ui/GlassCard';
import { projectId } from '../../../utils/supabase/info';
import * as XLSX from 'xlsx';

interface ImportModalProps {
  session: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportModal({ session, onClose, onSuccess }: ImportModalProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (!jsonData || jsonData.length < 2) {
            toast.error('Arquivo vazio ou inválido');
            return;
        }

        const header = (jsonData[0] as string[]).map(h => String(h).trim());
        const rows = jsonData.slice(1, 6).map((row: any) => {
            const rowData: any = {};
            header.forEach((key, index) => {
                rowData[key] = row[index] !== undefined ? row[index] : '';
            });
            return rowData;
        });

        setPreview(rows);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast.error("Erro ao ler o arquivo. Verifique o formato.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const sheetName = wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        if (!jsonData || jsonData.length < 2) {
             throw new Error("Arquivo sem dados");
        }

        const header = (jsonData[0] as string[]).map(h => String(h).trim().toLowerCase());
        const dataRows = jsonData.slice(1);

        const debtors = dataRows.map((row: any) => {
            const debtor: any = {};
            header.forEach((key, index) => {
                debtor[key] = row[index] !== undefined ? String(row[index]).trim() : '';
            });
            return debtor;
        });

        // Mapear campos do CSV/Excel para campos do sistema
        const mappedDebtors = debtors.map((d: any) => ({
          name: d.name || d.nome || d['nome completo'] || d['cliente'] || '',
          email: d.email || d['e-mail'] || d['correio eletronico'] || '',
          phone: d.phone || d.telefone || d.tel || d.celular || d.contato || '',
          document: d.document || d.documento || d.cpf || d.cnpj || d.nif || '',
          documentType: d.documenttype || d.tipodocumento || 'CPF',
          birthDate: d.birthdate || d.datanascimento || d.nascimento || '',
          street: d.street || d.rua || d.endereco || d['endereço'] || '',
          number: d.number || d.numero || d['número'] || '',
          complement: d.complement || d.complemento || '',
          neighborhood: d.neighborhood || d.bairro || '',
          city: d.city || d.cidade || d['município'] || '',
          state: d.state || d.estado || d.uf || d.distrito || '',
          zipCode: d.zipcode || d.cep || d.codigopostal || '',
          country: d.country || d.pais || d['país'] || 'Portugal',
          debtAmount: d.debtamount || d.valordivida || d.valor || d['valor devido'] || '',
          originalAmount: d.originalamount || d.valororiginal || '',
          dueDate: d.duedate || d.datavencimento || d.vencimento || '',
          contractNumber: d.contractnumber || d.numerocontrato || d.contrato || '',
          invoiceNumber: d.invoicenumber || d.numerofatura || d.fatura || '',
          description: d.description || d.descricao || d['descrição'] || '',
          segment: d.segment || d.segmento || 'B2C',
          category: d.category || d.categoria || 'Geral',
          priority: d.priority || d.prioridade || 'medium',
          companyName: d.companyname || d.empresa || '',
          companyRole: d.companyrole || d.cargo || '',
          notes: d.notes || d.notas || d.observacoes || d['observações'] || ''
        }));

        // Enviar para o backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/debtors/import`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ debtors: mappedDebtors })
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao importar devedores');
        }

        const result = await response.json();
        setImportResult(result);
        toast.success(result.message);
        
        if (result.errors === 0) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error importing debtors:', error);
      toast.error('Erro ao importar devedores');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Template with header and sample data
    const ws = XLSX.utils.aoa_to_sheet([
        ["nome", "email", "telefone", "documento", "valor", "vencimento", "endereco", "cidade", "estado", "cep", "categoria", "segmento"],
        ["João Silva", "joao@example.com", "912345678", "123456789", "1500.00", "2024-12-31", "Rua das Flores 123", "Lisboa", "Lisboa", "1000-001", "Empréstimo", "B2C"],
        ["Maria Santos", "maria@example.com", "923456789", "987654321", "3200.50", "2024-11-30", "Av. da República 45", "Porto", "Porto", "4000-001", "Cartão", "B2C"],
        ["Empresa XYZ", "contato@xyz.pt", "934567890", "500123456", "15000.00", "2024-10-15", "Rua Comercial 789", "Coimbra", "Coimbra", "3000-001", "Serviços", "B2B"]
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_importacao_devedores.xlsx");
    toast.success('Template baixado com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <GlassCard
        variant="strong"
        blur="xl"
        hover={false}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30 sticky top-0 bg-white/10 backdrop-blur-xl z-20">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Importar Base de Devedores</h2>
            <p className="text-slate-600 mt-1">Carregue sua planilha Excel ou CSV</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-10 rounded-xl bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50/50 backdrop-blur-sm border-2 border-blue-200/30 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">Baixe o Modelo Excel</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Utilize nosso modelo padrão para garantir a importação correta dos dados.
                </p>
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  icon={<Download className="size-4" />}
                  onClick={downloadTemplate}
                >
                  Baixar Planilha Modelo
                </InteractiveButton>
              </div>
            </div>
          </div>

          {/* File Upload */}
          {!importResult && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Selecione o arquivo (Excel ou CSV)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 bg-white/30 backdrop-blur-sm border-2 border-dashed border-white/50 rounded-2xl cursor-pointer hover:bg-white/40 transition-colors"
                >
                  <Upload className="size-12 text-slate-400 mb-4" />
                  <p className="text-lg font-semibold text-slate-700 mb-1">
                    {file ? file.name : 'Clique para selecionar um arquivo'}
                  </p>
                  <p className="text-sm text-slate-500">ou arraste e solte aqui</p>
                  <p className="text-xs text-slate-400 mt-2">.XLSX, .XLS ou .CSV (máx. 10MB)</p>
                </label>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && !importResult && (
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Prévia dos Dados (5 primeiras linhas)</h3>
              <div className="bg-white/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/50 border-b border-white/30">
                      <tr>
                        {Object.keys(preview[0]).slice(0, 6).map((key) => (
                          <th key={key} className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-wider">
                            {key}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase text-xs tracking-wider">...</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {preview.map((row, index) => (
                        <tr key={index} className="hover:bg-white/20 transition-colors">
                          {Object.values(row).slice(0, 6).map((value: any, i) => (
                            <td key={i} className="px-4 py-3 text-slate-700 truncate max-w-[150px]">
                              {value || '-'}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-slate-500">...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">
                * Verifique se as colunas correspondem aos campos esperados (Nome, Email, Valor, etc.)
              </p>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-green-50/50 backdrop-blur-sm border-2 border-green-200/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-lg mb-2">Importação Concluída!</h3>
                    <div className="space-y-1 text-sm text-green-800">
                      <p>✓ <span className="font-semibold">{importResult.imported}</span> devedores importados com sucesso</p>
                      {importResult.errors > 0 && (
                        <p>✗ <span className="font-semibold">{importResult.errors}</span> erros encontrados</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Errors Detail */}
              {importResult.errorDetails && importResult.errorDetails.length > 0 && (
                <div className="bg-red-50/50 backdrop-blur-sm border-2 border-red-200/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="size-5 text-red-600" />
                    <h4 className="font-bold text-red-900">Erros Detectados</h4>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {importResult.errorDetails.map((error: any, index: number) => (
                      <div key={index} className="text-sm text-red-800 bg-white/50 rounded-lg p-3 border border-red-100">
                        <span className="font-bold block mb-1">{error.debtor || 'Linha desconhecida'}</span> 
                        {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!file && !importResult && (
            <div className="bg-slate-50/50 backdrop-blur-sm border-2 border-slate-200/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700 space-y-2">
                  <p className="font-semibold">Colunas essenciais para o reconhecimento automático:</p>
                  <ul className="grid grid-cols-2 gap-2 ml-1">
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Nome / Cliente</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Valor / Dívida</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Vencimento</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Email</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Telefone / Celular</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> CPF / CNPJ / NIF</li>
                  </ul>
                  <p className="mt-3 text-xs text-slate-500">
                    O sistema tentará identificar automaticamente as colunas pelo nome.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/30 sticky bottom-0 bg-white/10 backdrop-blur-xl z-20">
          {importResult ? (
            <InteractiveButton
              variant="primary"
              size="lg"
              onClick={onSuccess}
            >
              Concluir
            </InteractiveButton>
          ) : (
            <>
              <InteractiveButton
                variant="ghost"
                size="lg"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </InteractiveButton>
              <InteractiveButton
                variant="primary"
                size="lg"
                icon={loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="size-5" />}
                onClick={handleImport}
                loading={loading}
                disabled={!file}
              >
                Importar Agora
              </InteractiveButton>
            </>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}