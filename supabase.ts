import { createClient } from '@supabase/supabase-js';
import { MedicineDetails } from '../types';

// Credentials provided by user
const supabaseUrl = 'https://uahbizfcrmxlhkwpllbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaGJpemZjcm14bGhrd3BsbGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDM3OTksImV4cCI6MjA4MDU3OTc5OX0.yjNI_vpocfN8N3F-OMjQipoTVtiVfSeADrgX2bAuGHQ';

export const isSupabaseConfigured = () => true;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to update just the image in the JSONB column
export const updateMedicineImageInDb = async (id: number, currentData: MedicineDetails, newImageUrls: string[]) => {
  if (!newImageUrls || newImageUrls.length === 0) return;
  
  // Update data object with new array
  const updatedData = {
    ...currentData,
    imageUrls: newImageUrls, // Use new array key
    imageUrl: newImageUrls[0] // Keep legacy key for safety
  };

  const { error } = await supabase
    .from('medicines')
    .update({ data: updatedData })
    .eq('id', id);

  if (error) {
    console.error("Failed to update image in Supabase:", error);
  } else {
    console.log("Successfully updated images in Supabase for:", currentData.name);
  }
};

export const getAllMedicines = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching all medicines:", error);
    return [];
  }
  return data;
};

export const updateMedicine = async (id: number, updatedData: MedicineDetails) => {
  const { error } = await supabase
    .from('medicines')
    .update({ 
      name: updatedData.name,
      data: updatedData 
    })
    .eq('id', id);

  if (error) {
    console.error("Error updating medicine:", error);
    throw error;
  }
};
