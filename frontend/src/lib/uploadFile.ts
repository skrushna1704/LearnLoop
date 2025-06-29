import { supabase } from './supabase';

export async function uploadFileToSupabase(file: File): Promise<string> {
  const filePath = `chat-uploads/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('chat-uploads') // your bucket name
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('chat-uploads')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
} 