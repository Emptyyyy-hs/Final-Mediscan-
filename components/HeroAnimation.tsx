
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Shield, ClipboardList, HeartPulse, Activity, Zap, Search, Stethoscope, Pill, Thermometer } from 'lucide-react';

export const HeroAnimation: React.FC = () => {
  // Keplerian Speeds: Time = Base * sqrt(Radius / BaseRadius)
  
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible pointer-events-none">
      
      {/* --- ENHANCED SOLID ORBITAL SYSTEM (RINGS REMOVED) --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
          
          {/* ORBIT 7: THE KUIPER BELT (2400px) */}
          <motion.div 
            className="w-[2000px] h-[2000px] md:w-[2400px] md:h-[2400px] rounded-full absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 450, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
              {[0, 90, 180, 270].map((angle) => (
                <div 
                  key={angle}
                  className="absolute"
                  style={{ 
                    top: '50%', 
                    left: '50%', 
                    transform: `rotate(${angle}deg) translateY(-1200px)` 
                  }}
                >
                  <Plus size={14} className="text-slate-400 dark:text-slate-500 opacity-30 dark:opacity-40" />
                </div>
              ))}
          </motion.div>

          {/* ORBIT 6: DISTANT RADIUS (1800px) */}
          <motion.div 
            className="w-[1500px] h-[1500px] md:w-[1800px] md:h-[1800px] rounded-full absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 320, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800 p-2 rounded-full shadow-sm dark:shadow-md border border-slate-200 dark:border-slate-600">
                  <Stethoscope size={16} className="text-slate-500 dark:text-slate-400" />
              </div>
          </motion.div>

          {/* ORBIT 5: OUTER MID (1300px) */}
          <motion.div 
            className="w-[1100px] h-[1100px] md:w-[1300px] md:h-[1300px] rounded-full absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
              <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-white/90 dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-800/50">
                  <Activity size={16} className="text-indigo-400 dark:text-indigo-400" />
              </div>
          </motion.div>

          {/* ORBIT 4: THE KNOWLEDGE BELT (900px) */}
          <motion.div 
            className="w-[750px] h-[750px] md:w-[900px] md:h-[900px] rounded-full absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-800 p-2.5 rounded-xl shadow-md border border-blue-200 dark:border-blue-900/50">
                  <ClipboardList size={18} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white/90 dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                  <Search size={14} className="text-slate-400" />
              </div>
          </motion.div>

          {/* ORBIT 3: THE MAIN HABITABLE ZONE (600px) */}
          <motion.div 
            className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
              {/* Shield Satellite */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md border border-teal-200 dark:border-teal-500">
                  <Shield size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-yellow-200 dark:border-yellow-700">
                  <Zap size={12} className="text-yellow-500" />
              </div>
          </motion.div>

          {/* ORBIT 2: THE SYNERGY RADIUS (350px) */}
          <motion.div 
            className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
               <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-emerald-200 dark:border-emerald-500">
                  <Plus size={14} className="text-emerald-500 dark:text-emerald-500 font-bold" />
              </div>
          </motion.div>

          {/* ORBIT 1: CORE VITALITY (180px) */}
          <motion.div 
            className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm border border-blue-200 dark:border-blue-500">
                  <HeartPulse size={12} className="text-blue-500 dark:text-blue-500" />
              </div>
          </motion.div>

          {/* CENTER: CORE ENERGY PULSE */}
          <motion.div 
            className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full bg-teal-300/30 dark:bg-teal-300/60 absolute blur-2xl"
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
      </div>

      {/* --- CENTRAL ATMOSPHERE GLOW --- */}
      <div className="relative z-0">
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-100/20 dark:bg-teal-400/10 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
      </div>
    </div>
  );
};
