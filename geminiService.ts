
import { GoogleGenAI, Type } from "@google/genai";
import { supabase, updateMedicineImageInDb } from "./supabase";
import { ScanResult, SearchType, SearchHistoryItem, MedicineDetails, SymptomDetails } from "../types";
import { PRELOADED_DATA } from "./preloadedData";

// Initialize AI with the environment variable mapped in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- GOOGLE CUSTOM SEARCH CONFIGURATION ---
const CSE_ID = "";  
const CSE_API_KEY = "";   

const SYSTEM_INSTRUCTION = `
You are the backend of a project called MediScan. Your task is to provide accurate medicine information.

CORE IDENTITY RULE:
1. Always prioritize the BRAND NAME (e.g. "Dolo 650", "Panadol") as the primary name.
2. DO NOT use the chemical composition (e.g. "Acetaminophen") as the primary title; use the searched name or the most common brand name.
3. Users find chemical names confusing. Keep the focus on what the box says.
4. IDENTIFY THE FORM: Carefully check if the user specified a form (e.g., "Tablets", "Capsules", "Syrups", "Suspensions", "Solutions", "Injections", "Infusions", "Creams", "Ointments", "Gels", "Lotions", "Inhalers", "Nebulizers", "Sprays", "Drops", "Patches", "Suppositories", "Pessaries", "Powders", "Granules", "Lozenges"). If specified, ensure the "form" field in JSON reflects this.
5. VISUAL DESCRIPTION: For tablets and capsules, specify if they come in "strips", "blister packs", or "bottles". This helps the image engine.

Rules:
1. Sources: Use NHS, Drugs.com, WebMD, 1mg.
2. Images: Leave imageUrls EMPTY []. The engine handles this.
3. Format: Return strictly JSON.
4. Accuracy: Ensure adult/child dosages are distinct and clearly noted.
`;

export const detectMedicineForm = (query: string): string | null => {
  const q = query.toLowerCase();
  
  // Oral Solids
  if (q.includes('tablet') || q.includes('tabelt')) return 'tablet';
  if (q.includes('capsule')) return 'capsule';
  if (q.includes('lozenge')) return 'lozenge';
  if (q.includes('pill') || q.includes('pills') || q.includes('pil') || q.includes('strip') || q.includes('blister')) return 'tablet';
  
  // Oral Liquids
  if (q.includes('syrup')) return 'syrup';
  if (q.includes('suspension')) return 'suspension';
  if (q.includes('solution')) return 'solution';
  if (q.includes('liquid')) return 'syrup';
  
  // Injectables
  if (q.includes('injection') || q.includes('vial') || q.includes('ampoule')) return 'injection';
  if (q.includes('infusion') || q.includes('iv bag')) return 'infusion';
  
  // Topicals
  if (q.includes('cream')) return 'cream';
  if (q.includes('ointment')) return 'ointment';
  if (q.includes('gel')) return 'gel';
  if (q.includes('lotion')) return 'lotion';
  if (q.includes('balm') || q.includes('soap')) return 'topical';
  
  // Respiratory
  if (q.includes('inhaler')) return 'inhaler';
  if (q.includes('nebulizer') || q.includes('respule')) return 'nebulizer';
  if (q.includes('spray')) return 'spray';
  
  // Drops
  if (q.includes('drop') || q.includes('eye') || q.includes('ear') || q.includes('nasal')) return 'drops';
  
  // Others
  if (q.includes('patch')) return 'patch';
  if (q.includes('suppository')) return 'suppository';
  if (q.includes('pessary')) return 'pessary';
  if (q.includes('powder')) return 'powder';
  if (q.includes('granule')) return 'granule';
  if (q.includes('sachet')) return 'sachet';
  
  return null;
};

export const cleanMedicineName = (name: string): string => {
  const cleaned = name
    .toLowerCase()
    .replace(/\s*(mg|ml|g|mcg|iu|%)\b/gi, '') // Remove unit but keep the dosage number
    .replace(/\b(tablet|tabelt|capsule|syrup|injection|gel|cream|ointment|drops|solution|suspension|pill|pills|pil|sachet|spray|nasal|inhaler|balm|lotion|infusion|nebulizer|patch|suppository|pessary|powder|granule|lozenge)\b/gi, '') 
    .replace(/\s+/g, ' ') 
    .trim();
    
  // If cleaning made the name too short (like "i-pill" -> "i"), revert to original but trimmed
  // This prevents losing the identity of short brand names that contain form words
  if (cleaned.length < 3 && name.trim().length >= 3) {
    return name.trim();
  }
  return cleaned;
};

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
};

export const fetchMedicineNames = async (): Promise<string[]> => {
  try {
    const { data } = await supabase.from('medicines').select('name').order('name');
    const unique = new Set<string>();
    data?.forEach((row: any) => unique.add(toTitleCase(cleanMedicineName(row.name))));
    return Array.from(unique).sort();
  } catch { return []; }
};

const fetchGoogleImages = async (searchTerm: string, validationName: string, form: string | null = null): Promise<string[]> => {
  if (!CSE_ID || !CSE_API_KEY) return [];
  try {
    // Enhanced strict query with more negative keywords to exclude food and irrelevant items
    let strictQuery = `${searchTerm} -vector -illustration -cartoon -logo -stock -food -meat -beef -recipe -cooking -corned -can -grocery -delicious -tasty -yummy -dish -plate -restaurant medicine pharmacy packaging real photo`;
    
    // Add form-specific exclusions to prevent "tonic bottle" for tablets
    if (form === 'tablet' || form === 'capsule') {
      strictQuery += ' -bottle -syrup -liquid -suspension';
    } else if (form === 'syrup' || form === 'suspension' || form === 'solution') {
      strictQuery += ' -strip -blister -tablet -capsule';
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(strictQuery)}&cx=${CSE_ID}&key=${CSE_API_KEY}&searchType=image&num=10&safe=active&imgType=photo`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.items) {
      const normalizedName = validationName.toLowerCase().replace(/\s+/g, '');
      const nameWords = validationName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      
      const filtered = data.items.filter((it: any) => {
        const title = (it.title || "").toLowerCase();
        const snippet = (it.snippet || "").toLowerCase();
        const link = (it.link || "").toLowerCase();
        
        // Basic domain filtering
        if (link.includes('placeholder') || link.includes('example.com') || link.includes('dreamstime') || link.includes('shutterstock') || link.includes('istockphoto') || link.includes('gettyimages')) {
          return false;
        }

        // Exclude food related keywords in title/snippet/link for medicine searches
        const foodKeywords = ['beef', 'meat', 'food', 'recipe', 'cook', 'delicious', 'taste', 'grocery', 'corned', 'can', 'tasty', 'yummy', 'dish', 'plate', 'restaurant', 'supermarket'];
        if (foodKeywords.some(word => title.includes(word) || snippet.includes(word) || link.includes(word))) {
          return false;
        }

        // Ensure it's likely a medicine/pharmacy related result
        const medicineKeywords = ['medicine', 'drug', 'pharmacy', 'tablet', 'capsule', 'syrup', 'ointment', 'cream', 'gel', 'spray', 'drops', 'bottle', 'pack', 'box', 'strip', 'pharma', 'dosage', 'prescription', 'healthcare', 'medical'];
        const hasMedicineContext = medicineKeywords.some(word => title.includes(word) || snippet.includes(word) || link.includes(word));
        
        // If it's a very specific brand search, we might relax the medicine context requirement if the name matches strongly
        const cleanTitle = title.replace(/[^a-z0-9]/g, '');
        const cleanSnippet = snippet.replace(/[^a-z0-9]/g, '');

        // Check if the full normalized name is present
        const hasFullName = cleanTitle.includes(normalizedName) || cleanSnippet.includes(normalizedName);
        
        // Check if at least 2 significant words are present (or all words if less than 2)
        const matchCount = nameWords.filter(w => title.includes(w) || snippet.includes(w)).length;
        const hasWordMatch = matchCount >= Math.min(2, nameWords.length);

        // If the query contains numbers (like 625), ensure the number is also present in the result
        const queryNumbers = validationName.match(/\d+/g) || [];
        const hasNumbers = queryNumbers.every(num => title.includes(num) || snippet.includes(num));

        // Strict requirement: Must have full name OR (strong word match AND medicine context)
        // AND if numbers are in query, they should ideally be in result
        return (hasFullName || (hasWordMatch && hasMedicineContext)) && (queryNumbers.length === 0 || hasNumbers);
      });

      return filtered.map((it: any) => it.link).filter((link: string) => {
        const l = link.toLowerCase();
        return !l.includes('placeholder') && !l.includes('example.com');
      });
    }
  } catch (error) { console.error("Image Fetch Error:", error); }
  return [];
};

const fetchRealImages = async (medicineName: string, specificForm: string | null = null): Promise<string[]> => {
  // Special handling for common brands to ensure correct images
  const lowerName = medicineName.toLowerCase();
  const isDolo650 = lowerName.includes('dolo') && lowerName.includes('650');
  const isCrocin = lowerName.includes('crocin');
  const isPanadol = lowerName.includes('panadol');
  const isCalpol = lowerName.includes('calpol');
  const isIPill = lowerName.includes('i-pill') || lowerName.includes('ipill') || (lowerName.includes('i') && lowerName.includes('pill')) || (lowerName.includes('i') && lowerName.includes('pil'));
  
  const queryMap: Record<string, string[]> = {
    tablet: isDolo650 
      ? [`Dolo 650 strip Micro Labs`, `Dolo 650 tablet strip pack`]
      : isCrocin
      ? [`Crocin 650 tablet strip packaging`, `Crocin medicine strip box`]
      : isPanadol
      ? [`Panadol advance tablet strip pack`, `Panadol medicine packaging strip`]
      : isCalpol
      ? [`Calpol 500 tablet strip pack`, `Calpol medicine packaging`]
      : isIPill
      ? [`i-pill tablet strip packaging`, `i-pill emergency contraceptive pill`]
      : [`${medicineName} tablet strip pack`, `${medicineName} tablet blister packaging`],
    capsule: [`${medicineName} capsule blister pack`, `${medicineName} capsule box`],
    syrup: [`${medicineName} syrup bottle packaging`, `${medicineName} oral syrup bottle`],
    suspension: [`${medicineName} oral suspension bottle`, `${medicineName} suspension packaging`],
    solution: [`${medicineName} oral solution bottle`, `${medicineName} solution packaging`],
    injection: [`${medicineName} injection vial ampoule`, `${medicineName} injection packaging`],
    infusion: [`${medicineName} infusion bag IV`, `${medicineName} IV drip packaging`],
    cream: [`${medicineName} cream tube packaging`, `${medicineName} cream dermatological`],
    ointment: [`${medicineName} ointment tube`, `${medicineName} ointment packaging`],
    gel: [`${medicineName} gel tube`, `${medicineName} gel topical packaging`],
    lotion: [`${medicineName} lotion bottle`, `${medicineName} lotion packaging`],
    topical: [`${medicineName} cream gel tube`, `${medicineName} ointment balm packaging`],
    inhaler: [`${medicineName} inhaler device`, `${medicineName} MDI inhaler`],
    nebulizer: [`${medicineName} nebulizer respule`, `${medicineName} nebulizer solution`],
    spray: [`${medicineName} nasal spray bottle`, `${medicineName} spray pump`],
    drops: [`${medicineName} eye ear nasal drops bottle`, `${medicineName} drops packaging`],
    patch: [`${medicineName} transdermal patch`, `${medicineName} patch packaging`],
    suppository: [`${medicineName} suppository pack`, `${medicineName} suppository packaging`],
    pessary: [`${medicineName} pessary pack`, `${medicineName} pessary packaging`],
    powder: [`${medicineName} powder sachet pack`, `${medicineName} powder packaging`],
    granule: [`${medicineName} granules sachet`, `${medicineName} granules packaging`],
    lozenge: [`${medicineName} lozenges strip`, `${medicineName} lozenge pack`],
    sachet: [`${medicineName} sachet pack`, `${medicineName} sachet packaging`],
    generic: [`${medicineName} medicine product packaging`, `${medicineName} pharmacy product photo`, `${medicineName} medicine strip`]
  };
  
  const formKey = (specificForm?.toLowerCase() || 'generic') as keyof typeof queryMap;
  const searchTerms = queryMap[formKey] || queryMap.generic;
  const results = await Promise.all(searchTerms.map(q => fetchGoogleImages(q, medicineName, specificForm)));
  
  // Flatten and remove duplicates
  let flat = results.flat().filter((v, i, a) => a.indexOf(v) === i);
  
  // If we have very few results, try more search terms
  if (flat.length < 3) {
    const broaderQueries = [
      `${medicineName} medicine packaging`,
      `${medicineName} drug box`,
      `${medicineName} pharmacy product`
    ];
    const broaderResults = await Promise.all(broaderQueries.map(q => fetchGoogleImages(q, medicineName)));
    flat = [...flat, ...broaderResults.flat()].filter((v, i, a) => a.indexOf(v) === i);
  }
  
  return flat.slice(0, 4); // Return up to 4 images for the slider
};

// --- AI FALLBACK SYSTEM ---
const MODELS = [
  "gemini-3.1-pro-preview", // Primary: Highest reasoning quality
  "gemini-3-flash-preview", // Secondary: Fast and high rate limits
  "gemini-2.5-flash"        // Tertiary: Stable fallback
];

async function generateContentWithFallback(params: any) {
  let lastError = null;
  
  for (const modelName of MODELS) {
    try {
      console.log(`Searching with model: ${modelName}`);
      const response = await ai.models.generateContent({
        ...params,
        model: modelName
      });
      
      if (response && response.text) {
        return response;
      }
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || "";
      
      // If it's a rate limit (429) or overloaded (503), try the next model
      if (errorMsg.includes("429") || errorMsg.includes("503") || errorMsg.includes("quota")) {
        console.warn(`Model ${modelName} limit reached, falling back...`);
        continue;
      }
      
      // For other fatal errors, throw immediately
      throw error;
    }
  }
  
  throw lastError || new Error("All AI models failed to respond.");
}

export const fetchMedicalData = async (query: string, context: { userId: string }): Promise<ScanResult & { source: 'DB' | 'AI' }> => {
  const detectedForm = detectMedicineForm(query);
  
  // Normalize query: handle cases like "dolo650" -> "dolo 650"
  const normalizedQuery = query
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .trim();
    
  const cleanQuery = cleanMedicineName(normalizedQuery);
  const lowerQuery = normalizedQuery.toLowerCase();

  // 1. PRELOADED CHECK (Includes Sync logic)
  if (PRELOADED_DATA[lowerQuery] || PRELOADED_DATA[cleanQuery]) {
    const raw = PRELOADED_DATA[lowerQuery] || PRELOADED_DATA[cleanQuery];
    if (raw.type === "MEDICINE" && raw.medicine_data) {
      const m = raw.medicine_data;
      let imgs = m.image_urls || [];
      
      // If images missing, fetch them dynamically
      if (imgs.length === 0) {
        imgs = await fetchRealImages(m.medicine_name, detectedForm);
      }

      const medicineDetails: MedicineDetails = {
        name: m.medicine_name,
        classification: m.classification || "Generic Medicine",
        form: detectedForm || null,
        imageUrls: imgs,
        uses: m.uses || [],
        mechanism: m.mechanism || "Consult healthcare provider.",
        dosage: { adults: m.adult_dosage || "N/A", children: m.child_dosage || "N/A", instructions: m.directions || "As directed by physician." },
        onset: m.onset || "Unknown", duration: m.duration || "Unknown",
        sideEffects: { common: m.common_side_effects || [], serious: m.serious_side_effects || [], rare: m.hidden_data?.rare_side_effects || [] },
        precautions: m.safety_warnings || [], interactions: m.interactions || [], storage: m.storage || "Cool dry place.",
        alternatives: { generic: m.alternatives || [], branded: m.hidden_data?.branded_alternatives || [] },
        overdoseAction: m.hidden_data?.overdose_action || "Contact emergency services immediately."
      };

      const result: ScanResult & { source: 'DB' | 'AI' } = { type: SearchType.MEDICINE, medicineDetails, summary: `Database record for ${m.medicine_name}`, source: 'DB' };
      
      // Sync back to Supabase so images persist
      await supabase.from('medicines').upsert({ name: toTitleCase(m.medicine_name), data: result.medicineDetails }, { onConflict: 'name' });
      saveToHistory(query, result, context.userId);
      return result;
    }
  }

  // 2. SUPABASE CACHE CHECK
  try {
    // Try matching with normalized name and clean name
    const { data: cached } = await supabase.from('medicines')
      .select('*')
      .or(`name.ilike.${cleanQuery},name.ilike.${normalizedQuery}`)
      .limit(1);
      
    if (cached && cached.length > 0) {
      const record = cached[0];
      const details = record.data as MedicineDetails;
      if (!details.imageUrls) details.imageUrls = [];
      if (!details.dosage) {
        details.dosage = { adults: "N/A", children: "N/A", instructions: "As directed by physician." };
      }
      
      if (details.imageUrls.length === 0 || detectedForm) {
        const freshImgs = await fetchRealImages(record.name, detectedForm);
        if (freshImgs.length > 0) {
          details.imageUrls = freshImgs;
          await supabase.from('medicines').update({ data: details }).eq('id', record.id);
        }
      }
      
      const result: ScanResult & { source: 'DB' | 'AI' } = { type: SearchType.MEDICINE, medicineDetails: details, summary: `Retrieved from cache.`, source: 'DB' };
      saveToHistory(query, result, context.userId);
      return result;
    }
  } catch (e) { console.warn("Cache error", e); }

  // 3. EXTENDED SEARCH FALLBACK
  try {
    const response = await generateContentWithFallback({
      contents: `Provide medical information for: "${normalizedQuery}" in JSON format.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["MEDICINE", "SYMPTOM", "UNKNOWN"] },
            summary: { type: Type.STRING },
            medicineDetails: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                classification: { type: Type.STRING },
                form: { type: Type.STRING, description: "The physical form: tablet, syrup, spray, drops, injection, etc." },
                imageUrls: { type: Type.ARRAY, items: { type: Type.STRING } },
                uses: { type: Type.ARRAY, items: { type: Type.STRING } },
                mechanism: { type: Type.STRING },
                dosage: {
                  type: Type.OBJECT,
                  properties: { adults: { type: Type.STRING }, children: { type: Type.STRING }, instructions: { type: Type.STRING } }
                },
                onset: { type: Type.STRING },
                duration: { type: Type.STRING },
                sideEffects: {
                  type: Type.OBJECT,
                  properties: { common: { type: Type.ARRAY, items: { type: Type.STRING } }, serious: { type: Type.ARRAY, items: { type: Type.STRING } }, rare: { type: Type.ARRAY, items: { type: Type.STRING } } }
                },
                precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
                interactions: { type: Type.ARRAY, items: { type: Type.STRING } },
                storage: { type: Type.STRING },
                alternatives: {
                  type: Type.OBJECT,
                  properties: { generic: { type: Type.ARRAY, items: { type: Type.STRING } }, branded: { type: Type.ARRAY, items: { type: Type.STRING } } }
                },
                overdoseAction: { type: Type.STRING }
              }
            },
            symptomDetails: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                safeMedicines: { type: Type.ARRAY, items: { type: Type.STRING } },
                homeRemedies: { type: Type.ARRAY, items: { type: Type.STRING } },
                whenToSeeDoctor: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["type", "summary"]
        }
      }
    });

    // Correctly extract the text property from the response object
    const data = JSON.parse(response.text || "{}");
    
    if (data.type === SearchType.MEDICINE && data.medicineDetails) {
      const m = data.medicineDetails;
      const stdName = toTitleCase(cleanMedicineName(m.name || query));
      
      const medicineDetails: MedicineDetails = {
        name: stdName,
        classification: m.classification || "Generic Medicine",
        form: m.form || detectedForm || null,
        imageUrls: [], // Will be fetched below
        uses: Array.isArray(m.uses) ? m.uses : [],
        mechanism: m.mechanism || "Consult healthcare provider.",
        dosage: { 
          adults: m.dosage?.adults || "N/A", 
          children: m.dosage?.children || "N/A", 
          instructions: m.dosage?.instructions || "As directed by physician." 
        },
        onset: m.onset || "Unknown",
        duration: m.duration || "Unknown",
        sideEffects: { 
          common: Array.isArray(m.sideEffects?.common) ? m.sideEffects.common : [], 
          serious: Array.isArray(m.sideEffects?.serious) ? m.sideEffects.serious : [], 
          rare: Array.isArray(m.sideEffects?.rare) ? m.sideEffects.rare : [] 
        },
        precautions: Array.isArray(m.precautions) ? m.precautions : [],
        interactions: Array.isArray(m.interactions) ? m.interactions : [],
        storage: m.storage || "Cool dry place.",
        alternatives: { 
          generic: Array.isArray(m.alternatives?.generic) ? m.alternatives.generic : [], 
          branded: Array.isArray(m.alternatives?.branded) ? m.alternatives.branded : [] 
        },
        overdoseAction: m.overdoseAction || "Contact emergency services immediately."
      };

      medicineDetails.imageUrls = await fetchRealImages(stdName, medicineDetails.form);
      const res: ScanResult & { source: 'DB' | 'AI' } = { type: SearchType.MEDICINE, medicineDetails, summary: data.summary, source: 'AI' };
      await supabase.from('medicines').upsert({ name: stdName, data: res.medicineDetails }, { onConflict: 'name' });
      saveToHistory(query, res, context.userId);
      return res;
    } else if (data.type === SearchType.SYMPTOM && data.symptomDetails) {
      const s = data.symptomDetails;
      const symptomDetails: SymptomDetails = {
        name: s.name || query,
        possibleCauses: Array.isArray(s.possibleCauses) ? s.possibleCauses : [],
        safeMedicines: Array.isArray(s.safeMedicines) ? s.safeMedicines : [],
        homeRemedies: Array.isArray(s.homeRemedies) ? s.homeRemedies : [],
        whenToSeeDoctor: Array.isArray(s.whenToSeeDoctor) ? s.whenToSeeDoctor : []
      };
      const res: ScanResult & { source: 'DB' | 'AI' } = { type: SearchType.SYMPTOM, symptomDetails, summary: data.summary, source: 'AI' };
      saveToHistory(query, res, context.userId);
      return res;
    }

    const res: ScanResult & { source: 'DB' | 'AI' } = { type: SearchType.UNKNOWN, summary: data.summary || "No information found.", source: 'AI' };
    saveToHistory(query, res, context.userId);
    return res;
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error("Search failed. Please try again with a more specific name.");
  }
};

const saveToHistory = (query: string, result: ScanResult, userId: string) => {
  const key = `mediscan_history_${userId}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const newItem = { id: crypto.randomUUID(), query, timestamp: Date.now(), type: result.type, summary: result.summary };
  const filtered = existing.filter((it: any) => it.query.toLowerCase() !== query.toLowerCase());
  localStorage.setItem(key, JSON.stringify([newItem, ...filtered].slice(0, 50)));
};

export const fetchUserHistory = async (userId: string): Promise<SearchHistoryItem[]> => {
  return JSON.parse(localStorage.getItem(`mediscan_history_${userId}`) || "[]");
};
