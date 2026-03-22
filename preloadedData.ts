
export const PRELOADED_DATA: Record<string, any> = {
  "ibuprofen": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Ibuprofen",
      classification: "NSAID",
      image_urls: [],
      uses: ["Inflammation", "Joint pain", "Fever", "Menstrual cramps"],
      mechanism: "Blocks COX enzymes to reduce inflammation-causing chemicals.",
      adult_dosage: "200-400mg every 6 hours. Max 1200mg/day.",
      child_dosage: "Based on weight. Consult doctor.",
      directions: "Take with food to avoid stomach upset.",
      onset: "30 mins",
      duration: "6-8 hours",
      common_side_effects: ["Stomach ache", "Nausea", "Indigestion"],
      serious_side_effects: ["Stomach bleeding", "Kidney issues"],
      safety_warnings: ["Avoid in heart disease", "Do not use if allergic to Aspirin"],
      interactions: ["Blood thinners", "Steroids"],
      storage: "Room temperature.",
      alternatives: ["Naproxen", "Aspirin"],
      hidden_data: { branded_alternatives: ["Advil", "Motrin", "Brufen"] }
    }
  },
  "diclofenac": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Diclofenac",
      classification: "NSAID",
      image_urls: [],
      uses: ["Severe pain", "Arthritis", "Migraine"],
      mechanism: "Potent anti-inflammatory that inhibits prostaglandin synthesis.",
      adult_dosage: "50mg twice daily.",
      child_dosage: "Not recommended.",
      directions: "Take after a full meal.",
      onset: "1 hour",
      duration: "8 hours",
      common_side_effects: ["Dizziness", "Gas", "Headache"],
      serious_side_effects: ["Chest pain", "Shortness of breath"],
      safety_warnings: ["Avoid in pregnancy", "Caution in asthma"],
      interactions: ["Lithium", "Digoxin"],
      storage: "Cool dry place.",
      alternatives: ["Etoricoxib", "Aceclofenac"],
      hidden_data: { branded_alternatives: ["Voveran", "Voltaren"] }
    }
  },
  "amoxicillin": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Amoxicillin",
      classification: "Penicillin Antibiotic",
      image_urls: [],
      uses: ["Bacterial infections", "Strep throat", "UTIs"],
      mechanism: "Prevents bacteria from building cell walls, leading to their death.",
      adult_dosage: "500mg every 8-12 hours.",
      child_dosage: "Consult pediatrician.",
      directions: "Complete full course as prescribed.",
      onset: "1-2 hours",
      duration: "8 hours",
      common_side_effects: ["Diarrhea", "Rash", "Nausea"],
      serious_side_effects: ["Anaphylaxis", "Severe skin peeling"],
      safety_warnings: ["Check for penicillin allergy before use"],
      interactions: ["Birth control pills (may reduce efficacy)"],
      storage: "Keep in a cool place.",
      alternatives: ["Azithromycin", "Cefixime"],
      hidden_data: { branded_alternatives: ["Amoxil", "Moxatag"] }
    }
  },
  "metformin": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Metformin",
      classification: "Biguanide (Antidiabetic)",
      image_urls: [],
      uses: ["Type 2 Diabetes", "PCOS"],
      mechanism: "Decreases glucose production by liver and improves insulin sensitivity.",
      adult_dosage: "500mg once or twice daily.",
      child_dosage: "Consult doctor.",
      directions: "Take with food to minimize GI side effects.",
      onset: "Several days for full effect",
      duration: "12-24 hours",
      common_side_effects: ["Metallic taste", "Diarrhea", "Bloating"],
      serious_side_effects: ["Lactic acidosis (rare but fatal)"],
      safety_warnings: ["Stop use before surgery", "Avoid excessive alcohol"],
      interactions: ["Contrast dyes", "Cimetidine"],
      storage: "Room temperature.",
      alternatives: ["Glimepiride", "Vildagliptin"],
      hidden_data: { branded_alternatives: ["Glucophage", "Glycomet"] }
    }
  },
  "telmisartan": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Telmisartan",
      classification: "ARB (Antihypertensive)",
      image_urls: [],
      uses: ["High Blood Pressure", "Heart failure prevention"],
      mechanism: "Blocks angiotensin II receptors to relax blood vessels.",
      adult_dosage: "40mg-80mg once daily.",
      child_dosage: "Not recommended.",
      directions: "Take at the same time every day.",
      onset: "3 hours",
      duration: "24 hours",
      common_side_effects: ["Dizziness", "Fatigue", "Cold symptoms"],
      serious_side_effects: ["Kidney dysfunction", "High potassium"],
      safety_warnings: ["DO NOT USE IF PREGNANT"],
      interactions: ["NSAIDs", "Potassium supplements"],
      storage: "Keep in original pack.",
      alternatives: ["Losartan", "Olmesartan"],
      hidden_data: { branded_alternatives: ["Telma", "Micardis"] }
    }
  },
  "pantoprazole": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Pantoprazole",
      classification: "Proton Pump Inhibitor (PPI)",
      image_urls: [],
      uses: ["Acidity", "Stomach Ulcers", "GERD"],
      mechanism: "Reduces acid production in the stomach stomach lining.",
      adult_dosage: "40mg once daily.",
      child_dosage: "Consult doctor.",
      directions: "Take 30 mins before breakfast on empty stomach.",
      onset: "2 hours",
      duration: "24 hours",
      common_side_effects: ["Headache", "Gas", "Joint pain"],
      serious_side_effects: ["Vitamin B12 deficiency (long term)"],
      safety_warnings: ["Avoid long term use without medical supervision"],
      interactions: ["Methotrexate", "Iron"],
      storage: "Cool place.",
      alternatives: ["Omeprazole", "Rabeprazole"],
      hidden_data: { branded_alternatives: ["Pan", "Pantocid"] }
    }
  },
  "sildenafil": {
    type: "MEDICINE",
    medicine_data: {
      medicine_name: "Sildenafil",
      classification: "PDE5 Inhibitor",
      image_urls: [],
      uses: ["Erectile Dysfunction", "Pulmonary Hypertension"],
      mechanism: "Increases blood flow by relaxing muscle tissue in blood vessels.",
      adult_dosage: "50mg (up to 100mg) as needed.",
      child_dosage: "Only for specific lung conditions.",
      directions: "Take 1 hour before activity.",
      onset: "30-60 mins",
      duration: "4 hours",
      common_side_effects: ["Flushing", "Headache", "Blue-tinted vision"],
      serious_side_effects: ["Priapism (erection >4h)", "Sudden hearing loss"],
      safety_warnings: ["NEVER take with Nitrates (BP crash risk)"],
      interactions: ["Nitrates", "Alpha blockers"],
      storage: "Room temperature.",
      alternatives: ["Tadalafil", "Vardenafil"],
      hidden_data: { branded_alternatives: ["Viagra", "Manforce", "Suhagra"] }
    }
  }
};

// Add remaining keys as empty entries to populate suggestion list
[
  "aspirin", "aceclofenac", "naproxen", "tramadol", "morphine", "codeine",
  "amoxicillin-clavulanate", "azithromycin", "clarithromycin", "levofloxacin",
  "ofloxacin", "doxycycline", "cefixime", "ceftriaxone", "cefuroxime",
  "metronidazole", "tinidazole", "fluconazole", "itraconazole", "acyclovir",
  "oseltamivir", "glimepiride", "insulin", "sitagliptin", "teneligliptin",
  "amlodipine", "losartan", "lisinopril", "enalapril", "atenolol",
  "metoprolol", "propranolol", "atorvastatin", "rosuvastatin", "clopidogrel",
  "warfarin", "apixaban", "omeprazole", "rabeprazole", "ranitidine",
  "ondansetron", "domperidone", "dicycloverine", "loperamide", "lactulose",
  "levothyroxine", "prednisolone", "dexamethasone", "hydrocortisone",
  "salbutamol", "budesonide", "montelukast", "cetirizine", "levocetirizine",
  "fexofenadine", "sertraline", "fluoxetine", "escitalopram", "amitriptyline",
  "clonazepam", "alprazolam", "olanzapine", "risperidone", "sodium valproate",
  "carbamazepine", "phenytoin", "gabapentin", "pregabalin", "tamsulosin",
  "finasteride", "tadalafil", "ethamsylate", "tranexamic acid", "iron folic acid",
  "calcium carbonate", "vitamin d3", "methylcobalamin", "hydroxychloroquine",
  "allopurinol", "colchicine", "methotrexate", "ivermectin", "albendazole", "nitrofurantoin"
].forEach(med => {
  if (!PRELOADED_DATA[med]) {
    PRELOADED_DATA[med] = {
      type: "MEDICINE",
      medicine_data: { medicine_name: med.charAt(0).toUpperCase() + med.slice(1), image_urls: [] }
    };
  }
});
