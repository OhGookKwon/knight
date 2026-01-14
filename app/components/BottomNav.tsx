'use client';

import Link from 'next/link';
import { Home, Search, Heart, User, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function BottomNav() {
    const pathname = usePathname();

    // Hide on Admin pages
    if (pathname?.startsWith('/admin')) return null;

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Search, label: 'Search', href: '/search' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-[80px] bg-[var(--md-sys-color-surface-container)] flex items-center justify-around px-2 pb-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col items-center gap-1 group w-full"
                    >
                        <div className={cn(
                            "w-16 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
                            isActive
                                ? "bg-[var(--md-sys-color-secondary-container)]"
                                : "group-hover:bg-[var(--md-sys-color-surface-container-highest)]"
                        )}>
                            <item.icon
                                size={24}
                                className={cn(
                                    isActive
                                        ? "text-[var(--md-sys-color-on-secondary-container)]"
                                        : "text-[var(--md-sys-color-on-surface-variant)]"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </div>
                        <span className={cn(
                            "text-[12px] font-medium transition-colors",
                            isActive
                                ? "text-[var(--md-sys-color-on-surface)]"
                                : "text-[var(--md-sys-color-on-surface-variant)]"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </div>
    );
}
