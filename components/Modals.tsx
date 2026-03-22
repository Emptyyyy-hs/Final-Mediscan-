import React from 'react';
import { X, Mail, Github, BookOpen, CheckCircle2, Mic, Search, AlertCircle, Camera, Stethoscope, User, Pill, Accessibility, Users, Bell, Star } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureUpdatesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 dark:bg-slate-900/95 rounded-[2rem] w-full max-w-2xl p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-50">
          <X className="w-6 h-6 text-slate-500" />
        </button>
        
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Star className="w-8 h-8 text-amber-500" />
          Upcoming Features
        </h2>

        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Camera className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Scan Features</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Advanced scanning capabilities for medicine packaging and prescriptions.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Healthcare Integration</h3>
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>• Find nearby doctors based on symptoms</li>
                        <li>• Book appointments directly</li>
                        <li>• Emergency contact suggestions</li>
                    </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">User Account & Tracking</h3>
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>• Personal health dashboard</li>
                        <li>• Symptom history tracking</li>
                        <li>• Pattern insights (e.g., frequent headaches)</li>
                    </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                            <Pill className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Medicine & Treatment</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">In-depth treatment information and personalized medicine reminders.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Accessibility className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Accessibility</h3>
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>• Voice input for symptoms</li>
                        <li>• Text-to-speech output</li>
                        <li>• Multilingual support</li>
                    </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Family Profiles</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manage health profiles for your entire family in one place.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Alerts & Insights</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Smart notifications and health insights based on your activity.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg">
                            <Camera className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Scan via Camera</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Real-time camera scanning to identify medicines instantly.</p>
                </div>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg active:scale-95"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 dark:bg-slate-900/95 rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">About MediScan</h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            MediScan is a simple tool designed to help you understand your medicines better by providing clear information from verified sources.
          </p>
          <p>
            We provide instant breakdowns of medicines, including their uses, side effects, and safety warnings, helping you stay informed about your health.
          </p>
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
             <h3 className="font-bold text-teal-700 dark:text-teal-400 mb-1">Our Mission</h3>
             <p className="text-sm text-teal-800 dark:text-teal-300">To make medical information easy to find and understand for everyone.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 dark:bg-slate-900/95 rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-6">Contact Us</h2>
        
        <div className="grid gap-4">
           <a href="mailto:support@mediscan.app" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                 <Mail className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                 <div className="font-bold text-slate-800 dark:text-white">Email Support</div>
                 <div className="text-sm text-slate-500 dark:text-slate-400">support@mediscan.app</div>
              </div>
           </a>
           
           <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                 <Github className="w-6 h-6 text-slate-700 dark:text-white" />
              </div>
              <div>
                 <div className="font-bold text-slate-800 dark:text-white">GitHub</div>
                 <div className="text-sm text-slate-500 dark:text-slate-400">Contribute to the project</div>
              </div>
           </a>
        </div>
      </div>
    </div>
  );
};

export const HowToUseModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 dark:bg-slate-900/95 rounded-[2rem] w-full max-w-2xl p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-50">
          <X className="w-6 h-6 text-slate-500" />
        </button>
        
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <BookOpen className="w-8 h-8 text-teal-500" />
          How to Use MediScan
        </h2>

        <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 text-lg md:text-xl shadow-sm">1</div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                        Search for a Medicine
                        <Search className="w-4 h-4 text-slate-400" />
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                        Type the name of any medicine in the search bar. You can use brand names (like <strong>"Crocin"</strong>) or generic names (like <strong>"Paracetamol"</strong>).
                    </p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0 font-bold text-teal-600 text-lg md:text-xl shadow-sm">2</div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                        View Medicine Details
                        <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                        Instantly see important information like what the medicine is used for, the correct dosage, and common side effects.
                    </p>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 font-bold text-purple-600 text-lg md:text-xl shadow-sm">3</div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                        Identify the Packaging
                        <Search className="w-4 h-4 text-slate-400" />
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                        Look at the images to identify the medicine. The app shows visuals for tablets, strips, syrups, and bottles to help you recognize the correct product.
                    </p>
                </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 font-bold text-orange-600 text-lg md:text-xl shadow-sm">4</div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                        Check Your History
                        <BookOpen className="w-4 h-4 text-slate-400" />
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                        Your previous searches are saved automatically. You can quickly go back and check information for any medicine you've searched for before.
                    </p>
                </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 text-lg md:text-xl shadow-sm">5</div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                        Safety First
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                        Always read the physical label on your medicine and consult a doctor or pharmacist before taking any medication.
                    </p>
                </div>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg active:scale-95"
            >
                Got it
            </button>
        </div>
      </div>
    </div>
  );
};
