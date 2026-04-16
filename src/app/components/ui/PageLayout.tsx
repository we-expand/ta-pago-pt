import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import GlassCard, { GlassHeaderCard } from './GlassCard';
import { motion } from 'motion/react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon?: LucideIcon;
  headerActions?: ReactNode;
  maxWidth?: '7xl' | 'full' | '6xl' | '5xl';
}

/**
 * Layout padrão para todas as páginas da aplicação
 * Baseado no design do Dashboard com:
 * - Padding: p-8
 * - Spacing entre blocos: space-y-6
 * - Background gradient consistente
 * - Header glassmorphic padronizado
 * - Max width responsivo
 */
export function PageLayout({ 
  children, 
  title, 
  description, 
  icon: Icon,
  headerActions,
  maxWidth = '7xl'
}: PageLayoutProps) {
  const maxWidthClasses = {
    '7xl': 'max-w-[1800px]',
    '6xl': 'max-w-7xl',
    '5xl': 'max-w-5xl',
    'full': 'max-w-full'
  };

  return (
    <div className="p-8 space-y-6 mx-auto bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 min-h-screen">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto space-y-6`}>
        {/* Header Glassmorphic - Padrão */}
        <GlassHeaderCard color="purple">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="size-16 rounded-2xl bg-white/30 backdrop-blur-xl flex items-center justify-center border-2 border-white/40">
                  <Icon className="size-8 text-purple-600" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{title}</h1>
                {description && (
                  <p className="text-slate-700">{description}</p>
                )}
              </div>
            </div>
            
            {headerActions && (
              <div className="flex items-center gap-3">
                {headerActions}
              </div>
            )}
          </div>
        </GlassHeaderCard>

        {/* Conteúdo */}
        {children}
      </div>
    </div>
  );
}

/**
 * Container padrão para seções de conteúdo
 * Usa GlassCard com padding consistente
 */
export function PageSection({ 
  children, 
  className = '' 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlassCard className={`p-6 ${className}`}>
      {children}
    </GlassCard>
  );
}

/**
 * Grid padrão para cards de estatísticas
 * Responsivo: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
 */
export function StatsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

/**
 * Grid padrão para gráficos
 * Responsivo: 1 col (mobile) → 2 cols (desktop)
 */
export function ChartsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

/**
 * Header de seção com título e ações
 */
export function SectionHeader({ 
  title, 
  description,
  actions 
}: { 
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * Container para tabelas
 */
export function TableContainer({ children }: { children: ReactNode }) {
  return (
    <GlassCard className="p-6">
      <div className="overflow-x-auto">
        {children}
      </div>
    </GlassCard>
  );
}

/**
 * Container para formulários
 */
export function FormContainer({ children }: { children: ReactNode }) {
  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {children}
      </div>
    </GlassCard>
  );
}

/**
 * Grid de 2 colunas para formulários
 */
export function FormGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

/**
 * Empty State padrão
 */
export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <GlassCard className="p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6">
          <Icon className="size-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6 max-w-md">{description}</p>
        {action}
      </div>
    </GlassCard>
  );
}
