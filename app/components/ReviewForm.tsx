'use client';

import { useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { submitReview } from '@/app/actions/review';
import SubmitButton from './SubmitButton';

export default function ReviewForm({ storeId }: { storeId: string }) {
    const [rating, setRating] = useState(5);
    // const [isSubmitting, setIsSubmitting] = useState(false); // Removed in favor of useFormStatus

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        try {
            await submitReview(storeId, formData);
            formRef.current?.reset(); // Clear text inputs
            setRating(5); // Reset rating
            alert("리뷰가 접수되었습니다. 관리자 승인 후 게시됩니다.");
        } catch (error) {
            console.error(error);
            alert("이미 작성하셨거나, 하루에 한 번만 작성 가능합니다.");
        }
    };

    return (
        <div className="bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-800 mb-6">
            <h3 className="text-sm font-bold text-white mb-3">리뷰 작성하기</h3>
            <form ref={formRef} action={handleSubmit} className="space-y-3">
                {/* Star Rating Input */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                size={24}
                                className={star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"}
                            />
                        </button>
                    ))}
                    <input type="hidden" name="rating" value={rating} />
                </div>
                <input
                    name="nickname"
                    placeholder="이름 (닉네임)"
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500"
                />
                <textarea
                    name="content"
                    placeholder="방문 경험은 어떠셨나요?"
                    required
                    rows={3}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500 resize-none"
                />
                <SubmitButton
                    text="리뷰 등록"
                    loadingText="등록 중..."
                    className="w-full py-3 text-sm"
                />
            </form>
        </div>
    );
}
