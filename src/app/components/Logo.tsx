import { motion } from "motion/react";

interface LogoProps {
  size?: "small" | "default" | "large";
  variant?: "dark" | "light"; // dark = text is dark (for light bg), light = text is white
}

export const Logo = ({ size = "default", variant = "dark" }: LogoProps) => {
  const textSize = {
    small: "text-xl",
    default: "text-3xl",
    large: "text-5xl"
  };

  const iconSizes = {
    small: "w-8 h-8",
    default: "w-12 h-12",
    large: "w-20 h-20"
  };

  const ptSize = {
    small: "text-sm",
    default: "text-base",
    large: "text-2xl"
  };

  const textColor = variant === "dark" ? "text-slate-900" : "text-white";
  const subColor = variant === "dark" ? "text-slate-400" : "text-white/50";

  return (
    <div className="flex items-center gap-4 font-sans select-none">
      <motion.div 
        initial="rest"
        whileHover="hover"
        className={`relative flex items-center justify-center ${iconSizes[size]}`}
      >
        {/* Abstract Symbol: The "Coin" becoming a "Pulse" */}
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <motion.path
            d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M15 22L18 25L26 15"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /> {/* Indigo */}
              <stop offset="1" stopColor="#06b6d4" /> {/* Cyan */}
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-50" />
      </motion.div>

      <div className="flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex items-baseline leading-none ${textColor}`}
        >
          <span className={`font-medium tracking-tight ${textSize[size]}`}>Tá</span>
          <span className={`font-extrabold tracking-tighter ml-[1px] ${textSize[size]}`}>Pago</span>
          <span className={`font-light opacity-60 ml-[2px] ${ptSize[size]}`}>.pt</span>
        </motion.div>
      </div>
    </div>
  );
};