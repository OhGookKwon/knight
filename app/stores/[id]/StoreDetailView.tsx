'use client';

import * as Tabs from '@radix-ui/react-tabs';
import StaffSection from "@/app/components/StaffSection";
import ReviewForm from "@/app/components/ReviewForm";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Store {
    id: string;
    address: string | null;
    openingHours: string | null;
    basicCharge: string | null;
    systemDescription: string | null;
    menuImage: string | null;
    staffDescription: string | null;
    notice: string | null;
}

interface Staff {
    id: string;
    name: string;
    koreanLevel: number;
    styleTags: string | null;
    videoUrl: string | null;
    profileImage: string | null;
    age: number | null;
    language: string | null;
    isWorkingToday: boolean;
}

interface StoreImage {
    id: string;
    url: string;
    caption: string | null;
}

interface StoreClientViewProps {
    store: Store;
    staffs: Staff[];
    reviewsCount: number;
    images?: StoreImage[];
    reviewsComponent: React.ReactNode;
}

export default function StoreDetailView({ store, staffs, reviewsCount, images = [], reviewsComponent }: StoreClientViewProps) {
    return (
        <Tabs.Root defaultValue="intro" className="flex flex-col">
            {/* Tabs List */}
            <Tabs.List className="flex p-1.5 glass-panel rounded-2xl mb-8">
                <Tabs.Trigger
                    value="intro"
                    className="flex-1 py-2.5 text-xs font-bold text-gray-400 rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg hover:text-white data-[state=active]:hover:text-black"
                >
                    소개
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="staff"
                    className="flex-1 py-2.5 text-xs font-bold text-gray-400 rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg hover:text-white data-[state=active]:hover:text-black"
                >
                    전체 직원
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="system"
                    className="flex-1 py-2.5 text-xs font-bold text-gray-400 rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg hover:text-white data-[state=active]:hover:text-black"
                >
                    시스템
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="map"
                    className="flex-1 py-2.5 text-xs font-bold text-gray-400 rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg hover:text-white data-[state=active]:hover:text-black"
                >
                    지도
                </Tabs.Trigger>
            </Tabs.List>

            {/* Introduction Content (Working Staff + Gallery + Reviews) */}
            <Tabs.Content value="intro" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-12">

                {/* Working Staff Section */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            오늘 출근
                        </h2>
                    </div>
                    {staffs.filter(s => s.isWorkingToday).length > 0 ? (
                        <StaffSection staffs={staffs.filter(s => s.isWorkingToday)} />
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-sm">현재 출근한 직원이 없습니다.</p>
                            <p className="text-xs mt-1">"전체 직원" 탭에서 전체 명단을 확인하세요.</p>
                        </div>
                    )}
                </div>

                {/* Gallery Section */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">갤러리</h2>
                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {images.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img src={img.url} alt={img.caption || "Gallery Image"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        {img.caption && <span className="text-xs font-medium text-white">{img.caption}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>이미지가 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        리뷰
                        <span className="text-xs font-normal text-gray-500 ml-auto">({reviewsCount})</span>
                    </h2>
                    <ReviewForm storeId={store.id} />
                    {reviewsComponent}
                </div>

            </Tabs.Content>

            {/* All Staff Content */}
            <Tabs.Content value="staff" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-white mb-4">전체 직원 명단</h2>

                {store.staffDescription && (
                    <div className="mb-6 glass-panel p-5 rounded-2xl border-l-2 border-yellow-500 bg-yellow-500/5">
                        <h3 className="text-xs font-bold text-yellow-500 mb-2 uppercase">Staff Concept</h3>
                        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{store.staffDescription}</p>
                    </div>
                )}

                <div className="grid gap-3">
                    <StaffSection staffs={staffs} />
                </div>
            </Tabs.Content>

            {/* System Content */}
            <Tabs.Content value="system" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-white mb-4">시스템 정보</h2>
                <div className="glass-panel p-6 rounded-2xl space-y-6 text-sm text-gray-300">

                    {store.notice && (
                        <div className="bg-pink-500/10 border border-pink-500/20 p-3 rounded-xl">
                            <h3 className="text-xs font-bold text-pink-400 mb-1">📢 공지사항</h3>
                            <p className="text-sm text-gray-200">{store.notice}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">영업 시간</p>
                            <p className="text-white text-base">{store.openingHours || '정보 없음'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">기본 요금</p>
                            <p className="text-white text-base">{store.basicCharge || '정보 없음'}</p>
                        </div>
                    </div>

                    {store.systemDescription && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">시스템 설명</p>
                            <div className="leading-relaxed whitespace-pre-wrap">{store.systemDescription}</div>
                        </div>
                    )}

                    {store.menuImage && (
                        <div className="pt-2">
                            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase">이벤트</h3>
                            <div className="rounded-xl overflow-hidden border border-white/10">
                                <img src={store.menuImage} alt="Menu" className="w-full h-auto" />
                            </div>
                        </div>
                    )}
                </div>
            </Tabs.Content>

            {/* Map Content */}
            <Tabs.Content value="map" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-white mb-4">찾아오는 길</h2>
                {store.address ? (
                    <div className="glass-panel p-5 rounded-2xl space-y-4">
                        <div className="rounded-xl overflow-hidden border border-white/10 h-[400px] bg-gray-900">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-pink-500 text-lg">📍</span>
                            {store.address}
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 glass-panel rounded-2xl">
                        <p>No address information available.</p>
                    </div>
                )}
            </Tabs.Content>
        </Tabs.Root>
    );
}
