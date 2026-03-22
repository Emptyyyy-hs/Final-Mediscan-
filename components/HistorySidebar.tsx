
import React from 'react';
import { Clock, Search, Trash2, Home, Info, Mail, HelpCircle, Database, Star, Pill } from 'lucide-react';
import { SearchHistoryItem, SearchType } from '../types';

interface HistorySidebarProps {
  history: SearchHistoryItem[];
  onSelect: (query: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenHowToUse: () => void;
  onOpenFutureUpdates: () => void;
  onOpenAdmin: () => void;
  onOpenMedicineGuide: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, onSelect, onClear, isOpen, onClose, onOpenAbout, onOpenContact, onOpenHowToUse, onOpenFutureUpdates, onOpenAdmin, onOpenMedicineGuide 
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[60] transition-opacity" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out border-r border-slate-100 dark:border-slate-800/50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 tracking-tight">Menu</h2>
        </div>

        {/* Navigation Links (Mobile mostly) - Increased text size and weight */}
        <div className="p-4 space-y-2 border-b border-slate-100 dark:border-slate-800/50">
            <button 
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg"
            >
              <Home size={22} className="text-teal-500" />
              Home
            </button>
            <button 
              onClick={() => { onOpenHowToUse(); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg"
            >
              <HelpCircle size={22} className="text-amber-500" />
              How to Use
            </button>
            <button 
              onClick={() => { onOpenAbout(); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg"
            >
              <Info size={22} className="text-blue-500" />
              About MediScan
            </button>
            <button 
              onClick={() => { onOpenMedicineGuide(); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg"
            >
              <Pill size={22} className="text-medical-500" />
              Medicine Guide
            </button>
            <button 
              onClick={() => { onOpenContact(); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg"
            >
              <Mail size={22} className="text-purple-500" />
              Contact Us
            </button>
            <button 
              onClick={() => { onOpenFutureUpdates(); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg"
            >
              <Star size={22} className="text-amber-500" />
              Future Updates
            </button>
            <button 
              onClick={() => { onOpenAdmin(); onClose(); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors font-bold text-lg border-t border-slate-100 dark:border-slate-800 mt-2 pt-4"
            >
              <Database size={22} className="text-teal-500" />
              Admin Panel
            </button>
        </div>

        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Scans
            </h3>
            {history.length > 0 && (
              <button 
                onClick={onClear}
                className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center text-slate-400 mt-10 p-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                <p className="text-sm">No recent searches.</p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.query);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 group border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">{item.query}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shrink-0 ${
                      item.type === SearchType.MEDICINE ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 
                      item.type === SearchType.SYMPTOM ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.type === SearchType.MEDICINE ? 'MED' : item.type === SearchType.SYMPTOM ? 'SYM' : '?'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1 relative z-10">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
