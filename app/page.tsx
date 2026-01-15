import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Fragment } from "react";
import StoreCard from "./components/StoreCard";
import GoogleAd from "./components/GoogleAd";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SortFilter from "./components/SortFilter";
import { Sparkles, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams;
  const currentSort = sort || 'rating'; // Default to rating

  let stores: any[] = [];
  try {
    stores = await prisma.store.findMany({
      where: { isVisible: true },
      include: {
        reviews: {
          select: { rating: true }
        },
        _count: {
          select: { reviews: true }
        }
      },
      // If sort is 'newest', we can optimize with DB sort.
      // If 'rating' (default), we fetch all then sort in JS.
      orderBy: currentSort === 'newest' ? { createdAt: 'desc' } : undefined,
    });

    // Calculate Average Rating for each store
    stores = stores.map(store => {
      const averageRating = store.reviews.length > 0
        ? store.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / store.reviews.length
        : 0;
      return { ...store, averageRating };
    });

    // If sort is 'rating', sort by averageRating descending
    if (currentSort === 'rating') {
      stores.sort((a, b) => b.averageRating - a.averageRating);
    }

  } catch (e) {
    console.error("Failed to fetch stores:", e);
  }

  return (
    <div className="relative pb-28 min-h-screen">
      {/* Background handled by body */}

      <Header />

      <div className="p-5 space-y-8 relative z-10">

        {/* Hero Section */}
        <HeroSection />

        {/* Sorting Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Trending Now
          </h2>
          <SortFilter />
        </div>

        {/* Store List */}
        <div className="space-y-6">
          <div className="space-y-4">
            {stores.map((store: any, index: number) => {
              return (
                <Fragment key={store.id}>
                  <StoreCard
                    id={store.id}
                    name={store.name}
                    region={store.region}
                    mainImage={store.mainImage}
                    tags={store.tags ? store.tags.split(',').map((t: string) => t.trim()) : []}
                    rating={Number(store.averageRating.toFixed(1))}
                    likes={store.likes} // Pass likes
                  />
                  {(index + 1) % 2 === 0 && <GoogleAd />}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
