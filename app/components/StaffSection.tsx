'use client';

import { useState } from 'react';
import StaffCard from './StaffCard';
import VideoModal from './VideoModal';
import StaffGallery from './StaffGallery';

// Define the shape of Staff data (matching Prisma model basically)
interface Staff {
    id: string;
    name: string;
    age: number | null;
    language: string | null;
    koreanLevel: number;
    styleTags: string | null;
    videoUrl: string | null;
    profileImage: string | null;
    isWorkingToday: boolean;
    images?: { id: string, url: string }[];
}

export default function StaffSection({ staffs }: { staffs: Staff[] }) {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedGalleryStaff, setSelectedGalleryStaff] = useState<Staff | null>(null);

    return (
        <>
            <div className="space-y-3">
                {staffs.map(staff => (
                    <div
                        key={staff.id}
                        onClick={() => {
                            if (staff.videoUrl) {
                                setSelectedVideo(staff.videoUrl);
                            } else {
                                // Prepare images for gallery
                                // If staff has images relation, use it. 
                                // Also include profileImage as the first image if it exists and isn't already in the list?
                                // Usually profileImage is separate. Let's combine them for the gallery if needed, 
                                // or just show the 'images' collection. 
                                // User request implies "multiple photo registration" -> likely the 'images' relation.
                                // But easy wins: show profile image as first slide if exists.
                                setSelectedGalleryStaff(staff);
                            }
                        }}
                        className="cursor-pointer active:scale-95 transition-transform"
                    >
                        <StaffCard
                            name={staff.name}
                            age={staff.age}
                            language={staff.language}
                            koreanLevel={staff.koreanLevel}
                            styleTags={staff.styleTags}
                            videoUrl={staff.videoUrl}
                            profileImage={staff.profileImage}
                            isWorkingToday={staff.isWorkingToday}
                            imageCount={staff.images?.length || 0}
                        />
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    videoUrl={selectedVideo}
                    mediaType="video"
                />
            )}

            {/* Image Gallery Modal */}
            {selectedGalleryStaff && (
                <StaffGallery
                    isOpen={!!selectedGalleryStaff}
                    onClose={() => setSelectedGalleryStaff(null)}
                    staffName={selectedGalleryStaff.name}
                    images={[
                        // Combine profile image (if it's not a placeholder) and additional images
                        ...(selectedGalleryStaff.profileImage ? [{ id: 'profile', url: selectedGalleryStaff.profileImage }] : []),
                        ...(selectedGalleryStaff.images || [])
                    ]}
                />
            )}
        </>
    );
}
