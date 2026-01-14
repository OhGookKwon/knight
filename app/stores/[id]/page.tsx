import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
import StaffSection from "@/app/components/StaffSection";
import ReviewList from "@/app/components/ReviewList";
import ReviewForm from "@/app/components/ReviewForm";
import { MapPin, ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import StoreDetailView from "./StoreDetailView";

export default async function StorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const store = await prisma.store.findUnique({
        where: { id },
        include: {
            staffs: true,
            reviews: true,
            images: true
        }
    }) as any;

    const averageRating = store?.reviews.length > 0
        ? store.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / store.reviews.length
        : 0;

    if (!store) return notFound();

    return (
        <div className="pb-32 bg-black min-h-screen">
            {/* Header Image */}
            <div className="relative h-80 w-full">
                {store.mainImage && (
                    <img src={store.mainImage} alt={store.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

                <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-20">
                    <Link href="/" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-white">{averageRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({store.reviews.length})</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 -mt-12 relative z-10">
                <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]">확인함</span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold glass-button text-gray-300">{store.region}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight drop-shadow-xl">{store.name}</h1>
                    <p className="text-sm text-gray-400 flex items-center gap-1.5 font-medium">
                        <MapPin size={14} className="text-pink-500" />
                        {store.address}
                    </p>
                </div>

                <StoreDetailView
                    store={store}
                    staffs={store.staffs}
                    reviewsCount={store.reviews.length}
                    images={store.images}
                    reviewsComponent={<ReviewList storeId={store.id} />}
                />
            </div>
        </div>
    );
}
