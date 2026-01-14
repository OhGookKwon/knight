'use client';

import { login } from "@/app/actions/auth";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
            {pending ? 'Logging in...' : 'Enter K-Night'}
        </button>
    );
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const res = await login(formData);
        if (res?.error) setError(res.error);
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black -z-10" />

            <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white">
                <ChevronLeft size={24} />
            </Link>

            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                        ADMIN ACCESS
                    </h1>
                    <p className="text-gray-500 text-sm">Owner & Staff Login</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <div className="text-center">
                    <p className="text-xs text-gray-600">
                        Forgot access? Contact <a href="#" className="underline hover:text-gray-400">Super Admin</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
