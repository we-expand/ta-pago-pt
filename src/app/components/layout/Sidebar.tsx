import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Settings, 
  Link2, 
  Brain, 
  Target, 
  Terminal, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Handshake,
  ChevronRight, 
  ChevronDown,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/button';

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  session: any;
  onLogout: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

type SubItem = {
  id: string;
  label: string;
  badge?: string;
};

type MenuItem = {
  id: string; // If it has subitems, this is just a group ID. If not, it's the view ID.
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: SubItem[];
  viewId?: string; // The actual view ID to trigger if it's a leaf node
};

const menuGroups = [
  {
    title: "Principal",
    items: [
      { id: 'dashboard', viewId: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'debtors', viewId: 'debtors', label: 'Carteira', icon: <Users className="w-5 h-5" /> },
      { id: 'agreements', viewId: 'agreements', label: 'Acordos', icon: <Handshake className="w-5 h-5" /> },
      { id: 'timeline', viewId: 'timeline', label: 'Linha do Tempo', icon: <Clock className="w-5 h-5" /> },
    ]
  },
  {
    title: "Inteligência",
    items: [
      { 
        id: 'intelligence', 
        label: 'Motor de IA', 
        icon: <Brain className="w-5 h-5" />,
        subItems: [
          { id: 'ai', label: 'Gestão de AI', badge: 'Beta' },
          { id: 'channels', label: 'Canais e Réguas' }
        ]
      }
    ]
  },
  {
    title: "Operacional",
    items: [
      { id: 'integrations', viewId: 'integrations', label: 'Conectores', icon: <Link2 className="w-5 h-5" /> },
      { id: 'settings', viewId: 'settings', label: 'Ajustes', icon: <Settings className="w-5 h-5" /> },
    ]
  },
  {
    title: "Sistema",
    items: [
      { id: 'innovation', viewId: 'innovation', label: 'Dev Lab', icon: <Terminal className="w-5 h-5" /> },
      { id: 'mvp_status', viewId: 'mvp_status', label: 'Status Projeto', icon: <FileText className="w-5 h-5" /> },
      { id: 'strategy', viewId: 'strategy', label: 'Planeamento Estratégico', icon: <TrendingUp className="w-5 h-5" />, badge: 'Novo' },
      { id: 'admin', viewId: 'admin', label: 'Admin', icon: <ShieldCheck className="w-5 h-5" /> },
    ]
  }
];

export function Sidebar({ activeView, onChangeView, session, onLogout, isOpen, onCloseMobile }: SidebarProps) {
  // State to track expanded submenus
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['intelligence']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      toggleGroup(item.id);
    } else if (item.viewId) {
      onChangeView(item.viewId);
      onCloseMobile();
    }
  };

  const isGroupActive = (item: MenuItem) => {
    if (item.viewId === activeView) return true;
    if (item.subItems) {
      return item.subItems.some(sub => sub.id === activeView);
    }
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[320px] bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none transition-transform duration-300 ease-[0.22, 1, 0.36, 1] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-50">
          <div className="scale-90 origin-left">
             <Logo size="default" />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-mono">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = isGroupActive(item);
                  const isExpanded = expandedGroups.includes(item.id);
                  const hasSubItems = !!item.subItems;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                           isActive && !hasSubItems
                             ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                             : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                         <div className="flex items-center gap-3 relative z-10">
                            <div className={`transition-colors ${isActive && !hasSubItems ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                                {item.icon}
                            </div>
                            <span className="text-base font-medium tracking-tight">{item.label}</span>
                         </div>
                         
                         {/* Right Side Indicators */}
                         <div className="flex items-center gap-2 relative z-10">
                            {item.badge && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isActive && !hasSubItems
                                    ? 'bg-white/20 text-white'
                                    : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                            {hasSubItems && (
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            )}
                         </div>
                      </button>

                      {/* Sub Items Accordion */}
                      <AnimatePresence>
                        {hasSubItems && isExpanded && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                             className="overflow-hidden"
                           >
                              <div className="pt-1 pb-2 pl-4 space-y-1">
                                 {item.subItems!.map((sub) => {
                                     const isSubActive = activeView === sub.id;
                                     return (
                                         <button
                                            key={sub.id}
                                            onClick={() => {
                                                onChangeView(sub.id);
                                                onCloseMobile();
                                            }}
                                            className={`relative w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base transition-colors ml-4 border-l-2 ${
                                                isSubActive
                                                ? 'border-indigo-500 text-indigo-600 font-medium bg-indigo-50/50'
                                                : 'border-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                            }`}
                                         >
                                            <span>{sub.label}</span>
                                            {sub.badge && (
                                                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                                                    {sub.badge}
                                                </span>
                                            )}
                                         </button>
                                     )
                                 })}
                              </div>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
             <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                        {session?.user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">{session?.user?.user_metadata?.name || 'Utilizador'}</p>
                        <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-1">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={onLogout}
                    >
                        <LogOut className="w-3 h-3 mr-2" />
                        Encerrar Sessão
                    </Button>
                </div>
             </div>
        </div>
      </motion.aside>
    </>
  );
}