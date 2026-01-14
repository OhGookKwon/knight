import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoreCard from "./components/StoreCard";
import Header from "./components/Header";
import { Sparkles, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
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
      }
    });
  } catch (e) {
    console.error("Failed to fetch stores:", e);
    // You could render an error state variable here if needed, 
    // but for now an empty list prevents the crash.
  }

  return (
    <div className="relative pb-28 min-h-screen">
      {/* Background handled by body */}

      <Header />

      <div className="p-5 space-y-8 relative z-10">




        {/* Store List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between animate-fade-in delay-300 px-1">
            <h2 className="text-xl font-bold text-white">
              Trending Now
            </h2>
          </div>

          <div className="space-y-4">
            {stores.map((store: any) => {
              const averageRating = store.reviews.length > 0
                ? store.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / store.reviews.length
                : 0; // Default to 0 instead of 5 if no reviews

              return (
                <StoreCard
                  key={store.id}
                  id={store.id}
                  name={store.name}
                  region={store.region}
                  mainImage={store.mainImage}
                  tags={store.tags ? store.tags.split(',').map((t: string) => t.trim()) : []}
                  rating={Number(averageRating.toFixed(1))}
                  likes={store.likes} // Pass likes
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
