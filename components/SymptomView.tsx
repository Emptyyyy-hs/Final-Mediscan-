import React from 'react';
import { SymptomDetails } from '../types';
import { 
  Stethoscope, 
  Activity, 
  Home, 
  AlertCircle,
  Pill,
  CheckCircle2,
  HeartPulse,
  Info
} from 'lucide-react';

interface SymptomViewProps {
  data: SymptomDetails;
}

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`glass-panel bg-white/80 dark:bg-slate-950/80 rounded-3xl p-6 shadow-sm border border-white/60 dark:border-slate-800/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const SymptomView: React.FC<SymptomViewProps> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 dark:from-teal-700 dark:to-emerald-800"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transform group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3 opacity-90">
                <span className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <HeartPulse className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold uppercase tracking-widest font-display">Symptom Information</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4 leading-tight">{data.name}</h1>
            <p className="text-teal-50 max-w-2xl text-lg font-medium opacity-90 leading-relaxed">
                Comprehensive breakdown of causes, home treatments, and medical advice.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Possible Causes */}
        <Card>
           <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
             <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                <Stethoscope className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">Possible Causes</h2>
           </div>
           <ul className="space-y-3">
             {(data.possibleCauses || []).map((cause, idx) => (
               <li key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                 <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-bold shadow-sm">
                   {idx + 1}
                 </span>
                 <span className="text-slate-700 dark:text-slate-200 font-semibold">{cause}</span>
               </li>
             ))}
           </ul>
        </Card>

        {/* When to see a doctor */}
        <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-100/50 dark:border-red-900/30">
           <div className="flex items-center gap-3 mb-6 border-b border-red-200/50 dark:border-red-900/30 pb-4">
             <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                <AlertCircle className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-display font-bold text-red-900 dark:text-red-200">Doctor Consultation</h2>
           </div>
           <div className="space-y-3">
             {(data.whenToSeeDoctor || []).map((item, idx) => (
               <div key={idx} className="flex items-start gap-3 bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm">
                 <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
                 <span className="text-red-900 dark:text-red-200 font-medium leading-snug">{item}</span>
               </div>
             ))}
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safe Medicines */}
        <Card className="bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900">
           <div className="flex items-center gap-3 mb-5 border-b border-blue-100/50 dark:border-blue-900/30 pb-4">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                 <Pill className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">OTC Medicines</h2>
           </div>
           <div className="flex flex-wrap gap-2.5">
             {(data.safeMedicines || []).map((med, idx) => (
               <span key={idx} className="px-4 py-2 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-shadow cursor-default">
                 {med}
               </span>
             ))}
           </div>
           <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg">
             <Info className="w-4 h-4 flex-shrink-0" />
             <p className="font-medium italic">
                Always verify labels. These are general over-the-counter suggestions.
             </p>
           </div>
        </Card>

        {/* Home Remedies */}
        <Card className="bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-slate-900">
           <div className="flex items-center gap-3 mb-5 border-b border-green-100/50 dark:border-green-900/30 pb-4">
             <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                 <Home className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">Home Remedies</h2>
           </div>
           <ul className="grid grid-cols-1 gap-3">
             {(data.homeRemedies || []).map((remedy, idx) => (
               <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-green-100/50 dark:border-green-900/30">
                 <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                 </div>
                 {remedy}
               </li>
             ))}
           </ul>
        </Card>
      </div>
    </div>
  );
};