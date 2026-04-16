import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EtherealBackground } from '../ui/EtherealBackground';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  session: any;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export default function DashboardLayout({ 
  children, 
  activeView, 
  setActiveView, 
  session, 
  onLogout,
  onOpenProfile
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = (view: string) => {
    switch(view) {
        case 'dashboard': return 'Visão Geral';
        case 'debtors': return 'Carteira de Devedores';
        case 'agreements': return 'Gestor de Acordos';
        case 'timeline': return 'Linha do Tempo';
        case 'integrations': return 'Conectores';
        case 'settings': return 'Ajustes';
        case 'ai': return 'Motor de IA';
        case 'channels': return 'Canais e Réguas';
        case 'innovation': return 'Dev Lab';
        case 'strategy': return 'Planeamento Estratégico';
        case 'mvp_status': return 'Status do Projeto';
        case 'admin': return 'Painel Admin';
        default: return 'Tapago';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden text-slate-900 selection:bg-indigo-500/20">
      <EtherealBackground />

      <Sidebar 
        activeView={activeView} 
        onChangeView={setActiveView} 
        session={session} 
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-0">
         <Header 
           title={getPageTitle(activeView)}
           activeView={activeView}
           onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
           session={session}
           onLogout={onLogout}
           onOpenProfile={onOpenProfile}
         />

         <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar relative">
            {/* Content Container with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // "Quart" easing
                className="w-full min-h-full pb-20"
              >
                {children}
              </motion.div>
            </AnimatePresence>
         </main>
      </div>
    </div>
  );
}