import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoreCard from "@/app/components/StoreCard";
import Header from "@/app/components/Header";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";

    const stores = query ? await prisma.store.findMany({
        where: {
            OR: [
                { name: { contains: query } },
                { region: { contains: query } },
                // Add more fields if needed, e.g. system description
            ]
        },
        include: {
            reviews: {
                select: { rating: true }
            }
        }
    }) : [];

    return (
        <div className="relative pb-28 min-h-screen">
            <div className="sticky top-0 z-50 h-[64px] px-4 flex items-center gap-4 bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline-variant)]">
                <Link href="/">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-highest)] transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
                <div className="flex-1">
                    <form action="/search" className="relative w-full">
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="Search..."
                            autoFocus
                            className="w-full h-10 pl-4 pr-4 rounded-full bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] text-sm placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--md-sys-color-primary)] transition-all"
                        />
                    </form>
                </div>
            </div>

            <div className="p-5 space-y-6">
                <h2 className="text-[22px] font-normal text-[var(--md-sys-color-on-surface)]">
                    {query ? `Results for "${query}"` : "Search"}
                </h2>

                {stores.length > 0 ? (
                    <div className="space-y-4">
                        {stores.map((store: any) => {
                            const averageRating = store.reviews.length > 0
                                ? store.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / store.reviews.length
                                : 0;

                            return (
                                <StoreCard
                                    key={store.id}
                                    id={store.id}
                                    name={store.name}
                                    region={store.region}
                                    mainImage={store.mainImage}
                                    tags={store.tags ? store.tags.split(',') : []} // Parse tags
                                    rating={averageRating}
                                    likes={store.likes}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--md-sys-color-on-surface-variant)]">
                        <p>No results found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
