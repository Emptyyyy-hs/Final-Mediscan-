export enum SearchType {
  MEDICINE = 'MEDICINE',
  SYMPTOM = 'SYMPTOM',
  UNKNOWN = 'UNKNOWN',
}

export interface MedicineDetails {
  name: string; // mapped from medicine_name
  classification: string;
  form?: string; // e.g., tablet, syrup, spray
  imageUrls: string[]; // CHANGED: Now an array of strings
  uses: string[];
  mechanism: string; // mapped from mechanism
  dosage: {
    adults: string; // mapped from adult_dosage
    children: string; // mapped from child_dosage
    instructions: string; // mapped from directions
  };
  onset: string; // mapped from onset
  duration: string; // mapped from duration
  sideEffects: {
    common: string[]; // mapped from common_side_effects
    serious: string[]; // mapped from serious_side_effects
    rare: string[]; // mapped from hidden_data.rare_side_effects
  };
  precautions: string[]; // mapped from safety_warnings
  interactions: string[];
  storage: string;
  alternatives: {
    generic: string[]; // mapped from alternatives
    branded: string[]; // mapped from hidden_data.branded_alternatives
  };
  overdoseAction: string; // mapped from hidden_data.overdose_action
}

export interface SymptomDetails {
  name: string;
  possibleCauses: string[];
  safeMedicines: string[];
  homeRemedies: string[];
  whenToSeeDoctor: string[];
}

export interface ScanResult {
  type: SearchType;
  medicineDetails?: MedicineDetails;
  symptomDetails?: SymptomDetails;
  summary?: string; 
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  type: SearchType;
  summary?: string;
}

export interface MedicineForm {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface MedicineAttribute {
  id: string;
  category: 'color' | 'shape' | 'form';
  value: string;
  description: string;
}