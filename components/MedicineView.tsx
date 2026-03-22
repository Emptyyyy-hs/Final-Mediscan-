import React, { useState, useEffect, useRef } from 'react';
import { MedicineDetails } from '../types';
import { 
  Clock, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  Ban,
  Baby,
  User,
  ThermometerSun,
  Leaf,
  Utensils,
  Timer,
  Siren,
  Zap,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Search,
  Info
} from 'lucide-react';

interface MedicineViewProps {
  data: MedicineDetails;
}

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`glass-panel bg-white/70 dark:bg-slate-950/80 rounded-3xl p-6 shadow-sm border border-white/60 dark:border-slate-800/40 hover:shadow-xl hover:bg-white/90 dark:hover:bg-slate-950 hover:-translate-y-1 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title, color = "text-slate-700 dark:text-slate-200" }: { icon: any, title: string, color?: string }) => (
  <div className={`flex items-center gap-3 mb-4 font-display font-bold uppercase tracking-wider text-sm ${color} border-b border-slate-100 dark:border-slate-800/50 pb-2`}>
    <Icon className="w-5 h-5" />
    {title}
  </div>
);

export const MedicineView: React.FC<MedicineViewProps> = ({ data }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Main Image Hover Zoom States
  const [hoverZoom, setHoverZoom] = useState({ show: false, x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Normalize image data
  const images = Array.isArray(data.imageUrls) ? data.imageUrls : ((data as any).imageUrl ? [(data as any).imageUrl] : []);

  const resetZoom = () => setHoverZoom(prev => ({ ...prev, show: false }));

  const handleNextImage = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    resetZoom(); // Instantly reset zoom on slide
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    resetZoom(); // Instantly reset zoom on slide
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // --- Zoom Logic ---
  const handleInputMove = (clientX: number, clientY: number) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    
    // Calculate percentage position
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    
    // Clamp values to prevent glitching at edges
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setHoverZoom({ show: true, x: clampedX, y: clampedY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleInputMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling while zooming on image
    if(e.cancelable) e.preventDefault(); 
    handleInputMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
    setFailedImages(new Set());
    resetZoom();
  }, [data.name]);

  const handleImageError = (index: number) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const isCurrentImageFailed = failedImages.has(currentImageIndex);

  return (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* 1. Header: Name & Classification */}
      <div className="text-center relative z-10 pt-4">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-100/50 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300 text-xs font-bold uppercase tracking-widest border border-medical-200 dark:border-medical-800 mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-medical-500 animate-pulse"></span>
            {data.classification}
            {data.form && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-1"></span>
                <span className="text-teal-600 dark:text-teal-400">{data.form}</span>
              </>
            )}
         </div>
         <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
            {data.name}
         </h1>
      </div>

      {/* 2. Image Gallery Section */}
      <div className="relative w-full max-w-2xl mx-auto select-none touch-none"> 
        <div 
            ref={mainImageRef}
            className="relative w-full h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-lg border-4 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 group z-10"
            onMouseEnter={() => {}} 
            onMouseMove={handleMouseMove}
            onMouseLeave={resetZoom}
            onTouchStart={(e) => handleInputMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={handleTouchMove}
            onTouchEnd={resetZoom}
        >
            {images.length > 0 ? (
                <>
                   <div className="w-full h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden pointer-events-none">
                        {!isCurrentImageFailed ? (
                            <>
                                <img 
                                    key={images[currentImageIndex]} 
                                    src={images[currentImageIndex]} 
                                    alt={`${data.name} view ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain p-6 transition-transform duration-100 ease-out will-change-transform"
                                    style={{
                                        transformOrigin: `${hoverZoom.x}% ${hoverZoom.y}%`,
                                        transform: hoverZoom.show ? 'scale(2.5)' : 'scale(1)',
                                    }}
                                    onError={() => handleImageError(currentImageIndex)}
                                    referrerPolicy="no-referrer"
                                />
                                
                                {hoverZoom.show && (
                                    <div 
                                        className="absolute w-16 h-16 border-2 border-teal-500/30 rounded-full bg-white/10 backdrop-blur-[1px] shadow-sm flex items-center justify-center z-30"
                                        style={{ 
                                            left: `${hoverZoom.x}%`, 
                                            top: `${hoverZoom.y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <Search className="w-4 h-4 text-teal-600 opacity-40" />
                                    </div>
                                )}

                                <div 
                                    className={`absolute inset-0 bg-black/0 transition-opacity duration-300 flex items-center justify-center ${hoverZoom.show ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                     <div className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
                                        <ZoomIn className="w-4 h-4" /> Hover / Hold to Magnify
                                     </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 relative overflow-hidden cursor-default">
                                <div className="relative z-10 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                                    <ImageOff className="w-8 h-8 opacity-50" />
                                    <span className="text-xs font-bold tracking-widest uppercase">Image Unavailable</span>
                                    <p className="text-[10px] text-slate-400 mt-1">This specific image link is broken</p>
                                </div>
                            </div>
                        )}
                   </div>

                   {images.length > 1 && (
                       <>
                           <div 
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
                                onMouseEnter={resetZoom} 
                                onTouchStart={(e) => e.stopPropagation()} 
                           >
                                <button 
                                        onClick={handlePrevImage}
                                        className="p-3 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-md border border-slate-100 dark:border-slate-700"
                                >
                                        <ChevronLeft className="w-6 h-6" />
                                </button>
                           </div>

                           <div 
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
                                onMouseEnter={resetZoom}
                                onTouchStart={(e) => e.stopPropagation()}
                           >
                                <button 
                                        onClick={handleNextImage}
                                        className="p-3 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-md border border-slate-100 dark:border-slate-700"
                                >
                                        <ChevronRight className="w-6 h-6" />
                                </button>
                           </div>
                           
                           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
                                {images.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? (failedImages.has(idx) ? 'bg-red-500 w-6' : 'bg-teal-500 w-6') : (failedImages.has(idx) ? 'bg-red-300' : 'bg-slate-300 dark:bg-slate-600')}`}
                                    />
                                ))}
                           </div>
                       </>
                   )}
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 relative overflow-hidden cursor-default">
                   <div className="relative z-10 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                      <ImageOff className="w-8 h-8 opacity-50" />
                      <span className="text-xs font-bold tracking-widest uppercase">No Images Found</span>
                   </div>
                </div>
            )}
        </div>
        
        {/* IMAGE DISCLAIMER - REFINED */}
        <div className="mt-4 px-4 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center gap-2.5 opacity-90 backdrop-blur-sm">
            <Info className="w-3.5 h-3.5 text-medical-600 dark:text-medical-400 shrink-0" />
            <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-center">
                Search Results: Image may not represent actual medicine appearance
            </p>
        </div>
      </div>

      {/* 3. Primary Info: Uses & Mechanism */}
      <Card className="bg-gradient-to-br from-white to-medical-50/30 dark:from-slate-800 dark:to-slate-800/50">
        <div className="mb-8">
            <SectionTitle icon={CheckCircle2} title="Uses" color="text-medical-700 dark:text-medical-400" />
            <div className="flex flex-wrap gap-3">
                {(data.uses || []).map((use, i) => (
                <span key={i} className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-base md:text-lg font-bold border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:shadow-md transition-all hover:scale-105 transform duration-200">
                    <div className="w-2 h-2 rounded-full bg-medical-500"></div>
                    {use}
                </span>
                ))}
            </div>
        </div>

        <div>
            <SectionTitle icon={Activity} title="How it Works" color="text-indigo-600 dark:text-indigo-400" />
            <div className="bg-white/60 dark:bg-slate-900/40 p-5 rounded-2xl border border-indigo-50 dark:border-indigo-900/20 text-slate-700 dark:text-slate-200 text-base md:text-lg font-medium leading-relaxed">
                "{data.mechanism}"
            </div>
        </div>
      </Card>

      {/* 4. Dosage & Directions */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="bg-blue-50/40 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 flex flex-col justify-center">
               <SectionTitle icon={User} title="Adult Dosage" color="text-blue-700 dark:text-blue-400" />
               <div className="text-xl md:text-2xl font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">{data.dosage?.adults || 'N/A'}</div>
           </Card>
           <Card className="bg-purple-50/40 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800 flex flex-col justify-center">
               <SectionTitle icon={Baby} title="Child Dosage" color="text-purple-700 dark:text-purple-400" />
               <div className="text-xl md:text-2xl font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">{data.dosage?.children || 'N/A'}</div>
           </Card>
        </div>
        
        <Card className="bg-amber-50/40 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
             <SectionTitle icon={Clock} title="Directions & Timing" color="text-amber-700 dark:text-amber-500" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4 items-start p-3 bg-white/60 dark:bg-slate-900/40 rounded-xl border border-amber-100/50 dark:border-amber-900/10 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
                        <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">How to Take</div>
                        <div className="text-slate-800 dark:text-slate-200 font-medium text-base leading-relaxed">
                            {data.dosage?.instructions || 'As directed by physician.'}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-3 bg-white/60 dark:bg-slate-900/40 rounded-xl border border-amber-100/50 dark:border-amber-900/10 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                        <Timer className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Timing</div>
                        <div className="text-slate-800 dark:text-slate-200 font-medium text-base leading-relaxed">
                            <div><span className="text-slate-500 dark:text-slate-400 text-sm">Onset:</span> {data.onset}</div>
                            <div><span className="text-slate-500 dark:text-slate-400 text-sm">Duration:</span> {data.duration}</div>
                        </div>
                    </div>
                </div>
             </div>
        </Card>
      </div>

      {/* 5. Critical Info: Side Effects & Warnings */}
      <Card className="bg-gradient-to-r from-red-50/30 via-white to-red-50/30 dark:from-red-900/10 dark:via-slate-800 dark:to-red-900/10 border-red-100 dark:border-red-900/30">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <SectionTitle icon={Zap} title="Common Side Effects" color="text-orange-600 dark:text-orange-400" />
                <ul className="space-y-3 mb-6">
                    {(data.sideEffects?.common || []).map((e, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-base font-medium">
                            <span className="w-2 h-2 bg-orange-300 dark:bg-orange-500 rounded-full flex-shrink-0"></span>
                            {e}
                        </li>
                    ))}
                </ul>
                
                {data.sideEffects?.serious?.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
                        <div className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" /> Serious Side Effects
                        </div>
                        {(data.sideEffects?.serious || []).map((e, i) => (
                             <div key={i} className="text-base font-bold text-red-700 dark:text-red-300 leading-tight mb-2">• {e}</div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                 <SectionTitle icon={ShieldAlert} title="Safety Warnings" color="text-red-600 dark:text-red-400" />
                 <div className="flex flex-wrap gap-2.5 mb-6">
                     {(data.precautions || []).map((p, i) => (
                         <span key={i} className="bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-200 px-3.5 py-1.5 rounded-xl text-sm font-bold shadow-sm">
                             {p}
                         </span>
                     ))}
                 </div>
                 
                 <div className="mt-8">
                    <SectionTitle icon={Ban} title="Interactions" color="text-slate-500 dark:text-slate-400" />
                    <div className="flex flex-wrap gap-2.5">
                        {(data.interactions || []).map((int, i) => (
                            <span key={i} className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800">
                                {int}
                            </span>
                        ))}
                    </div>
                 </div>
            </div>
         </div>
      </Card>
      
      {data.overdoseAction && (
          <div className="bg-red-100/50 dark:bg-red-900/20 border-2 border-red-500/20 dark:border-red-500/40 rounded-2xl p-5 flex items-start gap-5 animate-pulse-slow">
             <div className="p-2.5 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400 shrink-0">
                 <Siren className="w-8 h-8" />
             </div>
             <div>
                 <div className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Overdose Emergency</div>
                 <div className="text-red-900 dark:text-red-200 font-bold text-lg md:text-xl leading-snug">{data.overdoseAction}</div>
             </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-teal-50/30 dark:bg-teal-900/10">
              <SectionTitle icon={ThermometerSun} title="Storage" color="text-teal-700 dark:text-teal-400" />
              <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-relaxed">{data.storage}</p>
          </Card>
          
          <Card className="bg-slate-50/50 dark:bg-slate-800/50">
              <SectionTitle icon={Leaf} title="Alternatives" color="text-slate-600 dark:text-slate-400" />
              <div className="space-y-4">
                  <div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Generic Names</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                          {(data.alternatives?.generic || []).map((a, i) => (
                              <span key={i} className="text-sm text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">{a}</span>
                          ))}
                      </div>
                  </div>
                  {data.alternatives?.branded?.length > 0 && (
                     <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Brand Names</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(data.alternatives?.branded || []).map((a, i) => (
                                <span key={i} className="text-sm text-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">{a}</span>
                            ))}
                        </div>
                     </div>
                  )}
              </div>
          </Card>
      </div>

    </div>
  );
};