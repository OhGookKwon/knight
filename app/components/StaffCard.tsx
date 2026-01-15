import { Play, UserRound } from 'lucide-react';

interface StaffCardProps {
    name: string;
    age: number | null;
    language: string | null;
    koreanLevel: number;
    styleTags: string | null;
    videoUrl: string | null;
    profileImage: string | null;
    isWorkingToday?: boolean;
}

export default function StaffCard({ name, age, language, koreanLevel, styleTags, videoUrl, profileImage, isWorkingToday }: StaffCardProps) {
    return (
        <div className="m3-card p-3 flex items-center gap-4 hover:bg-[var(--md-sys-color-surface-container)] transition-colors group cursor-pointer border border-transparent hover:border-[var(--md-sys-color-outline-variant)]">
            <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-[var(--md-sys-color-outline-variant)]">
                {profileImage ? (
                    <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                        <UserRound className="text-pink-300 w-8 h-8" />
                    </div>
                )}
                {videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-6 h-6 rounded-full bg-[var(--md-sys-color-primary-container)] flex items-center justify-center">
                            <Play size={10} className="text-[var(--md-sys-color-on-primary-container)] ml-0.5" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[16px] font-medium text-[var(--md-sys-color-on-surface)] truncate">{name}</h3>
                    {age && (
                        <span className="text-[12px] text-[var(--md-sys-color-on-surface-variant)]">({age})</span>
                    )}
                    <span className="text-[10px] bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)] px-1.5 py-0.5 rounded border border-[var(--md-sys-color-outline-variant)]">
                        한국어 Lv.{koreanLevel}
                    </span>
                </div>

                {language && (
                    <p className="text-[12px] text-[var(--md-sys-color-primary)] mb-0.5 truncate font-medium">
                        🗣 {language}
                    </p>
                )}

                {styleTags && (
                    <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] truncate">
                        {styleTags.split(',').map(t => `#${t.trim()}`).join(' ')}
                    </p>
                )}
            </div>

            <div className="flex flex-col items-end gap-2">
                {isWorkingToday && (
                    <span className="text-[10px] font-bold text-green-400 border border-green-500/30 px-2 py-1 rounded-full bg-green-500/10">
                        출근
                    </span>
                )}

                {videoUrl ? (
                    <button className="text-[12px] font-medium text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-outline)] px-4 py-1.5 rounded-full hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)] transition-colors whitespace-nowrap">
                        영상보기
                    </button>
                ) : profileImage && (
                    <button className="text-[12px] font-medium text-gray-400 border border-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap">
                        사진보기
                    </button>
                )}
            </div>
        </div>
    );
}
