import { motion } from 'motion/react';

// Base Skeleton com animação shimmer
function SkeletonBase({ className = '', width, height }: { className?: string; width?: string; height?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200 rounded ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}

// Skeleton para Cards de Estatísticas
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <SkeletonBase className="rounded-xl" width="48px" height="48px" />
        <SkeletonBase className="rounded-lg" width="60px" height="24px" />
      </div>
      <div className="space-y-2">
        <SkeletonBase className="rounded" width="120px" height="14px" />
        <SkeletonBase className="rounded-lg" width="140px" height="36px" />
      </div>
      <SkeletonBase className="rounded" width="100px" height="12px" />
    </div>
  );
}

// Skeleton para Gráficos
export function ChartSkeleton({ height = '300px' }: { height?: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <SkeletonBase className="rounded-lg" width="200px" height="20px" />
          <SkeletonBase className="rounded" width="150px" height="14px" />
        </div>
        <SkeletonBase className="rounded-xl" width="40px" height="40px" />
      </div>
      <div className="flex items-end justify-between gap-4" style={{ height }}>
        {[...Array(7)].map((_, i) => (
          <SkeletonBase 
            key={i} 
            className="rounded-t-lg flex-1" 
            height={`${Math.random() * 60 + 40}%`} 
          />
        ))}
      </div>
    </div>
  );
}

// Skeleton para Tabela
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonBase key={i} className="rounded" width="100%" height="16px" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-slate-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-5 gap-4 items-center">
              {[...Array(5)].map((_, colIndex) => (
                <SkeletonBase 
                  key={colIndex} 
                  className="rounded" 
                  width={colIndex === 0 ? '80%' : '100%'} 
                  height="14px" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para Lista de Devedores
export function DebtorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
      <div className="flex items-start gap-4">
        <SkeletonBase className="rounded-xl" width="48px" height="48px" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <SkeletonBase className="rounded-lg" width="60%" height="18px" />
              <SkeletonBase className="rounded" width="40%" height="14px" />
            </div>
            <SkeletonBase className="rounded-lg" width="80px" height="24px" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <SkeletonBase className="rounded" width="50%" height="10px" />
                <SkeletonBase className="rounded-lg" width="70%" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para Timeline
export function TimelineSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(items)].map((_, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <SkeletonBase className="rounded-full" width="40px" height="40px" />
            {index < items - 1 && (
              <div className="w-0.5 h-full min-h-[60px] bg-slate-200 mt-2" />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <SkeletonBase className="rounded-lg" width="180px" height="20px" />
                <SkeletonBase className="rounded" width="100px" height="14px" />
              </div>
              <SkeletonBase className="rounded" width="100%" height="14px" />
              <SkeletonBase className="rounded" width="80%" height="14px" />
              <div className="flex gap-2 pt-2">
                <SkeletonBase className="rounded-full" width="60px" height="24px" />
                <SkeletonBase className="rounded-full" width="80px" height="24px" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton para Modal
export function ModalSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2 flex-1">
          <SkeletonBase className="rounded-lg" width="60%" height="28px" />
          <SkeletonBase className="rounded" width="40%" height="16px" />
        </div>
        <SkeletonBase className="rounded-xl" width="40px" height="40px" />
      </div>
      
      <div className="space-y-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBase className="rounded" width="30%" height="14px" />
            <SkeletonBase className="rounded-lg" width="100%" height="48px" />
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 pt-6 border-t border-slate-200">
        <SkeletonBase className="rounded-xl flex-1" height="48px" />
        <SkeletonBase className="rounded-xl" width="120px" height="48px" />
      </div>
    </div>
  );
}

// Skeleton para Dashboard Completo
export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBase className="rounded-lg" width="300px" height="36px" />
          <SkeletonBase className="rounded" width="400px" height="16px" />
        </div>
        <div className="flex gap-3">
          <SkeletonBase className="rounded-xl" width="200px" height="48px" />
          <SkeletonBase className="rounded-xl" width="48px" height="48px" />
          <SkeletonBase className="rounded-xl" width="140px" height="48px" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ChartSkeleton height="250px" />
        </div>
        <ChartSkeleton height="250px" />
      </div>
    </div>
  );
}

// Skeleton para Lista de Cards
export function CardListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <SkeletonBase className="rounded-xl" width="48px" height="48px" />
            <div className="flex gap-2">
              <SkeletonBase className="rounded-full" width="60px" height="24px" />
              <SkeletonBase className="rounded-full" width="60px" height="24px" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonBase className="rounded-lg" width="80%" height="20px" />
            <SkeletonBase className="rounded" width="100%" height="14px" />
            <SkeletonBase className="rounded" width="60%" height="14px" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <SkeletonBase className="rounded" width="80px" height="12px" />
            <SkeletonBase className="rounded-full" width="20px" height="20px" />
          </div>
        </div>
      ))}
    </div>
  );
}
