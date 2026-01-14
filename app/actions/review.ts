'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function submitReview(storeId: string, formData: FormData) {
    const rawRating = formData.get('rating');
    const rating = rawRating ? parseInt(rawRating as string) : 5;
    const content = formData.get('content') as string;
    const nickname = formData.get('nickname') as string;

    if (isNaN(rating)) {
        throw new Error("Invalid Rating");
    }

    const cookieStore = await cookies();
    const hasReviewed = cookieStore.get(`reviewed_${storeId}`);

    if (hasReviewed) {
        throw new Error("이미 리뷰를 작성하셨습니다.");
    }

    // Find a valid user to attribute the review to (Demo mode)
    // In production, this comes from session
    let user = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
    });

    if (!user) {
        // Fallback: Find ANY user
        user = await prisma.user.findFirst();
    }

    // If absolutely no user exists, creates one (Edge case)
    if (!user) {
        user = await prisma.user.create({
            data: {
                username: 'guest_reviewer',
                password: 'guest_password_123',
                role: 'USER'
            }
        });
    }

    await prisma.review.create({
        data: {
            rating,
            content,
            nickname: nickname || '손님',
            storeId,
            userId: user.id,
        }
    });

    // Mark as reviewed for this session
    cookieStore.set(`reviewed_${storeId}`, 'true', { maxAge: 60 * 60 * 24 }); // 24 hours

    revalidatePath(`/stores/${storeId}`);
}

export async function deleteReview(reviewId: string, storeId: string) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) throw new Error("Unauthorized");

    const user = JSON.parse(session.value);
    if (user.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    await prisma.review.delete({
        where: { id: reviewId }
    });

    revalidatePath(`/admin/stores/${storeId}`);
}

export async function updateReview(reviewId: string, storeId: string, formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) throw new Error("Unauthorized");

    const user = JSON.parse(session.value);
    if (user.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string);

    await prisma.review.update({
        where: { id: reviewId },
        data: { content, rating }
    });

    revalidatePath(`/admin/stores/${storeId}`);
}
