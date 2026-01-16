'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StaffGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    images: { id: string, url: string }[];
    staffName: string;
}

export default function StaffGallery({ isOpen, onClose, images, staffName }: StaffGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset index when modal opens
    useEffect(() => {
        if (isOpen) setCurrentIndex(0);
    }, [isOpen]);

    if (!images || images.length === 0) return null;

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
                    <div className="relative w-full max-w-[400px] aspect-[3/4] bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col">

                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                            <span className="text-white font-bold drop-shadow-md">{staffName}</span>
                            <button onClick={onClose} className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Image */}
                        <div className="flex-1 relative flex items-center justify-center bg-gray-900">
                            <img
                                key={currentIndex}
                                src={images[currentIndex].url}
                                alt={`${staffName} - ${currentIndex + 1}`}
                                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-200"
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer / Indicators */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-2 z-10 bg-gradient-to-t from-black/60 to-transparent">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
