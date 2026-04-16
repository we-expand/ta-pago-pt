import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Euro, 
  Activity, 
  Rocket,
  Settings as SettingsIcon,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminCommandCenter from './AdminCommandCenter';
import AdminFinancials from './AdminFinancials';
import AdminUsers from './admin/AdminUsers';
import AdminPlans from './admin/AdminPlans';
import AdminSettings from './admin/AdminSettings';
import LaunchRoadmapFast from './system/LaunchRoadmapFast';

export default function AdminPanel({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'command' | 'financial' | 'users' | 'plans' | 'settings'>('command');
  
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      
      {/* Admin Sidebar Navigation */}
      <div className="w-64 border-r border-slate-200 bg-white p-6 hidden lg:block">
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Administração</h2>
          <div className="space-y-1">
            <NavButton 
              active={activeTab === 'command'} 
              onClick={() => setActiveTab('command')}
              icon={<Activity className="size-4" />}
              label="Centro de Comando"
            />
             <NavButton 
              active={activeTab === 'financial'} 
              onClick={() => setActiveTab('financial')}
              icon={<Euro className="size-4" />}
              label="Gestão Financeira (PT)"
            />
            <NavButton 
              active={activeTab === 'roadmap'} 
              onClick={() => setActiveTab('roadmap')}
              icon={<Rocket className="size-4" />}
              label="Roadmap & Tarefas"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Plataforma</h2>
          <div className="space-y-1">
            <NavButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              icon={<Users className="size-4" />}
              label="Usuários & Acessos"
            />
            <NavButton 
              active={activeTab === 'plans'} 
              onClick={() => setActiveTab('plans')} 
              icon={<Briefcase className="size-4" />}
              label="Planos e Assinaturas"
            />
            <NavButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
              icon={<SettingsIcon className="size-4" />}
              label="Configurações Globais"
            />
          </div>
        </div>
      </div>

      {/* Mobile Nav (Tabs) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 flex justify-around">
        <button onClick={() => setActiveTab('command')} className={`p-2 rounded-lg ${activeTab === 'command' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}>
          <Activity className="size-6" />
        </button>
        <button onClick={() => setActiveTab('financial')} className={`p-2 rounded-lg ${activeTab === 'financial' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}>
          <Euro className="size-6" />
        </button>
        <button onClick={() => setActiveTab('roadmap')} className={`p-2 rounded-lg ${activeTab === 'roadmap' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}>
          <Rocket className="size-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto max-h-screen pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'command' && (
            <motion.div 
              key="command"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminCommandCenter />
            </motion.div>
          )}

          {activeTab === 'financial' && (
             <motion.div 
              key="financial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminFinancials />
            </motion.div>
          )}

          {activeTab === 'users' && (
             <motion.div 
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminUsers session={session} />
            </motion.div>
          )}

          {activeTab === 'plans' && (
             <motion.div 
              key="plans"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminPlans session={session} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
             <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminSettings session={session} />
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div 
              key="roadmap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
               {/* Novo componente LaunchRoadmapFast com cronograma acelerado */}
               <LaunchRoadmapFast />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {active ? icon : <div className="opacity-70">{icon}</div>}
      {label}
    </button>
  );
}