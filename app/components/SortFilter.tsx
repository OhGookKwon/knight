'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SortFilter() {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'rating'; // Default to rating as per common app behavior, or user preference? User asked for "Rating order, Newest order". Let's default to rating or newest. Let's stick to 'newest' as the implicit default if null, but 'rating' if specified.

    // Let's make "Rating" the default fallback if nothing is selected.
    const activeSort = searchParams.get('sort') || 'rating';

    return (
        <div className="flex items-center gap-3 text-sm font-bold">
            <Link
                href="/?sort=rating"
                className={cn(
                    "transition-colors",
                    activeSort === 'rating' ? "text-white" : "text-gray-500 hover:text-gray-300"
                )}
            >
                별점순
            </Link>
            <span className="text-gray-700">|</span>
            <Link
                href="/?sort=newest"
                className={cn(
                    "transition-colors",
                    activeSort === 'newest' ? "text-white" : "text-gray-500 hover:text-gray-300"
                )}
            >
                등록순
            </Link>
        </div>
    );
}
