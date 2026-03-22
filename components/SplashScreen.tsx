
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Extended timer to allow the 2-second cinematic animations to complete
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="cinematic-splash"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col justify-center items-center overflow-hidden"
        >
          {/* Background Grid */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Cinematic Heartbeat Graph Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <svg viewBox="0 0 1000 200" className="w-full h-64 stroke-emerald-500 stroke-2 fill-none">
               <motion.path
                 d="M0,100 L50,100 L60,100 L70,100 L80,90 L90,110 L100,100 L120,100 L130,50 L140,150 L160,100 L200,100 L220,100 L230,90 L240,110 L250,100 L270,100 L280,50 L290,150 L310,100 L1000,100"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 4, ease: "linear", repeat: Infinity }}
               />
            </svg>
          </div>

          {/* Staggered Branding Sequence */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center">
             
             {/* Main: "MEDISCAN" (Starts at 0.5s) */}
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter text-shadow-glow flex items-center gap-1"
             >
                MEDI<span className="text-emerald-500">SCAN</span>
             </motion.h1>

             {/* Glow Underline */}
             <motion.div 
               className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mt-6 mb-8 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: "80%", opacity: 1 }}
               transition={{ duration: 1.5, delay: 0.8 }}
             />

             {/* Bottom: "KNOW YOUR MEDICINE" (Starts at 1.2s) */}
             <motion.p 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
               className="text-emerald-400 font-lexend text-sm md:text-base tracking-[0.6em] font-extrabold uppercase italic opacity-80"
             >
                KNOW YOUR MEDICINE
             </motion.p>
          </div>

          {/* Floating System Status */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.0 }}
            className="absolute bottom-32 flex flex-col items-center gap-2"
          >
             <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
             </div>
             <span className="text-[10px] font-mono text-emerald-500 tracking-widest uppercase">Initializing Core System</span>
          </motion.div>

          {/* Disclaimer Section */}
          <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-t border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-500 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500">Disclaimer</span>
            </div>
            <p className="text-slate-300 text-[10px] md:text-xs font-medium text-center leading-relaxed max-w-2xl opacity-80">
                 DO NOT RELY SOLELY ON THIS RESULT. ALWAYS CONSULT A PROFESSIONAL MEDICAL PRACTITIONER.
            </p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SplashScreen;
