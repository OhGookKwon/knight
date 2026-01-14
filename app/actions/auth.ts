'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { error: 'Please fill in all fields' };
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: { username }
    });

    // Very simple password check (In production, use bcrypt/argon2)
    if (!user || user.password !== password) {
        return { error: 'Invalid credentials' };
    }

    // Set session cookie
    (await cookies()).set('session', JSON.stringify({
        id: user.id,
        role: user.role,
        username: user.username
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    redirect('/admin');
}

export async function logout() {
    (await cookies()).delete('session');
    redirect('/login');
}
