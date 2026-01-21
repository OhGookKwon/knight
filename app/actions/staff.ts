'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { uploadFile } from "@/app/lib/upload";

export async function createStaff(storeId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const rawLevel = formData.get('koreanLevel');
    const koreanLevel = rawLevel ? parseInt(rawLevel as string) : 1;
    const styleTags = formData.get('styleTags') as string;

    // Handle Uploads
    const videoFile = formData.get('videoFile') as File | null;
    const profileImageFile = formData.get('profileImageFile') as File | null;

    let videoUrl = formData.get('videoUrl') as string;
    let profileImage = formData.get('profileImage') as string;

    const uploadedVideo = await uploadFile(videoFile);
    if (uploadedVideo) videoUrl = uploadedVideo;

    const uploadedProfile = await uploadFile(profileImageFile);
    if (uploadedProfile) profileImage = uploadedProfile;

    // Handle Multiple Images
    const images = formData.getAll('images') as File[];
    console.log(`[createStaff] Found ${images.length} images to upload.`);
    const uploadedImageUrls: string[] = [];

    for (const file of images) {
        if (file.size > 0) {
            try {
                const url = await uploadFile(file);
                if (url) {
                    uploadedImageUrls.push(url);
                    console.log(`[createStaff] Uploaded image: ${url}`);
                }
            } catch (e) {
                console.error(`[createStaff] Failed to upload image: ${file.name}`, e);
            }
        }
    }

    // New fields
    const rawAge = formData.get('age');
    const age = rawAge ? parseInt(rawAge as string) : null;
    const language = formData.get('language') as string;

    if (isNaN(koreanLevel)) {
        throw new Error("Invalid Korean Level");
    }

    const newStaff = await prisma.staff.create({
        data: {
            name,
            koreanLevel,
            styleTags,
            videoUrl,
            profileImage,
            age,
            language,
            isWorkingToday: formData.get('isWorkingToday') === 'on',
            storeId,
            images: {
                create: uploadedImageUrls.map(url => ({ url }))
            }
        }
    });
    console.log(`[createStaff] Created staff ${newStaff.id} with ${uploadedImageUrls.length} images.`);

    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
    redirect(`/admin/stores/${storeId}`);
}

export async function updateStaff(staffId: string, storeId: string, formData: FormData) {
    console.log(`[updateStaff] Updating staff ${staffId}`);
    const name = formData.get('name') as string;
    const rawLevel = formData.get('koreanLevel');
    const koreanLevel = rawLevel ? parseInt(rawLevel as string) : 1;
    const styleTags = formData.get('styleTags') as string;

    // Handle Uploads
    const videoFile = formData.get('videoFile') as File | null;
    const profileImageFile = formData.get('profileImageFile') as File | null;

    let videoUrl = formData.get('videoUrl') as string;
    let profileImage = formData.get('profileImage') as string;

    if (videoFile && videoFile.size > 0) {
        const uploadedVideo = await uploadFile(videoFile);
        if (uploadedVideo) videoUrl = uploadedVideo;
    }

    if (profileImageFile && profileImageFile.size > 0) {
        const uploadedProfile = await uploadFile(profileImageFile);
        if (uploadedProfile) profileImage = uploadedProfile;
    }

    // Handle Multiple Images (Append new ones)
    const images = formData.getAll('images') as File[];
    console.log(`[updateStaff] Found ${images.length} new images.`);

    // Upload new images
    for (const file of images) {
        if (file.size > 0) {
            try {
                const url = await uploadFile(file);
                if (url) {
                    console.log(`[updateStaff] Uploading new image: ${url}`);
                    await prisma.staffImage.create({
                        data: {
                            staffId,
                            url
                        }
                    });
                }
            } catch (e) {
                console.error(`[updateStaff] Failed to upload image: ${file.name}`, e);
            }
        }
    }

    // New fields
    const rawAge = formData.get('age');
    const age = rawAge ? parseInt(rawAge as string) : null;
    const language = formData.get('language') as string;
    const isWorkingToday = formData.get('isWorkingToday') === 'on';

    if (isNaN(koreanLevel)) {
        throw new Error("Invalid Korean Level");
    }

    await prisma.staff.update({
        where: { id: staffId },
        data: {
            name,
            koreanLevel,
            styleTags,
            videoUrl,
            profileImage,
            age,
            language,
            isWorkingToday
        }
    });

    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
    redirect(`/admin/stores/${storeId}`);
}

export async function deleteStaff(staffId: string, storeId: string) {
    await prisma.staff.delete({
        where: { id: staffId }
    });

    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
}

export async function deleteStaffImage(imageId: string, staffId: string, storeId: string) {
    await prisma.staffImage.delete({
        where: { id: imageId }
    });

    revalidatePath(`/admin/stores/${storeId}/staff/${staffId}`);
    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
}

export async function toggleStaffWorking(staffId: string, storeId: string, isWorking: boolean) {
    if (!staffId) return;

    await prisma.staff.update({
        where: { id: staffId },
        data: { isWorkingToday: isWorking }
    });

    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
}
