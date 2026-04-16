import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export const EtherealBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Suavização do movimento do mouse
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normaliza coordenadas (-1 a 1)
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#F8FAFC]">
      {/* Base Grain Texture for Premium Feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Moving Orbs */}
      <motion.div 
        style={{ x: useTransform(x, [-1, 1], [-20, 20]), y: useTransform(y, [-1, 1], [-20, 20]) }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply"
      />
      
      <motion.div 
        style={{ x: useTransform(x, [-1, 1], [30, -30]), y: useTransform(y, [-1, 1], [20, -20]) }}
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-200/40 rounded-full blur-[120px] mix-blend-multiply"
      />

      <motion.div 
        style={{ x: useTransform(x, [-1, 1], [-40, 40]), y: useTransform(y, [-1, 1], [-10, 10]) }}
        className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-indigo-200/30 rounded-full blur-[100px] mix-blend-multiply"
      />

      {/* Interactive Spotlight Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-white/60 pointer-events-none" />
    </div>
  );
};
