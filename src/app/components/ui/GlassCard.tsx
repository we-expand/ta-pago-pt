import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';

type GlassVariant = 'default' | 'strong' | 'subtle' | 'colored';
type GlassColor = 'purple' | 'blue' | 'green' | 'pink' | 'slate';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: GlassVariant;
  color?: GlassColor;
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GlassCard({
  children,
  variant = 'default',
  color = 'purple',
  hover = true,
  blur = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/70 backdrop-blur-md border-white/20',
    strong: 'bg-white/80 backdrop-blur-lg border-white/30',
    subtle: 'bg-white/50 backdrop-blur-sm border-white/10',
    colored: getColoredVariant(color)
  };

  const blurLevels = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  function getColoredVariant(color: GlassColor) {
    const colors = {
      purple: 'bg-gradient-to-br from-purple-500/10 via-white/70 to-pink-500/10 backdrop-blur-md border-purple-200/30',
      blue: 'bg-gradient-to-br from-blue-500/10 via-white/70 to-cyan-500/10 backdrop-blur-md border-blue-200/30',
      green: 'bg-gradient-to-br from-green-500/10 via-white/70 to-emerald-500/10 backdrop-blur-md border-green-200/30',
      pink: 'bg-gradient-to-br from-pink-500/10 via-white/70 to-rose-500/10 backdrop-blur-md border-pink-200/30',
      slate: 'bg-gradient-to-br from-slate-500/10 via-white/70 to-slate-600/10 backdrop-blur-md border-slate-200/30'
    };
    return colors[color];
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={`
        rounded-2xl border-2
        ${variant === 'colored' ? variants.colored : variants[variant]}
        ${variant !== 'colored' ? blurLevels[blur] : ''}
        shadow-xl
        ${hover ? 'hover:shadow-2xl' : ''}
        transition-shadow duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Variantes específicas para uso comum
export function GlassStatsCard({ 
  children, 
  className = '', 
  ...props 
}: Omit<GlassCardProps, 'variant'>) {
  return (
    <GlassCard variant="strong" className={`p-6 ${className}`} {...props}>
      {children}
    </GlassCard>
  );
}

export function GlassChartCard({ 
  children, 
  className = '', 
  ...props 
}: Omit<GlassCardProps, 'variant'>) {
  return (
    <GlassCard variant="default" blur="lg" className={`p-6 ${className}`} {...props}>
      {children}
    </GlassCard>
  );
}

export function GlassHeaderCard({ 
  children, 
  className = '', 
  color = 'purple',
  ...props 
}: Omit<GlassCardProps, 'variant'>) {
  return (
    <GlassCard 
      variant="colored" 
      color={color} 
      blur="xl" 
      hover={false} 
      className={`p-8 ${className}`} 
      {...props}
    >
      {children}
    </GlassCard>
  );
}
