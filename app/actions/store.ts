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

    // Handle File Uploads or URLs
    const mainImageFile = formData.get('mainImageFile') as File | null;
    const mainImageUrl = formData.get('mainImageUrl') as string;

    const menuImageFile = formData.get('menuImageFile') as File | null;
    const menuImageUrl = formData.get('menuImageUrl') as string;

    let mainImage = formData.get('mainImage') as string;
    let menuImage = formData.get('menuImage') as string;

    // Main Image Logic: Upload > URL > Existing
    const uploadedMain = await uploadFile(mainImageFile);
    if (uploadedMain) {
        mainImage = uploadedMain;
    } else if (mainImageUrl && mainImageUrl.trim() !== '') {
        mainImage = mainImageUrl.trim();
    }

    // Menu Image Logic: Upload > URL > Existing
    const uploadedMenu = await uploadFile(menuImageFile);
    if (uploadedMenu) {
        menuImage = uploadedMenu;
    } else if (menuImageUrl && menuImageUrl.trim() !== '') {
        menuImage = menuImageUrl.trim();
    }

    // Handle Deletion Flags
    if (formData.get('deleteMenuImage') === 'on') {
        menuImage = null as any;
    }

    // New Fields
    const openingHours = formData.get('openingHours') as string;
    const basicCharge = formData.get('basicCharge') as string;
    const systemDescription = formData.get('systemDescription') as string;
    const staffDescription = formData.get('staffDescription') as string;
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
            staffDescription,
            mainImage,
            openingHours,
            basicCharge,
            systemDescription,
            menuImage,
            notice,
            isVisible,

            tags,
            autoApproveReviews: formData.get('autoApproveReviews') === 'on'
        }
    });

    // Handle Gallery Deletion
    const deleteImageIds = formData.getAll('deleteImageIds') as string[];
    if (deleteImageIds.length > 0) {
        await prisma.storeImage.deleteMany({
            where: {
                id: { in: deleteImageIds },
                storeId: storeId
            }
        });
    }

    // Handle Gallery Uploads (Files)
    const galleryFiles = formData.getAll('galleryImages') as File[];
    for (const file of galleryFiles) {
        if (file.size > 0) {
            const url = await uploadFile(file);
            if (url) {
                await prisma.storeImage.create({
                    data: { url, storeId }
                });
            }
        }
    }

    // Handle Gallery URLs (Text)
    const galleryUrlsStr = formData.get('galleryImageUrls') as string;
    if (galleryUrlsStr) {
        const urls = galleryUrlsStr.split(/\r?\n/).map(u => u.trim()).filter(u => u !== '');
        for (const url of urls) {
            await prisma.storeImage.create({
                data: { url, storeId }
            });
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
