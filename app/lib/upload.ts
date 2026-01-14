import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

export async function uploadFile(file: File | null): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('images') // Bucket name 'images'
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Upload Error:', error);
        throw new Error('Image upload failed');
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    return publicUrl;
}
