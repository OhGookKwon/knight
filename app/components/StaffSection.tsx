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
                        className="active:scale-95 transition-transform"
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
                            onVideoClick={() => staff.videoUrl && setSelectedVideo(staff.videoUrl)}
                            onPhotoClick={() => setSelectedGalleryStaff(staff)}
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
