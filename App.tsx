
import React, { useState, useEffect, useMemo, Component } from 'react';
import { 
  Search, Mic, Menu, Printer, Info, Database, Activity, ArrowUpLeft,
  Sun, Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchMedicalData, fetchUserHistory, fetchMedicineNames, cleanMedicineName } from './services/geminiService';
import { PRELOADED_DATA } from './services/preloadedData';
import { ScanResult, SearchType, SearchHistoryItem } from './types';
import { MedicineView } from './components/MedicineView';
import { SymptomView } from './components/SymptomView';
import { HistorySidebar } from './components/HistorySidebar';
import { HeroAnimation } from './components/HeroAnimation';
import SplashScreen from './components/SplashScreen';
import CapsuleLoader from './components/CapsuleLoader';
import { AboutModal, ContactModal, HowToUseModal, FutureUpdatesModal } from './components/Modals';
import { FallingMedicines } from './components/FallingMedicines';
import { AdminPanel } from './components/AdminPanel';
import MedicineFormsView from './components/MedicineFormsView';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("App Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-10 text-center">
          <Info className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">The application encountered an unexpected error.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold">Reload Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const getUserId = () => {
  let id = localStorage.getItem('mediscan_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mediscan_user_id', id);
  }
  return id;
};

const StarField = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.7 ? '2px' : '3px',
      opacity: Math.random() * 0.5 + 0.3,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div 
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse shadow-[0_0_2px_#fff]"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
    </div>
  );
});

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(ScanResult & { source?: 'DB' | 'AI' }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userId] = useState(getUserId());
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dbMedicines, setDbMedicines] = useState<string[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isFutureUpdatesOpen, setIsFutureUpdatesOpen] = useState(false);
  const [isMedicineGuideOpen, setIsMedicineGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mediscan_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('mediscan_theme')) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('mediscan_theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    loadHistory();
    loadDbMedicines();
  }, [userId]);

  const loadHistory = async () => {
    const historyData = await fetchUserHistory(userId);
    setHistory(historyData);
  };

  const loadDbMedicines = async () => {
    const names = await fetchMedicineNames();
    setDbMedicines(names);
  };

  const getSuggestions = (text: string) => {
    if (!text.trim()) return [];
    const preloadedKeys = Object.keys(PRELOADED_DATA).map(k => k.charAt(0).toUpperCase() + k.slice(1));
    const remoteKeys = dbMedicines.map(k => {
        const cleaned = cleanMedicineName(k);
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    });
    const commonTerms = ['Fever', 'Headache', 'Cough', 'Stomach Pain', 'Rash', 'Flu', 'Cold'];
    const allTerms = Array.from(new Set([...preloadedKeys, ...remoteKeys, ...commonTerms]));
    return allTerms.filter(term => term.toLowerCase().includes(text.toLowerCase())).slice(0, 5);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSuggestions(getSuggestions(val));
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSearch(undefined, suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setSelectedIndex(-1);
    }
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (overrideQuery || query).trim();
    if (!finalQuery) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsSearchFocused(false);
    if (overrideQuery) setQuery(overrideQuery);

    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 0));
    
    try {
      const data = await fetchMedicalData(finalQuery, { userId });
      const targetDuration = data.source === 'DB' ? 5000 : 10000;
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, targetDuration - elapsedTime);
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      setResult(data);
      if (data.source === 'AI' && data.type === SearchType.MEDICINE && data.medicineDetails?.name) {
         loadDbMedicines();
      }
      loadHistory();
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
      setError(err.message || "Search failed. Please check your connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setSuggestions(getSuggestions(transcript));
        setIsSearchFocused(true);
      };
    } else {
      alert("Voice input not supported.");
    }
  };

  const highlightMatch = (text: string, highlight: string) => {
    if (!text || !highlight.trim()) return text;
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<span class="text-medical-600 dark:text-medical-400 font-bold">$1</span>');
  };

  const isCentered = !result && !loading && !error;

  return (
    <>
    <SplashScreen isVisible={showSplash} onComplete={() => { setShowSplash(false); setTimeout(() => setIsReady(true), 100); }} />
    <AnimatePresence mode="wait">
      {loading && <CapsuleLoader isLoading={loading} />}
    </AnimatePresence>
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 font-sans selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900 dark:selection:text-teal-100">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
         <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px] animate-blob mix-blend-multiply"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-50/50 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply"></div>
         </div>
         <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-0 left-0 w-full h-full bg-[#020617]"></div>
            <StarField />
         </div>
         <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${isCentered && isReady ? 'opacity-100' : 'opacity-0'}`}>
            {isReady && <FallingMedicines />}
         </div>
      </div>
      <div className="no-print">
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        <HowToUseModal isOpen={isHowToUseOpen} onClose={() => setIsHowToUseOpen(false)} />
        <FutureUpdatesModal isOpen={isFutureUpdatesOpen} onClose={() => setIsFutureUpdatesOpen(false)} />
        
        <HistorySidebar 
          history={history} 
          onSelect={(q) => handleSearch(undefined, q)}
          onClear={() => setHistory([])} 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenHowToUse={() => setIsHowToUseOpen(true)}
          onOpenFutureUpdates={() => setIsFutureUpdatesOpen(true)}
          onOpenMedicineGuide={() => setIsMedicineGuideOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </div>

      <header className={`no-print fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-40 transition-all duration-500 rounded-full ${!isCentered ? 'bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-black/40' : 'bg-transparent'}`}>
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsHistoryOpen(true)} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95">
                <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-8 ml-4">
                <button onClick={() => { setResult(null); setError(null); setQuery(''); }} className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Home</button>
                <button onClick={() => setIsHowToUseOpen(true)} className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">How to Use</button>
                <button onClick={() => setIsAboutOpen(true)} className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About</button>
                <button onClick={() => setIsMedicineGuideOpen(true)} className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Medicine</button>
                <button onClick={() => setIsContactOpen(true)} className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Contact</button>
                <button onClick={() => setIsFutureUpdatesOpen(true)} className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Future Updates</button>
            </div>
          </div>
          <div onClick={() => { setResult(null); setError(null); setQuery(''); setSuggestions([]); }} className={`cursor-pointer flex items-center gap-2.5 transition-all duration-500 ${isCentered ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">MS</div>
            <span className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 tracking-tight">MediScan</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className={`flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 z-10 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isCentered ? 'justify-center items-center py-10 min-h-[90vh]' : 'pt-32 pb-10'}`}>
        <div className={`no-print relative w-full h-full flex flex-col items-center justify-center transition-all duration-700 ${isCentered ? 'opacity-100' : 'hidden opacity-0'}`}>
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
                {isReady && <HeroAnimation />}
             </div>
             <div className="text-center mb-10 z-30 flex flex-col items-center pointer-events-none relative">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.2 }} className="text-6xl md:text-8xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none text-shadow-glow">
                  Medi<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">Scan</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5 }} className="text-teal-600/80 dark:text-teal-400 text-lg md:text-xl font-lexend font-medium max-w-xl mx-auto tracking-[0.5em]">
                  KNOW YOUR MEDICINE
                </motion.p>
             </div>
             <div className="w-full max-w-2xl relative z-30">
                <form onSubmit={(e) => handleSearch(e)} className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-[2rem] opacity-20 dark:opacity-50 transition duration-500 blur-lg ${isSearchFocused ? 'opacity-50 dark:opacity-70' : ''}`}></div>
                    <div className="relative bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[1.8rem] shadow-xl flex items-center overflow-visible border border-white/60 dark:border-slate-700/50 transition-all duration-300">
                    <Search className={`w-6 h-6 ml-6 ${isSearchFocused ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-400'}`} />
                    <input type="text" value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => { setIsSearchFocused(true); setSuggestions(getSuggestions(query)); }} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} placeholder="Search medicine or symptom..." className="w-full py-5 px-5 text-xl outline-none text-slate-800 dark:text-white bg-transparent font-medium font-display tracking-tight" autoComplete="off" />
                    <div className="flex items-center pr-3 gap-2">
                        <button type="button" onClick={handleVoiceInput} className="p-3 text-slate-400 hover:text-teal-600 rounded-full transition-all active:scale-95"><Mic className="w-5 h-5" /></button>
                        <button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-70 flex items-center gap-2 m-1.5 shadow-lg active:scale-[0.98]">
                          {loading ? (
                            <>
                              <Activity className="w-4 h-4 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4" />
                              Search
                            </>
                          )}
                        </button>
                    </div>
                    </div>
                    {isSearchFocused && suggestions.length > 0 && (
                        <div className="absolute top-full left-4 right-4 mt-2 bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-slate-800 overflow-hidden z-40 animate-fadeIn">
                            {suggestions.map((suggestion, idx) => (
                                <button key={idx} type="button" onClick={() => handleSearch(undefined, suggestion)} onMouseEnter={() => setSelectedIndex(idx)} className={`w-full text-left px-6 py-3.5 flex items-center gap-3 transition-colors border-b border-slate-100/50 dark:border-slate-700 last:border-0 ${idx === selectedIndex ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100' : 'hover:bg-teal-50/50 dark:hover:bg-teal-900/10 text-slate-600 dark:text-slate-300'}`}>
                                    <div className={`p-1.5 rounded-md ${idx === selectedIndex ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 dark:bg-slate-700'}`}><Search className="w-3.5 h-3.5" /></div>
                                    <span className="font-medium text-lg tracking-tight" dangerouslySetInnerHTML={{ __html: highlightMatch(suggestion, query) }}></span>
                                </button>
                            ))}
                        </div>
                    )}
                </form>
             </div>
          </div>
        </div>
        {!isCentered && (
            <div className="w-full">
                {error ? (
                <div className="no-print glass-panel bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 rounded-[2rem] p-10 text-center text-red-600">
                    <Info className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-display font-bold mb-3 text-slate-800 dark:text-slate-200">Search Failed</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                    <button onClick={() => handleSearch()} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg active:scale-95">Retry</button>
                </div>
                ) : result ? (
                <div className="animate-slideUp max-w-5xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-8 px-4 no-print">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => { setResult(null); setError(null); setQuery(''); }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm group"
                        >
                          <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          Back to Search
                        </button>
                        <span className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${result.source === 'DB' ? 'bg-teal-100/50 text-teal-700 border-teal-200' : 'bg-blue-100/50 text-blue-700 border-blue-200'}`}>
                            {result.source === 'DB' ? <Database className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />} {result.source === 'DB' ? 'Verified' : 'Detailed Info'}
                        </span>
                      </div>
                      <button onClick={() => window.print()} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 text-sm font-bold active:scale-95"><Printer className="w-4 h-4" /> Save Report</button>
                    </div>
                    {result.type === SearchType.MEDICINE && result.medicineDetails && <MedicineView data={result.medicineDetails} />}
                    {result.type === SearchType.SYMPTOM && result.symptomDetails && <SymptomView data={result.symptomDetails} />}
                    {result.type === SearchType.UNKNOWN && (
                      <div className="no-print glass-panel bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 rounded-[2rem] p-10 text-center">
                        <Info className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-display font-bold mb-3 text-slate-800 dark:text-slate-200">No Information Found</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                          {result.summary || "We couldn't find specific medical information for your search. Please try a more specific brand or generic name."}
                        </p>
                        <button onClick={() => { setResult(null); setQuery(''); }} className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold transition-colors shadow-lg active:scale-95">New Search</button>
                      </div>
                    )}
                </div>
                ) : null}
            </div>
        )}
      </main>
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
      <AnimatePresence>
        {isMedicineGuideOpen && (
          <MedicineFormsView onClose={() => setIsMedicineGuideOpen(false)} />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

export default App;
