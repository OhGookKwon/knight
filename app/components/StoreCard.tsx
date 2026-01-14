import Link from 'next/link';
import { MapPin, Star, Heart } from 'lucide-react';

interface StoreCardProps {
    id: string;
    name: string;
    mainImage: string | null;
    region: string;
    rating?: number; // Optional now, or derived
    tags?: string[]; // "Hot", "New" etc
    likes?: number;
}

export default function StoreCard({ id, name, mainImage, region, rating = 5.0, tags = [], likes = 0 }: StoreCardProps) {
    return (
        <Link href={`/stores/${id}`} className="block group">
            <div className="m3-card overflow-hidden h-full flex flex-col group-hover:scale-[1.01] group-hover:shadow-lg transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-[200px] w-full bg-[var(--md-sys-color-surface-container-highest)]">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src="https://images.unsplash.com/photo-1570969634568-1250262c5b9f?q=80&w=400&auto=format&fit=crop"
                            alt="Store Placeholder"
                            className="h-full w-full object-cover grayscale opacity-50"
                        />
                    )}
                    {/* Region Badge */}
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-md bg-[var(--md-sys-color-surface)]/80 backdrop-blur-sm text-[var(--md-sys-color-on-surface)] text-[11px] font-medium border border-[var(--md-sys-color-outline-variant)]">
                            {region === 'KABUKICHO' ? '가부키초' : region === 'SHIN_OKUBO' ? '신오쿠보' : region}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-[var(--md-sys-color-on-surface)] text-[16px] font-medium leading-tight">
                            {name}
                        </h3>
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <Star size={14} className="fill-[var(--md-sys-color-primary)] text-[var(--md-sys-color-primary)]" />
                            <span className="text-[12px] font-bold text-[var(--md-sys-color-on-surface-variant)]">{rating}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-auto">
                        {tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[11px] text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)] px-2 py-0.5 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
