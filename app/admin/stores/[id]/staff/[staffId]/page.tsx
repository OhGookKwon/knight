import { prisma } from "@/lib/prisma";
import { createStaff, updateStaff, deleteStaff, deleteStaffImage } from "@/app/actions/staff";
import { ChevronLeft, Trash2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from "@/app/components/DeleteButton";
import SubmitButton from "@/app/components/SubmitButton";
import { cookies } from "next/headers";

import DeleteImageFormButton from "@/app/components/DeleteImageFormButton";

function DeleteImageButton({ imageId, staffId, storeId }: { imageId: string, staffId: string, storeId: string }) {
    return (
        <form action={deleteStaffImage.bind(null, imageId, staffId, storeId)}>
            <DeleteImageFormButton />
        </form>
    );
}

export default async function StaffFormPage({ params }: { params: Promise<{ id: string, staffId: string }> }) {
    const { id, staffId } = await params;
    const isNew = staffId === 'new';

    // Verify ownership
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    // Fetch store to check owner (if not super admin)
    if (user.role !== 'SUPER_ADMIN') {
        const store = await prisma.store.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!store || store.ownerId !== user.id) {
            redirect('/admin');
        }
    }

    let staff = null;
    if (!isNew) {
        staff = await prisma.staff.findUnique({
            where: { id: staffId },
            include: { images: true }
        });
        if (!staff) redirect(`/admin/stores/${id}`);
    }

    // Bind actions
    const createAction = createStaff.bind(null, id);
    const updateAction = staff ? updateStaff.bind(null, staff.id, id) : () => { };
    const deleteAction = staff ? deleteStaff.bind(null, staff.id, id) : () => { };

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/admin/stores/${id}`} className="p-2 -ml-2 text-gray-400 hover:text-white">
                    <ChevronLeft />
                </Link>
                <h1 className="text-xl font-bold text-white">{isNew ? '직원 추가' : '직원 정보 수정'}</h1>
            </div>

            <form action={isNew ? createAction : updateAction} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">이름</label>
                    <input
                        name="name"
                        defaultValue={staff?.name}
                        required
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">나이</label>
                        <input
                            name="age"
                            type="number"
                            defaultValue={staff?.age || ''}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">언어</label>
                        <input
                            name="language"
                            defaultValue={staff?.language || ''}
                            placeholder="한국어, 일본어, 영어"
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">한국어 레벨 (1-5)</label>
                    <input
                        name="koreanLevel"
                        type="number"
                        min="1"
                        max="5"
                        defaultValue={staff?.koreanLevel || 1}
                        required
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">스타일 태그 (쉼표로 구분)</label>
                    <input
                        name="styleTags"
                        defaultValue={staff?.styleTags || ''}
                        placeholder="귀여운, 재미있는, 키큰"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">프로필 이미지</label>
                    {staff?.profileImage ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-800 mb-2">
                            <img src={staff.profileImage} alt={staff.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-800 mb-2 bg-gray-800 flex items-center justify-center">
                            <UserRound className="text-gray-500 w-8 h-8" />
                        </div>
                    )}
                    <input type="hidden" name="profileImage" value={staff?.profileImage || ''} />
                    <input
                        type="file"
                        name="profileImageFile"
                        accept="image/*"
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                </div>

                {/* Working Status */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white">오늘 출근?</h3>
                        <p className="text-xs text-gray-500">활성화하면 소개 탭에 노출됩니다</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isWorkingToday"
                            defaultChecked={staff?.isWorkingToday || false}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                </div>

                {/* Additional Images (Gallery) */}
                <div className="space-y-4 pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-white">추가 사진 (갤러리)</h3>

                    {/* Existing Images List */}
                    {staff?.images && staff.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {staff.images.map((img: any) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-800">
                                    <img src={img.url} alt="Staff Gallery" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <DeleteImageButton imageId={img.id} staffId={staff!.id} storeId={id} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Check if images is undefined/null and show empty message if needed, though map handles empty array fine */}

                    {/* Multi-upload Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">사진 추가 (여러 장 가능)</label>
                        <input
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        <p className="text-[10px] text-gray-500">여러 장을 한 번에 선택할 수 있습니다.</p>
                    </div>
                </div>
                {/* Video 
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">짧은 영상</label>
                    <input type="hidden" name="videoUrl" value={staff?.videoUrl || ''} />
                    <input
                        type="file"
                        name="videoFile"
                        accept="video/*"
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700"
                    />
                    <p className="text-[10px] text-gray-500">지원 형식: MP4, WebM</p>
                </div>
                */}
                <SubmitButton
                    text={isNew ? '프로필 생성' : '프로필 수정'}
                    loadingText={isNew ? '생성 중...' : '수정 중...'}
                />
            </form>

            {!isNew && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <DeleteButton
                        entityName="직원"
                        onDelete={deleteStaff.bind(null, staff!.id, id)}
                    />
                </div>
            )}
        </div>
    );
}
