'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    mediaType?: 'video' | 'image';
}

export default function VideoModal({ isOpen, onClose, videoUrl, mediaType = 'video' }: VideoModalProps) {
    const isEmbed = videoUrl.includes('tiktok.com') || videoUrl.includes('instagram.com') || videoUrl.includes('youtube.com');

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                {/* Overlay with fade-in animation */}
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm animate-fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />

                {/* Content */}
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
                    <Dialog.Title className="sr-only">Staff Media Viewer</Dialog.Title>

                    {/* Close Button */}
                    <div className="absolute -top-12 right-0 flex justify-end">
                        <Dialog.Close asChild>
                            <button className="text-white hover:text-pink-500 transition-colors p-2 rounded-full glass-button">
                                <X size={24} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800">
                        {mediaType === 'image' ? (
                            <img
                                src={videoUrl}
                                alt="Staff"
                                className="w-full h-full object-cover"
                            />
                        ) : isEmbed ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center p-6">
                                    <p className="mb-4 text-sm text-gray-300">External embeds require SDK integration.</p>
                                    <a
                                        href={videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-700 transition-colors"
                                    >
                                        Open App to Watch
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <video
                                    src={videoUrl}
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    playsInline
                                    loop
                                />
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
