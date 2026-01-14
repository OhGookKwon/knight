'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Verify Super Admin
async function verifySuperAdmin() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return false;

    const user = JSON.parse(session.value);
    return user.role === 'SUPER_ADMIN';
}

export async function updateUser(userId: string, formData: FormData) {
    if (!await verifySuperAdmin()) {
        throw new Error("Unauthorized");
    }

    const password = formData.get('password') as string;

    // Only update if password is provided
    const data: any = {};
    if (password && password.trim() !== '') {
        data.password = password;
    }

    if (Object.keys(data).length > 0) {
        await prisma.user.update({
            where: { id: userId },
            data
        });
    }

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);
}

export async function createUser(formData: FormData) {
    if (!await verifySuperAdmin()) {
        throw new Error("Unauthorized");
    }

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!username || !password) {
        throw new Error("Missing fields");
    }

    await prisma.user.create({
        data: {
            username,
            password,
            role: role || 'OWNER'
        }
    });

    revalidatePath('/admin/users');
    redirect('/admin/users');
}

export async function assignStore(userId: string, storeId: string) {
    if (!await verifySuperAdmin()) {
        throw new Error("Unauthorized");
    }

    await prisma.store.update({
        where: { id: storeId },
        data: { ownerId: userId }
    });

    revalidatePath(`/admin/users/${userId}`);
}

export async function unassignStore(storeId: string, userId: string) {
    if (!await verifySuperAdmin()) {
        throw new Error("Unauthorized");
    }

    await prisma.store.update({
        where: { id: storeId },
        data: { ownerId: null }
    });

    revalidatePath(`/admin/users/${userId}`);
}
