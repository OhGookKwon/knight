'use client';

import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('q');
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query.toString())}`);
        }
    };

    return (
        <div className="sticky top-0 z-50 h-[64px] px-4 flex items-center justify-between bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline-variant)]">
            <Link href="/">
                <div className="flex flex-col">
                    <Image
                        src="/logo.png"
                        alt="K-NIGHT"
                        width={120}
                        height={40}
                        className="object-contain h-8 w-auto"
                    />
                </div>
            </Link>

            <form onSubmit={handleSearch} className="relative flex-1 max-w-[200px] ml-4">
                <input
                    type="text"
                    name="q"
                    placeholder="Search..."
                    className="w-full h-10 pl-10 pr-4 rounded-full bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] text-sm placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--md-sys-color-primary)] transition-all"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" />
            </form>
        </div>
    );
}
