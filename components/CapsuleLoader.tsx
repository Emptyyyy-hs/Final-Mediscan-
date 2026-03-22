
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// Add AnimatePresence to the framer-motion imports
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity, Database, ShieldCheck, Microscope } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CapsuleLoaderProps {
  isLoading?: boolean;
}

const CapsuleLoader: React.FC<CapsuleLoaderProps> = ({ isLoading = true }) => {
  const [statusIndex, setStatusIndex] = useState(0);
  
  const statusMessages = [
    { text: "PREPARING SEARCH...", icon: <Activity className="w-4 h-4" /> },
    { text: "SEARCHING MEDICAL DATABASE...", icon: <Database className="w-4 h-4" /> },
    { text: "CHECKING MEDICINE DETAILS...", icon: <Microscope className="w-4 h-4" /> },
    { text: "VERIFYING SAFETY INFORMATION...", icon: <ShieldCheck className="w-4 h-4" /> },
    { text: "PREPARING YOUR REPORT...", icon: <Activity className="w-4 h-4" /> }
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Animated Grid */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
        animate={{ backgroundPosition: ['0px 0px', '0px 40px'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center">
        {/* Glow Sphere */}
        <div className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />

        {/* Cinematic Capsule Animation */}
        <div className="w-80 h-80 relative z-20 flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/aaabb306-92ba-4a0c-8e33-944f8ec60baa/IlMPSuTQIe.lottie"
            loop
            autoplay
            className="w-full h-full"
          />
          {/* Fallback Spinner in case Lottie fails to load */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-50">
            <Activity className="w-16 h-16 text-emerald-500 animate-spin" />
          </div>
        </div>

        <div className="mt-8 text-center relative z-20 px-6">
          <motion.h2 
            key="title"
            className="text-3xl font-display font-black text-white tracking-widest text-shadow-glow"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            RETRIEVING DATA
          </motion.h2>
          
          <div className="mt-6 flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={statusIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-[0.2em] font-bold"
                >
                  {statusMessages[statusIndex].icon}
                  {statusMessages[statusIndex].text}
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicator Bar */}
              <div className="flex gap-1.5 h-1.5 w-48 bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/30">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                  />
              </div>
          </div>
        </div>
      </div>

      {/* Security Disclaimer Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-t border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-500 shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="text-sm font-bold tracking-widest uppercase text-amber-500">Medical Guard</span>
        </div>
        <p className="text-slate-300 text-xs md:text-sm font-medium text-center leading-relaxed max-w-3xl">
             KNOWLEDGE BASE ONLY. <span className="text-white font-bold">CONSULT A LICENSED PHYSICIAN FOR CLINICAL DECISIONS.</span>
        </p>
      </div>

    </motion.div>,
    document.body
  );
};

export default CapsuleLoader;