import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateStore, deleteStore } from "@/app/actions/store";
import { deleteReview } from "@/app/actions/review";
import { ChevronLeft, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from "@/app/components/DeleteButton";
import SubmitButton from "@/app/components/SubmitButton";
import { cookies } from "next/headers";

export default async function ManageStorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const store = await prisma.store.findUnique({
        where: { id },
        include: { staffs: true, images: true, reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } } }
    });

    if (!store) return notFound();

    const updateStoreWithId = updateStore.bind(null, store.id);

    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    // Ownership Check
    if (user.role !== 'SUPER_ADMIN' && store.ownerId !== user.id) {
        redirect('/admin');
    }

    const isSuperAdmin = user.role === 'SUPER_ADMIN';

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin" className="p-2 -ml-2 text-gray-400 hover:text-white">
                    <ChevronLeft />
                </Link>
                <h1 className="text-xl font-bold text-white">가게 정보 수정</h1>
            </div>

            <form action={updateStoreWithId} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-4 bg-pink-500 rounded-full" /> 기본 정보
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">가게명</label>
                            <input
                                name="name"
                                defaultValue={store.name}
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">지역</label>
                            <select
                                name="region"
                                defaultValue={store.region}
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            >
                                <option value="KABUKICHO">가부키초</option>
                                <option value="SHIN_OKUBO">신오쿠보</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">주소</label>
                        <input
                            name="address"
                            defaultValue={store.address || ''}
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                        />
                    </div>
                </section>

                {/* System Info */}
                <section className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full" /> 시스템 & 가격
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">영업 시간</label>
                            <input
                                name="openingHours"
                                defaultValue={store.openingHours || ''}
                                placeholder="예: 19:00 - 05:00"
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">기본 요금</label>
                            <input
                                name="basicCharge"
                                defaultValue={store.basicCharge || ''}
                                placeholder="예: 60분 3000엔"
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">시스템 설명</label>
                        <textarea
                            name="systemDescription"
                            defaultValue={store.systemDescription || ''}
                            rows={4}
                            placeholder="시스템, 연장 요금 등을 설명해주세요."
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 resize-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">공지사항</label>
                        <input
                            name="notice"
                            defaultValue={store.notice || ''}
                            placeholder="짧은 공지사항을 입력하세요..."
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                        />
                    </div>
                </section>

                {/* Media */}
                <section className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-4 bg-purple-500 rounded-full" /> 이미지
                    </h2>

                    {/* Main Image */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">메인 이미지</label>
                        {store.mainImage && (
                            <div className="relative h-40 w-full rounded-xl overflow-hidden mb-2 border border-gray-800">
                                <img src={store.mainImage} alt="Main" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input type="hidden" name="mainImage" value={store.mainImage || ''} />
                        <input
                            type="file"
                            name="mainImageFile"
                            accept="image/*"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        />
                    </div>

                    {/* Menu Image */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">이벤트 이미지</label>
                        {store.menuImage && (
                            <div className="relative h-40 w-full rounded-xl overflow-hidden mb-2 border border-gray-800">
                                <img src={store.menuImage} alt="Menu" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input type="hidden" name="menuImage" value={store.menuImage || ''} />
                        <input
                            type="file"
                            name="menuImageFile"
                            accept="image/*"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        />
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-2 pt-4 border-t border-gray-800">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">갤러리 (최대 8장)</label>

                        {/* Existing Gallery Images */}
                        {store.images && store.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {store.images.map((img: any) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 group">
                                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="text-xs text-red-500 flex items-center gap-1 cursor-pointer">
                                                <input type="checkbox" name="deleteImageIds" value={img.id} className="w-4 h-4" />
                                                삭제
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="file"
                            name="galleryImages"
                            accept="image/*"
                            multiple
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">여러 장의 이미지를 선택할 수 있습니다. 이미지를 삭제하려면 체크박스를 선택하고 저장하세요.</p>
                    </div>
                </section>

                {/* Store Settings (Visibility & Tags) */}
                <section className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full" /> 가게 설정
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-gray-800/50">
                            <input
                                type="checkbox"
                                name="isVisible"
                                id="isVisible"
                                defaultChecked={store.isVisible}
                                className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-pink-600 focus:ring-pink-500"
                            />
                            <label htmlFor="isVisible" className="text-sm font-bold text-white cursor-pointer select-none">
                                공개 설정 (현재: {store.isVisible ? '공개중' : '비공개'})
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">태그 (쉼표로 구분)</label>
                            <input
                                name="tags"
                                defaultValue={store.tags || ''}
                                placeholder="예: 케이팝, 소주, 댄스, 헌팅"
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-600"
                            />
                        </div>
                    </div>
                </section>

                <SubmitButton
                    text="변경사항 저장"
                    loadingText="저장 중..."
                    className="shadow-lg shadow-pink-900/20"
                />
            </form>

            {/* Delete Store Section */}
            {isSuperAdmin && (
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <DeleteButton
                        entityName="가게"
                        onDelete={deleteStore.bind(null, store.id)}
                        className="w-full bg-black hover:bg-red-900/20 text-red-500 font-bold py-4 rounded-xl transition-colors border border-gray-800 flex items-center justify-center gap-2"
                    />
                    <p className="text-center text-gray-600 text-xs mt-2">이 작업은 되돌릴 수 없습니다.</p>
                </div>
            )}

            {/* Staff Management */}
            <section className="mt-12 pt-8 border-t border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">직원 관리</h2>
                    <Link
                        href={`/admin/stores/${id}/staff/new`}
                        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                        + 직원 추가
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {store.staffs.map((staff: any) => (
                        <Link
                            key={staff.id}
                            href={`/admin/stores/${id}/staff/${staff.id}`}
                            className="block bg-gray-900/50 border border-gray-800 rounded-xl p-3 hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                                    {staff.profileImage ? (
                                        <img src={staff.profileImage} alt={staff.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                            <UserRound className="text-gray-500 w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{staff.name}</div>
                                    <div className="text-gray-500 text-xs">Lv.{staff.koreanLevel}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {store.staffs.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500 text-sm bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                            등록된 직원이 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* Review Management (Super Admin Only) */}
            {isSuperAdmin && (
                <section className="mt-12 pt-8 border-t border-gray-800 space-y-6">
                    <h2 className="text-xl font-bold text-white">리뷰 관리</h2>
                    <div className="space-y-4">
                        {store.reviews.map((review: any) => (
                            <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-500 font-bold">
                                            {review.user?.username?.[0] || '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{review.user?.username || 'Unknown'}</div>
                                            <div className="text-xs text-yellow-500">★ {review.rating}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DeleteButton
                                            entityName="리뷰"
                                            onDelete={deleteReview.bind(null, review.id, store.id)}
                                            className="text-xs text-red-500 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                                        />
                                    </div>
                                </div>
                                <form action={async (formData) => {
                                    'use server';
                                    const { updateReview } = await import("@/app/actions/review");
                                    await updateReview(review.id, store.id, formData);
                                }} className="group">
                                    <textarea
                                        name="content"
                                        defaultValue={review.content}
                                        className="w-full bg-transparent border-none text-sm text-gray-300 focus:bg-gray-800 focus:p-2 rounded resize-none"
                                    />
                                    <input type="hidden" name="rating" value={review.rating} />
                                    <button type="submit" className="hidden group-focus-within:block text-xs bg-blue-600 text-white px-3 py-1 rounded mt-2">수정 저장</button>
                                </form>
                            </div>
                        ))}
                        {store.reviews.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                                리뷰가 없습니다.
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
