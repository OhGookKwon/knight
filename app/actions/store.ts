'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFile } from "@/app/lib/upload";
import { cookies } from "next/headers";

export async function createStore() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    if (user.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    const store = await prisma.store.create({
        data: {
            name: "New Store",
            region: "KABUKICHO",
            isVisible: false
        }
    });

    revalidatePath('/admin');
    redirect(`/admin/stores/${store.id}`);
}

export async function updateStore(storeId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const region = formData.get('region') as string;
    const address = formData.get('address') as string;
    const description = formData.get('description') as string;

    // Handle File Uploads
    const mainImageFile = formData.get('mainImageFile') as File | null;
    const menuImageFile = formData.get('menuImageFile') as File | null;

    let mainImage = formData.get('mainImage') as string;
    let menuImage = formData.get('menuImage') as string;

    const uploadedMain = await uploadFile(mainImageFile);
    if (uploadedMain) mainImage = uploadedMain;

    const uploadedMenu = await uploadFile(menuImageFile);
    if (uploadedMenu) menuImage = uploadedMenu;

    // Handle Deletion Flags
    if (formData.get('deleteMenuImage') === 'on') {
        menuImage = null as any; // Allow null to clear the field in Prisma
    }

    // New Fields
    const openingHours = formData.get('openingHours') as string;
    const basicCharge = formData.get('basicCharge') as string;
    const systemDescription = formData.get('systemDescription') as string;
    const notice = formData.get('notice') as string;
    const isVisible = formData.get('isVisible') === 'on';
    // Link tags
    const tags = formData.get('tags') as string;

    // Update Store
    await prisma.store.update({
        where: { id: storeId },
        data: {
            name,
            region,
            address,
            description,
            mainImage,
            openingHours,
            basicCharge,
            systemDescription,
            menuImage,
            notice,
            isVisible,
            tags
        }
    });

    // Handle Gallery Deletion
    const deleteImageIds = formData.getAll('deleteImageIds') as string[];
    if (deleteImageIds.length > 0) {
        await prisma.storeImage.deleteMany({
            where: {
                id: { in: deleteImageIds },
                storeId: storeId // Security check to ensure it belongs to this store
            }
        });
    }

    // Handle Gallery Uploads
    const galleryFiles = formData.getAll('galleryImages') as File[];
    for (const file of galleryFiles) {
        if (file.size > 0) {
            const url = await uploadFile(file);
            if (url) {
                await prisma.storeImage.create({
                    data: {
                        url,
                        storeId
                    }
                });
            }
        }
    }

    revalidatePath('/admin');
    revalidatePath(`/admin/stores/${storeId}`);
    revalidatePath(`/stores/${storeId}`);
    redirect(`/admin/stores/${storeId}`);
}

export async function deleteStore(storeId: string) {
    if (!storeId) return;

    // Delete related data first (optional if cascade delete is set, but good practice)
    // Prisma usually handles cascade if defined in schema, but we can rely on onDelete: Cascade or manual cleanup.
    // Assuming simple delete for now.

    try {
        await prisma.$transaction([
            // Delete related records first
            prisma.storeImage.deleteMany({ where: { storeId } }),
            prisma.staff.deleteMany({ where: { storeId } }),
            prisma.review.deleteMany({ where: { storeId } }),
            prisma.event.deleteMany({ where: { storeId } }),
            // Finally delete the store
            prisma.store.delete({ where: { id: storeId } })
        ]);
    } catch (e) {
        console.error("Failed to delete store", e);
        throw e;
    }

    revalidatePath('/admin');
    redirect('/admin');
}
