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

    // New fields
    const rawAge = formData.get('age');
    const age = rawAge ? parseInt(rawAge as string) : null;
    const language = formData.get('language') as string;

    if (isNaN(koreanLevel)) {
        throw new Error("Invalid Korean Level");
    }

    await prisma.staff.create({
        data: {
            name,
            koreanLevel,
            styleTags,
            videoUrl,
            profileImage,
            age,
            language,
            isWorkingToday: formData.get('isWorkingToday') === 'on',
            storeId
        }
    });

    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
    redirect(`/admin/stores/${storeId}`);
}

export async function updateStaff(staffId: string, storeId: string, formData: FormData) {
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
