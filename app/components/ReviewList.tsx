import { Star, User } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Helper to format date
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(date);
};

export default async function ReviewList({ storeId }: { storeId: string }) {
    const reviews = await prisma.review.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500 text-sm">
                No reviews yet. Be the first to write one!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                <User size={14} className="text-gray-400" />
                            </div>
                            <span className="text-sm font-bold text-white">
                                {review.nickname || "손님"}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600">{formatDate(review.createdAt)}</span>
                    </div>

                    <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"}
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">
                        {review.content}
                    </p>
                </div>
            ))}
        </div>
    );
}
