import { motion, HTMLMotionProps } from 'motion/react';
import { useState, ReactNode, MouseEvent } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface InteractiveButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  loading?: boolean;
}

export default function InteractiveButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  ripple = true,
  loading = false,
  className = '',
  onClick,
  disabled,
  ...props
}: InteractiveButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, id: Date.now() };
      setRipples([...ripples, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl border-transparent',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md hover:shadow-lg border-transparent',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg border-transparent',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md hover:shadow-lg border-transparent',
    ghost: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
    outline: 'bg-transparent text-purple-600 border-purple-300 hover:bg-purple-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const iconSizes = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
    xl: 'size-6'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02, y: disabled || loading ? 0 : -2 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center
        font-semibold rounded-xl
        border-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {/* Ripple Effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute size-20 rounded-full bg-white pointer-events-none"
          style={{
            left: ripple.x - 40,
            top: ripple.y - 40,
          }}
        />
      ))}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`border-2 border-current border-t-transparent rounded-full ${
              size === 'sm' ? 'size-3.5' : size === 'md' ? 'size-4' : size === 'lg' ? 'size-5' : 'size-6'
            }`}
          />
        </div>
      )}

      {/* Content */}
      <span className={`flex items-center ${sizes[size]} ${loading ? 'invisible' : 'visible'}`}>
        {icon && iconPosition === 'left' && (
          <span className={iconSizes[size]}>{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className={iconSizes[size]}>{icon}</span>
        )}
      </span>
    </motion.button>
  );
}
