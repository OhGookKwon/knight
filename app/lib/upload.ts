import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
import sharp from 'sharp';

export async function uploadFile(file: File | null): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Video Size Check (Max 10MB)
    if (file.type.startsWith('video/') && file.size > 10 * 1024 * 1024) {
        throw new Error("영상 파일은 10MB 이하여야 합니다.");
    }

    let buffer: Buffer = Buffer.from(await file.arrayBuffer());
    let contentType = file.type;

    // Image Compression
    if (file.type.startsWith('image/')) {
        try {
            // Resize to max 1920px width/height and compress to standard WebP/JPEG
            // This usually brings photos well under 1MB
            let imagePipeline = sharp(buffer)
                .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });

            if (fileExt === 'png') {
                imagePipeline = imagePipeline.png({ quality: 80, compressionLevel: 9 });
            } else if (fileExt === 'webp') {
                imagePipeline = imagePipeline.webp({ quality: 80 });
            } else {
                // Default to jpeg for everything else (jpg, jpeg, etc)
                imagePipeline = imagePipeline.jpeg({ quality: 80, mozjpeg: true });
                // Enforce .jpg extension if we converted
                if (fileExt !== 'jpg' && fileExt !== 'jpeg') {
                    // Note: changing extension in filePath might break things if client expects original ext
                    // But usually safe to keep original ext if MIME compatible or just force JPEG
                }
            }

            buffer = await imagePipeline.toBuffer();

            // If still > 1MB, try harder
            if (buffer.length > 1024 * 1024) {
                buffer = await sharp(buffer)
                    .jpeg({ quality: 60, mozjpeg: true })
                    .toBuffer();
                contentType = 'image/jpeg'; // Force JPEG content type
            }
        } catch (e) {
            console.error("Image compression failed, uploading original:", e);
        }
    }

    const { data, error } = await supabase.storage
        .from('images') // Bucket name 'images'
        .upload(filePath, buffer, {
            contentType: contentType,
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
