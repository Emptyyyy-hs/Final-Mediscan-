import React, { useState, useEffect } from 'react';
import { 
  Database, Edit, Save, X, Search, Image as ImageIcon, 
  AlertCircle, CheckCircle, ArrowLeft, Trash2
} from 'lucide-react';
import { getAllMedicines, updateMedicine, supabase } from '../services/supabase';
import { MedicineDetails } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMed, setEditingMed] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<MedicineDetails | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    const data = await getAllMedicines();
    setMedicines(data);
    setLoading(false);
  };

  const handleEdit = (med: any) => {
    const data = med.data || {};
    setEditingMed(med);
    setEditForm({
      ...data,
      name: med.name || data.name || '',
      uses: data.uses || [],
      dosage: data.dosage || { adults: '', children: '', instructions: '' },
      sideEffects: data.sideEffects || { common: [], serious: [], rare: [] },
      precautions: data.precautions || [],
      interactions: data.interactions || [],
      imageUrls: data.imageUrls || (data.imageUrl ? [data.imageUrl] : []),
      alternatives: data.alternatives || { generic: [], branded: [] }
    });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!editingMed || !editForm) return;
    setSaving(true);
    try {
      await updateMedicine(editingMed.id, editForm);
      setMessage({ type: 'success', text: 'Medicine updated successfully!' });
      fetchMedicines();
      setTimeout(() => setEditingMed(null), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update medicine.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this medicine from the database?')) return;
    
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to delete medicine.' });
    } else {
      setMessage({ type: 'success', text: 'Medicine deleted.' });
      fetchMedicines();
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.data?.classification && m.data.classification.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex flex-col animate-fadeIn">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Database Manager</h1>
          </div>
        </div>
        <div className="relative w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search database..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Loading medicine database...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20">
            <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No medicines found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((med) => (
              <div 
                key={med.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {med.data?.imageUrls?.[0] ? (
                    <img 
                      src={med.data.imageUrls[0]} 
                      alt={med.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(med)}
                      className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg shadow-lg text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(med.id)}
                      className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg shadow-lg text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{med.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
                    {med.data?.classification || 'No classification'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold uppercase text-slate-500">
                      ID: {med.id}
                    </span>
                    <span className="px-2 py-1 bg-teal-50 dark:bg-teal-900/20 rounded text-[10px] font-bold uppercase text-teal-600">
                      {med.data?.form || 'Medicine'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMed && editForm && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Medicine Details</h2>
              <button onClick={() => setEditingMed(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Brand Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Classification</label>
                    <input 
                      type="text" 
                      value={editForm.classification}
                      onChange={(e) => setEditForm({ ...editForm, classification: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Form (e.g. Tablet)</label>
                    <input 
                      type="text" 
                      value={editForm.form || ''}
                      onChange={(e) => setEditForm({ ...editForm, form: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Image URLs (One per line)</label>
                    <textarea 
                      rows={4}
                      value={editForm.imageUrls?.join('\n') || ''}
                      onChange={(e) => {
                        const urls = e.target.value.split('\n').filter(u => u.trim());
                        setEditForm({ ...editForm, imageUrls: urls });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-mono text-xs"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Right Column: Medical Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Uses (One per line)</label>
                    <textarea 
                      rows={3}
                      value={editForm.uses?.join('\n') || ''}
                      onChange={(e) => setEditForm({ ...editForm, uses: e.target.value.split('\n') })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Adult Dosage</label>
                    <input 
                      type="text" 
                      value={editForm.dosage?.adults || ''}
                      onChange={(e) => setEditForm({ ...editForm, dosage: { ...editForm.dosage, adults: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Children Dosage</label>
                    <input 
                      type="text" 
                      value={editForm.dosage?.children || ''}
                      onChange={(e) => setEditForm({ ...editForm, dosage: { ...editForm.dosage, children: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Dosage Instructions</label>
                    <textarea 
                      rows={2}
                      value={editForm.dosage?.instructions || ''}
                      onChange={(e) => setEditForm({ ...editForm, dosage: { ...editForm.dosage, instructions: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Common Side Effects (One per line)</label>
                    <textarea 
                      rows={3}
                      value={editForm.sideEffects?.common?.join('\n') || ''}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        sideEffects: { ...editForm.sideEffects, common: e.target.value.split('\n') } 
                      })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Precautions (One per line)</label>
                    <textarea 
                      rows={3}
                      value={editForm.precautions?.join('\n') || ''}
                      onChange={(e) => setEditForm({ ...editForm, precautions: e.target.value.split('\n') })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Interactions (One per line)</label>
                    <textarea 
                      rows={3}
                      value={editForm.interactions?.join('\n') || ''}
                      onChange={(e) => setEditForm({ ...editForm, interactions: e.target.value.split('\n') })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-4">
              <button 
                onClick={() => setEditingMed(null)}
                className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-10 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
