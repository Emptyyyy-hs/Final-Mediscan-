import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Droplets, 
  Syringe, 
  Stethoscope, 
  Info, 
  Search, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Layers, 
  Palette, 
  Shapes, 
  Activity,
  ImageOff
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { MedicineForm, MedicineAttribute } from '../types';

interface MedicineFormsViewProps {
  onClose: () => void;
}

const MedicineFormsView: React.FC<MedicineFormsViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'forms' | 'attributes'>('forms');
  const [forms, setForms] = useState<MedicineForm[]>([]);
  const [attributes, setAttributes] = useState<MedicineAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MedicineForm | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: formsData, error: formsError } = await supabase
        .from('medicine_forms')
        .select('*')
        .order('name');
      
      const { data: attrData, error: attrError } = await supabase
        .from('medicine_attributes')
        .select('*')
        .order('category');

      if (formsError) console.error('Error fetching forms:', formsError);
      if (attrError) console.error('Error fetching attributes:', attrError);

      if (formsData) setForms(formsData);
      if (attrData) setAttributes(attrData);
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAttributes = attributes.filter(a => 
    a.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-medical-500 hover:text-white transition-all font-bold text-sm group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="hidden sm:flex items-center gap-4 ml-2">
            <div className="p-3 bg-medical-500 text-white rounded-2xl shadow-lg shadow-medical-500/20">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">Medicine Guide</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Forms & Attributes Encyclopedia</p>
            </div>
          </div>
        </div>
        <div className="sm:hidden">
           <Pill className="w-6 h-6 text-medical-500" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('forms')}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'forms' 
            ? 'bg-medical-500 text-white shadow-lg shadow-medical-500/20' 
            : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Medicine Forms
        </button>
        <button 
          onClick={() => setActiveTab('attributes')}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'attributes' 
            ? 'bg-medical-500 text-white shadow-lg shadow-medical-500/20' 
            : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Shapes className="w-4 h-4" />
          Color & Shape Meanings
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-medical-500 transition-colors" />
          <input 
            type="text"
            placeholder={`Search ${activeTab === 'forms' ? 'medicine forms' : 'attributes'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="relative">
              <Pill className="w-10 h-10 text-medical-500 animate-pulse" />
              <div className="absolute inset-0 bg-medical-500/20 blur-xl rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {activeTab === 'forms' ? (
                filteredForms.length > 0 ? (
                  filteredForms.map((form) => (
                    <motion.div
                      layout
                      key={form.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedItem(form)}
                      className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-medical-500/50 hover:shadow-2xl hover:shadow-medical-500/10 transition-all cursor-pointer"
                    >
                      <div className="aspect-video relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                        {form.image_url ? (
                          <img 
                            src={form.image_url} 
                            alt={form.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageOff className="w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            View Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-2">{form.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                          {form.description}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No forms found matching your search</p>
                  </div>
                )
              ) : (
                // Attributes View
                ['color', 'shape', 'form'].map((cat) => {
                  const catItems = filteredAttributes.filter(a => a.category === cat);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat} className="col-span-full space-y-6 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                          {cat === 'color' ? <Palette className="w-5 h-5" /> : cat === 'shape' ? <Shapes className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                        </div>
                        <h2 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-widest">
                          {cat === 'color' ? 'Color Meanings' : cat === 'shape' ? 'Shape Meanings' : 'Medicine Types'}
                        </h2>
                      </div>
                      
                      {/* Simple Quick Guide for the first category */}
                      {cat === 'color' && (
                        <div className="col-span-full p-6 bg-teal-500/10 border border-teal-500/20 rounded-3xl mb-4">
                          <h4 className="text-teal-600 dark:text-teal-400 font-bold mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Quick Tip
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            Medicine colors and shapes aren't just for looks—they help doctors and patients tell them apart quickly. Always check the name on the box, even if the color looks familiar!
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catItems.map((attr) => (
                          <div 
                            key={attr.id}
                            className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-medical-500/30 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-4 h-4 rounded-full ${
                                attr.value.toLowerCase().includes('red') ? 'bg-red-500' :
                                attr.value.toLowerCase().includes('blue') ? 'bg-blue-500' :
                                attr.value.toLowerCase().includes('yellow') ? 'bg-yellow-500' :
                                attr.value.toLowerCase().includes('green') ? 'bg-green-500' :
                                'bg-medical-500'
                              }`}></div>
                              <span className="font-black text-slate-900 dark:text-white text-xl tracking-tight">{attr.value}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed">
                              {attr.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="aspect-video relative bg-slate-100 dark:bg-slate-950">
                {selectedItem.image_url ? (
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageOff className="w-16 h-16" />
                  </div>
                )}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-2xl backdrop-blur-md hover:bg-black/70 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-medical-200 dark:border-medical-800">
                    Medicine Form
                  </div>
                </div>
                <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-4">{selectedItem.name}</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                    <Info className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    This information is for educational purposes. Always consult with a healthcare professional regarding specific medication forms and their administration.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MedicineFormsView;
