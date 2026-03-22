
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Syringe, 
  Pipette, 
  FlaskConical, 
  Stethoscope, 
  Activity, 
  Thermometer, 
  Bandage, 
  BriefcaseMedical, 
  TestTube, 
  FlaskRound, 
  Microscope, 
  Dna, 
  Atom, 
  ShieldPlus, 
  HeartPulse, 
  ClipboardPlus, 
  Pill, 
  Tablet, 
  Plus,
  Circle,
  Grid3X3,
  Wind
} from 'lucide-react';

const iconMap: Record<string, any> = {
  syringe: Syringe,
  dropper: Pipette,
  bottle: FlaskConical,
  steth: Stethoscope,
  heartbeat: Activity,
  thermo: Thermometer,
  bandage: Bandage,
  kit: BriefcaseMedical,
  tube: TestTube,
  ampoule: FlaskRound,
  micro: Microscope,
  dna: Dna,
  molecule: Atom,
  shield: ShieldPlus,
  pulse: HeartPulse,
  clipboard: ClipboardPlus,
  pill: Pill,
  tablet: Tablet,
  blister: Grid3X3,
  inhaler: Wind,
  dish: Circle,
  plus: Plus,
};

const colors = [
  'text-emerald-500/10 dark:text-emerald-400/5',
  'text-blue-500/10 dark:text-blue-400/5',
  'text-teal-500/10 dark:text-teal-400/5',
  'text-rose-500/5 dark:text-rose-400/5',
  'text-indigo-500/10 dark:text-indigo-400/5',
  'text-amber-500/5 dark:text-amber-400/5',
  'text-purple-500/5 dark:text-purple-400/5'
];

export const FallingMedicines: React.FC = () => {
  const items = useMemo(() => {
    const types = Object.keys(iconMap);
    const count = 20; // Increased count for more variety with the new icons
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 10,
      duration: 20 + Math.random() * 20,
      scale: 0.5 + Math.random() * 0.7,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {items.map((item) => {
        const IconComponent = iconMap[item.type];
        return (
          <motion.div
            key={item.id}
            className="absolute -top-40"
            style={{ 
              left: `${item.x}%`,
              willChange: 'transform',
            }}
            initial={{ transform: `translate3d(0, -100px, 0) rotate(${item.rotation}deg)`, opacity: 0 }}
            animate={{ 
              transform: `translate3d(0, 120vh, 0) rotate(${item.rotation + 360}deg)`,
              opacity: [0, 0.15, 0.15, 0] 
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear",
            }}
          >
            <div style={{ transform: `scale(${item.scale})` }}>
              <IconComponent className={`w-12 h-12 ${item.color} stroke-[1.2]`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
