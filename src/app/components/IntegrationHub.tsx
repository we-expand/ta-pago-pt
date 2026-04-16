import { Link2, Plus, CheckCircle2, Search, Zap, DollarSign, Users, ShoppingCart, MessageSquare, Building2, BarChart3, Globe, ExternalLink, X, Loader2, QrCode, Smartphone, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { projectId } from '../../../utils/supabase/info';
import InteractiveButton from './ui/InteractiveButton';
import QRCode from 'react-qr-code';

// Import logos locais
import cegidPrimaveraLogo from "../../assets/c4db6abc77177a382ea613c910af85468e7de259.png";
import moloniLogo from "../../assets/4f43a629e6a891c24e414e82c80daec1e276c956.png";

type IntegrationCategory = 'Financeiro' | 'CRM' | 'Pagamentos' | 'Comunicação' | 'ERP' | 'Outros';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string; // URL
  status: string;
  category: IntegrationCategory;
  bgColor: string;
  features: string[];
  docsUrl?: string;
  website: string;
  connectUrl?: string;
}

export default function IntegrationHub({ session }: { session: any }) {
  const [connected, setConnected] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal de Conexão
  const [connectingInt, setConnectingInt] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Buscar integrações conectadas ao carregar
  useEffect(() => {
    fetchConnectedIntegrations();
  }, []);

  const fetchConnectedIntegrations = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/integrations`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // data.integrations é array de objetos { key, value: { id, ... } }
        const connectedIds = data.integrations.map((i: any) => i.value.id);
        setConnected(connectedIds);
      }
    } catch (error) {
      console.error('Erro ao buscar integrações:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todas', icon: <Globe className="size-5" />, color: 'from-slate-500 to-slate-600' },
    { id: 'Financeiro', name: 'Financeiro', icon: <DollarSign className="size-5" />, color: 'from-green-500 to-emerald-600' },
    { id: 'CRM', name: 'CRM', icon: <Users className="size-5" />, color: 'from-blue-500 to-cyan-600' },
    { id: 'Pagamentos', name: 'Pagamentos', icon: <ShoppingCart className="size-5" />, color: 'from-purple-500 to-pink-600' },
    { id: 'Comunicação', name: 'Comunicação', icon: <MessageSquare className="size-5" />, color: 'from-orange-500 to-red-600' },
    { id: 'ERP', name: 'ERP', icon: <Building2 className="size-5" />, color: 'from-indigo-500 to-purple-600' },
    { id: 'Outros', name: 'Outros', icon: <BarChart3 className="size-5" />, color: 'from-pink-500 to-rose-600' }
  ];

  const integrations: Integration[] = [
    // === FINANCEIRO ===
    { 
      id: 'primavera',
      name: 'Cegid Primavera', 
      description: 'ERP líder em Portugal para gestão empresarial completa',
      logo: cegidPrimaveraLogo, 
      status: 'Disponível', 
      category: 'Financeiro',
      bgColor: 'from-blue-500 to-blue-600',
      features: ['Faturação', 'Contabilidade', 'Gestão de Stock'],
      website: 'https://www.cegid.com/pt/primavera/'
    },
    { 
      id: 'sage',
      name: 'Sage', 
      description: 'Software de contabilidade e gestão para PMEs',
      logo: 'https://cdn.worldvectorlogo.com/logos/sage-2.svg', 
      status: 'Disponível', 
      category: 'Financeiro',
      bgColor: 'from-green-500 to-green-600',
      features: ['Contabilidade', 'Folha de Pagamento', 'Relatórios'],
      website: 'https://www.sage.com/pt-pt/'
    },
    { 
      id: 'moloni',
      name: 'Moloni', 
      description: 'Faturação online certificada pela AT',
      logo: moloniLogo, 
      status: 'Disponível', 
      category: 'Financeiro',
      bgColor: 'from-purple-500 to-purple-600',
      features: ['Faturação', 'Certificação AT', 'API REST'],
      website: 'https://www.moloni.pt/'
    },
    { 
      id: 'xero',
      name: 'Xero', 
      description: 'Contabilidade online para pequenas empresas',
      logo: 'https://cdn.worldvectorlogo.com/logos/xero.svg', 
      status: 'Disponível', 
      category: 'Financeiro',
      bgColor: 'from-teal-500 to-cyan-600',
      features: ['Contabilidade', 'Reconciliação', 'Relatórios'],
      website: 'https://www.xero.com/'
    },

    // === CRM ===
    { 
      id: 'linkedin',
      name: 'LinkedIn', 
      description: 'Sincronização de contatos e enriquecimento de perfil',
      logo: 'https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg', 
      status: 'Disponível', 
      category: 'CRM',
      bgColor: 'from-blue-600 to-blue-700',
      features: ['Contatos', 'Enriquecimento', 'Social'],
      website: 'https://www.linkedin.com/'
    },
    { 
      id: 'salesforce',
      name: 'Salesforce', 
      description: 'CRM líder mundial para gestão de clientes',
      logo: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg', 
      status: 'Disponível', 
      category: 'CRM',
      bgColor: 'from-blue-400 to-cyan-500',
      features: ['Gestão de Leads', 'Pipeline', 'Analytics'],
      website: 'https://www.salesforce.com/'
    },
    { 
      id: 'hubspot',
      name: 'HubSpot', 
      description: 'Plataforma completa de marketing e vendas',
      logo: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg', 
      status: 'Disponível', 
      category: 'CRM',
      bgColor: 'from-orange-400 to-red-500',
      features: ['CRM', 'Marketing', 'Automação'],
      website: 'https://www.hubspot.com/'
    },
    { 
      id: 'pipedrive',
      name: 'Pipedrive', 
      description: 'CRM focado em pipeline de vendas',
      logo: 'https://cdn.worldvectorlogo.com/logos/pipedrive.svg', 
      status: 'Disponível', 
      category: 'CRM',
      bgColor: 'from-pink-400 to-pink-600',
      features: ['Pipeline', 'Vendas', 'Relatórios'],
      website: 'https://www.pipedrive.com/'
    },
    { 
      id: 'zoho',
      name: 'Zoho CRM', 
      description: 'CRM completo e acessível',
      logo: 'https://cdn.worldvectorlogo.com/logos/zoho-1.svg', 
      status: 'Disponível', 
      category: 'CRM',
      bgColor: 'from-red-400 to-orange-500',
      features: ['Gestão de Clientes', 'Automação', 'IA'],
      website: 'https://www.zoho.com/crm/'
    },

    // === PAGAMENTOS ===
    { 
      id: 'stripe',
      name: 'Stripe', 
      description: 'Processamento de pagamentos online',
      logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', 
      status: 'Disponível', 
      category: 'Pagamentos',
      bgColor: 'from-violet-500 to-purple-600',
      features: ['Pagamentos Online', 'Subscriptions', 'API'],
      website: 'https://stripe.com/'
    },
    { 
      id: 'paypal',
      name: 'PayPal', 
      description: 'Gateway de pagamento global',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', 
      status: 'Disponível', 
      category: 'Pagamentos',
      bgColor: 'from-blue-500 to-indigo-600',
      features: ['Pagamentos', 'Global', 'Seguro'],
      website: 'https://www.paypal.com/'
    },
    { 
      id: 'easypay',
      name: 'Easypay', 
      description: 'Solução portuguesa de pagamentos',
      logo: 'https://asset.brandfetch.io/idf-7v-zAR/idrXo6q_7E.svg', 
      status: 'Disponível', 
      category: 'Pagamentos',
      bgColor: 'from-cyan-400 to-blue-500',
      features: ['MB WAY', 'Multibanco', 'Cartões'],
      website: 'https://www.easypay.pt/'
    },

    // === COMUNICAÇÃO ===
    { 
      id: 'twilio',
      name: 'Twilio', 
      description: 'SMS, WhatsApp e comunicação programável',
      logo: 'https://cdn.worldvectorlogo.com/logos/twilio.svg', 
      status: 'Disponível', 
      category: 'Comunicação',
      bgColor: 'from-red-500 to-pink-600',
      features: ['SMS', 'WhatsApp', 'Voice'],
      website: 'https://www.twilio.com/'
    },
    { 
      id: 'sendgrid',
      name: 'SendGrid', 
      description: 'Envio de emails transacionais em massa',
      logo: 'https://cdn.worldvectorlogo.com/logos/sendgrid-1.svg', 
      status: 'Disponível', 
      category: 'Comunicação',
      bgColor: 'from-blue-600 to-cyan-600',
      features: ['Email', 'Templates', 'Analytics'],
      website: 'https://sendgrid.com/'
    },
    { 
      id: 'mailchimp',
      name: 'Mailchimp', 
      description: 'Marketing automation e email marketing',
      logo: 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg', 
      status: 'Disponível', 
      category: 'Comunicação',
      bgColor: 'from-yellow-400 to-yellow-600',
      features: ['Email Marketing', 'Automação', 'Campanhas'],
      website: 'https://mailchimp.com/'
    },
    { 
      id: 'whatsapp-business',
      name: 'WhatsApp', 
      description: 'API oficial do WhatsApp para empresas',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', 
      status: 'Disponível', 
      category: 'Comunicação',
      bgColor: 'from-green-500 to-emerald-600',
      features: ['WhatsApp', 'Oficial', 'Business'],
      website: 'https://business.whatsapp.com/'
    },

    // === ERP ===
    { 
      id: 'sap',
      name: 'SAP', 
      description: 'ERP para pequenas e médias empresas',
      logo: 'https://cdn.worldvectorlogo.com/logos/sap-1.svg', 
      status: 'Disponível', 
      category: 'ERP',
      bgColor: 'from-blue-700 to-indigo-800',
      features: ['ERP Completo', 'Internacional', 'Escalável'],
      website: 'https://www.sap.com/'
    },
    { 
      id: 'odoo',
      name: 'Odoo', 
      description: 'Suite de aplicações empresariais open-source',
      logo: 'https://cdn.worldvectorlogo.com/logos/odoo.svg', 
      status: 'Disponível', 
      category: 'ERP',
      bgColor: 'from-purple-600 to-pink-600',
      features: ['Open Source', 'Modular', 'Completo'],
      website: 'https://www.odoo.com/'
    },

    // === OUTROS ===
    { 
      id: 'zapier',
      name: 'Zapier', 
      description: 'Automação entre milhares de apps',
      logo: 'https://cdn.worldvectorlogo.com/logos/zapier-1.svg', 
      status: 'Disponível', 
      category: 'Outros',
      bgColor: 'from-orange-500 to-red-600',
      features: ['Automação', 'Integrações', 'No-code'],
      website: 'https://zapier.com/'
    },
    { 
      id: 'make',
      name: 'Make', 
      description: 'Automação visual de workflows',
      logo: 'https://asset.brandfetch.io/idIcon/id20mQyv5L.svg', 
      status: 'Disponível', 
      category: 'Outros',
      bgColor: 'from-purple-500 to-indigo-600',
      features: ['Automação Visual', 'Workflows', 'Integração'],
      website: 'https://www.make.com/'
    },
    { 
      id: 'google-sheets',
      name: 'Google Sheets', 
      description: 'Sincronização com planilhas Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg', 
      status: 'Disponível', 
      category: 'Outros',
      bgColor: 'from-green-500 to-green-600',
      features: ['Planilhas', 'Cloud', 'Colaborativo'],
      website: 'https://www.google.com/sheets/about/'
    }
  ];

  const handleConnectClick = (integration: Integration) => {
    if (connected.includes(integration.id)) {
      if (integration.id === 'linkedin') {
         toast.info("Painel de Administração do LinkedIn será aberto em breve.");
         return;
      }
      // Desconectar imediatamente
      toggleConnection(integration.id, integration.name, 'disconnect');
    } else {
      // Abrir modal para conectar
      setConnectingInt(integration);
      setApiKey('');
    }
  };

  const toggleConnection = async (id: string, name: string, action: 'connect' | 'disconnect', config: any = {}) => {
    try {
      setIsConnecting(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-12af7011/integrations/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ integrationId: id, name, action, config })
      });

      if (response.ok) {
        if (action === 'connect') {
          setConnected([...connected, id]);
          toast.success(`Conectado com ${name}!`);
        } else {
          setConnected(connected.filter(c => c !== id));
          toast.success(`Desconectado de ${name}`);
        }
      } else {
        throw new Error('Falha na conexão');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar conexão');
    } finally {
      setIsConnecting(false);
      setConnectingInt(null);
    }
  };

  const handleConfirmConnect = () => {
    if (!connectingInt) return;
    if (connectingInt.id === 'linkedin') {
       // Direct connect for OAuth simulation
       toggleConnection(connectingInt.id, connectingInt.name, 'connect');
       return;
    }
    if (!apiKey.trim()) {
      toast.error('Por favor, insira a Chave de API');
      return;
    }
    toggleConnection(connectingInt.id, connectingInt.name, 'connect', { apiKey });
  };

  const simulateOAuth = () => {
     if (!connectingInt) return;
     setIsConnecting(true);
     
     // Simulation only - in prod would be real OAuth URL
     // Removed window.open to improve mobile compatibility and avoid popup blockers
     toast.loading("Conectando à página do LinkedIn: Tá Pago...", { duration: 2000 });
     
     setTimeout(() => {
        toggleConnection(connectingInt.id, "LinkedIn (Tá Pago)", 'connect');
     }, 2000);
  };

  const filteredIntegrations = integrations.filter(integration => {
    // Filtro de busca
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getIntegrationsByCategory = (categoryId: string) => {
    return filteredIntegrations.filter(i => i.category === categoryId);
  };

  const categoriesToShow = selectedCategory === 'all' 
    ? categories.filter(c => c.id !== 'all') 
    : categories.filter(c => c.id === selectedCategory);

  const stats = {
    total: integrations.length,
    connected: connected.length,
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Zap className="size-8 text-indigo-600" />
            Central de Integrações
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Conecte sua plataforma com as ferramentas que você já usa.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none">{stats.connected}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Conectadas</div>
            </div>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="size-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Globe className="size-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none">{stats.total}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Disponíveis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar integrações (ex: LinkedIn, Salesforce, Stripe)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg transition-all"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Integrations List by Category */}
      <div className="space-y-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-10 text-indigo-600 animate-spin" />
          </div>
        ) : (
          categoriesToShow.map(category => {
            const categoryIntegrations = getIntegrationsByCategory(category.id);
            if (categoryIntegrations.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{category.name}</h2>
                  <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {categoryIntegrations.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryIntegrations.map((integration) => {
                    const isConnected = connected.includes(integration.id);
                    
                    return (
                      <motion.div
                        key={integration.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center overflow-hidden ${
                          isConnected 
                            ? 'border-green-500 shadow-green-100 shadow-lg' 
                            : 'border-slate-100 hover:border-indigo-200 hover:shadow-xl'
                        }`}
                      >
                        {/* Status Badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                          isConnected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <div className={`size-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                          {isConnected ? 'Ativo' : 'Inativo'}
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col items-center flex-1 w-full">
                          {/* Logo Area */}
                          <div className="mb-5 relative">
                            <div className="size-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                              <img 
                                src={integration.logo} 
                                alt={`${integration.name} logo`}
                                className={`w-full h-full object-contain ${
                                  integration.id === 'primavera' ? 'scale-[1.8]' : ''
                                }`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${integration.name}&background=random&color=fff&size=128`;
                                }}
                              />
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                            {integration.name}
                            <a href={integration.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors" title="Visitar site">
                              <ExternalLink className="size-4" />
                            </a>
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                            {integration.description}
                          </p>

                          {/* Features Tags */}
                          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                            {integration.features.slice(0, 3).map(feature => (
                              <span 
                                key={feature}
                                className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[10px] uppercase tracking-wider font-semibold border border-slate-100"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Action Button - Always at bottom */}
                          <div className="mt-auto w-full pt-4 border-t border-slate-50">
                            <InteractiveButton
                              variant={isConnected ? 'ghost' : 'primary'}
                              className={`w-full justify-center ${
                                isConnected 
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border border-green-200' 
                                  : ''
                              }`}
                              onClick={() => handleConnectClick(integration)}
                            >
                              {isConnected ? (
                                <>
                                  {integration.id === 'linkedin' ? (
                                      <>
                                        <SettingsIcon className="size-4" />
                                        Administrar
                                      </>
                                  ) : (
                                      <>
                                        <CheckCircle2 className="size-4" />
                                        Conectado
                                      </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Plus className="size-4" />
                                  Conectar
                                </>
                              )}
                            </InteractiveButton>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Conexão */}
      <AnimatePresence>
        {connectingInt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConnectingInt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={connectingInt.logo} 
                      alt="Logo" 
                      className="size-10 object-contain rounded-lg border border-slate-100"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Conectar {connectingInt.name}
                        <a href={connectingInt.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600">
                          <ExternalLink className="size-4" />
                        </a>
                      </h3>
                      <p className="text-sm text-slate-500">Configuração de Integração</p>
                    </div>
                  </div>
                  <button onClick={() => setConnectingInt(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="size-6" />
                  </button>
                </div>

                {connectingInt.id === 'linkedin' ? (
                  // LinkedIn Special Flow
                  <div className="flex flex-col items-center justify-center py-8 space-y-6">
                    <div className="p-4 bg-blue-50 rounded-full animate-pulse">
                      <img src={connectingInt.logo} className="size-16" alt="LinkedIn" />
                    </div>
                    
                    <div className="text-center space-y-2">
                       <h4 className="font-bold text-slate-900 text-xl">Sincronizar Perfil</h4>
                       <p className="text-slate-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                          Conecte-se com segurança à API oficial do LinkedIn para enriquecer seus dados de contato e empresas.
                       </p>
                    </div>

                    <div className="w-full space-y-3 pt-2">
                       <InteractiveButton
                         onClick={simulateOAuth}
                         loading={isConnecting}
                         className="w-full bg-[#0077B5] hover:bg-[#006396] text-white border-none h-14 text-lg font-bold shadow-lg shadow-blue-900/20 rounded-xl justify-center"
                       >
                          {!isConnecting && (
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
                              className="size-6 filter brightness-0 invert mr-2" 
                              alt=""
                            />
                          )}
                          {isConnecting ? 'Conectando...' : 'Entrar com LinkedIn'}
                       </InteractiveButton>
                       
                       <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                          <ShieldCheck className="size-3" />
                          Permissão de leitura apenas
                       </p>
                    </div>
                  </div>
                ) : (
                  // Standard Flow
                  <div className="space-y-6">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                      <button className="flex-1 py-2 px-3 text-sm font-medium bg-white text-slate-900 rounded-md shadow-sm flex items-center justify-center gap-2">
                        <QrCode className="size-4" />
                        Scan QR Code
                      </button>
                      <button className="flex-1 py-2 px-3 text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2" onClick={() => toast.info('Configuração manual em breve')}>
                        <SettingsIcon className="size-4" />
                        Manual
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                      <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm relative group">
                        <QRCode 
                          value={connectingInt.connectUrl || (typeof window !== 'undefined' ? `${window.location.origin}/connect/${connectingInt.id}` : `https://tapago.pt/connect/${connectingInt.id}`)}
                          size={180}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          viewBox={`0 0 256 256`}
                        />
                        
                        {/* Overlay para simulação rápida */}
                        <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => toggleConnection(connectingInt.id, connectingInt.name, 'connect')}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
                          >
                            Simular Conexão
                          </button>
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <h4 className="font-semibold text-slate-900 flex items-center justify-center gap-2">
                          <Smartphone className="size-4 text-indigo-600" />
                          Escaneie para conectar
                        </h4>
                        <p className="text-xs text-slate-500 max-w-[240px]">
                          Abra o app do <strong>{connectingInt.name}</strong> ou aponte a câmera.
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Ou use a Chave de API</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        API Key / Access Token
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={`Cole sua chave do ${connectingInt.name} aqui...`}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                )}

                {connectingInt.id !== 'linkedin' && (
                  <div className="mt-8 flex gap-3">
                    <InteractiveButton
                      variant="ghost"
                      onClick={() => setConnectingInt(null)}
                      className="flex-1 justify-center"
                    >
                      Cancelar
                    </InteractiveButton>
                    <InteractiveButton
                      variant="primary"
                      onClick={handleConfirmConnect}
                      loading={isConnecting}
                      className="flex-1 justify-center"
                    >
                      Conectar Integração
                    </InteractiveButton>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}