'use client';

import { useState } from 'react';
import StaffCard from './StaffCard';
import VideoModal from './VideoModal';

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
}

export default function StaffSection({ staffs }: { staffs: Staff[] }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'video' | 'image' } | null>(null);

    return (
        <>
            <div className="space-y-3">
                {staffs.map(staff => (
                    <div
                        key={staff.id}
                        onClick={() => {
                            if (staff.videoUrl) {
                                setSelectedMedia({ url: staff.videoUrl, type: 'video' });
                            } else if (staff.profileImage) {
                                setSelectedMedia({ url: staff.profileImage, type: 'image' });
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
                        />
                    </div>
                ))}
            </div>

            {selectedMedia && (
                <VideoModal
                    isOpen={!!selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                    videoUrl={selectedMedia.url}
                    mediaType={selectedMedia.type}
                />
            )}
        </>
    );
}
